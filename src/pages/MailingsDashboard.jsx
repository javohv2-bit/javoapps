import React, { useState, useRef, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Home,
    Upload,
    BarChart3,
    TrendingUp,
    TrendingDown,
    Mail,
    Users,
    DollarSign,
    MousePointerClick,
    Eye,
    FileSpreadsheet,
    Loader2,
    RefreshCw,
    Trash2,
    Calendar,
    Database,
    Target,
    ArrowUpRight,
    ArrowDownRight,
    ChevronRight,
    Activity
} from 'lucide-react';
import {
    getYearlySummaries,
    getMonthlySummaries,
    getCampaigns,
    uploadExcelFile,
    uploadCSVCampaign,
    getStats,
    deleteFile,
    getAllCampaignsForYear
} from '../data/mailingsData';
import QuickAppMenu from '../components/QuickAppMenu';

/**
 * Mailings Dashboard - Panel de Métricas de Email Marketing
 * Full version with all modules from original Canon Dashboard
 * 
 * Features:
 * - YoY Comparison KPIs
 * - Revenue & Deliveries Charts  
 * - Database Statistics
 * - Monthly Detail Grid
 * - Campaign Details Modal
 */

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June',
                'July', 'August', 'September', 'October', 'November', 'December'];

const MONTHS_ES = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
                   'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

const MONTHS_SHORT = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];

