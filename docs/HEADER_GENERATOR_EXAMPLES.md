# Ejemplos de Configuración - Header Generator

## Ejemplo 1: Header Estándar Canon
```javascript
{
  backgroundColor: '#E4002B',  // Rojo Canon
  logoPosition: 'left',
  logoColor: '#E4002B',        // Rojo original del logo
  showLogo: true,
  showShipping: true,
  showShippingIcon: true,
  shippingColor: '#FFFFFF',    // Blanco para contraste
  shippingText: 'Envío gratis a todo Chile\npor compras sobre $100.000',
  logoScale: 1.0
}
```
**Resultado**: Logo Canon a la izquierda en rojo, fondo rojo corporativo, mensaje de envío gratis en blanco a la derecha con icono.

---

## Ejemplo 2: Black Friday
```javascript
{
  backgroundColor: '#000000',  // Negro
  logoPosition: 'center',
  logoColor: '#FFFFFF',        // Logo blanco para contraste
  showLogo: true,
  showShipping: true,
  showShippingIcon: true,
  shippingColor: '#FFFFFF',    // Texto blanco
  shippingText: '¡BLACK FRIDAY!\nEnvío gratis en todas tus compras',
  logoScale: 1.2
}
```
**Resultado**: Logo Canon centrado en blanco y más grande, fondo negro, mensaje personalizado de Black Friday en blanco.

---

## Ejemplo 3: Fondo Blanco (Minimalista)
```javascript
{
  backgroundColor: '#FFFFFF',  // Blanco
  logoPosition: 'left',
  logoColor: '#E4002B',        // Logo rojo para contraste
  showLogo: true,
  showShipping: true,
  showShippingIcon: true,
  shippingColor: '#000000',    // ⚡ Texto NEGRO para que se vea
  shippingText: 'Envío gratis a todo Chile\npor compras sobre $100.000',
  logoScale: 0.9
}
```
**Resultado**: Fondo blanco limpio, logo rojo, **texto e icono en negro** para legibilidad perfecta.

---

## Ejemplo 4: Campaña Minimalista Sin Icono
```javascript
{
  backgroundColor: '#2D2D2D',  // Gris Oscuro
  logoPosition: 'left',
  logoColor: '#FFFFFF',        // Logo blanco
  showLogo: true,
  showShipping: true,
  showShippingIcon: false,     // ⚡ Sin icono
  shippingColor: '#FFFFFF',
  shippingText: 'Envío gratis',
  logoScale: 0.8
}
```
**Resultado**: Logo pequeño en blanco, solo texto de envío sin icono, estilo minimalista y profesional.

---

## Ejemplo 5: Enfoque en Promoción
```javascript
{
  backgroundColor: '#1E3A8A',  // Azul Oscuro
  logoPosition: 'right',
  logoColor: '#FFFFFF',        // Logo blanco
  showLogo: true,
  showShipping: true,
  showShippingIcon: true,
  shippingColor: '#FFFFFF',
  shippingText: 'CYBER MONDAY\nEnvío express gratis',
  logoScale: 0.9
}
```
**Resultado**: Logo blanco a la derecha, fondo azul, mensaje de Cyber Monday destacado en blanco.

---

## Ejemplo 6: Campaña de Primavera
```javascript
{
  backgroundColor: '#065F46',  // Verde Oscuro
  logoPosition: 'left',
  logoColor: '#FFFFFF',        // Logo blanco
  showLogo: true,
  showShipping: true,
  showShippingIcon: true,
  shippingColor: '#FFFFFF',
  shippingText: 'Primavera Canon\nEnvío gratis desde $80.000',
  logoScale: 1.0
}
```
**Resultado**: Fondo verde, logo blanco, promoción de primavera con umbral de envío diferente.

---

## Ejemplo 7: Solo Branding
```javascript
{
  backgroundColor: '#E4002B',  // Rojo Canon
  logoPosition: 'center',
  logoColor: '#E4002B',        // Rojo original
  showLogo: true,
  showShipping: false,         // Sin información de envío
  logoScale: 1.3
}
```
**Resultado**: Máximo enfoque en el logo Canon, centrado y grande, sin distracciones.

---

## Ejemplo 8: Estilo Corporativo Gris
```javascript
{
  backgroundColor: '#F3F4F6',  // Gris muy claro
  logoPosition: 'left',
  logoColor: '#374151',        // Gris oscuro
  showLogo: true,
  showShipping: true,
  showShippingIcon: false,     // Sin icono para estilo limpio
  shippingColor: '#374151',    // Gris oscuro
  shippingText: 'Envío gratis en compras sobre $100.000',
  logoScale: 1.0
}
```
**Resultado**: Estilo corporativo profesional con tonos grises, perfecto para comunicación B2B.

---

## Guía de Colores Corporativos Canon

### Colores Principales
- **Rojo Canon**: `#E4002B` - Color corporativo principal
- **Negro Canon**: `#000000` - Para campañas elegantes
- **Gris Canon**: `#2D2D2D` - Para estilo profesional

### Colores para Campañas Especiales
- **Azul Profesional**: `#1E3A8A` - Tecnología y profesionalismo
- **Verde Naturaleza**: `#065F46` - Fotografía de naturaleza
- **Morado Premium**: `#6B21A8` - Productos premium o especiales

---

## Tips de Diseño

### Contraste de Colores ⚡ IMPORTANTE
- **Fondos claros** (blanco, gris claro): Usa texto e icono **negro** o gris oscuro
- **Fondos oscuros** (negro, gris oscuro, azul, verde): Usa texto e icono **blanco**
- **Fondo rojo Canon**: Logo rojo + texto blanco funciona perfecto
- **Regla general**: Asegura siempre buen contraste para legibilidad

### Texto de Envío
- **Máximo 2 líneas**: Para mantener la legibilidad
- **Formato recomendado**: 
  - Línea 1: Mensaje principal o promoción
  - Línea 2: Condiciones o detalles
- **Con icono**: El icono aparece a la derecha del texto
- **Sin icono**: Para diseños más limpios y minimalistas

### Posición del Logo
- **Izquierda**: Estándar, tradicional
- **Centro**: Para máximo impacto de marca
- **Derecha**: Para balancear con texto a la izquierda (si se agrega en el futuro)

### Tamaño del Logo
- **0.8-0.9**: Diseños minimalistas o con mucho contenido
- **1.0**: Tamaño estándar recomendado
- **1.1-1.5**: Para enfatizar la marca

### Color del Logo
- **Rojo Canon (#E4002B)**: Color original, ideal para fondos claros
- **Blanco (#FFFFFF)**: Para fondos oscuros (negro, azul, verde, gris oscuro)
- **Negro (#000000)**: Para fondos muy claros o blancos
- **Personalizado**: Adapta a la paleta de tu campaña

### Combinaciones Efectivas

#### Alta Visibilidad (Fondos Oscuros)
- Fondo: Negro o gris oscuro
- Logo: Blanco (tamaño 1.2-1.3)
- Texto e icono: Blanco
- Resultado: Máximo contraste y profesionalismo

#### Profesional (Rojo Canon)
- Fondo: Rojo Canon (#E4002B)
- Logo: Rojo original (tamaño 1.0)
- Texto e icono: Blanco
- Resultado: Clásico y reconocible

#### Limpio y Moderno (Fondos Claros)
- Fondo: Blanco o gris muy claro
- Logo: Rojo Canon o gris oscuro (tamaño 0.8-1.0)
- Texto e icono: Negro o gris oscuro
- Icono: Opcional (sin icono para máxima limpieza)
- Resultado: Elegante y contemporáneo
