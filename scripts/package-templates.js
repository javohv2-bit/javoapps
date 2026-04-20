
import fs from 'fs';
import path from 'path';
import ExcelJS from 'exceljs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROJECT_ROOT = path.join(__dirname, '..');

// ==========================================
// 1. DATA DEFINITIONS (Mirrored from canonInPages.js)
// ==========================================

const powershotV1 = {
    id: 'powershot-v1',
    sku: '17468486',
    category: 'photo',
    name: 'PowerShot V1 Black',
    blocks: [
        { moduleId: 1, data: { image: 'hero_banner.jpg', altImage: 'Canon PowerShot V1' } },
        { moduleId: 3, data: { image: 'sensor.png', altImage: 'Sensor CMOS', title: 'Sensor de Nueva Generación', description: 'El sensor CMOS tipo 1.4" de nuevo diseño ofrece 22.3 megapíxeles para fotos y 18.7 megapíxeles para video.' } },
        { moduleId: 4, data: { title: 'Lente Ultra Gran Angular', description: 'Lente zoom equivalente a 17-52mm (16-50mm para fotos fijas).', image: 'lens.png', altImage: 'Lente zoom' } },
        { moduleId: 3, data: { image: 'zoom.png', altImage: 'Enfoque macro', title: 'Acércate Más', description: 'Captura sujetos con gran detalle enfocando hasta 15 cm.' } },
        { moduleId: 4, data: { title: 'Grabación Ilimitada 4K60p', description: 'Ventilador integrado evita el sobrecalentamiento.', image: 'cooling.png', altImage: 'Ventilación' } },
        { moduleId: 3, data: { image: 'stabilization.png', altImage: 'Estabilización', title: 'Estabilización Profesional', description: 'Estabilización óptica (IS) y digital trabajan juntas.' } },
        { moduleId: 5, data: { title: 'Características Destacadas', item1: 'Pantalla táctil 3.0"', item2: 'Luz indicadora frontal', item3: '3 micrófonos integrados', item4: 'Bluetooth y WiFi', item5: 'Streaming Full HD', item6: 'Zapata multifunción', item7: 'Modos C1, C2, C3', item8: 'Interruptor dedicado' } },
        { moduleId: 7, data: { leftImage: 'vlogging1.png', leftTitle: 'Creado para Vloggers', leftText: 'Empuñadura rediseñada para sujetar desde la parte frontal.', rightImage: 'connections1.png', rightTitle: 'Conectividad Total', rightText: 'Entrada de micrófono, salida de audífonos.' } },
        { moduleId: 6, data: { image: 'vlogging2.png', altImage: 'Crea contenido', title: 'Crea Sin Límites', description: 'La PowerShot V1 combina potencia, portabilidad y creatividad.' } }
    ]
};

const kitGI10 = {
    id: 'kit-gi10',
    sku: '17514857',
    category: 'printers',
    name: 'Kit Tintas GI-10',
    blocks: [
        { moduleId: 1, data: { image: 'gi10_kit.jpg', altImage: 'Kit de 4 Botellas de Tinta Canon GI-10' } },
        { moduleId: 2, data: { title: 'Kit Completo de Tintas Canon GI-10', col1Text: 'Alto Rendimiento\n\n• Tinta negra: hasta 8,300 páginas\n• Tintas de color: hasta 7,000 páginas', col2Text: 'Compatibilidad\n\n• PIXMA G5010 / G5011\n• PIXMA G6010 / G6011\n• PIXMA G7010' } }
    ]
};

const kitGI11 = {
    id: 'kit-gi11',
    sku: '17514856',
    category: 'printers',
    name: 'Kit Tintas GI-11',
    blocks: [
        { moduleId: 1, data: { image: 'gi11_kit.jpg', altImage: 'Kit de 4 Botellas de Tinta Canon GI-11' } },
        { moduleId: 2, data: { title: 'Kit Completo de Tintas Canon GI-11', col1Text: 'Alto Rendimiento\n\n• Tinta negra (135ml): hasta 6,000 páginas', col2Text: 'Compatibilidad\n\n• PIXMA G1130\n• PIXMA G2160 / G2170' } }
    ]
};

const kitGI190 = {
    id: 'kit-gi190',
    sku: '17514855',
    category: 'printers',
    name: 'Kit Tintas GI-190',
    blocks: [
        { moduleId: 1, data: { image: 'gi190_kit.jpg', altImage: 'Kit de 4 Botellas de Tinta Canon GI-190' } },
        { moduleId: 2, data: { title: 'Kit Completo de Tintas Canon GI-190', col1Text: 'Alto Rendimiento\n\n• Tinta negra: hasta 6,000 páginas', col2Text: 'Compatibilidad\n\n• PIXMA G2100 / G2110\n• PIXMA G3100' } }
    ]
};

