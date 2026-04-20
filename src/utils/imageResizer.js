/**
 * Image Resize Utility for Falabella InPages
 * 
 * Resizes images to match the exact pixel dimensions required by each module.
 * Uses Canvas API for client-side image processing.
 */

import { modules } from '../config/falabellaRules';

/**
 * Get required dimensions for a module's image
 * @param {number} moduleId - The module ID
 * @returns {{ width: number, height: number } | null}
 */
export const getModuleDimensions = (moduleId) => {
    const module = modules.find(m => m.id === moduleId);
    if (!module || !module.imageWidth || !module.imageHeight) {
        return null;
    }
    return {
        width: module.imageWidth,
        height: module.imageHeight
    };
};

/**
 * Load an image from a source (URL, File, or Blob)
 * @param {string|File|Blob} source - Image source
 * @returns {Promise<HTMLImageElement>}
 */
const loadImage = (source) => {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        
        img.onload = () => resolve(img);
        img.onerror = () => reject(new Error(`Failed to load image: ${typeof source === 'string' ? source : 'File/Blob'}`));
        
        if (source instanceof File || source instanceof Blob) {
            img.src = URL.createObjectURL(source);
        } else {
            img.src = source;
        }
    });
};

/**
 * Calculate resize dimensions to fit within target while maintaining aspect ratio
 * Uses "cover" strategy: fills the target dimensions, cropping excess
 * 
 * @param {number} srcWidth - Source image width
 * @param {number} srcHeight - Source image height
 * @param {number} targetWidth - Target width
 * @param {number} targetHeight - Target height
 * @returns {{ sx: number, sy: number, sw: number, sh: number, dx: number, dy: number, dw: number, dh: number }}
 */
const calculateCoverCrop = (srcWidth, srcHeight, targetWidth, targetHeight) => {
    const srcRatio = srcWidth / srcHeight;
    const targetRatio = targetWidth / targetHeight;
    
    let sx, sy, sw, sh;
    
    if (srcRatio > targetRatio) {
        // Source is wider - crop sides
        sh = srcHeight;
        sw = srcHeight * targetRatio;
        sx = (srcWidth - sw) / 2;
        sy = 0;
    } else {
        // Source is taller - crop top/bottom
        sw = srcWidth;
        sh = srcWidth / targetRatio;
        sx = 0;
        sy = (srcHeight - sh) / 2;
    }
    
    return {
        sx: Math.floor(sx),
        sy: Math.floor(sy),
        sw: Math.floor(sw),
        sh: Math.floor(sh),
        dx: 0,
        dy: 0,
        dw: targetWidth,
        dh: targetHeight
    };
};

/**
 * Resize an image to specific dimensions
 * @param {string|File|Blob} source - Image source
 * @param {number} targetWidth - Target width in pixels
 * @param {number} targetHeight - Target height in pixels
 * @param {string} format - Output format ('image/jpeg' or 'image/png')
 * @param {number} quality - JPEG quality (0-1)
 * @returns {Promise<{ blob: Blob, dataUrl: string, cropInfo: Object }>}
 */
export const resizeImage = async (source, targetWidth, targetHeight, format = 'image/jpeg', quality = 0.92) => {
    const img = await loadImage(source);
    
    const canvas = document.createElement('canvas');
    canvas.width = targetWidth;
    canvas.height = targetHeight;
    
    const ctx = canvas.getContext('2d');
    
    // Fill with white background (for JPEGs with transparency)
    if (format === 'image/jpeg') {
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, targetWidth, targetHeight);
    }
    
    // Calculate crop dimensions for "cover" fit
    const crop = calculateCoverCrop(img.width, img.height, targetWidth, targetHeight);
    
    // Draw the image with cropping
    ctx.drawImage(
        img,
        crop.sx, crop.sy, crop.sw, crop.sh,  // Source rectangle
        crop.dx, crop.dy, crop.dw, crop.dh   // Destination rectangle
    );
    
    // Convert to blob
    const dataUrl = canvas.toDataURL(format, quality);
    const blob = await new Promise(resolve => {
        canvas.toBlob(resolve, format, quality);
    });
    
    // Clean up object URL if we created one
    if (source instanceof File || source instanceof Blob) {
        URL.revokeObjectURL(img.src);
    }
    
    return {
        blob,
        dataUrl,
        originalWidth: img.width,
        originalHeight: img.height,
        cropInfo: crop
    };
};

