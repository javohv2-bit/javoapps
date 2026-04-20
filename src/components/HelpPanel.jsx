import React, { useState } from 'react';
import { X, HelpCircle, BookOpen, FileSpreadsheet, Image, CheckCircle, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const HelpPanel = ({ isOpen, onClose }) => {
    const [activeTab, setActiveTab] = useState('intro');

    const tabs = [
        { id: 'intro', label: '¿Qué es un InPage?', icon: BookOpen },
        { id: 'workflow', label: 'Cómo usar esta App', icon: CheckCircle },
        { id: 'excel', label: 'El Excel de Falabella', icon: FileSpreadsheet },
        { id: 'images', label: 'Reglas de Imágenes', icon: Image },
    ];

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                    onClick={onClose}
                >
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                        className="bg-[#12121a] rounded-2xl shadow-2xl max-w-4xl w-full max-h-[85vh] overflow-hidden flex flex-col border border-white/10"
                        onClick={e => e.stopPropagation()}
                    >
                        {/* Header */}
                        <div className="p-6 border-b border-white/10 flex justify-between items-center bg-gradient-to-r from-blue-600 to-indigo-600">
                            <div className="flex items-center gap-3">
                                <HelpCircle size={28} />
                                <h2 className="text-2xl font-bold text-white">Centro de Ayuda</h2>
                            </div>
                            <button onClick={onClose} className="text-white/80 hover:text-white p-2 rounded-full hover:bg-white/10 cursor-pointer">
                                <X size={24} />
                            </button>
                        </div>

                        {/* Tabs */}
                        <div className="flex border-b border-white/10 bg-white/[0.02]">
                            {tabs.map(tab => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors cursor-pointer
                    ${activeTab === tab.id
                                            ? 'text-blue-400 border-b-2 border-blue-500 bg-white/[0.03]'
                                            : 'text-white/50 hover:text-white/70 hover:bg-white/[0.02]'
                                        }`}
                                >
                                    <tab.icon size={18} />
                                    {tab.label}
                                </button>
                            ))}
                        </div>

                        {/* Content */}
                        <div className="overflow-y-auto p-6 flex-1 bg-[#0a0a0f]">
                            {activeTab === 'intro' && <IntroContent />}
                            {activeTab === 'workflow' && <WorkflowContent />}
                            {activeTab === 'excel' && <ExcelContent />}
                            {activeTab === 'images' && <ImagesContent />}
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

const IntroContent = () => (
    <div className="prose prose-sm max-w-none prose-invert">
        <h2 className="text-xl font-bold text-white mb-4">¿Qué es un InPage?</h2>

        <p className="text-white/70 mb-4">
            Un <strong className="text-white">InPage</strong> es una página de contenido enriquecido que aparece en la ficha de producto
            de los marketplaces como <strong className="text-white">Falabella, Sodimac, y Hites</strong>. Es el contenido visual y descriptivo
            que ves debajo de las especificaciones técnicas de un producto.
        </p>

        <div className="bg-blue-500/10 border-l-4 border-blue-500 p-4 mb-4 rounded-r-lg">
            <h4 className="font-semibold text-blue-400 mb-2">Propósito del InPage</h4>
            <ul className="text-blue-300/80 text-sm list-disc list-inside">
                <li>Mostrar las características del producto de forma visual y atractiva</li>
                <li>Aumentar la conversión de ventas con contenido profesional</li>
                <li>Proporcionar información detallada que no cabe en las especificaciones</li>
                <li>Diferenciar el producto de la competencia</li>
            </ul>
        </div>

        <h3 className="text-lg font-semibold text-white mt-6 mb-3">Estructura de un InPage</h3>
        <p className="text-white/70 mb-3">
            Cada InPage puede contener hasta <strong className="text-white">10 bloques (módulos)</strong>. Cada módulo es un tipo
            diferente de contenido:
        </p>

        <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="bg-white/[0.03] p-3 rounded-lg border border-white/10">
                <span className="font-mono text-blue-400">Mod 1</span>
                <p className="text-sm text-white/50">Banner principal (1160x480)</p>
            </div>
            <div className="bg-white/[0.03] p-3 rounded-lg border border-white/10">
                <span className="font-mono text-blue-400">Mod 2</span>
                <p className="text-sm text-white/50">Texto en dos columnas</p>
            </div>
            <div className="bg-white/[0.03] p-3 rounded-lg border border-white/10">
                <span className="font-mono text-blue-400">Mod 3</span>
                <p className="text-sm text-white/50">Imagen + Texto (560x315)</p>
            </div>
            <div className="bg-white/[0.03] p-3 rounded-lg border border-white/10">
                <span className="font-mono text-blue-400">Mod 4</span>
                <p className="text-sm text-white/50">Texto + Imagen (560x315)</p>
            </div>
            <div className="bg-white/[0.03] p-3 rounded-lg border border-white/10">
                <span className="font-mono text-blue-400">Mod 5</span>
                <p className="text-sm text-white/50">Lista de 8 ítems</p>
            </div>
            <div className="bg-white/[0.03] p-3 rounded-lg border border-white/10">
                <span className="font-mono text-blue-400">Mod 6</span>
                <p className="text-sm text-white/50">Banner grande (1160x360)</p>
            </div>
            <div className="bg-white/[0.03] p-3 rounded-lg border border-white/10">
                <span className="font-mono text-blue-400">Mod 7</span>
                <p className="text-sm text-white/50">Dos imágenes lado a lado</p>
            </div>
            <div className="bg-white/[0.03] p-3 rounded-lg border border-white/10">
                <span className="font-mono text-blue-400">Mod 8</span>
                <p className="text-sm text-white/50">Video de YouTube</p>
            </div>
            <div className="bg-white/[0.03] p-3 rounded-lg col-span-2 border border-white/10">
                <span className="font-mono text-blue-400">Mod 9</span>
                <p className="text-sm text-white/50">Banner clickeable con enlace</p>
            </div>
        </div>
    </div>
);

const WorkflowContent = () => (
    <div className="prose prose-sm max-w-none prose-invert">
        <h2 className="text-xl font-bold text-white mb-4">Cómo crear un InPage con esta App</h2>

        <div className="space-y-6">
            <div className="flex gap-4">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0 shadow-lg shadow-blue-500/25">1</div>
                <div>
                    <h4 className="font-semibold text-white">Ingresa el SKU</h4>
                    <p className="text-white/60 text-sm">
                        En la barra superior, ingresa el SKU Padre del producto (ej: 6886486).
                        Este SKU se usará para nombrar las imágenes automáticamente.
                    </p>
                </div>
            </div>

            <div className="flex gap-4">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0 shadow-lg shadow-blue-500/25">2</div>
                <div>
                    <h4 className="font-semibold text-white">Agrega Módulos</h4>
                    <p className="text-white/60 text-sm">
                        Haz clic en "Agregar Módulo" y selecciona el tipo que necesitas.
                        Puedes agregar hasta 10 módulos por InPage.
                    </p>
                </div>
            </div>

            <div className="flex gap-4">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0 shadow-lg shadow-blue-500/25">3</div>
                <div>
                    <h4 className="font-semibold text-white">Completa los Campos</h4>
                    <p className="text-white/60 text-sm">
                        Cada módulo muestra los campos requeridos. Sube imágenes con las dimensiones exactas
                        y completa los textos. La app valida automáticamente el tamaño de las imágenes.
                    </p>
                </div>
            </div>

            <div className="flex gap-4">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0 shadow-lg shadow-blue-500/25">4</div>
                <div>
                    <h4 className="font-semibold text-white">Genera el Pack</h4>
                    <p className="text-white/60 text-sm">
                        Haz clic en "Generar Pack". La app descargará un ZIP conteniendo:
                    </p>
                    <ul className="list-disc list-inside text-sm text-white/60 mt-2">
                        <li>El archivo Excel listo para Falabella</li>
                        <li>Las imágenes renombradas (SKU-img_1.jpg, SKU-img_2.jpg...)</li>
                    </ul>
                </div>
            </div>

            <div className="flex gap-4">
                <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0 shadow-lg shadow-emerald-500/25">✓</div>
                <div>
                    <h4 className="font-semibold text-white">Envía a Falabella</h4>
                    <p className="text-white/60 text-sm">
                        Envía el Excel y la carpeta de imágenes a Falabella para que carguen el InPage
                        en la ficha del producto.
                    </p>
                </div>
            </div>
        </div>
    </div>
);

const ExcelContent = () => (
    <div className="prose prose-sm max-w-none prose-invert">
        <h2 className="text-xl font-bold text-white mb-4">El Excel "InPage Builder v8"</h2>

        <div className="bg-amber-500/10 border-l-4 border-amber-500 p-4 mb-4 rounded-r-lg">
            <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="text-amber-400" size={20} />
                <h4 className="font-semibold text-amber-400">Regla Importante</h4>
            </div>
            <p className="text-amber-300/80 text-sm">
                Según el manual de Falabella, <strong className="text-amber-300">SOLO se debe modificar la hoja "Formulario"</strong>.
                Las otras hojas contienen fórmulas que generan el código HTML automáticamente.
                ¡NO las modifiques manualmente!
            </p>
        </div>

        <h3 className="text-lg font-semibold text-white mt-6 mb-3">Estructura del Excel</h3>

        <div className="space-y-4">
            <div className="border border-white/10 rounded-lg p-4 bg-white/[0.03]">
                <h4 className="font-semibold text-blue-400 mb-2">📋 Hoja "Formulario"</h4>
                <p className="text-white/60 text-sm mb-2">
                    Esta es la <strong className="text-white">única hoja que debes llenar</strong>. Contiene:
                </p>
                <ul className="text-sm text-white/60 list-disc list-inside">
                    <li><strong className="text-white/80">Fila 1:</strong> Headers y lugar para el SKU Padre</li>
                    <li><strong className="text-white/80">Filas 4-13:</strong> Bloques 1 al 10 (un bloque por fila)</li>
                    <li><strong className="text-white/80">Columna B:</strong> Selector de tipo de módulo</li>
                    <li><strong className="text-white/80">Columnas D, F, H, J...:</strong> Campos de entrada (textos, nombres de imagen)</li>
                </ul>
            </div>

            <div className="border border-white/10 rounded-lg p-4 bg-white/[0.02]">
                <h4 className="font-semibold text-white/40 mb-2">🔒 Hoja "Data" (NO TOCAR)</h4>
                <p className="text-white/50 text-sm">
                    Contiene las plantillas HTML de cada módulo. Las fórmulas en "Formulario" leen esta hoja
                    para construir el código final. Modificarla rompería la generación.
                </p>
            </div>

            <div className="border border-white/10 rounded-lg p-4 bg-white/[0.02]">
                <h4 className="font-semibold text-white/40 mb-2">🔒 Hoja "Código" (NO TOCAR)</h4>
                <p className="text-white/50 text-sm">
                    Concatena el HTML de todos los bloques. El resultado final (celda B1) es el código
                    que Falabella copia y pega en su sistema.
                </p>
            </div>
        </div>

        <h3 className="text-lg font-semibold text-white mt-6 mb-3">¿Cómo funciona internamente?</h3>
        <p className="text-white/60 text-sm">
            Cuando seleccionas un módulo en la Columna B, las fórmulas de la Columna U leen la plantilla
            correspondiente de la hoja "Data" y la combinan con tus datos de las columnas D, F, H, etc.
            El resultado es código HTML que Falabella procesa para mostrar el InPage.
        </p>

        <div className="bg-blue-500/10 p-4 rounded-lg mt-4 border border-blue-500/20">
            <p className="text-blue-300 text-sm">
                <strong className="text-blue-400">Esta app hace todo esto automáticamente.</strong> Tú solo agregas módulos,
                subes imágenes y escribes textos. La app llena el Excel correctamente sin que tengas
                que preocuparte por las fórmulas.
            </p>
        </div>
    </div>
);

const ImagesContent = () => (
    <div className="prose prose-sm max-w-none prose-invert">
        <h2 className="text-xl font-bold text-white mb-4">Reglas de Imágenes para Falabella</h2>

        <h3 className="text-lg font-semibold text-white mb-3">Dimensiones Exactas</h3>
        <div className="bg-red-500/10 border-l-4 border-red-500 p-4 mb-4 rounded-r-lg">
            <p className="text-red-300 text-sm">
                <strong className="text-red-400">Las imágenes DEBEN ser exactamente del tamaño indicado.</strong>
                Falabella rechazará imágenes con dimensiones incorrectas.
            </p>
        </div>

        <table className="w-full text-sm border-collapse mb-6">
            <thead>
                <tr className="bg-white/[0.05]">
                    <th className="border border-white/10 p-2 text-left text-white/80">Módulo</th>
                    <th className="border border-white/10 p-2 text-left text-white/80">Ancho</th>
                    <th className="border border-white/10 p-2 text-left text-white/80">Alto</th>
                </tr>
            </thead>
            <tbody>
                <tr><td className="border border-white/10 p-2 text-white/60">Módulo 1 (Banner)</td><td className="border border-white/10 p-2 text-blue-400">1160px</td><td className="border border-white/10 p-2 text-blue-400">480px</td></tr>
                <tr><td className="border border-white/10 p-2 text-white/60">Módulo 3, 4, 7 (Imagen+Texto)</td><td className="border border-white/10 p-2 text-blue-400">560px</td><td className="border border-white/10 p-2 text-blue-400">315px</td></tr>
                <tr><td className="border border-white/10 p-2 text-white/60">Módulo 6 (Banner grande)</td><td className="border border-white/10 p-2 text-blue-400">1160px</td><td className="border border-white/10 p-2 text-blue-400">360px</td></tr>
                <tr><td className="border border-white/10 p-2 text-white/60">Módulo 9 (Clickeable)</td><td className="border border-white/10 p-2 text-blue-400">1160px</td><td className="border border-white/10 p-2 text-blue-400">480px</td></tr>
            </tbody>
        </table>

        <h3 className="text-lg font-semibold text-white mb-3">Convención de Nombres</h3>
        <p className="text-white/60 mb-3">
            Las imágenes deben nombrarse siguiendo este formato:
        </p>

        <div className="bg-[#0d1117] text-emerald-400 p-4 rounded-lg font-mono text-sm mb-4 border border-white/10">
            SKU-img_1.jpg<br />
            SKU-img_2.jpg<br />
            SKU-img_3.jpg<br />
            ...
        </div>

        <ul className="text-sm text-white/60 list-disc list-inside mb-4">
            <li>El <strong className="text-white">SKU</strong> es el SKU Padre del producto</li>
            <li>El número es <strong className="text-white">secuencial</strong> a través de TODO el InPage</li>
            <li>Formato: <strong className="text-white">JPG</strong> únicamente</li>
            <li>Resolución recomendada: <strong className="text-white">300 DPI</strong></li>
        </ul>

        <div className="bg-emerald-500/10 border-l-4 border-emerald-500 p-4 rounded-r-lg">
            <p className="text-emerald-300 text-sm">
                <strong className="text-emerald-400">¡Esta app lo hace automáticamente!</strong> Solo sube tus imágenes con las
                dimensiones correctas y la app se encarga de renombrarlas en el orden correcto.
            </p>
        </div>

        <h3 className="text-lg font-semibold text-white mt-6 mb-3">En el Excel</h3>
        <p className="text-white/60 text-sm">
            En el Excel, el nombre de la imagen se escribe <strong className="text-white">SIN la extensión .jpg</strong>.
            Ejemplo: en el Excel escribes <code className="bg-white/10 px-1.5 py-0.5 rounded text-blue-400">6886486-img_1</code>, pero el archivo real
            es <code className="bg-white/10 px-1.5 py-0.5 rounded text-blue-400">6886486-img_1.jpg</code>.
        </p>
    </div>
);

export default HelpPanel;
