import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Home } from 'lucide-react';
import EmailingPlannerApp from './emailing-planner-src/App';
import QuickAppMenu from '../components/QuickAppMenu';

/**
 * Emailing Planner - Wrapper Page
 * Integrates the standalone Emailing App into the Atlas ecosystem
 * Header matches other Atlas apps style
 */
const EmailingPlanner = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-[#fafafa] flex flex-col relative overflow-hidden">
            {/* Header - Same style as other Atlas apps */}
            <header className="relative z-50 bg-white shadow-sm">
                <div className="max-w-[1600px] mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => navigate('/')}
                                className="p-2 rounded-lg hover:bg-black/5 transition-all cursor-pointer"
                            >
                                <Home size={18} className="text-black/40" />
                            </button>
                            <div className="h-4 w-px bg-black/20"></div>
                            <img src="/assets/logo-atlas.gif" alt="Atlas" className="h-5 w-auto" />
                            <div className="h-4 w-px bg-black/20"></div>
                            <span className="text-xs font-medium tracking-wider text-black/50">
                                Emailing Planner
                            </span>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content - Emailing App (has its own internal layout) */}
            <main className="flex-1 overflow-auto">
                <EmailingPlannerApp />
            </main>

            {/* Footer - Same style as other Atlas apps */}
            <footer className="relative z-50 bg-white border-t border-black/5 py-4">
                <div className="max-w-[1600px] mx-auto px-6 flex items-center justify-center gap-3">
                    <img src="/assets/logo-atlas.gif" alt="Atlas" className="h-4 w-auto opacity-40" />
                    <span className="text-[10px] text-black/30 font-medium tracking-wide">
                        Emailing Planner by Javohv for Atlas & Canon
                    </span>
                </div>
            </footer>
            
            {/* Quick App Menu */}
            <QuickAppMenu />
        </div>
    );
};

export default EmailingPlanner;
