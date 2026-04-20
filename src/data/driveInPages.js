/**
 * Dynamic InPage catalog that loads and parses Excel files on demand
 */
import { parseExcelBuffer } from '../utils/excelParser';
import { powershotV1, kitGI10, kitGI11, kitGI190, eosR50V, powershotG7XMarkIII, eosR10, eosR50, eosRP } from './canonInPages';

// Static catalog with file references - blocks will be loaded dynamically
export const driveInPages = [
    // ============ TEMPLATES (OFFLINE) ============
    {
        id: 'powershot-v1',
        category: 'Photo',
        name: 'PowerShot V1 Black',
        sku: '17468486',
        staticData: powershotV1,
        // Static data has absolute image paths, so no baseImagePath needed
        imagePath: null
    },
    {
        id: 'eos-r50v',
        category: 'Photo',
        name: 'EOS R50 V',
        sku: '17586611',
        staticData: eosR50V,
        imagePath: '/drive-data/images/eos-r50v'
    },
    {
        id: 'kit-gi10',
        category: 'Printers',
        name: 'Kit Tintas GI-10',
        sku: '17514857',
        staticData: kitGI10,
        imagePath: null
    },
    {
        id: 'kit-gi11',
        category: 'Printers',
        name: 'Kit Tintas GI-11',
        sku: '17514856',
        staticData: kitGI11,
        imagePath: null
    },
    {
        id: 'kit-gi190',
        category: 'Printers',
        name: 'Kit Tintas GI-190',
        sku: '17514855',
        staticData: kitGI190,
        imagePath: null
    },

    // ============ PRINTERS ============
    { id: 'g3110', category: 'Printers', name: 'PIXMA G3110', excelPath: '/drive-data/printers/G3110 - InPage builder 2025 5.xlsx', imagePath: '/drive-data/images/g3110' },
    { id: 'g3170', category: 'Printers', name: 'PIXMA G3170', excelPath: '/drive-data/printers/G3170 - InPage builder 2025.xlsx', imagePath: '/drive-data/images/g3170' },
    { id: 'g3180', category: 'Printers', name: 'PIXMA G3180', sku: '17451720', excelPath: '/drive-data/printers/G3180 InPage Builder - 17451720.xlsx', imagePath: '/drive-data/images/g3180' },
    { id: 'g4110', category: 'Printers', name: 'PIXMA G4110', excelPath: '/drive-data/printers/G4110 - InPage Builder v7.xlsx', imagePath: '/drive-data/images/g4110' },
    { id: 'g4170', category: 'Printers', name: 'PIXMA G4170', excelPath: '/drive-data/printers/G4170 InPage builder 2025 5.xlsx', imagePath: '/drive-data/images/g4170' },
    { id: 'g6010', category: 'Printers', name: 'PIXMA G6010', excelPath: '/drive-data/printers/G6010 - InPage Builder v7.xlsx', imagePath: '/drive-data/images/g6010' },
    { id: 'gx3010', category: 'Printers', name: 'MAXIFY GX3010', excelPath: '/drive-data/printers/GX3010 - InPage Builder v7.xlsx', imagePath: '/drive-data/images/gx3010' },
    { id: 'gx4010', category: 'Printers', name: 'MAXIFY GX4010', excelPath: '/drive-data/printers/GX4010 - InPage Builder v7.xlsx', imagePath: '/drive-data/images/gx4010' },
    { id: 'gx6010', category: 'Printers', name: 'MAXIFY GX6010', excelPath: '/drive-data/printers/GX6010 - InPage Builder v7 (2).xlsx', imagePath: '/drive-data/images/gx6010' },
    { id: 'gx7010', category: 'Printers', name: 'MAXIFY GX7010', excelPath: '/drive-data/printers/GX7010 - InPage Builder v7.xlsx', imagePath: '/drive-data/images/gx7010' },

    // ============ CAMERAS ============
    { id: 'r10-18-45', category: 'Photo', name: 'EOS R10 RF-S 18-45mm', sku: '16765189', staticData: eosR10, imagePath: null },
    { id: 'r50-18-45', category: 'Photo', name: 'EOS R50 18-45 IS STM', sku: '16765190', staticData: eosR50, imagePath: null },
    { id: 'r100-18-45', category: 'Photo', name: 'EOS R100 18-45 IS STM', sku: '16877531', excelPath: '/drive-data/photo/16877531-EOS R100 18-45 IS STM.xlsx', imagePath: '/drive-data/images/r100-18-45' },
    { id: 'r8-24-50', category: 'Photo', name: 'EOS R8 24-50 STM', sku: '16877536', excelPath: '/drive-data/photo/16877536-EOS R8 24-50 STM.xlsx', imagePath: '/drive-data/images/r8-24-50' },
    { id: 'g7x-iii', category: 'Photo', name: 'PowerShot G7X Mark III', sku: '17507574', staticData: powershotG7XMarkIII, imagePath: null },
    { id: 'eos-rp', category: 'Photo', name: 'EOS RP RF 24-105mm S', sku: '16487747', staticData: eosRP, imagePath: null },
    { id: 'r50-zoomkit', category: 'Photo', name: 'EOS R50 ZoomKit', sku: '80652170', excelPath: '/drive-data/photo/80652170-EOS_R50_ZoomKit_v8.xlsx', imagePath: '/drive-data/images/r50-zoomkit' },
    { id: 'r100-zoomkit', category: 'Photo', name: 'EOS R100 ZoomKit', sku: '80652171', excelPath: '/drive-data/photo/80652171-EOS R100 18-45 + RF 75-300 IS STM_v8.xlsx', imagePath: '/drive-data/images/r100-zoomkit' },
    { id: 'sx740-black', category: 'Photo', name: 'PowerShot SX740 HS Black', sku: '80664032', excelPath: '/drive-data/photo/80664032-Powershot_SX740_Black_v8.xlsx', imagePath: '/drive-data/images/sx740-black' },
    { id: 'sx740-silver', category: 'Photo', name: 'PowerShot SX740 HS Silver', sku: '80664033', excelPath: '/drive-data/photo/80664033-Powershot_SX740_Silver_v8.xlsx', imagePath: '/drive-data/images/sx740-silver' },
];

