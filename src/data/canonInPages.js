/**
 * Pre-built InPage data for the 4 Canon products
 * 
 * IMPORTANT: For images, use `image` field with the path to the image file
 * The generators will fetch these images and include them in the ZIP
 */

// PowerShot V1 Black - 9 blocks
export const powershotV1 = {
    sku: '17468486',
    blocks: [
        {
            id: '1',
            moduleId: 1, // Banner principal
            data: {
                image: '/assets/inpages/powershot_v1/hero_banner.jpg',
                altImage: 'Canon PowerShot V1 - La cámara definitiva para creadores de contenido'
            }
        },
        {
            id: '2',
            moduleId: 3, // Imagen y Texto
            data: {
                image: '/assets/inpages/powershot_v1/sensor.png',
                altImage: 'Sensor CMOS tipo 1.4" de 22.3 megapíxeles',
                title: 'Sensor de Nueva Generación',
                description: 'El sensor CMOS tipo 1.4" de nuevo diseño ofrece 22.3 megapíxeles para fotos y 18.7 megapíxeles para video. Obtén una calidad de imagen profesional con menor profundidad de campo, mejor rendimiento en condiciones de poca luz y rango dinámico mejorado.'
            }
        },
        {
            id: '3',
            moduleId: 4, // Texto e Imagen
            data: {
                title: 'Lente Ultra Gran Angular',
                description: 'Lente zoom equivalente a 17-52mm (16-50mm para fotos fijas) con apertura F2.8-11. Incluye filtro ND integrado de 3 pasos para exteriores con mucha luz. Ideal para vlogs sin necesidad de cambiar lentes.',
                image: '/assets/inpages/powershot_v1/lens.png',
                altImage: 'Lente zoom ultra gran angular 17-52mm'
            }
        },
        {
            id: '4',
            moduleId: 3, // Imagen y Texto
            data: {
                image: '/assets/inpages/powershot_v1/zoom.png',
                altImage: 'Enfoque macro hasta 15cm',
                title: 'Acércate Más',
                description: 'Captura sujetos con gran detalle enfocando hasta 15 cm. Esto permite primeros planos de gran expresividad gracias al amplio ángulo de visión y el efecto bokeh que ofrece un objetivo gran angular.'
            }
        },
        {
            id: '5',
            moduleId: 4, // Texto e Imagen
            data: {
                title: 'Grabación Ilimitada 4K60p',
                description: 'El ventilador integrado evita el sobrecalentamiento, permitiendo grabación continua ilimitada en 4K60p. Canon Log 3 disponible para un amplio rango dinámico y profundidad de color de 10 bits desde ISO 800.',
                image: '/assets/inpages/powershot_v1/cooling.png',
                altImage: 'Sistema de ventilación integrado para grabación sin límites'
            }
        },
        {
            id: '6',
            moduleId: 3, // Imagen y Texto
            data: {
                image: '/assets/inpages/powershot_v1/stabilization.png',
                altImage: 'Estabilización de imagen avanzada',
                title: 'Estabilización Profesional',
                description: 'Estabilización óptica (IS) y digital trabajan juntas para videos estables incluso mientras caminas. La nueva Estabilización con Seguimiento del Sujeto prioriza la estabilidad en la ubicación del sujeto.'
            }
        },
        {
            id: '7',
            moduleId: 5, // Lista en dos columnas
            data: {
                title: 'Características Destacadas',
                item1: 'Pantalla táctil 3.0" totalmente articulada',
                item2: 'Luz indicadora frontal de grabación activa',
                item3: '3 micrófonos integrados + protector de viento',
                item4: 'Conectividad Bluetooth y WiFi',
                item5: 'Streaming Full HD por USB',
                item6: 'Zapata multifunción para accesorios',
                item7: 'Modos personalizados C1, C2, C3',
                item8: 'Interruptor dedicado foto/video'
            }
        },
        {
            id: '8',
            moduleId: 7, // Dos imágenes con texto
            data: {
                leftImage: '/assets/inpages/powershot_v1/vlogging1.png',
                leftAlt: 'Vlogging con PowerShot V1',
                leftTitle: 'Creado para Vloggers',
                leftText: 'Empuñadura rediseñada para sujetar desde la parte frontal con estabilidad. Perfecta para selfies y videoblogs.',
                rightImage: '/assets/inpages/powershot_v1/connections1.png',
                rightAlt: 'Conectividad PowerShot V1',
                rightTitle: 'Conectividad Total',
                rightText: 'Entrada de micrófono, salida de audífonos y zapata multifunción para accesorios como el micrófono DM-E1D.'
            }
        },
        {
            id: '9',
            moduleId: 6, // Banner grande y texto
            data: {
                image: '/assets/inpages/powershot_v1/vlogging2.png',
                altImage: 'Canon PowerShot V1 - Crea contenido sin límites',
                title: 'Crea Sin Límites',
                description: 'La PowerShot V1 combina potencia, portabilidad y creatividad en un diseño todo en uno. Sensor grande, lente profesional, video 4K ilimitado y estabilización avanzada para creadores que buscan calidad sin compromiso.'
            }
        }
    ]
};

