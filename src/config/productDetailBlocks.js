/**
 * Product Detail Block Types Configuration
 * Sistema modular de bloques para fichas de producto
 * 
 * Basado en el análisis de EOS R50 como modelo master
 */

// Tipos de bloques disponibles
export const BLOCK_TYPES = {
    // === HEADER (siempre presente, editable) ===
    HERO_HEADER: 'hero_header',

    // === SECCIONES DE CONTENIDO ===
    HERO_SECTION: 'hero_section',      // Banner con gradiente, título, descripción
    IMAGE_TEXT: 'image_text',          // Imagen + Texto (layout flexible)
    TEXT_ONLY: 'text_only',            // Solo texto con formato

    // === GRIDS Y LISTAS ===
    FEATURE_GRID: 'feature_grid',      // Cuadrícula de features (2-4 cols)
    ICON_LIST: 'icon_list',            // Lista con iconos (conectividad, etc.)

    // === MEDIA ===
    VIDEO: 'video',                    // Video embebido (YouTube)
    GALLERY: 'gallery',                // Galería de imágenes
    IMAGE_BANNER: 'image_banner',      // Banner de imagen full width

    // === ESPECIFICACIONES ===
    SPECIFICATIONS: 'specifications',   // Tabla de specs acordeón

    // === CALL TO ACTION ===
    CTA_BUTTONS: 'cta_buttons',        // Botones de acción (kits, descargas)
    KITS_SECTION: 'kits_section',      // Kits/Variantes disponibles con imágenes
};