const MailingsDashboard = () => {
    const navigate = useNavigate();
    const excelInputRef = useRef(null);
    const csvInputRef = useRef(null);

    // State
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [selectedYear, setSelectedYear] = useState(2025);
    const [selectedMonth, setSelectedMonth] = useState(null);
    const [showCampaignModal, setShowCampaignModal] = useState(false);
    
    // Data
    const [yearlySummaries, setYearlySummaries] = useState([]);
    const [monthlySummaries, setMonthlySummaries] = useState([]);
    const [campaigns, setCampaigns] = useState([]);
    const [allYearCampaigns, setAllYearCampaigns] = useState([]);
    const [stats, setStats] = useState({ totalCampaigns: 0, totalFiles: 0 });

    // CSV Upload
    const [csvYear, setCsvYear] = useState(2025);
    const [csvMonth, setCsvMonth] = useState('January');

    useEffect(() => {
        loadData();
    }, []);

    useEffect(() => {
        if (selectedYear) {
            loadMonthlyData(selectedYear);
            loadAllYearCampaigns(selectedYear);
        }
    }, [selectedYear]);

    useEffect(() => {
        if (selectedYear && selectedMonth) {
            loadCampaigns(selectedYear, selectedMonth);
            setShowCampaignModal(true);
        }
    }, [selectedYear, selectedMonth]);

    const loadData = async () => {
        try {
            setLoading(true);
            const [yearly, statsData] = await Promise.all([
                getYearlySummaries(),
                getStats()
            ]);
            setYearlySummaries(yearly);
            setStats(statsData);
        } catch (error) {
            console.error('Error loading data:', error);
        } finally {
            setLoading(false);
        }
    };

    const loadMonthlyData = async (year) => {
        try {
            const monthly = await getMonthlySummaries(year);
            setMonthlySummaries(monthly);
        } catch (error) {
            console.error('Error loading monthly data:', error);
        }
    };

    const loadAllYearCampaigns = async (year) => {
        try {
            const campaignsData = await getAllCampaignsForYear(year);
            setAllYearCampaigns(campaignsData);
        } catch (error) {
            console.error('Error loading all campaigns:', error);
        }
    };

    const loadCampaigns = async (year, month) => {
        try {
            const campaignsData = await getCampaigns(year, month);
            setCampaigns(campaignsData);
        } catch (error) {
            console.error('Error loading campaigns:', error);
        }
    };

    const handleExcelUpload = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
            setUploading(true);
            await uploadExcelFile(file);
            alert('✅ Excel procesado correctamente');
            await loadData();
        } catch (error) {
            console.error('Error uploading Excel:', error);
            alert('Error subiendo Excel: ' + error.message);
        } finally {
            setUploading(false);
            e.target.value = '';
        }
    };

    const handleCSVUpload = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
            setUploading(true);
            await uploadCSVCampaign(file, csvYear, csvMonth);
            alert(`✅ Campaña ${MONTHS_ES[MONTHS.indexOf(csvMonth)]} ${csvYear} procesada`);
            await loadData();
            await loadMonthlyData(csvYear);
            await loadCampaigns(csvYear, csvMonth);
        } catch (error) {
            console.error('Error uploading CSV:', error);
            alert('Error subiendo CSV: ' + error.message);
        } finally {
            setUploading(false);
            e.target.value = '';
        }
    };

    const formatNumber = (num) => {
        if (!num) return '0';
        return new Intl.NumberFormat('es-CL').format(Math.round(num));
    };

    const formatCurrency = (num) => {
        if (!num) return '$0';
        return '$' + new Intl.NumberFormat('es-CL').format(Math.round(num));
    };
    
    // Abbreviated currency for charts only
    const formatCurrencyShort = (num) => {
        if (!num) return '$0';
        if (num >= 1000000) return `$${(num / 1000000).toFixed(1)}M`;
        if (num >= 1000) return `$${(num / 1000).toFixed(0)}K`;
        return `$${Math.round(num)}`;
    };

    const formatPercent = (num) => {
        if (!num) return '0%';
        const val = num > 1 ? num : num * 100;
        return `${val.toFixed(1)}%`;
    };

    const currentYearData = yearlySummaries.find(y => y.year === selectedYear);
    const prevYearData = yearlySummaries.find(y => y.year === selectedYear - 1);

    // Calculate YoY change
    const getYoYChange = (current, previous) => {
        if (!previous || previous === 0) return null;
        return ((current - previous) / previous * 100).toFixed(1);
    };

    // Extract DB from campaign name - matches original Python extract_database_name
    const extractDB = (campaignName, sends = 0) => {
        if (!campaignName) return 'General';
        
        // Build text corpus from campaign name
        const textCorpus = String(campaignName).toLowerCase();
        
        // Priority 1: Explicit keyword matches
        if (textCorpus.includes('zoomin') || textCorpus.includes('zoom in')) return 'ZoomIn';
        if (textCorpus.includes('secanon') || textCorpus.includes('se canon')) return 'Secanon';
        if (textCorpus.includes('ecommerce') || textCorpus.includes('e-commerce')) return 'Ecommerce';
        if (textCorpus.includes('webinar') || textCorpus.includes('inscritos')) return 'Inscritos Webinar';
        if (textCorpus.includes('empresas') || textCorpus.includes('leads')) return 'Empresas Leads';
        if (textCorpus.includes('laser')) return 'Base Laser';
        if (textCorpus.includes('plotter') || textCorpus.includes('lfp')) return 'Base Plotter';
        if (textCorpus.includes('full frame')) return 'Base Full Frame';
        
        // Priority 2: "Generico" inference based on size
        if (textCorpus.includes('generico') || textCorpus.includes('genérico')) {
            if (sends > 20000) return 'Ecommerce';
            if (sends > 9000) return 'Secanon';
            return 'ZoomIn';
        }
        
        // Priority 3: Infer by send volume (size-based heuristic)
        if (sends > 25000) return 'Ecommerce';
        if (sends > 12000) return 'Secanon';
        if (sends > 5000) return 'ZoomIn';
        
        return 'General';
    };
    
    // Clean campaign name for grouping (like original Python clean_campaign_name)
    const cleanCampaignName = (name) => {
        if (!name) return 'General';
        
        const stopwords = [
            'secanon', 'ecommerce', 'zoomin', 'zoom', 'inscritos', 'webinar',
            'empresas', 'leads', 'laser', 'plotter', 'lfp', 'generico', 'genérico',
            'base', 'mailing', 'copy', 'final', 'ok', 'envio', 'envío', 'db', 'bbdd', 'test'
        ];
        
        let clean = String(name).toLowerCase();
        // Replace separators
        clean = clean.replace(/[-_|:()\[\].]/g, ' ');
        // Remove dates (6-8 digit numbers)
        clean = clean.replace(/\d{6,8}/g, '');
        
        const tokens = clean.split(/\s+/);
        const kept = tokens.filter(t => !stopwords.includes(t) && !/^\d+$/.test(t));
        
        const result = kept.join(' ').trim();
        if (result.length < 2) return name.split(' ')[0] || 'General';
        
        // Capitalize
        return result.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
    };

    // Calculate database statistics from campaigns - only show valid DBs
    const validDBs = ['Ecommerce', 'Secanon', 'ZoomIn', 'Inscritos Webinar', 'Empresas Leads', 'Base Laser', 'Base Plotter', 'Base Full Frame', 'General'];
    
    const dbStats = useMemo(() => {
        if (!allYearCampaigns.length) return [];
        
        const dbMap = {};
        allYearCampaigns.forEach(c => {
            const db = extractDB(c.campaign_name, c.sends || 0);
            if (!dbMap[db]) {
                dbMap[db] = { 
                    count: 0, 
                    sends: 0, 
                    deliveries: 0,
                    opens: 0, 
                    clicks: 0, 
                    revenue: 0,
                    maxSends: 0
                };
            }
            dbMap[db].count++;
            dbMap[db].sends += c.sends || 0;
            dbMap[db].deliveries += c.successful_deliveries || 0;
            dbMap[db].opens += c.opened || 0;
            dbMap[db].clicks += c.people_clicked || 0;
            dbMap[db].revenue += parseFloat(c.revenue) || 0;
            if ((c.sends || 0) > dbMap[db].maxSends) dbMap[db].maxSends = c.sends || 0;
        });

        // Only return valid DBs, filter out "Otros"
        return Object.entries(dbMap)
            .filter(([name]) => validDBs.includes(name))
            .map(([name, data]) => ({
                name,
                ...data,
                openRate: data.deliveries > 0 ? (data.opens / data.deliveries * 100) : 0,
                clickRate: data.deliveries > 0 ? (data.clicks / data.deliveries * 100) : 0
            }))
            .sort((a, b) => b.deliveries - a.deliveries);
    }, [allYearCampaigns]);
    
    // Group campaigns by date and normalized name (like original)
    const groupedCampaigns = useMemo(() => {
        if (!campaigns.length) return [];
        
        const groups = {};
        campaigns.forEach(c => {
            const normalizedName = cleanCampaignName(c.campaign_name);
            const key = (c.date || 'Sin fecha') + '|' + normalizedName;
            
            if (!groups[key]) {
                groups[key] = {
                    date: c.date || 'Sin fecha',
                    campaign: normalizedName,
                    subject: c.subject || '',
                    sends: 0,
                    deliveries: 0,
                    opens: 0,
                    clicks: 0,
                    revenue: 0,
                    items: []
                };
            }
            
            const db = extractDB(c.campaign_name, c.sends || 0);
            groups[key].items.push({
                ...c,
                database: db
            });
            groups[key].sends += c.sends || 0;
            groups[key].deliveries += c.successful_deliveries || 0;
            groups[key].opens += c.opened || 0;
            groups[key].clicks += c.people_clicked || c.total_clicks || 0;
            groups[key].revenue += parseFloat(c.revenue) || 0;
        });
        
        return Object.values(groups).sort((a, b) => {
            // Sort by date descending
            if (a.date === 'Sin fecha') return 1;
            if (b.date === 'Sin fecha') return -1;
            return new Date(b.date) - new Date(a.date);
        });
    }, [campaigns]);

    // Calculate sends per month from campaigns (since monthly_summaries doesn't have this)
    const monthlySends = useMemo(() => {
        const sends = {};
        allYearCampaigns.forEach(c => {
            if (!sends[c.month]) sends[c.month] = 0;
            sends[c.month] += c.sends || 0;
        });
        return sends;
    }, [allYearCampaigns]);

    // Get max values for chart scaling
    const maxDeliveries = Math.max(...monthlySummaries.map(m => m.successful_deliveries || 0));
    const maxRevenue = Math.max(...monthlySummaries.map(m => m.revenue || 0));

    return (
        <div className="min-h-screen bg-[#0a0a0f] flex flex-col relative overflow-hidden">
            {/* Aurora Canvas Background */}
            <canvas
                id="aurora-canvas"
                className="fixed inset-0 pointer-events-none"
                style={{ zIndex: 0 }}
            />

            {/* Header */}
            <header className="relative z-10 bg-white shadow-sm">
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
                                eMailing Dashboard
                            </span>
                            <span className="text-xs text-black/30">CCH eCommerce Report</span>
                        </div>
                        
                        <div className="flex items-center gap-3">
                            {/* Year Selector Pills */}
                            <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
                                {[2026, 2025, 2024, 2023, 2022, 2021].map(year => (
                                    <button
                                        key={year}
                                        onClick={() => setSelectedYear(year)}
                                        className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                                            selectedYear === year
                                                ? 'bg-[#cc0000] text-white'
                                                : 'text-gray-500 hover:text-gray-700'
                                        }`}
                                    >
                                        {year}
                                    </button>
                                ))}
                            </div>
                            <div className="h-4 w-px bg-black/20"></div>
                            <button
                                onClick={loadData}
                                className="p-2 rounded-lg hover:bg-black/5 transition-all cursor-pointer"
                            >
                                <RefreshCw size={16} className={`text-black/40 ${loading ? 'animate-spin' : ''}`} />
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 relative z-10 max-w-[1600px] mx-auto w-full px-6 py-6">
                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <Loader2 size={32} className="animate-spin text-blue-400" />
                    </div>
                ) : (
                    <div className="space-y-6">
                        {/* Top Section: KPI Cards */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="rounded-2xl bg-white/[0.03] backdrop-blur-xl border border-white/10 p-6"
                        >
                            <h2 className="text-xs font-medium text-white/40 uppercase tracking-wider mb-4">
                                Resumen Anual {selectedYear}
                            </h2>
                            
                            {currentYearData ? (
                                <div className="grid grid-cols-6 gap-4">
                                    <KPICard
                                        icon={Mail}
                                        label="Entregas"
                                        value={formatNumber(currentYearData.successful_deliveries)}
                                        change={getYoYChange(currentYearData.successful_deliveries, prevYearData?.successful_deliveries)}
                                        color="blue"
                                    />
                                    <KPICard
                                        icon={Eye}
                                        label="Aperturas"
                                        value={formatNumber(currentYearData.opened)}
                                        change={getYoYChange(currentYearData.opened, prevYearData?.opened)}
                                        color="emerald"
                                    />
                                    <KPICard
                                        icon={Target}
                                        label="Open Rate"
                                        value={formatPercent(currentYearData.open_rate)}
                                        target="20%"
                                        color="cyan"
                                    />
                                    <KPICard
                                        icon={MousePointerClick}
                                        label="Clicks Total"
                                        value={formatNumber(currentYearData.total_clicks)}
                                        change={getYoYChange(currentYearData.total_clicks, prevYearData?.total_clicks)}
                                        color="purple"
                                    />
                                    <KPICard
                                        icon={Users}
                                        label="Usuarios"
                                        value={formatNumber(currentYearData.users)}
                                        change={getYoYChange(currentYearData.users, prevYearData?.users)}
                                        color="pink"
                                    />
                                    <KPICard
                                        icon={DollarSign}
                                        label="Revenue"
                                        value={formatCurrency(currentYearData.revenue)}
                                        change={getYoYChange(currentYearData.revenue, prevYearData?.revenue)}
                                        color="amber"
                                        highlight
                                    />
                                </div>
                            ) : (
                                <p className="text-white/40 text-center py-8">No hay datos para {selectedYear}</p>
                            )}
                        </motion.div>

                        {/* All Charts in One Row */}
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
                            {/* Deliveries & Opens Chart */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 }}
                                className="rounded-2xl bg-white/[0.03] backdrop-blur-xl border border-white/10 p-4"
                            >
                                <div className="flex items-center justify-between mb-3">
                                    <h3 className="text-xs font-medium text-white flex items-center gap-1.5">
                                        <Mail size={14} className="text-blue-400" />
                                        Entregas & Aperturas
                                    </h3>
                                    <div className="flex items-center gap-2">
                                        <div className="flex items-center gap-1">
                                            <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                                            <span className="text-[8px] text-white/40">Ent</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                                            <span className="text-[8px] text-white/40">Ap</span>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="h-36">
                                    <div className="flex items-end justify-between h-full gap-0.5">
                                        {MONTHS.map((month, idx) => {
                                            const data = monthlySummaries.find(m => m.month === month);
                                            const deliveriesHeight = data?.successful_deliveries 
                                                ? (data.successful_deliveries / maxDeliveries * 100) : 0;
                                            const opensHeight = data?.opened 
                                                ? (data.opened / maxDeliveries * 100) : 0;
                                            
                                            return (
                                                <div 
                                                    key={month} 
                                                    className="flex-1 flex flex-col items-center gap-0.5 cursor-pointer group"
                                                    onClick={() => setSelectedMonth(month)}
                                                >
                                                    <div className="relative w-full flex items-end justify-center gap-px h-28">
                                                        <div 
                                                            className="w-1.5 bg-blue-500/80 rounded-t group-hover:bg-blue-400 transition-all"
                                                            style={{ height: `${deliveriesHeight}%` }}
                                                        />
                                                        <div 
                                                            className="w-1.5 bg-emerald-500/80 rounded-t group-hover:bg-emerald-400 transition-all"
                                                            style={{ height: `${opensHeight}%` }}
                                                        />
                                                    </div>
                                                    <span className="text-[7px] text-white/30 group-hover:text-white/60">
                                                        {MONTHS_SHORT[idx].charAt(0)}
                                                    </span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </motion.div>

                            {/* Revenue Monthly */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.15 }}
                                className="rounded-2xl bg-white/[0.03] backdrop-blur-xl border border-white/10 p-4"
                            >
                                <div className="flex items-center justify-between mb-3">
                                    <h3 className="text-xs font-medium text-white flex items-center gap-1.5">
                                        <DollarSign size={14} className="text-amber-400" />
                                        Revenue
                                    </h3>
                                    <span className="text-[10px] text-amber-400/70 num">
                                        {formatCurrencyShort(monthlySummaries.reduce((a, m) => a + (m.revenue || 0), 0))}
                                    </span>
                                </div>
                                
                                <div className="h-36">
                                    <div className="flex items-end justify-between h-full gap-0.5">
                                        {MONTHS.map((month, idx) => {
                                            const data = monthlySummaries.find(m => m.month === month);
                                            const revenue = data?.revenue || 0;
                                            const height = maxRevenue > 0 ? (revenue / maxRevenue * 100) : 0;
                                            const isTop3 = revenue > 0 && [...monthlySummaries]
                                                .sort((a, b) => (b.revenue || 0) - (a.revenue || 0))
                                                .slice(0, 3)
                                                .some(m => m.month === month);
                                            
                                            return (
                                                <div 
                                                    key={month} 
                                                    className="flex-1 flex flex-col items-center cursor-pointer group relative"
                                                    onClick={() => setSelectedMonth(month)}
                                                >
                                                    <div className="absolute -top-1 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                                                        <div className="bg-black/90 border border-amber-500/30 rounded px-1 py-0.5 whitespace-nowrap">
                                                            <span className="text-[8px] text-amber-400 num">{formatCurrencyShort(revenue)}</span>
                                                        </div>
                                                    </div>
                                                    
                                                    <div className="relative w-full flex justify-center h-28 items-end">
                                                        <div 
                                                            className={`w-3 rounded-t transition-all ${
                                                                isTop3 
                                                                    ? 'bg-gradient-to-t from-amber-600 to-amber-400 group-hover:from-amber-500 group-hover:to-amber-300' 
                                                                    : 'bg-gradient-to-t from-amber-900/60 to-amber-700/40 group-hover:from-amber-800/80 group-hover:to-amber-600/60'
                                                            }`}
                                                            style={{ height: `${Math.max(height, revenue > 0 ? 5 : 0)}%` }}
                                                        />
                                                    </div>
                                                    <span className="text-[7px] text-white/30 group-hover:text-white/60 mt-0.5">
                                                        {MONTHS_SHORT[idx].charAt(0)}
                                                    </span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </motion.div>

                            {/* Database Stats */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                                className="rounded-2xl bg-white/[0.03] backdrop-blur-xl border border-white/10 p-4"
                            >
                                <h3 className="text-xs font-medium text-white flex items-center gap-1.5 mb-3">
                                    <Database size={14} className="text-[#cc0000]" />
                                    Bases de Datos
                                </h3>
                                
                                {dbStats.length > 0 ? (
                                    <div className="space-y-2 h-36 overflow-y-auto pr-1">
                                        {dbStats.slice(0, 5).map((db, idx) => (
                                            <div key={idx} className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-all">
                                                <div className="flex items-center justify-between mb-1">
                                                    <span className="text-[10px] font-medium text-white truncate max-w-[80px]">
                                                        {db.name}
                                                    </span>
                                                    <span className="text-[10px] text-emerald-400 num">
                                                        {formatCurrencyShort(db.revenue)}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-2 text-[8px] text-white/40">
                                                    <span className="num">{formatNumber(db.deliveries)}</span>
                                                    <span className="num">OR:{db.openRate.toFixed(0)}%</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-[10px] text-white/40 text-center py-8">
                                        Sin datos
                                    </p>
                                )}
                            </motion.div>

                            {/* Yearly Comparison */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.25 }}
                                className="rounded-2xl bg-white/[0.03] backdrop-blur-xl border border-white/10 p-4"
                            >
                                <h3 className="text-xs font-medium text-white flex items-center gap-1.5 mb-3">
                                    <Activity size={14} className="text-purple-400" />
                                    Comparativa Anual
                                </h3>
                                
                                <div className="space-y-2 h-36 overflow-y-auto pr-1">
                                    {yearlySummaries
                                        .sort((a, b) => b.year - a.year)
                                        .map((year, idx) => {
                                            const maxRev = Math.max(...yearlySummaries.map(y => y.revenue || 0));
                                            const revWidth = year.revenue ? (year.revenue / maxRev * 100) : 0;
                                            
                                            return (
                                                <div 
                                                    key={year.year}
                                                    className={`p-2 rounded-lg transition-all cursor-pointer ${
                                                        selectedYear === year.year 
                                                            ? 'bg-white/10 ring-1 ring-white/20' 
                                                            : 'bg-white/5 hover:bg-white/10'
                                                    }`}
                                                    onClick={() => setSelectedYear(year.year)}
                                                >
                                                    <div className="flex items-center justify-between mb-1">
                                                        <span className={`text-xs font-bold ${
                                                            selectedYear === year.year ? 'text-white' : 'text-white/60'
                                                        }`}>
                                                            {year.year}
                                                        </span>
                                                        <span className="text-[10px] text-emerald-400 num">
                                                            {formatCurrencyShort(year.revenue)}
                                                        </span>
                                                    </div>
                                                    <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                                                        <div 
                                                            className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
                                                            style={{ width: `${revWidth}%` }}
                                                        />
                                                    </div>
                                                    <div className="flex items-center gap-2 mt-1 text-[8px] text-white/40 num">
                                                        <span>{formatNumber(year.successful_deliveries)}</span>
                                                        <span>{formatPercent(year.open_rate)}</span>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                </div>
                            </motion.div>
                        </div>

                        {/* Monthly Detail Grid */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="rounded-2xl bg-white/[0.03] backdrop-blur-xl border border-white/10 overflow-hidden"
                        >
                            <div className="px-6 py-4 bg-gradient-to-r from-gray-500/20 to-gray-600/20 border-b border-white/5">
                                <h3 className="text-sm font-medium text-white flex items-center gap-2">
                                    <BarChart3 size={16} className="text-gray-400" />
                                    Detalle Mensual <span className="text-[#cc0000]">{selectedYear}</span>
                                </h3>
                            </div>

                            <div className="p-6 overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="text-left text-xs text-white/40 border-b border-white/10">
                                            <th className="pb-3 pr-4 font-medium">Mes</th>
                                            <th className="pb-3 px-4 font-medium text-right">Envíos</th>
                                            <th className="pb-3 px-4 font-medium text-right">Entregas</th>
                                            <th className="pb-3 px-4 font-medium text-right">Aperturas</th>
                                            <th className="pb-3 px-4 font-medium text-right">Open Rate</th>
                                            <th className="pb-3 px-4 font-medium text-right">Clicks</th>
                                            <th className="pb-3 px-4 font-medium text-right">Click Rate</th>
                                            <th className="pb-3 px-4 font-medium text-right">Usuarios</th>
                                            <th className="pb-3 pl-4 font-medium text-right">Revenue</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {MONTHS.map((month, idx) => {
                                            const data = monthlySummaries.find(m => m.month === month);
                                            if (!data) return (
                                                <tr key={month} className="border-b border-white/5 text-white/20">
                                                    <td className="py-3 pr-4">{MONTHS_ES[idx]}</td>
                                                    <td colSpan={8} className="py-3 text-center text-xs">—</td>
                                                </tr>
                                            );
                                            
                                            return (
                                                <tr 
                                                    key={month} 
                                                    className="border-b border-white/5 hover:bg-white/5 cursor-pointer transition-colors"
                                                    onClick={() => setSelectedMonth(month)}
                                                >
                                                    <td className="py-3 pr-4 font-medium text-white flex items-center gap-2">
                                                        {MONTHS_ES[idx]}
                                                        <ChevronRight size={14} className="text-white/30" />
                                                    </td>
                                                    <td className="py-3 px-4 text-right text-white/70 text-xs" style={{ fontFamily: "'JetBrains Mono', 'SF Mono', 'Fira Code', monospace", fontVariantNumeric: 'tabular-nums' }}>
                                                        {formatNumber(monthlySends[month] || 0)}
                                                    </td>
                                                    <td className="py-3 px-4 text-right text-white/70 text-xs" style={{ fontFamily: "'JetBrains Mono', 'SF Mono', 'Fira Code', monospace", fontVariantNumeric: 'tabular-nums' }}>
                                                        {formatNumber(data.successful_deliveries)}
                                                    </td>
                                                    <td className="py-3 px-4 text-right text-emerald-400 text-xs" style={{ fontFamily: "'JetBrains Mono', 'SF Mono', 'Fira Code', monospace", fontVariantNumeric: 'tabular-nums' }}>
                                                        {formatNumber(data.opened)}
                                                    </td>
                                                    <td className="py-3 px-4 text-right text-cyan-400 text-xs" style={{ fontFamily: "'JetBrains Mono', 'SF Mono', 'Fira Code', monospace", fontVariantNumeric: 'tabular-nums' }}>
                                                        {formatPercent(data.open_rate)}
                                                    </td>
                                                    <td className="py-3 px-4 text-right text-blue-400 text-xs" style={{ fontFamily: "'JetBrains Mono', 'SF Mono', 'Fira Code', monospace", fontVariantNumeric: 'tabular-nums' }}>
                                                        {formatNumber(data.total_clicks)}
                                                    </td>
                                                    <td className="py-3 px-4 text-right text-purple-400 text-xs" style={{ fontFamily: "'JetBrains Mono', 'SF Mono', 'Fira Code', monospace", fontVariantNumeric: 'tabular-nums' }}>
                                                        {formatPercent(data.click_rate_delivered)}
                                                    </td>
                                                    <td className="py-3 px-4 text-right text-pink-400 text-xs" style={{ fontFamily: "'JetBrains Mono', 'SF Mono', 'Fira Code', monospace", fontVariantNumeric: 'tabular-nums' }}>
                                                        {formatNumber(data.users)}
                                                    </td>
                                                    <td className="py-3 pl-4 text-right text-amber-400 text-xs font-bold" style={{ fontFamily: "'JetBrains Mono', 'SF Mono', 'Fira Code', monospace", fontVariantNumeric: 'tabular-nums' }}>
                                                        {formatCurrency(data.revenue)}
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                        
                                        {/* Totals Row */}
                                        {currentYearData && (
                                            <tr className="bg-white/5 font-bold">
                                                <td className="py-3 pr-4 text-white">TOTAL</td>
                                                <td className="py-3 px-4 text-right text-white text-xs" style={{ fontFamily: "'JetBrains Mono', 'SF Mono', 'Fira Code', monospace", fontVariantNumeric: 'tabular-nums' }}>
                                                    {formatNumber(Object.values(monthlySends).reduce((a, b) => a + b, 0))}
                                                </td>
                                                <td className="py-3 px-4 text-right text-white text-xs" style={{ fontFamily: "'JetBrains Mono', 'SF Mono', 'Fira Code', monospace", fontVariantNumeric: 'tabular-nums' }}>
                                                    {formatNumber(currentYearData.successful_deliveries)}
                                                </td>
                                                <td className="py-3 px-4 text-right text-emerald-400 text-xs" style={{ fontFamily: "'JetBrains Mono', 'SF Mono', 'Fira Code', monospace", fontVariantNumeric: 'tabular-nums' }}>
                                                    {formatNumber(currentYearData.opened)}
                                                </td>
                                                <td className="py-3 px-4 text-right text-cyan-400 text-xs" style={{ fontFamily: "'JetBrains Mono', 'SF Mono', 'Fira Code', monospace", fontVariantNumeric: 'tabular-nums' }}>
                                                    {formatPercent(currentYearData.open_rate)}
                                                </td>
                                                <td className="py-3 px-4 text-right text-blue-400 text-xs" style={{ fontFamily: "'JetBrains Mono', 'SF Mono', 'Fira Code', monospace", fontVariantNumeric: 'tabular-nums' }}>
                                                    {formatNumber(currentYearData.total_clicks)}
                                                </td>
                                                <td className="py-3 px-4 text-right text-purple-400 text-xs" style={{ fontFamily: "'JetBrains Mono', 'SF Mono', 'Fira Code', monospace", fontVariantNumeric: 'tabular-nums' }}>
                                                    {formatPercent(currentYearData.click_rate_delivered)}
                                                </td>
                                                <td className="py-3 px-4 text-right text-pink-400 text-xs" style={{ fontFamily: "'JetBrains Mono', 'SF Mono', 'Fira Code', monospace", fontVariantNumeric: 'tabular-nums' }}>
                                                    {formatNumber(currentYearData.users)}
                                                </td>
                                                <td className="py-3 pl-4 text-right text-amber-400 text-sm" style={{ fontFamily: "'JetBrains Mono', 'SF Mono', 'Fira Code', monospace", fontVariantNumeric: 'tabular-nums' }}>
                                                    {formatCurrency(currentYearData.revenue)}
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </motion.div>
                    </div>
                )}
            </main>

            {/* Campaign Detail Modal */}
            <AnimatePresence>
                {showCampaignModal && selectedMonth && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-8"
                        onClick={() => {
                            setShowCampaignModal(false);
                            setSelectedMonth(null);
                        }}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-[#0a0a0f] rounded-2xl border border-white/10 w-full max-w-5xl max-h-[80vh] overflow-hidden"
                        >
                            <div className="px-6 py-4 bg-gradient-to-r from-[#cc0000]/20 to-red-600/20 border-b border-white/5 flex items-center justify-between">
                                <h2 className="text-base font-medium text-white">
                                    Campañas - {MONTHS_ES[MONTHS.indexOf(selectedMonth)]} {selectedYear}
                                    <span className="text-xs text-white/50 ml-3">
                                        {groupedCampaigns.length} Campañas ({campaigns.length} envíos)
                                    </span>
                                </h2>
                                <button
                                    onClick={() => {
                                        setShowCampaignModal(false);
                                        setSelectedMonth(null);
                                    }}
                                    className="text-white/50 hover:text-white text-xl"
                                >
                                    ×
                                </button>
                            </div>

                            <div className="p-6 overflow-auto max-h-[calc(80vh-80px)]">
                                {groupedCampaigns.length > 0 ? (
                                    <div className="space-y-2">
                                        {groupedCampaigns.map((group, idx) => (
                                            <CampaignGroup 
                                                key={idx} 
                                                group={group} 
                                                formatNumber={formatNumber}
                                                formatCurrency={formatCurrency}
                                            />
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-sm text-white/40 text-center py-8">
                                        No hay campañas para este mes
                                    </p>
                                )}
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {uploading && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
                    <div className="bg-white rounded-2xl p-8 flex flex-col items-center gap-4">
                        <Loader2 size={32} className="animate-spin text-blue-500" />
                        <p className="text-sm text-gray-600">Procesando archivo...</p>
                    </div>
                </div>
            )}
        </div>
    );
};

// KPI Card Component with YoY comparison
const KPICard = ({ icon: Icon, label, value, change, target, color, highlight }) => {
    const colors = {
        blue: 'from-blue-500/20 to-indigo-500/20 border-blue-500/30',
        emerald: 'from-emerald-500/20 to-teal-500/20 border-emerald-500/30',
        cyan: 'from-cyan-500/20 to-blue-500/20 border-cyan-500/30',
        purple: 'from-purple-500/20 to-pink-500/20 border-purple-500/30',
        pink: 'from-pink-500/20 to-rose-500/20 border-pink-500/30',
        amber: 'from-amber-500/20 to-orange-500/20 border-amber-500/30'
    };

    const iconColors = {
        blue: 'text-blue-400',
        emerald: 'text-emerald-400',
        cyan: 'text-cyan-400',
        purple: 'text-purple-400',
        pink: 'text-pink-400',
        amber: 'text-amber-400'
    };

    return (
        <div className={`rounded-xl bg-gradient-to-br ${colors[color]} border backdrop-blur-xl p-4 ${highlight ? 'ring-2 ring-amber-400/50' : ''}`}>
            <div className="flex items-center gap-2 mb-2">
                <Icon size={16} className={iconColors[color]} />
                <span className="text-xs text-white/50">{label}</span>
            </div>
            <div className={`text-lg font-bold ${highlight ? 'text-amber-400' : 'text-white'}`}>
                {value}
            </div>
            {change !== null && change !== undefined && (
                <div className={`flex items-center gap-1 mt-1 text-xs ${
                    parseFloat(change) >= 0 ? 'text-emerald-400' : 'text-red-400'
                }`}>
                    {parseFloat(change) >= 0 ? (
                        <ArrowUpRight size={12} />
                    ) : (
                        <ArrowDownRight size={12} />
                    )}
                    <span>{Math.abs(parseFloat(change))}% vs año ant.</span>
                </div>
            )}
            {target && (
                <div className="flex items-center gap-1 mt-1 text-xs text-white/40">
                    <Target size={10} />
                    <span>Target: {target}</span>
                </div>
            )}
        </div>
    );
};

// Campaign Group Component - shows grouped campaigns with expandable details
const CampaignGroup = ({ group, formatNumber, formatCurrency }) => {
    const [expanded, setExpanded] = useState(false);
    const openRate = group.deliveries > 0 ? (group.opens / group.deliveries * 100).toFixed(1) : 0;
    
    return (
        <div className="border border-white/10 rounded-lg overflow-hidden">
            {/* Group Header - Clickable */}
            <div 
                className="flex items-center gap-4 p-3 bg-white/5 cursor-pointer hover:bg-white/10 transition-colors"
                onClick={() => setExpanded(!expanded)}
            >
                <ChevronRight 
                    size={14} 
                    className={`text-white/40 transition-transform ${expanded ? 'rotate-90' : ''}`} 
                />
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3">
                        <span className="text-xs text-white/50 font-mono">{group.date}</span>
                        <span className="text-sm font-medium text-white truncate">{group.campaign}</span>
                        <span className="text-[10px] text-white/40 bg-white/10 px-2 py-0.5 rounded">
                            {group.items.length} envío{group.items.length > 1 ? 's' : ''}
                        </span>
                    </div>
                    {group.subject && (
                        <div className="text-xs text-white/40 truncate mt-1 italic">{group.subject}</div>
                    )}
                </div>
                <div className="flex items-center gap-6 text-xs">
                    <div className="text-right">
                        <div className="text-white/50">Entregas</div>
                        <div className="text-white font-mono">{formatNumber(group.deliveries)}</div>
                    </div>
                    <div className="text-right">
                        <div className="text-white/50">Aperturas</div>
                        <div className="text-emerald-400 font-mono">{formatNumber(group.opens)}</div>
                    </div>
                    <div className="text-right">
                        <div className="text-white/50">OR%</div>
                        <div className={`font-mono ${parseFloat(openRate) > 20 ? 'text-emerald-400' : 'text-white/60'}`}>
                            {openRate}%
                        </div>
                    </div>
                    <div className="text-right">
                        <div className="text-white/50">Clicks</div>
                        <div className="text-blue-400 font-mono">{formatNumber(group.clicks)}</div>
                    </div>
                    <div className="text-right w-20">
                        <div className="text-white/50">Revenue</div>
                        <div className={`font-mono font-bold ${group.revenue > 0 ? 'text-amber-400' : 'text-white/30'}`}>
                            {group.revenue > 0 ? formatCurrency(group.revenue) : '-'}
                        </div>
                    </div>
                </div>
            </div>
            
            {/* Expanded Details */}
            {expanded && (
                <div className="bg-black/20 border-t border-white/5">
                    <table className="w-full text-xs">
                        <thead>
                            <tr className="text-white/30 border-b border-white/5">
                                <th className="px-3 py-2 text-left font-medium">Campaña</th>
                                <th className="px-3 py-2 text-left font-medium">DB</th>
                                <th className="px-3 py-2 text-left font-medium">Subject</th>
                                <th className="px-3 py-2 text-right font-medium">Envíos</th>
                                <th className="px-3 py-2 text-right font-medium">Entregas</th>
                                <th className="px-3 py-2 text-right font-medium">Aperturas</th>
                                <th className="px-3 py-2 text-right font-medium">Clicks</th>
                                <th className="px-3 py-2 text-right font-medium">Revenue</th>
                            </tr>
                        </thead>
                        <tbody>
                            {group.items.map((item, idx) => {
                                const itemOR = item.successful_deliveries > 0 
                                    ? ((item.opened / item.successful_deliveries) * 100).toFixed(1) 
                                    : 0;
                                return (
                                    <tr key={idx} className="border-b border-white/5 hover:bg-white/5">
                                        <td className="px-3 py-2 text-white/70 max-w-[150px] truncate">
                                            {item.campaign_name}
                                        </td>
                                        <td className="px-3 py-2">
                                            <span className="bg-white/10 text-white/60 px-2 py-0.5 rounded text-[10px]">
                                                {item.database || '-'}
                                            </span>
                                        </td>
                                        <td className="px-3 py-2 text-white/40 max-w-[120px] truncate italic">
                                            {item.subject || '-'}
                                        </td>
                                        <td className="px-3 py-2 text-right text-white/50 font-mono">
                                            {formatNumber(item.sends)}
                                        </td>
                                        <td className="px-3 py-2 text-right text-white/70 font-mono">
                                            {formatNumber(item.successful_deliveries)}
                                        </td>
                                        <td className="px-3 py-2 text-right font-mono">
                                            <span className="text-emerald-400">{formatNumber(item.opened)}</span>
                                            <span className="text-white/30 ml-1">({itemOR}%)</span>
                                        </td>
                                        <td className="px-3 py-2 text-right text-blue-400 font-mono">
                                            {formatNumber(item.total_clicks || item.people_clicked || 0)}
                                        </td>
                                        <td className="px-3 py-2 text-right font-mono">
                                            {item.revenue > 0 
                                                ? <span className="text-amber-400">{formatCurrency(item.revenue)}</span>
                                                : <span className="text-white/20">-</span>
                                            }
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}
            
            {/* Quick App Menu */}
            <QuickAppMenu />
        </div>
    );
};

export default MailingsDashboard;
