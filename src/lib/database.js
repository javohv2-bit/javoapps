/**
 * Supabase Database Service
 * 
 * Funciones para interactuar con las tablas:
 * - products: Catálogo de productos
 * - inpage_blocks: Bloques de cada InPage
 * - edit_history: Historial de cambios
 */

import { supabase, getImageUrl, uploadImage, STORAGE_BUCKET } from './supabase';

// ==================== PRODUCTS ====================

/**
 * Obtener todos los productos
 */
export const getProducts = async () => {
    try {
        const { data, error } = await supabase
            .from('products')
            .select('*')
            .order('category', { ascending: true })
            .order('name', { ascending: true });
        
        if (error) throw error;
        return { products: data, error: null };
    } catch (error) {
        console.error('Error fetching products:', error);
        return { products: [], error };
    }
};

/**
 * Obtener un producto por ID
 */
export const getProductById = async (productId) => {
    try {
        const { data, error } = await supabase
            .from('products')
            .select('*')
            .eq('id', productId)
            .single();
        
        if (error) throw error;
        return { product: data, error: null };
    } catch (error) {
        console.error('Error fetching product:', error);
        return { product: null, error };
    }
};

/**
 * Obtener un producto por SKU
 */
export const getProductBySku = async (sku) => {
    try {
        const { data, error } = await supabase
            .from('products')
            .select('*')
            .eq('sku', sku)
            .single();
        
        if (error) throw error;
        return { product: data, error: null };
    } catch (error) {
        console.error('Error fetching product by SKU:', error);
        return { product: null, error };
    }
};

/**
 * Crear un nuevo producto
 */
export const createProduct = async (product) => {
    try {
        const { data, error } = await supabase
            .from('products')
            .insert([{
                name: product.name,
                sku: product.sku,
                category: product.category,
                image_folder: product.imageFolder || product.id,
                excel_path: product.excelPath || null,
                is_template: product.isTemplate || false,
                created_at: new Date().toISOString()
            }])
            .select()
            .single();
        
        if (error) throw error;
        return { product: data, error: null };
    } catch (error) {
        console.error('Error creating product:', error);
        return { product: null, error };
    }
};

/**
 * Actualizar un producto
 */
export const updateProduct = async (productId, updates) => {
    try {
        const { data, error } = await supabase
            .from('products')
            .update({
                ...updates,
                updated_at: new Date().toISOString()
            })
            .eq('id', productId)
            .select()
            .single();
        
        if (error) throw error;
        return { product: data, error: null };
    } catch (error) {
        console.error('Error updating product:', error);
        return { product: null, error };
    }
};

/**
 * Eliminar un producto
 */
export const deleteProduct = async (productId) => {
    try {
        // Primero eliminar los bloques asociados
        await supabase
            .from('inpage_blocks')
            .delete()
            .eq('product_id', productId);
        
        // Luego eliminar el producto
        const { error } = await supabase
            .from('products')
            .delete()
            .eq('id', productId);
        
        if (error) throw error;
        return { success: true, error: null };
    } catch (error) {
        console.error('Error deleting product:', error);
        return { success: false, error };
    }
};

// ==================== INPAGE BLOCKS ====================

/**
 * Obtener bloques de un producto
 */
export const getBlocksByProductId = async (productId) => {
    try {
        const { data, error } = await supabase
            .from('inpage_blocks')
            .select('*')
            .eq('product_id', productId)
            .order('block_order', { ascending: true });
        
        if (error) throw error;
        
        // Convertir al formato esperado por la app
        const blocks = data.map(block => ({
            id: block.id.toString(),
            moduleId: block.module_id,
            data: block.block_data
        }));
        
        return { blocks, error: null };
    } catch (error) {
        console.error('Error fetching blocks:', error);
        return { blocks: [], error };
    }
};

/**
 * Guardar/actualizar bloques de un producto
 * Reemplaza todos los bloques existentes
 */
export const saveBlocks = async (productId, blocks) => {
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
        
        const { data, error } = await supabase
            .from('inpage_blocks')
            .insert(blocksToInsert)
            .select();
        
        if (error) throw error;
        return { blocks: data, error: null };
    } catch (error) {
        console.error('Error saving blocks:', error);
        return { blocks: null, error };
    }
};

