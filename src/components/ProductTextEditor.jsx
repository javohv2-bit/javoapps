/**
 * ProductTextEditor - Editor de textos de producto con formato
 * Permite editar textos con formato básico (negrita, cursiva, etc.)
 */
import React, { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    X, 
    Save, 
    Bold, 
    Italic, 
    Underline,
    List,
    AlignLeft,
    AlignCenter,
    Type,
    Loader2,
    Check,
    AlertCircle,
    Undo,
    Redo
} from 'lucide-react';

const CANON_RED = "#C41230";

/**
 * Mini editor de texto con formato básico
 */
const RichTextArea = ({ value, onChange, placeholder, rows = 4 }) => {
    const editorRef = useRef(null);
    const [isFocused, setIsFocused] = useState(false);

    // Aplicar formato al texto seleccionado
    const applyFormat = (command, value = null) => {
        document.execCommand(command, false, value);
        // Actualizar el valor después de aplicar formato
        if (editorRef.current) {
            onChange(editorRef.current.innerHTML);
        }
    };

    const handleInput = () => {
        if (editorRef.current) {
            onChange(editorRef.current.innerHTML);
        }
    };

    return (
        <div className={`rounded-xl border transition-colors ${
            isFocused ? 'border-white/30' : 'border-white/10'
        }`}>
            {/* Toolbar */}
            <div className="flex items-center gap-1 p-2 border-b border-white/10 bg-white/5 rounded-t-xl">
                <button
                    type="button"
                    onClick={() => applyFormat('bold')}
                    className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                    title="Negrita (Ctrl+B)"
                >
                    <Bold size={16} className="text-white/70" />
                </button>
                <button
                    type="button"
                    onClick={() => applyFormat('italic')}
                    className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                    title="Cursiva (Ctrl+I)"
                >
                    <Italic size={16} className="text-white/70" />
                </button>
                <button
                    type="button"
                    onClick={() => applyFormat('underline')}
                    className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                    title="Subrayado (Ctrl+U)"
                >
                    <Underline size={16} className="text-white/70" />
                </button>
                <div className="w-px h-5 bg-white/10 mx-1" />
                <button
                    type="button"
                    onClick={() => applyFormat('insertUnorderedList')}
                    className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                    title="Lista"
                >
                    <List size={16} className="text-white/70" />
                </button>
                <div className="w-px h-5 bg-white/10 mx-1" />
                <button
                    type="button"
                    onClick={() => applyFormat('justifyLeft')}
                    className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                    title="Alinear izquierda"
                >
                    <AlignLeft size={16} className="text-white/70" />
                </button>
                <button
                    type="button"
                    onClick={() => applyFormat('justifyCenter')}
                    className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                    title="Centrar"
                >
                    <AlignCenter size={16} className="text-white/70" />
                </button>
                <div className="w-px h-5 bg-white/10 mx-1" />
                <button
                    type="button"
                    onClick={() => applyFormat('undo')}
                    className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                    title="Deshacer"
                >
                    <Undo size={16} className="text-white/70" />
                </button>
                <button
                    type="button"
                    onClick={() => applyFormat('redo')}
                    className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                    title="Rehacer"
                >
                    <Redo size={16} className="text-white/70" />
                </button>
            </div>
            
            {/* Editor Area */}
            <div
                ref={editorRef}
                contentEditable
                className="w-full px-4 py-3 bg-white/5 text-white text-sm focus:outline-none rounded-b-xl min-h-[100px] prose prose-invert prose-sm max-w-none"
                style={{ minHeight: `${rows * 24}px` }}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                onInput={handleInput}
                dangerouslySetInnerHTML={{ __html: value }}
                data-placeholder={placeholder}
            />
        </div>
    );
};

/**
 * Campo de texto simple (sin formato)
 */
const SimpleTextInput = ({ value, onChange, placeholder, multiline = false }) => {
    if (multiline) {
        return (
            <textarea
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-white/30 resize-none"
                placeholder={placeholder}
                rows={3}
            />
        );
    }
    
    return (
        <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-white/30"
            placeholder={placeholder}
        />
    );
};

