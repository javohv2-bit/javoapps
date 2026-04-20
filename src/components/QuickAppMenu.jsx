import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Monitor,
    Link2,
    Code2,
    MailOpen,
    CalendarDays,
    Mail,
    Grid3x3,
    X,
    Home
} from 'lucide-react';

/**
 * QuickAppMenu - Floating menu button to quickly navigate between apps
 */
const QuickAppMenu = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [isOpen, setIsOpen] = useState(false);

    const apps = [
        {
            id: 'home',
            name: 'Home',
            description: 'Página principal',
            icon: Home,
            path: '/',
            category: 'main'
        },
        {
            id: 'inpage-maker',
            name: 'InPage Maker',
            description: 'Crea InPages para retailers',
            icon: Monitor,
            path: '/inpage-maker',
            category: 'tools'
        },
        {
            id: 'comunicados-app',
            name: 'Comunicados App',
            description: 'Genera HTMLs de comunicados',
            icon: Code2,
            path: '/comunicados-app',
            category: 'tools'
        },
        {
            id: 'emailing-category',
            name: 'Emailing',
            category: 'category',
            subItems: [
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

    const handleNavigate = (path) => {
        navigate(path);
        setIsOpen(false);
    };

    return (
        <>
            {/* Floating Button */}
            <motion.button
                onClick={() => setIsOpen(!isOpen)}
                className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full shadow-lg hover:shadow-xl flex items-center justify-center text-white transition-all hover:scale-110"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
            >
                {isOpen ? <X size={24} /> : <Grid3x3 size={24} />}
            </motion.button>

            {/* Menu Overlay */}
            <AnimatePresence>
                {isOpen && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsOpen(false)}
                            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
                        />

                        {/* Menu Panel */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                            className="fixed bottom-24 right-6 z-50 w-96 bg-white rounded-2xl shadow-2xl overflow-hidden"
                        >
                            {/* Header */}
                            <div className="bg-gradient-to-r from-cyan-500 to-blue-600 px-6 py-4">
                                <h3 className="text-white font-bold text-lg">Apps Rápidas</h3>
                                <p className="text-white/70 text-xs mt-1">Navega entre herramientas</p>
                            </div>

                            {/* Apps List */}
                            <div className="max-h-[70vh] overflow-y-auto">
                                {/* Home */}
                                <div className="p-2">
                                    {apps.filter(app => app.category === 'main').map(app => (
                                        <button
                                            key={app.id}
                                            onClick={() => handleNavigate(app.path)}
                                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-100 transition-colors text-left ${
                                                location.pathname === app.path ? 'bg-cyan-50 border border-cyan-200' : ''
                                            }`}
                                        >
                                            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                                                <app.icon size={20} className="text-gray-600" />
                                            </div>
                                            <div className="flex-1">
                                                <div className="text-sm font-semibold text-gray-800">{app.name}</div>
                                                <div className="text-xs text-gray-500">{app.description}</div>
                                            </div>
                                        </button>
                                    ))}
                                </div>

                                <div className="border-t border-gray-100 my-2"></div>

                                {/* Other Apps */}
                                <div className="p-2">
                                    {apps.filter(app => app.category === 'tools').map(app => (
                                        <button
                                            key={app.id}
                                            onClick={() => handleNavigate(app.path)}
                                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-100 transition-colors text-left ${
                                                location.pathname === app.path ? 'bg-cyan-50 border border-cyan-200' : ''
                                            }`}
                                        >
                                            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-100 to-blue-100 flex items-center justify-center">
                                                <app.icon size={20} className="text-cyan-600" />
                                            </div>
                                            <div className="flex-1">
                                                <div className="text-sm font-semibold text-gray-800">{app.name}</div>
                                                <div className="text-xs text-gray-500">{app.description}</div>
                                            </div>
                                        </button>
                                    ))}
                                </div>

                                {/* Emailing Category */}
                                {apps.filter(app => app.category === 'category').map(category => (
                                    <div key={category.id} className="p-2">
                                        <div className="px-4 py-2 flex items-center gap-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                                            <Mail size={14} />
                                            {category.name}
                                        </div>
                                        {category.subItems.map(subApp => (
                                            <button
                                                key={subApp.id}
                                                onClick={() => handleNavigate(subApp.path)}
                                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-100 transition-colors text-left ${
                                                    location.pathname === subApp.path ? 'bg-cyan-50 border border-cyan-200' : ''
                                                }`}
                                            >
                                                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center">
                                                    <subApp.icon size={20} className="text-purple-600" />
                                                </div>
                                                <div className="flex-1">
                                                    <div className="text-sm font-semibold text-gray-800">{subApp.name}</div>
                                                    <div className="text-xs text-gray-500">{subApp.description}</div>
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
};

export default QuickAppMenu;
