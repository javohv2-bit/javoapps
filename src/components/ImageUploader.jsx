import React, { useState, useCallback, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, X, CheckCircle, AlertCircle, RefreshCw, Crop, Image as ImageIcon, Replace } from 'lucide-react';
import { motion } from 'framer-motion';
import ImageCropEditor from './ImageCropEditor';

/**
 * ImageUploader - Enhanced image uploader with crop editor
 * 
 * Features:
 * - Shows current image (from URL or File)
 * - Allows uploading a new image
 * - Interactive crop editor to adjust image position
 * - Auto-resize to Falabella required dimensions
 */

/**
 * Apply crop settings to an image and return resized blob
 */
const applyCropAndResize = (imageSource, cropSettings) => {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        
        img.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.width = cropSettings.targetWidth;
            canvas.height = cropSettings.targetHeight;
            const ctx = canvas.getContext('2d');
            
            // Fill with white background
            ctx.fillStyle = '#FFFFFF';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            // Calculate source rectangle based on crop settings
            const sourceX = -cropSettings.x / cropSettings.scale;
            const sourceY = -cropSettings.y / cropSettings.scale;
            const sourceWidth = cropSettings.targetWidth / cropSettings.scale;
            const sourceHeight = cropSettings.targetHeight / cropSettings.scale;
            
            ctx.drawImage(
                img,
                sourceX, sourceY, sourceWidth, sourceHeight,
                0, 0, canvas.width, canvas.height
            );
            
            canvas.toBlob((blob) => {
                if (blob) {
                    resolve(blob);
                } else {
                    reject(new Error('Error al procesar la imagen'));
                }
            }, 'image/jpeg', 0.92);
        };
        
        img.onerror = () => reject(new Error('Error al cargar la imagen'));
        
        if (imageSource instanceof File || imageSource instanceof Blob) {
            img.src = URL.createObjectURL(imageSource);
        } else {
            img.src = imageSource;
        }
    });
};

/**
 * Default center crop
 */
const defaultCenterCrop = (file, targetWidth, targetHeight) => {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.width = targetWidth;
            canvas.height = targetHeight;
            const ctx = canvas.getContext('2d');

            ctx.fillStyle = '#FFFFFF';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            const scale = Math.max(targetWidth / img.width, targetHeight / img.height);
            const scaledWidth = img.width * scale;
            const scaledHeight = img.height * scale;
            const x = (targetWidth - scaledWidth) / 2;
            const y = (targetHeight - scaledHeight) / 2;

            ctx.drawImage(img, x, y, scaledWidth, scaledHeight);

            canvas.toBlob((blob) => {
                if (blob) {
                    const resizedFile = new File([blob], 'image.jpg', { type: 'image/jpeg' });
                    resolve(resizedFile);
                } else {
                    reject(new Error('Error al redimensionar'));
                }
            }, 'image/jpeg', 0.92);
        };
        img.onerror = () => reject(new Error('Error al cargar'));
        img.src = URL.createObjectURL(file);
    });
};

