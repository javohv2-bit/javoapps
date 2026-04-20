import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Tag,
    Calendar,
    FileText,
    Link2,
    Download,
    Copy,
    Check,
    AlertCircle,
    CheckCircle,
    Search,
    Trash2,
    ExternalLink,
    Home,
    Database,
    RefreshCw,
    ChevronDown,
    ChevronUp,
    Loader2,
    X,
    Sparkles,
    Zap,
    Plus,
    GripVertical,
    ArrowUp,
    ArrowDown,
    Settings
} from 'lucide-react';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { getProducts, upsertProduct, deleteProduct, getStats } from '../data/marcajesData';
import QuickAppMenu from '../components/QuickAppMenu';

/**
 * Marcajes App - Generador de URLs con UTM
 * 
 * Design: Dark futuristic with aurora animated background
 * Matches Landing Page design system
 * Accent: Emerald/Teal
 */

// Componente para input de producto faltante con botón de guardar
const MissingProductInput = ({ product, onSave }) => {
    const [url, setUrl] = useState('');
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState(null);
    const inputRef = useRef(null);

    const handleSave = async () => {
        if (!url.trim()) return;
        setIsSaving(true);
        setError(null);
        const result = await onSave(product.name, url.trim());
        setIsSaving(false);
        if (!result.success) {
            setError(result.error || 'Error al guardar');
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && url.trim()) {
            e.preventDefault();
            handleSave();
        }
    };

    return (
        <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-amber-200 w-36 truncate" title={product.name}>
                    {product.name}
                </span>
                <div className="flex-1 flex gap-2">
                    <input
                        ref={inputRef}
                        type="text"
                        placeholder="https://..."
                        value={url}
                        onChange={(e) => { setUrl(e.target.value); setError(null); }}
                        onKeyDown={handleKeyDown}
                        className="flex-1 px-3 py-2 text-xs rounded-lg bg-black/20 border border-amber-500/30 text-white placeholder-white/30 focus:border-amber-400 outline-none"
                    />
                    <button
                        onClick={handleSave}
                        disabled={!url.trim() || isSaving}
                        className="px-3 py-2 text-xs rounded-lg bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/30 text-amber-300 transition-all disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                    >
                        {isSaving ? 'Guardando...' : 'Guardar ↵'}
                    </button>
                </div>
            </div>
            {error && (
                <div className="text-xs text-red-400" style={{ marginLeft: '152px' }}>
                    ⚠️ {error}
                </div>
            )}
        </div>
    );
};

