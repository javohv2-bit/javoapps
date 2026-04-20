import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Truck, X, Download, Palette, AlignLeft, AlignCenter, AlignRight } from 'lucide-react';

/**
 * HeaderGenerator Component
 * Genera headers personalizables de 1200x106px para mailings
 * Con logo de Canon y mensaje de envío gratis
 */
const HeaderGenerator = ({ onGenerate, onCancel }) => {
    const canvasRef = useRef(null);
    const [config, setConfig] = useState({
        backgroundColor: '#E4002B', // Rojo Canon
        logoPosition: 'left', // 'left', 'center', 'right'
        logoColor: '#E4002B', // Color del logo
        showLogo: true,
        showShipping: true,
        showShippingIcon: true,
        shippingColor: '#FFFFFF', // Color del texto e icono de envío
        shippingText: 'Envío gratis a todo Chile\npor compras sobre $100.000',
        logoScale: 1.0, // Escala del logo
    });

    const [logoImage, setLogoImage] = useState(null);

    // Cargar el logo de Canon
    useEffect(() => {
        const img = new Image();
        img.src = '/assets/logo-rojo.png';
        img.onload = () => setLogoImage(img);
    }, []);

    // Función para dibujar un icono moderno de envío gratis
    const drawShippingIcon = (ctx, x, y, size, color) => {
        ctx.save();
        ctx.strokeStyle = color;
        ctx.fillStyle = color;
        ctx.lineWidth = 2.2;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';

        const s = size / 32;

        // Caja/paquete principal
        ctx.beginPath();
        ctx.moveTo(x + 8 * s, y + 10 * s);
        ctx.lineTo(x + 16 * s, y + 6 * s);
        ctx.lineTo(x + 24 * s, y + 10 * s);
        ctx.lineTo(x + 24 * s, y + 22 * s);
        ctx.lineTo(x + 16 * s, y + 26 * s);
        ctx.lineTo(x + 8 * s, y + 22 * s);
        ctx.closePath();
        ctx.stroke();

        // Línea central de la caja
        ctx.beginPath();
        ctx.moveTo(x + 16 * s, y + 6 * s);
        ctx.lineTo(x + 16 * s, y + 26 * s);
        ctx.stroke();

        // Línea horizontal de la caja
        ctx.beginPath();
        ctx.moveTo(x + 8 * s, y + 10 * s);
        ctx.lineTo(x + 16 * s, y + 14 * s);
        ctx.lineTo(x + 24 * s, y + 10 * s);
        ctx.stroke();

        // Símbolo de velocidad/envío rápido (líneas de movimiento)
        ctx.lineWidth = 2;
        const speedLines = [
            { x1: x + 2 * s, y1: y + 8 * s, x2: x + 6 * s, y2: y + 8 * s },
            { x1: x + 1 * s, y1: y + 12 * s, x2: x + 6 * s, y2: y + 12 * s },
            { x1: x + 2 * s, y1: y + 16 * s, x2: x + 6 * s, y2: y + 16 * s },
        ];

        speedLines.forEach(line => {
            ctx.beginPath();
            ctx.moveTo(line.x1, line.y1);
            ctx.lineTo(line.x2, line.y2);
            ctx.stroke();
        });

        // Marca de verificación (envío gratis garantizado)
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.moveTo(x + 12 * s, y + 18 * s);
        ctx.lineTo(x + 14 * s, y + 20 * s);
        ctx.lineTo(x + 20 * s, y + 14 * s);
        ctx.stroke();

        ctx.restore();
    };

    const generateCanvas = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        const width = 1200;
        const height = 106;

        canvas.width = width;
        canvas.height = height;

        // Fondo
        ctx.fillStyle = config.backgroundColor;
        ctx.fillRect(0, 0, width, height);

        // Logo Canon con color personalizado
        if (config.showLogo && logoImage) {
            const logoMaxHeight = height * 0.6; // 60% de la altura
            const logoScale = (logoMaxHeight / logoImage.height) * config.logoScale;
            const logoWidth = logoImage.width * logoScale;
            const logoHeight = logoImage.height * logoScale;
            
            let logoX;
            const logoY = (height - logoHeight) / 2;

            switch (config.logoPosition) {
                case 'left':
                    logoX = 40;
                    break;
                case 'center':
                    logoX = (width - logoWidth) / 2;
                    break;
                case 'right':
                    logoX = width - logoWidth - 40;
                    break;
                default:
                    logoX = 40;
            }

            // Aplicar tinte de color al logo
            if (config.logoColor !== '#E4002B') {
                // Crear un canvas temporal para aplicar el tinte
                const tempCanvas = document.createElement('canvas');
                tempCanvas.width = logoWidth;
                tempCanvas.height = logoHeight;
                const tempCtx = tempCanvas.getContext('2d');
                
                // Dibujar logo en canvas temporal
                tempCtx.drawImage(logoImage, 0, 0, logoWidth, logoHeight);
                
                // Aplicar tinte de color
                tempCtx.globalCompositeOperation = 'source-atop';
                tempCtx.fillStyle = config.logoColor;
                tempCtx.fillRect(0, 0, logoWidth, logoHeight);
                
                // Dibujar el logo teñido en el canvas principal
                ctx.drawImage(tempCanvas, logoX, logoY);
            } else {
                ctx.drawImage(logoImage, logoX, logoY, logoWidth, logoHeight);
            }
        }

        // Sección de envío gratis (derecha)
        if (config.showShipping) {
            const paddingRight = 50;
            
            // Texto de envío
            ctx.fillStyle = config.shippingColor;
            ctx.font = 'bold 15px -apple-system, BlinkMacSystemFont, "Segoe UI", Arial, sans-serif';
            ctx.textAlign = 'right';
            
            const lines = config.shippingText.split('\n');
            const lineHeight = 19;
            const shippingY = height / 2;
            const startY = shippingY - ((lines.length - 1) * lineHeight) / 2;

            // Calcular ancho del texto para posicionar el icono
            let maxTextWidth = 0;
            lines.forEach((line) => {
                const textWidth = ctx.measureText(line).width;
                if (textWidth > maxTextWidth) maxTextWidth = textWidth;
            });

            const textX = width - paddingRight;
            
            // Dibujar texto
            lines.forEach((line, index) => {
                ctx.fillText(line, textX, startY + (index * lineHeight));
            });

            // Dibujar el icono de envío a la derecha del texto
            if (config.showShippingIcon) {
                const iconSize = 32;
                const iconX = textX + 15; // A la derecha del texto
                const iconY = shippingY - iconSize / 2;
                drawShippingIcon(ctx, iconX, iconY, iconSize, config.shippingColor);
            }
        }
    };

    // Generar el canvas cuando cambie la configuración
    useEffect(() => {
        if (logoImage && canvasRef.current) {
            generateCanvas();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [config, logoImage]);

    const handleGenerateImage = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        // Convertir canvas a blob
        canvas.toBlob((blob) => {
            const timestamp = Date.now();
            const file = new File([blob], `header-${timestamp}.png`, { type: 'image/png' });
            const url = canvas.toDataURL('image/png');
            
            onGenerate({
                file,
                url,
                config,
                name: `Header Canon ${new Date().toLocaleDateString()}`
            });
        }, 'image/png');
    };

    const predefinedColors = [
        { name: 'Rojo Canon', color: '#E4002B' },
        { name: 'Negro', color: '#000000' },
        { name: 'Gris Oscuro', color: '#2D2D2D' },
        { name: 'Azul Oscuro', color: '#1E3A8A' },
        { name: 'Verde Oscuro', color: '#065F46' },
        { name: 'Morado', color: '#6B21A8' },
    ];

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-6"
            onClick={onCancel}
        >
            <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl border border-white/10 p-8 max-w-5xl w-full max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex justify-between items-start mb-6">
                    <div>
                        <h2 className="text-2xl font-bold text-white mb-2">
                            Generador de Headers
                        </h2>
                        <p className="text-white/60 text-sm">
                            Personaliza tu header de 1200x106px para el mailing
                        </p>
                    </div>
                    <button
                        onClick={onCancel}
                        className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                    >
                        <X size={24} className="text-white/60" />
                    </button>
                </div>

                {/* Canvas Preview */}
                <div className="bg-white/5 border border-white/10 rounded-xl p-6 mb-6">
                    <h3 className="text-white font-semibold mb-4">Vista Previa</h3>
                    <div className="bg-white/10 rounded-lg p-4 flex items-center justify-center">
                        <canvas
                            ref={canvasRef}
                            className="max-w-full h-auto border border-white/20 rounded"
                            style={{ imageRendering: 'crisp-edges' }}
                        />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-6 mb-6">
                    {/* Color Picker */}
                    <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                        <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                            <Palette size={20} />
                            Color de Fondo
                        </h3>
                        
                        {/* Color predefinidos */}
                        <div className="grid grid-cols-3 gap-2 mb-4">
                            {predefinedColors.map(({ name, color }) => (
                                <button
                                    key={color}
                                    onClick={() => setConfig({ ...config, backgroundColor: color })}
                                    className={`h-12 rounded-lg border-2 transition-all ${
                                        config.backgroundColor === color
                                            ? 'border-white ring-2 ring-white/30'
                                            : 'border-white/20 hover:border-white/40'
                                    }`}
                                    style={{ backgroundColor: color }}
                                    title={name}
                                />
                            ))}
                        </div>

                        {/* Custom color picker */}
                        <div className="space-y-2">
                            <label className="text-white/70 text-sm">Color personalizado</label>
                            <input
                                type="color"
                                value={config.backgroundColor}
                                onChange={(e) => setConfig({ ...config, backgroundColor: e.target.value })}
                                className="w-full h-12 rounded-lg cursor-pointer bg-white/5 border border-white/10"
                            />
                        </div>
                    </div>

                    {/* Logo Configuration */}
                    <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                        <h3 className="text-white font-semibold mb-4">Configuración del Logo</h3>
                        
                        {/* Toggle Logo */}
                        <label className="flex items-center justify-between mb-4 cursor-pointer">
                            <span className="text-white/70 text-sm">Mostrar Logo Canon</span>
                            <input
                                type="checkbox"
                                checked={config.showLogo}
                                onChange={(e) => setConfig({ ...config, showLogo: e.target.checked })}
                                className="w-5 h-5 rounded accent-emerald-500"
                            />
                        </label>

                        {/* Logo Position */}
                        {config.showLogo && (
                            <>
                                <div className="mb-4">
                                    <label className="text-white/70 text-sm mb-2 block">Posición</label>
                                    <div className="grid grid-cols-3 gap-2">
                                        <button
                                            onClick={() => setConfig({ ...config, logoPosition: 'left' })}
                                            className={`py-2 px-3 rounded-lg border transition-all ${
                                                config.logoPosition === 'left'
                                                    ? 'bg-emerald-500 border-emerald-500 text-white'
                                                    : 'bg-white/5 border-white/10 text-white/70 hover:bg-white/10'
                                            }`}
                                        >
                                            <AlignLeft size={16} className="mx-auto" />
                                        </button>
                                        <button
                                            onClick={() => setConfig({ ...config, logoPosition: 'center' })}
                                            className={`py-2 px-3 rounded-lg border transition-all ${
                                                config.logoPosition === 'center'
                                                    ? 'bg-emerald-500 border-emerald-500 text-white'
                                                    : 'bg-white/5 border-white/10 text-white/70 hover:bg-white/10'
                                            }`}
                                        >
                                            <AlignCenter size={16} className="mx-auto" />
                                        </button>
                                        <button
                                            onClick={() => setConfig({ ...config, logoPosition: 'right' })}
                                            className={`py-2 px-3 rounded-lg border transition-all ${
                                                config.logoPosition === 'right'
                                                    ? 'bg-emerald-500 border-emerald-500 text-white'
                                                    : 'bg-white/5 border-white/10 text-white/70 hover:bg-white/10'
                                            }`}
                                        >
                                            <AlignRight size={16} className="mx-auto" />
                                        </button>
                                    </div>
                                </div>

                                {/* Logo Scale */}
                                <div className="mb-4">
                                    <label className="text-white/70 text-sm mb-2 block">
                                        Tamaño del Logo: {Math.round(config.logoScale * 100)}%
                                    </label>
                                    <input
                                        type="range"
                                        min="0.5"
                                        max="1.5"
                                        step="0.1"
                                        value={config.logoScale}
                                        onChange={(e) => setConfig({ ...config, logoScale: parseFloat(e.target.value) })}
                                        className="w-full accent-emerald-500"
                                    />
                                </div>

                                {/* Logo Color */}
                                <div>
                                    <label className="text-white/70 text-sm mb-2 block">Color del Logo</label>
                                    <div className="grid grid-cols-4 gap-2 mb-3">
                                        {[
                                            { name: 'Rojo', color: '#E4002B' },
                                            { name: 'Blanco', color: '#FFFFFF' },
                                            { name: 'Negro', color: '#000000' },
                                            { name: 'Gris', color: '#6B7280' }
                                        ].map(({ name, color }) => (
                                            <button
                                                key={color}
                                                onClick={() => setConfig({ ...config, logoColor: color })}
                                                className={`h-10 rounded-lg border-2 transition-all ${
                                                    config.logoColor === color
                                                        ? 'border-emerald-500 ring-2 ring-emerald-500/30'
                                                        : 'border-white/20 hover:border-white/40'
                                                }`}
                                                style={{ backgroundColor: color }}
                                                title={name}
                                            />
                                        ))}
                                    </div>
                                    <input
                                        type="color"
                                        value={config.logoColor}
                                        onChange={(e) => setConfig({ ...config, logoColor: e.target.value })}
                                        className="w-full h-10 rounded-lg cursor-pointer bg-white/5 border border-white/10"
                                    />
                                </div>
                            </>
                        )}
                    </div>
                </div>

                {/* Shipping Configuration */}
                <div className="bg-white/5 border border-white/10 rounded-xl p-6 mb-6">
                    <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                        <Truck size={20} />
                        Información de Envío
                    </h3>
                    
                    <label className="flex items-center justify-between mb-4 cursor-pointer">
                        <span className="text-white/70 text-sm">Mostrar información de envío</span>
                        <input
                            type="checkbox"
                            checked={config.showShipping}
                            onChange={(e) => setConfig({ ...config, showShipping: e.target.checked })}
                            className="w-5 h-5 rounded accent-emerald-500"
                        />
                    </label>

                    {config.showShipping && (
                        <div className="space-y-4">
                            {/* Texto de envío */}
                            <div>
                                <label className="text-white/70 text-sm mb-2 block">Texto personalizado</label>
                                <textarea
                                    value={config.shippingText}
                                    onChange={(e) => setConfig({ ...config, shippingText: e.target.value })}
                                    rows={3}
                                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/30 resize-none focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                    placeholder="Línea 1&#10;Línea 2"
                                />
                                <p className="text-white/40 text-xs mt-2">
                                    Usa saltos de línea para texto de múltiples líneas
                                </p>
                            </div>

                            {/* Toggle para mostrar icono */}
                            <label className="flex items-center justify-between cursor-pointer">
                                <span className="text-white/70 text-sm">Mostrar icono de envío</span>
                                <input
                                    type="checkbox"
                                    checked={config.showShippingIcon}
                                    onChange={(e) => setConfig({ ...config, showShippingIcon: e.target.checked })}
                                    className="w-5 h-5 rounded accent-emerald-500"
                                />
                            </label>

                            {/* Color del texto e icono */}
                            <div>
                                <label className="text-white/70 text-sm mb-2 block">Color del texto e icono</label>
                                <div className="grid grid-cols-4 gap-2 mb-3">
                                    {[
                                        { name: 'Blanco', color: '#FFFFFF' },
                                        { name: 'Negro', color: '#000000' },
                                        { name: 'Rojo', color: '#E4002B' },
                                        { name: 'Gris', color: '#6B7280' }
                                    ].map(({ name, color }) => (
                                        <button
                                            key={color}
                                            onClick={() => setConfig({ ...config, shippingColor: color })}
                                            className={`h-10 rounded-lg border-2 transition-all ${
                                                config.shippingColor === color
                                                    ? 'border-emerald-500 ring-2 ring-emerald-500/30'
                                                    : 'border-white/20 hover:border-white/40'
                                            }`}
                                            style={{ backgroundColor: color }}
                                            title={name}
                                        />
                                    ))}
                                </div>
                                <input
                                    type="color"
                                    value={config.shippingColor}
                                    onChange={(e) => setConfig({ ...config, shippingColor: e.target.value })}
                                    className="w-full h-10 rounded-lg cursor-pointer bg-white/5 border border-white/10"
                                />
                            </div>
                        </div>
                    )}
                </div>

                {/* Actions */}
                <div className="flex justify-end gap-3">
                    <button
                        onClick={onCancel}
                        className="px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-white transition-colors"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={handleGenerateImage}
                        className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 rounded-lg text-white font-medium flex items-center gap-2 transition-all"
                    >
                        <Download size={20} />
                        Generar Header
                    </button>
                </div>
            </motion.div>
        </motion.div>
    );
};

export default HeaderGenerator;
