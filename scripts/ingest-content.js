/**
 * ingest-content.js
 * 
 * Script to import InPage data (Excel + Images) from a local Google Drive folder
 * into the project's public directory.
 * 
 * Usage: node scripts/ingest-content.js "/path/to/Falabella Chile"
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Project root
const PROJECT_ROOT = path.resolve(__dirname, '..');
const PUBLIC_DIR = path.join(PROJECT_ROOT, 'public', 'drive-data');

// Configuration: Mapping of Product IDs to Folder Name keywords
const PRODUCTS = [
    // PRINTERS (G-Series)
    { id: 'g3110', keywords: ['G3110'], category: 'printers' },
    { id: 'g3170', keywords: ['G3170'], category: 'printers' },
    { id: 'g3180', keywords: ['G3180'], category: 'printers' },
    { id: 'g4110', keywords: ['G4110'], category: 'printers' },
    { id: 'g4170', keywords: ['G4170'], category: 'printers' },
    { id: 'g6010', keywords: ['G6010'], category: 'printers' },
    { id: 'gx3010', keywords: ['GX3010'], category: 'printers' },
    { id: 'gx4010', keywords: ['GX4010'], category: 'printers' },
    { id: 'gx6010', keywords: ['GX6010'], category: 'printers' },
    { id: 'gx7010', keywords: ['GX7010'], category: 'printers' },

    // CAMERAS (EOS R & Powershot)
    { id: 'r10-18-45', keywords: ['EOS_R10', '18-45'], category: 'photo' }, // More specific key
    { id: 'r50-18-45', keywords: ['R50', '18-45'], category: 'photo' },
    { id: 'r100-18-45', keywords: ['R100', '18-45'], category: 'photo' },
    { id: 'r8-24-50', keywords: ['R8', '24-50'], category: 'photo' },
    { id: 'g7x-iii', keywords: ['G7X'], category: 'photo' },
    { id: 'r50-zoomkit', keywords: ['R50', 'ZoomKit'], category: 'photo' },
    { id: 'r100-zoomkit', keywords: ['R100', 'ZoomKit'], category: 'photo' },
    // SX740: Folders are named "Black 80664032" inside "Powershot SX740" 
    { id: 'sx740-black', keywords: ['Black', '80664032'], category: 'photo' },
    { id: 'sx740-silver', keywords: ['Silver', '80664033'], category: 'photo' },
];

// Helper to find a folder containing all keywords (Recursive up to 3 levels)
function findFolder(basePath, keywords) {
    if (!fs.existsSync(basePath)) return null;

    function search(dir, depth) {
        if (depth > 3) return null; // Max recursion depth

        try {
            const items = fs.readdirSync(dir, { withFileTypes: true });

            // 1. Check current directory items
            for (const item of items) {
                if (item.isDirectory()) {
                    const name = item.name.toLowerCase();
                    const match = keywords.every(k => name.includes(k.toLowerCase()));
                    if (match) return path.join(dir, item.name);
                }
            }

            // 2. Recurse into subdirectories
            for (const item of items) {
                if (item.isDirectory()) {
                    if (item.name.startsWith('.')) continue;
                    const found = search(path.join(dir, item.name), depth + 1);
                    if (found) return found;
                }
            }
        } catch (e) {
            return null;
        }
        return null;
    }

    return search(basePath, 0);
}

// Helper to find Excel file in folder
function findExcel(folderPath) {
    try {
        const files = fs.readdirSync(folderPath);
        return files.find(f => f.endsWith('.xlsx') && !f.startsWith('~$'));
    } catch (e) { return null; }
}

// Helper to find Images folder (Robust)
function findImagesFolder(folderPath) {
    try {
        const items = fs.readdirSync(folderPath, { withFileTypes: true });

        // 1. Try finding explicit image folders first
        const explicit = items.find(item =>
            item.isDirectory() &&
            (item.name.toLowerCase().includes('foto') ||
                item.name.toLowerCase().includes('img') ||
                item.name.toLowerCase().includes('image') ||
                item.name.toLowerCase().includes('listas'))
        );
        if (explicit) return explicit.name;

        // 2. Fallback: Search for any subfolder containing at least 2 images
        for (const item of items) {
            if (item.isDirectory()) {
                const subPath = path.join(folderPath, item.name);
                try {
                    const subFiles = fs.readdirSync(subPath);
                    const imageCount = subFiles.filter(f => /\.(jpg|jpeg|png|webp)$/i.test(f)).length;
                    if (imageCount >= 1) { // Found a folder with images!
                        return item.name;
                    }
                } catch (e) { }
            }
        }

        // 3. Fallback: Check if root folder ITSELF has images? 
        // Logic requires returning a string (subfolder name). If root has images, we return '.' ?
        // My copy logic does: path.join(productFolder, imgFolderName).
        // If I return '.', it copies from productFolder.
        const rootFiles = fs.readdirSync(folderPath);
        if (rootFiles.filter(f => /\.(jpg|jpeg|png|webp)$/i.test(f)).length >= 1) {
            return '.';
        }

    } catch (e) { return null; }
    return null;
}

// Helper to copy file
function copyFile(src, dest) {
    fs.copyFileSync(src, dest);
}

async function main() {
    const sourceDir = process.argv[2];

    if (!sourceDir) {
        console.error('❌ Error: Please provide the path to "Falabella Chile" content folder.');
        console.error('Usage: node scripts/ingest-content.js "/path/to/Falabella Chile"');
        process.exit(1);
    }

    if (!fs.existsSync(sourceDir)) {
        console.error(`❌ Error: Source directory not found: ${sourceDir}`);
        process.exit(1);
    }

    console.log(`🚀 Starting ingestion from: ${sourceDir}`);
    console.log(`📂 Target: ${PUBLIC_DIR}`);

    let successCount = 0;
    let failCount = 0;

    for (const prod of PRODUCTS) {
        console.log(`\n🔍 Processing: ${prod.id}...`);

        // 1. Find Product Folder
        const productFolder = findFolder(sourceDir, prod.keywords);
        if (!productFolder) {
            console.log(`   ⚠️  Folder not found for keywords: ${prod.keywords.join(', ')}`);
            failCount++;
            continue;
        }
        console.log(`   ✅ Found folder: ${path.basename(productFolder)}`);

        // 2. Find Excel
        const excelFile = findExcel(productFolder);
        if (excelFile) {
            const destExcelDir = path.join(PUBLIC_DIR, prod.category);
            const destExcelPath = path.join(destExcelDir, excelFile);

            // Ensure dir exists
            fs.mkdirSync(destExcelDir, { recursive: true });

            copyFile(path.join(productFolder, excelFile), destExcelPath);
            console.log(`   📄 Copied Excel: ${excelFile}`);
        } else {
            console.log(`   ⚠️  No Excel file found`);
        }

        // 3. Find Images
        const imgFolderName = findImagesFolder(productFolder);
        if (imgFolderName) {
            const srcImgDir = path.join(productFolder, imgFolderName);
            const destImgDir = path.join(PUBLIC_DIR, 'images', prod.id);

            // Ensure dest dir exists
            fs.mkdirSync(destImgDir, { recursive: true });

            // Copy all images
            // If '.', srcImgDir is productFolder itself
            const images = fs.readdirSync(srcImgDir).filter(f => /\.(jpg|jpeg|png|webp)$/i.test(f));
            images.forEach(img => {
                copyFile(path.join(srcImgDir, img), path.join(destImgDir, img));
            });
            console.log(`   🖼️  Copied ${images.length} images to ${destImgDir}`);
        } else {
            console.log(`   ⚠️  No Images folder found`);
        }

        successCount++;
    }

    console.log('\n=============================================');
    console.log(`🎉 Finished! Processed ${successCount} products.`);
    console.log(`⚠️  Failures/Skipped: ${failCount}`);
    console.log('=============================================');
    console.log('You can now refresh the app to see the hosted content.');
}

main().catch(console.error);
