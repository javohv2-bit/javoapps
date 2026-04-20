import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    Monitor,
    Link2,
    Code2,
    MailOpen,
    CalendarDays,
    ArrowRight,
    Mail,
    ChevronDown,
    Layers
} from 'lucide-react';

/**
 * Landing Page - Atlas Digital Apps
 * 
 * Design: Dark with aurora gradient effect
 * Style: Minimalist, clean UI, subtle buttons
 */
const LandingPage = () => {
    const navigate = useNavigate();
    const canvasRef = useRef(null);

    // Typewriter state
    const [displayedText1, setDisplayedText1] = useState('');
    const [displayedText2, setDisplayedText2] = useState('');
    const [showCursor, setShowCursor] = useState(true);
    const [currentPhase, setCurrentPhase] = useState(0);

    const text1 = 'WELCOME';
    const text2 = 'Javo.';

    // Typewriter effect
    useEffect(() => {
        let timeout;

        if (currentPhase === 0) {
            // Type "WELCOME"
            if (displayedText1.length < text1.length) {
                timeout = setTimeout(() => {
                    setDisplayedText1(text1.slice(0, displayedText1.length + 1));
                }, 80);
            } else {
                timeout = setTimeout(() => setCurrentPhase(1), 300);
            }
        } else if (currentPhase === 1) {
            // Type "Javo."
            if (displayedText2.length < text2.length) {
                timeout = setTimeout(() => {
                    setDisplayedText2(text2.slice(0, displayedText2.length + 1));
                }, 100);
            } else {
                timeout = setTimeout(() => setCurrentPhase(2), 200);
            }
        }

        return () => clearTimeout(timeout);
    }, [displayedText1, displayedText2, currentPhase]);

    // Blinking cursor
    useEffect(() => {
        const cursorInterval = setInterval(() => {
            setShowCursor(prev => !prev);
        }, 530);
        return () => clearInterval(cursorInterval);
    }, []);

    // Aurora gradient background animation
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        let animationId;
        let time = 0;

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        resize();
        window.addEventListener('resize', resize);

        const animate = () => {
            time += 0.004;

            // Dark base
            ctx.fillStyle = '#0a0a0f';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // === BLOB 1: Bottom center - cyan/indigo (moves horizontally) ===
            const blob1X = canvas.width * (0.5 + Math.sin(time * 0.8) * 0.25);
            const blob1Y = canvas.height * (0.78 + Math.cos(time * 0.5) * 0.05);
            const grad1 = ctx.createRadialGradient(blob1X, blob1Y, 0, blob1X, blob1Y, canvas.width * 0.5);
            grad1.addColorStop(0, 'rgba(56, 189, 248, 0.15)');
            grad1.addColorStop(0.4, 'rgba(99, 102, 241, 0.08)');
            grad1.addColorStop(1, 'transparent');
            ctx.fillStyle = grad1;
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // === BLOB 2: Top right - purple/pink (moves diagonally) ===
            const blob2X = canvas.width * (0.75 + Math.cos(time * 0.6) * 0.15);
            const blob2Y = canvas.height * (0.25 + Math.sin(time * 0.9) * 0.12);
            const grad2 = ctx.createRadialGradient(blob2X, blob2Y, 0, blob2X, blob2Y, canvas.width * 0.4);
            grad2.addColorStop(0, 'rgba(168, 85, 247, 0.10)');
            grad2.addColorStop(0.5, 'rgba(236, 72, 153, 0.05)');
            grad2.addColorStop(1, 'transparent');
            ctx.fillStyle = grad2;
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // === BLOB 3: Left side - teal/emerald (moves vertically) ===
            const blob3X = canvas.width * (0.2 + Math.sin(time * 0.4) * 0.08);
            const blob3Y = canvas.height * (0.55 + Math.cos(time * 0.7) * 0.2);
            const grad3 = ctx.createRadialGradient(blob3X, blob3Y, 0, blob3X, blob3Y, canvas.width * 0.35);
            grad3.addColorStop(0, 'rgba(20, 184, 166, 0.08)');
            grad3.addColorStop(0.5, 'rgba(16, 185, 129, 0.04)');
            grad3.addColorStop(1, 'transparent');
            ctx.fillStyle = grad3;
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // === BLOB 4: Bottom left - amber/orange (slow circular motion) ===
            const blob4X = canvas.width * (0.3 + Math.cos(time * 0.35) * 0.12);
            const blob4Y = canvas.height * (0.85 + Math.sin(time * 0.35) * 0.08);
            const grad4 = ctx.createRadialGradient(blob4X, blob4Y, 0, blob4X, blob4Y, canvas.width * 0.3);
            grad4.addColorStop(0, 'rgba(251, 191, 36, 0.07)');
            grad4.addColorStop(0.5, 'rgba(251, 146, 60, 0.03)');
            grad4.addColorStop(1, 'transparent');
            ctx.fillStyle = grad4;
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // === BLOB 5: Center floating - blue glow (pulsing + drifting) ===
            const pulseSize = 0.35 + Math.sin(time * 1.5) * 0.08;
            const blob5X = canvas.width * (0.55 + Math.sin(time * 0.25) * 0.1);
            const blob5Y = canvas.height * (0.5 + Math.cos(time * 0.3) * 0.1);
            const grad5 = ctx.createRadialGradient(blob5X, blob5Y, 0, blob5X, blob5Y, canvas.width * pulseSize);
            grad5.addColorStop(0, 'rgba(59, 130, 246, 0.06)');
            grad5.addColorStop(0.6, 'rgba(99, 102, 241, 0.03)');
            grad5.addColorStop(1, 'transparent');
            ctx.fillStyle = grad5;
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            animationId = requestAnimationFrame(animate);
        };

        animate();

        return () => {
            cancelAnimationFrame(animationId);
            window.removeEventListener('resize', resize);
        };
    }, []);

    // State for dropdown menus
    const [activeDropdown, setActiveDropdown] = useState(null);
    const [dropdownTimeout, setDropdownTimeout] = useState(null);

    const menuItems = [
        {
            id: 'inpage-maker',
            name: 'InPage Maker',
            description: 'Crea InPages para retailers',
            icon: Monitor,
            path: '/inpage-maker',
            type: 'single'
        },
        {
            id: 'comunicados-app',
            name: 'Comunicados App',
            description: 'Genera HTMLs de comunicados',
            icon: Code2,
            path: '/comunicados-app',
            type: 'single'
        },
        {
            id: 'graficas-mensuales',
            name: 'Gráficas Mensuales',
            description: 'Crea presentaciones visuales',
            icon: Layers,
            path: '/graficas-mensuales',
            type: 'single'
        },
        {
            id: 'media-browser',
            name: 'Emailing',
            description: 'Herramientas de email marketing',
            icon: Mail,
            type: 'category',
            subItems: [
                {
                    id: 'mailing-maker',
                    name: 'Mailing Maker',
                    description: 'Crea mailings HTML Canon',
                    icon: MailOpen,
                    path: '/mailing-maker'
                },
                {
                    id: 'marcajes-maker',
                    name: 'Marcajes App',
                    description: 'Genera URLs con UTM tracking',
                    icon: Link2,
                    path: '/marcajes-maker'
                },
                {
                    id: 'emailing-planner',
                    name: 'Emailing Planner',
                    description: 'Planifica campañas de email',
                    icon: CalendarDays,
                    path: '/emailing-planner'
                },
                {
                    id: 'mailings-dashboard',
                    name: 'Mailings Dashboard',
                    description: 'Métricas de email marketing',
                    icon: MailOpen,
                    path: '/mailings-dashboard'
                }
            ]
        }
    ];

    // Flatten apps for main content buttons
    const apps = menuItems.reduce((acc, item) => {
        if (item.type === 'single') {
            acc.push(item);
        } else if (item.type === 'category') {
            acc.push(...item.subItems);
        }
        return acc;
    }, []);

    return (
        <div className="min-h-screen relative overflow-hidden bg-[#0a0a0f]">
            {/* Aurora Background */}
            <canvas
                ref={canvasRef}
                className="absolute inset-0 z-0"
            />

            {/* Content */}
            <div className="relative z-10 min-h-screen flex flex-col">
                {/* Header - White background for logo contrast */}
                <motion.header
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.8 }}
                    className="px-8 py-4 bg-white"
                >
                    <div className="max-w-6xl mx-auto flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <img
                                src="/assets/logo-atlas.gif"
                                alt="Atlas Digital"
                                className="h-5 w-auto"
                            />
                            <div className="h-4 w-px bg-black/20"></div>
                            <span className="text-black/50 text-xs font-medium tracking-wider">
                                ATLAS DIGITAL APPS
                            </span>
                        </div>
                        <nav className="flex items-center gap-8">
                            {menuItems.map(item => (
                                item.type === 'single' ? (
                                    <button
                                        key={item.id}
                                        onClick={() => navigate(item.path)}
                                        className="text-black/40 hover:text-black/80 text-xs font-medium tracking-wider uppercase transition-colors cursor-pointer"
                                    >
                                        {item.name}
                                    </button>
                                ) : (
                                    <div
                                        key={item.id}
                                        className="relative"
                                        onMouseEnter={() => {
                                            if (dropdownTimeout) clearTimeout(dropdownTimeout);
                                            setActiveDropdown(item.id);
                                        }}
                                        onMouseLeave={() => {
                                            const timeout = setTimeout(() => {
                                                setActiveDropdown(null);
                                            }, 150);
                                            setDropdownTimeout(timeout);
                                        }}
                                    >
                                        <button
                                            className="flex items-center gap-1 text-black/40 hover:text-black/80 text-xs font-medium tracking-wider uppercase transition-colors cursor-pointer"
                                        >
                                            {item.name}
                                            <ChevronDown size={14} className={`transition-transform ${activeDropdown === item.id ? 'rotate-180' : ''}`} />
                                        </button>

                                        {/* Dropdown Menu */}
                                        {activeDropdown === item.id && (
                                            <motion.div
                                                initial={{ opacity: 0, y: -10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: -10 }}
                                                transition={{ duration: 0.2 }}
                                                className="absolute top-full left-0 mt-2 w-64 bg-white rounded-lg shadow-xl border border-black/5 overflow-hidden z-50"
                                                onMouseEnter={() => {
                                                    if (dropdownTimeout) clearTimeout(dropdownTimeout);
                                                    setActiveDropdown(item.id);
                                                }}
                                                onMouseLeave={() => {
                                                    const timeout = setTimeout(() => {
                                                        setActiveDropdown(null);
                                                    }, 150);
                                                    setDropdownTimeout(timeout);
                                                }}
                                            >
                                                {item.subItems.map((subItem, idx) => (
                                                    <button
                                                        key={subItem.id}
                                                        onClick={() => navigate(subItem.path)}
                                                        className="w-full flex items-center gap-3 px-4 py-3 hover:bg-black/5 transition-colors cursor-pointer text-left border-b border-black/5 last:border-b-0"
                                                    >
                                                        <subItem.icon size={16} className="text-black/40" />
                                                        <div className="flex-1">
                                                            <div className="text-xs font-medium text-black/80">
                                                                {subItem.name}
                                                            </div>
                                                            <div className="text-[10px] text-black/40">
                                                                {subItem.description}
                                                            </div>
                                                        </div>
                                                        <ArrowRight size={12} className="text-black/20" />
                                                    </button>
                                                ))}
                                            </motion.div>
                                        )}
                                    </div>
                                )
                            ))}
                        </nav>
                    </div>
                </motion.header>

                {/* Main Content */}
                <main className="flex-1 flex flex-col justify-center px-8 pb-32">
                    <div className="max-w-6xl mx-auto w-full">
                        {/* Hero Text with Typewriter Effect */}
                        <div>
                            <h1
                                className="text-[4rem] md:text-[7rem] lg:text-[9rem] font-black text-white leading-[0.9] tracking-tight mb-8 min-h-[1em]"
                                style={{ fontFamily: "'Space Grotesk', 'Arial Black', sans-serif" }}
                            >
                                {displayedText1}
                                {currentPhase === 0 && (
                                    <span className={`inline-block w-[4px] md:w-[6px] h-[4rem] md:h-[7rem] lg:h-[9rem] bg-cyan-400 ml-2 ${showCursor ? 'opacity-100' : 'opacity-0'}`} />
                                )}
                            </h1>
                            <h2
                                className="text-[2rem] md:text-[3rem] font-light text-white/80 leading-[1] tracking-tight mb-12 min-h-[1em]"
                                style={{ fontFamily: "'Space Grotesk', 'Arial Black', sans-serif" }}
                            >
                                {displayedText2}
                                {currentPhase === 1 && (
                                    <span className={`inline-block w-[3px] md:w-[4px] h-[2rem] md:h-[3rem] bg-cyan-400 ml-1 ${showCursor ? 'opacity-100' : 'opacity-0'}`} />
                                )}
                            </h2>
                        </div>

                        {/* Description - fade from bottom */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: currentPhase >= 2 ? 1 : 0, y: currentPhase >= 2 ? 0 : 20 }}
                            transition={{ duration: 0.6, ease: 'easeOut' }}
                            className="mb-12"
                        >
                            <p className="text-white/50 text-xl md:text-2xl max-w-lg leading-relaxed">
                                ¿Qué hacemos hoy?
                            </p>
                        </motion.div>
                    </div>
                </main>

                {/* Footer - Minimal */}
                <motion.footer
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1 }}
                    className="px-8 py-6"
                >
                    <div className="max-w-6xl mx-auto flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <img
                                src="/assets/logoatlas.png"
                                alt="Atlas"
                                className="h-4 w-auto brightness-0 invert opacity-20 hover:opacity-40 transition-opacity"
                            />
                            <img
                                src="/assets/logo-rojo.png"
                                alt="Canon"
                                className="h-2.5 w-auto brightness-0 invert opacity-20 hover:opacity-40 transition-opacity"
                            />
                        </div>
                        <p className="text-white/20 text-xs">
                            by javohv • {new Date().getFullYear()}
                        </p>
                    </div>
                </motion.footer>
            </div>
        </div>
    );
};

export default LandingPage;