/**
 * Supabase InPage Data Provider
 * 
 * Reemplaza driveInPages.js para cargar datos desde Supabase
 * Los productos con staticData (campañas) se mezclan con el catálogo de Supabase.
 */

import { supabase, getImageUrl, STORAGE_BUCKET } from '../lib/supabase';
import { powershotG7XMarkIII, eosR10, eosR50, eosRP } from './canonInPages';

// Productos de campaña con static data (no requieren Supabase)
const STATIC_CAMPAIGN_PRODUCTS = [
    { id: 'g7x-iii',   category: 'Photo', name: 'PowerShot G7X Mark III',  sku: '17507574', staticData: powershotG7XMarkIII, imagePath: null, badges: [] },
    { id: 'r10-18-45', category: 'Photo', name: 'EOS R10 RF-S 18-45mm',    sku: '16765189', staticData: eosR10,              imagePath: null, badges: [] },
    { id: 'r50-18-45', category: 'Photo', name: 'EOS R50 18-45 IS STM',    sku: '16765190', staticData: eosR50,              imagePath: null, badges: [] },
    { id: 'eos-rp',    category: 'Photo', name: 'EOS RP RF 24-105mm S',    sku: '16487747', staticData: eosRP,               imagePath: null, badges: [] },
];

// Cache local para productos cargados
const loadedData = new Map();

/**
 * Invalidar el caché de un producto específico o todo el caché
 * @param {string|null} productId - ID del producto a invalidar, o null para limpiar todo
 */
export const invalidateCache = (productId = null) => {
    if (productId) {
        loadedData.delete(productId);
        console.log(`Cache invalidado para: ${productId}`);
    } else {
        loadedData.clear();
        console.log('Cache completo invalidado');
    }
};

/**
 * Obtener todos los productos del catálogo
 * Mezcla productos de Supabase con productos de campaña (static data)
 */
export const getProductsCatalog = async () => {
    try {
        const { data, error } = await supabase
            .from('products')
            .select('*')
            .order('category', { ascending: true })
            .order('name', { ascending: true });
        
        if (error) throw error;
        
        // Crear mapa de productos de campaña por ID para búsqueda rápida
        const campaignMap = new Map(STATIC_CAMPAIGN_PRODUCTS.map(p => [p.id, p]));
        
        // Convertir al formato esperado por la app y MEZCLAR staticData si existe
        const supabaseProducts = data.map(product => {
            const campaignProduct = campaignMap.get(product.id);
            const base = {
                id: product.id,
                category: product.category,
                name: product.name,
                sku: product.sku,
                imagePath: product.image_folder ? `${product.image_folder}` : null,
                isTemplate: product.is_template,
                excelPath: product.excel_path,
                badges: product.badges || []
            };
            
            // Si tiene datos de campaña, mezclar el staticData
            if (campaignProduct) {
                console.log('[getProductsCatalog] Merging staticData for:', product.id);
                return { ...base, staticData: campaignProduct.staticData };
            }
            return base;
        });

        // IDs ya presentes en Supabase
        const supabaseIds = new Set(supabaseProducts.map(p => p.id));
        // Agregar solo los productos de campaña que NO existen en Supabase
        const extraCampaignProducts = STATIC_CAMPAIGN_PRODUCTS.filter(p => !supabaseIds.has(p.id));

        console.log('[getProductsCatalog] Supabase products:', supabaseProducts.length);
        console.log('[getProductsCatalog] Products with staticData merged:', supabaseProducts.filter(p => p.staticData).map(p => p.id));
        console.log('[getProductsCatalog] Extra campaign products added:', extraCampaignProducts.map(p => p.id));
        
        // Mezclar: primero Supabase (ya con staticData merged), luego extras
        return [...supabaseProducts, ...extraCampaignProducts];
    } catch (error) {
        console.error('Error fetching products catalog:', error);
        // En caso de error de red, al menos mostrar los productos de campaña
        return [...STATIC_CAMPAIGN_PRODUCTS];
    }
};

/**
 * Cargar un InPage completo (producto + bloques)
 * @param {Object} item - Item del catálogo
 * @returns {Promise<Object>} InPage con bloques y datos
 */
