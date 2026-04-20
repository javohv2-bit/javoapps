import React from 'react';
import { modules } from '../config/falabellaRules';
import { motion } from 'framer-motion';

const ModuleSelector = ({ onSelect }) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
            {modules.map((module) => (
                <motion.div
                    key={module.id}
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    className="bg-white/[0.03] backdrop-blur-sm rounded-xl p-6 cursor-pointer border border-white/10 hover:border-blue-500/50 hover:bg-white/[0.06] transition-all group"
                    onClick={() => onSelect(module)}
                >
                    <div className="flex items-center justify-between mb-4">
                        <span className="text-2xl font-bold text-blue-400 group-hover:text-blue-300 transition-colors">{module.id}</span>
                        {module.imageWidth && (
                            <span className="text-xs font-mono bg-white/10 text-white/50 px-2 py-1 rounded-lg border border-white/10">
                                {module.imageWidth}x{module.imageHeight}
                            </span>
                        )}
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-2">{module.name}</h3>
                    <p className="text-sm text-white/40">{module.description}</p>
                </motion.div>
            ))}
        </div>
    );
};

export default ModuleSelector;
