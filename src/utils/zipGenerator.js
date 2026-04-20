import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { modules } from '../config/falabellaRules';
import { resizeImage, getModuleDimensions } from './imageResizer';

/**
 * Fetches an image from a URL and returns it as a blob
 * @param {string} url - The URL of the image to fetch
 * @returns {Promise<Blob>} The image blob
 */
const fetchImageAsBlob = async (url) => {
    console.log(`[ZipGenerator] Fetching image from: ${url}`);
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`Failed to fetch image: ${url} (${response.status})`);
    }
    const blob = await response.blob();
    console.log(`[ZipGenerator] Fetched image, size: ${blob.size} bytes`);
    return blob;
};

/**
 * Fetches and resizes an image to the required dimensions
 * @param {string|File|Blob} source - Image source
 * @param {number} targetWidth - Target width in pixels
 * @param {number} targetHeight - Target height in pixels
 * @returns {Promise<Blob>} Resized image blob
 */
const fetchAndResizeImage = async (source, targetWidth, targetHeight) => {
    let imageSource = source;
    
    // If it's a URL string, fetch it first
    if (typeof source === 'string') {
        imageSource = await fetchImageAsBlob(source);
    }
    
    // Resize the image
    console.log(`[ZipGenerator] Resizing to ${targetWidth}x${targetHeight}...`);
    const { blob, originalWidth, originalHeight } = await resizeImage(
        imageSource, 
        targetWidth, 
        targetHeight, 
        'image/jpeg', 
        0.92
    );
    
    console.log(`[ZipGenerator] Resized from ${originalWidth}x${originalHeight} to ${targetWidth}x${targetHeight}`);
    return blob;
};

/**
 * Generates a ZIP file containing:
 * - The filled Excel file
 * - All images renamed according to Falabella's naming convention
 * 
 * Image Naming Convention: SKU-img_N.jpg
 * - N is sequential across ALL images in the InPage
 * - Example: 6886486-img_1.jpg, 6886486-img_2.jpg, etc.
 * 
 * @param {string} sku - The SKU Padre
 * @param {Array} blocks - Array of block objects with moduleId and data
 * @param {ArrayBuffer} excelBuffer - The generated Excel buffer
 */
export const generateZip = async (sku, blocks, excelBuffer) => {
    console.log(`[ZipGenerator] Starting ZIP generation for SKU: ${sku}`);
    const zip = new JSZip();

    // Add the Excel file
    zip.file(`InPage_${sku}.xlsx`, excelBuffer);
    console.log(`[ZipGenerator] Added Excel file`);

    // Add images folder
    const imgFolder = zip.folder("Images");

    // Track global image index for naming (must match excelGenerator logic)
    let globalImageIndex = 1;

    // Collect all image promises
    const imagePromises = [];

    // Iterate blocks and prepare images
    for (const block of blocks) {
        const moduleDef = modules.find(m => m.id === block.moduleId);
        if (!moduleDef) {
            console.log(`[ZipGenerator] Module ${block.moduleId} not found, skipping`);
            continue;
        }

        console.log(`[ZipGenerator] Processing module ${moduleDef.id}: ${moduleDef.name}`);

        // Check for image fields in the order they appear in the module
        const imageFields = ['image', 'leftImage', 'rightImage'];

        for (const field of imageFields) {
            const value = block.data[field];
            console.log(`[ZipGenerator] Field "${field}": ${value ? typeof value : 'undefined'}`);

            if (!value) continue;

            const currentIndex = globalImageIndex;
            globalImageIndex++;

            // Get required dimensions for this module
            const dims = getModuleDimensions(block.moduleId);
            
            // Always use .jpg for resized images
            const fileName = `${sku}-img_${currentIndex}.jpg`;
            console.log(`[ZipGenerator] Will save as: ${fileName}`);

            if (dims) {
                // Resize image to Falabella's required dimensions
                console.log(`[ZipGenerator] Resizing image to ${dims.width}x${dims.height}px`);
                imagePromises.push(
                    fetchAndResizeImage(value, dims.width, dims.height)
                        .then(blob => {
                            imgFolder.file(fileName, blob);
                            console.log(`[ZipGenerator] Added resized ${fileName} to ZIP`);
                        })
                        .catch(err => {
                            console.error(`[ZipGenerator] Could not resize image:`, err);
                            // Fallback: try to add original
                            if (value instanceof File) {
                                imgFolder.file(fileName, value);
                            }
                        })
                );
            } else if (value instanceof File) {
                // No dimensions required, add file as-is
                console.log(`[ZipGenerator] Adding File object: ${value.name}`);
                imgFolder.file(fileName, value);
            } else if (typeof value === 'string') {
                // Fetch and add without resize
                imagePromises.push(
                    fetchImageAsBlob(value)
                        .then(blob => {
                            imgFolder.file(fileName, blob);
                            console.log(`[ZipGenerator] Added ${fileName} to ZIP`);
                        })
                        .catch(err => {
                            console.error(`[ZipGenerator] Could not fetch image ${value}:`, err);
                        })
                );
            }
        }
    }

    console.log(`[ZipGenerator] Waiting for ${imagePromises.length} image fetches...`);

    // Wait for all images to be added
    await Promise.all(imagePromises);

    console.log(`[ZipGenerator] All images fetched, generating ZIP...`);

    // Generate and download zip
    const content = await zip.generateAsync({ type: "blob" });
    console.log(`[ZipGenerator] ZIP generated, size: ${content.size} bytes`);

    saveAs(content, `InPage_${sku}.zip`);
    console.log(`[ZipGenerator] ✓ ZIP download initiated`);
};
