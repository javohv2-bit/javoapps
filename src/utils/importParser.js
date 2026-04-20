/**
 * Parser for InPage Excel files
 * Reads an existing InPage Excel and converts it to blocks data for the app
 */
import ExcelJS from 'exceljs';
import { modules, getRowForBloque } from '../config/falabellaRules';

/**
 * Parse an InPage Excel file and extract the blocks data
 * @param {ArrayBuffer} excelBuffer - The Excel file buffer
 * @returns {Promise<{blocks: Array, sku: string}>} The parsed blocks and SKU
 */
export const parseInPageExcel = async (excelBuffer) => {
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.load(excelBuffer);

    const sheet = workbook.getWorksheet('Formulario');
    if (!sheet) throw new Error("Hoja 'Formulario' no encontrada");

    const blocks = [];

    // Iterate through rows 4-13 (bloques 1-10)
    for (let blockNum = 1; blockNum <= 10; blockNum++) {
        const rowNumber = getRowForBloque(blockNum);
        const row = sheet.getRow(rowNumber);

        // Get module name from column B
        const moduleName = row.getCell('B').value;
        if (!moduleName || moduleName === '') continue;

        // Find the matching module definition
        const moduleDef = modules.find(m => m.excelName === moduleName);
        if (!moduleDef) {
            console.warn(`Unknown module: ${moduleName}`);
            continue;
        }

        // Extract data based on the module's field mappings
        const data = {};

        // Reverse the excelMapping to get column -> field
        Object.entries(moduleDef.excelMapping).forEach(([field, colLetter]) => {
            const cellValue = row.getCell(colLetter).value;
            if (cellValue !== null && cellValue !== undefined && cellValue !== '') {
                // Check if this is an image field - store the name, we'll map to actual paths later
                if (['image', 'leftImage', 'rightImage'].includes(field)) {
                    data[field] = cellValue; // This will be like "17451720-img_1"
                } else {
                    data[field] = cellValue;
                }
            }
        });

        blocks.push({
            id: Date.now().toString() + blockNum,
            moduleId: moduleDef.id,
            data
        });
    }

    // Try to extract SKU from image names or filename
    let sku = '';
    for (const block of blocks) {
        if (block.data.image && typeof block.data.image === 'string') {
            const match = block.data.image.match(/^(\d+)-img_/);
            if (match) {
                sku = match[1];
                break;
            }
        }
    }

    return { blocks, sku };
};

/**
 * Import an InPage from a folder containing Excel and Images
 * @param {FileList} files - Files from folder upload
 * @returns {Promise<{blocks: Array, sku: string, imageMap: Object}>}
 */
export const importInPageFromFolder = async (files) => {
    const fileArray = Array.from(files);

    // Find the Excel file
    const excelFile = fileArray.find(f =>
        f.name.endsWith('.xlsx') && !f.name.startsWith('~$')
    );

    if (!excelFile) {
        throw new Error('No se encontró archivo Excel en la carpeta');
    }

    // Read Excel
    const excelBuffer = await excelFile.arrayBuffer();
    const { blocks, sku } = await parseInPageExcel(excelBuffer);

    // Build image map from uploaded images
    const imageMap = {};
    const imageFiles = fileArray.filter(f =>
        /\.(jpg|jpeg|png|webp|gif)$/i.test(f.name)
    );

    imageFiles.forEach(file => {
        // Map the image name (without extension) to blob URL
        const nameWithoutExt = file.name.replace(/\.[^.]+$/, '');
        imageMap[nameWithoutExt] = URL.createObjectURL(file);
    });

    // Update blocks to use blob URLs for images
    blocks.forEach(block => {
        ['image', 'leftImage', 'rightImage'].forEach(field => {
            if (block.data[field] && imageMap[block.data[field]]) {
                const imageName = block.data[field];
                block.data[`${field}Url`] = imageMap[imageName];
                // Keep original name for Excel reference
            }
        });
    });

    return { blocks, sku, imageMap };
};