// Kit Tintas GI-10 - 2 blocks
export const kitGI10 = {
    sku: '17514857',
    blocks: [
        {
            id: '1',
            moduleId: 1, // Banner principal
            data: {
                image: '/assets/inpages/tintas/gi10_kit.jpg',
                altImage: 'Kit de 4 Botellas de Tinta Canon GI-10'
            }
        },
        {
            id: '2',
            moduleId: 2, // Texto en dos columnas
            data: {
                title: 'Kit Completo de Tintas Canon GI-10',
                col1Text: 'Alto Rendimiento\n\n• Tinta negra: hasta 8,300 páginas\n• Tintas de color: hasta 7,000 páginas\n\nTintas genuinas Canon para impresión de alta productividad.',
                col2Text: 'Compatibilidad\n\n• PIXMA G5010 / G5011\n• PIXMA G6010 / G6011\n• PIXMA G7010\n• PIXMA GM2010 / GM2011\n• PIXMA GM4010'
            }
        }
    ]
};

// Kit Tintas GI-11 - 2 blocks
export const kitGI11 = {
    sku: '17514856',
    blocks: [
        {
            id: '1',
            moduleId: 1, // Banner principal
            data: {
                image: '/assets/inpages/tintas/gi11_kit.jpg',
                altImage: 'Kit de 4 Botellas de Tinta Canon GI-11'
            }
        },
        {
            id: '2',
            moduleId: 2, // Texto en dos columnas
            data: {
                title: 'Kit Completo de Tintas Canon GI-11',
                col1Text: 'Alto Rendimiento\n\n• Tinta negra (135ml): hasta 6,000 páginas\n• Tintas de color (70ml c/u): hasta 7,000 páginas\n\nPerfectas para documentos y fotos.',
                col2Text: 'Compatibilidad\n\n• PIXMA G1130\n• PIXMA G2160 / G2170\n• PIXMA G3160 / G3170\n• PIXMA G4170'
            }
        }
    ]
};

// Kit Tintas GI-190 - 2 blocks
export const kitGI190 = {
    sku: '17514855',
    blocks: [
        {
            id: '1',
            moduleId: 1, // Banner principal
            data: {
                image: '/assets/inpages/tintas/gi190_kit.jpg',
                altImage: 'Kit de 4 Botellas de Tinta Canon GI-190'
            }
        },
        {
            id: '2',
            moduleId: 2, // Texto en dos columnas
            data: {
                title: 'Kit Completo de Tintas Canon GI-190',
                col1Text: 'Alto Rendimiento\n\n• Tinta negra: hasta 6,000 páginas\n• Tintas de color: hasta 7,000 páginas cada una\n\nRendimiento excepcional para impresión de alto volumen.',
                col2Text: 'Compatibilidad\n\n• PIXMA G2100 / G2110\n• PIXMA G3100 / G3110\n• PIXMA G4100 / G4110'
            }
        }
    ]
};

