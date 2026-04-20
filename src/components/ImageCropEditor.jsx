import React, { useState, useRef, useEffect, useCallback } from 'react';
import { X, Check, Move, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';

/**
 * ImageCropEditor - Interactive crop editor for adjusting image position
 * 
 * Allows users to position their image within the required Falabella dimensions
 * using drag-to-pan functionality.
 */
const ImageCropEditor = ({ 
    imageSrc, 
    targetWidth, 
    targetHeight, 
    onSave, 
    onCancel,
    initialCrop = null 
}) => {
    const containerRef = useRef(null);
    const [imageLoaded, setImageLoaded] = useState(false);
    const [originalDimensions, setOriginalDimensions] = useState({ width: 0, height: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
    
    // Position represents the offset of the image relative to the crop frame
    // Negative values move the image left/up, showing more of the right/bottom
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [scale, setScale] = useState(1);

    // Calculate the scale needed to fit the crop area in the preview
    const previewScale = 0.5; // Show at 50% size for better UX
    const previewWidth = targetWidth * previewScale;
    const previewHeight = targetHeight * previewScale;

    // Load image and get dimensions
    useEffect(() => {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => {
            setOriginalDimensions({ width: img.width, height: img.height });
            setImageLoaded(true);
            
            // Calculate initial scale to cover the target area
            const scaleX = targetWidth / img.width;
            const scaleY = targetHeight / img.height;
            const coverScale = Math.max(scaleX, scaleY);
            setScale(coverScale);
            
            // Center the image initially
            const scaledWidth = img.width * coverScale;
            const scaledHeight = img.height * coverScale;
            setPosition({
                x: (targetWidth - scaledWidth) / 2,
                y: (targetHeight - scaledHeight) / 2
            });
            
            // Apply initial crop if provided
            if (initialCrop) {
                setPosition({ x: initialCrop.x, y: initialCrop.y });
                setScale(initialCrop.scale || coverScale);
            }
        };
        
        if (imageSrc instanceof File) {
            img.src = URL.createObjectURL(imageSrc);
        } else {
            img.src = imageSrc;
        }
        
        return () => {
            if (imageSrc instanceof File) {
                URL.revokeObjectURL(img.src);
            }
        };
    }, [imageSrc, targetWidth, targetHeight, initialCrop]);

    // Handle mouse down for dragging
    const handleMouseDown = useCallback((e) => {
        e.preventDefault();
        setIsDragging(true);
        setDragStart({
            x: e.clientX - position.x * previewScale,
            y: e.clientY - position.y * previewScale
        });
    }, [position, previewScale]);

    // Handle mouse move for dragging
    const handleMouseMove = useCallback((e) => {
        if (!isDragging) return;
        
        const newX = (e.clientX - dragStart.x) / previewScale;
        const newY = (e.clientY - dragStart.y) / previewScale;
        
        // Calculate bounds to prevent dragging image out of view
        const scaledWidth = originalDimensions.width * scale;
        const scaledHeight = originalDimensions.height * scale;
        
        const minX = targetWidth - scaledWidth;
        const minY = targetHeight - scaledHeight;
        const maxX = 0;
        const maxY = 0;
        
        setPosition({
            x: Math.min(maxX, Math.max(minX, newX)),
            y: Math.min(maxY, Math.max(minY, newY))
        });
    }, [isDragging, dragStart, previewScale, originalDimensions, scale, targetWidth, targetHeight]);

    // Handle mouse up
    const handleMouseUp = useCallback(() => {
        setIsDragging(false);
    }, []);

    // Add global mouse listeners for dragging
    useEffect(() => {
        if (isDragging) {
            window.addEventListener('mousemove', handleMouseMove);
            window.addEventListener('mouseup', handleMouseUp);
            return () => {
                window.removeEventListener('mousemove', handleMouseMove);
                window.removeEventListener('mouseup', handleMouseUp);
            };
        }
    }, [isDragging, handleMouseMove, handleMouseUp]);

    // Handle zoom
    const handleZoom = (delta) => {
        const scaleX = targetWidth / originalDimensions.width;
        const scaleY = targetHeight / originalDimensions.height;
        const minScale = Math.max(scaleX, scaleY); // Minimum to cover target
        const maxScale = minScale * 3; // Allow 3x zoom
        
        const newScale = Math.min(maxScale, Math.max(minScale, scale + delta));
        
        // Adjust position to zoom from center
        const oldScaledWidth = originalDimensions.width * scale;
        const oldScaledHeight = originalDimensions.height * scale;
        const newScaledWidth = originalDimensions.width * newScale;
        const newScaledHeight = originalDimensions.height * newScale;
        
        const centerX = -position.x + targetWidth / 2;
        const centerY = -position.y + targetHeight / 2;
        
        const newCenterX = (centerX / oldScaledWidth) * newScaledWidth;
        const newCenterY = (centerY / oldScaledHeight) * newScaledHeight;
        
        let newX = -(newCenterX - targetWidth / 2);
        let newY = -(newCenterY - targetHeight / 2);
        
        // Clamp to bounds
        const minX = targetWidth - newScaledWidth;
        const minY = targetHeight - newScaledHeight;
        newX = Math.min(0, Math.max(minX, newX));
        newY = Math.min(0, Math.max(minY, newY));
        
        setScale(newScale);
        setPosition({ x: newX, y: newY });
    };

    // Reset to center
    const handleReset = () => {
        const scaleX = targetWidth / originalDimensions.width;
        const scaleY = targetHeight / originalDimensions.height;
        const coverScale = Math.max(scaleX, scaleY);
        setScale(coverScale);
        
        const scaledWidth = originalDimensions.width * coverScale;
        const scaledHeight = originalDimensions.height * coverScale;
        setPosition({
            x: (targetWidth - scaledWidth) / 2,
            y: (targetHeight - scaledHeight) / 2
        });
    };

    // Save crop settings
    const handleSave = () => {
        onSave({
            x: position.x,
            y: position.y,
            scale: scale,
            targetWidth,
            targetHeight
        });
    };

    const scaledImageWidth = originalDimensions.width * scale * previewScale;
    const scaledImageHeight = originalDimensions.height * scale * previewScale;

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full overflow-hidden">
                {/* Header */}
                <div className="px-6 py-4 border-b bg-gradient-to-r from-gray-50 to-gray-100">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-lg font-bold text-gray-900">Ajustar Recorte</h3>
                            <p className="text-sm text-gray-500">
                                Arrastra la imagen para ajustar el encuadre
                            </p>
                        </div>
                        <div className="text-right">
                            <div className="text-sm font-mono bg-gray-200 px-3 py-1 rounded">
                                {targetWidth} x {targetHeight}px
                            </div>
                            {imageLoaded && (
                                <div className="text-xs text-gray-400 mt-1">
                                    Original: {originalDimensions.width} x {originalDimensions.height}px
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Editor Area */}
                <div className="p-6 bg-gray-900 flex items-center justify-center min-h-[400px]">
                    {imageLoaded ? (
                        <div className="relative">
                            {/* Crop frame indicator */}
                            <div 
                                ref={containerRef}
                                className="relative overflow-hidden border-4 border-white shadow-2xl cursor-move"
                                style={{
                                    width: previewWidth,
                                    height: previewHeight,
                                }}
                                onMouseDown={handleMouseDown}
                            >
                                {/* Image */}
                                <img
                                    src={imageSrc instanceof File ? URL.createObjectURL(imageSrc) : imageSrc}
                                    alt="Crop preview"
                                    draggable={false}
                                    className="absolute select-none"
                                    style={{
                                        width: scaledImageWidth,
                                        height: scaledImageHeight,
                                        left: position.x * previewScale,
                                        top: position.y * previewScale,
                                        maxWidth: 'none'
                                    }}
                                />
                                
                                {/* Grid overlay */}
                                <div className="absolute inset-0 pointer-events-none">
                                    <div className="w-full h-full grid grid-cols-3 grid-rows-3">
                                        {[...Array(9)].map((_, i) => (
                                            <div key={i} className="border border-white/20" />
                                        ))}
                                    </div>
                                </div>
                                
                                {/* Drag indicator */}
                                {isDragging && (
                                    <div className="absolute inset-0 bg-blue-500/10 border-2 border-blue-400 pointer-events-none" />
                                )}
                            </div>
                            
                            {/* Move icon hint */}
                            <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-2 text-white/60 text-xs">
                                <Move size={14} />
                                <span>Arrastra para mover</span>
                            </div>
                        </div>
                    ) : (
                        <div className="text-white/50 animate-pulse">Cargando imagen...</div>
                    )}
                </div>

                {/* Controls */}
                <div className="px-6 py-4 border-t bg-gray-50">
                    <div className="flex items-center justify-between">
                        {/* Zoom controls */}
                        <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-500 mr-2">Zoom:</span>
                            <button
                                onClick={() => handleZoom(-0.1)}
                                className="p-2 rounded-lg bg-white border hover:bg-gray-100 transition-colors"
                                title="Alejar"
                            >
                                <ZoomOut size={18} />
                            </button>
                            <div className="w-20 text-center text-sm font-mono bg-white border rounded px-2 py-1">
                                {Math.round(scale * 100)}%
                            </div>
                            <button
                                onClick={() => handleZoom(0.1)}
                                className="p-2 rounded-lg bg-white border hover:bg-gray-100 transition-colors"
                                title="Acercar"
                            >
                                <ZoomIn size={18} />
                            </button>
                            <button
                                onClick={handleReset}
                                className="p-2 rounded-lg bg-white border hover:bg-gray-100 transition-colors ml-2"
                                title="Restablecer"
                            >
                                <RotateCcw size={18} />
                            </button>
                        </div>

                        {/* Action buttons */}
                        <div className="flex items-center gap-3">
                            <button
                                onClick={onCancel}
                                className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 transition-colors flex items-center gap-2"
                            >
                                <X size={18} />
                                Cancelar
                            </button>
                            <button
                                onClick={handleSave}
                                className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors flex items-center gap-2 shadow-lg shadow-blue-200"
                            >
                                <Check size={18} />
                                Aplicar Recorte
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ImageCropEditor;
