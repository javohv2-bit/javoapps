/**
 * Browser-based Excel parser for InPage files
 * This reads Excel files and extracts the block data
 */
import ExcelJS from 'exceljs';

// Module mapping from falabellaRules
const moduleNameMap = {
    // Module 1 variations
    'Módulo 1: BANNER Full Ancho': 1,
    'Módulo 1: Banner principal sin texto': 1,
    'Banner principal sin texto (Modulo 1)': 1,

    // Module 2 variations
    'Módulo 2: Texto 2 Columnas': 2,
    'Módulo 2: Texto en dos columnas': 2,
    'Texto en dos columnas (Modulo 2)': 2,

    // Module 3 variations
    'Módulo 3: Imagen/Texto': 3,
    'Módulo 3: Imagen + Texto': 3,
    'Imagen y texto (Modulo 3)': 3,

    // Module 4 variations
    'Módulo 4: Texto/Imagen': 4,
    'Módulo 4: Texto + Imagen': 4,
    'Texto e Imagen (Modulo 4)': 4,

    // Module 5 variations
    'Módulo 5: Lista': 5,
    'Módulo 5: Listado de características': 5,
    'Listado de características (Modulo 5)': 5,
    'Lista en dos columnas (Modulo 5)': 5, // V8

    // Module 6 variations
    'Módulo 6: Imagen Texto Centrado': 6,
    'Módulo 6: Imagen + Texto centrado': 6,
    'Banner grande y texto (Modulo 6)': 6,

    // Module 7 variations
    'Módulo 7: 2 columnas imagen y texto': 7,
    'Módulo 7: Dos columnas imagen + texto': 7,
    'Dos columnas imagen + texto (Modulo 7)': 7,
    'Dos imágenes con texto abajo (Modulo 7)': 7, // V8

    // Module 8 variations
    'Módulo 8: Video & Texto': 8,
    'Módulo 8: Video + Texto': 8,
    'Video + Texto (Modulo 8)': 8,
    'Video y texto (Modulo 8)': 8, // V8

    // Module 9 variations
    'Módulo 9: BANNER CTA': 9,
    'Módulo 9: Banner con CTA': 9,
    'Banner con CTA (Modulo 9)': 9,
    'Banner clicleable (Modulo 9)': 9, // V8
};

const excelMapping = {
    1: { image: 'D', altImage: 'F' },
    2: { title: 'D', col1Text: 'F', col2Text: 'H' },
    3: { image: 'D', altImage: 'F', title: 'H', description: 'J' },
    4: { title: 'D', description: 'F', image: 'H', altImage: 'J' },
    5: { title: 'D', item1: 'F', item2: 'H', item3: 'J', item4: 'L', item5: 'N', item6: 'P', item7: 'R', item8: 'T' },
    6: { image: 'D', altImage: 'F', title: 'H', description: 'J' },
    7: { leftImage: 'D', leftAlt: 'F', leftTitle: 'H', leftText: 'J', rightImage: 'L', rightAlt: 'N', rightTitle: 'P', rightText: 'R' },
    8: { youtubeCode: 'D', title: 'F', description: 'H' },
    9: { image: 'D', altImage: 'F', url: 'H' },
};

/**
 * Parse an Excel buffer and extract block data
 * @param {ArrayBuffer} buffer - The Excel file as ArrayBuffer
 * @returns {Promise<{blocks: Array, sku: string}>}
 */
export const parseExcelBuffer = async (buffer) => {
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.load(buffer);

    const sheet = workbook.getWorksheet('Formulario');
    if (!sheet) {
        throw new Error("Hoja 'Formulario' no encontrada");
    }

    const blocks = [];
    let sku = '';

    // Rows 4-13 for bloques 1-10
    for (let blockNum = 1; blockNum <= 10; blockNum++) {
        const rowNumber = blockNum + 3;
        const row = sheet.getRow(rowNumber);

        // Get module name from column B
        const moduleCell = row.getCell('B').value;
        if (!moduleCell || moduleCell === '') continue;

        // Find module ID from name
        const moduleId = moduleNameMap[moduleCell];
        if (!moduleId) {
            console.warn(`Unknown module: ${moduleCell}`);
            continue;
        }

        // Extract data from columns
        const mapping = excelMapping[moduleId];
        const data = {};

        Object.entries(mapping).forEach(([field, col]) => {
            const value = row.getCell(col).value;
            if (value !== null && value !== undefined && value !== '') {
                data[field] = value;

                // Extract SKU from image name if present
                if (!sku && (field === 'image' || field === 'leftImage') && typeof value === 'string') {
                    const match = value.match(/^(\d{5,})-img/);
                    if (match) sku = match[1];
                }
            }
        });

        blocks.push({
            id: `block-${blockNum}`,
            moduleId,
            data
        });
    }

    return { blocks, sku };
};

/**
 * Fetch and parse an Excel file from a URL
 * @param {string} url - URL to the Excel file
 * @returns {Promise<{blocks: Array, sku: string}>}
 */
export const fetchAndParseExcel = async (url) => {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Failed to fetch: ${response.status}`);
    const buffer = await response.arrayBuffer();
    return parseExcelBuffer(buffer);
};

export default parseExcelBuffer;