// EOS R50 V - Cámara mirrorless para creadores de contenido - 9 bloques variados
export const eosR50V = {
    sku: '17586611',
    blocks: [
        {
            id: '1',
            moduleId: 1, // Banner principal hero
            data: {
                image: '/drive-data/images/eos-r50v/r50v-banner.jpg',
                altImage: 'Canon EOS R50 V - Tu Vlog, Tu Estilo - Cámara mirrorless para creadores de contenido'
            }
        },
        {
            id: '2',
            moduleId: 2, // Título + Descripción intro
            data: {
                title: 'EOS R50 V: Tu Vlog, Tu Estilo',
                col1Text: 'La primera cámara de lentes intercambiables de la serie EOS V de Canon. Diseñada desde cero pensando en creadores de contenido, vloggers y streamers que necesitan calidad profesional en un cuerpo compacto y liviano.',
                col2Text: 'Grabación interna 4K 60p en 10 bits, Canon Log 3 para colorización profesional, y herramientas de monitoreo como false colour y zebra display heredadas de la serie CINEMA EOS. Todo en solo 370 gramos.'
            }
        },
        {
            id: '3',
            moduleId: 3, // Imagen izquierda + Texto derecha - VIDEO 4K
            data: {
                image: '/drive-data/images/eos-r50v/r50v-kit-front-slant.png',
                altImage: 'Canon EOS R50 V con lente kit RF-S14-30mm - Grabación 4K profesional',
                title: 'Video 4K Cinematográfico con Sobremuestreo 6K',
                description: 'Captura video 4K 30p con increíble detalle y color vibrante gracias al sobremuestreo desde 6K y el algoritmo de debayer avanzado heredado de la serie CINEMA EOS. Para escenas de acción rápida, activa el modo 4K 60p Crop. Graba internamente en 10 bits con muestreo YCC 4:2:2. ISO nativo hasta 12,800, expandible a 25,600.'
            }
        },
        {
            id: '4',
            moduleId: 4, // Texto izquierda + Imagen derecha - CANON LOG 3
            data: {
                title: 'Canon Log 3: Coloriza Como un Profesional',
                description: 'Canon Log 3 captura un amplio rango dinámico con detalles limpios en sombras y luces, dándote flexibilidad total en postproducción. Graba en formatos profesionales XF-HEVC S (H.265) o XF-AVC S (H.264). Cinema Gamut expande tu espacio de color para crear tu estilo visual único.',
                image: '/drive-data/images/eos-r50v/r50v-kit-front.png',
                altImage: 'Canon EOS R50 V con lente - Canon Log 3 y Cinema Gamut para colorización profesional'
            }
        },
        {
            id: '5',
            moduleId: 8, // Video de YouTube - Video oficial de Canon
            data: {
                youtubeCode: 'xwi2NXYpzyI',
                title: 'Descubre la EOS R50 V en Acción',
                description: 'Mira el video oficial de Canon y descubre todas las capacidades de la EOS R50 V. Grabación 4K profesional, Canon Log 3, livestreaming integrado y mucho más en una cámara diseñada para creadores de contenido.'
            }
        },
        {
            id: '6',
            moduleId: 7, // Dos imágenes con texto - VISTAS DEL PRODUCTO
            data: {
                leftImage: '/drive-data/images/eos-r50v/r50v-kit-screen.png',
                leftAlt: 'Canon EOS R50 V con pantalla táctil articulada abierta',
                leftTitle: 'Pantalla Vari-angle',
                leftText: 'Pantalla táctil de 3" totalmente articulada para selfies, vlogs y ángulos creativos. Interfaz auto-rotativa para grabación vertical.',
                rightImage: '/drive-data/images/eos-r50v/r50v-magnesium-body.png',
                rightAlt: 'Canon EOS R50 V cuerpo de aleación de magnesio',
                rightTitle: 'Construcción Premium',
                rightText: 'Cuerpo interno de aleación de magnesio para máxima durabilidad y disipación térmica. Grabación continua hasta 2 horas en 4K.'
            }
        },
        {
            id: '7',
            moduleId: 3, // Imagen + Texto - LIVESTREAM
            data: {
                image: '/drive-data/images/eos-r50v/r50v-livestream.jpg',
                altImage: 'Canon EOS R50 V para streaming y transmisiones en vivo',
                title: '4 Formas de Transmitir en Vivo',
                description: 'Botón dedicado de livestream para ir en vivo al instante. Conecta vía USB-C a tu PC sin capturadora (UVC/UAC), HDMI para configuraciones con switcher, o transmite inalámbricamente con Camera Connect o Live Switcher Mobile. Alimentación USB Power Delivery para horas de streaming.'
            }
        },
        {
            id: '8',
            moduleId: 4, // Texto + Imagen - AUTOFOCUS
            data: {
                title: 'Enfoque Inteligente Dual Pixel CMOS AF II',
                description: 'Sistema de enfoque por detección de fase con cobertura 100% x 100% del cuadro. Detección con IA: personas (ojos y rostro), animales, vehículos, aviones y trenes. Touch AF para cambiar foco con un toque, Movie Servo AF para transiciones cinematográficas.',
                image: '/drive-data/images/eos-r50v/r50v-vertical-recording.jpg',
                altImage: 'Canon EOS R50 V con enfoque automático inteligente Dual Pixel CMOS AF II'
            }
        },
        {
            id: '9',
            moduleId: 5, // Lista de características destacadas
            data: {
                title: 'Características Destacadas de la EOS R50 V',
                item1: '14 filtros creativos: StoryMagenta, RetroGreen, Accent Red',
                item2: 'Cinema View: aspecto 2.35:1 + 23.98fps cinematográfico',
                item3: 'Slow & Fast Motion: cámara lenta 5x o time-lapse 60x',
                item4: 'Grabación vertical nativa para redes sociales',
                item5: 'Smooth Skin Movie para tutoriales de belleza',
                item6: 'Audio 4 canales LPCM con 3 micrófonos integrados',
                item7: 'Sensor APS-C 24.2MP + DIGIC X: 15 FPS con tracking',
                item8: 'Compatible con lentes VR Canon RF-S Dual Fisheye'
            }
        }
    ]
};

export const allInPages = [powershotV1, kitGI10, kitGI11, kitGI190, eosR50V];

// ============================================================
// FALABELLA CAMPAIGN INPAGES - v8 Format
// ============================================================

