import React, { useEffect } from 'react';
import { modules } from '../config/falabellaRules';
import FormInput from './FormInput';
import ImageUploader from './ImageUploader';
import { Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';

const BlockEditor = ({ block, index, onUpdate, onRemove }) => {
    const moduleDef = modules.find(m => m.id === block.moduleId);

    if (!moduleDef) return <div className="text-red-500">Módulo desconocido</div>;

    const handleChange = (field, value) => {
        onUpdate(block.id, { ...block.data, [field]: value });
    };

    // Initialize fields if empty
    useEffect(() => {
        const initialData = {};
        let hasChanges = false;
        moduleDef.fields.forEach(field => {
            if (block.data[field] === undefined) {
                initialData[field] = '';
                hasChanges = true;
            }
        });
        if (hasChanges) {
            onUpdate(block.id, { ...block.data, ...initialData });
        }
    }, [moduleDef.id, block.id]);

    // Label mapping for all field types
    const labelMap = {
        // Common fields
        title: 'Título',
        description: 'Texto / Descripción',
        url: 'URL Destino',

        // Image fields
        image: 'Imagen',
        altImage: 'Texto Alternativo (Alt)',
        leftImage: 'Imagen Izquierda',
        leftAlt: 'Alt Izquierda',
        rightImage: 'Imagen Derecha',
        rightAlt: 'Alt Derecha',

        // Two columns text
        col1Text: 'Texto Columna 1',
        col2Text: 'Texto Columna 2',

        // Left/right text
        leftTitle: 'Título Izquierda',
        leftText: 'Texto Izquierda',
        rightTitle: 'Título Derecha',
        rightText: 'Texto Derecha',

        // Video
        youtubeCode: 'Código YouTube (solo el ID)',

        // List items
        item1: 'Ítem 1',
        item2: 'Ítem 2',
        item3: 'Ítem 3',
        item4: 'Ítem 4',
        item5: 'Ítem 5',
        item6: 'Ítem 6',
        item7: 'Ítem 7',
        item8: 'Ítem 8',
    };

    const renderField = (field) => {
        // Image uploaders
        if (['image', 'leftImage', 'rightImage'].includes(field)) {
            const label = labelMap[field] || field;
            const currentImage = block.data[field] || null;
            
            return (
                <div key={field} className="mb-4">
                    <label className="block text-sm font-medium text-white/70 mb-2">{label}</label>
                    <ImageUploader
                        requiredWidth={moduleDef.imageWidth}
                        requiredHeight={moduleDef.imageHeight}
                        currentImage={currentImage}
                        onImageChange={(file) => handleChange(field, file)}
                    />
                </div>
            );
        }

        // Multiline fields
        const isMultiline = ['description', 'col1Text', 'col2Text', 'leftText', 'rightText'].includes(field);

        return (
            <FormInput
                key={field}
                label={labelMap[field] || field}
                value={block.data[field] || ''}
                onChange={(e) => handleChange(field, e.target.value)}
                multiline={isMultiline}
                placeholder={field === 'youtubeCode' ? 'ej: dQw4w9WgXcQ' : undefined}
            />
        );
    };

    return (
        <motion.div
            layout
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white/[0.03] backdrop-blur-sm rounded-xl p-6 mb-6 border border-white/10 relative group"
        >
            <div className="flex justify-between items-center mb-4 pb-2 border-b border-white/10">
                <div>
                    <h3 className="font-bold text-lg text-white">
                        <span className="text-blue-400 font-mono mr-2">#{index + 1}</span>
                        {moduleDef.name}
                    </h3>
                    {moduleDef.imageWidth && (
                        <span className="text-xs text-white/40">
                            Imagen: {moduleDef.imageWidth}x{moduleDef.imageHeight}px
                        </span>
                    )}
                </div>
                <button
                    onClick={() => onRemove(block.id)}
                    className="text-white/30 hover:text-red-400 transition-colors p-2 rounded-full hover:bg-red-500/10 cursor-pointer"
                    title="Eliminar bloque"
                >
                    <Trash2 size={20} />
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {moduleDef.fields.map(field => (
                    <div key={field} className={
                        ['image', 'leftImage', 'rightImage', 'description', 'col1Text', 'col2Text', 'leftText', 'rightText'].includes(field)
                            ? 'md:col-span-2'
                            : ''
                    }>
                        {renderField(field)}
                    </div>
                ))}
            </div>
        </motion.div>
    );
};

export default BlockEditor;
