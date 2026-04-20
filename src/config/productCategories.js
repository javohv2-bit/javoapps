/**
 * Sistema de Categorías y Subcategorías para Productos
 * Organiza los productos en el Dashboard
 */

// Definición de categorías principales y subcategorías
export const CATEGORIES = {
    printers: {
        name: 'Impresoras',
        icon: 'Printer',
        color: 'orange',
        bgGradient: 'from-orange-50 to-amber-50',
        textColor: 'text-orange-500',
        subcategories: [
            { id: 'all', name: 'Todas', icon: 'LayoutGrid' },
            { id: 'ink-kits', name: 'Tintas / Kit', icon: 'Droplets' },
            { id: 'maxify', name: 'Maxify', icon: 'Building2' },
            { id: 'pixma', name: 'Pixma', icon: 'Home' },
        ]
    },
    cameras: {
        name: 'Cámaras',
        icon: 'Camera',
        color: 'violet',
        bgGradient: 'from-violet-50 to-purple-50',
        textColor: 'text-violet-500',
        subcategories: [
            { id: 'all', name: 'Todas', icon: 'LayoutGrid' },
            { id: 'eos', name: 'EOS', icon: 'Aperture' },
            { id: 'powershot', name: 'PowerShot', icon: 'Zap' },
        ]
    }
};

// Mapeo de productos a subcategorías
export const PRODUCT_SUBCATEGORIES = {
    // Tintas / Kit
    'kit-gi10': 'ink-kits',
    'kit-gi11': 'ink-kits',
    'kit-gi190': 'ink-kits',
    
    // Maxify (GX series son Maxify)
    'gx3010': 'maxify',
    'gx4010': 'maxify',
    'gx6010': 'maxify',
    'gx7010': 'maxify',
    
    // Pixma (G series son Pixma)
    'g3110': 'pixma',
    'g3170': 'pixma',
    'g3180': 'pixma',
    'g3190': 'pixma',
    'g4110': 'pixma',
    'g4170': 'pixma',
    'g6010': 'pixma',
    'g7010': 'pixma',
    'pixma-g4180': 'pixma',
    
    // EOS
    'eos-r8': 'eos',
    'eos-r10': 'eos',
    'eos-r50': 'eos',
    'eos-r100': 'eos',
    'eos-r50v': 'eos',
    'r8-24-50': 'eos',
    'r10-18-45': 'eos',
    'r50-18-45': 'eos',
    'r50-zoomkit': 'eos',
    'r100-18-45': 'eos',
    'r100-zoomkit': 'eos',
    
    // PowerShot
    'powershot-v1': 'powershot',
    'g7x-iii': 'powershot',
    'sx740-black': 'powershot',
    'sx740-silver': 'powershot',
};

// Obtener la subcategoría de un producto (con detección automática para Hites)
export const getProductSubcategory = (productId) => {
    // Primero verificar mapeo estático
    if (PRODUCT_SUBCATEGORIES[productId]) {
        return PRODUCT_SUBCATEGORIES[productId];
    }
    
    // Detección automática basada en el nombre/ID
    const idLower = productId.toLowerCase();
    
    // Tintas
    if (idLower.includes('tinta-') || idLower.includes('gi-1')) {
        return 'ink-kits';
    }
    
    // Maxify (GX series)
    if (idLower.includes('gx') && !idLower.includes('g7x')) {
        return 'maxify';
    }
    
    // Pixma (G series, G2xxx, G3xxx, G4xxx)
    if (idLower.match(/g[234]\d{2,3}/) || idLower.includes('pixma')) {
        return 'pixma';
    }
    
    // EOS
    if (idLower.includes('eos-') || idLower.match(/r\d{1,3}-/)) {
        return 'eos';
    }
    
    // PowerShot
    if (idLower.includes('powershot') || idLower.includes('sx7') || idLower.includes('g7x')) {
        return 'powershot';
    }
    
    return 'all';
};

// Filtrar productos por subcategoría
export const filterBySubcategory = (products, subcategoryId) => {
    if (subcategoryId === 'all') return products;
    return products.filter(p => getProductSubcategory(p.id) === subcategoryId);
};

export default {
    CATEGORIES,
    PRODUCT_SUBCATEGORIES,
    getProductSubcategory,
    filterBySubcategory,
};