export const loadInPage = async (item) => {
    console.log('[loadInPage] Loading item:', item.id, item.name, 'hasStaticData:', !!item.staticData);
    
    // Check cache first
    if (loadedData.has(item.id)) {
        console.log('[loadInPage] Returning cached data for:', item.id);
        return loadedData.get(item.id);
    }

    try {
        // SIEMPRE consultar Supabase primero (incluso para productos con staticData)
        // Los bloques guardados en Supabase representan ediciones del usuario
        const { data: blocks, error } = await supabase
            .from('inpage_blocks')
            .select('*')
            .eq('product_id', item.id)
            .order('block_order', { ascending: true });
        
        if (error) throw error;
        
        // Si no hay bloques en Supabase pero hay staticData, usar como fallback
        if ((!blocks || blocks.length === 0) && item.staticData) {
            console.log('[loadInPage] No blocks in Supabase, using staticData fallback for:', item.id);
            const result = {
                ...item,
                blocks: item.staticData.blocks,
                sku: item.sku || item.staticData.sku || 'N/A',
                loaded: true
            };
            loadedData.set(item.id, result);
            return result;
        }
        
        console.log('[loadInPage] Loaded from Supabase, blocks:', blocks.length);
        
        // Procesar bloques y resolver URLs de imágenes
        const processedBlocks = blocks.map(block => {
            const blockData = { ...block.block_data };
            
            // Procesar campos de imagen para obtener URLs públicas
            ['image', 'main_image', 'leftImage', 'rightImage'].forEach(field => {
                const value = blockData[field];
                
                // Solo procesar si es un string (no File, Blob, null, undefined, etc.)
                if (value && typeof value === 'string') {
                    // Si ya es una URL completa de Supabase u otra, dejarlo
                    if (value.startsWith('http')) {
                        return;
                    }
                    
                    // Ruta relativa - construir URL de Supabase
                    const imagePath = value.startsWith('/') 
                        ? value.substring(1) 
                        : value;
                    
                    // Si es una ruta hites/ directa
                    if (imagePath.startsWith('hites/')) {
                        blockData[field] = getImageUrl(imagePath);
                    }
                    // Si la imagen está en drive-data, mapear a la carpeta del producto
                    else if (imagePath.startsWith('drive-data/images/')) {
                        const relativePath = imagePath.replace('drive-data/images/', '');
                        blockData[field] = getImageUrl(relativePath);
                    } else if (item.imagePath) {
                        // Imagen relativa a la carpeta del producto
                        const fileName = imagePath.split('/').pop();
                        blockData[field] = getImageUrl(`${item.imagePath}/${fileName}`);
                    } else {
                        // Usar el path tal cual
                        blockData[field] = getImageUrl(imagePath);
                    }
                }
            });
            
            return {
                id: block.id.toString(),
                moduleId: block.module_id,
                data: blockData
            };
        });
        
        const result = {
            ...item,
            blocks: processedBlocks,
            sku: item.sku || 'N/A',
            loaded: true
        };
        
        // Cache the result
        loadedData.set(item.id, result);
        
        return result;
    } catch (error) {
        console.error('Error loading InPage:', error);
        // Si hay error de red pero hay staticData, usarlos como fallback
        if (item.staticData) {
            console.log('[loadInPage] Supabase error, falling back to staticData for:', item.id);
            const result = {
                ...item,
                blocks: item.staticData.blocks,
                sku: item.sku || item.staticData.sku || 'N/A',
                loaded: true
            };
            loadedData.set(item.id, result);
            return result;
        }
        return {
            ...item,
            blocks: [],
            sku: item.sku || 'N/A',
            loaded: false,
            error: error.message
        };
    }
};

/**
 * Guardar bloques de un InPage
 * @param {string} productId - ID del producto
 * @param {Array} blocks - Array de bloques
 */
export const saveInPageBlocks = async (productId, blocks) => {
    try {
        // Eliminar bloques existentes
        await supabase
            .from('inpage_blocks')
            .delete()
            .eq('product_id', productId);
        
        // Insertar nuevos bloques
        const blocksToInsert = blocks.map((block, index) => ({
            product_id: productId,
            block_order: index + 1,
            module_id: block.moduleId,
            block_data: block.data
        }));
        
        const { error } = await supabase
            .from('inpage_blocks')
            .insert(blocksToInsert);
        
        if (error) throw error;
        
        // Invalidar cache
        loadedData.delete(productId);
        
        // Guardar en historial
        await supabase
            .from('edit_history')
            .insert([{
                product_id: productId,
                action: 'save_blocks',
                details: { blocksCount: blocks.length }
            }]);
        
        return { success: true, error: null };
    } catch (error) {
        console.error('Error saving blocks:', error);
        return { success: false, error };
    }
};

/**
 * Subir una imagen al bucket de Supabase
 * @param {File|Blob} file - Archivo de imagen
 * @param {string} productId - ID del producto (carpeta)
 * @param {string} fileName - Nombre del archivo
 */
export const uploadProductImage = async (file, productId, fileName) => {
    try {
        const path = `${productId}/${fileName}`;
        
        const { data, error } = await supabase.storage
            .from(STORAGE_BUCKET)
            .upload(path, file, {
                cacheControl: '3600',
                upsert: true
            });
        
        if (error) throw error;
        
        return {
            success: true,
            url: getImageUrl(data.path),
            path: data.path,
            error: null
        };
    } catch (error) {
        console.error('Error uploading image:', error);
        return { success: false, url: null, path: null, error };
    }
};

/**
 * Obtener lista de imágenes de un producto
 * @param {string} productId - ID del producto (carpeta)
 */
export const getProductImages = async (productId) => {
    try {
        const { data, error } = await supabase.storage
            .from(STORAGE_BUCKET)
            .list(productId, {
                limit: 100,
                sortBy: { column: 'name', order: 'asc' }
            });
        
        if (error) throw error;
        
        return data.map(file => ({
            name: file.name,
            url: getImageUrl(`${productId}/${file.name}`),
            size: file.metadata?.size || 0
        }));
    } catch (error) {
        console.error('Error listing images:', error);
        return [];
    }
};

/**
 * Limpiar cache de un producto específico o todo
 */
export const clearCache = (productId = null) => {
    if (productId) {
        loadedData.delete(productId);
    } else {
        loadedData.clear();
    }
};

// Para compatibilidad, exportar también como default
export default {
    getProductsCatalog,
    loadInPage,
    saveInPageBlocks,
    uploadProductImage,
    getProductImages,
    clearCache
};
