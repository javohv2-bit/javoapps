/**
 * Canon Asia Product Scraper
 * 
 * Extrae automáticamente TODAS las imágenes y datos de un producto de Canon Asia
 * 
 * Uso:
 *   node scripts/scrape-canon-product.cjs <url-producto> [output-file]
 * 
 * Ejemplos:
 *   node scripts/scrape-canon-product.cjs https://asia.canon/en/consumer/eos-r8/body/product
 *   node scripts/scrape-canon-product.cjs https://asia.canon/en/consumer/eos-r8/rf24-50mm-f-4-5-6-3-is-stm/product eos-r8
 */

const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

// Colores para consola
const colors = {
    reset: '\x1b[0m',
    bright: '\x1b[1m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    magenta: '\x1b[35m',
    cyan: '\x1b[36m'
};

const log = {
    info: (msg) => console.log(`${colors.blue}ℹ${colors.reset} ${msg}`),
    success: (msg) => console.log(`${colors.green}✓${colors.reset} ${msg}`),
    warn: (msg) => console.log(`${colors.yellow}⚠${colors.reset} ${msg}`),
    error: (msg) => console.log(`${colors.red}✗${colors.reset} ${msg}`),
    title: (msg) => console.log(`\n${colors.bright}${colors.cyan}${msg}${colors.reset}\n`)
};

async function scrapeCanonProduct(productUrl) {
    log.title('🎯 Canon Asia Product Scraper');
    log.info(`URL: ${productUrl}`);

    const browser = await puppeteer.launch({
        headless: 'new',
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    try {
        const page = await browser.newPage();
        
        // Configurar viewport grande para cargar todas las imágenes
        await page.setViewport({ width: 1920, height: 1080 });
        
        // Interceptar requests para capturar imágenes
        const allImages = new Set();
        
        await page.setRequestInterception(true);
        page.on('request', (request) => {
            const url = request.url();
            if (url.includes('asia.canon/media/image')) {
                allImages.add(url);
            }
            request.continue();
        });

        // Navegar a la página
        log.info('Navegando a la página del producto...');
        await page.goto(productUrl, { 
            waitUntil: 'networkidle2',
            timeout: 60000 
        });

        // Scroll lento para cargar lazy images
        log.info('Haciendo scroll para cargar todas las imágenes...');
        await autoScroll(page);

        // Esperar un poco más para imágenes lazy
        await new Promise(r => setTimeout(r, 2000));

        // Extraer imágenes del DOM también
        const domImages = await page.evaluate(() => {
            const imgs = [];
            document.querySelectorAll('img').forEach(img => {
                const src = img.src || img.dataset.src || img.getAttribute('data-lazy-src');
                if (src && src.includes('asia.canon/media/image')) {
                    imgs.push(src);
                }
            });
            // También buscar en backgrounds
            document.querySelectorAll('[style*="background"]').forEach(el => {
                const style = el.getAttribute('style');
                const match = style.match(/url\(['"]?(https:\/\/asia\.canon\/media\/image[^'")\s]+)['"]?\)/);
                if (match) imgs.push(match[1]);
            });
            return imgs;
        });

        domImages.forEach(img => allImages.add(img));

        // Extraer información del producto
        log.info('Extrayendo información del producto...');
        const productInfo = await page.evaluate(() => {
            const getName = () => {
                const h1 = document.querySelector('h1');
                return h1 ? h1.textContent.trim() : '';
            };

            const getTagline = () => {
                const tagline = document.querySelector('.product-tagline, .hero-tagline, [class*="tagline"]');
                return tagline ? tagline.textContent.trim() : '';
            };

            const getDescription = () => {
                const desc = document.querySelector('.product-description, .hero-description, [class*="description"] p');
                return desc ? desc.textContent.trim() : '';
            };

            // Extraer especificaciones
            const specs = {};
            document.querySelectorAll('.spec-item, .specification-row, [class*="spec"]').forEach(el => {
                const label = el.querySelector('.spec-label, .label, th');
                const value = el.querySelector('.spec-value, .value, td');
                if (label && value) {
                    specs[label.textContent.trim()] = value.textContent.trim();
                }
            });

            // Extraer features/secciones
            const sections = [];
            document.querySelectorAll('section, [class*="feature"], [class*="section"]').forEach(el => {
                const title = el.querySelector('h2, h3');
                const desc = el.querySelector('p');
                if (title) {
                    sections.push({
                        title: title.textContent.trim(),
                        description: desc ? desc.textContent.trim() : ''
                    });
                }
            });

            return {
                name: getName(),
                tagline: getTagline(),
                description: getDescription(),
                specs,
                sections
            };
        });

        // Clasificar imágenes
        log.info('Clasificando imágenes...');
        const classifiedImages = classifyImages(Array.from(allImages));

        // Construir resultado
        const result = {
            url: productUrl,
            productInfo,
            images: classifiedImages,
            totalImages: allImages.size,
            scrapedAt: new Date().toISOString()
        };

        log.success(`Total de imágenes encontradas: ${allImages.size}`);
        log.success(`  - Producto (ángulos): ${classifiedImages.angles.length}`);
        log.success(`  - Features: ${classifiedImages.features.length}`);
        log.success(`  - Galería: ${classifiedImages.gallery.length}`);
        log.success(`  - Otras: ${classifiedImages.other.length}`);

        return result;

    } finally {
        await browser.close();
    }
}

async function autoScroll(page) {
    await page.evaluate(async () => {
        await new Promise((resolve) => {
            let totalHeight = 0;
            const distance = 300;
            const timer = setInterval(() => {
                const scrollHeight = document.body.scrollHeight;
                window.scrollBy(0, distance);
                totalHeight += distance;

                if (totalHeight >= scrollHeight) {
                    clearInterval(timer);
                    // Scroll back to top
                    window.scrollTo(0, 0);
                    resolve();
                }
            }, 100);
        });
    });
}

function classifyImages(images) {
    const classified = {
        hero: [],
        angles: [],
        features: [],
        gallery: [],
        other: []
    };

    images.forEach(url => {
        const filename = url.split('/').pop().toLowerCase();
        
        // Imágenes de producto (ángulos)
        if (filename.includes('front') || filename.includes('back') || 
            filename.includes('top') || filename.includes('bottom') ||
            filename.includes('left') || filename.includes('right') ||
            filename.includes('slant') || filename.includes('body') ||
            filename.includes('_k4') || filename.includes('362x320')) {
            
            // Hero son las que tienen lente (w+RF, with lens, etc)
            if (filename.includes('w+rf') || filename.includes('with') || 
                filename.includes('kit') || filename.includes('slant')) {
                classified.hero.push(url);
            }
            classified.angles.push({ src: url, label: extractLabel(filename) });
        }
        // Imágenes de galería
        else if (filename.includes('gallery') || filename.includes('gallary') ||
                 filename.includes('sample')) {
            classified.gallery.push(url);
        }
        // Imágenes de features
        else if (filename.includes('feature') || filename.includes('prodes') ||
                 filename.includes('superior') || filename.includes('quality') ||
                 filename.includes('speed') || filename.includes('tracking') ||
                 filename.includes('video') || filename.includes('4k') ||
                 filename.includes('af') || filename.includes('evf') ||
                 filename.includes('lcd') || filename.includes('hdr') ||
                 filename.includes('iso') || filename.includes('sensor') ||
                 filename.includes('detection') || filename.includes('log') ||
                 filename.includes('fps') || filename.includes('burst') ||
                 filename.includes('stabilization') || filename.includes('is') ||
                 filename.includes('lightweight') || filename.includes('compact') ||
                 filename.includes('hybrid') || filename.includes('auto') ||
                 filename.includes('zebra') || filename.includes('colour') ||
                 filename.includes('marker') || filename.includes('animal') ||
                 filename.includes('vehicle') || filename.includes('people') ||
                 filename.includes('eye') || filename.includes('blazing')) {
            classified.features.push({
                url,
                name: extractFeatureName(filename)
            });
        }
        // Otras
        else {
            classified.other.push(url);
        }
    });

    // Ordenar features por nombre
    classified.features.sort((a, b) => a.name.localeCompare(b.name));

    return classified;
}

function extractLabel(filename) {
    // Extraer label descriptivo del nombre de archivo
    const parts = filename.replace(/\.[^.]+$/, '').split('_');
    const lastPart = parts[parts.length - 1] || '';
    return lastPart
        .replace(/\+/g, ' ')
        .replace(/362x320/g, '')
        .replace(/body/gi, 'Body')
        .trim() || 'Vista';
}

function extractFeatureName(filename) {
    // Extraer nombre del feature
    const parts = filename.replace(/\.[^.]+$/, '').split('_');
    const lastPart = parts[parts.length - 1] || parts[0] || '';
    return lastPart.replace(/\+/g, ' ').trim();
}

function generateProductFile(result, outputName) {
    const productId = outputName || result.productInfo.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    const varName = productId.replace(/-/g, '');

    // Seleccionar solo las primeras imágenes de hero
    const heroImages = result.images.hero.slice(0, 5);
    if (heroImages.length === 0 && result.images.angles.length > 0) {
        heroImages.push(result.images.angles[0].src);
    }

    // Mapear features a secciones (máximo una imagen por feature)
    const usedImages = new Set();
    const featureSections = [];
    
    result.images.features.forEach(feature => {
        if (!usedImages.has(feature.url)) {
            usedImages.add(feature.url);
            featureSections.push({
                title: feature.name,
                image: feature.url
            });
        }
    });

    const template = `/**
 * ${result.productInfo.name} - Product Detail Data
 * Category: cameras
 * 
 * Auto-generated by scrape-canon-product.cjs
 * Source: ${result.url}
 * Generated: ${result.scrapedAt}
 * 
 * IMPORTANTE: Revisar y ajustar manualmente:
 * - Traducir textos al español
 * - Verificar categoría correcta
 * - Organizar secciones según el diseño deseado
 * - Agregar especificaciones técnicas
 */
const ${varName} = {
    id: '${productId}',
    name: '${result.productInfo.name}',
    tagline: '${result.productInfo.tagline || 'TODO: Agregar tagline'}',
    category: 'cameras', // Ajustar: 'cameras' | 'printers' | 'lenses' | 'accessories'
    description: '${result.productInfo.description || 'TODO: Agregar descripción'}',

    images: {
        hero: [
${heroImages.map(img => `            '${img}'`).join(',\n')}
        ],
        angles: [
${result.images.angles.slice(0, 12).map(a => `            { src: '${a.src}', label: '${a.label}' }`).join(',\n')}
        ],
        white: [],
        lifestyle: [
${result.images.gallery.slice(0, 6).map(img => `            '${img}'`).join(',\n')}
        ]
    },

    keyFeatures: [
        // TODO: Agregar 4-5 features principales
        { icon: 'camera', title: 'Feature 1', description: 'Descripción' },
        { icon: 'video', title: 'Feature 2', description: 'Descripción' },
        { icon: 'zap', title: 'Feature 3', description: 'Descripción' },
        { icon: 'target', title: 'Feature 4', description: 'Descripción' },
    ],

    sections: [
        // ========== SECCIONES GENERADAS ==========
        // NOTA: Cada imagen debe usarse UNA SOLA VEZ
        // Total de imágenes de features disponibles: ${featureSections.length}
${featureSections.map((f, i) => `
        // Feature ${i + 1}: ${f.title}
        // Imagen: ${f.image}`).join('\n')}

        // ========== EJEMPLO DE ESTRUCTURA ==========
        {
            type: 'hero_section',
            id: 'section-1',
            title: 'Título de Sección',
            subtitle: 'Subtítulo',
            description: 'Descripción de la sección.',
            gradient: 'from-purple-600 to-pink-600'
        },
        {
            type: 'feature_grid',
            id: 'features-1',
            columns: 2,
            features: [
${featureSections.slice(0, 2).map(f => `                {
                    title: '${f.title}',
                    description: 'TODO: Agregar descripción',
                    icon: 'camera',
                    image: '${f.image}'
                }`).join(',\n')}
            ]
        },

        // ========== CONECTIVIDAD ==========
        {
            type: 'connectivity',
            id: 'connectivity',
            title: 'Conexiones',
            items: [
                { name: 'Wi-Fi', icon: 'wifi' },
                { name: 'USB', icon: 'usb' },
                { name: 'Bluetooth', icon: 'bluetooth' },
                { name: 'image.canon', icon: 'cloud' }
            ]
        }
    ],

    specifications: {
        // ⚠️ OBLIGATORIO: Usar este formato exacto con categorías en español
        'Sensor': {
            'Tipo': 'TODO: Full-Frame CMOS / APS-C CMOS',
            'Megapíxeles efectivos': 'Aprox. XX.X MP',
            'Tamaño del sensor': 'XX x XX mm',
            'Procesador': 'DIGIC X / DIGIC 8',
            'Montura': 'Canon RF'
        },
        'Video': {
            'Resolución máxima': '4K UHD XXp',
            'Cámara lenta': 'Full HD XXXp',
            'Formatos': 'TODO'
        },
        'Enfoque': {
            'Sistema': 'Dual Pixel CMOS AF II',
            'Zonas AF': 'X,XXX posiciones',
            'Detección': 'Personas, Animales, Vehículos',
            'Sensibilidad': 'EV -X a EV XX'
        },
        'Disparo': {
            'Velocidad mecánica': 'X fps',
            'Velocidad electrónica': 'XX fps',
            'ISO': '100-XXXXX'
        },
        'Visor y Pantalla': {
            'EVF': 'X.XX" OLED, X.XXM puntos',
            'LCD': 'X.X" Vari-angle táctil'
        },
        'Físico': {
            'Peso': 'Aprox. XXXg (cuerpo)',
            'Dimensiones': 'XXX x XX x XX mm',
            'Batería': 'LP-EXX'
        }
    },

    downloads: {
        allImages: {
            url: '${result.url.replace('/product', '/photos')}',
            size: 'Ver sitio',
            label: 'Photo Library Completa'
        },
        individual: []
    },

    accessories: [],
    colors: ['Negra'],
    kits: [],

    externalLinks: {
        officialPage: '${result.url}',
        photoLibrary: '${result.url.replace('/product', '/photos')}',
        support: 'https://asia.canon/en/support/${encodeURIComponent(result.productInfo.name)}/model'
    }
};

export default ${varName};

/*
 * ============================================
 * IMÁGENES DE FEATURES DISPONIBLES
 * ============================================
 * Usa cada imagen UNA SOLA VEZ en las secciones
 * 
${featureSections.map((f, i) => ` * ${i + 1}. ${f.title}\n *    ${f.image}`).join('\n')}
 *
 * ============================================
 * IMÁGENES DE GALERÍA DISPONIBLES  
 * ============================================
${result.images.gallery.map((g, i) => ` * ${i + 1}. ${g}`).join('\n')}
 */
`;

    return {
        filename: `${productId}.js`,
        content: template,
        productId
    };
}

// Main execution
async function main() {
    const args = process.argv.slice(2);
    
    if (args.length === 0) {
        console.log(`
${colors.bright}Canon Asia Product Scraper${colors.reset}

${colors.yellow}Uso:${colors.reset}
  node scripts/scrape-canon-product.cjs <url-producto> [nombre-archivo]

${colors.yellow}Ejemplos:${colors.reset}
  node scripts/scrape-canon-product.cjs https://asia.canon/en/consumer/eos-r8/body/product
  node scripts/scrape-canon-product.cjs https://asia.canon/en/consumer/eos-r8/rf24-50mm-f-4-5-6-3-is-stm/product eos-r8

${colors.yellow}Output:${colors.reset}
  - Genera archivo en src/data/products/[nombre].js
  - Guarda JSON con datos raw en scripts/scraped-[nombre].json
`);
        process.exit(0);
    }

    const productUrl = args[0];
    const outputName = args[1] || null;

    if (!productUrl.includes('asia.canon')) {
        log.error('La URL debe ser de asia.canon');
        process.exit(1);
    }

    try {
        // Scrape
        const result = await scrapeCanonProduct(productUrl);

        // Guardar JSON raw
        const jsonPath = path.join(__dirname, `scraped-${outputName || 'product'}.json`);
        fs.writeFileSync(jsonPath, JSON.stringify(result, null, 2));
        log.success(`JSON guardado: ${jsonPath}`);

        // Generar archivo de producto
        const productFile = generateProductFile(result, outputName);
        const productPath = path.join(__dirname, '..', 'src', 'data', 'products', productFile.filename);
        fs.writeFileSync(productPath, productFile.content);
        log.success(`Archivo de producto generado: ${productPath}`);

        log.title('📋 Próximos pasos:');
        console.log(`
1. Abrir ${colors.cyan}${productFile.filename}${colors.reset}
2. Revisar y traducir textos al español
3. Organizar secciones usando las imágenes listadas al final
4. Agregar especificaciones técnicas desde Canon Asia
5. Registrar en ${colors.cyan}src/data/products/index.js${colors.reset}:
   
   ${colors.yellow}import ${productFile.productId.replace(/-/g, '')} from './${productFile.productId}';${colors.reset}
   
   Y agregar al objeto productDetails:
   ${colors.yellow}'${productFile.productId}': ${productFile.productId.replace(/-/g, '')},${colors.reset}
`);

    } catch (error) {
        log.error(`Error: ${error.message}`);
        console.error(error);
        process.exit(1);
    }
}

main();
