import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ModuleSelector from './components/ModuleSelector';
import BlockEditor from './components/BlockEditor';
import HelpPanel from './components/HelpPanel';
import { saveToHistory } from './utils/historyManager';
import InPagePreview from './components/InPagePreview';
import Dashboard from './components/Dashboard';
import { Plus, Download, Package, HelpCircle, Eye, EyeOff, ArrowLeft, Save, CheckCircle, AlertCircle, Tag, Home } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Generation functions
import { generateExcel } from './utils/excelGenerator';
import { generateZip } from './utils/zipGenerator';
import { saveInPage, checkSaveServer } from './utils/saveManager';
import { BADGE_TYPES, BADGE_CONFIG, getProductBadge } from './config/productBadges';

function App() {
    const navigate = useNavigate();
    const canvasRef = React.useRef(null);
    const [sku, setSku] = useState('');
    const [blocks, setBlocks] = useState([]);
    const [showSelector, setShowSelector] = useState(false);
    const [showHelp, setShowHelp] = useState(false);
    const [showPreview, setShowPreview] = useState(false);
    const [generating, setGenerating] = useState(false);
    
    // Additional product metadata
    const [productName, setProductName] = useState('');
    const [productImagePath, setProductImagePath] = useState(null);
    const [productExcelPath, setProductExcelPath] = useState(null);
    const [productId, setProductId] = useState(null);
    const [productBadge, setProductBadge] = useState(null);

    // Save state
    const [saving, setSaving] = useState(false);
    const [saveStatus, setSaveStatus] = useState(null); // 'success' | 'error' | null
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

    // Editor State
    const [isEditorActive, setIsEditorActive] = useState(false);

    // Aurora gradient background animation
    React.useEffect(() => {
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
            
            // BLOB 1: Bottom center - cyan/indigo
            const blob1X = canvas.width * (0.5 + Math.sin(time * 0.8) * 0.25);
            const blob1Y = canvas.height * (0.78 + Math.cos(time * 0.5) * 0.05);
            const grad1 = ctx.createRadialGradient(blob1X, blob1Y, 0, blob1X, blob1Y, canvas.width * 0.5);
            grad1.addColorStop(0, 'rgba(56, 189, 248, 0.15)');
            grad1.addColorStop(0.4, 'rgba(99, 102, 241, 0.08)');
            grad1.addColorStop(1, 'transparent');
            ctx.fillStyle = grad1;
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            // BLOB 2: Top right - purple/pink
            const blob2X = canvas.width * (0.75 + Math.cos(time * 0.6) * 0.15);
            const blob2Y = canvas.height * (0.25 + Math.sin(time * 0.9) * 0.12);
            const grad2 = ctx.createRadialGradient(blob2X, blob2Y, 0, blob2X, blob2Y, canvas.width * 0.4);
            grad2.addColorStop(0, 'rgba(168, 85, 247, 0.10)');
            grad2.addColorStop(0.5, 'rgba(236, 72, 153, 0.05)');
            grad2.addColorStop(1, 'transparent');
            ctx.fillStyle = grad2;
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            // BLOB 3: Left side - teal/emerald
            const blob3X = canvas.width * (0.2 + Math.sin(time * 0.4) * 0.08);
            const blob3Y = canvas.height * (0.55 + Math.cos(time * 0.7) * 0.2);
            const grad3 = ctx.createRadialGradient(blob3X, blob3Y, 0, blob3X, blob3Y, canvas.width * 0.35);
            grad3.addColorStop(0, 'rgba(20, 184, 166, 0.08)');
            grad3.addColorStop(0.5, 'rgba(16, 185, 129, 0.04)');
            grad3.addColorStop(1, 'transparent');
            ctx.fillStyle = grad3;
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            // BLOB 4: Bottom left - amber/orange
            const blob4X = canvas.width * (0.3 + Math.cos(time * 0.35) * 0.12);
            const blob4Y = canvas.height * (0.85 + Math.sin(time * 0.35) * 0.08);
            const grad4 = ctx.createRadialGradient(blob4X, blob4Y, 0, blob4X, blob4Y, canvas.width * 0.3);
            grad4.addColorStop(0, 'rgba(251, 191, 36, 0.06)');
            grad4.addColorStop(0.5, 'rgba(249, 115, 22, 0.03)');
            grad4.addColorStop(1, 'transparent');
            ctx.fillStyle = grad4;
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            // BLOB 5: Top center - blue/cyan
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

    // Load a product from Dashboard (Catalog or History)
    const loadProduct = (item) => {
        if (item.empty) {
            setSku('');
            setBlocks([]);
            setProductName('');
            setProductImagePath(null);
            setProductExcelPath(null);
            setProductId(null);
            setProductBadge(null);
        } else {
            setSku(item.sku);
            setProductName(item.name || '');
            setProductImagePath(item.imagePath || null);
            setProductExcelPath(item.excelPath || null);
            setProductId(item.id || null);
            setProductBadge(getProductBadge(item.id) || null);
            setBlocks(item.blocks.map((b, i) => ({
                ...b,
                id: Date.now().toString() + i,
                // Ensure data clone to avoid reference issues
                data: { ...b.data }
            })));
        }
        setHasUnsavedChanges(false);
        setSaveStatus(null);
        setIsEditorActive(true);
    };

    const addBlock = (module) => {
        const newBlock = {
            id: Date.now().toString(),
            moduleId: module.id,
            data: {}
        };
        setBlocks([...blocks, newBlock]);
        setShowSelector(false);
    };

    const updateBlock = (id, newData) => {
        setBlocks(blocks.map(b => b.id === id ? { ...b, data: newData } : b));
        setHasUnsavedChanges(true);
        setSaveStatus(null);
    };

    const removeBlock = (id) => {
        setBlocks(blocks.filter(b => b.id !== id));
        setHasUnsavedChanges(true);
        setSaveStatus(null);
    };

    // Return to dashboard
    const handleBack = () => {
        if (hasUnsavedChanges) {
            if (window.confirm('¿Seguro que quieres salir? Los cambios no guardados se perderán.')) {
                setIsEditorActive(false);
                setBlocks([]);
                setSku('');
                setProductName('');
                setProductImagePath(null);
                setProductExcelPath(null);
                setProductId(null);
                setProductBadge(null);
                setHasUnsavedChanges(false);
                setSaveStatus(null);
            }
        } else {
            setIsEditorActive(false);
            setProductName('');
            setProductImagePath(null);
            setProductExcelPath(null);
            setProductId(null);
            setProductBadge(null);
        }
    };

    // Save changes to source files
    const handleSaveChanges = async () => {
        if (!sku || blocks.length === 0) return;

        setSaving(true);
        setSaveStatus(null);

        try {
            // Check if save server is running
            await checkSaveServer();

            // Save to source files
            const result = await saveInPage({
                productId,
                sku,
                blocks,
                imagePath: productImagePath,
                excelPath: productExcelPath
            });

            // Update blocks with the new Supabase URLs
            if (result.updatedBlocks) {
                setBlocks(result.updatedBlocks);
            }

            // Also save to history
            saveToHistory(sku, result.updatedBlocks || blocks, {}, productName, productImagePath);

            setSaveStatus('success');
            setHasUnsavedChanges(false);

            // Clear success status after 3 seconds
            setTimeout(() => setSaveStatus(null), 3000);

            console.log('Guardado exitoso:', result);
        } catch (error) {
            console.error('Error al guardar:', error);
            setSaveStatus('error');
            alert(error.message);
        } finally {
            setSaving(false);
        }
    };

    const generateFiles = async () => {
        if (!sku || blocks.length === 0) return;

        setGenerating(true);
        try {
            const excelBuffer = await generateExcel(sku, blocks);
            await generateZip(sku, blocks, excelBuffer);

            // Save to history automatically with metadata
            saveToHistory(sku, blocks, {}, productName, productImagePath);

            alert("¡Pack generado y descargado correctamente!");
        } catch (error) {
            console.error(error);
            alert(`Error al generar archivos: ${error.message}`);
        } finally {
            setGenerating(false);
        }
    };

    // If not in editor mode -> Show Dashboard
    if (!isEditorActive) {
        return (
            <div className="min-h-screen bg-[#0a0a0f] font-sans flex flex-col relative overflow-hidden">
                {/* Aurora animated background */}
                <canvas 
                    ref={canvasRef} 
                    className="absolute inset-0 z-0"
                />
                
                {/* Content */}
                <div className="relative z-10 flex flex-col min-h-screen">
                    {/* Header - White background matching Landing Page */}
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
                                <img src="/assets/logo-atlas.gif" alt="Atlas" className="h-5 w-auto" />
                                <div className="h-4 w-px bg-black/20"></div>
                                <span className="text-xs font-medium tracking-wider text-black/50">
                                    INPAGE MAKER
                                </span>
                            </div>
                            <button
                                onClick={() => setShowHelp(true)}
                                className="p-2 rounded-lg hover:bg-black/5 transition-all cursor-pointer"
                                title="Ayuda"
                            >
                                <HelpCircle size={18} className="text-black/40" />
                            </button>
                        </div>
                    </header>
                    
                    <Dashboard onLoadProduct={loadProduct} />
                    
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
                
                <HelpPanel isOpen={showHelp} onClose={() => setShowHelp(false)} />
            </div>
        );
    }

    // Editor Mode
    return (
        <div className="min-h-screen bg-[#0a0a0f] flex flex-col font-sans relative overflow-hidden">
            {/* Aurora animated background */}
            <canvas 
                ref={canvasRef} 
                className="absolute inset-0 z-0"
            />
            
            <div className="relative z-10 flex flex-col min-h-screen">
            <header className="px-4 py-3 border-b border-white/10 sticky top-0 z-50 bg-[#0a0a0f]/80 backdrop-blur-xl">
                <div className="max-w-5xl mx-auto flex justify-between items-center">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={handleBack}
                            className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-colors flex items-center gap-2 cursor-pointer"
                        >
                            <ArrowLeft size={18} className="text-white/60" />
                            <span className="font-medium text-xs text-white/50">Volver</span>
                        </button>
                        <div className="h-6 w-px bg-white/10"></div>
                        <div className="flex items-center gap-2">
                            <Package className="text-blue-400" size={20} />
                            <h1 className="text-base font-medium text-white">Editor</h1>
                            {productName && (
                                <>
                                    <span className="text-white/20">|</span>
                                    <span className="text-white/50 font-medium text-xs">{productName}</span>
                                </>
                            )}
                        </div>
                        {/* Badge Selector */}
                        {productId && (
                            <div className="ml-2">
                                <select
                                    value={productBadge || ''}
                                    onChange={(e) => setProductBadge(e.target.value || null)}
                                    className={`text-xs px-2 py-1 rounded-lg border cursor-pointer transition-colors ${
                                        productBadge && BADGE_CONFIG[productBadge] 
                                            ? `${BADGE_CONFIG[productBadge].bgClass} ${BADGE_CONFIG[productBadge].textClass} ${BADGE_CONFIG[productBadge].borderClass}`
                                            : 'bg-white/5 text-white/50 border-white/10'
                                    }`}
                                    title="Estado del producto"
                                >
                                    <option value="">Sin estado</option>
                                    <option value={BADGE_TYPES.PENDING_SEND}>Pendiente de enviar</option>
                                    <option value={BADGE_TYPES.NOT_REQUESTED}>Creado no solicitado</option>
                                    <option value={BADGE_TYPES.SENT}>Enviado</option>
                                    <option value={BADGE_TYPES.APPROVED}>Aprobado</option>
                                </select>
                            </div>
                        )}
                    </div>

                    <div className="flex items-center gap-2">
                        {/* Save status indicator */}
                        {saveStatus === 'success' && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="flex items-center gap-1 text-emerald-400 text-xs font-medium bg-emerald-500/20 border border-emerald-500/30 px-3 py-1.5 rounded-lg"
                            >
                                <CheckCircle size={14} />
                                <span>Guardado</span>
                            </motion.div>
                        )}

                        {/* Unsaved changes indicator */}
                        {hasUnsavedChanges && !saveStatus && (
                            <div className="flex items-center gap-1 text-amber-400 text-xs bg-amber-500/20 border border-amber-500/30 px-3 py-1.5 rounded-lg">
                                <div className="w-2 h-2 bg-amber-400 rounded-full animate-pulse"></div>
                                <span>Sin guardar</span>
                            </div>
                        )}

                        {/* Save button */}
                        {(productExcelPath || productImagePath) && (
                            <button
                                onClick={handleSaveChanges}
                                disabled={!sku || blocks.length === 0 || saving || !hasUnsavedChanges}
                                className={'px-4 py-2 rounded-xl font-medium flex items-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer ' + 
                                    (hasUnsavedChanges 
                                        ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/25' 
                                        : 'bg-white/5 text-white/40 border border-white/10'
                                    )
                                }
                                title={productExcelPath ? `Guardar en: ${productExcelPath}` : 'Guardar cambios'}
                            >
                                <Save size={18} className={saving ? 'animate-pulse' : ''} />
                                {saving ? 'Guardando...' : 'Guardar'}
                            </button>
                        )}

                        {/* Preview toggle */}
                        <button
                            onClick={() => setShowPreview(!showPreview)}
                            className={`p-2.5 rounded-xl transition-colors cursor-pointer ${showPreview
                                ? 'text-blue-400 bg-blue-500/20 border border-blue-500/30'
                                : 'text-white/50 hover:text-white/70 bg-white/5 hover:bg-white/10 border border-white/10'
                                }`}
                            title={showPreview ? "Ocultar vista previa" : "Vista previa"}
                            disabled={blocks.length === 0}
                        >
                            {showPreview ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>

                        {/* SKU input */}
                        <div className="w-40">
                            <input
                                className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white focus:bg-white/10 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all placeholder-white/30"
                                placeholder="SKU Global"
                                value={sku}
                                onChange={(e) => setSku(e.target.value)}
                            />
                        </div>

                        {/* Generate button */}
                        <button
                            onClick={generateFiles}
                            disabled={!sku || blocks.length === 0 || generating}
                            className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-400 hover:to-indigo-400 text-white px-5 py-2.5 rounded-xl font-medium flex items-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-500/25 cursor-pointer"
                        >
                            <Download size={18} className={generating ? 'animate-bounce' : ''} />
                            {generating ? 'Generando...' : 'Pack'}
                        </button>
                    </div>
                </div>
            </header>

            <main className="flex-1 max-w-5xl mx-auto w-full px-4 py-8">
                {/* Preview Mode */}
                {showPreview && blocks.length > 0 && (
                    <div className="mb-8">
                        <div className="bg-white rounded-xl shadow-xl overflow-hidden border border-white/10">
                            <div className="bg-gradient-to-r from-lime-400 to-lime-500 px-4 py-2 text-sm font-medium text-black flex items-center justify-between">
                                <span>Vista previa estilo Falabella</span>
                                <button
                                    onClick={() => setShowPreview(false)}
                                    className="text-black/60 hover:text-black cursor-pointer"
                                >
                                    <EyeOff size={16} />
                                </button>
                            </div>
                            <InPagePreview sku={sku} blocks={blocks} />
                        </div>
                    </div>
                )}

                <AnimatePresence>
                    {blocks.length === 0 && (
                        <div className="text-center py-20">
                            <h2 className="text-xl font-medium text-white/20 mb-4">Lienzo Vacío</h2>
                            <button
                                onClick={() => setShowSelector(true)}
                                className="bg-white/5 border-2 border-dashed border-white/10 text-white/40 hover:text-blue-400 hover:border-blue-500/50 px-6 py-3 rounded-xl font-medium transition-all inline-flex items-center gap-2 cursor-pointer"
                            >
                                <Plus size={20} />
                                Agregar Primer Módulo
                            </button>
                        </div>
                    )}

                    <div className="space-y-6">
                        {blocks.map((block, index) => (
                            <BlockEditor
                                key={block.id}
                                block={block}
                                index={index}
                                onUpdate={updateBlock}
                                onRemove={removeBlock}
                            />
                        ))}
                    </div>
                </AnimatePresence>

                {blocks.length > 0 && (
                    <div className="mt-8 flex justify-center">
                        <button
                            onClick={() => setShowSelector(true)}
                            className="bg-white/5 border border-white/10 hover:bg-white/10 text-white/70 px-6 py-3 rounded-full font-medium shadow-lg transition-all flex items-center gap-2 cursor-pointer"
                        >
                            <Plus size={20} />
                            Agregar Módulo
                        </button>
                    </div>
                )}
            </main>

            {/* Module Selector Modal */}
            <AnimatePresence>
                {showSelector && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                        onClick={() => setShowSelector(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-[#12121a] rounded-2xl shadow-2xl max-w-5xl w-full max-h-[80vh] overflow-hidden flex flex-col border border-white/10"
                            onClick={e => e.stopPropagation()}
                        >
                            <div className="p-6 border-b border-white/10 flex justify-between items-center bg-white/[0.02]">
                                <h2 className="text-xl font-medium text-white">Seleccionar Módulo</h2>
                                <button
                                    onClick={() => setShowSelector(false)}
                                    className="text-white/40 hover:text-white/60 cursor-pointer"
                                >
                                    <Plus size={24} className="rotate-45" />
                                </button>
                            </div>
                            <div className="overflow-y-auto p-4 bg-[#0a0a0f]">
                                <ModuleSelector onSelect={addBlock} />
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Help Panel */}
            <HelpPanel isOpen={showHelp} onClose={() => setShowHelp(false)} />
            </div>
        </div>
    );
}

export default App;
