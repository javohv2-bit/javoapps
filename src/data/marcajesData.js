/**
 * Marcajes Data Service
 * 
 * Gestiona la base de datos de productos para marcajes UTM
 * Conecta con Supabase para persistencia en la nube
 */

import { supabase } from '../lib/supabase';

// Tabla en Supabase
const TABLE_NAME = 'marcajes_products';

/**
 * Obtener todos los productos
 * @returns {Promise<Object>} Mapa de nombre -> URL
 */
export const getProducts = async () => {
    try {
        const { data, error } = await supabase
            .from(TABLE_NAME)
            .select('name, url')
            .order('name', { ascending: true });

        if (error) throw error;

        // Convertir array a objeto {nombre: url}
        const productsMap = {};
        data.forEach(item => {
            productsMap[item.name] = item.url;
        });

        return productsMap;
    } catch (error) {
        console.error('Error fetching marcajes products:', error);
        return {};
    }
};

/**
 * Agregar o actualizar un producto
 * @param {string} name - Nombre del producto
 * @param {string} url - URL base del producto
 */
export const upsertProduct = async (name, url) => {
    const trimmedName = name.trim();
    const trimmedUrl = url.trim();
    
    try {
        console.log('Intentando guardar:', { name: trimmedName, url: trimmedUrl });
        
        // Primero intentar hacer UPDATE si existe
        const { data: updateData, error: updateError } = await supabase
            .from(TABLE_NAME)
            .update({ url: trimmedUrl })
            .eq('name', trimmedName)
            .select();

        if (updateError) {
            console.error('Error en UPDATE:', updateError);
            return { success: false, error: updateError.message };
        }

        // Si no se actualizó ninguna fila, hacer INSERT
        if (!updateData || updateData.length === 0) {
            const { data: insertData, error: insertError } = await supabase
                .from(TABLE_NAME)
                .insert({ name: trimmedName, url: trimmedUrl })
                .select();

            if (insertError) {
                console.error('Error en INSERT:', insertError);
                return { success: false, error: insertError.message };
            }
            
            console.log('Insert exitoso:', insertData);
            return { success: true, data: insertData };
        }
        
        console.log('Update exitoso:', updateData);
        return { success: true, data: updateData };
    } catch (error) {
        console.error('Error upserting product:', error);
        return { success: false, error: error.message };
    }
};

/**
 * Eliminar un producto
 * @param {string} name - Nombre del producto
 */
export const deleteProduct = async (name) => {
    try {
        const { error } = await supabase
            .from(TABLE_NAME)
            .delete()
            .eq('name', name);

        if (error) throw error;
        return { success: true };
    } catch (error) {
        console.error('Error deleting product:', error);
        return { success: false, error: error.message };
    }
};

/**
 * Importar productos en lote
 * @param {Object} productsMap - Objeto {nombre: url}
 */
export const importProducts = async (productsMap) => {
    try {
        const products = Object.entries(productsMap).map(([name, url]) => ({
            name: name.trim(),
            url: url.trim(),
            updated_at: new Date().toISOString()
        }));

        const { error } = await supabase
            .from(TABLE_NAME)
            .upsert(products, { onConflict: 'name' });

        if (error) throw error;
        return { success: true, count: products.length };
    } catch (error) {
        console.error('Error importing products:', error);
        return { success: false, error: error.message };
    }
};

/**
 * Obtener estadísticas
 */
export const getStats = async () => {
    try {
        const { count, error } = await supabase
            .from(TABLE_NAME)
            .select('*', { count: 'exact', head: true });

        if (error) throw error;
        return { totalProducts: count || 0 };
    } catch (error) {
        console.error('Error getting stats:', error);
        return { totalProducts: 0 };
    }
};
