-- ============================================================================
-- AGREGAR TIPO 'product_background' A mailing_assets
-- ============================================================================
-- El tipo 'product_background' no estaba en el CHECK constraint original
-- ============================================================================

-- Eliminar el constraint existente
ALTER TABLE mailing_assets DROP CONSTRAINT IF EXISTS mailing_assets_type_check;

-- Agregar el nuevo constraint con 'product_background'
ALTER TABLE mailing_assets 
ADD CONSTRAINT mailing_assets_type_check 
CHECK (type IN ('header', 'banner', 'offer_banner', 'text_module', 'disclaimer', 'social_bar', 'product_background'));

-- Verificar
SELECT DISTINCT type FROM mailing_assets;