const ImageUploader = ({ 
    requiredWidth, 
    requiredHeight, 
    onImageChange,
    currentImage = null
}) => {
    const [file, setFile] = useState(null);
    const [error, setError] = useState(null);
    const [preview, setPreview] = useState(null);
    const [isResizing, setIsResizing] = useState(false);
    const [originalDimensions, setOriginalDimensions] = useState(null);
    const [showCropEditor, setShowCropEditor] = useState(false);
    const [cropSettings, setCropSettings] = useState(null);
    const [imageSourceForCrop, setImageSourceForCrop] = useState(null);

    // Load current image on mount or when it changes
    useEffect(() => {
        if (currentImage && !file) {
            if (currentImage instanceof File) {
                setFile(currentImage);
                setPreview(URL.createObjectURL(currentImage));
                setImageSourceForCrop(currentImage);
            } else if (typeof currentImage === 'string') {
                setPreview(currentImage);
                setImageSourceForCrop(currentImage);
                
                const img = new Image();
                img.crossOrigin = 'anonymous';
                img.onload = () => {
                    setOriginalDimensions({ width: img.width, height: img.height });
                };
                img.src = currentImage;
            }
        }
    }, [currentImage]);

    const onDrop = useCallback(async (acceptedFiles) => {
        const selectedFile = acceptedFiles[0];
        if (!selectedFile) return;

        if (!requiredWidth || !requiredHeight) {
            setError("Este modulo no requiere imagen.");
            return;
        }

        setIsResizing(true);
        setError(null);

        const img = new Image();
        img.src = URL.createObjectURL(selectedFile);

        img.onload = async () => {
            setOriginalDimensions({ width: img.width, height: img.height });
            setImageSourceForCrop(selectedFile);

            try {
                const resizedFile = await defaultCenterCrop(selectedFile, requiredWidth, requiredHeight);
                const resizedPreview = URL.createObjectURL(resizedFile);

                setFile(resizedFile);
                setPreview(resizedPreview);
                onImageChange(resizedFile);
                setCropSettings(null);
                setError(null);
            } catch (err) {
                setError('Error al procesar: ' + err.message);
                setFile(null);
                setPreview(null);
                onImageChange(null);
            }
            setIsResizing(false);
        };

        img.onerror = () => {
            setError('Error al cargar la imagen');
            setIsResizing(false);
        };
    }, [requiredWidth, requiredHeight, onImageChange]);

    const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
        onDrop,
        accept: {
            'image/jpeg': [],
            'image/png': [],
            'image/webp': []
        },
        maxFiles: 1,
        noClick: !!preview
    });

    const removeFile = (e) => {
        e.stopPropagation();
        setFile(null);
        setPreview(null);
        setError(null);
        setOriginalDimensions(null);
        setCropSettings(null);
        setImageSourceForCrop(null);
        onImageChange(null);
    };

    const handleOpenCropEditor = (e) => {
        e.stopPropagation();
        if (imageSourceForCrop) {
            setShowCropEditor(true);
        }
    };

    const handleSaveCrop = async (newCropSettings) => {
        setShowCropEditor(false);
        setCropSettings(newCropSettings);
        setIsResizing(true);

        try {
            const croppedBlob = await applyCropAndResize(imageSourceForCrop, newCropSettings);
            const croppedFile = new File([croppedBlob], 'cropped-image.jpg', { type: 'image/jpeg' });
            
            setFile(croppedFile);
            setPreview(URL.createObjectURL(croppedFile));
            onImageChange(croppedFile);
        } catch (err) {
            setError('Error al aplicar recorte: ' + err.message);
        } finally {
            setIsResizing(false);
        }
    };

    const handleCancelCrop = () => {
        setShowCropEditor(false);
    };

    if (!requiredWidth && !requiredHeight) return null;

    return (
        <div className="mb-4">
            <label className="block text-sm font-medium text-white/70 mb-1">
                Imagen ({requiredWidth}x{requiredHeight}px)
                <span className="text-xs text-white/30 ml-2">- Ajuste de recorte disponible</span>
            </label>

            <div
                {...getRootProps()}
                className={'relative border-2 border-dashed rounded-xl p-4 transition-colors ' +
                    (isDragActive ? 'border-blue-500 bg-blue-500/10 ' : 'border-white/10 ') +
                    (error ? 'border-red-500/50 bg-red-500/10 ' : '') +
                    (preview ? 'border-emerald-500/50 bg-emerald-500/5 ' : 'hover:border-blue-500/50 hover:bg-white/[0.02] cursor-pointer ')
                }
            >
                <input {...getInputProps()} />

                {isResizing ? (
                    <div className="py-8 flex flex-col items-center">
                        <RefreshCw className="h-12 w-12 text-blue-400 animate-spin mb-3" />
                        <p className="text-sm text-blue-400 font-medium">Procesando imagen...</p>
                    </div>
                ) : preview ? (
                    <div className="relative">
                        <div className="relative bg-black/30 rounded-lg overflow-hidden border border-white/10">
                            <img 
                                src={preview} 
                                alt="Preview" 
                                className="w-full h-48 object-contain bg-white/5"
                            />
                            
                            <div className="absolute top-2 left-2 bg-black/70 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-lg flex items-center gap-1 border border-white/10">
                                <ImageIcon size={12} />
                                {requiredWidth}x{requiredHeight}px
                            </div>
                        </div>

                        <div className="mt-3 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={handleOpenCropEditor}
                                    className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-500 transition-colors shadow-lg shadow-blue-500/20 cursor-pointer"
                                >
                                    <Crop size={14} />
                                    {cropSettings ? 'Editar recorte' : 'Ajustar recorte'}
                                </button>

                                <button
                                    onClick={(e) => { e.stopPropagation(); open(); }}
                                    className="flex items-center gap-1.5 px-3 py-1.5 bg-white/10 text-white/70 text-sm rounded-lg hover:bg-white/15 transition-colors cursor-pointer"
                                >
                                    <Replace size={14} />
                                    Cambiar
                                </button>
                            </div>

                            <button
                                onClick={removeFile}
                                className="flex items-center gap-1 px-3 py-1.5 text-red-400 text-sm hover:bg-red-500/10 rounded-lg transition-colors cursor-pointer"
                            >
                                <X size={14} />
                                Quitar
                            </button>
                        </div>

                        <div className="mt-2 text-center">
                            {(() => {
                                // Check if original dimensions match required dimensions
                                const isExactMatch = originalDimensions && 
                                    originalDimensions.width === requiredWidth && 
                                    originalDimensions.height === requiredHeight;
                                
                                // Check aspect ratio match
                                const requiredRatio = requiredWidth / requiredHeight;
                                const originalRatio = originalDimensions ? 
                                    originalDimensions.width / originalDimensions.height : 0;
                                const ratioMatch = originalDimensions && 
                                    Math.abs(requiredRatio - originalRatio) < 0.01;
                                
                                // Calculate crop percentage if dimensions don't match
                                let cropPercent = 0;
                                if (originalDimensions && !isExactMatch) {
                                    const scaleX = requiredWidth / originalDimensions.width;
                                    const scaleY = requiredHeight / originalDimensions.height;
                                    const scale = Math.max(scaleX, scaleY);
                                    const usedWidth = requiredWidth / scale;
                                    const usedHeight = requiredHeight / scale;
                                    const usedArea = usedWidth * usedHeight;
                                    const originalArea = originalDimensions.width * originalDimensions.height;
                                    cropPercent = Math.round((1 - usedArea / originalArea) * 100);
                                }

                                if (isExactMatch) {
                                    return (
                                        <div className="flex items-center justify-center text-emerald-400 text-sm font-medium">
                                            <CheckCircle size={16} className="mr-1" />
                                            Dimensiones exactas ✓
                                        </div>
                                    );
                                } else if (cropSettings) {
                                    return (
                                        <div className="flex items-center justify-center text-blue-400 text-sm font-medium">
                                            <CheckCircle size={16} className="mr-1" />
                                            Recorte personalizado aplicado
                                        </div>
                                    );
                                } else if (ratioMatch) {
                                    return (
                                        <div className="flex items-center justify-center text-emerald-400 text-sm font-medium">
                                            <CheckCircle size={16} className="mr-1" />
                                            Proporción correcta (se escalará)
                                        </div>
                                    );
                                } else if (cropPercent > 0) {
                                    return (
                                        <div className={'flex items-center justify-center text-sm font-medium ' + 
                                            (cropPercent > 20 ? 'text-amber-400' : 'text-yellow-400')}>
                                            <AlertCircle size={16} className="mr-1" />
                                            Se recortará ~{cropPercent}% de la imagen
                                            {cropPercent > 20 && <span className="ml-1">(ajusta el recorte)</span>}
                                        </div>
                                    );
                                } else {
                                    return (
                                        <div className="flex items-center justify-center text-emerald-400 text-sm font-medium">
                                            <CheckCircle size={16} className="mr-1" />
                                            Imagen cargada
                                        </div>
                                    );
                                }
                            })()}
                            {originalDimensions && (
                                <span className="text-xs text-white/40 block mt-1">
                                    Original: {originalDimensions.width}x{originalDimensions.height}px → Requerido: {requiredWidth}x{requiredHeight}px
                                </span>
                            )}
                        </div>
                    </div>
                ) : (
                    <div className="py-8 flex flex-col items-center">
                        <Upload className={'mx-auto h-12 w-12 mb-3 ' + (error ? 'text-red-400' : 'text-white/30')} />
                        <p className="text-sm text-white/60">
                            {isDragActive ? "Suelta la imagen aqui" : "Arrastra una imagen o haz clic"}
                        </p>
                        <p className="text-xs text-white/30 mt-1">
                            JPG, PNG, WebP - Podras ajustar el recorte despues
                        </p>
                    </div>
                )}
            </div>

            {error && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-2 text-red-600 text-sm flex items-center"
                >
                    <AlertCircle size={16} className="mr-1" />
                    {error}
                </motion.div>
            )}

            {showCropEditor && imageSourceForCrop && (
                <ImageCropEditor
                    imageSrc={imageSourceForCrop}
                    targetWidth={requiredWidth}
                    targetHeight={requiredHeight}
                    onSave={handleSaveCrop}
                    onCancel={handleCancelCrop}
                    initialCrop={cropSettings}
                />
            )}
        </div>
    );
};

export default ImageUploader;