// PowerShot G7X Mark III - SKU: 17507574 - 7 bloques
export const powershotG7XMarkIII = {
    sku: '17507574',
    blocks: [
        {
            id: '1',
            moduleId: 6, // Banner Grande y Texto (Header)
            data: {
                image: 'https://asia.canon/media/image/2019/07/08/0608c7cd539f49cab256b05348b33ab3_G7+X+mkIII+BK+Front+Slant.png',
                altImage: 'Canon PowerShot G7X Mark III - La cámara compacta premium para creadores de contenido',
                title: 'PowerShot G7X Mark III: El Siguiente Nivel',
                description: 'Sucesor de la popular G7X Mark II, esta cámara es el salto perfecto para quienes quieren más que simples fotografías. El procesador DIGIC 8 y el sensor CMOS apilado de 1,0 pulgada ofrecen una calidad de imagen excepcional. Con apertura f/1.8-2.8, la PowerShot G7X Mark III rinde de forma sobresaliente incluso en condiciones de poca luz.'
            }
        },
        {
            id: '2',
            moduleId: 3, // Imagen izq + Texto der
            data: {
                image: 'https://asia.canon/media/image/2019/07/08/8d0db401031e4decbdf0d82dce54c796_G7+X+mkIII+BK+Front.png',
                altImage: 'Sensor CMOS apilado de 1.0 pulgada Canon PowerShot G7X Mark III',
                title: 'Sensor CMOS Apilado de 1,0 Pulgada',
                description: 'El sensor CMOS apilado de 1,0 pulgada junto al procesador DIGIC 8 captura imágenes de 20,1 megapíxeles con una nitidez y rango dinámico excepcionales. La apertura máxima f/1.8 a 24mm garantiza una magnífica captura de luz en entornos oscuros, produciendo fotografías nítidas con un suave bokeh artístico.'
            }
        },
        {
            id: '3',
            moduleId: 4, // Texto izq + Imagen der
            data: {
                title: 'Video 4K sin Recorte y Full HD a 120p',
                description: 'Graba video 4K UHD sin ningún recorte de encuadre para aprovechar al máximo tu visión creativa. Captura ralentís cinematográficos en Full HD a 120 fps. Las tomas en movimiento quedan perfectamente estabilizadas gracias al sistema IS óptico de 5 ejes combinado con estabilización digital.',
                image: 'https://asia.canon/media/image/2019/07/08/2185c4ca4dde400c99335959ec6cb5f8_G7+X+mkIII+BK+Front+Slant+w+Screen.png',
                altImage: 'Canon PowerShot G7X Mark III con pantalla abatible para selfies y vlogging 4K'
            }
        },
        {
            id: '4',
            moduleId: 3, // Imagen izq + Texto der
            data: {
                image: 'https://asia.canon/media/image/2019/07/08/4143b7600ac64ab198c2ea83e22bb86b_G7+X+mkIII+BK+Back.png',
                altImage: 'Canon PowerShot G7X Mark III pantalla táctil abatible 180° para selfies',
                title: 'Pantalla Táctil Abatible 180° para Selfies',
                description: 'La pantalla LCD táctil de 3,0 pulgadas se inclina hasta 180° hacia arriba, perfecta para selfies y vlogging. Encuadra con precisión en cualquier ángulo. El botón de selfie en la parte frontal permite disparar sin esfuerzo mientras te ves reflejado en pantalla.'
            }
        },
        {
            id: '5',
            moduleId: 4, // Texto izq + Imagen der
            data: {
                title: 'Live Streaming Directo en YouTube',
                description: 'Transmite tus aventuras en tiempo real directamente a YouTube desde la cámara. Comparte cada momento al instante con tu comunidad gracias a la conectividad WiFi integrada. Activa el streaming con un solo botón y conéctate sin necesidad de un computador o capturadora adicional.',
                image: 'https://asia.canon/media/image/2019/07/08/ae4bf430e90c45959def7926bcb63cae_G7+X+mkIII+BK+Top.png',
                altImage: 'Canon PowerShot G7X Mark III vista superior con controles intuitivos'
            }
        },
        {
            id: '6',
            moduleId: 7, // Dos imágenes con texto
            data: {
                leftImage: 'https://asia.canon/media/image/2019/07/08/8d0db401031e4decbdf0d82dce54c796_G7+X+mkIII+BK+Front.png',
                leftAlt: 'Canon PowerShot G7X Mark III diseño compacto premium',
                leftTitle: 'Diseño Compacto Premium',
                leftText: 'Cuerpo compacto que cabe en cualquier bolsillo. Flash integrado para iluminación adicional en interiores y condiciones de contraluz. Construcción sólida y ergonómica para disparar durante horas sin fatiga.',
                rightImage: 'https://asia.canon/media/image/2019/07/08/2185c4ca4dde400c99335959ec6cb5f8_G7+X+mkIII+BK+Front+Slant+w+Screen.png',
                rightAlt: 'Canon PowerShot G7X Mark III conectividad WiFi Bluetooth',
                rightTitle: 'Conectividad Total',
                rightText: 'WiFi y Bluetooth integrados para transferir fotos y videos al smartphone al instante. Controla la cámara de forma remota desde la app Canon Camera Connect. Comparte tu contenido en redes sociales directamente desde la cámara.'
            }
        },
        {
            id: '7',
            moduleId: 8, // Video oficial Canon
            data: {
                youtubeCode: 'MtFleOwUBZU',
                title: 'PowerShot G7X Mark III en Acción',
                description: 'Descubre todo lo que la PowerShot G7X Mark III puede hacer por ti: video 4K sin recorte, live streaming a YouTube, sensor 1,0" de alto rendimiento y un diseño compacto perfecto para llevar a todas partes.'
            }
        },
        {
            id: '8',
            moduleId: 5, // Lista en dos columnas
            data: {
                title: 'Características Destacadas',
                item1: 'Sensor CMOS apilado 1,0" · 20,1 MP',
                item2: 'Procesador DIGIC 8 de última generación',
                item3: 'Lente zoom 24-100mm f/1.8-2.8 IS',
                item4: 'Video 4K UHD sin recorte · Full HD 120p',
                item5: 'Live Streaming directo a YouTube',
                item6: 'Pantalla LCD táctil 3" abatible 180°',
                item7: 'WiFi · Bluetooth · NFC',
                item8: 'Flash integrado · Batería NB-13L'
            }
        }
    ]
};

