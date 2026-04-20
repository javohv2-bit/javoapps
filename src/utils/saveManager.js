/**
 * Save Manager - Supabase Version
 * 
 * Guarda cambios de InPages directamente a Supabase
 */

import { supabase, supabaseAdmin, uploadImage, STORAGE_BUCKET } from '../lib/supabase';
import { invalidateCache } from '../data/supabaseData';

/**
 * Convert a File or Blob to base64 data URL
 */
const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
};

/**
 * Convert blob URL to actual Blob
 */
const blobUrlToBlob = async (blobUrl) => {
    const response = await fetch(blobUrl);
    return response.blob();
};

/**
 * Check if Supabase is available
 */
export const isSaveServerAvailable = async () => {
    try {
        const { data, error } = await supabase.from('products').select('count').limit(1);
        return !error;
    } catch {
        return false;
    }
};

/**
 * Check server and provide user feedback
 */
export const checkSaveServer = async () => {
    try {
        const { data, error } = await supabase.from('products').select('count').limit(1);
        if (error) throw error;
        return true;
    } catch (error) {
        throw new Error('No se puede conectar a Supabase: ' + error.message);
    }
};

/**
 * Save a single image to Supabase Storage
 * Uses supabaseAdmin for elevated permissions
 */
export const saveImage = async (imagePath, imageData) => {
    try {
        let file;
        
        console.log('📸 saveImage called with path:', imagePath);
        
        if (imageData instanceof File || imageData instanceof Blob) {
            file = imageData;
            console.log('  → Input is File/Blob, size:', file.size, 'type:', file.type);
        } else if (typeof imageData === 'string' && imageData.startsWith('blob:')) {
            console.log('  → Input is blob URL, converting...');
            file = await blobUrlToBlob(imageData);
            console.log('  → Converted to blob, size:', file.size);
        } else if (typeof imageData === 'string' && imageData.startsWith('data:')) {
            console.log('  → Input is data URL, converting...');
            const response = await fetch(imageData);
            file = await response.blob();
            console.log('  → Converted to blob, size:', file.size);
        } else {
            console.error('  ❌ Invalid image data format:', typeof imageData);
            throw new Error('Formato de imagen inválido. Tipo recibido: ' + typeof imageData);
        }
        
        const cleanPath = imagePath.replace(/^\//, '').replace(/^drive-data\/images\//, '');
        console.log('  → Clean path:', cleanPath);
        console.log('  → Bucket:', STORAGE_BUCKET);
        
        // Use supabaseAdmin for storage uploads (bypasses RLS)
        const { data, error } = await supabaseAdmin.storage
            .from(STORAGE_BUCKET)
            .upload(cleanPath, file, {
                cacheControl: '3600',
                upsert: true
            });
        
        if (error) {
            console.error('  ❌ Supabase Storage error:', error);
            // Provide more specific error messages
            if (error.message?.includes('Bucket not found')) {
                throw new Error(`El bucket "${STORAGE_BUCKET}" no existe en Supabase. Verifica la configuración.`);
            }
            if (error.message?.includes('new row violates row-level security')) {
                throw new Error('Error de permisos en Supabase Storage. Verifica las políticas del bucket.');
            }
            if (error.statusCode === 413 || error.message?.includes('too large')) {
                throw new Error('La imagen es demasiado grande. Máximo permitido: 50MB.');
            }
            throw new Error(`Error de Supabase: ${error.message}`);
        }
        
        console.log('  ✅ Upload successful, path:', data.path);
        
        const { data: urlData } = supabaseAdmin.storage
            .from(STORAGE_BUCKET)
            .getPublicUrl(data.path);
        
        console.log('  ✅ Public URL:', urlData.publicUrl);
        
        return {
            success: true,
            path: data.path,
            url: urlData.publicUrl
        };
    } catch (error) {
        console.error('❌ Error saving image:', error);
        throw error;
    }
};

/**
 * Save complete InPage to Supabase
 */
export const saveInPage = async ({ productId, sku, blocks, imagePath }) => {
    if (!productId) {
        throw new Error('Product ID is required for saving');
    }
    
    console.log('🔷 saveInPage starting with:', { productId, sku, imagePath, blocksCount: blocks.length });
    
    const savedImages = [];
    const updatedBlocks = [];
    const uploadErrors = []; // Track upload errors
    
    for (const block of blocks) {
        const blockData = { ...block.data };
        console.log(`📦 Processing block ${block.id}, moduleId: ${block.moduleId}`);
        
        for (const field of ['image', 'leftImage', 'rightImage']) {
            const imageValue = blockData[field];
            
            console.log(`  🖼️ Field "${field}":`, {
                hasValue: !!imageValue,
                type: imageValue ? typeof imageValue : 'null',
                isFile: imageValue instanceof File,
                isBlob: imageValue instanceof Blob,
                isBlobUrl: typeof imageValue === 'string' && imageValue?.startsWith?.('blob:'),
                isSupabaseUrl: typeof imageValue === 'string' && imageValue?.includes?.('supabase.co'),
                preview: typeof imageValue === 'string' ? imageValue.substring(0, 100) : (imageValue?.name || 'N/A')
            });
            
            if (!imageValue) continue;
            if (typeof imageValue === 'string' && imageValue.includes('supabase.co')) continue;
            
            if (imageValue instanceof File || imageValue instanceof Blob || 
                (typeof imageValue === 'string' && imageValue.startsWith('blob:'))) {
                
                console.log(`  ✅ Will upload "${field}"`);
                
                // Generar nombre único para cada imagen
                // Formato: [blockIndex]_[field]_[timestamp].jpg
                const blockIndex = blocks.indexOf(block);
                const timestamp = Date.now();
                const randomSuffix = Math.random().toString(36).substring(2, 6);
                const fileName = `block${blockIndex}_${field}_${timestamp}_${randomSuffix}.jpg`;
                
                const folder = imagePath || productId;
                const uploadPath = `${folder}/${fileName}`;
                
                console.log(`  📤 Uploading to: ${uploadPath}`);
                
                try {
                    const result = await saveImage(uploadPath, imageValue);
                    console.log(`  ✅ Upload success:`, result);
                    blockData[field] = result.url;
                    savedImages.push({ field, path: result.path });
                } catch (error) {
                    console.error(`  ❌ Error uploading ${field}:`, error);
                    // Track the error and clear the invalid field to prevent saving non-serializable data
                    uploadErrors.push({ block: block.id, field, error: error.message });
                    // Remove the File/Blob since it can't be serialized to JSON
                    // This prevents saving invalid data like {} to the database
                    delete blockData[field];
                }
            }
        }
        
        updatedBlocks.push({
            id: block.id,
            moduleId: block.moduleId,
            data: blockData
        });
    }
    
    // If there were upload errors, throw to notify the user
    if (uploadErrors.length > 0) {
        console.error('❌ Upload errors:', uploadErrors);
        const errorDetails = uploadErrors.map(e => `${e.field}: ${e.error}`).join(', ');
        throw new Error(`Error subiendo imágenes: ${errorDetails}. Las imágenes no fueron guardadas. Por favor intenta de nuevo o verifica tu conexión.`);
    }
    
    try {
        // Use supabaseAdmin for all database operations (bypasses RLS)
        console.log('🗄️ Deleting old blocks for product:', productId);
        const { error: deleteError } = await supabaseAdmin
            .from('inpage_blocks')
            .delete()
            .eq('product_id', productId);
        
        if (deleteError) {
            console.error('❌ Error deleting blocks:', deleteError);
            throw deleteError;
        }
        
        const blocksToInsert = updatedBlocks.map((block, index) => ({
            product_id: productId,
            block_order: index + 1,
            module_id: block.moduleId,
            block_data: block.data
        }));
        
        console.log('💾 Inserting blocks:', blocksToInsert.length);
        console.log('📝 Block data sample:', JSON.stringify(blocksToInsert[0]?.block_data, null, 2));
        
        const { error: insertError } = await supabaseAdmin
            .from('inpage_blocks')
            .insert(blocksToInsert);
        
        if (insertError) {
            console.error('❌ Error inserting blocks:', insertError);
            throw insertError;
        }
        
        console.log('✅ Blocks saved successfully');
        
        // Also log to edit history (optional, don't fail if this fails)
        try {
            await supabaseAdmin
                .from('edit_history')
                .insert([{
                    product_id: productId,
                    action: 'save',
                    details: {
                        sku,
                        blocksCount: updatedBlocks.length,
                        imagesUploaded: savedImages.length,
                        timestamp: new Date().toISOString()
                    }
                }]);
        } catch (historyError) {
            console.warn('⚠️ Could not save to edit_history:', historyError);
        }
        
        // Invalidar caché para que al volver se carguen datos frescos
        invalidateCache(productId);
        
        return {
            success: true,
            blocksCount: updatedBlocks.length,
            imagesUploaded: savedImages.length,
            updatedBlocks: updatedBlocks
        };
    } catch (error) {
        console.error('Error saving InPage:', error);
        throw new Error('Error guardando InPage: ' + error.message);
    }
};
