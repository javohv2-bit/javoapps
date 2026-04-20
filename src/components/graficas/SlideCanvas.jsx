/**
 * SlideCanvas Component
 * Main editing canvas for the current slide with 16:9 aspect ratio
 * Supports background images for cover slides
 */
import React, { useRef } from 'react';
import SlideElement from './SlideElement';

const SlideCanvas = ({
    slide,
    selectedElementId,
    onSelectElement,
    onUpdateElement,
    onDeleteElement,
    onCanvasClick
}) => {
    const containerRef = useRef(null);

    const handleCanvasClick = (e) => {
        // Deselect when clicking on empty canvas
        if (e.target === e.currentTarget || e.target.classList.contains('slide-canvas-bg')) {
            onCanvasClick?.();
        }
    };

    return (
        <div className="relative w-full" style={{ paddingBottom: '56.25%' /* 16:9 */ }}>
            <div
                ref={containerRef}
                className="absolute inset-0 shadow-2xl rounded-lg overflow-hidden slide-canvas-bg"
                style={{
                    backgroundColor: slide?.backgroundColor || '#ffffff',
                    backgroundImage: slide?.backgroundImage ? `url(${slide.backgroundImage})` : 'none',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                }}
                onClick={handleCanvasClick}
            >
                {/* Grid guides (only for non-cover slides) */}
                {!slide?.isCover && (
                    <>
                        <div
                            className="absolute inset-0 pointer-events-none opacity-10"
                            style={{
                                backgroundImage: `
                                    linear-gradient(to right, #94a3b8 1px, transparent 1px),
                                    linear-gradient(to bottom, #94a3b8 1px, transparent 1px)
                                `,
                                backgroundSize: '10% 10%'
                            }}
                        />
                        {/* Center guides */}
                        <div className="absolute inset-0 pointer-events-none">
                            <div className="absolute left-1/2 top-0 bottom-0 w-px bg-blue-400/20" />
                            <div className="absolute top-1/2 left-0 right-0 h-px bg-blue-400/20" />
                        </div>
                    </>
                )}

                {/* Cover slide overlay gradient */}
                {slide?.isCover && (
                    <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/60 pointer-events-none" />
                )}

                {/* Slide elements */}
                {slide?.elements.map(element => (
                    <SlideElement
                        key={element.id}
                        element={element}
                        isSelected={selectedElementId === element.id}
                        onSelect={onSelectElement}
                        onUpdate={onUpdateElement}
                        onDelete={onDeleteElement}
                        containerRef={containerRef}
                        isStatic={element.isStatic}
                        isCoverSlide={slide?.isCover}
                    />
                ))}

                {/* Empty state (only for non-cover slides) */}
                {!slide?.isCover && (!slide?.elements || slide.elements.length === 0) && (
                    <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                        <div className="text-center">
                            <p className="text-lg font-medium">Lámina vacía</p>
                            <p className="text-sm">Arrastra elementos aquí o agrega texto</p>
                        </div>
                    </div>
                )}

                {/* Logo watermarks for content slides */}
                {!slide?.isCover && (
                    <>
                        {/* Canon logo - top left */}
                        <img
                            src="/assets/logo-rojo.png"
                            alt="Canon"
                            className="absolute top-3 left-3 h-3 w-auto opacity-60 pointer-events-none"
                        />
                        {/* Atlas logo - bottom right */}
                        <img
                            src="/assets/logoatlas.png"
                            alt="Atlas"
                            className="absolute bottom-3 right-3 h-4 w-auto opacity-40 pointer-events-none"
                        />
                    </>
                )}
            </div>

            {/* Slide indicator */}
            <div className={`absolute bottom-2 right-2 text-xs px-2 py-1 rounded ${slide?.isCover
                ? 'bg-purple-500/80 text-white'
                : 'bg-black/50 text-white'
                }`}>
                {slide?.isCover ? '📋 Portada' : `Lámina ${slide?.number || 1}`}
            </div>
        </div>
    );
};

export default SlideCanvas;