// EOS R10 RF-S 18-45mm - SKU: 16765189 - 8 bloques
export const eosR10 = {
    sku: '16765189',
    blocks: [
        {
            id: '1',
            moduleId: 6, // Banner Grande y Texto (Header)
            data: {
                image: 'https://asia.canon/media/image/2022/05/23/8469771c95ec46a5b3058f82405eac53_EOS+R10+with+RF-S18-45mm+f4.5-6.3+IS+STM+Front+Slant.png',
                altImage: 'Canon EOS R10 con lente RF-S 18-45mm - Mirrorless APS-C ligera y potente',
                title: 'EOS R10: Explora Sin Límites',
                description: 'Explora posibilidades infinitas con la liviana EOS R10. Con el nuevo sensor APS-C en el revolucionario montaje RF, obtienes un efecto teleobjetivo de aproximadamente 1,6x mientras mantienes alta resolución. Esta cámara mirrorless dispara hasta 23 fotogramas por segundo y pesa solo 429 g.'
            }
        },
        {
            id: '2',
            moduleId: 3, // Imagen izq + Texto der
            data: {
                image: 'https://asia.canon/media/image/2022/05/23/3ebfbc4a04ed4694b0da65548e11e5f4_EOS+R10+01+Superior+Image+Quality.png',
                altImage: 'Sensor APS-C 24.2 megapíxeles Canon EOS R10 calidad de imagen superior',
                title: 'Sensor APS-C 24,2 MP + DIGIC X',
                description: 'El nuevo sensor CMOS APS-C de 24,2 megapíxeles combinado con el procesador DIGIC X ofrece una lectura de alta velocidad y una calidad de imagen excepcional. El efecto de recorte 1,6x te aproxima más al sujeto conservando toda la resolución. Rango ISO 100–32.000 para imágenes limpias incluso en poca luz.'
            }
        },
        {
            id: '3',
            moduleId: 4, // Texto izq + Imagen der
            data: {
                title: 'Hasta 23 fps con Seguimiento AF/AE',
                description: 'El Dual Pixel CMOS AF II cubre el 100% × 100% del encuadre con hasta 651 zonas de enfoque, rastreando sujetos hasta el borde del cuadro. Dispara en ráfaga hasta 23 fps con obturador electrónico silencioso, ideal para deportes, vida silvestre y cualquier acción rápida. RAW Burst a 30 fps con pre-disparo de 0,5 s.',
                image: 'https://asia.canon/media/image/2022/05/23/a4297453d2544afdba59c66c685bdcbe_EOS+R10+with+RF-S18-45mm+f4.5-6.3+IS+STM+Front.png',
                altImage: 'Canon EOS R10 velocidad de disparo 23fps Dual Pixel CMOS AF II'
            }
        },
        {
            id: '4',
            moduleId: 8, // Video oficial Canon Europe
            data: {
                youtubeCode: '4bdXsvAjEeI',
                title: 'Canon EOS R10: Velocidad y Precisión en Acción',
                description: 'Conoce las capacidades de la EOS R10 de la mano de Canon: 23 fps, 4K UHD con sobremuestreo 6K, Dual Pixel CMOS AF II y un peso de solo 429 g. La mirrorless APS-C perfecta para explorar sin límites.'
            }
        },
        {
            id: '5',
            moduleId: 3, // Imagen izq + Texto der
            data: {
                image: 'https://asia.canon/media/image/2022/05/23/c4c54342f7584b9a94bd977adde65d5b_EOS+R10+6K+Oversampling+to+4K.png',
                altImage: 'Canon EOS R10 video 4K UHD con sobremuestreo desde 6K',
                title: 'Video 4K UHD con Sobremuestreo 6K',
                description: 'Graba video 4K UHD sin recorte procesado desde datos 6K RGB para mayor calidad, menos moiré y mínima distorsión de color y ruido. Activa el modo 4K 60p Crop para escenas de acción. Graba en 4:2:2 10 bits HDR PQ para un rango dinámico ampliado y transición de colores perfecta en postproducción.'
            }
        },
        {
            id: '6',
            moduleId: 4, // Texto izq + Imagen der
            data: {
                title: 'Detección Inteligente: Personas, Animales y Vehículos',
                description: 'El sistema de enfoque con IA reconoce y rastrea personas (incluso con mascarilla o gafas), animales (perros, gatos, aves) y vehículos (autos de carrera, motos). El Eye Detection AF mantiene los ojos del sujeto perfectamente enfocados aunque se muevan por todo el encuadre.',
                image: 'https://asia.canon/media/image/2022/05/23/584ad3cc52094851ac25b83781da9d42_EOS+R10+HDR+PQ+%26+Composite.png',
                altImage: 'Canon EOS R10 HDR PQ y composición de alto rango dinámico'
            }
        },
        {
            id: '7',
            moduleId: 7, // Dos imágenes con texto
            data: {
                leftImage: 'https://asia.canon/media/image/2022/05/23/28ecd4965587422c9abc45d6d894c958_EOS+R10+with+RF-S18-45mm+f4.5-6.3+IS+STM+Left.png',
                leftAlt: 'Canon EOS R10 con visor EVF electrónico y pantalla Vari-angle',
                leftTitle: 'Visor EVF + Pantalla Vari-angle',
                leftText: 'EVF electrónico de 2,36M puntos con vista OVF simulada para una experiencia natural. Pantalla táctil articulada de 3,0" y 1,04M puntos para disparar desde cualquier ángulo, horizontal o vertical.',
                rightImage: 'https://asia.canon/media/image/2022/05/23/e0db2685700e4b26800e5cc471da899e_EOS+R10+17+Panorama.png',
                rightAlt: 'Canon EOS R10 modo panorama en cámara y flash pop-up integrado',
                rightTitle: 'Flash Integrado + Panorama',
                rightText: 'Flash pop-up retráctil (GN 6) para iluminar en interiores o como relleno contra luz de fondo. Modo Panorama in-camera: captura hasta 200 fotos y la cámara las combina automáticamente en una panorámica de alta resolución.'
            }
        },
        {
            id: '8',
            moduleId: 5, // Lista en dos columnas
            data: {
                title: 'Especificaciones Destacadas',
                item1: 'Sensor APS-C 24,2 MP · DIGIC X',
                item2: 'Hasta 23 fps electrónico · 15 fps mecánico',
                item3: '4K UHD sin crop (6K oversampling) · 4K 60p crop',
                item4: 'Dual Pixel CMOS AF II · 651 zonas · 100%×100%',
                item5: 'Detección IA: personas, animales, vehículos',
                item6: 'Pantalla articulada 3" touchscreen + EVF 2,36M puntos',
                item7: 'Flash pop-up · Montura Multi-función',
                item8: 'WiFi · Bluetooth · USB-C · Peso 429 g'
            }
        }
    ]
};

