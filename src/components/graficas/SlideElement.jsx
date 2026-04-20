/**
 * SlideElement Component
 * Individual draggable/resizable element on the slide canvas
 */
import React, { useState, useRef, useEffect } from 'react';
import { X, Type, Move } from 'lucide-react';

const SlideElement = ({
    element,
    isSelected,
    onSelect,
    onUpdate,
    onDelete,
    containerRef
}) => {
    const elementRef = useRef(null);
    const [isDragging, setIsDragging] = useState(false);
    const [isResizing, setIsResizing] = useState(false);
    const [resizeHandle, setResizeHandle] = useState(null);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0, elemX: 0, elemY: 0 });
    const [isEditing, setIsEditing] = useState(false);

    // Handle mouse down for dragging
    const handleMouseDown = (e) => {
        if (isEditing) return;
        e.stopPropagation();
        onSelect(element.id);

        const container = containerRef.current;
        if (!container) return;

        const rect = container.getBoundingClientRect();
        setDragStart({
            x: e.clientX,
            y: e.clientY,
            elemX: element.x,
            elemY: element.y
        });
        setIsDragging(true);
    };

    // Handle resize start
    const handleResizeStart = (e, handle) => {
        e.stopPropagation();
        e.preventDefault();
        onSelect(element.id);

        const container = containerRef.current;
        if (!container) return;

        setDragStart({
            x: e.clientX,
            y: e.clientY,
            elemX: element.x,
            elemY: element.y,
            elemW: element.width,
            elemH: element.height
        });
        setResizeHandle(handle);
        setIsResizing(true);
    };

    // Mouse move handler
    useEffect(() => {
        if (!isDragging && !isResizing) return;

        const container = containerRef.current;
        if (!container) return;

        const rect = container.getBoundingClientRect();

        const handleMouseMove = (e) => {
            const deltaX = ((e.clientX - dragStart.x) / rect.width) * 100;
            const deltaY = ((e.clientY - dragStart.y) / rect.height) * 100;

            if (isDragging) {
                const newX = Math.max(0, Math.min(100 - element.width, dragStart.elemX + deltaX));
                const newY = Math.max(0, Math.min(100 - element.height, dragStart.elemY + deltaY));

                onUpdate(element.id, { x: newX, y: newY });
            } else if (isResizing) {
                let newX = element.x;
                let newY = element.y;
                let newW = element.width;
                let newH = element.height;

                // Handle different resize corners
                if (resizeHandle.includes('e')) {
                    newW = Math.max(5, Math.min(100 - dragStart.elemX, dragStart.elemW + deltaX));
                }
                if (resizeHandle.includes('w')) {
                    const wChange = Math.min(deltaX, dragStart.elemW - 5);
                    newX = Math.max(0, dragStart.elemX + wChange);
                    newW = dragStart.elemW - wChange;
                }
                if (resizeHandle.includes('s')) {
                    newH = Math.max(5, Math.min(100 - dragStart.elemY, dragStart.elemH + deltaY));
                }
                if (resizeHandle.includes('n')) {
                    const hChange = Math.min(deltaY, dragStart.elemH - 5);
                    newY = Math.max(0, dragStart.elemY + hChange);
                    newH = dragStart.elemH - hChange;
                }

                onUpdate(element.id, { x: newX, y: newY, width: newW, height: newH });
            }
        };

        const handleMouseUp = () => {
            setIsDragging(false);
            setIsResizing(false);
            setResizeHandle(null);
        };

        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseup', handleMouseUp);

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isDragging, isResizing, dragStart, element, onUpdate, resizeHandle, containerRef]);

    // Handle text editing
    const handleTextDoubleClick = (e) => {
        if (element.type === 'text') {
            e.stopPropagation();
            setIsEditing(true);
        }
    };

    const handleTextBlur = (e) => {
        setIsEditing(false);
        onUpdate(element.id, { content: e.target.innerText });
    };

    const handleTextKeyDown = (e) => {
        if (e.key === 'Escape') {
            setIsEditing(false);
            e.target.blur();
        }
    };

    // Resize handles
    const handles = ['nw', 'ne', 'sw', 'se'];
    const handlePositions = {
        nw: { top: -4, left: -4, cursor: 'nwse-resize' },
        ne: { top: -4, right: -4, cursor: 'nesw-resize' },
        sw: { bottom: -4, left: -4, cursor: 'nesw-resize' },
        se: { bottom: -4, right: -4, cursor: 'nwse-resize' }
    };

    return (
        <div
            ref={elementRef}
            className={`absolute group transition-shadow ${isSelected ? 'ring-2 ring-blue-500 ring-offset-1' : ''}`}
            style={{
                left: `${element.x}%`,
                top: `${element.y}%`,
                width: `${element.width}%`,
                height: `${element.height}%`,
                zIndex: element.zIndex + (isSelected ? 100 : 0),
                cursor: isDragging ? 'grabbing' : 'grab'
            }}
            onMouseDown={handleMouseDown}
            onDoubleClick={handleTextDoubleClick}
        >
            {/* Content */}
            <div className="w-full h-full overflow-hidden rounded-sm">
                {element.type === 'image' && (
                    <img
                        src={element.content}
                        alt=""
                        className="w-full h-full object-contain pointer-events-none"
                        style={{ filter: element.filter || 'none' }}
                        draggable={false}
                    />
                )}

                {element.type === 'video' && (
                    <div className="relative w-full h-full bg-gray-900">
                        <img
                            src={element.thumbnail || element.content}
                            alt=""
                            className="w-full h-full object-contain pointer-events-none"
                            style={{ filter: element.filter || 'none' }}
                            draggable={false}
                        />
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-12 h-12 bg-black/60 rounded-full flex items-center justify-center">
                                <div className="w-0 h-0 border-t-[8px] border-t-transparent border-l-[14px] border-l-white border-b-[8px] border-b-transparent ml-1" />
                            </div>
                        </div>
                    </div>
                )}

                {element.type === 'text' && (
                    <div
                        contentEditable={isEditing}
                        suppressContentEditableWarning
                        onBlur={handleTextBlur}
                        onKeyDown={handleTextKeyDown}
                        className={`w-full h-full p-2 text-sm overflow-hidden ${isEditing
                            ? 'outline-none bg-white/90 cursor-text'
                            : 'cursor-grab'
                            }`}
                        style={{
                            fontSize: element.fontSize || 16,
                            fontFamily: element.fontFamily || 'Arial',
                            color: element.color || '#000000',
                            fontWeight: element.bold ? 'bold' : 'normal',
                            fontStyle: element.italic ? 'italic' : 'normal',
                            textAlign: element.align || 'left'
                        }}
                    >
                        {element.content || 'Click para editar'}
                    </div>
                )}
            </div>

            {/* Selection overlay and controls */}
            {isSelected && (
                <>
                    {/* Delete button */}
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onDelete(element.id);
                        }}
                        className="absolute -top-3 -right-3 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white hover:bg-red-600 transition-colors shadow-lg z-10"
                    >
                        <X size={12} />
                    </button>

                    {/* Resize handles */}
                    {handles.map(handle => (
                        <div
                            key={handle}
                            className="absolute w-3 h-3 bg-blue-500 border border-white rounded-sm z-10"
                            style={{
                                ...handlePositions[handle],
                                cursor: handlePositions[handle].cursor
                            }}
                            onMouseDown={(e) => handleResizeStart(e, handle)}
                        />
                    ))}

                    {/* Drag indicator */}
                    <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-blue-500 text-white text-[10px] px-1.5 py-0.5 rounded flex items-center gap-1">
                        <Move size={10} />
                        {Math.round(element.width)}% × {Math.round(element.height)}%
                    </div>
                </>
            )}
        </div>
    );
};

export default SlideElement;
