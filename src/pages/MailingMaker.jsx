import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Home, Plus, Trash2, Upload, Image as ImageIcon, Save, Download,
    Eye, EyeOff, Package, FileText, Palette, Settings, X, Check,
    ChevronDown, Search, Mail, Sparkles, Edit3, Copy, ExternalLink, Wand2,
    History, Clock, Send, Archive, RotateCcw
} from 'lucide-react';

import {
    getMailingProducts,
    createMailingProduct,
    updateMailingProduct,
    deleteMailingProduct,
    getMailingAssets,
    createMailingAsset,
    deleteMailingAsset,
    uploadMailingImage,
    parseProductsFromText,
    getMailingImageUrl,
    getMailingHistory,
    saveMailingToHistory,
    updateMailingInHistory,
    deleteMailingFromHistory,
    updateMailingStatus
} from '../data/mailingData';

import { generateMailingHtml, downloadMailingHtml } from '../utils/mailingHtmlGenerator';
import HeaderGenerator from '../components/mailing/HeaderGenerator';

// Format price helper
const formatPrice = (price) => {
    if (!price) return '';
    return '$' + price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
};

// Product Card Component
const ProductCard = ({ product, onEdit, onDelete, onSelect, selected }) => (
    <motion.div
        layout
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className={`relative bg-white/5 border rounded-2xl overflow-hidden transition-all cursor-pointer group ${selected
            ? 'border-emerald-500/50 bg-emerald-500/10 ring-2 ring-emerald-500/30'
            : 'border-white/10 hover:border-white/20 hover:bg-white/10'
            }`}
        onClick={() => onSelect && onSelect(product)}
    >
        {/* Selection indicator */}
        {selected && (
            <div className="absolute top-3 left-3 z-10 w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center">
                <Check size={14} className="text-white" />
            </div>
        )}

        {/* Action buttons - top right */}
        <div className="absolute top-2 right-2 z-10 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            {product.url && (
                <a
                    href={product.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="p-1.5 bg-black/60 hover:bg-blue-500/80 rounded-lg text-white/70 hover:text-white transition-colors backdrop-blur-sm"
                    title="Ver en tienda"
                >
                    <ExternalLink size={14} />
                </a>
            )}
            <button
                onClick={(e) => { e.stopPropagation(); onEdit(product); }}
                className="p-1.5 bg-black/60 hover:bg-white/30 rounded-lg text-white/70 hover:text-white transition-colors backdrop-blur-sm"
                title="Editar"
            >
                <Edit3 size={14} />
            </button>
            <button
                onClick={(e) => { e.stopPropagation(); onDelete(product.id); }}
                className="p-1.5 bg-black/60 hover:bg-red-500/80 rounded-lg text-white/70 hover:text-white transition-colors backdrop-blur-sm"
                title="Eliminar"
            >
                <Trash2 size={14} />
            </button>
        </div>

        {/* Discount badge */}
        {product.discount_percentage && (
            <div className="absolute bottom-2 left-2 z-10 bg-red-500 text-white px-2 py-0.5 rounded-full text-xs font-bold">
                -{product.discount_percentage}%
            </div>
        )}

        {/* Product image */}
        <div className="aspect-square bg-gradient-to-br from-white/5 to-white/10 flex items-center justify-center p-4">
            {product.image_url ? (
                <img
                    src={product.image_url}
                    alt={product.name}
                    className="max-w-full max-h-full object-contain"
                />
            ) : (
                <ImageIcon size={48} className="text-white/20" />
            )}
        </div>

        {/* Product info */}
        <div className="p-4 space-y-2">
            <h3 className="font-semibold text-white truncate">{product.name}</h3>
            {product.subtitle && (
                <p className="text-xs text-white/50 truncate">{product.subtitle}</p>
            )}

            <div className="flex items-center gap-2 pt-2">
                {product.price_before && (
                    <span className="text-sm text-white/40 line-through">
                        {formatPrice(product.price_before)}
                    </span>
                )}
                <span className="text-lg font-bold text-emerald-400">
                    {formatPrice(product.price_now)}
                </span>
            </div>
        </div>
    </motion.div>
);

