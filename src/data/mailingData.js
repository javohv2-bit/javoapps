/**
 * Mailing Data Provider
 * 
 * Supabase CRUD operations for mailing products, assets, and templates
 * Uses the unified 'marcajes_products' table shared with Marcajes Maker
 */

import { supabase, supabaseAdmin, getImageUrl, SUPABASE_URL } from '../lib/supabase';

export const MAILING_STORAGE_BUCKET = 'mailing-images';

// ============================================
// PRODUCTS CRUD (Using unified 'marcajes_products' table)
// ============================================

/**
 * Get all mailing products from unified marcajes_products table
 * Maps product data to mailing format
 */
export const getMailingProducts = async () => {
    try {
        const { data, error } = await supabase
            .from('marcajes_products')
            .select('*')
            .order('category')
            .order('name');

        if (error) throw error;
        
        // Map products to mailing format
        const mailingProducts = data.map(product => ({
            id: product.id,
            name: product.name,
            url: product.url || null,
            sku: product.sku,
            category: product.category,
            subtitle: product.subtitle || '',
            image_url: product.image_url || getImageUrl(product.image_folder, 'main.png'),
            logo_url: product.logo_url || null,
            price_before: product.price_before || null,
            price_now: product.price_now || product.price || null,
            discount_percentage: product.discount_percentage || null,
            features: product.features || [],
            is_active: true
        }));
        
        return { data: mailingProducts, error: null };
    } catch (error) {
        console.error('Error fetching mailing products:', error);
        return { data: [], error };
    }
};

/**
 * Get a single product by ID
 */
export const getMailingProduct = async (id) => {
    try {
        const { data, error } = await supabase
            .from('marcajes_products')
            .select('*')
            .eq('id', id)
            .single();

        if (error) throw error;
        
        // Map to mailing format
        const mailingProduct = {
            id: data.id,
            name: data.name,
            sku: data.sku,
            category: data.category,
            subtitle: data.subtitle || '',
            image_url: data.image_url || getImageUrl(data.image_folder, 'main.png'),
            price_before: data.price_before || null,
            price_now: data.price_now || data.price || null,
            discount_percentage: data.discount_percentage || null,
            features: data.features || [],
            is_active: true
        };
        
        return { data: mailingProduct, error: null };
    } catch (error) {
        console.error('Error fetching product:', error);
        return { data: null, error };
    }
};

/**
 * Create a new mailing product in main products table
 */
export const createMailingProduct = async (product) => {
    try {
        const { data, error } = await supabase
            .from('marcajes_products')
            .insert([{
                name: product.name,
                url: product.url || '',
                sku: product.sku || `MAILING-${Date.now()}`,
                category: product.category || 'Otros',
                subtitle: product.subtitle || '',
                image_url: product.image_url || null,
                image_folder: product.image_folder || null,
                price_before: product.price_before || null,
                price_now: product.price_now || null,
                price: product.price_now || null,
                discount_percentage: product.discount_percentage || null,
                features: product.features || [],
                created_at: new Date().toISOString()
            }])
            .select()
            .single();

        if (error) throw error;
        return { data, error: null };
    } catch (error) {
        console.error('Error creating product:', error);
        return { data: null, error };
    }
};

/**
 * Update a mailing product (basic info only - prices come from paste)
 */
export const updateMailingProduct = async (id, updates) => {
    try {
        const updateData = {
            name: updates.name,
            url: updates.url || null,
            subtitle: updates.subtitle || '',
            category: updates.category || 'cameras',
            image_url: updates.image_url || null,
            logo_url: updates.logo_url || null,
            features: updates.features || []
        };
        
        console.log('Updating product ID:', id, 'with data:', updateData);
        
        const { data, error } = await supabase
            .from('marcajes_products')
            .update(updateData)
            .eq('id', id)
            .select()
            .single();

        if (error) {
            console.error('Supabase update error:', error.message);
            throw error;
        }
        return { data, error: null };
    } catch (error) {
        console.error('Error updating product:', error);
        return { data: null, error };
    }
};

