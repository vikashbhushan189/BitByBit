import React, { useState, useEffect, createContext, useContext } from 'react';
import { Link } from 'react-router-dom';
import { 
    BookOpen, CheckCircle, Clock, Trophy, ChevronDown, Menu, X, 
    GraduationCap, ArrowRight, Monitor, Cpu, FileText, Cloud,
    Atom, Stethoscope, Building2, Scale, Briefcase, Globe, Code,
    BrainCircuit, Zap, Users, Moon, Sun, LayoutGrid, Calculator,
    Landmark, Gavel, Plane, Microscope, PenTool, TrendingUp
} from 'lucide-react';
import api from '../api/axios';
import { useTheme } from '../hooks/useTheme';

// ... [NAV_LINKS constant remains exactly the same as your code] ...
const NAV_LINKS = [
    {
        label: "All Exams",
        type: "mega_tabs",  
        categories: [
            {
                id: "neet",
                name: "NEET",
                items: [
                    { name: "Class 11", icon: <Stethoscope size={20} className="text-blue-500"/> },
                    { name: "Class 12", icon: <Stethoscope size={20} className="text-blue-500"/> },
                    { name: "Dropper", icon: <Stethoscope size={20} className="text-blue-500"/> }
                ]
            },
            {
                id: "jee",
                name: "IIT JEE",
                items: [
                    { name: "Class 11", icon: <Atom size={20} className="text-orange-500"/> },
                    { name: "Class 12", icon: <Atom size={20} className="text-orange-500"/> },
                    { name: "Dropper", icon: <Atom size={20} className="text-orange-500"/> }
                ]
            },
            {
                id: "foundation",
                name: "Pre Foundation",
                items: [
                    { name: "Class 9", icon: <BookOpen size={20} className="text-green-500"/> },
                    { name: "Class 10", icon: <BookOpen size={20} className="text-green-500"/> },
                    { name: "Olympiad", icon: <Trophy size={20} className="text-yellow-500"/> }
                ]
            },
            {
                id: "school",
                name: "School Boards",
                items: [
                    { name: "CBSE", icon: <BookOpen size={20} className="text-purple-500"/> },
                    { name: "ICSE", icon: <BookOpen size={20} className="text-purple-500"/> },
                    { name: "UP Board", icon: <Globe size={20} className="text-pink-500"/> },
                    { name: "Maharashtra Board", icon: <Globe size={20} className="text-pink-500"/> }
                ]
            },
            {
                id: "upsc",
                name: "UPSC",
                items: [
                    { name: "Prelims", icon: <Landmark size={20} className="text-orange-600"/> },
                    { name: "Mains", icon: <Landmark size={20} className="text-orange-600"/> },
                    { name: "Optional", icon: <BookOpen size={20} className="text-orange-600"/> }
                ]
            },
            {
                id: "govt",
                name: "Govt Job Exams",
                items: [
                    { name: "SSC", icon: <Building2 size={20} className="text-red-500"/> },
                    { name: "Banking", icon: <Briefcase size={20} className="text-indigo-500"/> },
                    { name: "Teaching", icon: <Users size={20} className="text-green-600"/> },
                    { name: "Judiciary", icon: <Gavel size={20} className="text-yellow-600"/> }
                ]
            },
            {
                id: "defence",
                name: "Defence",
                items: [
                    { name: "NDA", icon: <CheckCircle size={20} className="text-teal-500"/> },
                    { name: "CDS", icon: <CheckCircle size={20} className="text-teal-500"/> },
                    { name: "AFCAT", icon: <Plane size={20} className="text-teal-500"/> },
                    { name: "Agniveer", icon: <CheckCircle size={20} className="text-teal-500"/> }
                ]
            },
            {
                id: "ca",
                name: "CA",
                items: [
                    { name: "Foundation", icon: <Calculator size={20} className="text-blue-600"/> },
                    { name: "Intermediate", icon: <Calculator size={20} className="text-blue-600"/> },
                    { name: "Final", icon: <Calculator size={20} className="text-blue-600"/> }
                ]
            },
            {
                id: "olympiad",
                name: "Olympiad",
                items: [
                    { name: "NSO", icon: <Trophy size={20} className="text-yellow-500"/> },
                    { name: "IMO", icon: <Trophy size={20} className="text-yellow-500"/> },
                    { name: "NTSE", icon: <Trophy size={20} className="text-yellow-500"/> }
                ]
            },
            {
                id: "mba",
                name: "MBA",
                items: [
                    { name: "CAT", icon: <TrendingUp size={20} className="text-purple-600"/> },
                    { name: "XAT", icon: <TrendingUp size={20} className="text-purple-600"/> },
                    { name: "MAT", icon: <TrendingUp size={20} className="text-purple-600"/> }
                ]
            },
            {
                id: "psc",
                name: "State PSC",
                items: [
                    { name: "UPPSC", icon: <Landmark size={20} className="text-orange-500"/> },
                    { name: "BPSC", icon: <Landmark size={20} className="text-orange-500"/> },
                    { name: "MPPSC", icon: <Landmark size={20} className="text-orange-500"/> }
                ]
            },
            {
                id: "commerce",
                name: "Commerce",
                items: [
                    { name: "Class 11", icon: <Calculator size={20} className="text-green-500"/> },
                    { name: "Class 12", icon: <Calculator size={20} className="text-green-500"/> },
                    { name: "CUET Commerce", icon: <Calculator size={20} className="text-green-500"/> }
                ]
            },
            {
                id: "gate",
                name: "GATE",
                items: [
                    { name: "CS & IT", icon: <Cpu size={20} className="text-red-500"/> },
                    { name: "Mechanical", icon: <Cpu size={20} className="text-red-500"/> },
                    { name: "Civil", icon: <Cpu size={20} className="text-red-500"/> },
                    { name: "Electrical", icon: <Zap size={20} className="text-yellow-500"/> }
                ]
            },
            {
                id: "cuet",
                name: "CUET",
                items: [
                    { name: "Science", icon: <Atom size={20} className="text-blue-500"/> },
                    { name: "Commerce", icon: <Calculator size={20} className="text-green-500"/> },
                    { name: "Arts", icon: <PenTool size={20} className="text-pink-500"/> }
                ]
            },
            {
                id: "aeje",
                name: "AE/JE",
                items: [
                    { name: "SSC JE", icon: <Cpu size={20} className="text-slate-600"/> },
                    { name: "RRB JE", icon: <Monitor size={20} className="text-slate-600"/> }
                ]
            },
            {
                id: "jam",
                name: "IIT JAM & CSIR NET",
                items: [
                    { name: "Physics", icon: <Atom size={20} className="text-indigo-500"/> },
                    { name: "Maths", icon: <Calculator size={20} className="text-indigo-500"/> },
                    { name: "Life Sciences", icon: <Microscope size={20} className="text-green-500"/> }
                ]
            },
            {
                id: "law",
                name: "LAW",
                items: [
                    { name: "CLAT", icon: <Scale size={20} className="text-slate-700"/> },
                    { name: "AILET", icon: <Scale size={20} className="text-slate-700"/> },
                    { name: "Judiciary", icon: <Gavel size={20} className="text-yellow-700"/> }
                ]
            },
            {
                id: "ese",
                name: "ESE GATE",
                items: [
                    { name: "Prelims", icon: <Cpu size={20} className="text-blue-700"/> },
                    { name: "Mains", icon: <Cpu size={20} className="text-blue-700"/> }
                ]
            },
            {
                id: "ipmat",
                name: "IPMAT",
                items: [
                    { name: "IIM Indore", icon: <GraduationCap size={20} className="text-blue-800"/> },
                    { name: "IIM Rohtak", icon: <GraduationCap size={20} className="text-blue-800"/> }
                ]
            },
            {
                id: "ielts",
                name: "IELTS",
                items: [
                    { name: "Academic", icon: <Globe size={20} className="text-cyan-500"/> },
                    { name: "General", icon: <Globe size={20} className="text-cyan-500"/> }
                ]
            }
        ]
    },
    {
        label: "India's Update",
        type: "link",
        to: "/news"
    },
    {
        label: "AI Tools",
        type: "dropdown",
        items: [
            { name: "AI Summarizer", icon: <FileText size={16}/> },
            { name: "Video to Text", icon: <Monitor size={16}/> },
            { name: "Mind Map Generator", icon: <Cpu size={16}/> },
            { name: "Auto-Notes Maker", icon: <BookOpen size={16}/> }
        ]
    },
    {
        label: "Test Series",
        type: "dropdown",
        items: [
            { name: "GATE Mock Tests" },
            { name: "SSC CGL Tier-1" },
            { name: "Banking Prelims" },
            { name: "UGC NET Paper 1" }
        ]
    },
    {
        label: "Full Length PYQs",
        type: "dropdown",
        items: [
            { name: "JEE Advanced PYQ" },
            { name: "NEET Previous Years" },
            { name: "UPSC Prelims PYQ" },
            { name: "GATE CS 2010-2024" }
        ]
    },
    {
        label: "Power Batch",
        type: "text",
    }
];

