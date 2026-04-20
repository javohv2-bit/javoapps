import ExcelJS from 'exceljs';
import { modules, getRowForBloque } from '../config/falabellaRules';

/**
 * Generates the Excel file by filling the Formulario sheet.
 * 
 * IMPORTANT EXCEL STRUCTURE:
 * - Sheet "Formulario": 
 *   - Row 1: Headers
 *   - Rows 4-13: Bloques 1-10
 *   - Column B: Module dropdown selector
 *   - Columns D, F, H, J, L, N, P, R, T: User inputs
 *   - Column U: Auto-generated HTML (formula)
 * - Sheet "Código (No llenar)": 
 *   - Cell B1: Final concatenated HTML code
 * 
 * @param {string} sku - The SKU Padre
 * @param {Array} blocks - Array of block objects with moduleId and data
 * @returns {Promise<ArrayBuffer>} The Excel file buffer
 */
export const generateExcel = async (sku, blocks) => {
    // Load the template
    const response = await fetch('/assets/InPage Builder_v8.xlsx');
    const arrayBuffer = await response.arrayBuffer();
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.load(arrayBuffer);

    const sheet = workbook.getWorksheet('Formulario');
    if (!sheet) throw new Error("Hoja 'Formulario' no encontrada en el template.");

    // IMPORTANT: Set SKU in cell B1 as required by Falabella
    sheet.getCell('B1').value = sku;
    console.log(`[ExcelGenerator] SKU "${sku}" set in cell B1`);

    // Track global image index for naming (sequential across all blocks)
    let globalImageIndex = 1;

    console.log(`[ExcelGenerator] Generating for SKU: ${sku}, ${blocks.length} blocks`);

    // Iterate blocks and fill data
    blocks.forEach((block, blockIndex) => {
        if (blockIndex >= 10) {
            console.warn(`Máximo 10 bloques permitidos. Bloque ${blockIndex + 1} ignorado.`);
            return;
        }

        const rowNumber = getRowForBloque(blockIndex + 1); // Bloque 1 = Row 4
        const row = sheet.getRow(rowNumber);
        const moduleDef = modules.find(m => m.id === block.moduleId);

        if (!moduleDef) {
            console.warn(`Módulo ID ${block.moduleId} no encontrado`);
            return;
        }

        console.log(`[ExcelGenerator] Block ${blockIndex + 1}: Module ${moduleDef.id} (${moduleDef.excelName})`);
        console.log(`[ExcelGenerator] Block data:`, JSON.stringify(block.data, null, 2));

        // Set Module Name in Column B using the exact Excel dropdown value
        row.getCell('B').value = moduleDef.excelName;

        // Map fields to columns based on excelMapping
        const mappingKeys = Object.keys(moduleDef.excelMapping);
        console.log(`[ExcelGenerator] Mapping keys:`, mappingKeys);

        mappingKeys.forEach(field => {
            const colLetter = moduleDef.excelMapping[field];
            const value = block.data[field];

            console.log(`[ExcelGenerator] Field "${field}" -> Col ${colLetter}, value type: ${typeof value}, value: ${value ? String(value).substring(0, 50) : 'null/undefined'}`);

            // Check if this is an image field
            const isImageField = ['image', 'leftImage', 'rightImage'].includes(field);

            if (isImageField) {
                // Check if there's an image (File object or path string)
                if (value !== undefined && value !== null && value !== '') {
                    // Image field: use the naming convention (SKU-img_N) without extension
                    const imageName = `${sku}-img_${globalImageIndex}`;
                    row.getCell(colLetter).value = imageName;
                    console.log(`[ExcelGenerator] ✓ Set image name: ${imageName} in column ${colLetter}`);
                    globalImageIndex++;
                } else {
                    console.log(`[ExcelGenerator] ✗ Image field "${field}" is empty or undefined`);
                }
            } else {
                // Regular text field - only set if value exists
                if (value !== undefined && value !== null && value !== '') {
                    row.getCell(colLetter).value = value;
                    console.log(`[ExcelGenerator] ✓ Set text in column ${colLetter}`);
                }
            }
        });

        row.commit();
    });

    const buffer = await workbook.xlsx.writeBuffer();
    console.log(`[ExcelGenerator] Excel generated successfully`);
    return buffer;
};