/**
 * Actualizar un bloque específico
 */
export const updateBlock = async (blockId, updates) => {
    try {
        const { data, error } = await supabase
            .from('inpage_blocks')
            .update({
                module_id: updates.moduleId,
                block_data: updates.data,
                updated_at: new Date().toISOString()
            })
            .eq('id', blockId)
            .select()
            .single();
        
        if (error) throw error;
        return { block: data, error: null };
    } catch (error) {
        console.error('Error updating block:', error);
        return { block: null, error };
    }
};

// ==================== EDIT HISTORY ====================

/**
 * Guardar entrada en el historial
 */
export const saveToHistory = async (productId, action, details) => {
    try {
        const { data, error } = await supabase
            .from('edit_history')
            .insert([{
                product_id: productId,
                action: action,
                details: details,
                created_at: new Date().toISOString()
            }])
            .select()
            .single();
        
        if (error) throw error;
        return { entry: data, error: null };
    } catch (error) {
        console.error('Error saving to history:', error);
        return { entry: null, error };
    }
};

/**
 * Obtener historial de un producto
 */
export const getHistoryByProductId = async (productId, limit = 50) => {
    try {
        const { data, error } = await supabase
            .from('edit_history')
            .select('*')
            .eq('product_id', productId)
            .order('created_at', { ascending: false })
            .limit(limit);
        
        if (error) throw error;
        return { history: data, error: null };
    } catch (error) {
        console.error('Error fetching history:', error);
        return { history: [], error };
    }
};

// ==================== FULL INPAGE LOAD ====================

/**
 * Cargar un InPage completo (producto + bloques + URLs de imágenes)
 */
export const loadFullInPage = async (productId) => {
    try {
        // Obtener producto
        const { product, error: productError } = await getProductById(productId);
        if (productError) throw productError;
        if (!product) throw new Error('Product not found');
        
        // Obtener bloques
        const { blocks, error: blocksError } = await getBlocksByProductId(productId);
        if (blocksError) throw blocksError;
        
        // Procesar bloques para agregar URLs de imágenes
        const processedBlocks = blocks.map(block => {
            const processedData = { ...block.data };
            
            // Procesar campos de imagen
            ['image', 'leftImage', 'rightImage'].forEach(field => {
                if (processedData[field] && !processedData[field].startsWith('http')) {
                    processedData[field] = getImageUrl(`${product.image_folder}/${processedData[field]}`);
                }
            });
            
            return {
                ...block,
                data: processedData
            };
        });
        
        return {
            inpage: {
                id: product.id,
                name: product.name,
                sku: product.sku,
                category: product.category,
                imageFolder: product.image_folder,
                blocks: processedBlocks
            },
            error: null
        };
    } catch (error) {
        console.error('Error loading full InPage:', error);
        return { inpage: null, error };
    }
};

/**
 * Guardar un InPage completo (producto + bloques)
 */
export const saveFullInPage = async (productData, blocks) => {
    try {
        let product;
        
        // Verificar si el producto existe
        if (productData.id) {
            const { product: existing } = await getProductById(productData.id);
            if (existing) {
                // Actualizar
                const { product: updated, error } = await updateProduct(productData.id, productData);
                if (error) throw error;
                product = updated;
            } else {
                // Crear nuevo
                const { product: created, error } = await createProduct(productData);
                if (error) throw error;
                product = created;
            }
        } else {
            // Crear nuevo
            const { product: created, error } = await createProduct(productData);
            if (error) throw error;
            product = created;
        }
        
        // Guardar bloques
        const { error: blocksError } = await saveBlocks(product.id, blocks);
        if (blocksError) throw blocksError;
        
        // Guardar en historial
        await saveToHistory(product.id, 'save', {
            blocksCount: blocks.length,
            timestamp: new Date().toISOString()
        });
        
        return { product, error: null };
    } catch (error) {
        console.error('Error saving full InPage:', error);
        return { product: null, error };
    }
};

export default {
    getProducts,
    getProductById,
    getProductBySku,
    createProduct,
    updateProduct,
    deleteProduct,
    getBlocksByProductId,
    saveBlocks,
    updateBlock,
    saveToHistory,
    getHistoryByProductId,
    loadFullInPage,
    saveFullInPage
};