// Configuración de cada tipo de bloque
export const BLOCK_CONFIG = {
    [BLOCK_TYPES.HERO_HEADER]: {
        id: 'hero_header',
        name: 'Header del Producto',
        description: 'Galería de imágenes + información básica del producto',
        icon: 'layout-dashboard',
        category: 'header',
        unique: true, // Solo puede existir uno
        fields: {
            // Info básica
            name: { type: 'text', label: 'Nombre del producto', required: true },
            tagline: { type: 'text', label: 'Tagline / Eslogan' },
            category: { type: 'text', label: 'Categoría' },
            description: { type: 'richtext', label: 'Descripción' },

            // Imágenes
            images: {
                type: 'image_gallery',
                label: 'Galería de imágenes',
                subfields: {
                    angles: { type: 'image_array', label: 'Ángulos principales' },
                    white: { type: 'image_array', label: 'Variante blanca (opcional)' },
                    lifestyle: { type: 'image_array', label: 'Imágenes lifestyle' }
                }
            },

            // Key Features (badges)
            keyFeatures: {
                type: 'array',
                label: 'Características clave',
                maxItems: 6,
                itemFields: {
                    title: { type: 'text', label: 'Título' },
                    subtitle: { type: 'text', label: 'Subtítulo' },
                    icon: { type: 'icon_select', label: 'Icono' }
                }
            },

            // Colores disponibles
            colors: { type: 'string_array', label: 'Colores disponibles' },

            // Links externos
            externalLinks: {
                type: 'object',
                label: 'Enlaces externos',
                fields: {
                    officialPage: { type: 'url', label: 'Página oficial' },
                    support: { type: 'url', label: 'Soporte' }
                }
            }
        }
    },

    [BLOCK_TYPES.HERO_SECTION]: {
        id: 'hero_section',
        name: 'Sección Destacada',
        description: 'Banner con gradiente, título grande y descripción',
        icon: 'sparkles',
        category: 'content',
        defaultData: {
            title: 'Nueva Sección',
            subtitle: 'Título Destacado',
            description: 'Descripción de la sección...',
            gradient: 'red'
        },
        fields: {
            title: { type: 'text', label: 'Título pequeño (categoría)' },
            subtitle: { type: 'text', label: 'Título grande', required: true },
            description: { type: 'richtext', label: 'Descripción' },
            image: { type: 'image', label: 'Imagen de fondo (opcional)' },
            gradient: {
                type: 'select',
                label: 'Color de gradiente',
                options: [
                    { value: 'red', label: 'Rojo Canon' },
                    { value: 'amber', label: 'Ámbar/Naranja' },
                    { value: 'blue', label: 'Azul' },
                    { value: 'emerald', label: 'Verde' },
                    { value: 'purple', label: 'Púrpura' },
                    { value: 'slate', label: 'Gris oscuro' }
                ]
            }
        }
    },

    [BLOCK_TYPES.IMAGE_TEXT]: {
        id: 'image_text',
        name: 'Imagen + Texto',
        description: 'Sección con imagen a un lado y texto al otro',
        icon: 'layout-left',
        category: 'content',
        defaultData: {
            layout: 'image_left',
            image: '',
            imageAlt: '',
            title: 'Título de la sección',
            description: 'Descripción del contenido...'
        },
        fields: {
            layout: {
                type: 'select',
                label: 'Disposición',
                options: [
                    { value: 'image_left', label: 'Imagen izquierda' },
                    { value: 'image_right', label: 'Imagen derecha' }
                ]
            },
            image: { type: 'image', label: 'Imagen', required: true },
            imageAlt: { type: 'text', label: 'Texto alternativo imagen' },
            title: { type: 'text', label: 'Título', required: true },
            description: { type: 'richtext', label: 'Descripción' }
        }
    },

    [BLOCK_TYPES.TEXT_ONLY]: {
        id: 'text_only',
        name: 'Solo Texto',
        description: 'Bloque de texto con formato',
        icon: 'text',
        category: 'content',
        defaultData: {
            title: '',
            content: '<p>Contenido del bloque...</p>',
            alignment: 'left'
        },
        fields: {
            title: { type: 'text', label: 'Título (opcional)' },
            content: { type: 'richtext', label: 'Contenido', required: true },
            alignment: {
                type: 'select',
                label: 'Alineación',
                options: [
                    { value: 'left', label: 'Izquierda' },
                    { value: 'center', label: 'Centro' },
                    { value: 'right', label: 'Derecha' }
                ]
            }
        }
    },

    [BLOCK_TYPES.FEATURE_GRID]: {
        id: 'feature_grid',
        name: 'Grid de Features',
        description: 'Cuadrícula de características con iconos e imágenes',
        icon: 'grid-3x3',
        category: 'grid',
        defaultData: {
            columns: 3,
            features: [
                { title: 'Feature 1', description: 'Descripción...', icon: 'check' },
                { title: 'Feature 2', description: 'Descripción...', icon: 'check' },
                { title: 'Feature 3', description: 'Descripción...', icon: 'check' }
            ]
        },
        fields: {
            columns: {
                type: 'select',
                label: 'Columnas',
                options: [
                    { value: 2, label: '2 columnas' },
                    { value: 3, label: '3 columnas' },
                    { value: 4, label: '4 columnas' },
                    { value: 'auto', label: 'Auto (flexible)' }
                ]
            },
            features: {
                type: 'array',
                label: 'Features',
                minItems: 1,
                maxItems: 12,
                itemFields: {
                    title: { type: 'text', label: 'Título', required: true },
                    description: { type: 'textarea', label: 'Descripción' },
                    icon: { type: 'icon_select', label: 'Icono' },
                    image: { type: 'image', label: 'Imagen (opcional)' }
                }
            }
        }
    },

    [BLOCK_TYPES.ICON_LIST]: {
        id: 'icon_list',
        name: 'Lista con Iconos',
        description: 'Lista horizontal de items con iconos (ej: conectividad)',
        icon: 'list',
        category: 'grid',
        defaultData: {
            title: 'Conectividad',
            layout: 'horizontal',
            items: [
                { name: 'Wi-Fi', icon: 'wifi' },
                { name: 'Bluetooth', icon: 'bluetooth' },
                { name: 'USB', icon: 'usb' }
            ]
        },
        fields: {
            title: { type: 'text', label: 'Título de la sección' },
            layout: {
                type: 'select',
                label: 'Disposición',
                options: [
                    { value: 'horizontal', label: 'Horizontal (flex)' },
                    { value: 'grid', label: 'Grid' }
                ]
            },
            items: {
                type: 'array',
                label: 'Items',
                itemFields: {
                    name: { type: 'text', label: 'Nombre', required: true },
                    icon: { type: 'icon_select', label: 'Icono' }
                }
            }
        }
    },

    [BLOCK_TYPES.VIDEO]: {
        id: 'video',
        name: 'Video',
        description: 'Video embebido de YouTube',
        icon: 'play-circle',
        category: 'media',
        defaultData: {
            title: 'Video del Producto',
            description: '',
            youtubeId: '',
            autoplay: false
        },
        fields: {
            title: { type: 'text', label: 'Título del video' },
            description: { type: 'text', label: 'Descripción breve' },
            youtubeId: { type: 'text', label: 'ID de YouTube', required: true },
            autoplay: { type: 'boolean', label: 'Autoplay al hacer clic' }
        }
    },

    [BLOCK_TYPES.GALLERY]: {
        id: 'gallery',
        name: 'Galería de Imágenes',
        description: 'Galería de fotos de muestra',
        icon: 'images',
        category: 'media',
        defaultData: {
            title: 'Galería de Fotos',
            columns: 3,
            images: []
        },
        fields: {
            title: { type: 'text', label: 'Título' },
            columns: {
                type: 'select',
                label: 'Columnas',
                options: [
                    { value: 2, label: '2 columnas' },
                    { value: 3, label: '3 columnas' },
                    { value: 4, label: '4 columnas' }
                ]
            },
            images: {
                type: 'array',
                label: 'Imágenes',
                itemFields: {
                    src: { type: 'image', label: 'Imagen', required: true },
                    caption: { type: 'text', label: 'Descripción' },
                    settings: { type: 'text', label: 'Configuración técnica (f/2.8, etc.)' }
                }
            }
        }
    },

    [BLOCK_TYPES.IMAGE_BANNER]: {
        id: 'image_banner',
        name: 'Banner de Imagen',
        description: 'Imagen de ancho completo',
        icon: 'image',
        category: 'media',
        defaultData: {
            image: '',
            alt: '',
            height: 'medium',
            overlay: false
        },
        fields: {
            image: { type: 'image', label: 'Imagen', required: true },
            alt: { type: 'text', label: 'Texto alternativo' },
            height: {
                type: 'select',
                label: 'Altura',
                options: [
                    { value: 'small', label: 'Pequeño (200px)' },
                    { value: 'medium', label: 'Mediano (400px)' },
                    { value: 'large', label: 'Grande (600px)' },
                    { value: 'auto', label: 'Automático' }
                ]
            },
            overlay: { type: 'boolean', label: 'Overlay oscuro' }
        }
    },

    [BLOCK_TYPES.SPECIFICATIONS]: {
        id: 'specifications',
        name: 'Especificaciones',
        description: 'Tabla de especificaciones técnicas en acordeón',
        icon: 'clipboard-list',
        category: 'data',
        defaultData: {
            title: 'Especificaciones Técnicas',
            categories: [
                { name: 'General', specs: [{ key: 'Tipo', value: '' }] }
            ]
        },
        fields: {
            title: { type: 'text', label: 'Título', default: 'Especificaciones Técnicas' },
            categories: {
                type: 'array',
                label: 'Categorías',
                itemFields: {
                    name: { type: 'text', label: 'Nombre de categoría', required: true },
                    specs: {
                        type: 'key_value_array',
                        label: 'Especificaciones',
                        itemFields: {
                            key: { type: 'text', label: 'Propiedad' },
                            value: { type: 'text', label: 'Valor' }
                        }
                    }
                }
            }
        }
    },

    [BLOCK_TYPES.CTA_BUTTONS]: {
        id: 'cta_buttons',
        name: 'Botones de Acción',
        description: 'Grupo de botones (kits disponibles, descargas, etc.)',
        icon: 'mouse-pointer-click',
        category: 'action',
        defaultData: {
            layout: 'horizontal',
            buttons: [
                { label: 'Comprar Ahora', url: '', style: 'primary' }
            ]
        },
        fields: {
            layout: {
                type: 'select',
                label: 'Disposición',
                options: [
                    { value: 'horizontal', label: 'Horizontal' },
                    { value: 'vertical', label: 'Vertical' }
                ]
            },
            buttons: {
                type: 'array',
                label: 'Botones',
                itemFields: {
                    label: { type: 'text', label: 'Texto del botón', required: true },
                    url: { type: 'url', label: 'URL' },
                    style: {
                        type: 'select',
                        label: 'Estilo',
                        options: [
                            { value: 'primary', label: 'Primario (rojo)' },
                            { value: 'secondary', label: 'Secundario (outline)' },
                            { value: 'ghost', label: 'Ghost (transparente)' }
                        ]
                    },
                    icon: { type: 'icon_select', label: 'Icono (opcional)' },
                    image: { type: 'image', label: 'Imagen miniatura (opcional)' }
                }
            }
        }
    },

    [BLOCK_TYPES.KITS_SECTION]: {
        id: 'kits_section',
        name: 'Kits Disponibles',
        description: 'Sección de variantes/kits del producto con imágenes',
        icon: 'package',
        category: 'action',
        defaultData: {
            title: 'Kits Disponibles',
            subtitle: 'Opciones de Compra',
            layout: 'grid',
            kits: [
                { name: 'Kit Estándar', image: '', link: '', description: '' }
            ]
        },
        fields: {
            title: { type: 'text', label: 'Título', default: 'Kits Disponibles' },
            subtitle: { type: 'text', label: 'Subtítulo', default: 'Opciones de Compra' },
            layout: {
                type: 'select',
                label: 'Disposición',
                options: [
                    { value: 'grid', label: 'Grid (2-3 columnas)' },
                    { value: 'carousel', label: 'Carrusel horizontal' }
                ]
            },
            kits: {
                type: 'array',
                label: 'Kits/Variantes',
                minItems: 1,
                maxItems: 6,
                itemFields: {
                    name: { type: 'text', label: 'Nombre del kit', required: true },
                    image: { type: 'image', label: 'Imagen del kit', required: true },
                    link: { type: 'url', label: 'Enlace de compra' },
                    description: { type: 'text', label: 'Descripción (opcional)' }
                }
            }
        }
    }
};

