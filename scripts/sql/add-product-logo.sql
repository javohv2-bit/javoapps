-- ============================================================================
-- AGREGAR CAMPO DE LOGO A marcajes_products
-- ============================================================================
-- logo_url: URL del logo del producto (reemplaza el nombre en el mailing)
-- ============================================================================

ALTER TABLE marcajes_products
ADD COLUMN IF NOT EXISTS logo_url TEXT;

-- Verificar
SELECT 
    'marcajes_products' AS tabla,
    COUNT(*) AS total_productos
FROM marcajes_products;

-- ============================================================================
-- NUEVA COLUMNA:
-- logo_url - URL del logo del producto (opcional, reemplaza el nombre)
-- 
-- NOTA: Los colores (texto, precios, subtítulo) son configuración global
-- del mailing, no de cada producto individual
-- ============================================================================
