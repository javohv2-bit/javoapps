-- Mailing Maker Database Schema
-- Run this in Supabase SQL Editor

-- 1. Products table for mailing catalog
CREATE TABLE IF NOT EXISTS mailing_products (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    model_code TEXT,
    subtitle TEXT,
    features TEXT[],
    price_before INTEGER,
    price_now INTEGER,
    discount_percentage INTEGER,
    image_url TEXT,
    category TEXT DEFAULT 'cameras',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Assets table (headers, banners, disclaimers)
CREATE TABLE IF NOT EXISTS mailing_assets (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('header', 'banner', 'offer_banner', 'text_module', 'disclaimer', 'social_bar')),
    image_url TEXT,
    content TEXT,
    width INTEGER DEFAULT 1200,
    height INTEGER,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Templates table (saved mailings)
CREATE TABLE IF NOT EXISTS mailing_templates (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    header_asset_id INTEGER REFERENCES mailing_assets(id),
    banner_asset_id INTEGER REFERENCES mailing_assets(id),
    text_module_content TEXT,
    background_image_url TEXT,
    products TEXT[],
    offer_banner_asset_id INTEGER REFERENCES mailing_assets(id),
    disclaimer_text TEXT,
    social_networks JSONB DEFAULT '{"facebook": true, "instagram": true, "youtube": true, "twitter": true}',
    html_output TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS (Row Level Security)
ALTER TABLE mailing_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE mailing_assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE mailing_templates ENABLE ROW LEVEL SECURITY;

-- Allow all operations for authenticated users (adjust as needed)
CREATE POLICY "Allow all for mailing_products" ON mailing_products FOR ALL USING (true);
CREATE POLICY "Allow all for mailing_assets" ON mailing_assets FOR ALL USING (true);
CREATE POLICY "Allow all for mailing_templates" ON mailing_templates FOR ALL USING (true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_mailing_products_category ON mailing_products(category);
CREATE INDEX IF NOT EXISTS idx_mailing_assets_type ON mailing_assets(type);

-- Update trigger for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_mailing_products_updated_at
    BEFORE UPDATE ON mailing_products
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_mailing_templates_updated_at
    BEFORE UPDATE ON mailing_templates
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