/**
 * Delete a mailing product
 */
export const deleteMailingProduct = async (id) => {
    try {
        const { error } = await supabase
            .from('marcajes_products')
            .delete()
            .eq('id', id);

        if (error) throw error;
        return { success: true, error: null };
    } catch (error) {
        console.error('Error deleting product:', error);
        return { success: false, error };
    }
};

// ============================================
// ASSETS CRUD
// ============================================

/**
 * Get all assets by type
 * @param {string} type - 'header', 'banner', 'offer_banner', 'text_module', 'disclaimer', 'social_bar'
 */
export const getMailingAssets = async (type = null) => {
    try {
        let query = supabase
            .from('mailing_assets')
            .select('*')
            .eq('is_active', true)
            .order('created_at', { ascending: false });

        if (type) {
            query = query.eq('type', type);
        }

        const { data, error } = await query;

        if (error) throw error;
        return { data, error: null };
    } catch (error) {
        console.error('Error fetching assets:', error);
        return { data: [], error };
    }
};

/**
 * Create a new asset
 */
export const createMailingAsset = async (asset) => {
    try {
        const { data, error } = await supabase
            .from('mailing_assets')
            .insert([asset])
            .select()
            .single();

        if (error) throw error;
        return { data, error: null };
    } catch (error) {
        console.error('Error creating asset:', error);
        return { data: null, error };
    }
};

/**
 * Delete an asset
 */
export const deleteMailingAsset = async (id) => {
    try {
        const { error } = await supabase
            .from('mailing_assets')
            .update({ is_active: false })
            .eq('id', id);

        if (error) throw error;
        return { success: true, error: null };
    } catch (error) {
        console.error('Error deleting asset:', error);
        return { success: false, error };
    }
};

// ============================================
// TEMPLATES CRUD
// ============================================

/**
 * Get all saved templates
 */
export const getMailingTemplates = async () => {
    try {
        const { data, error } = await supabase
            .from('mailing_templates')
            .select('*')
            .order('updated_at', { ascending: false });

        if (error) throw error;
        return { data, error: null };
    } catch (error) {
        console.error('Error fetching templates:', error);
        return { data: [], error };
    }
};

/**
 * Save a mailing template
 */
export const saveMailingTemplate = async (template) => {
    try {
        const { data, error } = await supabase
            .from('mailing_templates')
            .upsert([template], { onConflict: 'id' })
            .select()
            .single();

        if (error) throw error;
        return { data, error: null };
    } catch (error) {
        console.error('Error saving template:', error);
        return { data: null, error };
    }
};

/**
 * Load a template by ID
 */
export const loadMailingTemplate = async (id) => {
    try {
        const { data, error } = await supabase
            .from('mailing_templates')
            .select('*')
            .eq('id', id)
            .single();

        if (error) throw error;
        return { data, error: null };
    } catch (error) {
        console.error('Error loading template:', error);
        return { data: null, error };
    }
};

// ============================================
// IMAGE UPLOAD
// ============================================

/**
 * Get public URL for mailing images
 */
