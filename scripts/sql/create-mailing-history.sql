-- ============================================================================
-- TABLA DE HISTORIAL DE MAILINGS
-- ============================================================================
-- Guarda los mailings generados con todos sus datos para poder editarlos
-- y regenerarlos posteriormente
-- ============================================================================

-- PASO 1: Crear tabla de historial
-- ============================================================================

CREATE TABLE IF NOT EXISTS mailing_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Metadata del mailing
    name TEXT NOT NULL,                          -- Nombre identificador del mailing
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Assets seleccionados (guardamos IDs para referencia)
    header_asset_id UUID,
    banner_asset_id UUID,
    offer_banner_asset_id UUID,
    product_background_asset_id UUID,
    
    -- URLs de assets (por si se eliminan los assets, conservamos las URLs)
    header_image_url TEXT,
    banner_image_url TEXT,
    offer_banner_image_url TEXT,
    product_background_image_url TEXT,
    
    -- Productos seleccionados (array de IDs)
    product_ids TEXT[],
    
    -- Snapshot de productos al momento de crear (para conservar precios/info)
    products_snapshot JSONB,
    
    -- Contenido de texto
    text_content TEXT,
    disclaimer_text TEXT,
    
    -- Redes sociales habilitadas
    social_networks JSONB DEFAULT '{"facebook": true, "instagram": true, "youtube": true, "twitter": true}'::jsonb,
    
    -- HTML generado
    generated_html TEXT,
    
    -- Estado
    status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'sent', 'archived'))
);

-- PASO 2: Crear índices
-- ============================================================================

CREATE INDEX IF NOT EXISTS idx_mailing_history_created_at ON mailing_history(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_mailing_history_status ON mailing_history(status);
CREATE INDEX IF NOT EXISTS idx_mailing_history_name ON mailing_history(name);

-- PASO 3: Trigger para updated_at
-- ============================================================================

CREATE OR REPLACE FUNCTION update_mailing_history_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE 'plpgsql';

DROP TRIGGER IF EXISTS update_mailing_history_timestamp ON mailing_history;

CREATE TRIGGER update_mailing_history_timestamp
    BEFORE UPDATE ON mailing_history
    FOR EACH ROW EXECUTE FUNCTION update_mailing_history_updated_at();

-- PASO 4: Verificar creación
-- ============================================================================

SELECT 
    'mailing_history' AS tabla,
    COUNT(*) AS total_registros
FROM mailing_history;

-- ============================================================================
-- ESTRUCTURA FINAL DE mailing_history:
-- ============================================================================
-- id                           - Identificador único
-- name                         - Nombre del mailing
-- created_at                   - Fecha de creación
-- updated_at                   - Última modificación
-- header_asset_id              - ID del asset header
-- banner_asset_id              - ID del asset banner
-- offer_banner_asset_id        - ID del asset oferta
-- product_background_asset_id  - ID del fondo de productos
-- header_image_url             - URL del header (backup)
-- banner_image_url             - URL del banner (backup)
-- offer_banner_image_url       - URL del banner oferta (backup)
-- product_background_image_url - URL del fondo productos (backup)
-- product_ids                  - Array de IDs de productos
-- products_snapshot            - Snapshot JSON de productos (precios, etc)
-- text_content                 - Texto promocional
-- disclaimer_text              - Texto legal
-- social_networks              - Redes sociales habilitadas
-- generated_html               - HTML completo generado
-- status                       - Estado: draft, sent, archived
-- ============================================================================