const LandingPage = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [activeDropdown, setActiveDropdown] = useState(null);
    const [showAd, setShowAd] = useState(true);
    const [banners, setBanners] = useState([]);
    const [activeTab, setActiveTab] = useState(0);
    const [currentAdIndex, setCurrentAdIndex] = useState(0);
    const { theme, toggleTheme } = useTheme(); 
    
    useEffect(() => {
        api.get('banners/').then(res => setBanners(res.data)).catch(() => {});
    }, []);

    useEffect(() => {
        if (banners.length <= 1) return;
        const timer = setInterval(() => {
            setCurrentAdIndex(prev => (prev + 1) % banners.length);
        }, 4000); 
        return () => clearInterval(timer);
    }, [banners]);

    const activeBanner = banners[currentAdIndex];

    return (
        <div className="bg-white dark:bg-slate-900 font-sans text-slate-800 dark:text-slate-200 transition-colors duration-300">
            
            {/* --- NAVIGATION BAR --- */}
            <nav className="sticky top-0 z-50 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 shadow-sm transition-colors">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-20">
                        
                        {/* Logo */}
                        <div className="flex-shrink-0 flex items-center gap-2 cursor-pointer">
                            <div className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 p-2 rounded-lg transition-colors">
                                <GraduationCap size={24} />
                            </div>
                            <span className="font-black text-2xl tracking-tighter text-slate-900 dark:text-white">
                                <span className="text-blue-600">Bit</span>byBit
                            </span>
                        </div>

                        {/* Desktop Menu */}
                        <div className="hidden lg:flex items-center space-x-2">
                            {NAV_LINKS.map((link, idx) => (
                                <div 
                                    key={idx}
                                    className="relative group"
                                    onMouseEnter={() => setActiveDropdown(idx)}
                                    onMouseLeave={() => setActiveDropdown(null)}
                                >
                                    <button className={`px-4 py-2.5 rounded-lg text-sm font-bold flex items-center gap-1.5 transition-all
                                        ${activeDropdown === idx 
                                            ? 'bg-blue-50 dark:bg-slate-800 text-blue-600' 
                                            : 'text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-50 dark:hover:bg-slate-800'}`}>
                                        {link.label}
                                        {['mega_tabs', 'dropdown'].includes(link.type) && <ChevronDown size={14} className={`mt-0.5 transition-transform duration-200 ${activeDropdown === idx ? 'rotate-180' : ''}`}/>}
                                    </button>

                                    {/* DROPDOWNS (Mega Tabs & Simple Dropdowns) */}
                                    {activeDropdown === idx && (
                                        <div className="absolute top-full left-0 pt-2 w-max animate-in fade-in slide-in-from-top-2 duration-200">
                                            
                                            {/* TYPE 1: MEGA TABS */}
                                            {link.type === 'mega_tabs' && (
                                                <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-100 dark:border-slate-700 flex overflow-hidden w-[700px] -ml-20">
                                                    {/* Sidebar */}
                                                    <div className="w-1/3 bg-slate-50 dark:bg-slate-900 border-r border-slate-100 dark:border-slate-700 p-2">
                                                        {link.categories.map((cat, cIdx) => (
                                                            <div 
                                                                key={cIdx}
                                                                onMouseEnter={() => setActiveTab(cIdx)}
                                                                className={`px-4 py-3 rounded-xl text-sm font-bold cursor-pointer flex justify-between items-center transition-all mb-1
                                                                    ${activeTab === cIdx 
                                                                        ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-sm' 
                                                                        : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-700 dark:hover:text-slate-200'}
                                                                `}
                                                            >
                                                                {cat.name}
                                                                {activeTab === cIdx && <div className="w-1.5 h-1.5 rounded-full bg-blue-600"></div>}
                                                            </div>
                                                        ))}
                                                    </div>

                                                    {/* Right Content */}
                                                    <div className="w-2/3 p-6 bg-white dark:bg-slate-800">
                                                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 border-b border-slate-100 dark:border-slate-700 pb-2">
                                                            {link.categories[activeTab].name}
                                                        </h4>
                                                        <div className="grid grid-cols-2 gap-3">
                                                            {link.categories[activeTab].items.map((item, iIdx) => (
                                                                <div key={iIdx} className="flex items-center gap-3 p-3 rounded-xl border border-slate-100 dark:border-slate-700 hover:border-blue-200 dark:hover:border-blue-500 hover:shadow-md transition-all cursor-pointer group bg-slate-50/50 dark:bg-slate-900/50 hover:bg-white dark:hover:bg-slate-900">
                                                                    <div className="bg-white dark:bg-slate-800 p-2 rounded-lg shadow-sm group-hover:scale-110 transition-transform">
                                                                        {item.icon}
                                                                    </div>
                                                                    <span className="text-sm font-bold text-slate-700 dark:text-slate-300 group-hover:text-blue-700 dark:group-hover:text-blue-400">{item.name}</span>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>
                                            )}

                                            {/* TYPE 2: SIMPLE DROPDOWN */}
                                            {link.type === 'dropdown' && (
                                                <div className="bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-100 dark:border-slate-700 p-2 w-64">
                                                    {link.items.map((item, iIdx) => (
                                                        <div key={iIdx} className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 cursor-pointer group">
                                                            {item.icon && <span className="text-slate-400 group-hover:text-blue-500">{item.icon}</span>}
                                                            <span className="text-sm font-medium text-slate-700 dark:text-slate-300 group-hover:text-blue-700 dark:group-hover:text-blue-400">{item.name}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>

                        {/* Right Side: Theme Toggle & Auth */}
                        <div className="hidden lg:flex items-center gap-4">
                            <button 
                                onClick={toggleTheme}
                                className="p-2 rounded-full text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                                title={theme === 'dark' ? "Switch to Light Mode" : "Switch to Dark Mode"}
                            >
                                {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
                            </button>

                            <Link to="/login" className="text-slate-600 dark:text-slate-300 font-bold hover:text-blue-600 dark:hover:text-blue-400 px-4 py-2 transition-colors">Login</Link>
                            <Link to="/register" className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2.5 rounded-xl font-bold transition-all shadow-lg shadow-blue-200 dark:shadow-none hover:-translate-y-0.5">
                                Register
                            </Link>
                        </div>

                        {/* Mobile Menu Button */}
                        <div className="lg:hidden flex items-center gap-4">
                             <button onClick={toggleTheme} className="p-2 text-slate-600 dark:text-slate-300">
                                {theme === 'dark' ? <Sun size={24} /> : <Moon size={24} />}
                            </button>
                            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 text-slate-600 dark:text-slate-300">
                                {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile Menu Drawer */}
                {isMobileMenuOpen && (
                    <div className="lg:hidden bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 absolute w-full left-0 shadow-xl max-h-[80vh] overflow-y-auto">
                        <div className="p-4 space-y-2">
                            {NAV_LINKS.map((link, idx) => (
                                <div key={idx} className="border-b border-slate-50 dark:border-slate-800 pb-2 last:border-0">
                                    <div className="font-bold text-slate-800 dark:text-slate-200 py-2">{link.label}</div>
                                    
                                    {link.type === 'mega_tabs' && (
                                        <div className="pl-4 space-y-4 mt-2">
                                            {link.categories.map((cat, cIdx) => (
                                                <div key={cIdx}>
                                                    <div className="text-xs font-bold text-blue-500 uppercase mb-2">{cat.name}</div>
                                                    <div className="grid grid-cols-2 gap-2">
                                                        {cat.items.map((item, iIdx) => (
                                                            <div key={iIdx} className="text-sm text-slate-500 dark:text-slate-400 flex items-center gap-2 p-2 bg-slate-50 dark:bg-slate-800 rounded">
                                                                {item.name}
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))}
                            <div className="flex flex-col gap-3 mt-6 pt-4 border-t border-slate-100 dark:border-slate-800">
                                <Link to="/login" className="w-full text-center border-2 border-slate-100 dark:border-slate-700 py-3 rounded-xl font-bold text-slate-700 dark:text-slate-300">Login</Link>
                                <Link to="/register" className="w-full text-center bg-blue-600 text-white py-3 rounded-xl font-bold">Register</Link>
                            </div>
                        </div>
                    </div>
                )}
            </nav>

            {/* --- AD BANNER --- */}
            {activeBanner && showAd && (
                <div className={`relative bg-gradient-to-r from-${activeBanner.bg_gradient_from} to-${activeBanner.bg_gradient_to} text-white p-3 md:py-4 transition-all duration-500 ease-in-out`}>
                    <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 relative z-10 px-4">
                        <div className="text-center md:text-left flex-1">
                            <span className="bg-white/20 text-xs font-bold px-2 py-1 rounded mr-3 uppercase tracking-wider hidden md:inline-block">New</span>
                            <span className="font-bold text-sm md:text-base">{activeBanner.title}</span>
                            <span className="hidden md:inline mx-2">•</span>
                            <span className="text-sm opacity-90">{activeBanner.description}</span>
                        </div>
                        <div className="flex items-center gap-4">
                            <Link to={activeBanner.link} className="bg-white text-slate-900 px-4 py-1.5 rounded-full text-xs font-bold hover:bg-slate-100 transition-colors shadow-sm whitespace-nowrap">
                                {activeBanner.button_text}
                            </Link>
                            <button onClick={() => setShowAd(false)} className="text-white/60 hover:text-white">
                                <X size={18} />
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* --- HERO SECTION --- */}
            <header className="relative bg-slate-900 text-white py-24 px-6 overflow-hidden">
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-600/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-12 relative z-10">
                    <div className="md:w-1/2 space-y-6">
                        <div className="inline-block bg-white/10 backdrop-blur-md border border-white/20 px-4 py-1.5 rounded-full text-sm font-medium text-blue-300">
                            🚀 New Batch for GATE 2026 Live Now!
                        </div>
                        <h1 className="text-5xl md:text-7xl font-extrabold leading-tight">
                            India's Most <br/>
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">
                                Loved EdTech.
                            </span>
                        </h1>
                        <p className="text-slate-400 text-lg leading-relaxed max-w-lg">
                            We don't just teach; we transform. Join the revolution of affordable, high-quality education for every Indian student.
                        </p>
                        <div className="flex gap-4 pt-4">
                            <Link to="/register" className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-4 rounded-xl font-bold transition-all flex items-center gap-2 shadow-lg shadow-blue-900/50">
                                Start Learning <ArrowRight size={20}/>
                            </Link>
                        </div>
                    </div>
                    <div className="md:w-1/2">
                        {/* 3D Floating Elements */}
                        <div className="relative bg-gradient-to-br from-slate-800 to-slate-900 p-8 rounded-3xl border border-slate-700 shadow-2xl">
                            <div className="flex items-center justify-between mb-8">
                                <div className="flex gap-2"><div className="w-3 h-3 rounded-full bg-red-500"/><div className="w-3 h-3 rounded-full bg-yellow-500"/><div className="w-3 h-3 rounded-full bg-green-500"/></div>
                                <div className="text-slate-500 text-xs font-mono">live_class.mp4</div>
                            </div>
                            <div className="bg-slate-950 rounded-xl h-64 flex items-center justify-center border border-slate-800 relative overflow-hidden group">
                                <div className="absolute inset-0 bg-blue-600/10 group-hover:bg-blue-600/20 transition-colors"></div>
                                <div className="w-16 h-16 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center cursor-pointer hover:scale-110 transition-transform">
                                    <div className="w-0 h-0 border-t-[10px] border-t-transparent border-l-[20px] border-l-white border-b-[10px] border-b-transparent ml-1"></div>
                                </div>
                            </div>
                            <div className="mt-6 flex gap-4">
                                <div className="flex-1 h-2 bg-slate-700 rounded-full overflow-hidden">
                                    <div className="h-full w-2/3 bg-blue-500"></div>
                                </div>
                                <span className="text-xs text-slate-400">65% Complete</span>
                            </div>
                        </div>
                    </div>
                </div>
            </header>



            {/* --- FEATURES GRID (Existing) --- */}
            <section className="py-24 px-6 bg-slate-50 dark:bg-slate-900 transition-colors">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">Why Choose Bit by Bit?</h2>
                        <p className="text-slate-500 dark:text-slate-400">Structured courses, endless practice, and AI-powered insights.</p>
                    </div>
                    <div className="grid md:grid-cols-3 gap-8">
                        <FeatureCard icon={<BookOpen size={24} className="text-white"/>} color="bg-blue-600" title="Comprehensive Notes" desc="Detailed chapter-wise notes curated by top faculties."/>
                        <FeatureCard icon={<Clock size={24} className="text-white"/>} color="bg-purple-600" title="Real-time Mock Tests" desc="Practice in an actual exam-like environment with negative marking."/>
                        <FeatureCard icon={<Trophy size={24} className="text-white"/>} color="bg-emerald-600" title="Performance Analysis" desc="Track your weak areas and improve bit by bit every day."/>
                    </div>
                </div>
            </section>

             {/* --- PHILOSOPHY SECTION (Existing) --- */}
             <section className="py-24 bg-white dark:bg-slate-800 px-6 relative overflow-hidden transition-colors">
                <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] dark:bg-[radial-gradient(#374151_1px,transparent_1px)] [background-size:16px_16px] opacity-50"></div>
                <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16 relative z-10">
                    <div className="lg:w-1/2 relative group">
                        <div className="absolute -inset-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl blur-xl opacity-30 group-hover:opacity-50 transition-opacity duration-500"></div>
                        <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-slate-100 dark:border-slate-700 bg-white dark:bg-slate-900">
                            <img src="/assets/active_learning_comparison.png" alt="Active vs Passive" className="w-full h-auto object-cover transform transition-transform duration-700 hover:scale-105" />
                            <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-slate-900/90 to-transparent p-6">
                                <p className="text-white font-bold text-lg">Scientific Fact:</p>
                                <p className="text-slate-300 text-sm">Active recall builds stronger neural pathways.</p>
                            </div>
                        </div>
                    </div>
                    <div className="lg:w-1/2 space-y-8">
                        <div className="inline-block bg-emerald-100 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-200 px-4 py-1.5 rounded-full text-sm font-bold uppercase tracking-wider">The Science of Learning</div>
                        <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white leading-tight">
                            Don't let them just <span className="text-red-500 decoration-2 underline-offset-4">watch</span>. <br/>
                            Help them <span className="text-blue-600 dark:text-blue-400">Learn.</span>
                        </h2>
                        <p className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
                            Video lectures are easy, but **low retention**. Our platform brings back active learning to increase IQ and cognitive function.
                        </p>
                        <div className="space-y-6">
                            <div className="flex gap-4">
                                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-xl flex items-center justify-center shrink-0 text-blue-600 dark:text-blue-300"><BrainCircuit size={24} /></div>
                                <div>
                                    <h3 className="font-bold text-lg text-slate-800 dark:text-white">Boosts Cognitive Function</h3>
                                    <p className="text-slate-500 dark:text-slate-400 text-sm">Reading engages the prefrontal cortex, improving focus.</p>
                                </div>
                            </div>
                             <div className="flex gap-4">
                                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-xl flex items-center justify-center shrink-0 text-purple-600 dark:text-purple-300"><Zap size={24} /></div>
                                <div>
                                    <h3 className="font-bold text-lg text-slate-800 dark:text-white">Active vs. Passive</h3>
                                    <p className="text-slate-500 dark:text-slate-400 text-sm">Students who solve problems score <strong>2x higher</strong>.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

                        {/* --- NEW SECTION: ALL EXAM CATEGORIES --- */}
            <section className="py-24 px-6 bg-white dark:bg-slate-800 border-b border-slate-100 dark:border-slate-800">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <div className="inline-flex items-center gap-2 bg-blue-50 dark:bg-slate-700 px-4 py-1.5 rounded-full text-blue-600 dark:text-blue-300 font-bold text-sm mb-4">
                            <LayoutGrid size={16} /> Exam Categories
                        </div>
                        <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white mb-4">
                            Choose Your Goal
                        </h2>
                        <p className="text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">
                            Bit by Bit prepares students for a wide range of exams. Find your category and start your journey today.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {/* Logic: Show 'displayedCategories' based on toggle state.
                            Includes animation class for smooth entry when expanding.
                        */}
                        {displayedCategories.map((category, idx) => (
                            <div 
                                key={idx} 
                                className="bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-700 rounded-2xl p-6 hover:shadow-xl hover:border-blue-200 dark:hover:border-slate-600 transition-all group relative overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-300"
                            >
                                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-100/50 dark:bg-blue-900/20 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-110"></div>
                                
                                <div className="relative z-10">
                                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                                        {category.name}
                                    </h3>
                                    
                                    <div className="flex flex-wrap gap-2 mb-6">
                                        {category.items.map((exam, eIdx) => (
                                            <span key={eIdx} className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5">
                                                {/* Clone element to force smaller icon size in tags */}
                                                {React.cloneElement(exam.icon, { size: 14 })}
                                                {exam.name}
                                            </span>
                                        ))}
                                    </div>

                                    <Link 
                                        to={`/category/${category.id}`} 
                                        className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 font-bold text-sm group-hover:translate-x-1 transition-transform"
                                    >
                                        Explore Category <ArrowRight size={16} />
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                    
                    {/* View More / View Less Toggle Button */}
                    <div className="mt-12 text-center">
                         <button 
                            onClick={() => setShowAllCategories(!showAllCategories)}
                            className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-bold text-sm bg-blue-50 dark:bg-slate-800 px-6 py-3 rounded-full transition-all hover:shadow-md"
                         >
                            {showAllCategories ? (
                                <>View Less Categories <ChevronUp size={16}/></>
                            ) : (
                                <>View All Categories ({allCategories.length}) <ChevronDown size={16}/></>
                            )}
                        </button>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 py-12 text-center text-slate-500 dark:text-slate-400 text-sm transition-colors">
                &copy; 2025 Bit by Bit Education. All rights reserved.
            </footer>
        </div>
    );
};

const FeatureCard = ({ icon, color, title, desc }) => (
    <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 hover:shadow-lg transition-all">
        <div className={`w-14 h-14 ${color} rounded-xl flex items-center justify-center mb-6 shadow-lg shadow-slate-200 dark:shadow-none`}>
            {icon}
        </div>
        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{title}</h3>
        <p className="text-slate-500 dark:text-slate-400 leading-relaxed">{desc}</p>
    </div>
);


export default LandingPage;