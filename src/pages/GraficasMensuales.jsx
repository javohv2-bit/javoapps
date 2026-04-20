/**
 * GraficasMensuales Page
 * Main page for creating visual presentations from uploaded media
 * 
 * Features:
 * - Drag & drop file upload zone
 * - Support for images, PDFs, GIFs, MP4
 * - Visual slide editor with PowerPoint export
 */
import React, { useState, useCallback, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Upload,
    Image as ImageIcon,
    FileVideo,
    FileText,
    X,
    ArrowRight,
    Home,
    HelpCircle,
    Layers,
    Trash2
} from 'lucide-react';
import SlideEditor from '../components/graficas/SlideEditor';
import { readFileAsDataUrl, extractVideoThumbnail, renderPdfFirstPage } from '../utils/pptxGenerator';

const MAX_FILE_SIZE_BYTES = 50 * 1024 * 1024;

const getFileFingerprint = (file) => `${file.name}::${file.size}::${file.lastModified}`;

const releaseFileResources = (file) => {
    if (file?.objectUrl && typeof file.objectUrl === 'string' && file.objectUrl.startsWith('blob:')) {
        URL.revokeObjectURL(file.objectUrl);
    }
};

const readVideoDimensions = (videoFile) => {
    return new Promise((resolve) => {
        const video = document.createElement('video');
        const src = URL.createObjectURL(videoFile);

        const cleanup = () => {
            URL.revokeObjectURL(src);
        };

        video.preload = 'metadata';
        video.onloadedmetadata = () => {
            const width = video.videoWidth || 1920;
            const height = video.videoHeight || 1080;
            cleanup();
            resolve({ width, height });
        };
        video.onerror = () => {
            cleanup();
            resolve({ width: 1920, height: 1080 });
        };
        video.src = src;
        video.load();
    });
};