/**
 * Generate a preview of how the image will be cropped
 * Returns an object with preview data for UI display
 * 
 * @param {string|File|Blob} source - Image source
 * @param {number} targetWidth - Target width
 * @param {number} targetHeight - Target height
 * @returns {Promise<Object>} Preview data
 */
export const generateResizePreview = async (source, targetWidth, targetHeight) => {
    const img = await loadImage(source);
    
    const crop = calculateCoverCrop(img.width, img.height, targetWidth, targetHeight);
    
    // Calculate percentage of image that will be cropped
    const usedArea = crop.sw * crop.sh;
    const totalArea = img.width * img.height;
    const retainedPercent = Math.round((usedArea / totalArea) * 100);
    
    // Determine if significant cropping will occur
    const significantCrop = retainedPercent < 85;
    
    // Clean up
    if (source instanceof File || source instanceof Blob) {
        URL.revokeObjectURL(img.src);
    }
    
    return {
        originalWidth: img.width,
        originalHeight: img.height,
        targetWidth,
        targetHeight,
        cropInfo: crop,
        retainedPercent,
        significantCrop,
        cropDirection: img.width / img.height > targetWidth / targetHeight ? 'horizontal' : 'vertical',
        message: significantCrop 
            ? `⚠️ Se recortará ${100 - retainedPercent}% de la imagen (${img.width}×${img.height} → ${targetWidth}×${targetHeight})`
            : `✓ Ajuste mínimo (${100 - retainedPercent}% de recorte)`
    };
};

/**
 * Resize all images in blocks for export
 * @param {Array} blocks - Array of block objects
 * @param {Function} resolveImageSource - Function to resolve image source from value
 * @returns {Promise<Array>} Array of resized image objects
 */
export const resizeAllBlockImages = async (blocks, resolveImageSource) => {
    const resizedImages = [];
    let globalIndex = 1;
    
    for (const block of blocks) {
        const dims = getModuleDimensions(block.moduleId);
        if (!dims) continue; // Module has no images
        
        const imageFields = ['image', 'leftImage', 'rightImage'];
        
        for (const field of imageFields) {
            const value = block.data[field];
            if (!value) continue;
            
            try {
                const source = resolveImageSource(value);
                const { blob, originalWidth, originalHeight } = await resizeImage(
                    source,
                    dims.width,
                    dims.height
                );
                
                resizedImages.push({
                    index: globalIndex,
                    field,
                    moduleId: block.moduleId,
                    blob,
                    originalWidth,
                    originalHeight,
                    targetWidth: dims.width,
                    targetHeight: dims.height
                });
                
                globalIndex++;
            } catch (error) {
                console.error(`Failed to resize image for field ${field}:`, error);
                // Continue with original image
            }
        }
    }
    
    return resizedImages;
};

/**
 * Batch analyze all images in blocks for resize preview
 * @param {Array} blocks - Array of block objects
 * @param {Function} resolveImageSource - Function to resolve image source
 * @returns {Promise<Array>} Array of preview info objects
 */
export const analyzeAllImages = async (blocks, resolveImageSource) => {
    const analyses = [];
    
    for (let i = 0; i < blocks.length; i++) {
        const block = blocks[i];
        const dims = getModuleDimensions(block.moduleId);
        if (!dims) continue;
        
        const imageFields = ['image', 'leftImage', 'rightImage'];
        
        for (const field of imageFields) {
            const value = block.data[field];
            if (!value) continue;
            
            try {
                const source = resolveImageSource(value);
                const preview = await generateResizePreview(source, dims.width, dims.height);
                
                analyses.push({
                    blockIndex: i,
                    field,
                    moduleId: block.moduleId,
                    ...preview
                });
            } catch (error) {
                console.error(`Failed to analyze image for field ${field}:`, error);
            }
        }
    }
    
    return analyses;
};
