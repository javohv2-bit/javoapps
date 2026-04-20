/**
 * Simple Express server to save InPage changes back to disk
 * Run with: node server/saveServer.js
 */

import express from 'express';
import cors from 'cors';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import ExcelJS from 'exceljs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');

const app = express();
app.use(cors());
app.use(express.json({ limit: '50mb' }));

/**
 * Save an image to the public folder
 */
app.post('/api/save-image', async (req, res) => {
    try {
        const { imagePath, imageData } = req.body;
        
        if (!imagePath || !imageData) {
            return res.status(400).json({ error: 'Missing imagePath or imageData' });
        }

        // Decode base64 image
        const base64Data = imageData.replace(/^data:image\/\w+;base64,/, '');
        const buffer = Buffer.from(base64Data, 'base64');

        // Construct full path (always under public folder)
        const fullPath = path.join(ROOT_DIR, 'public', imagePath);
        
        // Ensure directory exists
        await fs.mkdir(path.dirname(fullPath), { recursive: true });
        
        // Write file
        await fs.writeFile(fullPath, buffer);
        
        console.log(`✓ Saved image: ${imagePath}`);
        res.json({ success: true, path: imagePath });
    } catch (error) {
        console.error('Error saving image:', error);
        res.status(500).json({ error: error.message });
    }
});

/**
 * Update Excel file with new data
 */
app.post('/api/update-excel', async (req, res) => {
    try {
        const { excelPath, blocks, sku } = req.body;
        
        if (!excelPath || !blocks) {
            return res.status(400).json({ error: 'Missing excelPath or blocks' });
        }

        const fullPath = path.join(ROOT_DIR, 'public', excelPath);
        
        // Load existing Excel
        const workbook = new ExcelJS.Workbook();
        await workbook.xlsx.readFile(fullPath);
        
        const worksheet = workbook.getWorksheet(1);
        if (!worksheet) {
            return res.status(400).json({ error: 'No worksheet found' });
        }

        // Update cells based on blocks
        // The Excel structure follows: B column = module type, columns C onwards = data
        let currentRow = 3; // Start after header rows
        
        for (const block of blocks) {
            const moduleId = block.moduleId;
            
            // Write module type
            worksheet.getCell(`B${currentRow}`).value = `modulo${moduleId}`;
            
            // Write data based on module type
            const data = block.data;
            
            switch (moduleId) {
                case 1: // Banner Image
                case 9:
                    worksheet.getCell(`C${currentRow}`).value = data.image || '';
                    worksheet.getCell(`D${currentRow}`).value = data.altImage || '';
                    worksheet.getCell(`E${currentRow}`).value = data.url || '';
                    break;
                case 2: // Title + Description
                    worksheet.getCell(`C${currentRow}`).value = data.title || '';
                    worksheet.getCell(`D${currentRow}`).value = data.description || '';
                    break;
                case 3: // Image Left + Text Right
                    worksheet.getCell(`C${currentRow}`).value = data.leftImage || '';
                    worksheet.getCell(`D${currentRow}`).value = data.leftAlt || '';
                    worksheet.getCell(`E${currentRow}`).value = data.rightTitle || '';
                    worksheet.getCell(`F${currentRow}`).value = data.rightText || '';
                    break;
                case 4: // Text Left + Image Right
                    worksheet.getCell(`C${currentRow}`).value = data.leftTitle || '';
                    worksheet.getCell(`D${currentRow}`).value = data.leftText || '';
                    worksheet.getCell(`E${currentRow}`).value = data.rightImage || '';
                    worksheet.getCell(`F${currentRow}`).value = data.rightAlt || '';
                    break;
                case 5: // YouTube Video
                    worksheet.getCell(`C${currentRow}`).value = data.youtubeCode || '';
                    break;
                case 6: // Two Columns Text
                    worksheet.getCell(`C${currentRow}`).value = data.col1Text || '';
                    worksheet.getCell(`D${currentRow}`).value = data.col2Text || '';
                    break;
                case 7: // Two Column Images
                    worksheet.getCell(`C${currentRow}`).value = data.leftImage || '';
                    worksheet.getCell(`D${currentRow}`).value = data.leftAlt || '';
                    worksheet.getCell(`E${currentRow}`).value = data.rightImage || '';
                    worksheet.getCell(`F${currentRow}`).value = data.rightAlt || '';
                    break;
                case 8: // List
                    for (let i = 1; i <= 8; i++) {
                        worksheet.getCell(`${String.fromCharCode(66 + i)}${currentRow}`).value = data[`item${i}`] || '';
                    }
                    break;
            }
            
            currentRow++;
        }

        // Update SKU in B1
        if (sku) {
            worksheet.getCell('B1').value = sku;
        }

        // Save Excel
        await workbook.xlsx.writeFile(fullPath);
        
        console.log(`✓ Updated Excel: ${excelPath}`);
        res.json({ success: true, path: excelPath });
    } catch (error) {
        console.error('Error updating Excel:', error);
        res.status(500).json({ error: error.message });
    }
});