const MarcajesMaker = () => {
    const navigate = useNavigate();
    const canvasRef = useRef(null);
    
    // State
    const [productsDb, setProductsDb] = useState({});
    const [campaignName, setCampaignName] = useState('');
    const [campaignDate, setCampaignDate] = useState('');
    const [inputText, setInputText] = useState('');
    const [results, setResults] = useState([]);
    const [missingProducts, setMissingProducts] = useState([]);
    const [copied, setCopied] = useState(false);
    const [loading, setLoading] = useState(true);
    const [generating, setGenerating] = useState(false);
    const [showDatabase, setShowDatabase] = useState(false);
    const [searchDb, setSearchDb] = useState('');
    const [stats, setStats] = useState({ totalProducts: 0 });
    const [marcajeBase, setMarcajeBase] = useState('ecommerce');
    const [customMarcaje, setCustomMarcaje] = useState('');
    const [additionalRows, setAdditionalRows] = useState([]);
    const [newCustomItem, setNewCustomItem] = useState('');

    const inputRef = useRef(null);

    // Elementos adicionales predefinidos con sus URLs base
    const predefinedItems = {
        'Logon Canon Header': 'https://www.canontiendaonline.cl/es-CL/canon-chile',
        'Banner Principal': 'https://www.canontiendaonline.cl/es_cl/p/eos-r8-rf-24-50mm-f-4-5-6-3-is-stm',
        'Lentes Descuento': 'https://www.canontiendaonline.cl/es_cl/lentes-y-binoculares',
        'Suministros (Tintas)': 'https://www.canontiendaonline.cl/es_cl/catalog/category/view/s/tinta/id/36/',
        'Facebook': 'https://www.facebook.com/canonchile',
        'Twitter': 'https://twitter.com/canonchile',
        'Youtube': 'https://www.youtube.com/user/CanonChile',
        'Linkedin': 'https://www.linkedin.com/company/canonproprintcl',
        'Newsletter': 'https://cloud.latam.cla.canon.com/newsletter_cl_v2'
    };

    useEffect(() => {
        loadProducts();
    }, []);

    // Aurora gradient background animation
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        let animationId;
        let time = 0;

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        resize();
        window.addEventListener('resize', resize);

        const animate = () => {
            time += 0.004;
            
            // Dark base
            ctx.fillStyle = '#0a0a0f';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            // === BLOB 1: Bottom center - cyan/indigo (moves horizontally) ===
            const blob1X = canvas.width * (0.5 + Math.sin(time * 0.8) * 0.25);
            const blob1Y = canvas.height * (0.78 + Math.cos(time * 0.5) * 0.05);
            const grad1 = ctx.createRadialGradient(blob1X, blob1Y, 0, blob1X, blob1Y, canvas.width * 0.5);
            grad1.addColorStop(0, 'rgba(56, 189, 248, 0.15)');
            grad1.addColorStop(0.4, 'rgba(99, 102, 241, 0.08)');
            grad1.addColorStop(1, 'transparent');
            ctx.fillStyle = grad1;
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            // === BLOB 2: Top right - purple/pink (moves diagonally) ===
            const blob2X = canvas.width * (0.75 + Math.cos(time * 0.6) * 0.15);
            const blob2Y = canvas.height * (0.25 + Math.sin(time * 0.9) * 0.12);
            const grad2 = ctx.createRadialGradient(blob2X, blob2Y, 0, blob2X, blob2Y, canvas.width * 0.4);
            grad2.addColorStop(0, 'rgba(168, 85, 247, 0.10)');
            grad2.addColorStop(0.5, 'rgba(236, 72, 153, 0.05)');
            grad2.addColorStop(1, 'transparent');
            ctx.fillStyle = grad2;
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            // === BLOB 3: Left side - teal/emerald (moves vertically) ===
            const blob3X = canvas.width * (0.2 + Math.sin(time * 0.4) * 0.08);
            const blob3Y = canvas.height * (0.55 + Math.cos(time * 0.7) * 0.2);
            const grad3 = ctx.createRadialGradient(blob3X, blob3Y, 0, blob3X, blob3Y, canvas.width * 0.35);
            grad3.addColorStop(0, 'rgba(20, 184, 166, 0.08)');
            grad3.addColorStop(0.5, 'rgba(16, 185, 129, 0.04)');
            grad3.addColorStop(1, 'transparent');
            ctx.fillStyle = grad3;
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            // === BLOB 4: Bottom left - amber/orange (slow circular motion) ===
            const blob4X = canvas.width * (0.3 + Math.cos(time * 0.35) * 0.12);
            const blob4Y = canvas.height * (0.85 + Math.sin(time * 0.35) * 0.08);
            const grad4 = ctx.createRadialGradient(blob4X, blob4Y, 0, blob4X, blob4Y, canvas.width * 0.3);
            grad4.addColorStop(0, 'rgba(251, 191, 36, 0.06)');
            grad4.addColorStop(0.5, 'rgba(249, 115, 22, 0.03)');
            grad4.addColorStop(1, 'transparent');
            ctx.fillStyle = grad4;
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            // === BLOB 5: Top center - blue/cyan (breathing effect) ===
            const blob5Scale = 1 + Math.sin(time * 0.5) * 0.15;
            const blob5X = canvas.width * (0.55 + Math.cos(time * 0.25) * 0.1);
            const blob5Y = canvas.height * (0.15 + Math.sin(time * 0.3) * 0.05);
            const grad5 = ctx.createRadialGradient(blob5X, blob5Y, 0, blob5X, blob5Y, canvas.width * 0.3 * blob5Scale);
            grad5.addColorStop(0, 'rgba(59, 130, 246, 0.08)');
            grad5.addColorStop(0.6, 'rgba(34, 211, 238, 0.04)');
            grad5.addColorStop(1, 'transparent');
            ctx.fillStyle = grad5;
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            animationId = requestAnimationFrame(animate);
        };
        
        animate();
        
        return () => {
            cancelAnimationFrame(animationId);
            window.removeEventListener('resize', resize);
        };
    }, []);

    const loadProducts = async () => {
        setLoading(true);
        try {
            const products = await getProducts();
            setProductsDb(products);
            const statsData = await getStats();
            setStats(statsData);
        } catch (error) {
            console.error('Error loading products:', error);
        } finally {
            setLoading(false);
        }
    };

    const normalizedDb = useMemo(() => {
        const map = {};
        Object.keys(productsDb).forEach(key => {
            map[key.toLowerCase()] = productsDb[key];
        });
        return map;
    }, [productsDb]);

    const filteredDatabase = useMemo(() => {
        if (!searchDb) return Object.entries(productsDb);
        const search = searchDb.toLowerCase();
        return Object.entries(productsDb).filter(([name, url]) => 
            name.toLowerCase().includes(search) || url.toLowerCase().includes(search)
        );
    }, [productsDb, searchDb]);

    const getSlugFromUrl = (url) => {
        try {
            const cleanUrl = url.replace(/\/$/, '');
            const urlObj = new URL(cleanUrl);
            const pathSegments = urlObj.pathname.split('/').filter(Boolean);
            return pathSegments.length > 0 ? pathSegments[pathSegments.length - 1] : 'home';
        } catch (e) {
            return 'gen';
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return '';
        const [y, m, d] = dateString.split('-');
        return `${d}${m}${y.slice(2)}`;
    };

    const generateTags = () => {
        if (!campaignDate || !campaignName) {
            alert('Por favor ingresa fecha y nombre de campaña');
            return;
        }

        if (marcajeBase === 'custom' && !customMarcaje.trim()) {
            alert('Por favor ingresa el nombre personalizado del marcaje');
            return;
        }

        setGenerating(true);
        const lines = inputText.split('\n').filter(line => line.trim() !== '');
        const processed = [];
        const missing = [];
        const formattedDate = formatDate(campaignDate);
        
        // Determinar el marcaje a usar
        const finalMarcaje = marcajeBase === 'custom' ? customMarcaje : marcajeBase;

        lines.forEach(line => {
            let itemName = line.trim();
            let price = '';
            let normalPrice = '';

            if (line.includes('\t')) {
                const parts = line.split('\t');
                if (parts.length >= 2) {
                    const candidate = parts[1].trim();
                    if (candidate.toLowerCase() === 'producto' || candidate.toLowerCase() === 'product') return;
                    itemName = candidate;
                    if (parts.length > 5) price = parts[5].trim();
                    if (parts.length > 2) normalPrice = parts[2].trim();
                    if (!price && normalPrice) { price = normalPrice; normalPrice = ''; }
                }
            }

            const baseUrl = productsDb[itemName] || normalizedDb[itemName.toLowerCase()];

            if (baseUrl) {
                const slug = getSlugFromUrl(baseUrl);
                const tag = `?utm_source=salesforce&utm_medium=email&utm_campaign=${formattedDate}_${campaignName}_${finalMarcaje}&utm_content=${slug}_${finalMarcaje}`;
                processed.push({ name: itemName, url: `${baseUrl}${tag}`, status: 'ok', price, normalPrice });
            } else {
                processed.push({ name: itemName, url: '', status: 'missing', price, normalPrice });
                if (!missing.find(m => m.name === itemName)) missing.push({ name: itemName, url: '' });
            }
        });

        setResults(processed);
        setMissingProducts(missing);
        setGenerating(false);
    };

    const handleAddProduct = async (name, url) => {
        const result = await upsertProduct(name, url);
        if (result.success) {
            setProductsDb(prev => ({ ...prev, [name]: url }));
            setMissingProducts(prev => prev.filter(p => p.name !== name));
            setResults(prev => prev.map(item => {
                if (item.name === name && item.status === 'missing') {
                    const formattedDate = formatDate(campaignDate);
                    const finalMarcaje = marcajeBase === 'custom' ? customMarcaje : marcajeBase;
                    const slug = getSlugFromUrl(url);
                    const tag = `?utm_source=salesforce&utm_medium=email&utm_campaign=${formattedDate}_${campaignName}_${finalMarcaje}&utm_content=${slug}_${finalMarcaje}`;
                    return { ...item, url: `${url}${tag}`, status: 'ok' };
                }
                return item;
            }));
            // Actualizar stats
            const statsData = await getStats();
            setStats(statsData);
        }
        return result;
    };

    const handleDeleteProduct = async (name) => {
        if (!confirm(`¿Eliminar "${name}"?`)) return;
        const result = await deleteProduct(name);
        if (result.success) {
            setProductsDb(prev => { const newDb = { ...prev }; delete newDb[name]; return newDb; });
        }
    };

    const addAdditionalRow = (item, position = 'top') => {
        const formattedDate = formatDate(campaignDate);
        const finalMarcaje = marcajeBase === 'custom' ? customMarcaje : marcajeBase;
        
        // Buscar primero en la base de datos, luego en predefinidos
        let baseUrl = productsDb[item] || normalizedDb[item.toLowerCase()] || predefinedItems[item];
        
        let url = '';
        if (baseUrl) {
            const slug = getSlugFromUrl(baseUrl);
            const tag = `?utm_source=salesforce&utm_medium=email&utm_campaign=${formattedDate}_${campaignName}_${finalMarcaje}&utm_content=${slug.replace('dcto', 'sdcto')}_${finalMarcaje}`;
            url = `${baseUrl}${tag}`;
        }
        
        const newRow = {
            id: Date.now(),
            name: item,
            url: url,
            price: '',
            normalPrice: '',
            status: baseUrl ? 'ok' : 'additional',
            position: position,
            baseUrl: baseUrl
        };
        
        setAdditionalRows(prev => [...prev, newRow]);
    };

    const addCustomItem = (position = 'top') => {
        if (!newCustomItem.trim()) return;
        
        const formattedDate = formatDate(campaignDate);
        const finalMarcaje = marcajeBase === 'custom' ? customMarcaje : marcajeBase;
        
        // Buscar en la base de datos
        let baseUrl = productsDb[newCustomItem] || normalizedDb[newCustomItem.toLowerCase()];
        
        let url = '';
        if (baseUrl) {
            const slug = getSlugFromUrl(baseUrl);
            const tag = `?utm_source=salesforce&utm_medium=email&utm_campaign=${formattedDate}_${campaignName}_${finalMarcaje}&utm_content=${slug.replace('dcto', 'sdcto')}_${finalMarcaje}`;
            url = `${baseUrl}${tag}`;
        }
        
        const newRow = {
            id: Date.now(),
            name: newCustomItem.trim(),
            url: url,
            price: '',
            normalPrice: '',
            status: baseUrl ? 'ok' : 'additional',
            position: position,
            baseUrl: baseUrl
        };
        
        setAdditionalRows(prev => [...prev, newRow]);
        setNewCustomItem('');
    };

    const saveAdditionalRowToDb = async (row) => {
        if (!row.baseUrl) return;
        
        const result = await upsertProduct(row.name, row.baseUrl);
        if (result.success) {
            setProductsDb(prev => ({ ...prev, [row.name]: row.baseUrl }));
            // Actualizar las stats
            const statsData = await getStats();
            setStats(statsData);
        }
    };

    const removeAdditionalRow = (id) => {
        setAdditionalRows(prev => prev.filter(row => row.id !== id));
    };

    const moveAdditionalRow = (id, direction) => {
        setAdditionalRows(prev => {
            const index = prev.findIndex(row => row.id === id);
            if (index === -1) return prev;
            
            const newRows = [...prev];
            if (direction === 'up' && index > 0) {
                [newRows[index], newRows[index - 1]] = [newRows[index - 1], newRows[index]];
            } else if (direction === 'down' && index < newRows.length - 1) {
                [newRows[index], newRows[index + 1]] = [newRows[index + 1], newRows[index]];
            }
            return newRows;
        });
    };

    const updateAdditionalRowUrl = (id, newUrl) => {
        setAdditionalRows(prev => prev.map(row => {
            if (row.id === id) {
                const formattedDate = formatDate(campaignDate);
                const finalMarcaje = marcajeBase === 'custom' ? customMarcaje : marcajeBase;
                const slug = getSlugFromUrl(newUrl);
                const tag = `?utm_source=salesforce&utm_medium=email&utm_campaign=${formattedDate}_${campaignName}_${finalMarcaje}&utm_content=${slug}_${finalMarcaje}`;
                return { ...row, baseUrl: newUrl, url: `${newUrl}${tag}`, status: 'ok' };
            }
            return row;
        }));
    };

    const getCombinedResults = () => {
        const topRows = additionalRows.filter(r => r.position === 'top');
        const bottomRows = additionalRows.filter(r => r.position === 'bottom');
        return [...topRows, ...results, ...bottomRows];
    };

    const handleCopyTable = async () => {
        const combined = getCombinedResults();
        const rows = combined.map(r => [r.name, r.price || '', r.url]);
        const tsv = rows.map(row => row.join('\t')).join('\n');
        try {
            await navigator.clipboard.writeText(tsv);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            alert('No se pudo copiar');
        }
    };

    const downloadExcel = () => {
        const combined = getCombinedResults();
        const wsData = [['Item / Posición', 'URL Marcada'], ...combined.map(r => [r.name, r.url])];
        const wb = XLSX.utils.book_new();
        const ws = XLSX.utils.aoa_to_sheet(wsData);
        XLSX.utils.book_append_sheet(wb, ws, 'Marcajes');
        const fileName = `${campaignDate || 'date'}_${campaignName || 'campaign'}.xlsx`;
        const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
        saveAs(new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }), fileName);
    };

    const okCount = results.filter(r => r.status === 'ok').length;
    const missingCount = results.filter(r => r.status === 'missing').length;

    return (
        <div className="min-h-screen bg-[#0a0a0f] relative overflow-hidden">
            {/* Aurora animated background */}
            <canvas 
                ref={canvasRef} 
                className="absolute inset-0 z-0"
            />

            {/* Content */}
            <div className="relative z-10 flex flex-col min-h-screen">
                {/* Header - White background matching Landing Page */}
                <header className="bg-white px-6 py-3">
                    <div className="max-w-7xl mx-auto flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => navigate('/')}
                                className="p-2 rounded-lg hover:bg-black/5 transition-all cursor-pointer"
                            >
                                <Home size={18} className="text-black/40" />
                            </button>
                            <div className="h-5 w-px bg-black/10"></div>
                            <img src="/assets/logo-atlas.gif" alt="Atlas" className="h-5 w-auto" />
                            <div className="h-4 w-px bg-black/20"></div>
                            <span className="text-xs font-medium tracking-wider text-black/50">
                                MARCAJES APP
                            </span>
                        </div>
                        
                        <div className="flex items-center gap-3">
                            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-50 border border-emerald-200">
                                <Database size={14} className="text-emerald-600" />
                                <span className="text-xs font-medium text-emerald-700">
                                    {stats.totalProducts} productos
                                </span>
                            </div>
                            <button
                                onClick={loadProducts}
                                className="p-2 rounded-lg hover:bg-black/5 transition-all cursor-pointer"
                            >
                                <RefreshCw size={16} className={`text-black/40 ${loading ? 'animate-spin' : ''}`} />
                            </button>
                        </div>
                    </div>
                </header>

                {/* Main */}
                <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-8">
                    {loading ? (
                        <div className="flex items-center justify-center py-20">
                            <Loader2 size={32} className="animate-spin text-emerald-400" />
                        </div>
                    ) : (
                        <div className="grid lg:grid-cols-5 gap-8">
                            {/* Left Column */}
                            <div className="lg:col-span-2 space-y-6">
                                {/* Campaign Config */}
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="rounded-2xl bg-white/[0.03] backdrop-blur-xl border border-white/10 overflow-hidden"
                                >
                                    <div className="px-6 py-4 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 border-b border-white/5">
                                        <h2 className="text-base font-medium text-white flex items-center gap-2">
                                            <Sparkles size={18} className="text-emerald-400" />
                                            Configuración
                                        </h2>
                                    </div>
                                    
                                    <div className="p-6 space-y-5">
                                        <div>
                                            <label className="block text-xs font-medium text-white/50 mb-2">
                                                <Calendar size={14} className="inline mr-2 text-emerald-400" />
                                                Fecha de Campaña
                                            </label>
                                            <input
                                                type="date"
                                                value={campaignDate}
                                                onChange={(e) => setCampaignDate(e.target.value)}
                                                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20 transition-all outline-none"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-xs font-medium text-white/50 mb-2">
                                                <Tag size={14} className="inline mr-2 text-emerald-400" />
                                                Nombre de Campaña
                                            </label>
                                            <input
                                                type="text"
                                                placeholder="ej: SummerClick1"
                                                value={campaignName}
                                                onChange={(e) => setCampaignName(e.target.value)}
                                                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20 transition-all outline-none"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-xs font-medium text-white/50 mb-2">
                                                <Settings size={14} className="inline mr-2 text-emerald-400" />
                                                Base de Marcaje
                                            </label>
                                            <select
                                                value={marcajeBase}
                                                onChange={(e) => setMarcajeBase(e.target.value)}
                                                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20 transition-all outline-none"
                                            >
                                                <option value="ecommerce">ecommerce</option>
                                                <option value="empresas">empresas</option>
                                                <option value="zoomin">zoomin</option>
                                                <option value="secanon">secanon</option>
                                                <option value="custom">Personalizado</option>
                                            </select>
                                            {marcajeBase === 'custom' && (
                                                <input
                                                    type="text"
                                                    placeholder="ej: invitados_evento, distribuidores, etc."
                                                    value={customMarcaje}
                                                    onChange={(e) => setCustomMarcaje(e.target.value)}
                                                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-emerald-500/30 text-white placeholder-white/30 focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20 transition-all outline-none mt-2"
                                                />
                                            )}
                                        </div>

                                        <div>
                                            <label className="block text-xs font-medium text-white/50 mb-2">
                                                <FileText size={14} className="inline mr-2 text-emerald-400" />
                                                Lista de Productos
                                            </label>
                                            <textarea
                                                ref={inputRef}
                                                rows={8}
                                                placeholder="Pega aquí la lista de productos..."
                                                value={inputText}
                                                onChange={(e) => setInputText(e.target.value)}
                                                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20 transition-all outline-none font-mono text-sm resize-none"
                                            />
                                        </div>

                                        <button
                                            onClick={generateTags}
                                            disabled={generating || !inputText.trim() || (marcajeBase === 'custom' && !customMarcaje.trim())}
                                            className="w-full py-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-emerald-500/25"
                                        >
                                            {generating ? (
                                                <><Loader2 size={18} className="animate-spin" /> Generando...</>
                                            ) : (
                                                <><Link2 size={18} /> Generar URLs</>
                                            )}
                                        </button>
                                    </div>
                                </motion.div>

                                {/* Database */}
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.1 }}
                                    className="rounded-2xl bg-white/[0.03] backdrop-blur-xl border border-white/10 overflow-hidden"
                                >
                                    <button
                                        onClick={() => setShowDatabase(!showDatabase)}
                                        className="w-full px-6 py-4 flex items-center justify-between hover:bg-white/[0.02] transition-colors cursor-pointer"
                                    >
                                        <div className="flex items-center gap-3">
                                            <Database size={18} className="text-emerald-400" />
                                            <span className="font-medium text-white">Base de Datos ({Object.keys(productsDb).length})</span>
                                        </div>
                                        {showDatabase ? <ChevronUp size={18} className="text-white/40" /> : <ChevronDown size={18} className="text-white/40" />}
                                    </button>
                                    
                                    <AnimatePresence>
                                        {showDatabase && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: 'auto', opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                className="border-t border-white/5"
                                            >
                                                <div className="p-4">
                                                    <div className="relative mb-4">
                                                        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
                                                        <input
                                                            type="text"
                                                            placeholder="Buscar..."
                                                            value={searchDb}
                                                            onChange={(e) => setSearchDb(e.target.value)}
                                                            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 text-sm focus:border-emerald-500/50 outline-none"
                                                        />
                                                    </div>
                                                    <div className="max-h-64 overflow-y-auto space-y-1">
                                                        {filteredDatabase.slice(0, 50).map(([name, url]) => (
                                                            <div key={name} className="flex items-center justify-between p-2.5 hover:bg-white/5 rounded-lg group">
                                                                <div className="flex-1 min-w-0 mr-3">
                                                                    <p className="text-sm font-medium text-white/80 truncate">{name}</p>
                                                                    <p className="text-xs text-white/30 truncate">{url}</p>
                                                                </div>
                                                                <button
                                                                    onClick={() => handleDeleteProduct(name)}
                                                                    className="p-1.5 text-white/20 hover:text-red-400 hover:bg-red-500/10 rounded-lg opacity-0 group-hover:opacity-100 transition-all cursor-pointer"
                                                                >
                                                                    <Trash2 size={14} />
                                                                </button>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </motion.div>
                            </div>

                            {/* Right Column - Results */}
                            <div className="lg:col-span-3">
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.2 }}
                                    className="rounded-2xl bg-white/[0.03] backdrop-blur-xl border border-white/10 overflow-hidden"
                                >
                                    <div className="px-6 py-4 bg-gradient-to-r from-slate-500/10 to-slate-600/10 border-b border-white/5 flex items-center justify-between">
                                        <h2 className="text-base font-medium text-white flex items-center gap-2">
                                            <Zap size={18} className="text-amber-400" />
                                            Resultados
                                        </h2>
                                        {results.length > 0 && (
                                            <div className="flex items-center gap-2">
                                                <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold">
                                                    {okCount} OK
                                                </span>
                                                {missingCount > 0 && (
                                                    <span className="px-3 py-1 rounded-full bg-red-500/20 text-red-300 text-xs font-semibold">
                                                        {missingCount} pendientes
                                                    </span>
                                                )}
                                            </div>
                                        )}
                                    </div>

                                    <div className="p-6">
                                        {/* Agregar Filas Adicionales */}
                                        {(results.length > 0 || additionalRows.length > 0) && (
                                            <div className="mb-6 space-y-3">
                                                <div className="flex items-center justify-between">
                                                    <h3 className="text-sm font-medium text-white/60 flex items-center gap-2">
                                                        <Plus size={16} className="text-emerald-400" />
                                                        Agregar Elementos
                                                    </h3>
                                                </div>
                                                
                                                {/* Input para elemento personalizado */}
                                                <div className="flex gap-2 mb-4">
                                                    <input
                                                        type="text"
                                                        placeholder="Nombre del nuevo elemento..."
                                                        value={newCustomItem}
                                                        onChange={(e) => setNewCustomItem(e.target.value)}
                                                        onKeyDown={(e) => e.key === 'Enter' && addCustomItem('top')}
                                                        className="flex-1 px-3 py-2 text-sm rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/30 focus:border-emerald-500/50 outline-none"
                                                    />
                                                    <button
                                                        onClick={() => addCustomItem('top')}
                                                        disabled={!newCustomItem.trim()}
                                                        className="px-4 py-2 text-sm rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/30 text-emerald-300 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                                                    >
                                                        <Plus size={16} />
                                                    </button>
                                                </div>
                                                
                                                <div className="grid grid-cols-2 gap-2">
                                                    <div className="space-y-2">
                                                        <p className="text-xs text-white/40 mb-2">Arriba de los productos:</p>
                                                        <button
                                                            onClick={() => addAdditionalRow('Logon Canon Header', 'top')}
                                                            className="w-full px-3 py-2 text-xs rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-white/70 transition-all cursor-pointer"
                                                        >
                                                            + Logo Canon Header
                                                        </button>
                                                        <button
                                                            onClick={() => addAdditionalRow('Banner Principal', 'top')}
                                                            className="w-full px-3 py-2 text-xs rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-white/70 transition-all cursor-pointer"
                                                        >
                                                            + Banner Principal
                                                        </button>
                                                    </div>
                                                    <div className="space-y-2">
                                                        <p className="text-xs text-white/40 mb-2">Abajo de los productos:</p>
                                                        <button
                                                            onClick={() => addAdditionalRow('Lentes Descuento', 'bottom')}
                                                            className="w-full px-3 py-2 text-xs rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-white/70 transition-all cursor-pointer"
                                                        >
                                                            + Lentes Descuento
                                                        </button>
                                                        <button
                                                            onClick={() => addAdditionalRow('Suministros (Tintas)', 'bottom')}
                                                            className="w-full px-3 py-2 text-xs rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-white/70 transition-all cursor-pointer"
                                                        >
                                                            + Suministros (Tintas)
                                                        </button>
                                                        <button
                                                            onClick={() => addAdditionalRow('Facebook', 'bottom')}
                                                            className="w-full px-3 py-2 text-xs rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-white/70 transition-all cursor-pointer"
                                                        >
                                                            + Facebook
                                                        </button>
                                                        <button
                                                            onClick={() => addAdditionalRow('Twitter', 'bottom')}
                                                            className="w-full px-3 py-2 text-xs rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-white/70 transition-all cursor-pointer"
                                                        >
                                                            + Twitter
                                                        </button>
                                                        <button
                                                            onClick={() => addAdditionalRow('Youtube', 'bottom')}
                                                            className="w-full px-3 py-2 text-xs rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-white/70 transition-all cursor-pointer"
                                                        >
                                                            + Youtube
                                                        </button>
                                                        <button
                                                            onClick={() => addAdditionalRow('Linkedin', 'bottom')}
                                                            className="w-full px-3 py-2 text-xs rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-white/70 transition-all cursor-pointer"
                                                        >
                                                            + Linkedin
                                                        </button>
                                                        <button
                                                            onClick={() => addAdditionalRow('Newsletter', 'bottom')}
                                                            className="w-full px-3 py-2 text-xs rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-white/70 transition-all cursor-pointer"
                                                        >
                                                            + Newsletter
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {/* Missing Products */}
                                        <AnimatePresence>
                                            {missingProducts.length > 0 && (
                                                <motion.div
                                                    initial={{ opacity: 0, height: 0 }}
                                                    animate={{ opacity: 1, height: 'auto' }}
                                                    exit={{ opacity: 0, height: 0 }}
                                                    className="mb-6 p-4 rounded-xl bg-amber-500/10 border border-amber-500/20"
                                                >
                                                    <div className="flex items-start gap-3 mb-3">
                                                        <AlertCircle size={20} className="text-amber-400 flex-shrink-0" />
                                                        <div>
                                                            <h3 className="font-medium text-amber-300">{missingProducts.length} sin URL</h3>
                                                            <p className="text-xs text-amber-200/60">Agrega la URL y presiona Guardar (Enter ↵)</p>
                                                        </div>
                                                    </div>
                                                    <div className="space-y-2">
                                                        {missingProducts.map(p => (
                                                            <MissingProductInput 
                                                                key={p.name} 
                                                                product={p} 
                                                                onSave={handleAddProduct}
                                                            />
                                                        ))}
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>

                                        {/* Results Table */}
                                        {(results.length > 0 || additionalRows.length > 0) ? (
                                            <>
                                                <div className="overflow-x-auto rounded-xl border border-white/10">
                                                    <table className="w-full">
                                                        <thead className="bg-white/5">
                                                            <tr>
                                                                <th className="px-4 py-3 text-left text-xs font-semibold text-white/50 uppercase w-16"></th>
                                                                <th className="px-4 py-3 text-left text-xs font-semibold text-white/50 uppercase">Producto</th>
                                                                <th className="px-4 py-3 text-left text-xs font-semibold text-white/50 uppercase">Precio</th>
                                                                <th className="px-4 py-3 text-left text-xs font-semibold text-white/50 uppercase">URL</th>
                                                                <th className="px-4 py-3 text-center text-xs font-semibold text-white/50 uppercase w-16"></th>
                                                            </tr>
                                                        </thead>
                                                        <tbody className="divide-y divide-white/5">
                                                            {/* Filas adicionales superiores */}
                                                            {additionalRows.filter(r => r.position === 'top').map((r, i, arr) => (
                                                                <tr key={r.id} className="hover:bg-white/[0.02] bg-purple-500/5">
                                                                    <td className="px-4 py-3">
                                                                        <div className="flex flex-col gap-1">
                                                                            <button
                                                                                onClick={() => moveAdditionalRow(r.id, 'up')}
                                                                                disabled={i === 0}
                                                                                className="p-1 text-white/30 hover:text-white/60 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                                                                            >
                                                                                <ArrowUp size={12} />
                                                                            </button>
                                                                            <button
                                                                                onClick={() => moveAdditionalRow(r.id, 'down')}
                                                                                disabled={i === arr.length - 1}
                                                                                className="p-1 text-white/30 hover:text-white/60 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                                                                            >
                                                                                <ArrowDown size={12} />
                                                                            </button>
                                                                        </div>
                                                                    </td>
                                                                    <td className="px-4 py-3">
                                                                        <div className="flex items-center gap-2">
                                                                            <GripVertical size={14} className="text-white/20" />
                                                                            <span className="text-sm font-medium text-purple-300">{r.name}</span>
                                                                        </div>
                                                                    </td>
                                                                    <td className="px-4 py-3 text-sm text-white/60">{r.price}</td>
                                                                    <td className="px-4 py-3">
                                                                        {r.status === 'ok' ? (
                                                                            <a href={r.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-xs text-purple-400 hover:text-purple-300 group">
                                                                                <span className="truncate max-w-[200px]">{r.url.split('?')[0]}</span>
                                                                                <ExternalLink size={12} className="opacity-0 group-hover:opacity-100" />
                                                                            </a>
                                                                        ) : (
                                                                            <input
                                                                                type="text"
                                                                                placeholder="https://..."
                                                                                defaultValue={r.baseUrl}
                                                                                onBlur={(e) => e.target.value && updateAdditionalRowUrl(r.id, e.target.value)}
                                                                                className="w-full px-3 py-1.5 text-xs rounded-lg bg-black/20 border border-purple-500/30 text-white placeholder-white/30 focus:border-purple-400 outline-none"
                                                                            />
                                                                        )}
                                                                    </td>
                                                                    <td className="px-4 py-3 text-center">
                                                                        <div className="flex items-center justify-center gap-1">
                                                                            {r.status === 'ok' && !productsDb[r.name] && !predefinedItems[r.name] && (
                                                                                <button
                                                                                    onClick={() => saveAdditionalRowToDb(r)}
                                                                                    title="Guardar en base de datos"
                                                                                    className="p-1.5 text-white/40 hover:text-emerald-400 hover:bg-emerald-500/10 rounded-lg transition-all cursor-pointer"
                                                                                >
                                                                                    <Database size={14} />
                                                                                </button>
                                                                            )}
                                                                            <button
                                                                                onClick={() => removeAdditionalRow(r.id)}
                                                                                className="p-1.5 text-white/20 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all cursor-pointer"
                                                                            >
                                                                                <X size={14} />
                                                                            </button>
                                                                        </div>
                                                                    </td>
                                                                </tr>
                                                            ))}
                                                            
                                                            {/* Productos principales */}
                                                            {results.map((r, i) => (
                                                                <tr key={i} className={`hover:bg-white/[0.02] ${r.status === 'missing' ? 'bg-red-500/5' : ''}`}>
                                                                    <td className="px-4 py-3"></td>
                                                                    <td className="px-4 py-3 text-sm font-medium text-white/80">{r.name}</td>
                                                                    <td className="px-4 py-3 text-sm text-white/60">{r.price}</td>
                                                                    <td className="px-4 py-3">
                                                                        {r.status === 'ok' ? (
                                                                            <a href={r.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-xs text-emerald-400 hover:text-emerald-300 group">
                                                                                <span className="truncate max-w-[200px]">{r.url.split('?')[0]}</span>
                                                                                <ExternalLink size={12} className="opacity-0 group-hover:opacity-100" />
                                                                            </a>
                                                                        ) : (
                                                                            <span className="text-xs text-white/30 italic">Pendiente</span>
                                                                        )}
                                                                    </td>
                                                                    <td className="px-4 py-3 text-center">
                                                                        {r.status === 'ok' ? (
                                                                            <Check size={16} className="text-emerald-400 mx-auto" />
                                                                        ) : (
                                                                            <X size={16} className="text-red-400 mx-auto" />
                                                                        )}
                                                                    </td>
                                                                </tr>
                                                            ))}
                                                            
                                                            {/* Filas adicionales inferiores */}
                                                            {additionalRows.filter(r => r.position === 'bottom').map((r, i, arr) => (
                                                                <tr key={r.id} className="hover:bg-white/[0.02] bg-blue-500/5">
                                                                    <td className="px-4 py-3">
                                                                        <div className="flex flex-col gap-1">
                                                                            <button
                                                                                onClick={() => moveAdditionalRow(r.id, 'up')}
                                                                                disabled={i === 0}
                                                                                className="p-1 text-white/30 hover:text-white/60 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                                                                            >
                                                                                <ArrowUp size={12} />
                                                                            </button>
                                                                            <button
                                                                                onClick={() => moveAdditionalRow(r.id, 'down')}
                                                                                disabled={i === arr.length - 1}
                                                                                className="p-1 text-white/30 hover:text-white/60 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                                                                            >
                                                                                <ArrowDown size={12} />
                                                                            </button>
                                                                        </div>
                                                                    </td>
                                                                    <td className="px-4 py-3">
                                                                        <div className="flex items-center gap-2">
                                                                            <GripVertical size={14} className="text-white/20" />
                                                                            <span className="text-sm font-medium text-blue-300">{r.name}</span>
                                                                        </div>
                                                                    </td>
                                                                    <td className="px-4 py-3 text-sm text-white/60">{r.price}</td>
                                                                    <td className="px-4 py-3">
                                                                        {r.status === 'ok' ? (
                                                                            <a href={r.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-xs text-blue-400 hover:text-blue-300 group">
                                                                                <span className="truncate max-w-[200px]">{r.url.split('?')[0]}</span>
                                                                                <ExternalLink size={12} className="opacity-0 group-hover:opacity-100" />
                                                                            </a>
                                                                        ) : (
                                                                            <input
                                                                                type="text"
                                                                                placeholder="https://..."
                                                                                defaultValue={r.baseUrl}
                                                                                onBlur={(e) => e.target.value && updateAdditionalRowUrl(r.id, e.target.value)}
                                                                                className="w-full px-3 py-1.5 text-xs rounded-lg bg-black/20 border border-blue-500/30 text-white placeholder-white/30 focus:border-blue-400 outline-none"
                                                                            />
                                                                        )}
                                                                    </td>
                                                                    <td className="px-4 py-3 text-center">
                                                                        <div className="flex items-center justify-center gap-1">
                                                                            {r.status === 'ok' && !productsDb[r.name] && !predefinedItems[r.name] && (
                                                                                <button
                                                                                    onClick={() => saveAdditionalRowToDb(r)}
                                                                                    title="Guardar en base de datos"
                                                                                    className="p-1.5 text-white/40 hover:text-emerald-400 hover:bg-emerald-500/10 rounded-lg transition-all cursor-pointer"
                                                                                >
                                                                                    <Database size={14} />
                                                                                </button>
                                                                            )}
                                                                            <button
                                                                                onClick={() => removeAdditionalRow(r.id)}
                                                                                className="p-1.5 text-white/20 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all cursor-pointer"
                                                                            >
                                                                                <X size={14} />
                                                                            </button>
                                                                        </div>
                                                                    </td>
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                    </table>
                                                </div>

                                                <div className="flex justify-end gap-3 mt-6">
                                                    <button
                                                        onClick={handleCopyTable}
                                                        disabled={missingCount > 0}
                                                        className={`px-5 py-2.5 rounded-xl font-medium flex items-center gap-2 transition-all cursor-pointer ${
                                                            copied ? 'bg-emerald-500 text-white' : 'bg-white/5 text-white/70 hover:bg-white/10 border border-white/10 disabled:opacity-40'
                                                        }`}
                                                    >
                                                        {copied ? <Check size={16} /> : <Copy size={16} />}
                                                        {copied ? 'Copiado!' : 'Copiar'}
                                                    </button>
                                                    <button
                                                        onClick={downloadExcel}
                                                        disabled={missingCount > 0}
                                                        className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-medium flex items-center gap-2 disabled:opacity-40 cursor-pointer shadow-lg shadow-emerald-500/25"
                                                    >
                                                        <Download size={16} />
                                                        Excel
                                                    </button>
                                                </div>
                                            </>
                                        ) : (
                                            <div className="text-center py-16">
                                                <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-4">
                                                    <Tag size={32} className="text-white/20" />
                                                </div>
                                                <h3 className="text-base font-medium text-white/40 mb-2">Sin resultados</h3>
                                                <p className="text-white/30 text-xs">Configura y genera URLs</p>
                                            </div>
                                        )}
                                    </div>
                                </motion.div>
                            </div>
                        </div>
                    )}
                </main>

                {/* Footer - Dark with inverted logos matching Landing Page */}
                <footer className="px-6 py-6 mt-auto">
                    <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
                        <div className="flex items-center gap-6">
                            <img 
                                src="/assets/logoatlas.png" 
                                alt="Atlas" 
                                className="h-5 w-auto brightness-0 invert opacity-20 hover:opacity-40 transition-opacity" 
                            />
                            <img 
                                src="/assets/logo-rojo.png" 
                                alt="Canon" 
                                className="h-3 w-auto brightness-0 invert opacity-20 hover:opacity-40 transition-opacity" 
                            />
                        </div>
                        <p className="text-white/20 text-xs">
                            Creado por <span className="text-white/40">javohv</span> para Atlas & Canon • {new Date().getFullYear()}
                        </p>
                    </div>
                </footer>
            </div>
            
            {/* Quick App Menu */}
            <QuickAppMenu />
        </div>
    );
};

export default MarcajesMaker;
