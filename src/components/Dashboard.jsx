import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Layout,
    Printer,
    Camera,
    Search,
    ChevronRight,
    ChevronDown,
    Loader2,
    Eye,
    PlusCircle,
    Download,
    RefreshCw,
    Database,
    X,
    Maximize2,
    Minimize2,
    Send,
    Lightbulb,
    CheckCircle,
    Star,
    LayoutGrid,
    Droplets,
    Building2,
    Home,
    Aperture,
    Zap,
    Store,
    FileSpreadsheet,
    Code,
    Package,
    FileText
} from 'lucide-react';
import { getProductsCatalog, loadInPage } from '../data/supabaseData';
import InPagePreview from './InPagePreview';
import { generateExcel } from '../utils/excelGenerator';
import { generateZip } from '../utils/zipGenerator';
import { generateHitesPackZip, generateHitesHtmlZip } from '../utils/hitesZipGenerator';
import { generatePdfFromHtml } from '../utils/pdfGenerator';
import { BADGE_CONFIG, getProductBadge } from '../config/productBadges';
import { CATEGORIES, getProductSubcategory, filterBySubcategory } from '../config/productCategories';
import QuickAppMenu from './QuickAppMenu';

// Icon mapping for dynamic rendering
const IconMap = {
    Printer, Camera, LayoutGrid, Droplets, Building2, Home, Aperture, Zap,
    Send, Lightbulb, CheckCircle, Star, Store
};

/**
 * Dashboard Component
 * Consolidates "Drive Catalog" and "History" into a unified home view.
 * Now powered by Supabase with expandable categories!
 */
