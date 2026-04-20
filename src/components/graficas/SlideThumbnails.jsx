/**
 * SlideThumbnails Component
 * Panel with draggable slide thumbnails for reordering
 * Supports cover slide styling and thematic group labels
 */
import React, { useState } from 'react';
import { Plus, Trash2, GripVertical, Star, PlusCircle } from 'lucide-react';

const SlideThumbnails = ({
    slides,
    activeSlideId,
    onSelectSlide,
    onAddSlide,
    onDeleteSlide,
    onReorderSlides,
    onInsertSlide // New: insert slide at specific position
}) => {
    const [draggedIndex, setDraggedIndex] = useState(null);
    const [dragOverIndex, setDragOverIndex] = useState(null);

    const handleDragStart = (e, index) => {
        if (slides[index]?.isCover) {
            e.preventDefault();
            return;
        }
        setDraggedIndex(index);
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/plain', index.toString());
    };

    const handleDragOver = (e, index) => {
        e.preventDefault();
        if (draggedIndex !== null && draggedIndex !== index && index !== 0) {
            setDragOverIndex(index);
        }
    };

    const handleDragLeave = () => {
        setDragOverIndex(null);
    };

    const handleDrop = (e, dropIndex) => {
        e.preventDefault();
        if (draggedIndex !== null && draggedIndex !== dropIndex && dropIndex !== 0) {
            onReorderSlides(draggedIndex, dropIndex);
        }
        setDraggedIndex(null);
        setDragOverIndex(null);
    };

    const handleDragEnd = () => {
        setDraggedIndex(null);
        setDragOverIndex(null);
    };

    return (
        <div className="w-52 bg-[#12121a] border-r border-white/10 flex flex-col h-full">
            {/* Header */}
            <div className="p-3 border-b border-white/10 flex items-center justify-between">
                <span className="text-white/60 text-xs font-medium tracking-wider uppercase">
                    Láminas
                </span>
                <button
                    onClick={onAddSlide}
                    className="p-1.5 rounded-lg bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 transition-colors"
                    title="Agregar lámina"
                >
                    <Plus size={14} />
                </button>
            </div>

            {/* Thumbnails list */}
            <div className="flex-1 overflow-y-auto p-2 space-y-1">
                {slides.map((slide, index) => (
                    <React.Fragment key={slide.id}>
                        {/* Insert button between slides (after cover) */}
                        {index > 0 && onInsertSlide && (
                            <button
                                onClick={() => onInsertSlide(index)}
                                className="w-full py-0.5 flex items-center justify-center opacity-0 hover:opacity-100 transition-all"
                                title="Insertar lámina aquí"
                            >
                                <div className="flex items-center gap-2 text-emerald-400 hover:text-emerald-300">
                                    <div className="h-px w-6 bg-emerald-400/50" />
                                    <PlusCircle size={14} />
                                    <div className="h-px w-6 bg-emerald-400/50" />
                                </div>
                            </button>
                        )}

                        {/* Thematic group label (first slide of new group) */}
                        {slide.isFirstOfGroup && slide.groupLabel && (
                            <div className="flex items-center gap-2 py-1 px-2">
                                <div className="h-px flex-1 bg-white/10" />
                                <span className="text-[9px] text-white/40 font-medium">
                                    {slide.groupLabel}
                                </span>
                                <div className="h-px flex-1 bg-white/10" />
                            </div>
                        )}

                        <div
                            draggable={!slide.isCover}
                            onDragStart={(e) => handleDragStart(e, index)}
                            onDragOver={(e) => handleDragOver(e, index)}
                            onDragLeave={handleDragLeave}
                            onDrop={(e) => handleDrop(e, index)}
                            onDragEnd={handleDragEnd}
                            onClick={() => onSelectSlide(slide.id)}
                            className={`
                                group relative rounded-lg overflow-hidden cursor-pointer transition-all
                                ${activeSlideId === slide.id
                                    ? 'ring-2 ring-blue-500 ring-offset-2 ring-offset-[#12121a]'
                                    : 'hover:ring-1 hover:ring-white/20'
                                }
                                ${dragOverIndex === index ? 'ring-2 ring-green-400 ring-offset-2 ring-offset-[#12121a]' : ''}
                                ${draggedIndex === index ? 'opacity-50' : ''}
                                ${slide.isCover ? 'ring-1 ring-purple-500/50' : ''}
                            `}
                        >
                            {/* Drag handle (not for cover) */}
                            {!slide.isCover && (
                                <div className="absolute left-0 top-0 bottom-0 w-5 bg-gradient-to-r from-black/40 to-transparent flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10">
                                    <GripVertical size={12} className="text-white/60" />
                                </div>
                            )}

                            {/* Thumbnail preview (16:9) */}
                            <div
                                className="relative"
                                style={{ paddingBottom: '56.25%' }}
                            >
                                <div
                                    className="absolute inset-0"
                                    style={{
                                        backgroundColor: slide.backgroundColor || '#ffffff',
                                        backgroundImage: slide.backgroundImage ? `url(${slide.backgroundImage})` : 'none',
                                        backgroundSize: 'cover',
                                        backgroundPosition: 'center'
                                    }}
                                >
                                    {/* Cover slide gradient overlay */}
                                    {slide.isCover && (
                                        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/60" />
                                    )}

                                    {/* Mini preview of elements */}
                                    {slide.elements.slice(0, 8).map(element => (
                                        <div
                                            key={element.id}
                                            className="absolute overflow-hidden"
                                            style={{
                                                left: `${element.x}%`,
                                                top: `${element.y}%`,
                                                width: `${element.width}%`,
                                                height: `${element.height}%`
                                            }}
                                        >
                                            {element.type === 'image' && (
                                                <img
                                                    src={element.content}
                                                    alt=""
                                                    className="w-full h-full object-contain"
                                                    style={{ filter: element.filter || 'none' }}
                                                />
                                            )}
                                            {element.type === 'text' && (
                                                <div
                                                    className="w-full h-full overflow-hidden flex items-center justify-center"
                                                    style={{
                                                        color: element.color || '#000',
                                                        fontSize: '3px',
                                                        fontWeight: element.bold ? 'bold' : 'normal',
                                                        textAlign: element.align || 'left'
                                                    }}
                                                >
                                                    {element.content}
                                                </div>
                                            )}
                                        </div>
                                    ))}

                                    {/* Empty state */}
                                    {!slide.isCover && slide.elements.length === 0 && (
                                        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                                            <span className="text-gray-400 text-[8px]">Vacía</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Slide label */}
                            <div className={`absolute bottom-1 left-1 text-[10px] px-1.5 py-0.5 rounded flex items-center gap-1 ${slide.isCover
                                ? 'bg-purple-500/80 text-white'
                                : 'bg-black/60 text-white'
                                }`}>
                                {slide.isCover && <Star size={8} />}
                                {slide.isCover ? 'Portada' : index + 1}
                            </div>

                            {/* Element count badge */}
                            {!slide.isCover && slide.elements.length > 0 && (
                                <div className="absolute bottom-1 right-1 bg-blue-500/80 text-white text-[9px] px-1.5 py-0.5 rounded">
                                    {slide.elements.length}
                                </div>
                            )}

                            {/* Delete button (not for cover, not if only 2 slides) */}
                            {!slide.isCover && slides.length > 2 && (
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onDeleteSlide(slide.id);
                                    }}
                                    className="absolute top-1 right-1 w-5 h-5 bg-red-500/80 rounded flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                                >
                                    <Trash2 size={10} />
                                </button>
                            )}
                        </div>
                    </React.Fragment>
                ))}
            </div>

            {/* Footer with count */}
            <div className="p-3 border-t border-white/10">
                <span className="text-white/40 text-xs">
                    {slides.length} lámina{slides.length !== 1 ? 's' : ''} (1 portada)
                </span>
            </div>
        </div>
    );
};

export default SlideThumbnails;
