import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Home,
    FileText,
    Upload,
    Download,
    CheckCircle,
    AlertCircle,
    Loader2,
    FileCode,
    Folder,
    Trash2,
    Eye,
    RefreshCw,
    X,
    Code,
    Check,
    Monitor,
    FileType,
    Copy
} from 'lucide-react';
import {
    getComunicados,
    uploadExcelAndCreate,
    uploadPDFAndCreate,
    generateHTML,
    getHTMLDownloadUrl,
    deleteComunicado,
    getStats
} from '../data/comunicadosData';
import { supabase } from '../lib/supabase';
import QuickAppMenu from '../components/QuickAppMenu';

/**
 * Comunicados App - Generador de Comunicados HTML
 * 
 * Design: Dark futuristic with aurora animated background
 * Matches Landing Page design system
 * Accent: Blue/Indigo
 * 
 * Storage: Supabase (archivos Excel y HTMLs generados)
 */
const ComunicadosApp = () => {
    const navigate = useNavigate();
    const canvasRef = useRef(null);
    const fileInputRef = useRef(null);
    
    const [comunicados, setComunicados] = useState([]);
    const [stats, setStats] = useState({ totalComunicados: 0 });
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [generating, setGenerating] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [previewHtml, setPreviewHtml] = useState(null);
    const [showPreview, setShowPreview] = useState(false);
    const [editedData, setEditedData] = useState(null);
    const [hasChanges, setHasChanges] = useState(false);
    const [previewMode, setPreviewMode] = useState('visual'); // 'visual' | 'code' | 'source'
    const [copied, setCopied] = useState(false);

    // Cargar comunicados al montar
    useEffect(() => {
        loadComunicados();
    }, []);

    const loadComunicados = async () => {
        setLoading(true);
        try {
            const data = await getComunicados();
            setComunicados(data);
            const statsData = await getStats();
            setStats(statsData);
        } catch (error) {
            console.error('Error loading comunicados:', error);
        } finally {
            setLoading(false);
        }
    };

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

    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const isExcel = file.name.endsWith('.xlsx');
        const isPDF = file.name.endsWith('.pdf');

        if (!isExcel && !isPDF) {
            alert('Por favor sube un archivo Excel (.xlsx) o PDF (.pdf)');
            return;
        }

        setUploading(true);
        
        try {
            const productName = file.name.replace(/\.(xlsx|pdf)$/i, '');
            
            let result;
            if (isExcel) {
                result = await uploadExcelAndCreate(file, productName);
            } else {
                result = await uploadPDFAndCreate(file, productName);
            }
            
            if (result.success) {
                await loadComunicados(); // Recargar lista
                e.target.value = '';
            } else {
                alert(`Error subiendo archivo: ${result.error}`);
            }
        } catch (error) {
            console.error('Error uploading file:', error);
            alert('Error subiendo archivo');
        } finally {
            setUploading(false);
        }
    };

    const generateHTMLFile = async (comunicadoId) => {
        setGenerating(true);
        setSelectedProduct(comunicadoId);

        try {
            const result = await generateHTML(comunicadoId);
            
            if (result.success) {
                await loadComunicados(); // Recargar lista
            } else {
                alert(`Error generando HTML: ${result.error}`);
            }
        } catch (error) {
            console.error('Error generating HTML:', error);
            alert('Error generando HTML');
        } finally {
            setGenerating(false);
            setSelectedProduct(null);
        }
    };

    const previewHTMLFile = async (comunicadoId) => {
        try {
            const comunicado = comunicados.find(c => c.id === comunicadoId);
            if (!comunicado || !comunicado.html_path) {
                alert('HTML no generado aún');
                return;
            }

            const url = await getHTMLDownloadUrl(comunicadoId);
            const response = await fetch(url);
            const htmlContent = await response.text();
            
            setPreviewHtml({ 
                content: htmlContent, 
                name: comunicado.name,
                excelData: comunicado.excel_data,
                comunicadoId: comunicadoId
            });
            setEditedData(JSON.parse(JSON.stringify(comunicado.excel_data))); // Deep copy
            setHasChanges(false);
            setShowPreview(true);
        } catch (error) {
            console.error('Error loading preview:', error);
            alert('Error cargando preview');
        }
    };

    // Regenerar HTML cuando cambian los datos editados
    useEffect(() => {
        if (editedData && previewHtml) {
            const newHtml = generateHTMLFromEditedData(editedData, previewHtml.name);
            setPreviewHtml(prev => ({ ...prev, content: newHtml }));
            setHasChanges(true);
        }
    }, [editedData]);

    const updateField = (index, key, value) => {
        setEditedData(prev => {
            if (!prev.fields) return prev;
            const newData = { ...prev };
            newData.fields = [...newData.fields];
            newData.fields[index] = { ...newData.fields[index], [key]: value };
            return newData;
        });
    };

    const updateTitle = (value) => {
        setEditedData(prev => ({ ...prev, title: value }));
        setHasChanges(true);
    };

    const updateModuleHeader = (value) => {
        setEditedData(prev => ({ ...prev, moduleHeader: value }));
        setHasChanges(true);
    };

    const updatePDFField = (field, value) => {
        setEditedData(prev => ({ ...prev, [field]: value }));
    };

    const updatePDFEquipmentField = (field, value) => {
        setEditedData(prev => ({
            ...prev,
            equipmentData: { ...prev.equipmentData, [field]: value }
        }));
    };

    const saveChanges = async () => {
        if (!hasChanges || !previewHtml?.comunicadoId) return;

        try {
            const { error } = await supabase
                .from('comunicados')
                .update({ 
                    excel_data: editedData,
                    updated_at: new Date().toISOString()
                })
                .eq('id', previewHtml.comunicadoId);

            if (error) throw error;

            // Regenerar HTML con los nuevos datos
            await generateHTML(previewHtml.comunicadoId);
            await loadComunicados();
            
            setHasChanges(false);
            alert('✅ Cambios guardados y HTML regenerado');
        } catch (error) {
            console.error('Error saving changes:', error);
            alert('Error guardando cambios');
        }
    };

    // Función para generar HTML desde datos editados (cliente)
    const generateHTMLFromEditedData = (data, productName) => {
        // Detectar si es PDF o Excel
        if (data.type === 'pdf') {
            return generateHTMLFromPDFData(data, productName);
        }
        
        // Formato Excel
        const { title, moduleHeader, fields = [] } = data;

        const tableRows = fields.map(field => `
        <tr>
            <td>${field.label}</td>
            <td>${field.value}</td>
            <td>${field.page}</td>
        </tr>
    `).join('');

        return `<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title || productName}</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            max-width: 1200px;
            margin: 0 auto;
            padding: 20px;
            line-height: 1.6;
        }
        .text-align-center {
            text-align: center;
        }
        h4 {
            color: #333;
            margin-top: 30px;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin: 20px 0;
        }
        td {
            padding: 10px;
            border: 1px solid #ddd;
        }
        tr:nth-child(even) {
            background-color: #f9f9f9;
        }
    </style>
</head>
<body>
    <p class="text-align-center"><strong>${title || productName}</strong></p>
    ${moduleHeader ? `<h4>${moduleHeader}</h4>` : ''}
    <table>
        ${tableRows}
    </table>
</body>
</html>`;
    };

    // Función para generar HTML desde datos de PDF - Formato formal/clásico
    const generateHTMLFromPDFData = (pdfData, productName) => {
        const { ordNumber, date, from, to, subject, equipmentData = {} } = pdfData;

        // Construir filas de la tabla de equipo
        const equipmentRows = [];
        if (equipmentData.tipo) equipmentRows.push(`<tr><td>Tipo de Equipo</td><td>${equipmentData.tipo}</td></tr>`);
        if (equipmentData.marca) equipmentRows.push(`<tr><td>Marca</td><td>${equipmentData.marca}</td></tr>`);
        if (equipmentData.modelo) equipmentRows.push(`<tr><td>Modelo</td><td>${equipmentData.modelo}</td></tr>`);
        if (equipmentData.fabricante) equipmentRows.push(`<tr><td>Fabricante</td><td>${equipmentData.fabricante}</td></tr>`);
        if (equipmentData.frecuencias) equipmentRows.push(`<tr><td>Frecuencias de Operación</td><td>${equipmentData.frecuencias}</td></tr>`);
        if (equipmentData.potencia) equipmentRows.push(`<tr><td>Potencia Máxima Radiada</td><td>${equipmentData.potencia}</td></tr>`);
        if (equipmentData.restricciones) equipmentRows.push(`<tr><td>Restricciones</td><td>${equipmentData.restricciones}</td></tr>`);

        return `<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${productName} - Certificado SUBTEL</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            max-width: 1200px;
            margin: 0 auto;
            padding: 20px;
            line-height: 1.6;
        }
        .text-align-center {
            text-align: center;
        }
        h4 {
            color: #333;
            margin-top: 30px;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin: 20px 0;
        }
        td {
            padding: 10px;
            border: 1px solid #ddd;
        }
        tr:nth-child(even) {
            background-color: #f9f9f9;
        }
        .info-section {
            margin-bottom: 20px;
        }
        .info-section p {
            margin: 5px 0;
        }
        .info-label {
            font-weight: bold;
        }
    </style>
</head>
<body>
    <p class="text-align-center"><strong>CERTIFICADO SUBTEL - ${productName}</strong></p>
    
    <div class="info-section">
        ${ordNumber ? `<p><span class="info-label">ORD. N°:</span> ${ordNumber}</p>` : ''}
        ${date ? `<p><span class="info-label">Fecha:</span> ${date}</p>` : ''}
        ${from ? `<p><span class="info-label">De:</span> ${from}</p>` : ''}
        ${to ? `<p><span class="info-label">A:</span> ${to}</p>` : ''}
    </div>

    ${subject ? `<h4>Materia</h4><p>${subject}</p>` : ''}

    ${equipmentRows.length > 0 ? `
    <h4>Datos del Equipo Certificado</h4>
    <table>
        ${equipmentRows.join('\n        ')}
    </table>
    ` : ''}
</body>
</html>`;
    };

    const downloadHTMLFile = async (comunicadoId) => {
        try {
            const url = await getHTMLDownloadUrl(comunicadoId);
            
            // Descargar archivo
            const response = await fetch(url);
            const blob = await response.blob();
            const downloadUrl = URL.createObjectURL(blob);
            
            const comunicado = comunicados.find(c => c.id === comunicadoId);
            const a = document.createElement('a');
            a.href = downloadUrl;
            a.download = `${comunicado.name}.html`;
            a.click();
            URL.revokeObjectURL(downloadUrl);
        } catch (error) {
            console.error('Error downloading HTML:', error);
            alert('Error descargando HTML');
        }
    };

    const deleteProduct = async (comunicadoId) => {
        if (!confirm('¿Eliminar este comunicado?')) return;

        try {
            const result = await deleteComunicado(comunicadoId);
            if (result.success) {
                await loadComunicados(); // Recargar lista
            } else {
                alert(`Error eliminando: ${result.error}`);
            }
        } catch (error) {
            console.error('Error deleting:', error);
            alert('Error eliminando comunicado');
        }
    };

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
                            <div className="h-4 w-px bg-black/20"></div>
                            <img src="/assets/logo-atlas.gif" alt="Atlas" className="h-5 w-auto" />
                            <div className="h-4 w-px bg-black/20"></div>
                            <span className="text-xs font-medium tracking-wider text-black/50">
                                COMUNICADOS APP
                            </span>
                        </div>
                        
                        <div className="flex items-center gap-3">
                            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-blue-50 border border-blue-200">
                                <FileCode size={14} className="text-blue-600" />
                                <span className="text-xs text-blue-700 font-medium">{stats.totalComunicados} comunicados</span>
                            </div>
                            <button
                                onClick={loadComunicados}
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
                            <Loader2 size={32} className="animate-spin text-blue-400" />
                        </div>
                    ) : (
                        <div className="grid lg:grid-cols-3 gap-8">{/* Left Column - Upload */}
                        {/* Left Column - Upload */}
                        <div className="lg:col-span-1 space-y-6">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="rounded-2xl bg-white/[0.03] backdrop-blur-xl border border-white/10 overflow-hidden"
                            >
                                <div className="px-6 py-4 bg-gradient-to-r from-blue-500/20 to-indigo-500/20 border-b border-white/5">
                                    <h2 className="text-base font-medium text-white flex items-center gap-2">
                                        <Upload size={18} className="text-blue-400" />
                                        Nuevo Comunicado
                                    </h2>
                                </div>
                                
                                <div className="p-6">
                                    <div 
                                        onClick={() => fileInputRef.current?.click()}
                                        className="border-2 border-dashed border-white/10 hover:border-blue-500/50 rounded-xl p-8 text-center cursor-pointer transition-all group"
                                    >
                                        <div className="w-16 h-16 rounded-full bg-blue-500/10 flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-500/20 transition-all">
                                            <FileText size={28} className="text-blue-400" />
                                        </div>
                                        <h3 className="text-base font-medium text-white/80 mb-2">Subir Archivo</h3>
                                        <p className="text-xs text-white/40">Formatos: .xlsx o .pdf</p>
                                    </div>
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        accept=".xlsx,.pdf"
                                        onChange={handleFileUpload}
                                        className="hidden"
                                    />
                                    
                                    {uploading && (
                                        <div className="mt-4 flex items-center justify-center gap-2 text-blue-400 text-xs">
                                            <Loader2 size={14} className="animate-spin" />
                                            <span>Procesando...</span>
                                        </div>
                                    )}
                                </div>
                            </motion.div>

                            {/* Info */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 }}
                                className="rounded-2xl bg-white/[0.03] backdrop-blur-xl border border-white/10 p-6"
                            >
                                <h3 className="text-base font-medium text-white mb-3">¿Cómo funciona?</h3>
                                <ol className="space-y-2 text-xs text-white/50">
                                    <li className="flex gap-2">
                                        <span className="text-blue-400">1.</span>
                                        <span>Sube el archivo Excel (.xlsx) o PDF (.pdf) con los datos</span>
                                    </li>
                                    <li className="flex gap-2">
                                        <span className="text-blue-400">2.</span>
                                        <span>Genera el HTML con el botón "Generar"</span>
                                    </li>
                                    <li className="flex gap-2">
                                        <span className="text-blue-400">3.</span>
                                        <span>Descarga el archivo HTML generado</span>
                                    </li>
                                </ol>
                            </motion.div>
                        </div>

                        {/* Right Column - Products */}
                        <div className="lg:col-span-2">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                                className="rounded-2xl bg-white/[0.03] backdrop-blur-xl border border-white/10 overflow-hidden"
                            >
                                <div className="px-6 py-4 bg-gradient-to-r from-slate-500/10 to-slate-600/10 border-b border-white/5">
                                    <h2 className="text-base font-medium text-white flex items-center gap-2">
                                        <Folder size={18} className="text-amber-400" />
                                        Productos
                                    </h2>
                                </div>

                                <div className="p-6">
                                    {comunicados.length === 0 ? (
                                        <div className="text-center py-16">
                                            <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-4">
                                                <FileText size={32} className="text-white/20" />
                                            </div>
                                            <h3 className="text-base font-medium text-white/40 mb-2">Sin comunicados</h3>
                                            <p className="text-white/30 text-xs">Sube un Excel para comenzar</p>
                                        </div>
                                    ) : (
                                        <div className="space-y-3">
                                            {comunicados.map(comunicado => (
                                                <motion.div
                                                    key={comunicado.id}
                                                    initial={{ opacity: 0, x: -20 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    className="rounded-xl bg-white/[0.02] border border-white/10 p-4 hover:bg-white/[0.04] transition-all"
                                                >
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center gap-3 flex-1">
                                                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                                                                comunicado.status === 'generated' 
                                                                    ? 'bg-emerald-500/20 border border-emerald-500/30' 
                                                                    : 'bg-blue-500/20 border border-blue-500/30'
                                                            }`}>
                                                                {comunicado.status === 'generated' ? (
                                                                    <CheckCircle size={20} className="text-emerald-400" />
                                                                ) : (
                                                                    <FileText size={20} className="text-blue-400" />
                                                                )}
                                                            </div>
                                                            <div className="flex-1">
                                                                <div className="flex items-center gap-2">
                                                                    <h4 className="text-sm font-medium text-white/80">{comunicado.name}</h4>
                                                                    <span className={`px-2 py-0.5 rounded text-[10px] font-medium ${
                                                                        comunicado.excel_data?.type === 'pdf' 
                                                                            ? 'bg-red-500/20 text-red-300 border border-red-500/30' 
                                                                            : 'bg-green-500/20 text-green-300 border border-green-500/30'
                                                                    }`}>
                                                                        {comunicado.excel_data?.type === 'pdf' ? 'PDF' : 'EXCEL'}
                                                                    </span>
                                                                </div>
                                                                <p className="text-xs text-white/40">
                                                                    {comunicado.status === 'generated' ? 'HTML generado' : 'Listo para generar'}
                                                                </p>
                                                            </div>
                                                        </div>

                                                        <div className="flex items-center gap-2">
                                                            {comunicado.status === 'pending' && (
                                                                <button
                                                                    onClick={() => generateHTMLFile(comunicado.id)}
                                                                    disabled={generating && selectedProduct === comunicado.id}
                                                                    className="px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-500 text-white text-xs font-medium flex items-center gap-2 disabled:opacity-50 cursor-pointer transition-all"
                                                                >
                                                                    {generating && selectedProduct === comunicado.id ? (
                                                                        <><Loader2 size={14} className="animate-spin" /> Generando...</>
                                                                    ) : (
                                                                        <><FileCode size={14} /> Generar</>
                                                                    )}
                                                                </button>
                                                            )}
                                                            
                                                            {comunicado.status === 'generated' && (
                                                                <button
                                                                    onClick={() => downloadHTMLFile(comunicado.id)}
                                                                    className="px-4 py-2 rounded-lg bg-emerald-500/20 text-emerald-400 text-xs font-medium flex items-center gap-2 cursor-pointer hover:bg-emerald-500/30 transition-all"
                                                                >
                                                                    <Download size={14} />
                                                                    Descargar
                                                                </button>
                                                            )}

                                                            {comunicado.status === 'generated' && (
                                                                <button
                                                                    onClick={() => previewHTMLFile(comunicado.id)}
                                                                    className="px-4 py-2 rounded-lg bg-blue-500/20 text-blue-400 text-xs font-medium flex items-center gap-2 cursor-pointer hover:bg-blue-500/30 transition-all"
                                                                >
                                                                    <Eye size={14} />
                                                                    Vista Previa
                                                                </button>
                                                            )}

                                                            <button
                                                                onClick={() => deleteProduct(comunicado.id)}
                                                                className="p-2 text-white/20 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all cursor-pointer"
                                                            >
                                                                <Trash2 size={14} />
                                                            </button>
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            ))}
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

            {/* Preview Modal */}
            <AnimatePresence>
                {showPreview && previewHtml && (
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
                            className="bg-[#1a1a24] rounded-2xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col border border-white/10"
                            onClick={e => e.stopPropagation()}
                        >
                            {/* Header */}
                            <div className="px-6 py-4 border-b border-white/10 flex justify-between items-center bg-gradient-to-r from-blue-500/20 to-indigo-500/20">
                                <div className="flex items-center gap-3">
                                    <Code size={20} className="text-blue-400" />
                                    <div>
                                        <h2 className="text-base font-medium text-white">Vista Previa HTML</h2>
                                        <p className="text-xs text-white/40">{previewHtml.name}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    {/* Toggle buttons for view mode - 3 opciones */}
                                    <div className="flex items-center bg-white/5 rounded-lg p-1">
                                        <button
                                            onClick={() => setPreviewMode('visual')}
                                            className={`px-3 py-1.5 rounded-md text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer ${
                                                previewMode === 'visual' 
                                                    ? 'bg-blue-500 text-white' 
                                                    : 'text-white/60 hover:text-white'
                                            }`}
                                        >
                                            <Monitor size={14} />
                                            Vista Previa
                                        </button>
                                        <button
                                            onClick={() => setPreviewMode('code')}
                                            className={`px-3 py-1.5 rounded-md text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer ${
                                                previewMode === 'code' 
                                                    ? 'bg-blue-500 text-white' 
                                                    : 'text-white/60 hover:text-white'
                                            }`}
                                        >
                                            <Code size={14} />
                                            Código
                                        </button>
                                        <button
                                            onClick={() => setPreviewMode('source')}
                                            className={`px-3 py-1.5 rounded-md text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer ${
                                                previewMode === 'source' 
                                                    ? 'bg-red-500 text-white' 
                                                    : 'text-white/60 hover:text-white'
                                            }`}
                                        >
                                            <FileType size={14} />
                                            Documento
                                        </button>
                                    </div>
                                    <button
                                        onClick={() => setShowPreview(false)}
                                        className="p-2 rounded-lg hover:bg-white/10 transition-all cursor-pointer"
                                    >
                                        <X size={20} className="text-white/60" />
                                    </button>
                                </div>
                            </div>

                            {/* Content with tabs */}
                            <div className="flex-1 overflow-hidden flex">
                                {/* Vista Previa Visual, Código HTML o Documento Original */}
                                <div className="flex-1 overflow-hidden flex flex-col">
                                    {previewMode === 'visual' && (
                                        <div className="flex-1 bg-white overflow-auto">
                                            <iframe
                                                srcDoc={previewHtml.content}
                                                className="w-full h-full border-0"
                                                title="Vista previa HTML"
                                                sandbox="allow-same-origin"
                                            />
                                        </div>
                                    )}
                                    {previewMode === 'code' && (
                                        <div className="flex-1 overflow-y-auto p-6 bg-[#0a0a0f]">
                                            <div className="mb-3 flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <FileCode size={14} className="text-blue-400" />
                                                    <h3 className="text-xs font-medium text-white/60 uppercase tracking-wider">Código HTML</h3>
                                                </div>
                                                <button
                                                    onClick={() => {
                                                        navigator.clipboard.writeText(previewHtml.content);
                                                        setCopied(true);
                                                        setTimeout(() => setCopied(false), 2000);
                                                    }}
                                                    className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white/80 text-xs font-medium transition-all flex items-center gap-1.5 cursor-pointer"
                                                >
                                                    {copied ? (
                                                        <>
                                                            <Check size={12} />
                                                            Copiado
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Copy size={12} />
                                                            Copiar
                                                        </>
                                                    )}
                                                </button>
                                            </div>
                                            <pre className="text-xs leading-relaxed font-mono">
                                                <code>{highlightHTML(previewHtml.content, previewHtml.excelData)}</code>
                                            </pre>
                                        </div>
                                    )}
                                    {previewMode === 'source' && (
                                        <SourceDocumentViewer comunicadoId={previewHtml.comunicadoId} comunicados={comunicados} />
                                    )}
                                </div>

                                {/* Panel Editable */}
                                <div className="w-80 border-l border-white/10 overflow-y-auto p-6 bg-white/[0.02]">
                                    <div className="mb-4 flex items-center gap-2">
                                        <FileText size={14} className="text-emerald-400" />
                                        <h3 className="text-xs font-medium text-white/60 uppercase tracking-wider">Editar Datos</h3>
                                    </div>
                                    
                                    {editedData && (
                                        <div className="space-y-4">
                                            {/* Tipo de documento */}
                                            <div className="flex items-center gap-2 mb-4">
                                                <span className={`px-2 py-1 rounded text-xs font-medium ${
                                                    editedData.type === 'pdf' 
                                                        ? 'bg-red-500/20 text-red-300 border border-red-500/30' 
                                                        : 'bg-green-500/20 text-green-300 border border-green-500/30'
                                                }`}>
                                                    {editedData.type === 'pdf' ? 'PDF - Certificado SUBTEL' : 'EXCEL'}
                                                </span>
                                            </div>

                                            {/* Campos para EXCEL */}
                                            {editedData.type !== 'pdf' && (
                                                <>
                                                    {/* Título Editable */}
                                                    <div>
                                                        <label className="text-xs text-white/40 mb-1 block">Título</label>
                                                        <input
                                                            type="text"
                                                            value={editedData.title || ''}
                                                            onChange={(e) => updateTitle(e.target.value)}
                                                            className="w-full bg-white/5 text-emerald-400 text-sm font-medium rounded px-2 py-1.5 border border-white/10 focus:border-emerald-400 focus:outline-none transition-colors"
                                                        />
                                                    </div>

                                                    {/* Module Header Editable */}
                                                    <div>
                                                        <label className="text-xs text-white/40 mb-1 block">Módulo</label>
                                                        <input
                                                            type="text"
                                                            value={editedData.moduleHeader || ''}
                                                            onChange={(e) => updateModuleHeader(e.target.value)}
                                                            className="w-full bg-white/5 text-blue-400 text-sm font-medium rounded px-2 py-1.5 border border-white/10 focus:border-blue-400 focus:outline-none transition-colors"
                                                        />
                                                    </div>

                                                    {/* Fields Editables */}
                                                    {editedData.fields && editedData.fields.length > 0 && (
                                                        <div>
                                                            <p className="text-xs text-white/40 mb-2">Campos ({editedData.fields.length})</p>
                                                            <div className="space-y-2 max-h-96 overflow-y-auto">
                                                                {editedData.fields.map((field, idx) => (
                                                                    <div key={idx} className="p-2 rounded-lg bg-white/[0.02] border border-white/5 space-y-1.5">
                                                                        <input
                                                                            type="text"
                                                                            value={field.label}
                                                                            onChange={(e) => updateField(idx, 'label', e.target.value)}
                                                                            placeholder="Etiqueta"
                                                                            className="w-full bg-white/5 text-white/60 text-xs rounded px-2 py-1 border border-white/10 focus:border-white/20 focus:outline-none"
                                                                        />
                                                                        <input
                                                                            type="text"
                                                                            value={field.value}
                                                                            onChange={(e) => updateField(idx, 'value', e.target.value)}
                                                                            placeholder="Valor"
                                                                            className="w-full bg-white/5 text-white/90 text-xs rounded px-2 py-1 border border-white/10 focus:border-emerald-400 focus:outline-none"
                                                                        />
                                                                        <input
                                                                            type="text"
                                                                            value={field.page || ''}
                                                                            onChange={(e) => updateField(idx, 'page', e.target.value)}
                                                                            placeholder="Página"
                                                                            className="w-full bg-white/5 text-white/30 text-xs rounded px-2 py-1 border border-white/10 focus:border-blue-400 focus:outline-none"
                                                                        />
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    )}
                                                </>
                                            )}

                                            {/* Campos para PDF */}
                                            {editedData.type === 'pdf' && (
                                                <>
                                                    <div>
                                                        <label className="text-xs text-white/40 mb-1 block">ORD. N°</label>
                                                        <input
                                                            type="text"
                                                            value={editedData.ordNumber || ''}
                                                            onChange={(e) => setEditedData(prev => ({ ...prev, ordNumber: e.target.value }))}
                                                            className="w-full bg-white/5 text-emerald-400 text-sm font-medium rounded px-2 py-1.5 border border-white/10 focus:border-emerald-400 focus:outline-none transition-colors"
                                                        />
                                                    </div>

                                                    <div>
                                                        <label className="text-xs text-white/40 mb-1 block">Fecha</label>
                                                        <input
                                                            type="text"
                                                            value={editedData.date || ''}
                                                            onChange={(e) => setEditedData(prev => ({ ...prev, date: e.target.value }))}
                                                            className="w-full bg-white/5 text-white/90 text-sm rounded px-2 py-1.5 border border-white/10 focus:border-blue-400 focus:outline-none transition-colors"
                                                        />
                                                    </div>

                                                    <div>
                                                        <label className="text-xs text-white/40 mb-1 block">Materia</label>
                                                        <input
                                                            type="text"
                                                            value={editedData.subject || ''}
                                                            onChange={(e) => setEditedData(prev => ({ ...prev, subject: e.target.value }))}
                                                            className="w-full bg-white/5 text-white/90 text-sm rounded px-2 py-1.5 border border-white/10 focus:border-blue-400 focus:outline-none transition-colors"
                                                        />
                                                    </div>

                                                    <div className="pt-2 border-t border-white/10">
                                                        <p className="text-xs text-white/40 mb-2">Datos del Equipo</p>
                                                        
                                                        {editedData.equipmentData && Object.entries({
                                                            tipo: 'Tipo de Equipo',
                                                            marca: 'Marca',
                                                            modelo: 'Modelo',
                                                            fabricante: 'Fabricante',
                                                            frecuencias: 'Frecuencias',
                                                            potencia: 'Potencia',
                                                            restricciones: 'Restricciones'
                                                        }).map(([key, label]) => (
                                                            <div key={key} className="mb-2">
                                                                <label className="text-xs text-white/30 mb-0.5 block">{label}</label>
                                                                <input
                                                                    type="text"
                                                                    value={editedData.equipmentData[key] || ''}
                                                                    onChange={(e) => setEditedData(prev => ({
                                                                        ...prev,
                                                                        equipmentData: { ...prev.equipmentData, [key]: e.target.value }
                                                                    }))}
                                                                    className="w-full bg-white/5 text-white/80 text-xs rounded px-2 py-1 border border-white/10 focus:border-emerald-400 focus:outline-none"
                                                                />
                                                            </div>
                                                        ))}
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Footer con acciones */}
                            <div className="px-6 py-4 border-t border-white/10 bg-white/[0.02] flex justify-end gap-3">
                                {hasChanges && (
                                    <button
                                        onClick={saveChanges}
                                        className="px-4 py-2 rounded-lg bg-green-500 hover:bg-green-600 text-white text-xs font-medium transition-colors flex items-center gap-2 cursor-pointer"
                                    >
                                        <Check size={14} />
                                        Guardar
                                    </button>
                                )}
                                <button
                                    onClick={() => setShowPreview(false)}
                                    className="px-4 py-2 rounded-lg bg-white/5 text-white/60 text-xs font-medium hover:bg-white/10 transition-all cursor-pointer"
                                >
                                    Cerrar
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
            
            {/* Quick App Menu */}
            <QuickAppMenu />
        </div>
    );
};

// Helper function para syntax highlighting
const highlightHTML = (html, excelData) => {
    if (!html) return '';

    // Crear set de valores del Excel para highlighting
    const excelValues = new Set();
    if (excelData?.title) excelValues.add(excelData.title);
    if (excelData?.moduleHeader) excelValues.add(excelData.moduleHeader);
    if (excelData?.fields) {
        excelData.fields.forEach(field => {
            if (field.label) excelValues.add(field.label);
            if (field.value) excelValues.add(field.value);
            if (field.page) excelValues.add(field.page);
        });
    }

    // Dividir en líneas
    const lines = html.split('\n');
    
    return (
        <>
            {lines.map((line, idx) => {
                // Detectar si la línea contiene datos del Excel
                let hasExcelData = false;
                excelValues.forEach(value => {
                    if (value && line.includes(value)) {
                        hasExcelData = true;
                    }
                });

                return (
                    <div key={idx} className="hover:bg-white/[0.02]">
                        <span className="inline-block w-10 text-white/20 text-right mr-4 select-none">{idx + 1}</span>
                        <span 
                            className={hasExcelData ? 'text-emerald-400' : 'text-blue-300/60'}
                            dangerouslySetInnerHTML={{ 
                                __html: line
                                    .replace(/</g, '&lt;')
                                    .replace(/>/g, '&gt;')
                                    .replace(/(&lt;[^&]*&gt;)/g, '<span class="text-purple-400">$1</span>')
                            }} 
                        />
                    </div>
                );
            })}
        </>
    );
};

// Componente para mostrar el documento fuente (PDF o Excel)
const SourceDocumentViewer = ({ comunicadoId, comunicados }) => {
    const [sourceUrl, setSourceUrl] = useState(null);
    const [isPDF, setIsPDF] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadSource = async () => {
            try {
                const comunicado = comunicados.find(c => c.id === comunicadoId);
                if (!comunicado?.excel_path) {
                    setLoading(false);
                    return;
                }

                const filePath = comunicado.excel_path;
                const isPdfFile = filePath?.includes('/pdfs/') || filePath?.endsWith('.pdf');
                setIsPDF(isPdfFile);

                const { data } = supabase.storage
                    .from('comunicados-files')
                    .getPublicUrl(filePath);

                setSourceUrl(data.publicUrl);
            } catch (error) {
                console.error('Error loading source:', error);
            } finally {
                setLoading(false);
            }
        };

        loadSource();
    }, [comunicadoId, comunicados]);

    if (loading) {
        return (
            <div className="flex-1 flex items-center justify-center bg-[#0a0a0f]">
                <Loader2 className="animate-spin text-white/40" size={32} />
            </div>
        );
    }

    if (!sourceUrl) {
        return (
            <div className="flex-1 flex items-center justify-center bg-[#0a0a0f]">
                <p className="text-white/40">No se encontró el archivo fuente</p>
            </div>
        );
    }

    return (
        <div className="flex-1 bg-gray-200 overflow-hidden">
            {isPDF ? (
                <iframe
                    src={sourceUrl}
                    className="w-full h-full border-0"
                    title="Documento PDF Original"
                />
            ) : (
                <div className="flex-1 flex flex-col items-center justify-center p-8 bg-[#0a0a0f]">
                    <FileText size={48} className="text-green-400/40 mb-4" />
                    <p className="text-white/60 mb-4">Archivo Excel</p>
                    <a
                        href={sourceUrl}
                        download
                        className="px-4 py-2 bg-green-500/20 text-green-400 rounded-lg text-sm hover:bg-green-500/30 transition-all"
                    >
                        <Download size={14} className="inline mr-2" />
                        Descargar Excel
                    </a>
                </div>
            )}
        </div>
    );
};

export default ComunicadosApp;
