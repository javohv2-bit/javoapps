/**
 * SlideEditor Component
 * Main editor interface with cover page, multi-element slides, and element transfer
 */
import React, { useState, useCallback, useRef, useEffect } from 'react';
import SlideCanvas from './SlideCanvas';
import SlideThumbnails from './SlideThumbnails';
import { Type, Palette, Download, ArrowLeft, Plus, Minus, Calendar, ChevronDown, Undo2, Redo2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { generatePptx } from '../../utils/pptxGenerator';

// Generate unique ID
const generateId = () => Date.now().toString(36) + Math.random().toString(36).substr(2);

// Month names in Spanish
const MONTHS = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
];

const clampPercent = (value, min, max) => Math.max(min, Math.min(max, Number.isFinite(value) ? value : min));
const normalizeElementRect = (rect) => {
    const width = clampPercent(Number(rect.width) || 0.5, 0.5, 100);
    const height = clampPercent(Number(rect.height) || 0.5, 0.5, 100);
    const x = clampPercent(Number(rect.x) || 0, 0, 100 - width);
    const y = clampPercent(Number(rect.y) || 0, 0, 100 - height);
    return {
        x: Number(x.toFixed(4)),
        y: Number(y.toFixed(4)),
        width: Number(width.toFixed(4)),
        height: Number(height.toFixed(4))
    };
};

// Get previous month as default
const getPreviousMonth = () => {
    const now = new Date();
    const prevMonth = now.getMonth() === 0 ? 11 : now.getMonth() - 1;
    const year = now.getMonth() === 0 ? now.getFullYear() - 1 : now.getFullYear();
    return { month: prevMonth, year };
};

// Create cover slide
const createCoverSlide = (month, year) => ({
    id: 'cover-slide',
    number: 1,
    isCover: true,
    backgroundColor: '#0a0a0f',
    backgroundImage: '/assets/backgroundapp.jpg',
    month,
    year,
    elements: [
        {
            // Canon logo - top left (white version)
            id: 'cover-logo-canon',
            type: 'image',
            x: 3,
            y: 3,
            width: 12,
            height: 5,
            content: '/assets/logo-rojo.png',
            isStatic: true,
            zIndex: 2,
            filter: 'brightness(0) invert(1)'
        },
        {
            id: 'cover-title',
            type: 'text',
            x: 10,
            y: 40,
            width: 80,
            height: 8,
            content: 'Reportes de Piezas Mensuales',
            fontSize: 14,
            fontFamily: 'Arial',
            color: '#ffffff',
            bold: false,
            align: 'center',
            isStatic: true,
            zIndex: 3
        },
        {
            id: 'cover-month',
            type: 'text',
            x: 10,
            y: 50,
            width: 80,
            height: 12,
            content: `${MONTHS[month]} ${year}`,
            fontSize: 32,
            fontFamily: 'Arial',
            color: '#ffffff',
            bold: true,
            align: 'center',
            isStatic: true,
            zIndex: 3
        },
        {
            // Atlas logo - footer position
            id: 'cover-logo-atlas',
            type: 'image',
            x: 40,
            y: 88,
            width: 20,
            height: 8,
            content: '/assets/logoatlas.png',
            isStatic: true,
            zIndex: 2,
            filter: 'brightness(0) invert(1) opacity(0.6)'
        }
    ]
});