// EOS R50 RF-S 18-45mm IS STM - SKU: 16765190 - 8 bloques
export const eosR50 = {
    sku: '16765190',
    blocks: [
        {
            id: '1',
            moduleId: 6, // Banner Grande y Texto (Header)
            data: {
                image: 'https://asia.canon/media/image/2023/02/06/aa40086891434857aa3e5c6465f427a0_EOS+R50+Black+Front+Slant+Left.png',
                altImage: 'Canon EOS R50 - Mirrorless compacta ideal para vloggers y creadores de contenido',
                title: 'EOS R50: Entra a un Nuevo Universo',
                description: 'La EOS R50 es la nueva sucesora de la EOS M50 Mark II en el sistema de montura RF de Canon. Graba video en 4K 30p (sobremuestreo 6K) o Full HD a 120p con total libertad creativa. El enfoque EOS iTR AF X con Dual Pixel CMOS AF II hace que fotografiar y filmar sea siempre preciso y sin esfuerzo.'
            }
        },
        {
            id: '2',
            moduleId: 3, // Imagen izq + Texto der
            data: {
                image: 'https://asia.canon/media/image/2023/02/06/f8f9e836feef45cbbf7a8741add6814c_Amazing+Vlogging+Capabilities.jpg',
                altImage: 'Canon EOS R50 capacidades de vlogging y video 4K con sobremuestreo 6K',
                title: 'Video 4K con Sobremuestreo 6K',
                description: 'El proceso de sobremuestreo 6K de la EOS R50 utiliza el mismo algoritmo de debayer del sistema CINEMA EOS de Canon. Obtén videos 4K con mayor claridad y menos ruido comparado con grabaciones 4K nativas. Además, graba Full HD a 120p para efectos de cámara lenta hasta 4x (reproducción a 30p).'
            }
        },
        {
            id: '3',
            moduleId: 4, // Texto izq + Imagen der
            data: {
                title: 'EOS iTR AF X: Enfoque Inteligente con IA',
                description: 'El sistema EOS iTR AF X con Dual Pixel CMOS AF II detecta y sigue automáticamente a personas (ojos, cabeza o cuerpo), animales (perros, gatos y aves) y vehículos mientras tú te concentras en la composición. Dispara hasta 15 fps en modo electrónico silencioso con seguimiento AF/AE activo.',
                image: 'https://asia.canon/media/image/2023/02/06/1c97ba5a38db40e5a175a18f7def7937_EOS+R50+Black+Left.png',
                altImage: 'Canon EOS R50 autofocus EOS iTR AF X inteligente con detección de sujetos'
            }
        },
        {
            id: '4',
            moduleId: 8, // Video oficial Canon Europe en español
            data: {
                youtubeCode: 'tO9ywWNfLYE',
                title: 'Canon EOS R50: Conoce Tu Nueva Cámara',
                description: 'Descubre todo lo que la EOS R50 tiene para ofrecer: video 4K (sobremuestreo 6K), Full HD 120p, grabación vertical nativa, EOS iTR AF X y un cuerpo compacto de solo 375 g. La compañera perfecta para creadores de contenido.'
            }
        },
        {
            id: '5',
            moduleId: 3, // Imagen izq + Texto der
            data: {
                image: 'https://asia.canon/media/image/2023/02/06/f6a9c0d63bec4029aa20139851a32647_EOS+R50+Black+Right.png',
                altImage: 'Canon EOS R50 grabación vertical nativa para redes sociales',
                title: 'Grabación Vertical Nativa para Redes Sociales',
                description: 'Crea contenido vertical directamente para Instagram Reels, TikTok o YouTube Shorts sin recortes ni edición posterior. La EOS R50 graba verticalmente de forma nativa y reproduce el resultado en pantalla con la orientación correcta. El Marcador de Aspecto guía tu encuadre en tiempo real para distintos formatos.'
            }
        },
        {
            id: '6',
            moduleId: 4, // Texto izq + Imagen der
            data: {
                title: 'Estabilización IS Coordinada de 5 Ejes',
                description: 'El Movie Digital IS de 5 ejes reduce el movimiento de la cámara incluso sin lente con estabilización óptica. Combinado con un lente RF IS, el control coordinado potencia aún más la estabilización para tomas a mano alzada perfectamente fluidas durante tus vlogs o transmisiones en vivo.',
                image: 'https://asia.canon/media/image/2023/02/06/6522b1a3cd514eea8bcaa204e9a478d9_EOS+R50+Black+Back.png',
                altImage: 'Canon EOS R50 pantalla articulada Vari-angle y controles intuitivos'
            }
        },
        {
            id: '7',
            moduleId: 7, // Dos imágenes con texto
            data: {
                leftImage: 'https://asia.canon/media/image/2023/02/06/5ac85b8dc2ce4861b8c2d4883084004e_EOS+R50+Black+Top.png',
                leftAlt: 'Canon EOS R50 pantalla articulada Vari-angle 3" y EVF integrado',
                leftTitle: 'Pantalla Vari-angle + EVF',
                leftText: 'Pantalla táctil articulada de 3,0" con 1,62M puntos para disparar desde cualquier ángulo. Visor electrónico integrado para composición precisa con luz directa. Interfaz táctil similar a la de un smartphone.',
                rightImage: 'https://asia.canon/media/image/2023/02/06/6e1bcdc4406c408dae862c4165ea5a45_EOS+R50+White+Front+Slant+Left.png',
                rightAlt: 'Canon EOS R50 blanca disponible en dos colores negro y blanco',
                rightTitle: 'Streaming USB-C + Dos Colores',
                rightText: 'Conéctala a tu PC con USB-C para usarla como webcam de alta calidad sin necesidad de capturadora. Disponible en Negro y Blanco. Compatible con accesorios Multi-Function Shoe como micrófonos DM-E1D.'
            }
        },
        {
            id: '8',
            moduleId: 5, // Lista en dos columnas
            data: {
                title: 'Especificaciones Destacadas',
                item1: 'Sensor APS-C 24,2 MP · DIGIC X · ISO 100–51.200',
                item2: 'Video 4K 30p (6K oversampling) · Full HD 120p',
                item3: 'Hasta 15 fps electrónico · AF/AE tracking',
                item4: 'EOS iTR AF X + Dual Pixel CMOS AF II',
                item5: 'Grabación vertical nativa · Marcador de aspecto',
                item6: 'Pantalla articulada 3" 1,62M puntos + EVF',
                item7: 'Live Streaming USB-C · Flash integrado GN6',
                item8: 'WiFi · Bluetooth · Peso 375 g · Negro o Blanco'
            }
        }
    ]
};