const Dashboard = ({ onLoadProduct, onImportFolder }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedItem, setSelectedItem] = useState(null);
    const [loadingItem, setLoadingItem] = useState(false);
    const [generatingPack, setGeneratingPack] = useState(false);
    const [previewExpanded, setPreviewExpanded] = useState(false);
    
    // Pack dropdown state
    const [showPackMenu, setShowPackMenu] = useState(false);
    const [packType, setPackType] = useState(null); // 'falabella' | 'hites-excel' | 'hites-html'
    const packMenuRef = useRef(null);
    
    // Supabase data state
    const [products, setProducts] = useState([]);
    const [loadingCatalog, setLoadingCatalog] = useState(true);
    const [catalogError, setCatalogError] = useState(null);

    // Expandable categories state
    const [expandedCategories, setExpandedCategories] = useState({
        printers: true,
        cameras: true
    });
    const [selectedSubcategory, setSelectedSubcategory] = useState({
        printers: 'all',
        cameras: 'all'
    });

    // Close pack menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (packMenuRef.current && !packMenuRef.current.contains(event.target)) {
                setShowPackMenu(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Load products from Supabase on mount
    useEffect(() => {
        loadCatalog();
    }, []);

    const loadCatalog = async () => {
        setLoadingCatalog(true);
        setCatalogError(null);
        try {
            const data = await getProductsCatalog();
            setProducts(data);
        } catch (error) {
            console.error('Error loading catalog:', error);
            setCatalogError(error.message);
        } finally {
            setLoadingCatalog(false);
        }
    };

    // Toggle category expansion
    const toggleCategory = (categoryKey) => {
        setExpandedCategories(prev => ({
            ...prev,
            [categoryKey]: !prev[categoryKey]
        }));
    };

    // Select subcategory
    const selectSubcategory = (categoryKey, subcatId) => {
        setSelectedSubcategory(prev => ({
            ...prev,
            [categoryKey]: subcatId
        }));
    };

    // Get filtered products by category and subcategory
    const getFilteredProducts = (categoryKey) => {
        const categoryMapping = categoryKey === 'printers' ? 'Printers' : 'Photo';
        let items = products.filter(p => p.category === categoryMapping);
        
        // Filter by search
        if (searchTerm) {
            items = items.filter(item =>
                item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (item.sku && item.sku.includes(searchTerm))
            );
        }
        
        // Filter by subcategory
        const subcat = selectedSubcategory[categoryKey];
        if (subcat !== 'all') {
            items = items.filter(p => getProductSubcategory(p.id) === subcat);
        }
        
        return items;
    };

    // Handler when clicking a Catalog Item
    const handleCatalogClick = async (item) => {
        setLoadingItem(true);
        try {
            const loaded = await loadInPage(item);
            setSelectedItem({
                ...loaded,
                source: 'catalog'
            });
        } catch (error) {
            console.error(error);
            alert("Error al cargar el producto");
        } finally {
            setLoadingItem(false);
        }
    };

    // Handler to generate pack from selected item
    const handleGeneratePack = async (type = 'falabella') => {
        if (!selectedItem || !selectedItem.sku || !selectedItem.blocks?.length) {
            alert('No hay datos suficientes para generar el pack');
            return;
        }

        setGeneratingPack(true);
        setPackType(type);
        setShowPackMenu(false);
        
        try {
            switch (type) {
                case 'falabella':
                    // Pack Falabella v8 (Excel + Imágenes)
                    const excelBuffer = await generateExcel(selectedItem.sku, selectedItem.blocks);
                    await generateZip(selectedItem.sku, selectedItem.blocks, excelBuffer);
                    alert('¡Pack Falabella generado y descargado correctamente!');
                    break;
                    
                case 'hites-excel':
                    // Pack Hites (Excel Hites + Imágenes)
                    await generateHitesPackZip(selectedItem.sku, selectedItem.blocks, {
                        productName: selectedItem.name,
                        category: selectedItem.category === 'Printers' ? 'tecnologia' : 'tecnologia'
                    });
                    alert('¡Pack Hites (Excel) generado y descargado correctamente!');
                    break;
                    
                case 'hites-html':
                    // Pack Hites HTML
                    await generateHitesHtmlZip(selectedItem.sku, selectedItem.blocks, {
                        productName: selectedItem.name,
                        category: selectedItem.category === 'Printers' ? 'tecnologia' : 'tecnologia'
                    });
                    alert('¡Pack Hites (HTML) generado y descargado correctamente!');
                    break;
                    
                case 'pdf':
                    // Exportar como PDF para compartir
                    await generatePdfFromHtml(selectedItem);
                    // No mostramos alert porque se abre el diálogo de impresión
                    break;
                    
                default:
                    throw new Error('Tipo de pack no reconocido');
            }
        } catch (error) {
            console.error('Error generating pack:', error);
            alert(`Error al generar el pack: ${error.message}`);
        } finally {
            setGeneratingPack(false);
            setPackType(null);
        }
    };

    // Render badge icon
    const renderBadgeIcon = (badgeConfig) => {
        if (!badgeConfig) return null;
        const Icon = IconMap[badgeConfig.iconName];
        return Icon ? <Icon size={10} /> : null;
    };

    // Render subcategory icon
    const renderSubcatIcon = (iconName, size = 14) => {
        const Icon = IconMap[iconName];
        return Icon ? <Icon size={size} /> : null;
    };

    // Render category section
    const renderCategory = (categoryKey, categoryConfig) => {
        const isExpanded = expandedCategories[categoryKey];
        const items = getFilteredProducts(categoryKey);
        const totalItems = products.filter(p => p.category === (categoryKey === 'printers' ? 'Printers' : 'Photo')).length;
        const CategoryIcon = categoryKey === 'printers' ? Printer : Camera;

        return (
            <div key={categoryKey} className="mb-4">
                {/* Category Header - Clickable to expand */}
                <button
                    onClick={() => toggleCategory(categoryKey)}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-all duration-200 ${
                        isExpanded 
                            ? 'bg-gradient-to-r from-gray-100 to-gray-50 shadow-sm' 
                            : 'hover:bg-gray-50'
                    }`}
                >
                    <div className="flex items-center gap-2.5">
                        <div className={`p-2 rounded-lg bg-gradient-to-br ${categoryConfig.bgGradient} ${categoryConfig.textColor}`}>
                            <CategoryIcon size={16} />
                        </div>
                        <div className="text-left">
                            <span className="font-semibold text-gray-800 text-sm">{categoryConfig.name}</span>
                            <span className="text-[10px] text-gray-400 ml-2">({totalItems})</span>
                        </div>
                    </div>
                    <motion.div
                        animate={{ rotate: isExpanded ? 0 : -90 }}
                        transition={{ duration: 0.2 }}
                    >
                        <ChevronDown size={16} className="text-gray-400" />
                    </motion.div>
                </button>

                {/* Expanded Content */}
                <AnimatePresence>
                    {isExpanded && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="overflow-hidden"
                        >
                            {/* Subcategory Tabs */}
                            <div className="flex gap-1 px-2 py-2 overflow-x-auto">
                                {categoryConfig.subcategories.map(subcat => {
                                    const isActive = selectedSubcategory[categoryKey] === subcat.id;
                                    const subcatCount = subcat.id === 'all' 
                                        ? totalItems 
                                        : products.filter(p => 
                                            p.category === (categoryKey === 'printers' ? 'Printers' : 'Photo') && 
                                            getProductSubcategory(p.id) === subcat.id
                                          ).length;

                                    return (
                                        <button
                                            key={subcat.id}
                                            onClick={() => selectSubcategory(categoryKey, subcat.id)}
                                            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${
                                                isActive
                                                    ? `bg-${categoryConfig.color}-100 text-${categoryConfig.color}-700 shadow-sm`
                                                    : 'text-gray-500 hover:bg-gray-100 hover:text-gray-700'
                                            }`}
                                            style={isActive ? {
                                                backgroundColor: categoryKey === 'printers' ? '#ffedd5' : '#ede9fe',
                                                color: categoryKey === 'printers' ? '#c2410c' : '#6d28d9'
                                            } : {}}
                                        >
                                            {renderSubcatIcon(subcat.icon, 12)}
                                            <span>{subcat.name}</span>
                                            <span className="text-[10px] opacity-60">({subcatCount})</span>
                                        </button>
                                    );
                                })}
                            </div>

                            {/* Products List */}
                            <div className="space-y-1.5 px-2 pb-2">
                                {items.length === 0 ? (
                                    <div className="text-center py-6 text-gray-400 text-xs">
                                        No hay productos en esta categoría
                                    </div>
                                ) : (
                                    items.map(item => {
                                        const badge = getProductBadge(item.id, item.badges);
                                        const badgeConfig = badge ? BADGE_CONFIG[badge] : null;
                                        
                                        return (
                                            <div
                                                key={item.id}
                                                onClick={() => handleCatalogClick(item)}
                                                className={`group bg-white p-2.5 rounded-xl border transition-all duration-200 cursor-pointer flex items-center gap-2.5 ${
                                                    selectedItem?.id === item.id 
                                                        ? 'border-blue-500 bg-blue-50/50 shadow-lg shadow-blue-500/10 ring-2 ring-blue-500/20' 
                                                        : 'border-gray-100 hover:border-gray-200 hover:shadow-md hover:-translate-y-0.5'
                                                }`}
                                            >
                                                <div className={`p-2 rounded-lg flex-shrink-0 transition-transform duration-200 group-hover:scale-110 bg-gradient-to-br ${categoryConfig.bgGradient} ${categoryConfig.textColor}`}>
                                                    <CategoryIcon size={14} />
                                                </div>
                                                <div className="min-w-0 flex-1">
                                                    <div className="flex items-center gap-1.5">
                                                        <h4 className="font-semibold text-gray-800 text-sm truncate group-hover:text-blue-600 transition-colors">
                                                            {item.name}
                                                        </h4>
                                                        {badgeConfig && (
                                                            <span 
                                                                className={`flex-shrink-0 inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-semibold ${badgeConfig.bgClass} ${badgeConfig.textClass}`}
                                                                title={badgeConfig.label}
                                                            >
                                                                {renderBadgeIcon(badgeConfig)}
                                                                <span>{badgeConfig.shortLabel}</span>
                                                            </span>
                                                        )}
                                                    </div>
                                                    <p className="text-[10px] text-gray-400 font-mono truncate mt-0.5">
                                                        {item.sku || 'Sin SKU'}
                                                    </p>
                                                </div>
                                                {selectedItem?.id === item.id && (
                                                    <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex-shrink-0 animate-pulse"></div>
                                                )}
                                            </div>
                                        );
                                    })
                                )}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        );
    };

    return (
        <div className="flex h-[calc(100vh-64px-56px)] bg-transparent overflow-hidden">
            {/* SIDEBAR - Siempre visible */}
            <div className="w-56 bg-white/80 backdrop-blur-sm border-r border-gray-200/50 flex flex-col flex-shrink-0">
                <div className="p-4">
                    <h2 className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-3">Navegación</h2>
                    <nav className="space-y-1">
                        <div className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/25">
                            <Layout size={16} />
                            Catálogo Canon
                        </div>
                    </nav>
                </div>

                {/* Supabase Status */}
                <div className="mx-4 px-3 py-2.5 rounded-xl bg-emerald-50 border border-emerald-100">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-xs text-emerald-700 font-medium">
                            <Database size={12} />
                            <span>Supabase</span>
                            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
                        </div>
                        <button
                            onClick={loadCatalog}
                            disabled={loadingCatalog}
                            className="p-1 hover:bg-emerald-100 rounded-lg transition-colors"
                            title="Recargar catálogo"
                        >
                            <RefreshCw size={12} className={`text-emerald-600 ${loadingCatalog ? 'animate-spin' : ''}`} />
                        </button>
                    </div>
                    <div className="text-[10px] text-emerald-600 mt-1 font-medium">
                        {products.length} productos sincronizados
                    </div>
                </div>

                <div className="mt-auto p-4 border-t border-gray-100">
                    <button
                        onClick={() => onLoadProduct({ empty: true })}
                        className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-4 py-2.5 rounded-xl text-sm font-medium transition-all shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30 active:scale-[0.98]"
                    >
                        <PlusCircle size={16} />
                        Crear Nuevo
                    </button>
                </div>
            </div>

            {/* CATALOG LIST - Expandable Categories */}
            <div className={`flex flex-col min-w-0 bg-white/40 backdrop-blur-sm border-r border-gray-200/50 transition-all duration-300 ${
                selectedItem 
                    ? previewExpanded ? 'w-0 overflow-hidden' : 'w-80 flex-shrink-0' 
                    : 'flex-1 max-w-md'
            }`}>
                {/* Search Header */}
                <div className="p-4 border-b border-gray-200/50 bg-white/60 backdrop-blur-sm sticky top-0 z-10">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                        <input
                            type="text"
                            placeholder="Buscar producto..."
                            className="w-full pl-9 pr-4 py-2.5 bg-gray-100 border-transparent focus:bg-white focus:ring-2 focus:ring-blue-500 rounded-lg transition-all outline-none text-sm"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                {/* Content Area */}
                <div className="flex-1 overflow-y-auto p-3 scroll-smooth">
                    {/* Loading State */}
                    {loadingCatalog && (
                        <div className="flex flex-col items-center justify-center py-20">
                            <Loader2 className="animate-spin text-blue-500 mb-4" size={32} />
                            <p className="text-gray-500 text-sm">Cargando catálogo...</p>
                        </div>
                    )}

                    {/* Error State */}
                    {catalogError && !loadingCatalog && (
                        <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-center">
                            <p className="text-red-600 font-medium text-sm mb-2">Error al cargar</p>
                            <button
                                onClick={loadCatalog}
                                className="px-3 py-1.5 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg text-xs font-medium transition-colors"
                            >
                                Reintentar
                            </button>
                        </div>
                    )}

                    {/* Expandable Categories */}
                    {!loadingCatalog && !catalogError && (
                        <div>
                            {renderCategory('printers', CATEGORIES.printers)}
                            {renderCategory('cameras', CATEGORIES.cameras)}
                        </div>
                    )}
                </div>
            </div>

            {/* PREVIEW PANEL - Integrado en el layout */}
            <AnimatePresence mode='wait'>
                {selectedItem && (
                    <motion.div
                        initial={{ opacity: 0, width: 0 }}
                        animate={{ opacity: 1, width: previewExpanded ? '100%' : 'auto' }}
                        exit={{ opacity: 0, width: 0 }}
                        transition={{ duration: 0.2 }}
                        className="flex-1 flex flex-col min-w-0 bg-white/80 backdrop-blur-sm"
                    >
                        {/* Preview Header */}
                        <div className="px-4 py-3 border-b border-gray-200/50 flex items-center justify-between bg-white/60 backdrop-blur-sm flex-shrink-0 relative z-[100]">
                            <div className="flex items-center gap-3 min-w-0">
                                <button
                                    onClick={() => setSelectedItem(null)}
                                    className="p-2 hover:bg-gray-100 rounded-xl transition-all hover:scale-105 flex-shrink-0"
                                    title="Cerrar preview"
                                >
                                    <X size={16} className="text-gray-500" />
                                </button>
                                <div className="min-w-0">
                                    <h3 className="text-base font-bold text-gray-800 truncate">
                                        {selectedItem.name || `SKU: ${selectedItem.sku}`}
                                    </h3>
                                    <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                                        <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold bg-emerald-100 text-emerald-700">
                                            Catálogo
                                        </span>
                                        {(() => {
                                            const previewBadge = getProductBadge(selectedItem.id, selectedItem.badges);
                                            const previewBadgeConfig = previewBadge ? BADGE_CONFIG[previewBadge] : null;
                                            return previewBadgeConfig ? (
                                                <span className={`inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full font-semibold ${previewBadgeConfig.bgClass} ${previewBadgeConfig.textClass}`}>
                                                    {renderBadgeIcon(previewBadgeConfig)}
                                                    <span>{previewBadgeConfig.shortLabel}</span>
                                                </span>
                                            ) : null;
                                        })()}
                                        <span className="text-[10px] text-gray-400 font-medium">
                                            {selectedItem.blocks?.length || 0} bloques
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 flex-shrink-0">
                                <button
                                    onClick={() => setPreviewExpanded(!previewExpanded)}
                                    className="p-2 hover:bg-gray-100 rounded-xl transition-all text-gray-500 hover:text-gray-700"
                                    title={previewExpanded ? "Reducir" : "Expandir"}
                                >
                                    {previewExpanded ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
                                </button>
                                
                                {/* Pack Dropdown Button */}
                                <div className="relative z-[9999]" ref={packMenuRef}>
                                    <button
                                        onClick={() => setShowPackMenu(!showPackMenu)}
                                        disabled={generatingPack || !selectedItem.sku || !selectedItem.blocks?.length}
                                        className="px-3 py-2 text-xs font-semibold text-white bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 rounded-xl transition-all flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-emerald-500/25 hover:shadow-xl hover:shadow-emerald-500/30"
                                    >
                                        {generatingPack ? (
                                            <>
                                                <Loader2 size={14} className="animate-spin" />
                                                <span>Generando...</span>
                                            </>
                                        ) : (
                                            <>
                                                <Package size={14} />
                                                <span>Pack</span>
                                                <ChevronDown size={12} className={`transition-transform ${showPackMenu ? 'rotate-180' : ''}`} />
                                            </>
                                        )}
                                    </button>
                                    
                                    {/* Dropdown Menu */}
                                    <AnimatePresence>
                                        {showPackMenu && !generatingPack && (
                                            <motion.div
                                                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                                                transition={{ duration: 0.15 }}
                                                className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden z-[9999]"
                                            >
                                                <div className="p-1.5">
                                                    {/* Falabella Option */}
                                                    <button
                                                        onClick={() => handleGeneratePack('falabella')}
                                                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-emerald-50 transition-colors group"
                                                    >
                                                        <div className="p-2 bg-emerald-100 rounded-lg group-hover:bg-emerald-200 transition-colors">
                                                            <FileSpreadsheet size={16} className="text-emerald-600" />
                                                        </div>
                                                        <div className="text-left">
                                                            <div className="text-sm font-semibold text-gray-800">Falabella v8</div>
                                                            <div className="text-[10px] text-gray-500">Excel + Imágenes ZIP</div>
                                                        </div>
                                                    </button>
                                                    
                                                    <div className="h-px bg-gray-100 my-1.5"></div>
                                                    <div className="px-3 py-1">
                                                        <span className="text-[9px] font-semibold text-gray-400 uppercase tracking-wider">Hites</span>
                                                    </div>
                                                    
                                                    {/* Hites Excel Option */}
                                                    <button
                                                        onClick={() => handleGeneratePack('hites-excel')}
                                                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-rose-50 transition-colors group"
                                                    >
                                                        <div className="p-2 bg-rose-100 rounded-lg group-hover:bg-rose-200 transition-colors">
                                                            <FileSpreadsheet size={16} className="text-rose-600" />
                                                        </div>
                                                        <div className="text-left">
                                                            <div className="text-sm font-semibold text-gray-800">Hites Pack</div>
                                                            <div className="text-[10px] text-gray-500">Excel Hites + Imágenes 1000px</div>
                                                        </div>
                                                    </button>
                                                    
                                                    {/* Hites HTML Option */}
                                                    <button
                                                        onClick={() => handleGeneratePack('hites-html')}
                                                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-rose-50 transition-colors group"
                                                    >
                                                        <div className="p-2 bg-rose-100 rounded-lg group-hover:bg-rose-200 transition-colors">
                                                            <Code size={16} className="text-rose-600" />
                                                        </div>
                                                        <div className="text-left">
                                                            <div className="text-sm font-semibold text-gray-800">Hites HTML</div>
                                                            <div className="text-[10px] text-gray-500">HTML listo + Imágenes 1000px</div>
                                                        </div>
                                                    </button>
                                                    
                                                    <div className="h-px bg-gray-100 my-1.5"></div>
                                                    <div className="px-3 py-1">
                                                        <span className="text-[9px] font-semibold text-gray-400 uppercase tracking-wider">Compartir</span>
                                                    </div>
                                                    
                                                    {/* Export PDF Option */}
                                                    <button
                                                        onClick={() => handleGeneratePack('pdf')}
                                                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-blue-50 transition-colors group"
                                                    >
                                                        <div className="p-2 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors">
                                                            <FileText size={16} className="text-blue-600" />
                                                        </div>
                                                        <div className="text-left">
                                                            <div className="text-sm font-semibold text-gray-800">Exportar PDF</div>
                                                            <div className="text-[10px] text-gray-500">Vista previa para compartir</div>
                                                        </div>
                                                    </button>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                                
                                <button
                                    onClick={() => onLoadProduct(selectedItem)}
                                    className="px-3 py-2 text-xs font-semibold text-white bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 rounded-xl transition-all flex items-center gap-1.5 shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30"
                                >
                                    <Eye size={14} />
                                    Editar
                                </button>
                            </div>
                        </div>

                        {/* Quick Navigation - Mini thumbnails */}
                        <div className="px-4 py-2.5 border-b border-gray-200/50 bg-gray-50/50 flex items-center gap-2 overflow-x-auto flex-shrink-0">
                            <span className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider flex-shrink-0">Productos:</span>
                            {products.slice(0, 12).map(item => (
                                <button
                                    key={item.id}
                                    onClick={() => handleCatalogClick(item)}
                                    className={`px-2.5 py-1 text-[10px] font-medium rounded-lg transition-all flex-shrink-0 ${
                                        selectedItem?.id === item.id
                                            ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-md'
                                            : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200 hover:border-gray-300'
                                    }`}
                                    title={item.name}
                                >
                                    {item.name.split(' ').slice(0, 2).join(' ')}
                                </button>
                            ))}
                            {products.length > 12 && (
                                <span className="text-xs text-gray-400 flex-shrink-0">+{products.length - 12} más</span>
                            )}
                        </div>

                        {/* Preview Content */}
                        <div className="flex-1 overflow-y-auto bg-gradient-to-br from-gray-50 to-gray-100 p-6">
                            <div className="bg-white rounded-2xl shadow-xl shadow-gray-200/50 overflow-hidden border border-gray-200/50 mx-auto max-w-4xl">
                                <div className="bg-gradient-to-r from-slate-800 via-slate-900 to-slate-800 px-5 py-3 text-sm font-medium text-white flex justify-between items-center">
                                    <span className="flex items-center gap-2">
                                        <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                                        Vista Previa InPage
                                    </span>
                                    <span className="text-xs text-slate-400 font-mono bg-slate-700/50 px-2 py-0.5 rounded">SKU: {selectedItem.sku || 'N/A'}</span>
                                </div>
                                <InPagePreview
                                    sku={selectedItem.sku}
                                    blocks={selectedItem.blocks}
                                    imageMap={selectedItem.imageMap}
                                    baseImagePath={selectedItem.imagePath}
                                />
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Empty State when no preview */}
            {!selectedItem && !loadingCatalog && products.length > 0 && (
                <div className="hidden lg:flex flex-1 items-center justify-center bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100">
                    <div className="text-center">
                        <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-3xl flex items-center justify-center mx-auto mb-5 shadow-lg shadow-gray-200/50">
                            <Eye size={32} className="text-gray-400" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-300 mb-2">Sin Selección</h3>
                        <p className="text-sm text-gray-400 max-w-[200px] mx-auto leading-relaxed">
                            Selecciona un producto del catálogo para ver su vista previa
                        </p>
                    </div>
                </div>
            )}

            {/* Loading Overlay */}
            {loadingItem && (
                <div className="absolute inset-0 bg-white/60 backdrop-blur-md z-40 flex items-center justify-center">
                    <div className="flex flex-col items-center gap-4 bg-white/80 px-8 py-6 rounded-2xl shadow-2xl">
                        <Loader2 className="animate-spin text-blue-600" size={36} />
                        <p className="text-sm font-semibold text-gray-700">Cargando producto...</p>
                    </div>
                </div>
            )}
            
            {/* Quick App Menu */}
            <QuickAppMenu />
        </div>
    );
};

export default Dashboard;
