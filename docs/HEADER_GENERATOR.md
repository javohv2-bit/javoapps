# Generador de Headers para Mailings

## Descripción
El **Header Generator** es una herramienta integrada en el Mailing Maker que permite generar headers personalizados de forma automática sin necesidad de diseñar en herramientas externas como Photoshop o Figma.

## Características

### Dimensiones
- **Ancho**: 1200px
- **Alto**: 106px
- Formato: PNG de alta calidad

### Elementos Configurables

#### 1. Color de Fondo
- **Colores predefinidos**:
  - Rojo Canon (#E4002B) - Color corporativo por defecto
  - Negro (#000000)
  - Gris Oscuro (#2D2D2D)
  - Azul Oscuro (#1E3A8A)
  - Verde Oscuro (#065F46)
  - Morado (#6B21A8)
- **Selector de color personalizado**: Permite elegir cualquier color mediante un color picker

#### 2. Logo de Canon
- **Mostrar/Ocultar**: Toggle para activar o desactivar el logo
- **Posiciones disponibles**:
  - Izquierda (por defecto)
  - Centro
  - Derecha
- **Tamaño ajustable**: Control deslizante de 50% a 150% del tamaño original
- **Color del logo**: Selector de color con opciones predefinidas:
  - Rojo Canon (por defecto)
  - Blanco
  - Negro
  - Gris
  - Color personalizado mediante selector
- **Logo utilizado**: `/assets/logo-rojo.png`

#### 3. Información de Envío Gratis
- **Mostrar/Ocultar**: Toggle para activar o desactivar esta sección
- **Icono de paquete/envío**: Diseño moderno y profesional con:
  - Caja/paquete isométrico
  - Líneas de velocidad para indicar rapidez
  - Marca de verificación (envío garantizado)
  - **Mostrar/Ocultar icono**: Toggle independiente
  - **Posición**: A la derecha del texto
- **Texto personalizable**: Por defecto muestra:
  ```
  Envío gratis a todo Chile
  por compras sobre $100.000
  ```
- **Color del texto e icono**: Selector de color con opciones predefinidas:
  - Blanco (por defecto)
  - Negro
  - Rojo Canon
  - Gris
  - Color personalizado mediante selector
- **Soporte multilínea**: Usa saltos de línea (`\n`) para texto de múltiples líneas
- **Posición**: Alineado a la derecha del header

## Cómo Usar

### Acceso
1. Navega a **Mailing Maker** desde el menú principal
2. Ve a la pestaña **Assets**
3. En la sección **Headers**, haz clic en el botón **"Generar"** (icono de varita mágica)

### Configuración
1. **Personaliza el color de fondo**:
   - Selecciona uno de los colores predefinidos
   - O elige un color personalizado con el color picker

2. **Configura el logo**:
   - Activa/desactiva la visualización del logo
   - Elige la posición (izquierda, centro, derecha)
   - Ajusta el tamaño con el slider
   - **Personaliza el color del logo** según el fondo elegido

3. **Configura la información de envío**:
   - Activa/desactiva esta sección
   - Edita el texto según sea necesario
   - Usa saltos de línea para formatear el mensaje
   - **Activa/desactiva el icono de envío**
   - **Personaliza el color del texto e icono** para contraste óptimo

4. **Vista previa en tiempo real**:
   - Todos los cambios se reflejan instantáneamente en el canvas
   - Revisa cómo quedará el header antes de generarlo

5. **Generar y guardar**:
   - Haz clic en **"Generar Header"**
   - El header se subirá automáticamente a tu biblioteca de assets
   - Se seleccionará automáticamente para usar en tu mailing

## Ventajas

### Ahorro de Tiempo
- ✅ Sin necesidad de abrir herramientas de diseño externas
- ✅ Generación instantánea con vista previa en tiempo real
- ✅ Configuración visual e intuitiva

### Consistencia de Marca
- ✅ Usa el logo oficial de Canon
- ✅ Mantiene las dimensiones correctas (1200x106px)
- ✅ Colores corporativos predefinidos
- ✅ **Adaptación automática de colores** para fondos claros y oscuros

### Flexibilidad
- ✅ Múltiples opciones de personalización
- ✅ **Control total sobre colores** (logo, fondo, texto, icono)
- ✅ Adaptable a diferentes campañas y temporadas
- ✅ Fácil de modificar y regenerar
- ✅ **Icono moderno y profesional** de envío

### Integración
- ✅ Se integra perfectamente con el sistema de assets
- ✅ Selección automática después de generar
- ✅ Almacenamiento en Supabase

## Casos de Uso

### Campaña Estándar
- Fondo: Rojo Canon
- Logo: Izquierda
- Envío gratis: Activado con mensaje estándar

### Black Friday / Cyber Monday
- Fondo: Negro
- Logo: Centro
- Envío gratis: Texto personalizado con oferta especial

### Campaña Específica de Producto
- Fondo: Color según categoría del producto
- Logo: Derecha o sin logo
- Envío gratis: Mensaje personalizado o desactivado

## Especificaciones Técnicas

### Archivo de Salida
- **Formato**: PNG
- **Calidad**: Alta resolución
- **Nombre**: `header-{timestamp}.png`
- **Almacenamiento**: Supabase Storage en carpeta `headers/`

### Componente
- **Ubicación**: `/src/components/mailing/HeaderGenerator.jsx`
- **Tecnologías**: React, Canvas API, Framer Motion
- **Dependencias**: lucide-react para iconos

### Assets Requeridos
- Logo Canon: `/public/assets/logo-rojo.png`

## Referencia Visual

El header generado incluye:
- Logo de Canon (configurable en posición, tamaño y **color**)
- Icono moderno de paquete/envío con diseño profesional (a la derecha del texto)
- Texto de envío gratis personalizable
- **Colores adaptables** para texto e icono según el fondo
- Fondo de color personalizable

El icono de envío incluye:
- Caja/paquete en vista isométrica
- Líneas de velocidad para indicar rapidez
- Marca de verificación (garantía de envío)
- Diseño limpio y profesional

## Futuras Mejoras Potenciales

- [x] Cambiar color del logo
- [x] Cambiar color del texto de envío
- [x] Toggle para mostrar/ocultar icono de envío
- [x] Icono moderno de envío (paquete en vez de camión)
- [x] Icono a la derecha del texto
- [ ] Agregar más iconos además del paquete (regalo, descuento, etc.)
- [ ] Permitir cargar logos personalizados
- [ ] Añadir efectos y gradientes
- [ ] Templates predefinidos por temporada
- [ ] Exportar directamente sin guardar en assets
- [ ] Agregar texto adicional personalizable en otras posiciones
- [ ] Soporte para diferentes dimensiones

## Soporte

Para dudas o mejoras, consulta la documentación principal del Mailing Maker o contacta al equipo de desarrollo.