// EOS RP RF 24-105mm S - SKU: 16487747 - 8 bloques
export const eosRP = {
    sku: '16487747',
    blocks: [
        {
            id: '1',
            moduleId: 6, // Banner Grande y Texto (Header)
            data: {
                image: 'https://asia.canon/media/image/2026/01/16/8e793fa0a9ac488dbf0e791c8010475b_EOS+RP+w+RF24-105mm+F4-7.1+IS+STM+Front+Slant+Ori_362x320.png',
                altImage: 'Canon EOS RP con lente RF 24-105mm - La mirrorless full frame más ligera de Canon',
                title: 'EOS RP: Fotografía Full Frame Para Todos',
                description: 'Da el salto a la fotografía Full Frame con una de las cámaras mirrorless más ligeras de Canon. La EOS RP integra un sensor CMOS de 26,2 MP y un autoenfoque ultrarrápido de 0,05 segundos en un cuerpo compacto hecho para creadores en movimiento. Con Dual Pixel CMOS AF y Eye Detection AF, cada retrato queda perfectamente enfocado.'
            }
        },
        {
            id: '2',
            moduleId: 3, // Imagen izq + Texto der
            data: {
                image: 'https://asia.canon/media/image/2026/01/14/870cde46c4344796b8521c09a4e929e0_1_K433_FrontSlantDown_Body_362x320.png',
                altImage: 'Canon EOS RP sensor Full Frame 26.2 megapíxeles CMOS calidad profesional',
                title: 'Sensor Full Frame de 26,2 MP',
                description: 'El sensor Full Frame es 2,6 veces más grande que un sensor APS-C, lo que entrega una menor profundidad de campo y fondos desenfocados artísticamente (bokeh). La EOS RP captura cada detalle con 26,2 megapíxeles y un rango dinámico amplio, produciendo imágenes con una calidad que antes solo estaba al alcance de equipos profesionales de mayor tamaño.'
            }
        },
        {
            id: '3',
            moduleId: 4, // Texto izq + Imagen der
            data: {
                title: 'Dual Pixel CMOS AF: 0,05 s hasta EV -5',
                description: 'El Dual Pixel CMOS AF es el sistema de autoenfoque más rápido de Canon, alcanzando el foco en tan solo 0,05 segundos. Cubre aproximadamente el 100% vertical × 88% horizontal con 4.779 puntos de enfoque seleccionables. Enfoca con precisión incluso en oscuridad casi total hasta EV -5, donde el ojo humano apenas distingue formas.',
                image: 'https://asia.canon/media/image/2026/01/14/e71d01bf7aa64023a5c852887b961078_2_K433_FrontSlantLeft_Body_362x320.png',
                altImage: 'Canon EOS RP Dual Pixel CMOS AF velocidad 0.05 segundos autoenfoque'
            }
        },
        {
            id: '4',
            moduleId: 3, // Imagen izq + Texto der
            data: {
                image: 'https://asia.canon/media/image/2026/01/15/5391f2e343c84aec82ddd2f89aca1cf2_eosrp-prodes-feature-02.jpg',
                altImage: 'Canon EOS RP con montaje RF calidad óptica superior lentes profesionales',
                title: 'Montaje RF: Óptica de Nueva Generación',
                description: 'La montura RF de 54 mm de gran diámetro y la corta distancia de brida de 20 mm, combinadas con comunicación de datos de alta velocidad, liberan todo el potencial de los objetivos RF en un cuerpo compacto y ligero. Accede al ecosistema más avanzado de lentes full frame de Canon para fotografía y video de altísima calidad.'
            }
        },
        {
            id: '5',
            moduleId: 4, // Texto izq + Imagen der
            data: {
                title: 'Eye Detection AF en Fotos y Video',
                description: 'El Eye Detection AF rastrea y mantiene el enfoque en el ojo del sujeto durante cualquier movimiento, tanto en fotografías como en video 4K UHD. Ideal para retratos, bodas, sesiones de moda y cualquier situación donde necesites que los ojos queden perfectamente nítidos sin esfuerzo.',
                image: 'https://asia.canon/media/image/2026/01/14/a25d5248c811470a83eff491568c3773_3_K433_The+Front_Body_362x320.png',
                altImage: 'Canon EOS RP Eye Detection AF enfoque en ojos retratos automático'
            }
        },
        {
            id: '6',
            moduleId: 7, // Dos imágenes con texto
            data: {
                leftImage: 'https://asia.canon/media/image/2026/01/14/7ede278fc52a4733ba7d86f00b3e436f_8_K433_Back_Body_362x320.png',
                leftAlt: 'Canon EOS RP pantalla Vari-angle articulada touchscreen EVF integrado',
                leftTitle: 'Pantalla Vari-angle Táctil + EVF',
                leftText: 'Pantalla LCD articulada Vari-angle de 3" con 1,04M puntos para composición desde cualquier ángulo. EVF integrado de 0,39" con 2,36M puntos y punto de ojo de 22 mm para mayor comodidad.',
                rightImage: 'https://asia.canon/media/image/2026/01/14/0eab6ceb7c57470fa3aae6e5d5407cdb_6_K433_TOP_Body_362x320.png',
                rightAlt: 'Canon EOS RP diseño compacto ligero 440g cuerpo full frame',
                rightTitle: 'Full Frame Liviana: Solo 440 g',
                rightText: 'Con apenas 440 g, la EOS RP es una cámara Full Frame ideal para viajar y fotografiar todo el día sin cansancio. El Modo Silencioso permite disparar sin ningún sonido del obturador, perfecto para ceremonias, teatros y entornos sensibles al ruido.'
            }
        },
        {
            id: '7',
            moduleId: 3, // Imagen izq + Texto der
            data: {
                image: 'https://asia.canon/media/image/2026/01/14/3110a1929d314520b6c882bdb51467ba_4_K433_Right_Body_362x320.png',
                altImage: 'Canon EOS RP video 4K UHD conectividad WiFi Bluetooth USB',
                title: 'Video 4K UHD + Conectividad Completa',
                description: 'Captura video 4K UHD con la calidad óptica del sistema RF. Modos creativos accesibles gracias al Asistente Creativo integrado: aprende y experimenta mientras disparas. WiFi y Bluetooth para sincronización inmediata con smartphone vía Canon Camera Connect. USB para transferencia rápida de archivos.'
            }
        },
        {
            id: '8',
            moduleId: 8, // Video oficial Canon
            data: {
                youtubeCode: 'HU24kemhmms',
                title: 'Canon EOS RP: Full Frame Para Todos',
                description: 'Descubre por qué la EOS RP es la puerta de entrada perfecta a la fotografía Full Frame. Sensor de 26,2 MP, autoenfoque Dual Pixel a 0,05 s, Eye Detection AF y solo 440 g. El sistema RF de Canon en un cuerpo compacto e intuitivo.'
            }
        },
        {
            id: '9',
            moduleId: 5, // Lista en dos columnas
            data: {
                title: 'Especificaciones Destacadas',
                item1: 'Sensor Full Frame CMOS 26,2 MP',
                item2: 'Dual Pixel CMOS AF · 0,05 s · EV -5 · 4.779 puntos',
                item3: 'Eye Detection AF en fotos y video',
                item4: 'Video 4K UHD · Modo Silencioso',
                item5: 'Pantalla Vari-angle 3" 1,04M puntos touchscreen',
                item6: 'EVF integrado 0,39" 2,36M puntos',
                item7: 'Montura RF · Asistente Creativo',
                item8: 'WiFi · Bluetooth · USB · Peso 440 g'
            }
        }
    ]
};
