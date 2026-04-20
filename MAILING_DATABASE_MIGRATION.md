# Migración a Base de Datos Unificada - Mailing Maker

## 📋 Resumen

Se ha actualizado **Mailing Maker** para usar la misma base de datos que **Marcajes Maker** (`marcajes_products`), unificando toda la gestión de productos en una sola tabla.

---

## ⚙️ Paso 1: Ejecutar Script SQL

**IMPORTANTE**: Debes ejecutar el siguiente script SQL en Supabase antes de usar la app actualizada.

### Cómo ejecutar:

1. Ve a tu proyecto en [Supabase Dashboard](https://supabase.com/dashboard)
2. Navega a **SQL Editor** (en el menú lateral)
3. Abre el archivo: `scripts/sql/unify-product-tables.sql`
4. Copia todo el contenido
5. Pégalo en el SQL Editor de Supabase
6. Click en **Run** (Ejecutar)

### Qué hace el script:

- ✅ Agrega campos de mailing (`sku`, `category`, `subtitle`, `price_now`, etc.) a `marcajes_products`
- ✅ Migra todos los productos de `products` y `mailing_products` a `marcajes_products`
- ✅ Crea índices para búsquedas rápidas
- ✅ Configura triggers automáticos
- ✅ **NO elimina** las tablas viejas (por seguridad)

### Resultado esperado:

```
tabla               | total_productos | con_sku | con_precio | con_imagen
--------------------|-----------------|---------|------------|------------
marcajes_products   | XX              | XX      | XX         | XX
```

---

## 🎉 Cambios en Mailing Maker

### 1. Auto-Selección de Productos Mejorada

**Antes:**
- Debías crear productos manualmente uno por uno

**Ahora:**
- Pegas el listado de productos del cliente
- La app detecta automáticamente cuáles existen
- Te muestra los que NO existen
- Puedes crear los faltantes con un click

**Cómo usarlo:**

1. En la pestaña **Productos** del Mailing Maker
2. Click en **"Importar desde Texto"** (botón azul-morado)
3. Pega el listado del cliente (un producto por línea)
4. Click en **"Detectar Productos"**
5. Verás dos columnas:
   - **✅ Encontrados**: Se auto-seleccionarán para el mailing
   - **❌ No Encontrados**: Puedes crear cada uno con el botón `+`
6. Click en **"Seleccionar Encontrados"**

### 2. Base de Datos Compartida

**Beneficios:**
- ✅ Un solo lugar para gestionar todos los productos
- ✅ Crear un producto en Marcajes → aparece en Mailing Maker
- ✅ Crear un producto en Mailing Maker → aparece en Marcajes
- ✅ Búsqueda mejorada por nombre y SKU
- ✅ No más duplicados

### 3. Campos Adicionales

La tabla `marcajes_products` ahora incluye:

| Campo Original | Nuevos Campos Agregados |
|----------------|-------------------------|
| `name` | `sku` |
| `url` | `category` |
| | `subtitle` |
| | `price_before` |
| | `price_now` |
| | `discount_percentage` |
| | `image_url` |
| | `features` (array) |
| | `is_active` |

---

## 🔍 Detección Inteligente de Productos

El sistema ahora detecta productos por:

1. **Nombre exacto**: "EOS R6 Mark II" → ✅ Coincide
2. **SKU**: "6577C002" → ✅ Coincide
3. **Nombre parcial**: "R6 Mark II" → ✅ Encuentra "EOS R6 Mark II"
4. **Caso insensible**: "eos r6" → ✅ Encuentra "EOS R6"

---

## 📝 Ejemplo de Uso

### Listado del Cliente:
```
EOS R6 Mark II
EOS R50
RF 24-105mm f/4L IS USM
Speedlite 600EX II-RT
PowerShot V10
```

### Resultado:
**✅ Encontrados (4):**
- EOS R6 Mark II
- EOS R50
- RF 24-105mm f/4L IS USM
- Speedlite 600EX II-RT

**❌ No Encontrados (1):**
- PowerShot V10 → [+ Crear]

---

## 🚨 Solución de Problemas

### Error: "Cannot read properties of undefined"
**Causa**: No ejecutaste el script SQL
**Solución**: Ejecuta `scripts/sql/unify-product-tables.sql` en Supabase

### No se encuentran productos que sí existen
**Causa**: El nombre en el listado no coincide exactamente
**Solución**: 
- Verifica la ortografía
- Usa el SKU en vez del nombre
- Crea el producto manualmente si es un modelo nuevo

### Productos duplicados después de la migración
**Causa**: Existían en ambas tablas (`products` y `marcajes_products`)
**Solución**: El script hace `ON CONFLICT DO UPDATE`, combina automáticamente

---

## 🧹 Limpieza (Opcional)

Una vez verificado que todo funciona correctamente, puedes eliminar las tablas viejas:

```sql
-- ADVERTENCIA: Esto es irreversible
DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF EXISTS mailing_products CASCADE;
```

**Recomendación**: Espera al menos 1 semana antes de eliminar las tablas antiguas.

---

## 🎯 Flujo de Trabajo Recomendado

1. **Recibir listado del cliente** (email, Slack, etc.)
2. **Copiar la lista de productos**
3. **Ir a Mailing Maker → Productos → "Importar desde Texto"**
4. **Pegar y detectar**
5. **Auto-seleccionar los encontrados**
6. **Crear los faltantes** (si los hay)
7. **Continuar diseñando el mailing**

---

## 📞 Soporte

Si encuentras algún problema:
1. Verifica que ejecutaste el script SQL
2. Revisa los errores en la consola del navegador (F12)
3. Contacta al desarrollador con capturas de pantalla

---

Desarrollado por **javohv** para Atlas & Canon • 2026