/**
 * Save complete InPage (images + Excel)
 */
app.post('/api/save-inpage', async (req, res) => {
    try {
        const { productId, sku, blocks, imagePath, excelPath, images } = req.body;
        
        const results = {
            images: [],
            excel: null,
            errors: []
        };

        // Save all images
        if (images && images.length > 0) {
            for (const img of images) {
                try {
                    const base64Data = img.data.replace(/^data:image\/\w+;base64,/, '');
                    const buffer = Buffer.from(base64Data, 'base64');
                    const fullPath = path.join(ROOT_DIR, 'public', img.path);
                    
                    await fs.mkdir(path.dirname(fullPath), { recursive: true });
                    await fs.writeFile(fullPath, buffer);
                    
                    results.images.push(img.path);
                    console.log(`  ✓ Image: ${img.path}`);
                } catch (err) {
                    results.errors.push(`Image ${img.path}: ${err.message}`);
                }
            }
        }

        // Update Excel if path provided
        if (excelPath) {
            try {
                const fullExcelPath = path.join(ROOT_DIR, 'public', excelPath);
                
                // Check if file exists
                await fs.access(fullExcelPath);
                
                const workbook = new ExcelJS.Workbook();
                await workbook.xlsx.readFile(fullExcelPath);
                
                const worksheet = workbook.getWorksheet(1);
                if (worksheet) {
                    // Update SKU
                    if (sku) {
                        worksheet.getCell('B1').value = sku;
                    }
                    
                    // Update blocks starting at row 3
                    let row = 3;
                    for (const block of blocks) {
                        const m = block.moduleId;
                        const d = block.data;
                        
                        worksheet.getCell(`B${row}`).value = `modulo${m}`;
                        
                        // Clear existing data in row (C to K)
                        for (let col = 3; col <= 11; col++) {
                            worksheet.getCell(row, col).value = '';
                        }
                        
                        // Write new data based on module
                        if (m === 1 || m === 9) {
                            worksheet.getCell(`C${row}`).value = typeof d.image === 'string' ? d.image : '';
                            worksheet.getCell(`D${row}`).value = d.altImage || '';
                            worksheet.getCell(`E${row}`).value = d.url || '';
                        } else if (m === 2) {
                            worksheet.getCell(`C${row}`).value = d.title || '';
                            worksheet.getCell(`D${row}`).value = d.description || '';
                        } else if (m === 3) {
                            worksheet.getCell(`C${row}`).value = typeof d.leftImage === 'string' ? d.leftImage : '';
                            worksheet.getCell(`D${row}`).value = d.leftAlt || '';
                            worksheet.getCell(`E${row}`).value = d.rightTitle || '';
                            worksheet.getCell(`F${row}`).value = d.rightText || '';
                        } else if (m === 4) {
                            worksheet.getCell(`C${row}`).value = d.leftTitle || '';
                            worksheet.getCell(`D${row}`).value = d.leftText || '';
                            worksheet.getCell(`E${row}`).value = typeof d.rightImage === 'string' ? d.rightImage : '';
                            worksheet.getCell(`F${row}`).value = d.rightAlt || '';
                        } else if (m === 5) {
                            worksheet.getCell(`C${row}`).value = d.youtubeCode || '';
                        } else if (m === 6) {
                            worksheet.getCell(`C${row}`).value = d.col1Text || '';
                            worksheet.getCell(`D${row}`).value = d.col2Text || '';
                        } else if (m === 7) {
                            worksheet.getCell(`C${row}`).value = typeof d.leftImage === 'string' ? d.leftImage : '';
                            worksheet.getCell(`D${row}`).value = d.leftAlt || '';
                            worksheet.getCell(`E${row}`).value = typeof d.rightImage === 'string' ? d.rightImage : '';
                            worksheet.getCell(`F${row}`).value = d.rightAlt || '';
                        } else if (m === 8) {
                            for (let i = 1; i <= 8; i++) {
                                worksheet.getCell(row, 2 + i).value = d[`item${i}`] || '';
                            }
                        }
                        
                        row++;
                    }
                    
                    await workbook.xlsx.writeFile(fullExcelPath);
                    results.excel = excelPath;
                    console.log(`  ✓ Excel: ${excelPath}`);
                }
            } catch (err) {
                results.errors.push(`Excel: ${err.message}`);
            }
        }

        console.log(`✓ Saved InPage: ${productId || sku}`);
        res.json({ success: true, results });
    } catch (error) {
        console.error('Error saving InPage:', error);
        res.status(500).json({ error: error.message });
    }
});

const PORT = 3001;
app.listen(PORT, () => {
    console.log(`
╔════════════════════════════════════════════╗
║   InPage Save Server running on :${PORT}      ║
╠════════════════════════════════════════════╣
║   POST /api/save-image                     ║
║   POST /api/update-excel                   ║
║   POST /api/save-inpage                    ║
╚════════════════════════════════════════════╝
`);
});
