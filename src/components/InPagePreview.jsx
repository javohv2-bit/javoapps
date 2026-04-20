import React, { useState, useEffect, useMemo } from 'react';
import { modules } from '../config/falabellaRules';
import { generateBlockHtml, falabellaCSS } from '../config/falabellaHtmlTemplates';
import { Image as ImageIcon } from 'lucide-react';

// Simple hash function for generating unique keys
const hashData = (data) => {
    const str = JSON.stringify(data);
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // Convert to 32bit integer
    }
    return hash.toString(36);
};

/**
 * InPagePreview - Renders an InPage preview using Falabella's EXACT HTML structure
 * 
 * This component generates the same HTML that Falabella's system will use,
 * ensuring WYSIWYG preview that matches production rendering.
 */

// Helper to handle image errors with retries
const handleImageError = (e) => {
    const img = e.target;
    const src = img.src;

    if (src.includes('/placeholder.svg')) return;

    if (src.endsWith('.jpg') && !img.dataset.triedUnderscore) {
        const underscoreMatch = src.match(/(.*)(img)(\d+)(\.jpg)$/i);
        if (underscoreMatch) {
            img.src = underscoreMatch[1] + 'img_' + underscoreMatch[3] + '.jpg';
            img.dataset.triedUnderscore = 'true';
            return;
        }
    }

    if (src.endsWith('.jpg') && !img.dataset.triedPng) {
        img.src = src.replace('.jpg', '.png');
        img.dataset.triedPng = 'true';
        return;
    }

    img.src = '/placeholder.svg';
    img.onerror = null;
};

/**
 * Single block renderer using Falabella HTML
 */
const FalabellaBlock = ({ block, blockIndex, imageMap, baseImagePath }) => {
    const moduleDef = modules.find(m => m.id === block.moduleId);
    const moduleName = moduleDef?.name || 'Modulo ' + block.moduleId;

    const resolveImageSrc = (value) => {
        if (!value) return '/placeholder.svg';
        
        // Handle File objects
        if (value instanceof File) {
            return URL.createObjectURL(value);
        }
        
        // Handle Blob objects
        if (value instanceof Blob) {
            return URL.createObjectURL(value);
        }
        
        // If not a string at this point, return placeholder
        if (typeof value !== 'string') {
            console.warn('resolveImageSrc: unexpected value type:', typeof value, value);
            return '/placeholder.svg';
        }
        
        // Check imageMap
        if (imageMap && imageMap[value]) {
            return imageMap[value];
        }
        
        // Already a full URL or absolute path
        if (value.startsWith('/') || value.startsWith('http')) {
            return value;
        }
        
        // Relative path with baseImagePath
        if (baseImagePath) {
            const cleanBase = baseImagePath.replace(/\/$/, '');
            let cleanName = value.replace(/^\//, '');
            if (!cleanName.match(/\.[0-9a-z]+$/i)) {
                cleanName += '.jpg';
            }
            return cleanBase + '/' + encodeURIComponent(cleanName);
        }
        
        return value;
    };

    const imageSources = {};
    // Manejar tanto 'image' como 'main_image' (Hites usa main_image)
    if (block.data.image || block.data.main_image) {
        imageSources.image = resolveImageSrc(block.data.image || block.data.main_image);
    }
    if (block.data.leftImage) {
        imageSources.leftImage = resolveImageSrc(block.data.leftImage);
    }
    if (block.data.rightImage) {
        imageSources.rightImage = resolveImageSrc(block.data.rightImage);
    }

    const blockHtml = generateBlockHtml(block.moduleId, block.data, imageSources);

    return (
        <div
            className="inpage-block mb-8 relative group"
            style={{
                border: '2px solid #e5e7eb',
                borderRadius: '12px',
                backgroundColor: '#f3f4f6',
                padding: '24px 12px 12px 12px',
                marginTop: '24px'
            }}
        >
            <div
                className="absolute -top-3 left-4 px-4 py-1.5 flex items-center gap-2 text-sm font-bold text-gray-700 bg-white rounded-full border border-gray-200 shadow-sm"
                style={{ zIndex: 10 }}
            >
                <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                <span className="text-gray-500 font-normal">Bloque {blockIndex + 1}:</span>
                <span className="text-gray-900">{moduleName}</span>
                {moduleDef?.imageWidth && moduleDef?.imageHeight && (
                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full flex items-center gap-1">
                        <ImageIcon size={10} />
                        {moduleDef.imageWidth}x{moduleDef.imageHeight}
                    </span>
                )}
            </div>

            <div 
                className="falabella-html-content relative"
                style={{ 
                    backgroundColor: 'white', 
                    borderRadius: '8px', 
                    overflow: 'hidden', 
                    boxShadow: '0 1px 3px rgba(0,0,0,0.1)' 
                }}
            >
                <div dangerouslySetInnerHTML={{ __html: blockHtml }} />
            </div>
        </div>
    );
};

/**
 * Main InPagePreview Component
 */
const InPagePreview = ({ sku, blocks, imageMap = {}, baseImagePath }) => {
    useEffect(() => {
        const container = document.querySelector('.inpage-preview');
        if (container) {
            const imgs = container.querySelectorAll('img');
            imgs.forEach(img => {
                img.onerror = handleImageError;
            });
        }
    }, [blocks]);

    if (!blocks || blocks.length === 0) {
        return (
            <div className="text-center py-20 text-gray-400">
                <p>No hay bloques para previsualizar</p>
            </div>
        );
    }

    const cssContent = falabellaCSS.replace('<style>', '').replace('</style>', '');

    return (
        <div className="inpage-preview bg-white" style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <style dangerouslySetInnerHTML={{ __html: cssContent }} />
            
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-100 px-4 py-3 mb-4 rounded-t-lg">
                <div className="flex items-center justify-between">
                    <div className="text-sm text-blue-800">
                        <span className="font-medium">Vista Previa HTML Falabella</span>
                        <span className="text-blue-500 ml-2">- {blocks.length} bloques</span>
                    </div>
                    <div className="text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded">
                        HTML identico al de produccion
                    </div>
                </div>
            </div>

            <div className="inpage-content fb-inpage-wrapper">
                {blocks.map((block, index) => (
                    <FalabellaBlock
                        key={`${block.id}-${hashData(block.data)}`}
                        block={block}
                        blockIndex={index}
                        imageMap={imageMap}
                        baseImagePath={baseImagePath}
                    />
                ))}
            </div>
        </div>
    );
};

export default InPagePreview;