// Categorías de bloques para el selector
export const BLOCK_CATEGORIES = {
    header: { name: 'Header', icon: 'layout-dashboard' },
    content: { name: 'Contenido', icon: 'file-text' },
    grid: { name: 'Grids y Listas', icon: 'grid-3x3' },
    media: { name: 'Multimedia', icon: 'play-circle' },
    data: { name: 'Datos', icon: 'clipboard-list' },
    action: { name: 'Acciones', icon: 'mouse-pointer-click' }
};

// Iconos disponibles para features
export const AVAILABLE_ICONS = [
    // Producto
    { id: 'sensor', name: 'Sensor', lucide: 'Camera' },
    { id: 'video', name: 'Video', lucide: 'Video' },
    { id: 'speed', name: 'Velocidad', lucide: 'Zap' },
    { id: 'focus', name: 'Enfoque', lucide: 'Target' },
    { id: 'weight', name: 'Peso', lucide: 'Layers' },
    { id: 'quality', name: 'Calidad', lucide: 'Image' },

    // Características
    { id: 'zoom', name: 'Zoom', lucide: 'Maximize2' },
    { id: 'slowmo', name: 'Cámara Lenta', lucide: 'Play' },
    { id: 'stabilization', name: 'Estabilización', lucide: 'Settings' },
    { id: 'stream', name: 'Streaming', lucide: 'Wifi' },
    { id: 'vertical', name: 'Vertical', lucide: 'Smartphone' },
    { id: 'aspect', name: 'Aspecto', lucide: 'Monitor' },
    { id: 'hdr', name: 'HDR', lucide: 'Sun' },
    { id: 'panorama', name: 'Panorama', lucide: 'Image' },

    // Detección
    { id: 'human', name: 'Personas', lucide: 'Users' },
    { id: 'animal', name: 'Animales', lucide: 'Dog' },
    { id: 'vehicle', name: 'Vehículos', lucide: 'Car' },

    // Diseño
    { id: 'flash', name: 'Flash', lucide: 'Sun' },
    { id: 'evf', name: 'Visor', lucide: 'Eye' },
    { id: 'lcd', name: 'Pantalla', lucide: 'Monitor' },
    { id: 'shoe', name: 'Zapata', lucide: 'Settings' },

    // Conectividad
    { id: 'wifi', name: 'Wi-Fi', lucide: 'Wifi' },
    { id: 'usb', name: 'USB', lucide: 'Usb' },
    { id: 'bluetooth', name: 'Bluetooth', lucide: 'Bluetooth' },
    { id: 'cloud', name: 'Cloud', lucide: 'Cloud' },

    // Generales
    { id: 'check', name: 'Check', lucide: 'Check' },
    { id: 'star', name: 'Estrella', lucide: 'Star' },
    { id: 'heart', name: 'Corazón', lucide: 'Heart' },
    { id: 'download', name: 'Descarga', lucide: 'Download' },
    { id: 'external', name: 'Enlace Externo', lucide: 'ExternalLink' },
    { id: 'shopping', name: 'Compra', lucide: 'ShoppingBag' }
];

// Gradientes predefinidos
export const GRADIENTS = {
    red: 'from-red-600 to-rose-800',
    amber: 'from-amber-500 to-orange-700',
    blue: 'from-blue-600 to-indigo-800',
    emerald: 'from-emerald-600 to-teal-800',
    purple: 'from-purple-600 to-violet-800',
    slate: 'from-slate-700 to-zinc-900'
};

// Template inicial para un nuevo producto (basado en R50)
export const getDefaultProductTemplate = (productId, productName) => ({
    id: productId,
    name: productName,
    blocks: [
        {
            id: 'header-1',
            type: BLOCK_TYPES.HERO_HEADER,
            order: 0,
            data: {
                name: productName,
                tagline: '',
                category: 'cameras',
                description: '',
                images: { angles: [], white: [], lifestyle: [] },
                keyFeatures: [],
                colors: ['Negra'],
                externalLinks: { officialPage: '', support: '' }
            }
        }
    ]
});

export default {
    BLOCK_TYPES,
    BLOCK_CONFIG,
    BLOCK_CATEGORIES,
    AVAILABLE_ICONS,
    GRADIENTS,
    getDefaultProductTemplate
};
