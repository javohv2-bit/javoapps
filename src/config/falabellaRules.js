/**
 * Falabella Inpage Module Configuration
 * Based on deep analysis of InPage Builder_v8.xlsx
 * 
 * STRUCTURE:
 * - Data sheet: Contains module templates (rows 3-11) and wrapper HTML (row 2 open, row 12 close)
 * - Formulario sheet: Row 4-13 = Bloques 1-10
 *   - Column B: Module selector dropdown
 *   - Columns D, F, H, J, L, N, P, R, T: User input fields
 *   - Column U: Generated HTML (formula)
 * - Código sheet: Final output concatenating all block outputs
 */

export const modules = [
    {
        id: 1,
        name: "Módulo 1: Banner principal sin texto",
        excelName: "Banner principal sin texto (Modulo 1)",
        description: "Banner principal sin texto, solo imagen.",
        imageWidth: 1160,
        imageHeight: 480,
        // From Data!Row3: CONCAT(E3, Form!D, G3, Form!F, I3)
        // D = Nombre imagen, F = Alt imagen
        fields: ["image", "altImage"],
        excelMapping: {
            image: "D",      // Nombre imagen (sin extensión)
            altImage: "F"    // Alt imagen
        }
    },
    {
        id: 2,
        name: "Módulo 2: Texto en dos columnas",
        excelName: "Texto en dos columnas (Modulo 2)",
        description: "Texto dividido en dos columnas sin imagen.",
        imageWidth: null,
        imageHeight: null,
        // From Data!Row4: CONCAT(E4, Form!D, G4, Form!F, I4, Form!H, K4)
        // D = Título, F = Texto col1, H = Texto col2
        fields: ["title", "col1Text", "col2Text"],
        excelMapping: {
            title: "D",      // Título del párrafo
            col1Text: "F",   // Texto primera columna
            col2Text: "H"    // Texto segunda columna
        }
    },
    {
        id: 3,
        name: "Módulo 3: Imagen y Texto",
        excelName: "Imagen y texto (Modulo 3)",
        description: "Imagen a la izquierda, texto a la derecha.",
        imageWidth: 560,
        imageHeight: 315,
        // From Data!Row5: CONCAT(E5, Form!D, G5, Form!F, I5, Form!H, K5, Form!J, M5)
        // D = Nombre imagen, F = Alt imagen, H = Título, J = Texto
        fields: ["image", "altImage", "title", "description"],
        excelMapping: {
            image: "D",
            altImage: "F",
            title: "H",
            description: "J"
        }
    },
    {
        id: 4,
        name: "Módulo 4: Texto e Imagen",
        excelName: "Texto e Imagen (Modulo 4)",
        description: "Texto a la izquierda, imagen a la derecha.",
        imageWidth: 560,
        imageHeight: 315,
        // From Data!Row6: CONCAT(E6, Form!D, G6, Form!F, I6, Form!H, K6, Form!J, M6)
        // D = Título, F = Texto, H = Nombre imagen, J = Alt imagen
        fields: ["title", "description", "image", "altImage"],
        excelMapping: {
            title: "D",
            description: "F",
            image: "H",
            altImage: "J"
        }
    },
    {
        id: 5,
        name: "Módulo 5: Lista en dos columnas",
        excelName: "Lista en dos columnas (Modulo 5)",
        description: "Lista de hasta 8 ítems sin imagen.",
        imageWidth: null,
        imageHeight: null,
        // From Data!Row7: Complex CONCAT with items wrapped in <li>
        // D = Título, then F, H, J, L (col1 items), N, P, R, T (col2 items)
        fields: ["title", "item1", "item2", "item3", "item4", "item5", "item6", "item7", "item8"],
        excelMapping: {
            title: "D",
            item1: "F",
            item2: "H",
            item3: "J",
            item4: "L",
            item5: "N",
            item6: "P",
            item7: "R",
            item8: "T"
        }
    },
    {
        id: 6,
        name: "Módulo 6: Banner Grande y Texto",
        excelName: "Banner grande y texto (Modulo 6)",
        description: "Imagen ancha con texto abajo.",
        imageWidth: 1160,
        imageHeight: 360,
        // From Data!Row8: CONCAT(E8, Form!D, G8, Form!F, I8, Form!H, K8, Form!J, M8)
        // D = Nombre imagen, F = Alt imagen, H = Título, J = Texto
        fields: ["image", "altImage", "title", "description"],
        excelMapping: {
            image: "D",
            altImage: "F",
            title: "H",
            description: "J"
        }
    },
    {
        id: 7,
        name: "Módulo 7: Dos Imágenes con Texto",
        excelName: "Dos imágenes con texto abajo (Modulo 7)",
        description: "Dos columnas, cada una con imagen y texto.",
        imageWidth: 560,
        imageHeight: 315,
        // From Data!Row9: Very long CONCAT
        // D = Img izq, F = Alt izq, H = Título izq, J = Texto izq
        // L = Img der, N = Alt der, P = Título der, R = Texto der
        fields: ["leftImage", "leftAlt", "leftTitle", "leftText", "rightImage", "rightAlt", "rightTitle", "rightText"],
        excelMapping: {
            leftImage: "D",
            leftAlt: "F",
            leftTitle: "H",
            leftText: "J",
            rightImage: "L",
            rightAlt: "N",
            rightTitle: "P",
            rightText: "R"
        }
    },
    {
        id: 8,
        name: "Módulo 8: Video y Texto",
        excelName: "Video y texto (Modulo 8)",
        description: "Video de YouTube y texto.",
        imageWidth: null,
        imageHeight: null,
        // From Data!Row10: CONCAT(E10, Form!D, G10, Form!F, I10, Form!H, K10)
        // D = Código YouTube, F = Título, H = Texto
        fields: ["youtubeCode", "title", "description"],
        excelMapping: {
            youtubeCode: "D",  // Just the video ID, not full URL
            title: "F",
            description: "H"
        }
    },
    {
        id: 9,
        name: "Módulo 9: Banner Clickeable",
        excelName: "Banner clicleable (Modulo 9)",
        description: "Imagen que enlaza a una URL.",
        imageWidth: 1160,
        imageHeight: 480,
        // From Data!Row11: CONCAT(E11, Form!D, G11, Form!F, I11, Form!H, K11)
        // D = URL destino, F = Nombre imagen, H = Alt imagen
        fields: ["url", "image", "altImage"],
        excelMapping: {
            url: "D",
            image: "F",
            altImage: "H"
        }
    }
];

/**
 * Generates image names according to Falabella naming convention.
 * Format: SKU-img_N (without extension)
 * The extension is NOT included - Falabella adds it automatically.
 * 
 * @param {string} sku - The product SKU
 * @param {number} index - Sequential image number (1-based)
 * @returns {string} The formatted image name WITHOUT extension
 */
export const namingConvention = (sku, index) => {
    return `${sku}-img_${index}`;
};

/**
 * Row numbers in Formulario sheet for each Bloque
 * Bloque 1 = Row 4, Bloque 2 = Row 5, ... Bloque 10 = Row 13
 */
export const getRowForBloque = (bloqueNumber) => {
    return 3 + bloqueNumber; // Bloque 1 -> Row 4
};