// Cache for loaded Excel data
const loadedData = new Map();

/**
 * Load an InPage from its Excel file
 * @param {Object} item - Item from driveInPages
 * @returns {Promise<{blocks: Array, sku: string}>}
 */
export const loadInPage = async (item) => {
    // Check cache first
    if (loadedData.has(item.id)) {
        return loadedData.get(item.id);
    }

    // Handle Static Data (Templates)
    if (item.staticData) {
        const result = {
            ...item,
            blocks: item.staticData.blocks,
            sku: item.sku || item.staticData.sku || 'N/A',
            loaded: true
        };
        loadedData.set(item.id, result);
        return result;
    }

    try {
        const response = await fetch(item.excelPath);
        if (!response.ok) throw new Error(`Failed to load: ${response.status}`);

        const buffer = await response.arrayBuffer();
        const { blocks, sku } = await parseExcelBuffer(buffer);

        const result = {
            ...item,
            blocks,
            sku: sku || item.sku || 'N/A',
            loaded: true
        };

        loadedData.set(item.id, result);
        return result;
    } catch (error) {
        console.error(`Error loading ${item.name}:`, error);
        return {
            ...item,
            blocks: [],
            sku: item.sku || 'Error',
            loaded: false,
            error: error.message
        };
    }
};

/**
 * Get block count for an item (loads if needed)
 */
export const getBlockCount = async (item) => {
    if (loadedData.has(item.id)) {
        return loadedData.get(item.id).blocks.length;
    }
    const loaded = await loadInPage(item);
    return loaded.blocks.length;
};

// Group by category for display
export const driveCategories = [
    {
        name: 'Impresoras',
        icon: '🖨️',
        items: driveInPages.filter(p => p.category === 'Printers')
    },
    {
        name: 'Cámaras',
        icon: '📷',
        items: driveInPages.filter(p => p.category === 'Photo')
    }
];

export default driveInPages;