const ProductTextEditor = ({ 
    isOpen, 
    onClose, 
    productData,
    onSave 
}) => {
    // Estado inicial con los datos del producto
    const [editedData, setEditedData] = useState({
        name: productData?.name || '',
        tagline: productData?.tagline || '',
        description: productData?.description || '',
        keyFeatures: productData?.keyFeatures?.map(f => ({ ...f })) || [],
        sections: productData?.sections?.map(s => ({ ...s })) || []
    });
    
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState(null);
    const [activeTab, setActiveTab] = useState('basic'); // 'basic', 'features', 'sections'

    const showMessage = (text, type = 'success') => {
        setMessage({ text, type });
        setTimeout(() => setMessage(null), 3000);
    };

    // Actualizar campo básico
    const handleUpdateField = (field, value) => {
        setEditedData(prev => ({ ...prev, [field]: value }));
    };

    // Actualizar key feature
    const handleUpdateKeyFeature = (index, field, value) => {
        const updated = [...editedData.keyFeatures];
        updated[index] = { ...updated[index], [field]: value };
        setEditedData(prev => ({ ...prev, keyFeatures: updated }));
    };

    // Actualizar sección
    const handleUpdateSection = (index, field, value) => {
        const updated = [...editedData.sections];
        updated[index] = { ...updated[index], [field]: value };
        setEditedData(prev => ({ ...prev, sections: updated }));
    };

    // Actualizar feature dentro de una sección feature_grid
    const handleUpdateSectionFeature = (sectionIndex, featureIndex, field, value) => {
        const updated = [...editedData.sections];
        const features = [...updated[sectionIndex].features];
        features[featureIndex] = { ...features[featureIndex], [field]: value };
        updated[sectionIndex] = { ...updated[sectionIndex], features };
        setEditedData(prev => ({ ...prev, sections: updated }));
    };

    // Guardar cambios
    const handleSave = async () => {
        setSaving(true);
        try {
            await onSave(editedData);
            showMessage('Textos guardados correctamente');
            setTimeout(() => onClose(), 1500);
        } catch (error) {
            showMessage('Error al guardar los textos', 'error');
        }
        setSaving(false);
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
                onClick={onClose}
            >
                <motion.div
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.95, opacity: 0 }}
                    className="w-full max-w-4xl max-h-[90vh] rounded-3xl overflow-hidden"
                    style={{
                        background: 'linear-gradient(145deg, rgba(30,30,30,0.98) 0%, rgba(20,20,20,0.98) 100%)',
                        border: '1px solid rgba(255,255,255,0.1)'
                    }}
                    onClick={e => e.stopPropagation()}
                >
                    {/* Header */}
                    <div className="flex items-center justify-between p-6 border-b border-white/10">
                        <div>
                            <h2 className="text-xl font-semibold text-white">Editar Textos del Producto</h2>
                            <p className="text-sm text-white/50 mt-1">{productData?.name || 'Producto'}</p>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 rounded-full hover:bg-white/10 transition-colors"
                        >
                            <X size={20} className="text-white/60" />
                        </button>
                    </div>

                    {/* Message Toast */}
                    <AnimatePresence>
                        {message && (
                            <motion.div
                                initial={{ opacity: 0, y: -20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                className={`mx-6 mt-4 p-3 rounded-xl flex items-center gap-2 ${
                                    message.type === 'error' ? 'bg-red-500/20 text-red-400' : 'bg-green-500/20 text-green-400'
                                }`}
                            >
                                {message.type === 'error' ? <AlertCircle size={18} /> : <Check size={18} />}
                                {message.text}
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Tabs */}
                    <div className="flex gap-2 p-4 border-b border-white/10">
                        <button
                            onClick={() => setActiveTab('basic')}
                            className={`px-4 py-2 rounded-lg transition-colors ${
                                activeTab === 'basic' 
                                    ? 'bg-white/10 text-white' 
                                    : 'text-white/50 hover:text-white hover:bg-white/5'
                            }`}
                        >
                            Información Básica
                        </button>
                        <button
                            onClick={() => setActiveTab('features')}
                            className={`px-4 py-2 rounded-lg transition-colors ${
                                activeTab === 'features' 
                                    ? 'bg-white/10 text-white' 
                                    : 'text-white/50 hover:text-white hover:bg-white/5'
                            }`}
                        >
                            Características Clave
                        </button>
                        <button
                            onClick={() => setActiveTab('sections')}
                            className={`px-4 py-2 rounded-lg transition-colors ${
                                activeTab === 'sections' 
                                    ? 'bg-white/10 text-white' 
                                    : 'text-white/50 hover:text-white hover:bg-white/5'
                            }`}
                        >
                            Secciones de Contenido
                        </button>
                    </div>

                    {/* Content */}
                    <div className="p-6 overflow-y-auto max-h-[calc(90vh-280px)]">
                        {/* Basic Info Tab */}
                        {activeTab === 'basic' && (
                            <div className="space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-white/70 mb-2">
                                        Nombre del Producto
                                    </label>
                                    <SimpleTextInput
                                        value={editedData.name}
                                        onChange={(v) => handleUpdateField('name', v)}
                                        placeholder="Ej: EOS R50"
                                    />
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-medium text-white/70 mb-2">
                                        Tagline / Eslogan
                                    </label>
                                    <SimpleTextInput
                                        value={editedData.tagline}
                                        onChange={(v) => handleUpdateField('tagline', v)}
                                        placeholder="Ej: Entra a una Nueva Dimensión"
                                    />
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-medium text-white/70 mb-2">
                                        Descripción
                                    </label>
                                    <RichTextArea
                                        value={editedData.description}
                                        onChange={(v) => handleUpdateField('description', v)}
                                        placeholder="Descripción detallada del producto..."
                                        rows={5}
                                    />
                                </div>
                            </div>
                        )}

                        {/* Key Features Tab */}
                        {activeTab === 'features' && (
                            <div className="space-y-4">
                                <p className="text-sm text-white/50 mb-4">
                                    Las características clave aparecen en el hero del producto.
                                </p>
                                {editedData.keyFeatures.map((feature, index) => (
                                    <div 
                                        key={index}
                                        className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-3"
                                    >
                                        <div className="flex gap-4">
                                            <div className="flex-1">
                                                <label className="block text-xs text-white/50 mb-1">Título</label>
                                                <SimpleTextInput
                                                    value={feature.title}
                                                    onChange={(v) => handleUpdateKeyFeature(index, 'title', v)}
                                                    placeholder="Ej: 24.2MP"
                                                />
                                            </div>
                                            <div className="flex-1">
                                                <label className="block text-xs text-white/50 mb-1">Subtítulo</label>
                                                <SimpleTextInput
                                                    value={feature.subtitle}
                                                    onChange={(v) => handleUpdateKeyFeature(index, 'subtitle', v)}
                                                    placeholder="Ej: Sensor APS-C"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Sections Tab */}
                        {activeTab === 'sections' && (
                            <div className="space-y-6">
                                <p className="text-sm text-white/50 mb-4">
                                    Edita el contenido de las secciones del producto.
                                </p>
                                {editedData.sections.map((section, sectionIndex) => (
                                    <div 
                                        key={section.id || sectionIndex}
                                        className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-4"
                                    >
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs uppercase tracking-wider text-white/40">
                                                {section.type.replace('_', ' ')}
                                            </span>
                                            <span className="text-xs text-white/30">{section.id}</span>
                                        </div>

                                        {/* Hero Section & Image Text */}
                                        {(section.type === 'hero_section' || section.type === 'image_text') && (
                                            <>
                                                <div>
                                                    <label className="block text-xs text-white/50 mb-1">Título</label>
                                                    <SimpleTextInput
                                                        value={section.title || ''}
                                                        onChange={(v) => handleUpdateSection(sectionIndex, 'title', v)}
                                                        placeholder="Título de la sección"
                                                    />
                                                </div>
                                                {section.subtitle && (
                                                    <div>
                                                        <label className="block text-xs text-white/50 mb-1">Subtítulo</label>
                                                        <SimpleTextInput
                                                            value={section.subtitle || ''}
                                                            onChange={(v) => handleUpdateSection(sectionIndex, 'subtitle', v)}
                                                            placeholder="Subtítulo"
                                                        />
                                                    </div>
                                                )}
                                                <div>
                                                    <label className="block text-xs text-white/50 mb-1">Descripción</label>
                                                    <RichTextArea
                                                        value={section.description || ''}
                                                        onChange={(v) => handleUpdateSection(sectionIndex, 'description', v)}
                                                        placeholder="Descripción de la sección"
                                                        rows={3}
                                                    />
                                                </div>
                                            </>
                                        )}

                                        {/* Feature Grid */}
                                        {section.type === 'feature_grid' && section.features && (
                                            <div className="space-y-4">
                                                {section.features.map((feature, featureIndex) => (
                                                    <div 
                                                        key={featureIndex}
                                                        className="p-3 rounded-lg bg-black/20 space-y-2"
                                                    >
                                                        <div>
                                                            <label className="block text-xs text-white/50 mb-1">
                                                                Título de Feature #{featureIndex + 1}
                                                            </label>
                                                            <SimpleTextInput
                                                                value={feature.title || ''}
                                                                onChange={(v) => handleUpdateSectionFeature(sectionIndex, featureIndex, 'title', v)}
                                                                placeholder="Título"
                                                            />
                                                        </div>
                                                        <div>
                                                            <label className="block text-xs text-white/50 mb-1">Descripción</label>
                                                            <SimpleTextInput
                                                                value={feature.description || ''}
                                                                onChange={(v) => handleUpdateSectionFeature(sectionIndex, featureIndex, 'description', v)}
                                                                placeholder="Descripción"
                                                                multiline
                                                            />
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}

                                        {/* Video Section */}
                                        {section.type === 'video' && (
                                            <>
                                                <div>
                                                    <label className="block text-xs text-white/50 mb-1">Título</label>
                                                    <SimpleTextInput
                                                        value={section.title || ''}
                                                        onChange={(v) => handleUpdateSection(sectionIndex, 'title', v)}
                                                        placeholder="Título del video"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-xs text-white/50 mb-1">Descripción</label>
                                                    <SimpleTextInput
                                                        value={section.description || ''}
                                                        onChange={(v) => handleUpdateSection(sectionIndex, 'description', v)}
                                                        placeholder="Descripción del video"
                                                        multiline
                                                    />
                                                </div>
                                            </>
                                        )}

                                        {/* Connectivity */}
                                        {section.type === 'connectivity' && (
                                            <div>
                                                <label className="block text-xs text-white/50 mb-1">Título</label>
                                                <SimpleTextInput
                                                    value={section.title || ''}
                                                    onChange={(v) => handleUpdateSection(sectionIndex, 'title', v)}
                                                    placeholder="Título de conectividad"
                                                />
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-end gap-3 p-6 border-t border-white/10">
                        <button
                            onClick={onClose}
                            className="px-6 py-3 rounded-xl text-white/70 hover:text-white hover:bg-white/5 transition-colors"
                        >
                            Cancelar
                        </button>
                        <button
                            onClick={handleSave}
                            disabled={saving}
                            className="flex items-center gap-2 px-6 py-3 rounded-xl text-white font-medium transition-all disabled:opacity-50"
                            style={{ background: CANON_RED }}
                        >
                            {saving ? (
                                <>
                                    <Loader2 size={18} className="animate-spin" />
                                    Guardando...
                                </>
                            ) : (
                                <>
                                    <Save size={18} />
                                    Guardar Cambios
                                </>
                            )}
                        </button>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default ProductTextEditor;