// Text Import Modal Component
const TextImportModal = ({ onImport, onClose }) => {
    const [text, setText] = useState('');
    const [foundProducts, setFoundProducts] = useState([]);
    const [missingProducts, setMissingProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [creatingProduct, setCreatingProduct] = useState(null);

    const handleParse = async () => {
        if (!text.trim()) return;
        
        setLoading(true);
        const result = await parseProductsFromText(text);
        setFoundProducts(result.found || []);
        setMissingProducts(result.missing || []);
        setLoading(false);
    };

    const handleImportFound = () => {
        if (foundProducts.length > 0) {
            onImport(foundProducts);
        }
    };

    const handleCreateMissing = (productName) => {
        // Open product modal to create this missing product
        setCreatingProduct(productName);
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={onClose}
        >
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-[#12121a] rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden border border-white/10"
                onClick={e => e.stopPropagation()}
            >
                <div className="p-6 border-b border-white/10 flex justify-between items-center">
                    <div>
                        <h2 className="text-xl font-semibold text-white">Auto-Seleccionar Productos</h2>
                        <p className="text-sm text-white/50 mt-1">Pega el listado del cliente para detectar automáticamente</p>
                    </div>
                    <button onClick={onClose} className="text-white/40 hover:text-white/60">
                        <X size={24} />
                    </button>
                </div>

                <div className="p-6 space-y-4 max-h-[calc(90vh-200px)] overflow-y-auto">
                    {/* Text area */}
                    <div>
                        <label className="block text-sm text-white/70 mb-2">
                            Pega el listado de productos desde Excel (incluye PRECIO, DESCUENTO % y PRECIO OFERTA)
                        </label>
                        <textarea
                            value={text}
                            onChange={e => setText(e.target.value)}
                            placeholder="Pega directamente desde Excel el listado con las columnas:&#10;SKU | PRODUCTO | PRECIO | DESCUENTO $ | DESCUENTO % | PRECIO OFERTA&#10;&#10;Los precios y descuentos se asignarán automáticamente a cada producto"
                            rows={6}
                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20 outline-none resize-none font-mono text-sm"
                        />
                    </div>

                    {/* Parse button */}
                    <button
                        onClick={handleParse}
                        disabled={!text.trim() || loading}
                        className="w-full px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-400 hover:to-purple-400 disabled:from-gray-600 disabled:to-gray-700 rounded-xl text-white font-medium flex items-center justify-center gap-2 transition-all disabled:cursor-not-allowed"
                    >
                        {loading ? (
                            <>
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                Detectando...
                            </>
                        ) : (
                            <>
                                <Sparkles size={20} />
                                Detectar Productos
                            </>
                        )}
                    </button>

                    {/* Results Grid */}
                    {(foundProducts.length > 0 || missingProducts.length > 0) && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Found products */}
                            {foundProducts.length > 0 && (
                                <div className="border border-emerald-500/30 rounded-xl p-4 bg-emerald-500/5">
                                    <h3 className="text-white font-medium mb-3 flex items-center gap-2">
                                        <Check size={16} className="text-emerald-400" />
                                        Encontrados ({foundProducts.length})
                                    </h3>
                                    <div className="space-y-2 max-h-80 overflow-y-auto">
                                        {foundProducts.map(product => (
                                            <div key={product.id} className="flex items-center gap-3 p-2 bg-white/5 rounded-lg">
                                                {product.image_url && (
                                                    <img src={product.image_url} alt={product.name} className="w-10 h-10 object-contain rounded" />
                                                )}
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-white text-xs font-medium truncate">{product.name}</p>
                                                    <div className="flex items-center gap-2 mt-0.5">
                                                        {product.price_before && (
                                                            <span className="text-white/40 text-xs line-through">
                                                                ${product.price_before.toLocaleString('es-CL')}
                                                            </span>
                                                        )}
                                                        {product.price_now && (
                                                            <span className="text-emerald-400 text-xs font-medium">
                                                                ${product.price_now.toLocaleString('es-CL')}
                                                            </span>
                                                        )}
                                                        {product.discount_percentage && (
                                                            <span className="text-red-400 text-xs">
                                                                -{product.discount_percentage}%
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                                <Check size={14} className="text-emerald-400 flex-shrink-0" />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Missing products */}
                            {missingProducts.length > 0 && (
                                <div className="border border-orange-500/30 rounded-xl p-4 bg-orange-500/5">
                                    <h3 className="text-white font-medium mb-3 flex items-center gap-2">
                                        <X size={16} className="text-orange-400" />
                                        No Encontrados ({missingProducts.length})
                                    </h3>
                                    <div className="space-y-2 max-h-80 overflow-y-auto">
                                        {missingProducts.map((name, idx) => (
                                            <div key={idx} className="flex items-center justify-between gap-3 p-2 bg-white/5 rounded-lg">
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-white text-xs truncate">{name}</p>
                                                </div>
                                                <button
                                                    onClick={() => handleCreateMissing(name)}
                                                    className="text-xs px-2 py-1 bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 rounded border border-blue-500/30 transition-colors flex-shrink-0"
                                                    title="Crear producto"
                                                >
                                                    <Plus size={12} />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                    <p className="text-xs text-orange-400/60 mt-3">
                                        💡 Usa el botón + para crear cada producto faltante
                                    </p>
                                </div>
                            )}
                        </div>
                    )}

                    {foundProducts.length === 0 && missingProducts.length === 0 && text && !loading && (
                        <div className="text-center py-8 border border-dashed border-white/10 rounded-xl">
                            <p className="text-white/40">No se detectaron productos. Verifica el formato del texto.</p>
                        </div>
                    )}
                </div>

                <div className="p-6 border-t border-white/10 flex gap-3">
                    <button
                        onClick={onClose}
                        className="flex-1 px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-white transition-colors"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={handleImportFound}
                        disabled={foundProducts.length === 0}
                        className="flex-1 px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 disabled:from-gray-600 disabled:to-gray-700 rounded-xl text-white font-medium flex items-center justify-center gap-2 transition-all disabled:cursor-not-allowed"
                    >
                        <Download size={20} />
                        Seleccionar Encontrados {foundProducts.length > 0 ? `(${foundProducts.length})` : ''}
                    </button>
                </div>
            </motion.div>
        </motion.div>
    );
};

// Add/Edit Product Modal
const ProductModal = ({ product, onSave, onClose }) => {
    const [form, setForm] = useState({
        id: '',
        name: '',
        url: '',
        sku: '',
        subtitle: '',
        features: [],
        image_url: '',
        logo_url: '',
        category: 'cameras',
        ...product
    });
    const [featuresText, setFeaturesText] = useState((product?.features || []).join('\n'));
    const [uploading, setUploading] = useState(false);
    const [uploadingLogo, setUploadingLogo] = useState(false);
    const fileInputRef = useRef(null);
    const logoInputRef = useRef(null);

    const handleImageUpload = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        try {
            const result = await uploadMailingImage(file, 'products', `${form.id || Date.now()}-${file.name}`);
            if (result.success) {
                setForm(prev => ({ ...prev, image_url: result.url }));
            }
        } catch (err) {
            console.error('Upload failed:', err);
        }
        setUploading(false);
    };

    const handleLogoUpload = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploadingLogo(true);
        try {
            const result = await uploadMailingImage(file, 'logos', `${form.id || Date.now()}-logo-${file.name}`);
            if (result.success) {
                setForm(prev => ({ ...prev, logo_url: result.url }));
            }
        } catch (err) {
            console.error('Logo upload failed:', err);
        }
        setUploadingLogo(false);
    };

    // Check if form is valid for saving
    const isFormValid = form.name && form.name.trim() !== '';

    const handleSubmit = () => {
        const features = featuresText.split('\n').filter(f => f.trim());
        onSave({
            ...form,
            features
        });
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[60] flex items-center justify-center p-4"
            onClick={onClose}
        >
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-[#12121a] rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden border border-white/10"
                onClick={e => e.stopPropagation()}
            >
                <div className="p-6 border-b border-white/10 flex justify-between items-center">
                    <h2 className="text-xl font-semibold text-white">
                        {product ? 'Editar Producto' : 'Nuevo Producto'}
                    </h2>
                    <button onClick={onClose} className="text-white/40 hover:text-white/60">
                        <X size={24} />
                    </button>
                </div>

                <div className="p-6 space-y-4 overflow-y-auto max-h-[60vh]">
                    {/* Image upload */}
                    <div
                        className="aspect-video bg-white/5 border-2 border-dashed border-white/20 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-white/40 transition-colors overflow-hidden"
                        onClick={() => fileInputRef.current?.click()}
                    >
                        {form.image_url ? (
                            <img src={form.image_url} alt="Preview" className="max-w-full max-h-full object-contain" />
                        ) : (
                            <>
                                <Upload size={32} className="text-white/30 mb-2" />
                                <span className="text-white/40 text-sm">
                                    {uploading ? 'Subiendo...' : 'Click para subir imagen'}
                                </span>
                            </>
                        )}
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            className="hidden"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs text-white/50 mb-1">Nombre *</label>
                            <input
                                type="text"
                                value={form.name}
                                onChange={e => setForm({ ...form, name: e.target.value })}
                                placeholder="EOS R6 Mark II"
                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20 outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-xs text-white/50 mb-1">Categoría</label>
                            <select
                                value={form.category}
                                onChange={e => setForm({ ...form, category: e.target.value })}
                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:border-emerald-500/50 outline-none"
                            >
                                <option value="cameras">Cámaras</option>
                                <option value="lenses">Lentes</option>
                                <option value="accessories">Accesorios</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs text-white/50 mb-1">Subtítulo (ej: RF 24-105mm f/4L IS USM)</label>
                        <input
                            type="text"
                            value={form.subtitle}
                            onChange={e => setForm({ ...form, subtitle: e.target.value })}
                            placeholder="RF 24-105mm f/4L IS USM"
                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:border-emerald-500/50 outline-none"
                        />
                    </div>

                    {/* Logo y color del subtítulo */}
                    <div className="grid grid-cols-2 gap-4">
                        {/* Logo del producto */}
                        <div>
                            <label className="block text-xs text-white/50 mb-1">Logo del Producto (opcional)</label>
                            <div
                                className="h-24 bg-white/5 border-2 border-dashed border-white/20 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-white/40 transition-colors overflow-hidden"
                                onClick={() => logoInputRef.current?.click()}
                            >
                                {form.logo_url ? (
                                    <div className="relative w-full h-full flex items-center justify-center p-2">
                                        <img src={form.logo_url} alt="Logo" className="h-[55px] w-auto object-contain" />
                                        <button
                                            onClick={(e) => { e.stopPropagation(); setForm(prev => ({ ...prev, logo_url: '' })); }}
                                            className="absolute top-1 right-1 p-1 bg-red-500/80 hover:bg-red-500 rounded-full text-white"
                                            title="Eliminar logo"
                                        >
                                            <X size={12} />
                                        </button>
                                    </div>
                                ) : (
                                    <>
                                        <Upload size={20} className="text-white/30 mb-1" />
                                        <span className="text-white/40 text-xs">
                                            {uploadingLogo ? 'Subiendo...' : 'Subir logo (55px alto)'}
                                        </span>
                                    </>
                                )}
                                <input
                                    ref={logoInputRef}
                                    type="file"
                                    accept="image/*"
                                    onChange={handleLogoUpload}
                                    className="hidden"
                                />
                            </div>
                            <p className="text-xs text-white/30 mt-1">Si hay logo, reemplaza el nombre del producto</p>
                        </div>
                    </div>

                    {/* URL del producto */}
                    <div>
                        <label className="block text-xs text-white/50 mb-1">URL del Producto</label>
                        <div className="flex gap-2">
                            <input
                                type="url"
                                value={form.url || ''}
                                onChange={e => setForm({ ...form, url: e.target.value })}
                                placeholder="https://www.canontiendaonline.cl/es_cl/p/eos-r6-mark-ii"
                                className="flex-1 px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:border-emerald-500/50 outline-none text-sm"
                            />
                            {form.url && (
                                <a
                                    href={form.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="px-4 py-3 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/30 rounded-xl text-blue-400 transition-colors flex items-center gap-2"
                                    title="Abrir URL"
                                >
                                    <ExternalLink size={18} />
                                </a>
                            )}
                        </div>
                    </div>

                    {/* Info sobre precios */}
                    <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4">
                        <p className="text-blue-400 text-sm">
                            💡 Los precios y descuentos se asignan automáticamente al pegar el listado de productos en "Pegar Listado"
                        </p>
                    </div>

                    <div>
                        <label className="block text-xs text-white/50 mb-1">Características (una por línea)</label>
                        <textarea
                            value={featuresText}
                            onChange={e => setFeaturesText(e.target.value)}
                            placeholder="Sensor CMOS Full Frame&#10;Video 6K 60p&#10;20fps con AF"
                            rows={4}
                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:border-emerald-500/50 outline-none resize-none"
                        />
                    </div>
                </div>

                <div className="p-6 border-t border-white/10 flex gap-3 justify-end">
                    <button
                        onClick={onClose}
                        className="px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-white/70 transition-colors"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={!isFormValid || uploading}
                        className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 rounded-xl text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-all"
                    >
                        <Save size={18} />
                        {uploading ? 'Subiendo...' : 'Guardar'}
                    </button>
                </div>
            </motion.div>
        </motion.div>
    );
};

// Asset Section Component
const AssetSection = ({ title, description, type, assets, onUpload, onDelete, onSelect, selected, onGenerateHeader }) => {
    const [uploading, setUploading] = useState(false);
    const [assetName, setAssetName] = useState('');
    const fileInputRef = useRef(null);

    const handleFileSelect = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        await onUpload(file, assetName || file.name.replace(/\.[^/.]+$/, ''));
        setUploading(false);
        setAssetName('');
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    return (
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
            <div className="flex justify-between items-start mb-4">
                <div>
                    <h3 className="text-lg font-semibold text-white">{title}</h3>
                    <p className="text-sm text-white/50">{description}</p>
                </div>
                <div className="flex items-center gap-2">
                    {/* Botón generador solo para headers */}
                    {type === 'header' && onGenerateHeader && (
                        <button
                            onClick={onGenerateHeader}
                            className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-400 hover:to-pink-400 rounded-lg text-white text-sm font-medium flex items-center gap-2"
                        >
                            <Wand2 size={16} />
                            Generar
                        </button>
                    )}
                    <input
                        type="text"
                        value={assetName}
                        onChange={e => setAssetName(e.target.value)}
                        placeholder="Nombre del asset"
                        className="px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm placeholder-white/30 w-40"
                    />
                    <button
                        onClick={() => fileInputRef.current?.click()}
                        disabled={uploading}
                        className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 rounded-lg text-white text-sm font-medium flex items-center gap-2 disabled:opacity-50"
                    >
                        <Upload size={16} />
                        {uploading ? 'Subiendo...' : 'Subir'}
                    </button>
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleFileSelect}
                        className="hidden"
                    />
                </div>
            </div>

            {assets.length === 0 ? (
                <div className="text-center py-8 border-2 border-dashed border-white/10 rounded-xl">
                    <ImageIcon size={32} className="mx-auto text-white/20 mb-2" />
                    <p className="text-white/40 text-sm">No hay {title.toLowerCase()} todavía</p>
                </div>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {assets.map(asset => (
                        <div
                            key={asset.id}
                            onClick={() => onSelect(asset)}
                            className={`relative group rounded-xl overflow-hidden cursor-pointer transition-all ${selected?.id === asset.id
                                    ? 'ring-2 ring-emerald-500 ring-offset-2 ring-offset-[#12121a]'
                                    : 'hover:ring-2 hover:ring-white/20'
                                }`}
                        >
                            <img
                                src={asset.image_url}
                                alt={asset.name}
                                className="w-full aspect-video object-cover bg-white/5"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                                <div className="absolute bottom-0 left-0 right-0 p-3 flex justify-between items-end">
                                    <span className="text-white text-sm font-medium truncate">{asset.name}</span>
                                    <button
                                        onClick={(e) => { e.stopPropagation(); onDelete(asset.id); }}
                                        className="p-1.5 bg-red-500/80 hover:bg-red-500 rounded-lg text-white"
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                            </div>
                            {selected?.id === asset.id && (
                                <div className="absolute top-2 right-2 w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center">
                                    <Check size={14} className="text-white" />
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

// Main Mailing Maker Component
const MailingMaker = () => {
    const navigate = useNavigate();
    const canvasRef = useRef(null);
    const [activeTab, setActiveTab] = useState('create'); // 'products', 'assets', 'create', 'history'

    // Products state
    const [products, setProducts] = useState([]);
    const [selectedProducts, setSelectedProducts] = useState([]);
    const [showProductModal, setShowProductModal] = useState(false);
    const [showTextImportModal, setShowTextImportModal] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');

    // Assets state
    const [assets, setAssets] = useState({ headers: [], banners: [], offers: [], productBackgrounds: [] });
    const [selectedHeader, setSelectedHeader] = useState(null);
    const [selectedBanner, setSelectedBanner] = useState(null);
    const [selectedOfferBanner, setSelectedOfferBanner] = useState(null);
    const [selectedProductBackground, setSelectedProductBackground] = useState(null);
    const [showHeaderGenerator, setShowHeaderGenerator] = useState(false);

    // Mailing content state
    const [textContent, setTextContent] = useState('¡ÚLTIMAS HORAS!\nAPROVECHA GRANDES DESCUENTOS');
    const [backgroundImage, setBackgroundImage] = useState('');
    const [disclaimerText, setDisclaimerText] = useState('*Promoción válida hasta agotar stock. Precios pueden variar sin previo aviso. Imágenes referenciales.');
    const [socialNetworks, setSocialNetworks] = useState({
        facebook: true,
        instagram: true,
        youtube: true,
        twitter: true
    });

    // Preview state
    const [showPreview, setShowPreview] = useState(false);
    const [generatedHtml, setGeneratedHtml] = useState('');
    
    // Global mailing colors
    const [mailingColors, setMailingColors] = useState({
        textColor: '#000000',
        priceColor: '#000000',
        subtitleBgColor: '#cc0000'
    });

    // History state
    const [mailingHistory, setMailingHistory] = useState([]);
    const [editingMailingId, setEditingMailingId] = useState(null);
    const [mailingName, setMailingName] = useState('');
    const [showSaveModal, setShowSaveModal] = useState(false);
    const [savingMailing, setSavingMailing] = useState(false);

    // Aurora background animation
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
            ctx.fillStyle = '#0a0a0f';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Emerald/teal aurora for mailing maker
            const blob1X = canvas.width * (0.5 + Math.sin(time * 0.8) * 0.25);
            const blob1Y = canvas.height * (0.78 + Math.cos(time * 0.5) * 0.05);
            const grad1 = ctx.createRadialGradient(blob1X, blob1Y, 0, blob1X, blob1Y, canvas.width * 0.5);
            grad1.addColorStop(0, 'rgba(16, 185, 129, 0.15)');
            grad1.addColorStop(0.4, 'rgba(20, 184, 166, 0.08)');
            grad1.addColorStop(1, 'transparent');
            ctx.fillStyle = grad1;
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            const blob2X = canvas.width * (0.75 + Math.cos(time * 0.6) * 0.15);
            const blob2Y = canvas.height * (0.25 + Math.sin(time * 0.9) * 0.12);
            const grad2 = ctx.createRadialGradient(blob2X, blob2Y, 0, blob2X, blob2Y, canvas.width * 0.4);
            grad2.addColorStop(0, 'rgba(52, 211, 153, 0.10)');
            grad2.addColorStop(0.5, 'rgba(16, 185, 129, 0.05)');
            grad2.addColorStop(1, 'transparent');
            ctx.fillStyle = grad2;
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            animationId = requestAnimationFrame(animate);
        };

        animate();
        return () => {
            cancelAnimationFrame(animationId);
            window.removeEventListener('resize', resize);
        };
    }, []);

    // Load products
    useEffect(() => {
        loadProducts();
        loadAssets();
        loadHistory();
    }, []);

    const loadProducts = async () => {
        const { data } = await getMailingProducts();
        if (data) setProducts(data);
    };

    const loadAssets = async () => {
        const [headers, banners, offers, productBackgrounds] = await Promise.all([
            getMailingAssets('header'),
            getMailingAssets('banner'),
            getMailingAssets('offer_banner'),
            getMailingAssets('product_background')
        ]);
        setAssets({
            headers: headers.data || [],
            banners: banners.data || [],
            offers: offers.data || [],
            productBackgrounds: productBackgrounds.data || []
        });
    };

    const loadHistory = async () => {
        const { data } = await getMailingHistory();
        if (data) setMailingHistory(data);
    };

    const handleSaveProduct = async (productData) => {
        if (editingProduct) {
            // Usar el ID original del producto que se está editando
            await updateMailingProduct(editingProduct.id, productData);
        } else {
            await createMailingProduct(productData);
        }
        await loadProducts();
        
        // Si el preview está abierto, actualizar los productos seleccionados y regenerar
        if (showPreview && editingProduct) {
            const { data: freshProducts } = await getMailingProducts();
            if (freshProducts) {
                const updatedSelectedProducts = selectedProducts.map(selected => {
                    const fresh = freshProducts.find(p => p.id === selected.id);
                    if (fresh) {
                        return {
                            ...fresh,
                            price_before: selected.price_before,
                            price_now: selected.price_now,
                            discount_percentage: selected.discount_percentage
                        };
                    }
                    return selected;
                });
                setSelectedProducts(updatedSelectedProducts);
                setGeneratedHtml(generateHtmlWithColors(mailingColors, updatedSelectedProducts));
            }
        }
        
        setShowProductModal(false);
        setEditingProduct(null);
    };

    const handleDeleteProduct = async (id) => {
        if (confirm('¿Eliminar este producto?')) {
            await deleteMailingProduct(id);
            await loadProducts();
            setSelectedProducts(prev => prev.filter(p => p.id !== id));
        }
    };

    const toggleProductSelection = (product) => {
        setSelectedProducts(prev => {
            const exists = prev.find(p => p.id === product.id);
            if (exists) {
                return prev.filter(p => p.id !== product.id);
            }
            return [...prev, product];
        });
    };

    // Generate HTML with current colors
    const generateHtmlWithColors = (colors = mailingColors, productsToUse = selectedProducts) => {
        return generateMailingHtml({
            headerImageUrl: selectedHeader?.image_url,
            bannerImageUrl: selectedBanner?.image_url,
            textContent: textContent.replace(/\n/g, '<br>'),
            backgroundImageUrl: backgroundImage,
            products: productsToUse,
            offerBannerUrl: selectedOfferBanner?.image_url,
            productBackgroundUrl: selectedProductBackground?.image_url,
            disclaimerText,
            socialNetworks,
            globalColors: colors
        });
    };

    const generatePreview = async () => {
        // Reload products from DB to get latest changes
        const { data: freshProducts } = await getMailingProducts();
        
        if (freshProducts) {
            // Update selected products with fresh data from DB
            const updatedSelectedProducts = selectedProducts.map(selected => {
                const fresh = freshProducts.find(p => p.id === selected.id);
                if (fresh) {
                    // Preserve pricing from the pasted list, but update other fields
                    return {
                        ...fresh,
                        price_before: selected.price_before,
                        price_now: selected.price_now,
                        discount_percentage: selected.discount_percentage
                    };
                }
                return selected;
            });
            
            setSelectedProducts(updatedSelectedProducts);
            const html = generateHtmlWithColors(mailingColors, updatedSelectedProducts);
            setGeneratedHtml(html);
        } else {
            const html = generateHtmlWithColors();
            setGeneratedHtml(html);
        }
        
        setShowPreview(true);
    };

    // Update preview when colors change
    const updateColorsAndPreview = (newColors) => {
        setMailingColors(newColors);
        setGeneratedHtml(generateHtmlWithColors(newColors));
    };

    const handleDownload = () => {
        const html = generateHtmlWithColors();
        downloadMailingHtml(html, `mailing-${Date.now()}.html`);
    };

    const handleGenerateHeader = async (headerData) => {
        // Subir la imagen generada
        const result = await uploadMailingImage(headerData.file, 'headers', `header-${Date.now()}.png`);
        
        if (result.success) {
            // Crear el asset en la base de datos
            const newAsset = await createMailingAsset({
                name: headerData.name,
                type: 'header',
                image_url: result.url,
                width: 1200
            });
            
            // Recargar los assets
            await loadAssets();
            
            // Cerrar el generador
            setShowHeaderGenerator(false);
            
            // Opcionalmente, seleccionar automáticamente el header recién creado
            if (newAsset.data) {
                setSelectedHeader(newAsset.data);
            }
        }
    };

    // Save mailing to history
    const handleSaveMailing = async (name) => {
        setSavingMailing(true);
        
        const html = generateHtmlWithColors();

        const mailingData = {
            name,
            headerAsset: selectedHeader,
            bannerAsset: selectedBanner,
            offerBannerAsset: selectedOfferBanner,
            productBackgroundAsset: selectedProductBackground,
            products: selectedProducts,
            textContent,
            disclaimerText,
            socialNetworks,
            generatedHtml: html,
            status: 'draft'
        };

        let result;
        if (editingMailingId) {
            result = await updateMailingInHistory(editingMailingId, mailingData);
        } else {
            result = await saveMailingToHistory(mailingData);
        }

        if (result.data) {
            await loadHistory();
            setShowSaveModal(false);
            setMailingName('');
            if (!editingMailingId) {
                setEditingMailingId(result.data.id);
            }
        }
        
        setSavingMailing(false);
    };

    // Load mailing from history for editing
    const handleLoadMailing = (mailing) => {
        // Set editing state
        setEditingMailingId(mailing.id);
        setMailingName(mailing.name);

        // Restore assets by finding them in current assets
        const header = assets.headers.find(a => a.id === mailing.header_asset_id) 
            || (mailing.header_image_url ? { id: mailing.header_asset_id, image_url: mailing.header_image_url, name: 'Header' } : null);
        const banner = assets.banners.find(a => a.id === mailing.banner_asset_id)
            || (mailing.banner_image_url ? { id: mailing.banner_asset_id, image_url: mailing.banner_image_url, name: 'Banner' } : null);
        const offerBanner = assets.offers.find(a => a.id === mailing.offer_banner_asset_id)
            || (mailing.offer_banner_image_url ? { id: mailing.offer_banner_asset_id, image_url: mailing.offer_banner_image_url, name: 'Offer' } : null);
        const productBg = assets.productBackgrounds.find(a => a.id === mailing.product_background_asset_id)
            || (mailing.product_background_image_url ? { id: mailing.product_background_asset_id, image_url: mailing.product_background_image_url, name: 'Background' } : null);

        setSelectedHeader(header);
        setSelectedBanner(banner);
        setSelectedOfferBanner(offerBanner);
        setSelectedProductBackground(productBg);

        // Restore products - try to get fresh data, fallback to snapshot
        const productIds = mailing.product_ids || [];
        const freshProducts = products.filter(p => productIds.includes(p.id));
        
        if (freshProducts.length > 0) {
            setSelectedProducts(freshProducts);
        } else if (mailing.products_snapshot && mailing.products_snapshot.length > 0) {
            setSelectedProducts(mailing.products_snapshot);
        } else {
            setSelectedProducts([]);
        }

        // Restore text content
        setTextContent(mailing.text_content || '');
        setDisclaimerText(mailing.disclaimer_text || '');
        setSocialNetworks(mailing.social_networks || { facebook: true, instagram: true, youtube: true, twitter: true });

        // Switch to create tab
        setActiveTab('create');
    };

    // Reset editor to create new mailing
    const handleNewMailing = () => {
        setEditingMailingId(null);
        setMailingName('');
        setSelectedHeader(null);
        setSelectedBanner(null);
        setSelectedOfferBanner(null);
        setSelectedProductBackground(null);
        setSelectedProducts([]);
        setTextContent('¡ÚLTIMAS HORAS!\nAPROVECHA GRANDES DESCUENTOS');
        setDisclaimerText('*Promoción válida hasta agotar stock. Precios pueden variar sin previo aviso. Imágenes referenciales.');
        setSocialNetworks({ facebook: true, instagram: true, youtube: true, twitter: true });
        setGeneratedHtml('');
        setActiveTab('create');
    };

    // Delete mailing from history
    const handleDeleteMailing = async (id) => {
        if (confirm('¿Eliminar este mailing del historial?')) {
            await deleteMailingFromHistory(id);
            await loadHistory();
            if (editingMailingId === id) {
                handleNewMailing();
            }
        }
    };

    // Update mailing status
    const handleUpdateStatus = async (id, status) => {
        await updateMailingStatus(id, status);
        await loadHistory();
    };

    const filteredProducts = products.filter(p =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.subtitle && p.subtitle.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    const tabs = [
        { id: 'create', label: 'Crear Mailing', icon: Mail },
        { id: 'history', label: 'Historial', icon: History, badge: mailingHistory.length },
        { id: 'products', label: 'Productos', icon: Package },
        { id: 'assets', label: 'Assets', icon: Palette }
    ];

    return (
        <div className="min-h-screen bg-[#0a0a0f] font-sans flex flex-col relative overflow-hidden">
            {/* Aurora animated background */}
            <canvas ref={canvasRef} className="absolute inset-0 z-0" />

            <div className="relative z-10 flex flex-col min-h-screen">
                {/* Header */}
                <header className="bg-white px-6 py-3">
                    <div className="max-w-7xl mx-auto flex justify-between items-center">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => navigate('/')}
                                className="p-2 rounded-lg hover:bg-black/5 transition-all cursor-pointer"
                                title="Volver al inicio"
                            >
                                <Home size={18} className="text-black/40" />
                            </button>
                            <div className="h-4 w-px bg-black/20"></div>
                            <Mail size={20} className="text-emerald-600" />
                            <span className="text-sm font-semibold text-black/70">
                                MAILING MAKER
                            </span>
                        </div>

                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => setShowSaveModal(true)}
                                disabled={selectedProducts.length === 0}
                                className="px-4 py-2 bg-black/5 hover:bg-black/10 rounded-lg text-black/60 text-sm flex items-center gap-2 transition-colors disabled:opacity-50"
                            >
                                <Save size={16} />
                                {editingMailingId ? 'Actualizar' : 'Guardar'}
                            </button>
                            <button
                                onClick={generatePreview}
                                disabled={selectedProducts.length === 0}
                                className="px-4 py-2 bg-black/5 hover:bg-black/10 rounded-lg text-black/60 text-sm flex items-center gap-2 transition-colors disabled:opacity-50"
                            >
                                <Eye size={16} />
                                Preview
                            </button>
                            <button
                                onClick={handleDownload}
                                disabled={selectedProducts.length === 0}
                                className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 rounded-lg text-white text-sm font-medium flex items-center gap-2 transition-all disabled:opacity-50"
                            >
                                <Download size={16} />
                                Descargar HTML
                            </button>
                        </div>
                    </div>
                </header>

                {/* Tabs */}
                <div className="px-6 py-4">
                    <div className="max-w-7xl mx-auto flex gap-2">
                        {tabs.map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`px-5 py-3 rounded-xl text-sm font-medium flex items-center gap-2 transition-all ${activeTab === tab.id
                                    ? 'bg-white/10 text-white border border-white/20'
                                    : 'text-white/50 hover:text-white/70 hover:bg-white/5'
                                    }`}
                            >
                                <tab.icon size={18} />
                                {tab.label}
                                {tab.badge > 0 && (
                                    <span className="ml-1 px-2 py-0.5 bg-emerald-500/20 text-emerald-400 text-xs rounded-full">
                                        {tab.badge}
                                    </span>
                                )}
                            </button>
                        ))}

                        {/* Editing indicator */}
                        {editingMailingId && (
                            <div className="ml-auto flex items-center gap-2">
                                <span className="text-white/40 text-sm">Editando:</span>
                                <span className="text-emerald-400 text-sm font-medium">{mailingName}</span>
                                <button
                                    onClick={handleNewMailing}
                                    className="p-2 hover:bg-white/10 rounded-lg text-white/40 hover:text-white transition-colors"
                                    title="Nuevo mailing"
                                >
                                    <Plus size={16} />
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Main Content */}
                <main className="flex-1 px-6 pb-8">
                    <div className="max-w-7xl mx-auto">
                        <AnimatePresence mode="wait">
                            {/* CREATE MAILING TAB */}
                            {activeTab === 'create' && (
                                <motion.div
                                    key="create"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    className="grid grid-cols-1 lg:grid-cols-3 gap-6"
                                >
                                    {/* Left column - Configuration */}
                                    <div className="lg:col-span-1 space-y-4">
                                        {/* Selected Assets Summary */}
                                        <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
                                            <h3 className="text-white font-medium mb-3 flex items-center gap-2">
                                                <ImageIcon size={16} className="text-emerald-400" />
                                                Assets Seleccionados
                                            </h3>
                                            <div className="space-y-2 text-xs">
                                                <div className={`flex items-center gap-2 ${selectedHeader ? 'text-emerald-400' : 'text-white/40'}`}>
                                                    <div className={`w-2 h-2 rounded-full ${selectedHeader ? 'bg-emerald-400' : 'bg-white/20'}`} />
                                                    Header: {selectedHeader ? selectedHeader.name : 'No seleccionado'}
                                                </div>
                                                <div className={`flex items-center gap-2 ${selectedBanner ? 'text-emerald-400' : 'text-white/40'}`}>
                                                    <div className={`w-2 h-2 rounded-full ${selectedBanner ? 'bg-emerald-400' : 'bg-white/20'}`} />
                                                    Banner: {selectedBanner ? selectedBanner.name : 'No seleccionado'}
                                                </div>
                                                <div className={`flex items-center gap-2 ${selectedOfferBanner ? 'text-emerald-400' : 'text-white/40'}`}>
                                                    <div className={`w-2 h-2 rounded-full ${selectedOfferBanner ? 'bg-emerald-400' : 'bg-white/20'}`} />
                                                    Oferta: {selectedOfferBanner ? selectedOfferBanner.name : 'No seleccionado'}
                                                </div>
                                                <div className={`flex items-center gap-2 ${selectedProductBackground ? 'text-emerald-400' : 'text-white/40'}`}>
                                                    <div className={`w-2 h-2 rounded-full ${selectedProductBackground ? 'bg-emerald-400' : 'bg-white/20'}`} />
                                                    Fondo Productos: {selectedProductBackground ? selectedProductBackground.name : 'No seleccionado'}
                                                </div>
                                            </div>
                                            {(!selectedHeader || !selectedBanner) && (
                                                <button
                                                    onClick={() => setActiveTab('assets')}
                                                    className="mt-3 w-full px-3 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-white/60 text-xs transition-colors"
                                                >
                                                    Ir a Assets
                                                </button>
                                            )}
                                        </div>

                                        {/* Text module */}
                                        <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
                                            <h3 className="text-white font-medium mb-3 flex items-center gap-2">
                                                <FileText size={16} className="text-emerald-400" />
                                                Texto Promocional
                                            </h3>
                                            <textarea
                                                value={textContent}
                                                onChange={e => setTextContent(e.target.value)}
                                                rows={3}
                                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:border-emerald-500/50 outline-none resize-none text-sm"
                                            />
                                        </div>

                                        {/* Disclaimer */}
                                        <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
                                            <h3 className="text-white font-medium mb-3">Disclaimer Legal</h3>
                                            <textarea
                                                value={disclaimerText}
                                                onChange={e => setDisclaimerText(e.target.value)}
                                                rows={3}
                                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white/70 placeholder-white/30 focus:border-emerald-500/50 outline-none resize-none text-xs"
                                            />
                                        </div>

                                        {/* Social Networks */}
                                        <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
                                            <h3 className="text-white font-medium mb-3">Redes Sociales</h3>
                                            <div className="flex flex-wrap gap-2">
                                                {Object.entries(socialNetworks).map(([network, active]) => (
                                                    <button
                                                        key={network}
                                                        onClick={() => setSocialNetworks(prev => ({ ...prev, [network]: !active }))}
                                                        className={`px-4 py-2 rounded-lg text-sm capitalize transition-all ${active
                                                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                                                            : 'bg-white/5 text-white/40 border border-white/10'
                                                            }`}
                                                    >
                                                        {network}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Right column - Product Selection */}
                                    <div className="lg:col-span-2 bg-white/5 border border-white/10 rounded-2xl p-4">
                                        <div className="flex justify-between items-center mb-4">
                                            <h3 className="text-white font-medium flex items-center gap-2">
                                                <Package size={16} className="text-emerald-400" />
                                                Productos Seleccionados ({selectedProducts.length})
                                            </h3>
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => setShowTextImportModal(true)}
                                                    className="px-3 py-2 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-400 hover:to-purple-400 rounded-lg text-white text-xs font-medium flex items-center gap-1.5 transition-all"
                                                >
                                                    <Sparkles size={14} />
                                                    Pegar Listado
                                                </button>
                                                <div className="relative">
                                                    <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
                                                    <input
                                                        type="text"
                                                        value={searchQuery}
                                                        onChange={e => setSearchQuery(e.target.value)}
                                                        placeholder="Buscar producto..."
                                                        className="pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm placeholder-white/30 focus:border-emerald-500/50 outline-none w-48"
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        {products.length === 0 ? (
                                            <div className="text-center py-12">
                                                <Package size={48} className="mx-auto text-white/10 mb-4" />
                                                <p className="text-white/40 mb-4">No hay productos. Agrégalos en la pestaña "Productos"</p>
                                                <button
                                                    onClick={() => setActiveTab('products')}
                                                    className="px-4 py-2 bg-emerald-500/20 text-emerald-400 rounded-lg text-sm hover:bg-emerald-500/30 transition-colors"
                                                >
                                                    Ir a Productos
                                                </button>
                                            </div>
                                        ) : (
                                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 max-h-[500px] overflow-y-auto pr-2">
                                                {filteredProducts.map(product => (
                                                    <ProductCard
                                                        key={product.id}
                                                        product={product}
                                                        selected={selectedProducts.some(p => p.id === product.id)}
                                                        onSelect={toggleProductSelection}
                                                        onEdit={(p) => { setEditingProduct(p); setShowProductModal(true); }}
                                                        onDelete={handleDeleteProduct}
                                                    />
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </motion.div>
                            )}

                            {/* PRODUCTS TAB */}
                            {activeTab === 'products' && (
                                <motion.div
                                    key="products"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                >
                                    <div className="flex justify-between items-center mb-6">
                                        <div>
                                            <h2 className="text-2xl font-bold text-white">Catálogo de Productos</h2>
                                            <p className="text-white/50 text-sm mt-1">Gestiona los productos disponibles para mailings</p>
                                        </div>
                                        <button
                                            onClick={() => { setEditingProduct(null); setShowProductModal(true); }}
                                            className="px-5 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 rounded-xl text-white font-medium flex items-center gap-2 transition-all shadow-lg shadow-emerald-500/25"
                                        >
                                            <Plus size={20} />
                                            Nuevo Producto
                                        </button>
                                    </div>

                                    {products.length === 0 ? (
                                        <div className="text-center py-20 bg-white/5 border border-white/10 rounded-2xl">
                                            <Sparkles size={64} className="mx-auto text-white/10 mb-4" />
                                            <h3 className="text-xl text-white/60 mb-2">Sin productos todavía</h3>
                                            <p className="text-white/40 mb-6">Agrega tu primer producto para comenzar a crear mailings</p>
                                            <button
                                                onClick={() => { setEditingProduct(null); setShowProductModal(true); }}
                                                className="px-6 py-3 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-xl hover:bg-emerald-500/30 transition-colors inline-flex items-center gap-2"
                                            >
                                                <Plus size={20} />
                                                Agregar Producto
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                                            {products.map(product => (
                                                <ProductCard
                                                    key={product.id}
                                                    product={product}
                                                    onEdit={(p) => { setEditingProduct(p); setShowProductModal(true); }}
                                                    onDelete={handleDeleteProduct}
                                                />
                                            ))}
                                        </div>
                                    )}
                                </motion.div>
                            )}

                            {/* ASSETS TAB */}
                            {activeTab === 'assets' && (
                                <motion.div
                                    key="assets"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    className="space-y-8"
                                >
                                    {/* Headers Section */}
                                    <AssetSection
                                        title="Headers"
                                        description="Genera headers automáticamente o sube tu propio diseño"
                                        type="header"
                                        assets={assets.headers}
                                        onGenerateHeader={() => setShowHeaderGenerator(true)}
                                        onUpload={async (file, name) => {
                                            const result = await uploadMailingImage(file, 'headers', `${Date.now()}-${file.name}`);
                                            if (result.success) {
                                                await createMailingAsset({
                                                    name: name || file.name,
                                                    type: 'header',
                                                    image_url: result.url,
                                                    width: 1200
                                                });
                                                loadAssets();
                                            }
                                        }}
                                        onDelete={async (id) => {
                                            if (confirm('¿Eliminar este asset?')) {
                                                await deleteMailingAsset(id);
                                                loadAssets();
                                            }
                                        }}
                                        onSelect={(asset) => setSelectedHeader(asset)}
                                        selected={selectedHeader}
                                    />

                                    {/* Banners Section */}
                                    <AssetSection
                                        title="Banners Principales"
                                        description="Imagen principal de campaña (Summer Click, Black Friday, etc.)"
                                        type="banner"
                                        assets={assets.banners}
                                        onUpload={async (file, name) => {
                                            const result = await uploadMailingImage(file, 'banners', `${Date.now()}-${file.name}`);
                                            if (result.success) {
                                                await createMailingAsset({
                                                    name: name || file.name,
                                                    type: 'banner',
                                                    image_url: result.url,
                                                    width: 1200
                                                });
                                                loadAssets();
                                            }
                                        }}
                                        onDelete={async (id) => {
                                            if (confirm('¿Eliminar este asset?')) {
                                                await deleteMailingAsset(id);
                                                loadAssets();
                                            }
                                        }}
                                        onSelect={(asset) => setSelectedBanner(asset)}
                                        selected={selectedBanner}
                                    />

                                    {/* Offer Banners Section */}
                                    <AssetSection
                                        title="Banners de Oferta"
                                        description="Banners secundarios (Lentes 20% dcto, Accesorios, etc.)"
                                        type="offer_banner"
                                        assets={assets.offers}
                                        onUpload={async (file, name) => {
                                            const result = await uploadMailingImage(file, 'offers', `${Date.now()}-${file.name}`);
                                            if (result.success) {
                                                await createMailingAsset({
                                                    name: name || file.name,
                                                    type: 'offer_banner',
                                                    image_url: result.url,
                                                    width: 1200
                                                });
                                                loadAssets();
                                            }
                                        }}
                                        onDelete={async (id) => {
                                            if (confirm('¿Eliminar este asset?')) {
                                                await deleteMailingAsset(id);
                                                loadAssets();
                                            }
                                        }}
                                        onSelect={(asset) => setSelectedOfferBanner(asset)}
                                        selected={selectedOfferBanner}
                                    />

                                    {/* Product Background Section */}
                                    <AssetSection
                                        title="Fondo de Productos"
                                        description="Imagen de fondo que se aplica al grupo completo de productos del mailing"
                                        type="product_background"
                                        assets={assets.productBackgrounds}
                                        onUpload={async (file, name) => {
                                            const result = await uploadMailingImage(file, 'product-backgrounds', `${Date.now()}-${file.name}`);
                                            if (result.success) {
                                                await createMailingAsset({
                                                    name: name || file.name,
                                                    type: 'product_background',
                                                    image_url: result.url,
                                                    width: 1200
                                                });
                                                loadAssets();
                                            }
                                        }}
                                        onDelete={async (id) => {
                                            if (confirm('¿Eliminar este asset?')) {
                                                await deleteMailingAsset(id);
                                                loadAssets();
                                            }
                                        }}
                                        onSelect={(asset) => setSelectedProductBackground(asset)}
                                        selected={selectedProductBackground}
                                    />
                                </motion.div>
                            )}

                            {/* HISTORY TAB */}
                            {activeTab === 'history' && (
                                <motion.div
                                    key="history"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                >
                                    <div className="flex justify-between items-center mb-6">
                                        <div>
                                            <h2 className="text-2xl font-bold text-white">Historial de Mailings</h2>
                                            <p className="text-white/50 text-sm mt-1">Mailings guardados que puedes editar y reutilizar</p>
                                        </div>
                                        <button
                                            onClick={handleNewMailing}
                                            className="px-5 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 rounded-xl text-white font-medium flex items-center gap-2 transition-all shadow-lg shadow-emerald-500/25"
                                        >
                                            <Plus size={20} />
                                            Nuevo Mailing
                                        </button>
                                    </div>

                                    {mailingHistory.length === 0 ? (
                                        <div className="text-center py-20 bg-white/5 border border-white/10 rounded-2xl">
                                            <History size={64} className="mx-auto text-white/10 mb-4" />
                                            <h3 className="text-xl text-white/60 mb-2">Sin mailings guardados</h3>
                                            <p className="text-white/40 mb-6">Los mailings que guardes aparecerán aquí para poder editarlos</p>
                                            <button
                                                onClick={() => setActiveTab('create')}
                                                className="px-6 py-3 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-xl hover:bg-emerald-500/30 transition-colors inline-flex items-center gap-2"
                                            >
                                                <Mail size={20} />
                                                Crear Mailing
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="space-y-4">
                                            {mailingHistory.map(mailing => (
                                                <motion.div
                                                    key={mailing.id}
                                                    layout
                                                    initial={{ opacity: 0, y: 20 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    className={`bg-white/5 border rounded-2xl p-5 transition-all ${
                                                        editingMailingId === mailing.id 
                                                            ? 'border-emerald-500/50 ring-2 ring-emerald-500/20' 
                                                            : 'border-white/10 hover:border-white/20'
                                                    }`}
                                                >
                                                    <div className="flex gap-5">
                                                        {/* Preview thumbnail */}
                                                        <div className="w-48 h-32 bg-white/5 rounded-xl overflow-hidden flex-shrink-0">
                                                            {mailing.header_image_url ? (
                                                                <img 
                                                                    src={mailing.header_image_url} 
                                                                    alt={mailing.name}
                                                                    className="w-full h-full object-cover"
                                                                />
                                                            ) : (
                                                                <div className="w-full h-full flex items-center justify-center">
                                                                    <Mail size={32} className="text-white/20" />
                                                                </div>
                                                            )}
                                                        </div>

                                                        {/* Info */}
                                                        <div className="flex-1 min-w-0">
                                                            <div className="flex items-start justify-between gap-4">
                                                                <div>
                                                                    <h3 className="text-lg font-semibold text-white truncate">{mailing.name}</h3>
                                                                    <div className="flex items-center gap-3 mt-1">
                                                                        <span className="text-xs text-white/40 flex items-center gap-1">
                                                                            <Clock size={12} />
                                                                            {new Date(mailing.created_at).toLocaleDateString('es-CL', {
                                                                                day: '2-digit',
                                                                                month: 'short',
                                                                                year: 'numeric',
                                                                                hour: '2-digit',
                                                                                minute: '2-digit'
                                                                            })}
                                                                        </span>
                                                                        <span className={`text-xs px-2 py-0.5 rounded-full ${
                                                                            mailing.status === 'sent' 
                                                                                ? 'bg-blue-500/20 text-blue-400' 
                                                                                : mailing.status === 'archived'
                                                                                    ? 'bg-gray-500/20 text-gray-400'
                                                                                    : 'bg-yellow-500/20 text-yellow-400'
                                                                        }`}>
                                                                            {mailing.status === 'sent' ? 'Enviado' : mailing.status === 'archived' ? 'Archivado' : 'Borrador'}
                                                                        </span>
                                                                    </div>
                                                                </div>

                                                                {/* Status actions */}
                                                                <div className="flex items-center gap-1">
                                                                    {mailing.status !== 'sent' && (
                                                                        <button
                                                                            onClick={() => handleUpdateStatus(mailing.id, 'sent')}
                                                                            className="p-2 hover:bg-blue-500/20 rounded-lg text-white/40 hover:text-blue-400 transition-colors"
                                                                            title="Marcar como enviado"
                                                                        >
                                                                            <Send size={16} />
                                                                        </button>
                                                                    )}
                                                                    {mailing.status !== 'archived' && (
                                                                        <button
                                                                            onClick={() => handleUpdateStatus(mailing.id, 'archived')}
                                                                            className="p-2 hover:bg-gray-500/20 rounded-lg text-white/40 hover:text-gray-400 transition-colors"
                                                                            title="Archivar"
                                                                        >
                                                                            <Archive size={16} />
                                                                        </button>
                                                                    )}
                                                                    {mailing.status !== 'draft' && (
                                                                        <button
                                                                            onClick={() => handleUpdateStatus(mailing.id, 'draft')}
                                                                            className="p-2 hover:bg-yellow-500/20 rounded-lg text-white/40 hover:text-yellow-400 transition-colors"
                                                                            title="Volver a borrador"
                                                                        >
                                                                            <RotateCcw size={16} />
                                                                        </button>
                                                                    )}
                                                                </div>
                                                            </div>

                                                            {/* Products summary */}
                                                            <div className="mt-3">
                                                                <p className="text-sm text-white/50">
                                                                    {mailing.product_ids?.length || 0} productos
                                                                </p>
                                                                {mailing.products_snapshot && mailing.products_snapshot.length > 0 && (
                                                                    <div className="flex gap-1 mt-2 flex-wrap">
                                                                        {mailing.products_snapshot.slice(0, 5).map((product, idx) => (
                                                                            <span key={idx} className="text-xs bg-white/5 px-2 py-1 rounded text-white/60 truncate max-w-[120px]">
                                                                                {product.name}
                                                                            </span>
                                                                        ))}
                                                                        {mailing.products_snapshot.length > 5 && (
                                                                            <span className="text-xs bg-white/5 px-2 py-1 rounded text-white/40">
                                                                                +{mailing.products_snapshot.length - 5} más
                                                                            </span>
                                                                        )}
                                                                    </div>
                                                                )}
                                                            </div>

                                                            {/* Actions */}
                                                            <div className="flex gap-2 mt-4">
                                                                <button
                                                                    onClick={() => handleLoadMailing(mailing)}
                                                                    className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 rounded-lg text-white text-sm font-medium flex items-center gap-2 transition-all"
                                                                >
                                                                    <Edit3 size={14} />
                                                                    Editar
                                                                </button>
                                                                <button
                                                                    onClick={() => {
                                                                        if (mailing.generated_html) {
                                                                            setGeneratedHtml(mailing.generated_html);
                                                                            setShowPreview(true);
                                                                        }
                                                                    }}
                                                                    disabled={!mailing.generated_html}
                                                                    className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-white/70 text-sm flex items-center gap-2 transition-colors disabled:opacity-50"
                                                                >
                                                                    <Eye size={14} />
                                                                    Ver HTML
                                                                </button>
                                                                <button
                                                                    onClick={() => {
                                                                        if (mailing.generated_html) {
                                                                            const blob = new Blob([mailing.generated_html], { type: 'text/html' });
                                                                            const url = URL.createObjectURL(blob);
                                                                            const a = document.createElement('a');
                                                                            a.href = url;
                                                                            a.download = `${mailing.name.replace(/\s+/g, '-').toLowerCase()}.html`;
                                                                            a.click();
                                                                            URL.revokeObjectURL(url);
                                                                        }
                                                                    }}
                                                                    disabled={!mailing.generated_html}
                                                                    className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-white/70 text-sm flex items-center gap-2 transition-colors disabled:opacity-50"
                                                                >
                                                                    <Download size={14} />
                                                                    Descargar
                                                                </button>
                                                                <button
                                                                    onClick={() => handleDeleteMailing(mailing.id)}
                                                                    className="px-4 py-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 rounded-lg text-red-400 text-sm flex items-center gap-2 transition-colors ml-auto"
                                                                >
                                                                    <Trash2 size={14} />
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            ))}
                                        </div>
                                    )}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </main>

                {/* Footer */}
                <footer className="px-6 py-6 mt-auto">
                    <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
                        <div className="flex items-center gap-6">
                            <img src="/assets/logoatlas.png" alt="Atlas" className="h-5 w-auto brightness-0 invert opacity-20 hover:opacity-40 transition-opacity" />
                            <img src="/assets/logo-rojo.png" alt="Canon" className="h-3 w-auto brightness-0 invert opacity-20 hover:opacity-40 transition-opacity" />
                        </div>
                        <p className="text-white/20 text-xs">
                            Creado por <span className="text-white/40">javohv</span> para Atlas & Canon • {new Date().getFullYear()}
                        </p>
                    </div>
                </footer>
            </div>

            {/* Product Modal */}
            <AnimatePresence>
                {showProductModal && (
                    <ProductModal
                        product={editingProduct}
                        onSave={handleSaveProduct}
                        onClose={() => { setShowProductModal(false); setEditingProduct(null); }}
                    />
                )}
            </AnimatePresence>

            {/* Preview Modal */}
            <AnimatePresence>
                {showPreview && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                        onClick={() => setShowPreview(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-white rounded-2xl shadow-2xl max-w-[1500px] w-full max-h-[90vh] overflow-hidden flex"
                            onClick={e => e.stopPropagation()}
                        >
                            {/* Color Settings Panel */}
                            <div className="w-72 bg-[#1a1a2e] border-r border-white/10 p-5 flex flex-col">
                                <h4 className="text-white font-semibold mb-4 flex items-center gap-2">
                                    <Palette size={18} className="text-emerald-400" />
                                    Colores del Mailing
                                </h4>
                                
                                {/* Color del texto */}
                                <div className="mb-5">
                                    <label className="block text-xs text-white/60 mb-2">Color del texto</label>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => updateColorsAndPreview({ ...mailingColors, textColor: '#000000' })}
                                            className={`flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg border transition-all text-sm ${mailingColors.textColor === '#000000' ? 'bg-white text-black border-emerald-500' : 'bg-white/10 text-white border-white/20 hover:border-white/40'}`}
                                        >
                                            <div className="w-4 h-4 rounded-full bg-black border border-white/30"></div>
                                            Negro
                                        </button>
                                        <button
                                            onClick={() => updateColorsAndPreview({ ...mailingColors, textColor: '#FFFFFF' })}
                                            className={`flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg border transition-all text-sm ${mailingColors.textColor === '#FFFFFF' ? 'bg-white/20 text-white border-emerald-500' : 'bg-white/10 text-white border-white/20 hover:border-white/40'}`}
                                        >
                                            <div className="w-4 h-4 rounded-full bg-white border border-white/30"></div>
                                            Blanco
                                        </button>
                                    </div>
                                </div>

                                {/* Color de precios */}
                                <div className="mb-5">
                                    <label className="block text-xs text-white/60 mb-2">Color de precios</label>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => updateColorsAndPreview({ ...mailingColors, priceColor: '#000000' })}
                                            className={`flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg border transition-all text-sm ${mailingColors.priceColor === '#000000' ? 'bg-white text-black border-emerald-500' : 'bg-white/10 text-white border-white/20 hover:border-white/40'}`}
                                        >
                                            <div className="w-4 h-4 rounded-full bg-black border border-white/30"></div>
                                            Negro
                                        </button>
                                        <button
                                            onClick={() => updateColorsAndPreview({ ...mailingColors, priceColor: '#FFFFFF' })}
                                            className={`flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg border transition-all text-sm ${mailingColors.priceColor === '#FFFFFF' ? 'bg-white/20 text-white border-emerald-500' : 'bg-white/10 text-white border-white/20 hover:border-white/40'}`}
                                        >
                                            <div className="w-4 h-4 rounded-full bg-white border border-white/30"></div>
                                            Blanco
                                        </button>
                                    </div>
                                </div>

                                {/* Color fondo subtítulo */}
                                <div className="mb-5">
                                    <label className="block text-xs text-white/60 mb-2">Color fondo subtítulo</label>
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="color"
                                            value={mailingColors.subtitleBgColor}
                                            onChange={e => updateColorsAndPreview({ ...mailingColors, subtitleBgColor: e.target.value })}
                                            className="w-12 h-10 rounded-lg cursor-pointer border-2 border-white/20"
                                        />
                                        <input
                                            type="text"
                                            value={mailingColors.subtitleBgColor}
                                            onChange={e => updateColorsAndPreview({ ...mailingColors, subtitleBgColor: e.target.value })}
                                            placeholder="#cc0000"
                                            className="flex-1 px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/30 focus:border-emerald-500/50 outline-none font-mono text-sm"
                                        />
                                    </div>
                                    {/* Preview pill */}
                                    <div className="mt-3">
                                        <span 
                                            style={{ backgroundColor: mailingColors.subtitleBgColor }}
                                            className="inline-block text-white text-xs px-4 py-1.5 rounded-full"
                                        >
                                            Subtítulo ejemplo
                                        </span>
                                    </div>
                                </div>

                                {/* Presets rápidos */}
                                <div className="pt-4 border-t border-white/10">
                                    <label className="block text-xs text-white/60 mb-2">Presets rápidos</label>
                                    <div className="grid grid-cols-2 gap-2">
                                        <button
                                            onClick={() => updateColorsAndPreview({ textColor: '#000000', priceColor: '#000000', subtitleBgColor: '#cc0000' })}
                                            className="px-3 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-xs text-white/70 transition-colors"
                                        >
                                            🌞 Fondo claro
                                        </button>
                                        <button
                                            onClick={() => updateColorsAndPreview({ textColor: '#FFFFFF', priceColor: '#FFFFFF', subtitleBgColor: '#cc0000' })}
                                            className="px-3 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-xs text-white/70 transition-colors"
                                        >
                                            🌙 Fondo oscuro
                                        </button>
                                    </div>
                                </div>

                                {/* Lista de productos para editar */}
                                {selectedProducts.length > 0 && (
                                    <div className="mt-4 pt-4 border-t border-white/10 flex-1 overflow-hidden flex flex-col">
                                        <label className="block text-xs text-white/60 mb-2 flex items-center gap-2">
                                            <Package size={14} />
                                            Productos ({selectedProducts.length})
                                        </label>
                                        <div className="flex-1 overflow-y-auto space-y-2 pr-1">
                                            {selectedProducts.map((product, idx) => (
                                                <div 
                                                    key={product.id}
                                                    className="flex items-center gap-2 p-2 bg-white/5 rounded-lg hover:bg-white/10 transition-colors group"
                                                >
                                                    <span className="text-white/30 text-xs w-4">{idx + 1}</span>
                                                    {product.image_url ? (
                                                        <img 
                                                            src={product.image_url} 
                                                            alt={product.name}
                                                            className="w-10 h-10 object-contain bg-white/10 rounded"
                                                        />
                                                    ) : (
                                                        <div className="w-10 h-10 bg-white/10 rounded flex items-center justify-center">
                                                            <ImageIcon size={14} className="text-white/30" />
                                                        </div>
                                                    )}
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-white text-xs truncate">{product.name}</p>
                                                        {product.subtitle && (
                                                            <p className="text-white/40 text-[10px] truncate">{product.subtitle}</p>
                                                        )}
                                                    </div>
                                                    <button
                                                        onClick={() => {
                                                            setEditingProduct(product);
                                                            setShowProductModal(true);
                                                        }}
                                                        className="p-1.5 text-white/40 hover:text-emerald-400 hover:bg-white/10 rounded transition-colors opacity-0 group-hover:opacity-100"
                                                        title="Editar producto"
                                                    >
                                                        <Edit3 size={14} />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Preview Area */}
                            <div className="flex-1 flex flex-col">
                                <div className="bg-gray-100 px-6 py-4 flex justify-between items-center border-b">
                                    <h3 className="font-semibold text-gray-800">Vista Previa del Mailing</h3>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={handleDownload}
                                            className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg text-sm flex items-center gap-2 transition-colors"
                                        >
                                            <Download size={16} />
                                            Descargar
                                        </button>
                                        <button
                                            onClick={() => setShowPreview(false)}
                                            className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                                        >
                                            <X size={20} className="text-gray-500" />
                                        </button>
                                    </div>
                                </div>
                                <div className="overflow-auto flex-1 bg-gray-200 p-4">
                                    <iframe
                                        srcDoc={generatedHtml}
                                        className="w-[1200px] mx-auto bg-white shadow-xl"
                                        style={{ minHeight: '800px', border: 'none' }}
                                        title="Mailing Preview"
                                    />
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}

                {/* Header Generator Modal */}
                {showHeaderGenerator && (
                    <HeaderGenerator
                        onGenerate={handleGenerateHeader}
                        onCancel={() => setShowHeaderGenerator(false)}
                    />
                )}

                {/* Text Import Modal */}
                {showTextImportModal && (
                    <TextImportModal
                        onImport={(products) => {
                            // Add imported products to selected products for the current mailing
                            const newSelected = [...selectedProducts];
                            products.forEach(product => {
                                if (!newSelected.some(p => p.id === product.id)) {
                                    newSelected.push(product);
                                }
                            });
                            setSelectedProducts(newSelected);
                            setShowTextImportModal(false);
                        }}
                        onClose={() => setShowTextImportModal(false)}
                    />
                )}

                {/* Save Mailing Modal */}
                {showSaveModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                        onClick={() => setShowSaveModal(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-[#12121a] rounded-2xl shadow-2xl max-w-md w-full overflow-hidden border border-white/10"
                            onClick={e => e.stopPropagation()}
                        >
                            <div className="p-6 border-b border-white/10">
                                <h2 className="text-xl font-semibold text-white">
                                    {editingMailingId ? 'Actualizar Mailing' : 'Guardar Mailing'}
                                </h2>
                                <p className="text-sm text-white/50 mt-1">
                                    {editingMailingId ? 'Actualiza los cambios del mailing' : 'Guarda este mailing para editarlo después'}
                                </p>
                            </div>

                            <div className="p-6 space-y-4">
                                <div>
                                    <label className="block text-sm text-white/70 mb-2">Nombre del Mailing *</label>
                                    <input
                                        type="text"
                                        value={mailingName}
                                        onChange={e => setMailingName(e.target.value)}
                                        placeholder="Ej: Black Friday - Cámaras"
                                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20 outline-none"
                                        autoFocus
                                    />
                                </div>

                                <div className="bg-white/5 rounded-xl p-4 space-y-2">
                                    <p className="text-sm text-white/70">Resumen:</p>
                                    <div className="text-xs text-white/50 space-y-1">
                                        <p>• {selectedProducts.length} productos</p>
                                        <p>• Header: {selectedHeader ? selectedHeader.name : 'No seleccionado'}</p>
                                        <p>• Banner: {selectedBanner ? selectedBanner.name : 'No seleccionado'}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="p-6 border-t border-white/10 flex gap-3">
                                <button
                                    onClick={() => setShowSaveModal(false)}
                                    className="flex-1 px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-white transition-colors"
                                >
                                    Cancelar
                                </button>
                                <button
                                    onClick={() => handleSaveMailing(mailingName)}
                                    disabled={!mailingName.trim() || savingMailing}
                                    className="flex-1 px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 disabled:from-gray-600 disabled:to-gray-700 rounded-xl text-white font-medium flex items-center justify-center gap-2 transition-all disabled:cursor-not-allowed"
                                >
                                    {savingMailing ? (
                                        <>
                                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                            Guardando...
                                        </>
                                    ) : (
                                        <>
                                            <Save size={18} />
                                            {editingMailingId ? 'Actualizar' : 'Guardar'}
                                        </>
                                    )}
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default MailingMaker;
