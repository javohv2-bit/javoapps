-- ============================================================================
-- AGREGAR COLUMNAS DE MAILING A marcajes_products
-- ============================================================================
-- Tabla actual marcajes_products tiene: id, name, url, created_at, updated_at
-- (129 productos)
-- 
-- Agregamos las columnas necesarias para Mailing Maker:
-- sku, category, subtitle, features, price_before, price_now, 
-- discount_percentage, image_url, is_active
-- ============================================================================

-- PASO 1: Agregar nuevas columnas a marcajes_products
-- ============================================================================

ALTER TABLE marcajes_products
ADD COLUMN IF NOT EXISTS sku TEXT,
ADD COLUMN IF NOT EXISTS category TEXT DEFAULT 'cameras',
ADD COLUMN IF NOT EXISTS subtitle TEXT,
ADD COLUMN IF NOT EXISTS features TEXT[],
ADD COLUMN IF NOT EXISTS price_before INTEGER,
ADD COLUMN IF NOT EXISTS price_now INTEGER,
ADD COLUMN IF NOT EXISTS discount_percentage INTEGER,
ADD COLUMN IF NOT EXISTS image_url TEXT,
ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;

-- PASO 2: Crear índices para mejor performance
-- ============================================================================

CREATE INDEX IF NOT EXISTS idx_marcajes_products_sku ON marcajes_products(sku);
CREATE INDEX IF NOT EXISTS idx_marcajes_products_category ON marcajes_products(category);

-- PASO 3: Agregar trigger para actualizar updated_at automáticamente
-- ============================================================================

CREATE OR REPLACE FUNCTION update_marcajes_products_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE 'plpgsql';

DROP TRIGGER IF EXISTS update_marcajes_products_timestamp ON marcajes_products;

CREATE TRIGGER update_marcajes_products_timestamp
    BEFORE UPDATE ON marcajes_products
    FOR EACH ROW EXECUTE FUNCTION update_marcajes_products_updated_at();

-- PASO 4: Verificar estructura final
-- ============================================================================

SELECT 
    'marcajes_products' AS tabla,
    COUNT(*) AS total_productos
FROM marcajes_products;

-- ============================================================================
-- ESTRUCTURA FINAL DE marcajes_products:
-- ============================================================================
-- id            - Identificador único (existente)
-- name          - Nombre del producto (existente)
-- url           - URL para marcajes UTM (existente)
-- created_at    - Fecha de creación (existente)
-- updated_at    - Fecha de actualización (existente)
-- sku           - Código SKU (NUEVO)
-- category      - Categoría: cameras, lenses, accessories, etc. (NUEVO)
-- subtitle      - Subtítulo o variante del producto (NUEVO)
-- features      - Array de características (NUEVO)
-- price_before  - Precio anterior (NUEVO)
-- price_now     - Precio actual (NUEVO)
-- discount_percentage - Porcentaje de descuento (NUEVO)
-- image_url     - URL de imagen para mailings (NUEVO)
-- is_active     - Si el producto está activo (NUEVO)
-- ============================================================================