export const getMailingImageUrl = (path) => {
    if (!path) return null;
    if (path.startsWith('http')) return path;

    const cleanPath = path.replace(/^\//, '');
    return `${SUPABASE_URL}/storage/v1/object/public/${MAILING_STORAGE_BUCKET}/${cleanPath}`;
};

/**
 * Upload an image to mailing storage
 */
export const uploadMailingImage = async (file, folder, fileName) => {
    try {
        const path = `${folder}/${fileName}`;

        const { data, error } = await supabaseAdmin.storage
            .from(MAILING_STORAGE_BUCKET)
            .upload(path, file, {
                cacheControl: '3600',
                upsert: true
            });

        if (error) throw error;

        return {
            success: true,
            url: getMailingImageUrl(data.path),
            path: data.path,
            error: null
        };
    } catch (error) {
        console.error('Error uploading mailing image:', error);
        return { success: false, url: null, path: null, error };
    }
};

// ============================================
// PRODUCT TEXT PARSER
// ============================================

/**
 * Helper to parse price string to integer
 * Handles formats like: "$1.234.567", "1234567", "$1,234,567"
 */
const parsePriceToInt = (priceStr) => {
    if (!priceStr) return null;
    // Remove currency symbols, dots, commas, spaces
    const cleaned = priceStr.toString().replace(/[$.\s,]/g, '');
    const num = parseInt(cleaned, 10);
    return isNaN(num) ? null : num;
};

/**
 * Helper to parse percentage string to integer
 * Handles formats like: "15%", "15", "-15%"
 */
const parsePercentageToInt = (percentStr) => {
    if (!percentStr) return null;
    // Remove % sign and any non-numeric chars except minus
    const cleaned = percentStr.toString().replace(/[^0-9-]/g, '');
    const num = parseInt(cleaned, 10);
    return isNaN(num) ? Math.abs(num) : Math.abs(num); // Always positive
};

/**
 * Parse pasted text to detect products and extract pricing info
 * 
 * Expected Excel format (tab-separated):
 * Col 0: SKU or index
 * Col 1: Product name (PRODUCTO)
 * Col 2: Normal price (PRECIO) -> price_before
 * Col 3: Discount $ (DESCUENTO $) -> IGNORED
 * Col 4: Discount % (DESCUENTO %) -> discount_percentage
 * Col 5: Offer price (PRECIO OFERTA) -> price_now
 * 
 * @param {string} text - Pasted text from client (can be Excel copy)
 * @returns {Promise<{found: Array, missing: Array}>}
 */
export const parseProductsFromText = async (text) => {
    // Get all products from database
    const { data: products } = await getMailingProducts();
    if (!products || products.length === 0) {
        return { found: [], missing: [] };
    }

    // Create normalized lookup maps (like MarcajesMaker)
    const productsByName = {};
    const productsByNameLower = {};
    const productsByFullName = {};      // name + subtitle combined
    const productsByFullNameLower = {}; // lowercase version
    
    products.forEach(product => {
        if (product.name) {
            // Match by name only
            productsByName[product.name] = product;
            productsByNameLower[product.name.toLowerCase()] = product;
            
            // Match by name + subtitle (how client sends it)
            if (product.subtitle) {
                const fullName = `${product.name} ${product.subtitle}`;
                productsByFullName[fullName] = product;
                productsByFullNameLower[fullName.toLowerCase()] = product;
            }
        }
    });

    // Extract product names from text
    const lines = text.split('\n').filter(line => line.trim() !== '');
    
    const found = [];
    const missing = [];
    const foundIds = new Set();

    // First, detect header row to understand column positions
    let headerIndices = {
        producto: 1,      // Default: column 1
        precio: 2,        // Default: column 2 (PRECIO -> price_before)
        descuento_pct: 4, // Default: column 4 (DESCUENTO %)
        precio_oferta: 5  // Default: column 5 (PRECIO OFERTA -> price_now)
    };

    // Check first line for header
    if (lines.length > 0 && lines[0].includes('\t')) {
        const headerParts = lines[0].split('\t').map(p => p.trim().toLowerCase());
        headerParts.forEach((header, idx) => {
            if (header === 'producto' || header === 'product') headerIndices.producto = idx;
            if (header === 'precio' && !header.includes('oferta')) headerIndices.precio = idx;
            if (header === 'descuento %' || header === 'descuento%' || header === '% descuento') headerIndices.descuento_pct = idx;
            if (header.includes('precio') && header.includes('oferta')) headerIndices.precio_oferta = idx;
        });
    }

    lines.forEach(line => {
        let itemName = line.trim();
        let priceBefore = null;
        let priceNow = null;
        let discountPct = null;

        // Handle Excel paste (tab-separated)
        if (line.includes('\t')) {
            const parts = line.split('\t');
            
            // Get product name
            if (parts.length > headerIndices.producto) {
                const candidate = parts[headerIndices.producto].trim();
                // Skip header rows
                if (candidate.toLowerCase() === 'producto' || candidate.toLowerCase() === 'product') {
                    return;
                }
                itemName = candidate;
            }

            // Get PRECIO (price_before)
            if (parts.length > headerIndices.precio) {
                priceBefore = parsePriceToInt(parts[headerIndices.precio]);
            }

            // Get DESCUENTO %
            if (parts.length > headerIndices.descuento_pct) {
                discountPct = parsePercentageToInt(parts[headerIndices.descuento_pct]);
            }

            // Get PRECIO OFERTA (price_now)
            if (parts.length > headerIndices.precio_oferta) {
                priceNow = parsePriceToInt(parts[headerIndices.precio_oferta]);
            }

            // If no precio_oferta but we have precio, use precio as price_now
            if (!priceNow && priceBefore) {
                priceNow = priceBefore;
                priceBefore = null;
            }
        }

        // Skip empty
        if (!itemName) return;

        // Try to find product in this order:
        // 1. Exact match on full name (name + subtitle)
        // 2. Lowercase match on full name
        // 3. Exact match on name only
        // 4. Lowercase match on name only
        const product = productsByFullName[itemName] 
            || productsByFullNameLower[itemName.toLowerCase()]
            || productsByName[itemName] 
            || productsByNameLower[itemName.toLowerCase()];

        if (product && !foundIds.has(product.id)) {
            // Create product with pricing from the pasted list
            const productWithPricing = {
                ...product,
                price_before: priceBefore,
                price_now: priceNow,
                discount_percentage: discountPct
            };
            found.push(productWithPricing);
            foundIds.add(product.id);
        } else if (!product) {
            // Check if already in missing list
            if (!missing.includes(itemName)) {
                missing.push(itemName);
            }
        }
    });

    return { found, missing };
};

// ============================================
// MAILING HISTORY CRUD
// ============================================

/**
 * Get all mailing history entries
 * @param {string} status - Optional filter by status: 'draft', 'sent', 'archived'
 */
export const getMailingHistory = async (status = null) => {
    try {
        let query = supabase
            .from('mailing_history')
            .select('*')
            .order('created_at', { ascending: false });

        if (status) {
            query = query.eq('status', status);
        }

        const { data, error } = await query;

        if (error) throw error;
        return { data, error: null };
    } catch (error) {
        console.error('Error fetching mailing history:', error);
        return { data: [], error };
    }
};

/**
 * Get a single mailing by ID
 */
export const getMailingById = async (id) => {
    try {
        const { data, error } = await supabase
            .from('mailing_history')
            .select('*')
            .eq('id', id)
            .single();

        if (error) throw error;
        return { data, error: null };
    } catch (error) {
        console.error('Error fetching mailing:', error);
        return { data: null, error };
    }
};

/**
 * Save a mailing to history
 * @param {Object} mailing - Mailing data to save
 */
export const saveMailingToHistory = async (mailing) => {
    try {
        // Helper to validate UUID format
        const isValidUUID = (str) => {
            if (!str) return false;
            const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
            return uuidRegex.test(str);
        };

        const record = {
            name: mailing.name,
            header_asset_id: isValidUUID(mailing.headerAsset?.id) ? mailing.headerAsset.id : null,
            banner_asset_id: isValidUUID(mailing.bannerAsset?.id) ? mailing.bannerAsset.id : null,
            offer_banner_asset_id: isValidUUID(mailing.offerBannerAsset?.id) ? mailing.offerBannerAsset.id : null,
            product_background_asset_id: isValidUUID(mailing.productBackgroundAsset?.id) ? mailing.productBackgroundAsset.id : null,
            header_image_url: mailing.headerAsset?.image_url || null,
            banner_image_url: mailing.bannerAsset?.image_url || null,
            offer_banner_image_url: mailing.offerBannerAsset?.image_url || null,
            product_background_image_url: mailing.productBackgroundAsset?.image_url || null,
            products_snapshot: mailing.products || [],
            text_content: mailing.textContent || '',
            disclaimer_text: mailing.disclaimerText || '',
            social_networks: mailing.socialNetworks || { facebook: true, instagram: true, youtube: true, twitter: true },
            generated_html: mailing.generatedHtml || '',
            status: mailing.status || 'draft'
        };

        const { data, error } = await supabase
            .from('mailing_history')
            .insert([record])
            .select()
            .single();

        if (error) throw error;
        return { data, error: null };
    } catch (error) {
        console.error('Error saving mailing to history:', error);
        return { data: null, error };
    }
};

/**
 * Update an existing mailing in history
 */
export const updateMailingInHistory = async (id, updates) => {
    try {
        // Helper to validate UUID format
        const isValidUUID = (str) => {
            if (!str) return false;
            const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
            return uuidRegex.test(str);
        };

        const record = {
            name: updates.name,
            header_asset_id: isValidUUID(updates.headerAsset?.id) ? updates.headerAsset.id : null,
            banner_asset_id: isValidUUID(updates.bannerAsset?.id) ? updates.bannerAsset.id : null,
            offer_banner_asset_id: isValidUUID(updates.offerBannerAsset?.id) ? updates.offerBannerAsset.id : null,
            product_background_asset_id: isValidUUID(updates.productBackgroundAsset?.id) ? updates.productBackgroundAsset.id : null,
            header_image_url: updates.headerAsset?.image_url || null,
            banner_image_url: updates.bannerAsset?.image_url || null,
            offer_banner_image_url: updates.offerBannerAsset?.image_url || null,
            product_background_image_url: updates.productBackgroundAsset?.image_url || null,
            products_snapshot: updates.products || [],
            text_content: updates.textContent || '',
            disclaimer_text: updates.disclaimerText || '',
            social_networks: updates.socialNetworks || { facebook: true, instagram: true, youtube: true, twitter: true },
            generated_html: updates.generatedHtml || '',
            status: updates.status || 'draft'
        };

        console.log('Updating mailing history ID:', id);

        const { data, error } = await supabase
            .from('mailing_history')
            .update(record)
            .eq('id', id)
            .select()
            .single();

        if (error) {
            console.error('Supabase mailing update error:', error.message, error.code, error.details);
            throw error;
        }
        return { data, error: null };
    } catch (error) {
        console.error('Error updating mailing:', error);
        return { data: null, error };
    }
};

/**
 * Delete a mailing from history
 */
export const deleteMailingFromHistory = async (id) => {
    try {
        const { error } = await supabase
            .from('mailing_history')
            .delete()
            .eq('id', id);

        if (error) throw error;
        return { success: true, error: null };
    } catch (error) {
        console.error('Error deleting mailing:', error);
        return { success: false, error };
    }
};

/**
 * Update mailing status
 */
export const updateMailingStatus = async (id, status) => {
    try {
        const { data, error } = await supabase
            .from('mailing_history')
            .update({ status })
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        return { data, error: null };
    } catch (error) {
        console.error('Error updating mailing status:', error);
        return { data: null, error };
    }
};

export default {
    // Products
    getMailingProducts,
    getMailingProduct,
    createMailingProduct,
    updateMailingProduct,
    deleteMailingProduct,

    // Assets
    getMailingAssets,
    createMailingAsset,
    deleteMailingAsset,

    // Templates
    getMailingTemplates,
    saveMailingTemplate,
    loadMailingTemplate,

    // History
    getMailingHistory,
    getMailingById,
    saveMailingToHistory,
    updateMailingInHistory,
    deleteMailingFromHistory,
    updateMailingStatus,

    // Utils
    getMailingImageUrl,
    uploadMailingImage,
    parseProductsFromText
};