const PRODUCTS = [powershotV1, kitGI10, kitGI11, kitGI190];

// ==========================================
// 2. HELPER FUNCTIONS
// ==========================================

const MODULE_NAMES = {
    1: 'Módulo 1: BANNER Full Ancho',
    2: 'Módulo 2: Texto 2 Columnas',
    3: 'Módulo 3: Imagen/Texto',
    4: 'Módulo 4: Texto/Imagen',
    5: 'Módulo 5: Lista',
    6: 'Módulo 6: Imagen Texto Centrado',
    7: 'Módulo 7: 2 columnas imagen y texto',
    8: 'Módulo 8: Video & Texto',
    9: 'Módulo 9: BANNER CTA'
};

const EXCEL_MAPPING = {
    1: { image: 'D', altImage: 'F' },
    2: { title: 'D', col1Text: 'F', col2Text: 'H' },
    3: { image: 'D', altImage: 'F', title: 'H', description: 'J' },
    4: { title: 'D', description: 'F', image: 'H', altImage: 'J' },
    5: { title: 'D', item1: 'F', item2: 'H', item3: 'J', item4: 'L', item5: 'N', item6: 'P', item7: 'R', item8: 'T' },
    6: { image: 'D', altImage: 'F', title: 'H', description: 'J' },
    7: { leftImage: 'D', leftAlt: 'F', leftTitle: 'H', leftText: 'J', rightImage: 'L', rightAlt: 'N', rightTitle: 'P', rightText: 'R' },
    8: { youtubeCode: 'D', title: 'F', description: 'H' },
    9: { image: 'D', altImage: 'F', url: 'H' }
};

async function createExcel(product, outputPath) {
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('Formulario');

    // Add some header rows (just to occupy space, parser ignores 1-3)
    sheet.getCell('B1').value = 'InPage Builder Template';
    sheet.getCell('B2').value = product.name;
    sheet.getCell('B3').value = 'Módulos';

    // Write Blocks
    product.blocks.forEach((block, index) => {
        const rowIndex = index + 4; // Start at row 4
        const row = sheet.getRow(rowIndex);

        // Column B: Module Name
        row.getCell('B').value = MODULE_NAMES[block.moduleId];

        // Data Columns
        const mapping = EXCEL_MAPPING[block.moduleId];
        if (mapping) {
            Object.entries(mapping).forEach(([field, col]) => {
                if (block.data[field]) {
                    row.getCell(col).value = block.data[field];
                }
            });
        }

        row.commit();
    });

    await workbook.xlsx.writeFile(outputPath);
    console.log(`✅ Created Excel: ${outputPath}`);
}

async function copyImages(product) {
    const targetDir = path.join(PROJECT_ROOT, 'public', 'drive-data', 'images', product.id);
    if (!fs.existsSync(targetDir)) {
        fs.mkdirSync(targetDir, { recursive: true });
    }

    // Determine source directory based on product
    let sourceDir;
    if (product.id === 'powershot-v1') {
        sourceDir = path.join(PROJECT_ROOT, 'public', 'assets', 'inpages', 'powershot_v1');
    } else {
        sourceDir = path.join(PROJECT_ROOT, 'public', 'assets', 'inpages', 'tintas');
    }

    // Copy each image mentioned in blocks
    const copiedFiles = new Set();
    product.blocks.forEach(block => {
        const imageFields = ['image', 'leftImage', 'rightImage'];
        imageFields.forEach(field => {
            if (block.data[field] && !block.data[field].startsWith('http')) {
                const fileName = block.data[field];
                if (copiedFiles.has(fileName)) return;

                const srcPath = path.join(sourceDir, fileName);
                const destPath = path.join(targetDir, fileName);

                if (fs.existsSync(srcPath)) {
                    fs.copyFileSync(srcPath, destPath);
                    console.log(`   Copied: ${fileName}`);
                    copiedFiles.add(fileName);
                } else {
                    console.warn(`   ⚠️ Missing image: ${srcPath}`);
                }
            }
        });
    });
}

// ==========================================
// 3. MAIN EXECUTION
// ==========================================

async function main() {
    console.log('📦 Starting Package Process...');

    for (const product of PRODUCTS) {
        console.log(`\nProcessing ${product.name}...`);

        // 1. Copy Images
        await copyImages(product);

        // 2. Create Excel
        const excelDir = path.join(PROJECT_ROOT, 'public', 'drive-data', product.category);
        if (!fs.existsSync(excelDir)) {
            fs.mkdirSync(excelDir, { recursive: true });
        }

        const excelPath = path.join(excelDir, `${product.sku}-${product.name}.xlsx`.replace(/ /g, '_'));
        await createExcel(product, excelPath);
    }

    console.log('\n✨ All Done! Templates are now packaged.');
}

main().catch(console.error);
