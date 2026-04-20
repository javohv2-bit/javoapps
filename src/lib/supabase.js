/**
 * Supabase Client Configuration
 * 
 * Este archivo configura el cliente de Supabase para:
 * - Base de datos (productos, bloques, historial)
 * - Storage (imágenes de productos)
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://bupnqihroawrvcvzpbqv.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ1cG5xaWhyb2F3cnZjdnpwYnF2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk3MzczOTcsImV4cCI6MjA4NTMxMzM5N30.EKM3ZiTCiO3tUfbfeDs2Tc91ditpkbxQSsWOAF8baS0';

// Service Role Key - tiene permisos completos para Storage
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ1cG5xaWhyb2F3cnZjdnpwYnF2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2OTczNzM5NywiZXhwIjoyMDg1MzEzMzk3fQ.Igo0XyzBJ5rWDCSCOP3T0kvV2_dILE1PAUdiQLZGYPo';

// Cliente público para consultas de base de datos
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Cliente con permisos elevados para Storage (uploads)
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
    auth: { storageKey: 'sb-admin-auth-token', autoRefreshToken: false, persistSession: false }
});

// Constantes útiles
export const STORAGE_BUCKET = 'inpage-images';
export const SUPABASE_URL = supabaseUrl;

/**
 * Obtener URL pública de una imagen en el bucket
 * @param {string} path - Ruta de la imagen en el bucket
 * @returns {string} URL pública de la imagen
 */
export const getImageUrl = (path) => {
    if (!path) return null;
    
    // Si ya es una URL completa, devolverla
    if (path.startsWith('http')) return path;
    
    // Limpiar el path
    const cleanPath = path.replace(/^\//, '');
    
    const { data } = supabase.storage
        .from(STORAGE_BUCKET)
        .getPublicUrl(cleanPath);
    
    return data?.publicUrl || null;
};

/**
 * Subir una imagen al bucket
 * @param {File|Blob} file - Archivo a subir
 * @param {string} path - Ruta donde guardar (ej: 'eos-r50v/banner.jpg')
 * @returns {Promise<{url: string, error: Error|null}>}
 */
export const uploadImage = async (file, path) => {
    try {
        const { data, error } = await supabase.storage
            .from(STORAGE_BUCKET)
            .upload(path, file, {
                cacheControl: '3600',
                upsert: true // Sobrescribir si existe
            });
        
        if (error) throw error;
        
        return {
            url: getImageUrl(data.path),
            path: data.path,
            error: null
        };
    } catch (error) {
        console.error('Error uploading image:', error);
        return { url: null, path: null, error };
    }
};

/**
 * Eliminar una imagen del bucket
 * @param {string} path - Ruta de la imagen
 */
export const deleteImage = async (path) => {
    try {
        const { error } = await supabase.storage
            .from(STORAGE_BUCKET)
            .remove([path]);
        
        if (error) throw error;
        return { success: true, error: null };
    } catch (error) {
        console.error('Error deleting image:', error);
        return { success: false, error };
    }
};

/**
 * Listar imágenes en una carpeta del bucket
 * @param {string} folder - Carpeta a listar
 */
export const listImages = async (folder = '') => {
    try {
        const { data, error } = await supabase.storage
            .from(STORAGE_BUCKET)
            .list(folder, {
                limit: 100,
                sortBy: { column: 'name', order: 'asc' }
            });
        
        if (error) throw error;
        return { images: data, error: null };
    } catch (error) {
        console.error('Error listing images:', error);
        return { images: [], error };
    }
};

export default supabase;