const SlideEditor = ({ initialFiles = [], onBack }) => {
    // Month/year state
    const defaultDate = getPreviousMonth();
    const [selectedMonth, setSelectedMonth] = useState(defaultDate.month);
    const [selectedYear, setSelectedYear] = useState(defaultDate.year);
    const [showMonthPicker, setShowMonthPicker] = useState(false);

    /**
     * Smart layout algorithm that analyzes image dimensions
     * and distributes 2-3 images per slide based on their aspect ratios
     */
    const createInitialSlides = useCallback((files, month, year) => {
        const coverSlide = createCoverSlide(month, year);

        if (files.length === 0) {
            // Return cover + empty content slide
            return [coverSlide, {
                id: generateId(),
                number: 2,
                backgroundColor: '#ffffff',
                elements: []
            }];
        }

        // ========================================
        // STEP 1: Group files by thematic proximity (date/time)
        // Files within 1 hour of each other are considered the same theme
        // ========================================
        const HOUR_MS = 60 * 60 * 1000; // 1 hour in milliseconds

        // Sort files by lastModified date
        const sortedFiles = [...files].sort((a, b) =>
            (a.lastModified || 0) - (b.lastModified || 0)
        );

        const thematicGroups = [];
        let currentGroup = [sortedFiles[0]];

        for (let i = 1; i < sortedFiles.length; i++) {
            const prevFile = sortedFiles[i - 1];
            const currFile = sortedFiles[i];
            const timeDiff = Math.abs((currFile.lastModified || 0) - (prevFile.lastModified || 0));

            if (timeDiff <= HOUR_MS) {
                // Same thematic group (within 1 hour)
                currentGroup.push(currFile);
            } else {
                // New thematic group
                thematicGroups.push(currentGroup);
                currentGroup = [currFile];
            }
        }
        thematicGroups.push(currentGroup); // Don't forget the last group

        // ========================================
        // STEP 2: Process each thematic group with layout algorithm
        // ========================================
        const allSlides = [];

        thematicGroups.forEach((group, groupIndex) => {
            // Get the date for this group's label
            const groupDate = new Date(group[0].lastModified || Date.now());
            const groupLabel = groupDate.toLocaleDateString('es-ES', {
                day: '2-digit',
                month: 'short',
                hour: '2-digit',
                minute: '2-digit'
            });

            // Analyze files in this group
            const analyzedFiles = group.map(file => {
                const aspectRatio = file.width && file.height ? file.width / file.height : 1.5;
                let orientation;

                if (aspectRatio > 1.3) {
                    orientation = 'landscape';
                } else if (aspectRatio < 0.77) {
                    orientation = 'portrait';
                } else {
                    orientation = 'square';
                }

                return { ...file, aspectRatio, orientation };
            });

            // Process files with layout algorithm
            let i = 0;
            while (i < analyzedFiles.length) {
                const file = analyzedFiles[i];
                const nextFile = analyzedFiles[i + 1];
                const thirdFile = analyzedFiles[i + 2];

                // Check if next files are in same group (don't cross group boundaries)
                const nextInGroup = nextFile && i + 1 < analyzedFiles.length;
                const thirdInGroup = thirdFile && i + 2 < analyzedFiles.length;

                let slideElements = [];

                // Layout decision based on orientations
                if (file.orientation === 'portrait') {
                    if (nextInGroup && nextFile?.orientation === 'portrait') {
                        if (thirdInGroup && thirdFile?.orientation === 'portrait') {
                            slideElements = [
                                { ...createFileElement(file, 0), x: 2, y: 2, width: 31, height: 96 },
                                { ...createFileElement(nextFile, 1), x: 35, y: 2, width: 31, height: 96 },
                                { ...createFileElement(thirdFile, 2), x: 67, y: 2, width: 31, height: 96 }
                            ];
                            i += 3;
                        } else {
                            slideElements = [
                                { ...createFileElement(file, 0), x: 2, y: 2, width: 47, height: 96 },
                                { ...createFileElement(nextFile, 1), x: 51, y: 2, width: 47, height: 96 }
                            ];
                            i += 2;
                        }
                    } else if (nextInGroup && nextFile?.orientation === 'landscape') {
                        slideElements = [
                            { ...createFileElement(nextFile, 0), x: 2, y: 2, width: 60, height: 96 },
                            { ...createFileElement(file, 1), x: 64, y: 15, width: 34, height: 70 }
                        ];
                        i += 2;
                    } else if (nextInGroup) {
                        slideElements = [
                            { ...createFileElement(file, 0), x: 2, y: 15, width: 47, height: 70 },
                            { ...createFileElement(nextFile, 1), x: 51, y: 15, width: 47, height: 70 }
                        ];
                        i += 2;
                    } else {
                        slideElements = [{ ...createFileElement(file, 0), x: 25, y: 2, width: 50, height: 96 }];
                        i += 1;
                    }
                } else if (file.orientation === 'landscape') {
                    if (nextInGroup && nextFile?.orientation === 'landscape') {
                        if (thirdInGroup && thirdFile?.orientation === 'landscape') {
                            slideElements = [
                                { ...createFileElement(file, 0), x: 2, y: 2, width: 96, height: 31 },
                                { ...createFileElement(nextFile, 1), x: 2, y: 35, width: 96, height: 31 },
                                { ...createFileElement(thirdFile, 2), x: 2, y: 68, width: 96, height: 30 }
                            ];
                            i += 3;
                        } else {
                            slideElements = [
                                { ...createFileElement(file, 0), x: 2, y: 2, width: 96, height: 47 },
                                { ...createFileElement(nextFile, 1), x: 2, y: 51, width: 96, height: 47 }
                            ];
                            i += 2;
                        }
                    } else if (nextInGroup && nextFile?.orientation === 'portrait') {
                        slideElements = [
                            { ...createFileElement(file, 0), x: 2, y: 2, width: 60, height: 96 },
                            { ...createFileElement(nextFile, 1), x: 64, y: 15, width: 34, height: 70 }
                        ];
                        i += 2;
                    } else if (nextInGroup) {
                        slideElements = [
                            { ...createFileElement(file, 0), x: 2, y: 2, width: 96, height: 55 },
                            { ...createFileElement(nextFile, 1), x: 25, y: 60, width: 50, height: 38 }
                        ];
                        i += 2;
                    } else {
                        slideElements = [{ ...createFileElement(file, 0), x: 2, y: 5, width: 96, height: 90 }];
                        i += 1;
                    }
                } else {
                    // Square
                    if (nextInGroup && thirdInGroup) {
                        slideElements = [
                            { ...createFileElement(file, 0), x: 2, y: 2, width: 47, height: 47 },
                            { ...createFileElement(nextFile, 1), x: 51, y: 2, width: 47, height: 47 },
                            { ...createFileElement(thirdFile, 2), x: 2, y: 51, width: 96, height: 47 }
                        ];
                        i += 3;
                    } else if (nextInGroup) {
                        slideElements = [
                            { ...createFileElement(file, 0), x: 2, y: 15, width: 47, height: 70 },
                            { ...createFileElement(nextFile, 1), x: 51, y: 15, width: 47, height: 70 }
                        ];
                        i += 2;
                    } else {
                        slideElements = [{ ...createFileElement(file, 0), x: 15, y: 5, width: 70, height: 90 }];
                        i += 1;
                    }
                }

                const normalizedElements = slideElements.map(element => ({
                    ...element,
                    ...normalizeElementRect(element)
                }));

                allSlides.push({
                    id: generateId(),
                    number: allSlides.length + 2,
                    backgroundColor: '#ffffff',
                    elements: normalizedElements,
                    thematicGroup: groupIndex,
                    groupLabel: groupLabel,
                    isFirstOfGroup: i <= (file.orientation === 'portrait' ? 3 : 3) && allSlides.filter(s => s.thematicGroup === groupIndex).length === 0
                });
            }
        });

        return [coverSlide, ...allSlides];
    }, []);

    // Helper function to create element from file
    const createFileElement = (file, zIndex) => ({
        id: generateId(),
        type: file.type?.startsWith('video/') ? 'video' : 'image',
        content: file.dataUrl,
        thumbnail: file.thumbnail,
        mimeType: file.mimeType || file.type || '',
        zIndex: zIndex + 1,
        fileName: file.name,
        aspectRatio: file.aspectRatio,
        orientation: file.orientation
    });

    const [slides, setSlides] = useState(() =>
        createInitialSlides(initialFiles, selectedMonth, selectedYear)
    );
    const [activeSlideId, setActiveSlideId] = useState(slides[1]?.id || slides[0]?.id);
    const [selectedElementId, setSelectedElementId] = useState(null);
    const [isExporting, setIsExporting] = useState(false);
    const [zoom, setZoom] = useState(100);
    const [draggedElement, setDraggedElement] = useState(null);
    const [clipboard, setClipboard] = useState(null); // For copy/cut/paste

    // Undo/Redo history
    const historyRef = useRef({ past: [], future: [] });
    const [canUndo, setCanUndo] = useState(false);
    const [canRedo, setCanRedo] = useState(false);

    // Save state to history before making changes
    const saveToHistory = useCallback((currentSlides) => {
        historyRef.current.past.push(JSON.stringify(currentSlides));
        historyRef.current.future = []; // Clear redo stack on new action
        if (historyRef.current.past.length > 50) historyRef.current.past.shift(); // Limit history
        setCanUndo(true);
        setCanRedo(false);
    }, []);

    // Undo
    const handleUndo = useCallback(() => {
        if (historyRef.current.past.length === 0) return;
        const previousState = historyRef.current.past.pop();
        historyRef.current.future.push(JSON.stringify(slides));
        setSlides(JSON.parse(previousState));
        setCanUndo(historyRef.current.past.length > 0);
        setCanRedo(true);
        setSelectedElementId(null);
    }, [slides]);

    // Redo
    const handleRedo = useCallback(() => {
        if (historyRef.current.future.length === 0) return;
        const nextState = historyRef.current.future.pop();
        historyRef.current.past.push(JSON.stringify(slides));
        setSlides(JSON.parse(nextState));
        setCanUndo(true);
        setCanRedo(historyRef.current.future.length > 0);
        setSelectedElementId(null);
    }, [slides]);

    // Get active slide
    const activeSlide = slides.find(s => s.id === activeSlideId) || slides[0];

    // Update cover slide when month/year changes
    const updateCoverMonth = (month, year) => {
        setSelectedMonth(month);
        setSelectedYear(year);
        setSlides(slides.map(slide => {
            if (slide.isCover) {
                return {
                    ...slide,
                    month,
                    year,
                    elements: slide.elements.map(el => {
                        if (el.id === 'cover-month') {
                            return { ...el, content: `${MONTHS[month]} ${year}` };
                        }
                        return el;
                    })
                };
            }
            return slide;
        }));
        setShowMonthPicker(false);
    };

    // Update slide numbers after changes
    const updateSlideNumbers = (slideList) => {
        return slideList.map((slide, index) => ({
            ...slide,
            number: index + 1
        }));
    };

    // Normalize element geometry before export to avoid clipping/distortion in PPT
    const sanitizeSlidesForExport = useCallback((slideList) => {
        return slideList.map(slide => ({
            ...slide,
            elements: (slide.elements || []).map(element => {
                if (!element || typeof element !== 'object') return element;
                return { ...element, ...normalizeElementRect(element) };
            })
        }));
    }, []);

    // Slide management
    const handleAddSlide = () => {
        const newSlide = {
            id: generateId(),
            number: slides.length + 1,
            elements: [],
            backgroundColor: '#ffffff'
        };
        setSlides(updateSlideNumbers([...slides, newSlide]));
        setActiveSlideId(newSlide.id);
    };

    // Insert slide at specific position (for category dividers)
    const handleInsertSlide = (position) => {
        const newSlide = {
            id: generateId(),
            number: position + 1,
            elements: [],
            backgroundColor: '#ffffff'
        };
        const newSlides = [
            ...slides.slice(0, position),
            newSlide,
            ...slides.slice(position)
        ];
        setSlides(updateSlideNumbers(newSlides));
        setActiveSlideId(newSlide.id);
    };

    const handleDeleteSlide = (slideId) => {
        const slide = slides.find(s => s.id === slideId);
        if (slide?.isCover || slides.length <= 1) return;

        const newSlides = slides.filter(s => s.id !== slideId);
        setSlides(updateSlideNumbers(newSlides));

        if (activeSlideId === slideId) {
            setActiveSlideId(newSlides[0].id);
        }
    };

    const handleReorderSlides = (fromIndex, toIndex) => {
        // Don't allow moving the cover slide
        if (fromIndex === 0 || toIndex === 0) return;

        const newSlides = [...slides];
        const [removed] = newSlides.splice(fromIndex, 1);
        newSlides.splice(toIndex, 0, removed);
        setSlides(updateSlideNumbers(newSlides));
    };

    // Element management
    const handleSelectElement = (elementId) => {
        const slide = slides.find(s => s.id === activeSlideId);
        const element = slide?.elements.find(el => el.id === elementId);
        if (element?.isStatic) return; // Don't select static cover elements
        setSelectedElementId(elementId);
    };

    const handleUpdateElement = (elementId, updates) => {
        setSlides(slides.map(slide => {
            if (slide.id !== activeSlideId) return slide;
            return {
                ...slide,
                elements: slide.elements.map(el =>
                    el.id === elementId
                        ? {
                            ...el,
                            ...updates,
                            ...normalizeElementRect({ ...el, ...updates })
                        }
                        : el
                )
            };
        }));
    };

    const handleDeleteElement = (elementId) => {
        const slide = slides.find(s => s.id === activeSlideId);
        const element = slide?.elements.find(el => el.id === elementId);
        if (element?.isStatic) return; // Don't delete static cover elements

        saveToHistory(slides); // Save for undo
        setSlides(slides.map(slide => {
            if (slide.id !== activeSlideId) return slide;
            return {
                ...slide,
                elements: slide.elements.filter(el => el.id !== elementId)
            };
        }));
        setSelectedElementId(null);
    };

    // Copy element to clipboard
    const handleCopyElement = () => {
        if (!selectedElementId) return;
        const element = activeSlide?.elements.find(el => el.id === selectedElementId);
        if (element && !element.isStatic) {
            setClipboard({ ...element, isCut: false });
        }
    };

    // Cut element to clipboard
    const handleCutElement = () => {
        if (!selectedElementId) return;
        const element = activeSlide?.elements.find(el => el.id === selectedElementId);
        if (element && !element.isStatic) {
            setClipboard({ ...element, isCut: true });
            handleDeleteElement(selectedElementId);
        }
    };

    // Paste element from clipboard
    const handlePasteElement = () => {
        if (!clipboard) return;
        saveToHistory(slides); // Save for undo
        const draftElement = {
            ...clipboard,
            id: generateId(),
            x: clipboard.x + 2, // Offset slightly so it's visible
            y: clipboard.y + 2,
            zIndex: (activeSlide?.elements.length || 0) + 1
        };
        delete draftElement.isCut;

        const newElement = {
            ...draftElement,
            ...normalizeElementRect(draftElement)
        };

        setSlides(slides.map(slide => {
            if (slide.id !== activeSlideId) return slide;
            return {
                ...slide,
                elements: [...slide.elements, newElement]
            };
        }));
        setSelectedElementId(newElement.id);

        // If it was cut, clear clipboard
        if (clipboard.isCut) {
            setClipboard(null);
        }
    };

    // Keyboard shortcuts
    useEffect(() => {
        const handleKeyDown = (e) => {
            // Don't trigger if typing in an input
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

            if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
                e.preventDefault();
                handleUndo();
            } else if ((e.ctrlKey || e.metaKey) && (e.key === 'y' || (e.key === 'z' && e.shiftKey))) {
                e.preventDefault();
                handleRedo();
            } else if ((e.ctrlKey || e.metaKey) && e.key === 'c') {
                e.preventDefault();
                handleCopyElement();
            } else if ((e.ctrlKey || e.metaKey) && e.key === 'x') {
                e.preventDefault();
                handleCutElement();
            } else if ((e.ctrlKey || e.metaKey) && e.key === 'v') {
                e.preventDefault();
                handlePasteElement();
            } else if ((e.key === 'Delete' || e.key === 'Backspace') && selectedElementId) {
                e.preventDefault();
                handleDeleteElement(selectedElementId);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [selectedElementId, clipboard, activeSlide, handleUndo, handleRedo]);

    // Move element to another slide
    const handleMoveElementToSlide = (elementId, targetSlideId) => {
        let elementToMove = null;

        // Find and remove element from current slide
        const updatedSlides = slides.map(slide => {
            const element = slide.elements.find(el => el.id === elementId);
            if (element && !element.isStatic) {
                elementToMove = { ...element };
                return {
                    ...slide,
                    elements: slide.elements.filter(el => el.id !== elementId)
                };
            }
            return slide;
        });

        if (!elementToMove) return;

        // Add element to target slide
        const finalSlides = updatedSlides.map(slide => {
            if (slide.id === targetSlideId && !slide.isCover) {
                const movedElement = {
                    ...elementToMove,
                    x: 35,
                    y: 35,
                    zIndex: slide.elements.length + 1
                };
                // Position in center of new slide
                return {
                    ...slide,
                    elements: [
                        ...slide.elements,
                        { ...movedElement, ...normalizeElementRect(movedElement) }
                    ]
                };
            }
            return slide;
        });

        setSlides(finalSlides);
        setSelectedElementId(null);
        setActiveSlideId(targetSlideId);
    };

    // Add text element
    const handleAddText = () => {
        if (activeSlide?.isCover) return;

        const newElement = {
            id: generateId(),
            type: 'text',
            x: 20,
            y: 40,
            width: 60,
            height: 15,
            content: 'Escribe aquí...',
            fontSize: 18,
            fontFamily: 'Arial',
            color: '#000000',
            bold: false,
            italic: false,
            align: 'center',
            zIndex: (activeSlide?.elements.length || 0) + 1
        };

        const protectedElement = {
            ...newElement,
            ...normalizeElementRect(newElement)
        };

        setSlides(slides.map(slide => {
            if (slide.id !== activeSlideId) return slide;
            return {
                ...slide,
                elements: [...slide.elements, protectedElement]
            };
        }));

        setSelectedElementId(protectedElement.id);
    };

    // Change slide background
    const handleChangeBackground = () => {
        if (activeSlide?.isCover) return;

        const colors = ['#ffffff', '#f3f4f6', '#1f2937', '#0f172a', '#fef3c7', '#dbeafe', '#dcfce7'];
        const currentIndex = colors.indexOf(activeSlide?.backgroundColor || '#ffffff');
        const nextColor = colors[(currentIndex + 1) % colors.length];

        setSlides(slides.map(slide => {
            if (slide.id !== activeSlideId) return slide;
            return { ...slide, backgroundColor: nextColor };
        }));
    };

    // Export to PowerPoint
    const handleExport = async () => {
        setIsExporting(true);
        try {
            const normalizedSlides = sanitizeSlidesForExport(slides);
            await generatePptx(normalizedSlides, {
                fileName: `Graficas_${MONTHS[selectedMonth]}_${selectedYear}.pptx`,
                title: `Reportes de Piezas Mensuales - ${MONTHS[selectedMonth]} ${selectedYear}`,
                author: 'Atlas Digital - Canon'
            });
        } catch (error) {
            console.error('Export error:', error);
            alert('Error al exportar: ' + error.message);
        } finally {
            setIsExporting(false);
        }
    };

    // Get other slides for move menu
    const otherSlides = slides.filter(s => s.id !== activeSlideId && !s.isCover);

    return (
        <div className="flex h-full bg-[#0a0a0f]">
            {/* Left Panel - Thumbnails */}
            <SlideThumbnails
                slides={slides}
                activeSlideId={activeSlideId}
                onSelectSlide={setActiveSlideId}
                onAddSlide={handleAddSlide}
                onDeleteSlide={handleDeleteSlide}
                onReorderSlides={handleReorderSlides}
                onInsertSlide={handleInsertSlide}
            />

            {/* Main Content */}
            <div className="flex-1 flex flex-col">
                {/* Toolbar */}
                <div className="px-4 py-3 border-b border-white/10 bg-[#12121a] flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <button
                            onClick={onBack}
                            className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-colors"
                        >
                            <ArrowLeft size={18} />
                        </button>
                        <div className="h-6 w-px bg-white/10" />

                        {/* Undo/Redo buttons */}
                        <button
                            onClick={handleUndo}
                            disabled={!canUndo}
                            className={`p-2 rounded-lg transition-colors ${canUndo
                                ? 'bg-white/5 hover:bg-white/10 text-white/60 hover:text-white'
                                : 'bg-white/5 text-white/20 cursor-not-allowed'}`}
                            title="Deshacer (Ctrl+Z)"
                        >
                            <Undo2 size={18} />
                        </button>
                        <button
                            onClick={handleRedo}
                            disabled={!canRedo}
                            className={`p-2 rounded-lg transition-colors ${canRedo
                                ? 'bg-white/5 hover:bg-white/10 text-white/60 hover:text-white'
                                : 'bg-white/5 text-white/20 cursor-not-allowed'}`}
                            title="Rehacer (Ctrl+Y)"
                        >
                            <Redo2 size={18} />
                        </button>
                        <div className="h-6 w-px bg-white/10" />

                        {/* Month/Year Picker */}
                        <div className="relative">
                            <button
                                onClick={() => setShowMonthPicker(!showMonthPicker)}
                                className="flex items-center gap-2 px-3 py-2 rounded-lg bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 transition-colors"
                            >
                                <Calendar size={16} />
                                <span className="text-sm font-medium">{MONTHS[selectedMonth]} {selectedYear}</span>
                                <ChevronDown size={14} className={`transition-transform ${showMonthPicker ? 'rotate-180' : ''}`} />
                            </button>

                            {/* Month picker dropdown */}
                            <AnimatePresence>
                                {showMonthPicker && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        className="absolute top-full left-0 mt-2 bg-[#1a1a24] rounded-lg shadow-xl border border-white/10 p-3 z-50 w-64"
                                    >
                                        {/* Year selector */}
                                        <div className="flex items-center justify-between mb-3">
                                            <button
                                                onClick={() => setSelectedYear(y => y - 1)}
                                                className="p-1 hover:bg-white/10 rounded"
                                            >
                                                <Minus size={14} className="text-white/60" />
                                            </button>
                                            <span className="text-white font-medium">{selectedYear}</span>
                                            <button
                                                onClick={() => setSelectedYear(y => y + 1)}
                                                className="p-1 hover:bg-white/10 rounded"
                                            >
                                                <Plus size={14} className="text-white/60" />
                                            </button>
                                        </div>

                                        {/* Month grid */}
                                        <div className="grid grid-cols-3 gap-1">
                                            {MONTHS.map((month, idx) => (
                                                <button
                                                    key={month}
                                                    onClick={() => updateCoverMonth(idx, selectedYear)}
                                                    className={`px-2 py-1.5 text-xs rounded transition-colors ${selectedMonth === idx
                                                        ? 'bg-purple-500 text-white'
                                                        : 'text-white/60 hover:bg-white/10 hover:text-white'
                                                        }`}
                                                >
                                                    {month.slice(0, 3)}
                                                </button>
                                            ))}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        <div className="h-6 w-px bg-white/10" />

                        <button
                            onClick={handleAddText}
                            disabled={activeSlide?.isCover}
                            className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                        >
                            <Type size={16} />
                            <span className="text-sm">Texto</span>
                        </button>
                        <button
                            onClick={handleChangeBackground}
                            disabled={activeSlide?.isCover}
                            className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                            title="Cambiar fondo"
                        >
                            <Palette size={16} />
                            <span className="text-sm">Fondo</span>
                        </button>

                        {/* Move to slide button */}
                        {selectedElementId && otherSlides.length > 0 && (
                            <div className="relative group">
                                <button className="flex items-center gap-2 px-3 py-2 rounded-lg bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 transition-colors">
                                    <span className="text-sm">Mover a...</span>
                                    <ChevronDown size={14} />
                                </button>
                                <div className="absolute top-full left-0 mt-1 bg-[#1a1a24] rounded-lg shadow-xl border border-white/10 py-1 z-50 hidden group-hover:block min-w-32">
                                    {otherSlides.map(slide => (
                                        <button
                                            key={slide.id}
                                            onClick={() => handleMoveElementToSlide(selectedElementId, slide.id)}
                                            className="w-full px-3 py-2 text-left text-sm text-white/70 hover:bg-white/10 hover:text-white"
                                        >
                                            Lámina {slide.number}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Zoom controls */}
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setZoom(Math.max(50, zoom - 10))}
                            className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/60 transition-colors"
                        >
                            <Minus size={14} />
                        </button>
                        <span className="text-white/50 text-sm w-12 text-center">{zoom}%</span>
                        <button
                            onClick={() => setZoom(Math.min(150, zoom + 10))}
                            className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/60 transition-colors"
                        >
                            <Plus size={14} />
                        </button>
                    </div>

                    {/* Export button */}
                    <motion.button
                        onClick={handleExport}
                        disabled={isExporting}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-medium shadow-lg shadow-blue-500/25 hover:from-blue-400 hover:to-indigo-400 transition-all disabled:opacity-50"
                    >
                        <Download size={16} className={isExporting ? 'animate-bounce' : ''} />
                        <span className="text-sm">{isExporting ? 'Exportando...' : 'Exportar PPT'}</span>
                    </motion.button>
                </div>

                {/* Canvas area */}
                <div className="flex-1 overflow-auto p-8 bg-[#08080c]">
                    <div
                        className="mx-auto transition-transform"
                        style={{
                            maxWidth: `${zoom}%`,
                            transform: `scale(${zoom / 100})`,
                            transformOrigin: 'top center'
                        }}
                    >
                        <SlideCanvas
                            slide={activeSlide}
                            selectedElementId={selectedElementId}
                            onSelectElement={handleSelectElement}
                            onUpdateElement={handleUpdateElement}
                            onDeleteElement={handleDeleteElement}
                            onCanvasClick={() => setSelectedElementId(null)}
                        />
                    </div>
                </div>

                {/* Bottom status bar */}
                <div className="px-4 py-2 border-t border-white/10 bg-[#12121a] flex items-center justify-between text-xs text-white/40">
                    <span>
                        {activeSlide?.isCover ? '📋 Portada' : `Lámina ${activeSlide?.number}`} de {slides.length}
                    </span>
                    <span>
                        {activeSlide?.elements.filter(e => !e.isStatic).length || 0} elemento{activeSlide?.elements.filter(e => !e.isStatic).length !== 1 ? 's' : ''}
                        {selectedElementId && ' • 1 seleccionado'}
                    </span>
                </div>
            </div>
        </div>
    );
};

export default SlideEditor;