const GraficasMensuales = () => {
    const navigate = useNavigate();
    const canvasRef = useRef(null);

    // State
    const [uploadedFiles, setUploadedFiles] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [showEditor, setShowEditor] = useState(false);
    const [processedFiles, setProcessedFiles] = useState([]);
    const [uploadIssue, setUploadIssue] = useState(null);
    const uploadedFilesRef = useRef([]);

    useEffect(() => {
        uploadedFilesRef.current = uploadedFiles;
    }, [uploadedFiles]);

    useEffect(() => {
        return () => {
            uploadedFilesRef.current.forEach(releaseFileResources);
        };
    }, []);

    // Aurora background animation (matching other pages)
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

            // Blob 1: Bottom center - cyan/indigo
            const blob1X = canvas.width * (0.5 + Math.sin(time * 0.8) * 0.25);
            const blob1Y = canvas.height * (0.78 + Math.cos(time * 0.5) * 0.05);
            const grad1 = ctx.createRadialGradient(blob1X, blob1Y, 0, blob1X, blob1Y, canvas.width * 0.5);
            grad1.addColorStop(0, 'rgba(56, 189, 248, 0.15)');
            grad1.addColorStop(0.4, 'rgba(99, 102, 241, 0.08)');
            grad1.addColorStop(1, 'transparent');
            ctx.fillStyle = grad1;
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Blob 2: Top right - purple/pink
            const blob2X = canvas.width * (0.75 + Math.cos(time * 0.6) * 0.15);
            const blob2Y = canvas.height * (0.25 + Math.sin(time * 0.9) * 0.12);
            const grad2 = ctx.createRadialGradient(blob2X, blob2Y, 0, blob2X, blob2Y, canvas.width * 0.4);
            grad2.addColorStop(0, 'rgba(168, 85, 247, 0.10)');
            grad2.addColorStop(0.5, 'rgba(236, 72, 153, 0.05)');
            grad2.addColorStop(1, 'transparent');
            ctx.fillStyle = grad2;
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Blob 3: Left side - teal/emerald
            const blob3X = canvas.width * (0.2 + Math.sin(time * 0.4) * 0.08);
            const blob3Y = canvas.height * (0.55 + Math.cos(time * 0.7) * 0.2);
            const grad3 = ctx.createRadialGradient(blob3X, blob3Y, 0, blob3X, blob3Y, canvas.width * 0.35);
            grad3.addColorStop(0, 'rgba(20, 184, 166, 0.08)');
            grad3.addColorStop(0.5, 'rgba(16, 185, 129, 0.04)');
            grad3.addColorStop(1, 'transparent');
            ctx.fillStyle = grad3;
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            animationId = requestAnimationFrame(animate);
        };

        animate();

        return () => {
            cancelAnimationFrame(animationId);
            window.removeEventListener('resize', resize);
        };
    }, [showEditor]);

    // File processing with dimension extraction and date metadata
    const processFile = async (file) => {
        const id = Date.now().toString(36) + Math.random().toString(36).substr(2);
        const lastModified = file.lastModified; // Timestamp for thematic grouping

        if (file.type.startsWith('video/')) {
            try {
                const [thumbnail, dimensions] = await Promise.all([
                    extractVideoThumbnail(file),
                    readVideoDimensions(file)
                ]);
                const objectUrl = URL.createObjectURL(file);
                // Videos default to landscape orientation
                return {
                    id,
                    name: file.name,
                    type: file.type,
                    mimeType: file.type,
                    dataUrl: objectUrl,
                    objectUrl,
                    thumbnail,
                    size: file.size,
                    width: dimensions.width,
                    height: dimensions.height,
                    lastModified
                };
            } catch (err) {
                console.warn('Error extracting video thumbnail:', err);
                return null;
            }
        } else if (file.type.startsWith('image/')) {
            const dataUrl = await readFileAsDataUrl(file);

            // Load image to get dimensions
            const dimensions = await new Promise((resolve) => {
                const img = new Image();
                img.onload = () => resolve({ width: img.naturalWidth, height: img.naturalHeight });
                img.onerror = () => resolve({ width: 800, height: 600 }); // Default if error
                img.src = dataUrl;
            });

            return {
                id,
                name: file.name,
                type: file.type,
                dataUrl,
                size: file.size,
                width: dimensions.width,
                height: dimensions.height,
                lastModified
            };
        } else if (file.type === 'application/pdf') {
            try {
                const renderedPdf = await renderPdfFirstPage(file);
                return {
                    id,
                    name: file.name,
                    type: file.type,
                    dataUrl: renderedPdf.dataUrl,
                    thumbnail: renderedPdf.dataUrl,
                    size: file.size,
                    width: renderedPdf.width,
                    height: renderedPdf.height,
                    lastModified
                };
            } catch (err) {
                console.warn('Error rendering PDF:', err);
                return null;
            }
        }
        return null;
    };

    // Dropzone config
    const onDrop = useCallback(async (acceptedFiles, fileRejections = []) => {
        setUploadIssue(null);

        if (fileRejections.length > 0) {
            const reasons = fileRejections
                .flatMap(rejection => rejection.errors.map(err => err.code))
                .map(code => {
                    if (code === 'file-too-large') return 'Hay archivos que superan 50MB.';
                    if (code === 'file-invalid-type') return 'Hay archivos con tipo no soportado.';
                    if (code === 'too-many-files') return 'Se supero el limite de archivos permitidos.';
                    return 'Hay archivos que no se pudieron cargar.';
                });

            const uniqueReasons = [...new Set(reasons)];
            if (uniqueReasons.length > 0) {
                setUploadIssue(uniqueReasons.join(' '));
            }
        }

        if (acceptedFiles.length === 0) {
            return;
        }

        setIsLoading(true);
        try {
            const processed = await Promise.all(
                acceptedFiles.map(file => processFile(file))
            );
            const validFiles = processed.filter(Boolean);

            setUploadedFiles(prev => {
                const existingKeys = new Set(prev.map(getFileFingerprint));
                const deduped = [];

                validFiles.forEach(file => {
                    const key = getFileFingerprint(file);
                    if (existingKeys.has(key)) {
                        releaseFileResources(file);
                        return;
                    }
                    existingKeys.add(key);
                    deduped.push(file);
                });

                if (deduped.length < validFiles.length) {
                    setUploadIssue('Se omitieron archivos duplicados para evitar slides repetidas.');
                }

                return [...prev, ...deduped];
            });
        } catch (error) {
            console.error('Error processing files:', error);
            setUploadIssue('Ocurrio un error procesando algunos archivos.');
        } finally {
            setIsLoading(false);
        }
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp'],
            'video/*': ['.mp4', '.mov', '.webm'],
            'application/pdf': ['.pdf']
        },
        maxSize: MAX_FILE_SIZE_BYTES,
        multiple: true
    });

    // Remove file from list
    const removeFile = (fileId) => {
        setUploadedFiles(prev => {
            const fileToRemove = prev.find(f => f.id === fileId);
            releaseFileResources(fileToRemove);
            return prev.filter(f => f.id !== fileId);
        });
    };

    // Clear all files
    const clearAllFiles = () => {
        uploadedFiles.forEach(releaseFileResources);
        setUploadedFiles([]);
        setUploadIssue(null);
    };

    // Continue to editor
    const handleContinue = () => {
        setUploadIssue(null);
        setProcessedFiles(uploadedFiles);
        setShowEditor(true);
    };

    // Back from editor
    const handleBackFromEditor = () => {
        setShowEditor(false);
    };

    // Format file size
    const formatSize = (bytes) => {
        if (bytes < 1024) return bytes + ' B';
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
        return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
    };

    // File type icon
    const getFileIcon = (type) => {
        if (type.startsWith('video/')) return FileVideo;
        if (type === 'application/pdf') return FileText;
        return ImageIcon;
    };

    // Show editor view
    if (showEditor) {
        return (
            <div className="h-screen bg-[#0a0a0f]">
                <SlideEditor
                    initialFiles={processedFiles}
                    onBack={handleBackFromEditor}
                />
            </div>
        );
    }

    // Upload view
    return (
        <div className="min-h-screen relative overflow-hidden bg-[#0a0a0f]">
            {/* Aurora Background */}
            <canvas ref={canvasRef} className="absolute inset-0 z-0" />

            {/* Content */}
            <div className="relative z-10 min-h-screen flex flex-col">
                {/* Header */}
                <header className="px-6 py-4 bg-white">
                    <div className="max-w-6xl mx-auto flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => navigate('/')}
                                className="p-2 rounded-lg hover:bg-black/5 transition-all cursor-pointer"
                                title="Volver al inicio"
                            >
                                <Home size={18} className="text-black/40" />
                            </button>
                            <div className="h-4 w-px bg-black/20" />
                            <img
                                src="/assets/logo-atlas.gif"
                                alt="Atlas Digital"
                                className="h-5 w-auto"
                            />
                            <div className="h-4 w-px bg-black/20" />
                            <div className="flex items-center gap-2">
                                <Layers size={16} className="text-purple-500" />
                                <span className="text-black/50 text-xs font-medium tracking-wider uppercase">
                                    Gráficas Mensuales
                                </span>
                            </div>
                        </div>
                        <button className="p-2 rounded-lg hover:bg-black/5 transition-all cursor-pointer">
                            <HelpCircle size={18} className="text-black/40" />
                        </button>
                    </div>
                </header>

                {/* Main Content */}
                <main className="flex-1 flex flex-col items-center justify-center px-8 py-12">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="max-w-4xl w-full"
                    >
                        {/* Title */}
                        <div className="text-center mb-8">
                            <h1 className="text-3xl font-bold text-white mb-2">
                                Crea tu Presentación
                            </h1>
                            <p className="text-white/50">
                                Arrastra tus archivos o haz clic para subirlos
                            </p>
                        </div>

                        {/* Dropzone */}
                        <div
                            {...getRootProps()}
                            className={`
                                relative border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer
                                transition-all duration-300
                                ${isDragActive
                                    ? 'border-blue-500 bg-blue-500/10'
                                    : 'border-white/20 hover:border-white/40 bg-white/5'
                                }
                            `}
                        >
                            <input {...getInputProps()} />

                            <div className="flex flex-col items-center gap-4">
                                <div className={`
                                    w-20 h-20 rounded-full flex items-center justify-center
                                    ${isDragActive ? 'bg-blue-500/20' : 'bg-white/10'}
                                    transition-colors
                                `}>
                                    <Upload
                                        size={32}
                                        className={isDragActive ? 'text-blue-400' : 'text-white/40'}
                                    />
                                </div>

                                <div>
                                    <p className="text-white font-medium mb-1">
                                        {isDragActive
                                            ? 'Suelta los archivos aquí'
                                            : 'Arrastra archivos aquí'
                                        }
                                    </p>
                                    <p className="text-white/40 text-sm">
                                        Imágenes, PDFs, GIFs, MP4 • Máximo 50MB por archivo
                                    </p>
                                </div>

                                <div className="flex items-center gap-4 text-white/30 text-xs">
                                    <span className="flex items-center gap-1">
                                        <ImageIcon size={14} /> JPG, PNG, GIF
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <FileVideo size={14} /> MP4, MOV
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <FileText size={14} /> PDF
                                    </span>
                                </div>
                            </div>

                            {/* Loading overlay */}
                            {isLoading && (
                                <div className="absolute inset-0 bg-black/50 rounded-2xl flex items-center justify-center">
                                    <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                                </div>
                            )}
                        </div>

                        {uploadIssue && (
                            <motion.div
                                initial={{ opacity: 0, y: 8 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="mt-4 rounded-lg border border-amber-400/30 bg-amber-400/10 px-4 py-3 text-sm text-amber-200"
                            >
                                {uploadIssue}
                            </motion.div>
                        )}

                        {/* Uploaded files preview */}
                        <AnimatePresence>
                            {uploadedFiles.length > 0 && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="mt-6"
                                >
                                    {/* Files header */}
                                    <div className="flex items-center justify-between mb-4">
                                        <span className="text-white/60 text-sm">
                                            {uploadedFiles.length} archivo{uploadedFiles.length !== 1 ? 's' : ''} subido{uploadedFiles.length !== 1 ? 's' : ''}
                                        </span>
                                        <button
                                            onClick={clearAllFiles}
                                            className="text-red-400/70 hover:text-red-400 text-sm flex items-center gap-1 transition-colors"
                                        >
                                            <Trash2 size={14} />
                                            Limpiar todo
                                        </button>
                                    </div>

                                    {/* Files grid */}
                                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                                        {uploadedFiles.map((file, index) => {
                                            const Icon = getFileIcon(file.type);
                                            return (
                                                <motion.div
                                                    key={file.id}
                                                    initial={{ opacity: 0, scale: 0.8 }}
                                                    animate={{ opacity: 1, scale: 1 }}
                                                    exit={{ opacity: 0, scale: 0.8 }}
                                                    transition={{ delay: index * 0.05 }}
                                                    className="group relative bg-white/5 rounded-xl overflow-hidden border border-white/10"
                                                >
                                                    {/* Thumbnail */}
                                                    <div className="aspect-video bg-black/20">
                                                        {file.type.startsWith('image/') ? (
                                                            <img
                                                                src={file.dataUrl}
                                                                alt={file.name}
                                                                className="w-full h-full object-cover"
                                                            />
                                                        ) : file.thumbnail ? (
                                                            <img
                                                                src={file.thumbnail}
                                                                alt={file.name}
                                                                className="w-full h-full object-cover"
                                                            />
                                                        ) : (
                                                            <div className="w-full h-full flex items-center justify-center">
                                                                <Icon size={32} className="text-white/30" />
                                                            </div>
                                                        )}
                                                    </div>

                                                    {/* File info */}
                                                    <div className="p-2">
                                                        <p className="text-white/70 text-xs truncate" title={file.name}>
                                                            {file.name}
                                                        </p>
                                                        <p className="text-white/30 text-[10px]">
                                                            {formatSize(file.size)}
                                                        </p>
                                                    </div>

                                                    {/* Delete button */}
                                                    <button
                                                        onClick={() => removeFile(file.id)}
                                                        className="absolute top-2 right-2 w-6 h-6 bg-black/60 rounded-full flex items-center justify-center text-white/70 hover:bg-red-500 hover:text-white opacity-0 group-hover:opacity-100 transition-all"
                                                    >
                                                        <X size={12} />
                                                    </button>

                                                    {/* Order number */}
                                                    <div className="absolute top-2 left-2 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                                                        {index + 1}
                                                    </div>
                                                </motion.div>
                                            );
                                        })}
                                    </div>

                                    {/* Continue button */}
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="mt-8 flex justify-center"
                                    >
                                        <motion.button
                                            onClick={handleContinue}
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            className="flex items-center gap-3 px-8 py-4 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-medium shadow-lg shadow-blue-500/25 hover:from-blue-400 hover:to-indigo-400 transition-all"
                                        >
                                            <span>Continuar al Editor</span>
                                            <ArrowRight size={18} />
                                        </motion.button>
                                    </motion.div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                </main>

                {/* Footer */}
                <footer className="px-8 py-6">
                    <div className="max-w-6xl mx-auto flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <img
                                src="/assets/logoatlas.png"
                                alt="Atlas"
                                className="h-4 w-auto brightness-0 invert opacity-20 hover:opacity-40 transition-opacity"
                            />
                            <img
                                src="/assets/logo-rojo.png"
                                alt="Canon"
                                className="h-2.5 w-auto brightness-0 invert opacity-20 hover:opacity-40 transition-opacity"
                            />
                        </div>
                        <p className="text-white/20 text-xs">
                            by javohv • {new Date().getFullYear()}
                        </p>
                    </div>
                </footer>
            </div>
        </div>
    );
};

export default GraficasMensuales;
