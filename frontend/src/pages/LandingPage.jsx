import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
    BookOpen, CheckCircle, Clock, Trophy, ChevronDown, Menu, X, 
    GraduationCap, ArrowRight, Monitor, Cpu, FileText, Cloud,
    Atom, Stethoscope, Building2, Scale, Briefcase, Globe, Code,
    BrainCircuit, MousePointerClick, Zap, Users
} from 'lucide-react';
import api from '../api/axios';

// --- NAVIGATION DATA ---
const NAV_LINKS = [
    {
        label: "All Exams",
        type: "mega_tabs",  
        categories: [
            {
                id: "competitive",
                name: "Competitive Exams",
                items: [
                    { name: "IIT JEE", icon: <Atom size={20} className="text-orange-500"/> },
                    { name: "NEET", icon: <Stethoscope size={20} className="text-blue-500"/> },
                    { name: "GATE", icon: <Cpu size={20} className="text-purple-500"/> },
                    { name: "UGC NET", icon: <BookOpen size={20} className="text-green-500"/> },
                    { name: "Olympiad", icon: <Trophy size={20} className="text-yellow-500"/> }
                ]
            },
            {
                id: "govt",
                name: "Govt Exams",
                items: [
                    { name: "SSC CGL", icon: <Building2 size={20} className="text-red-500"/> },
                    { name: "Banking (IBPS)", icon: <Briefcase size={20} className="text-indigo-500"/> },
                    { name: "Railways (RRB)", icon: <Monitor size={20} className="text-slate-500"/> },
                    { name: "Defence", icon: <CheckCircle size={20} className="text-teal-500"/> }
                ]
            },
            {
                id: "school",
                name: "School Boards",
                items: [
                    { name: "CBSE Class 12", icon: <BookOpen size={20} className="text-blue-400"/> },
                    { name: "CBSE Class 10", icon: <BookOpen size={20} className="text-blue-400"/> },
                    { name: "ICSE Board", icon: <BookOpen size={20} className="text-purple-400"/> },
                    { name: "State Boards", icon: <Globe size={20} className="text-orange-400"/> }
                ]
            },
            {
                id: "law",
                name: "Law & Commerce",
                items: [
                    { name: "CLAT", icon: <Scale size={20} className="text-slate-700"/> },
                    { name: "CA Foundation", icon: <FileText size={20} className="text-emerald-600"/> },
                    { name: "CS Executive", icon: <FileText size={20} className="text-emerald-600"/> }
                ]
            },
            {
                id: "tech",
                name: "Upskilling & IT",
                items: [
                    { name: "Data Science", icon: <Monitor size={20} className="text-blue-600"/> },
                    { name: "Full Stack Dev", icon: <Code size={20} className="text-purple-600"/> },
                    { name: "Generative AI", icon: <Cpu size={20} className="text-pink-600"/> }
                ]
            }
        ]
    },
    { label: "India's Update", type: "link", to: "/news" },
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
    { label: "Power Batch", type: "text" }
];

const LandingPage = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [activeDropdown, setActiveDropdown] = useState(null);
    const [showAd, setShowAd] = useState(true);
    const [banners, setBanners] = useState([]);
    const [activeTab, setActiveTab] = useState(0);
    const [currentAdIndex, setCurrentAdIndex] = useState(0);
    
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
        <div className="bg-white font-sans text-slate-800">
            
            {/* --- NAVIGATION BAR --- */}
            <nav className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-20">
                        {/* Logo */}
                        <div className="flex-shrink-0 flex items-center gap-2 cursor-pointer">
                            <div className="bg-slate-900 text-white p-2 rounded-lg">
                                <GraduationCap size={24} />
                            </div>
                            <span className="font-black text-2xl tracking-tighter">
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
                                        ${activeDropdown === idx ? 'bg-blue-50 text-blue-600' : 'text-slate-700 hover:text-blue-600 hover:bg-slate-50'}`}>
                                        {link.label}
                                        {['mega_tabs', 'dropdown'].includes(link.type) && <ChevronDown size={14} className={`mt-0.5 transition-transform duration-200 ${activeDropdown === idx ? 'rotate-180' : ''}`}/>}
                                    </button>

                                    {/* MEGA MENU LOGIC */}
                                    {activeDropdown === idx && (
                                        <div className="absolute top-full left-0 pt-2 w-max animate-in fade-in slide-in-from-top-2 duration-200">
                                            {link.type === 'mega_tabs' && (
                                                <div className="bg-white rounded-2xl shadow-2xl border border-slate-100 flex overflow-hidden w-[700px] -ml-20">
                                                    {/* Sidebar */}
                                                    <div className="w-1/3 bg-slate-50 border-r border-slate-100 p-2">
                                                        {link.categories.map((cat, cIdx) => (
                                                            <div 
                                                                key={cIdx}
                                                                onMouseEnter={() => setActiveTab(cIdx)}
                                                                className={`px-4 py-3 rounded-xl text-sm font-bold cursor-pointer flex justify-between items-center transition-all mb-1
                                                                    ${activeTab === cIdx ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:bg-slate-100 hover:text-slate-700'}
                                                                `}
                                                            >
                                                                {cat.name}
                                                                {activeTab === cIdx && <div className="w-1.5 h-1.5 rounded-full bg-blue-600"></div>}
                                                            </div>
                                                        ))}
                                                    </div>
                                                    {/* Content Grid */}
                                                    <div className="w-2/3 p-6 bg-white">
                                                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 border-b border-slate-100 pb-2">
                                                            {link.categories[activeTab].name}
                                                        </h4>
                                                        <div className="grid grid-cols-2 gap-3">
                                                            {link.categories[activeTab].items.map((item, iIdx) => (
                                                                <div key={iIdx} className="flex items-center gap-3 p-3 rounded-xl border border-slate-100 hover:border-blue-200 hover:shadow-md transition-all cursor-pointer group bg-slate-50/50 hover:bg-white">
                                                                    <div className="bg-white p-2 rounded-lg shadow-sm group-hover:scale-110 transition-transform">
                                                                        {item.icon}
                                                                    </div>
                                                                    <span className="text-sm font-bold text-slate-700 group-hover:text-blue-700">{item.name}</span>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                            {/* Simple Dropdown */}
                                            {link.type === 'dropdown' && (
                                                <div className="bg-white rounded-xl shadow-xl border border-slate-100 p-2 w-64">
                                                    {link.items.map((item, iIdx) => (
                                                        <div key={iIdx} className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 cursor-pointer group">
                                                            {item.icon && <span className="text-slate-400 group-hover:text-blue-500">{item.icon}</span>}
                                                            <span className="text-sm font-medium text-slate-700 group-hover:text-blue-700">{item.name}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>

                        {/* Auth Buttons */}
                        <div className="hidden lg:flex items-center gap-3">
                            <Link to="/login" className="text-slate-600 font-bold hover:text-blue-600 px-4 py-2">Login</Link>
                            <Link to="/register" className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2.5 rounded-xl font-bold transition-all shadow-lg shadow-blue-200 hover:-translate-y-0.5">
                                Register
                            </Link>
                        </div>

                        {/* Mobile Menu Button */}
                        <div className="lg:hidden">
                            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 text-slate-600">
                                {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile Menu Drawer */}
                {isMobileMenuOpen && (
                    <div className="lg:hidden bg-white border-t border-slate-100 absolute w-full left-0 shadow-xl max-h-[80vh] overflow-y-auto">
                        <div className="p-4 space-y-2">
                            {NAV_LINKS.map((link, idx) => (
                                <div key={idx} className="border-b border-slate-50 pb-2 last:border-0">
                                    <div className="font-bold text-slate-800 py-2">{link.label}</div>
                                    {link.type === 'mega_tabs' && (
                                        <div className="pl-4 space-y-4 mt-2">
                                            {link.categories.map((cat, cIdx) => (
                                                <div key={cIdx}>
                                                    <div className="text-xs font-bold text-blue-500 uppercase mb-2">{cat.name}</div>
                                                    <div className="grid grid-cols-2 gap-2">
                                                        {cat.items.map((item, iIdx) => (
                                                            <div key={iIdx} className="text-sm text-slate-500 flex items-center gap-2 p-2 bg-slate-50 rounded">{item.name}</div>
                                                        ))}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))}
                            <div className="flex flex-col gap-3 mt-6 pt-4 border-t border-slate-100">
                                <Link to="/login" className="w-full text-center border-2 border-slate-100 py-3 rounded-xl font-bold text-slate-700">Login</Link>
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
                    {banners.length > 1 && (
                        <div className="absolute bottom-1 left-1/2 -translate-x-1/2 flex gap-1">
                            {banners.map((_, idx) => (
                                <div key={idx} className={`w-1.5 h-1.5 rounded-full transition-colors ${idx === currentAdIndex ? 'bg-white' : 'bg-white/30'}`}/>
                            ))}
                        </div>
                    )}
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
                        </div>
                    </div>
                </div>
            </header>

            {/* --- SECTION 1: EXAM CATEGORIES (Like PW/Byjus) --- */}
            <section className="py-20 bg-slate-50 px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-extrabold text-slate-900">Explore Exam Categories</h2>
                        <p className="text-slate-500 mt-2">Prepare for 50+ exams with India's top educators.</p>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {["IIT JEE", "NEET", "UPSC", "GATE", "SSC", "Banking", "Teaching", "Defence"].map((exam, idx) => (
                            <div key={idx} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-xl hover:border-blue-200 transition-all cursor-pointer flex flex-col items-center gap-4 group">
                                <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center group-hover:bg-blue-600 transition-colors">
                                    <BookOpen size={32} className="text-blue-600 group-hover:text-white transition-colors"/>
                                </div>
                                <span className="font-bold text-lg text-slate-800">{exam}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* --- SECTION 2: WHY BIT BY BIT? (Philosophy) --- */}
            <section className="py-24 bg-white px-6">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-16">
                    <div className="md:w-1/2 relative">
                        <div className="absolute inset-0 bg-emerald-100 rounded-3xl rotate-3"></div>
                        <div className="relative bg-slate-900 p-10 rounded-3xl shadow-2xl text-white">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="p-3 bg-emerald-500 rounded-xl"><BrainCircuit size={32} /></div>
                                <div>
                                    <h3 className="font-bold text-xl">Active Recall</h3>
                                    <p className="text-emerald-200 text-sm">Scientifically Proven</p>
                                </div>
                            </div>
                            <div className="space-y-4">
                                <div className="flex gap-4 items-center p-4 bg-slate-800 rounded-xl border border-slate-700">
                                    <span className="text-2xl">📖</span>
                                    <div>
                                        <p className="font-bold">Reading & Writing</p>
                                        <p className="text-xs text-slate-400">Increases retention by 60%</p>
                                    </div>
                                </div>
                                <div className="flex gap-4 items-center p-4 bg-slate-800 rounded-xl border border-slate-700 opacity-50">
                                    <span className="text-2xl">📺</span>
                                    <div>
                                        <p className="font-bold">Passive Watching</p>
                                        <p className="text-xs text-slate-400">Low retention & focus</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="md:w-1/2 space-y-6">
                        <h2 className="text-4xl font-extrabold text-slate-900 leading-tight">
                            Why <span className="text-blue-600">Bit by Bit?</span>
                        </h2>
                        <p className="text-lg text-slate-600 leading-relaxed">
                            Our motto is to bring back the capability of <strong>Reading and Learning</strong>. 
                            Scientific research shows that students who read, write, and practice indulge in 
                            <strong> active learning</strong> which grows IQ and cognitive function significantly more than passive video watching.
                        </p>
                        <ul className="space-y-3 mt-4">
                            {[
                                "Focus on Revision & Practice over long videos",
                                "Mental capabilities enhancement through reading",
                                "Activity-based learning for higher functioning"
                            ].map((item, i) => (
                                <li key={i} className="flex items-center gap-3 text-slate-700 font-medium">
                                    <CheckCircle size={20} className="text-emerald-500 flex-shrink-0" /> {item}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </section>

            {/* --- SECTION 3: AI TOOLS --- */}
            <section className="py-20 bg-slate-50 px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <div className="inline-block bg-purple-100 text-purple-700 px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-4">Powered by Gemini</div>
                        <h2 className="text-3xl font-bold text-slate-900">Smart AI Tools for Students</h2>
                    </div>
                    <div className="grid md:grid-cols-4 gap-6">
                        {[
                            { title: "AI Summarizer", icon: <FileText className="text-blue-500"/>, desc: "Turn long chapters into short notes." },
                            { title: "Video to Text", icon: <Monitor className="text-pink-500"/>, desc: "Convert lectures into readable scripts." },
                            { title: "Mind Maps", icon: <Cpu className="text-purple-500"/>, desc: "Visualize complex topics instantly." },
                            { title: "Auto Notes", icon: <Zap className="text-yellow-500"/>, desc: "Generate study material from topics." },
                        ].map((tool, idx) => (
                            <div key={idx} className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 hover:border-purple-200 hover:shadow-lg transition-all group cursor-pointer">
                                <div className="w-12 h-12 bg-slate-50 rounded-lg flex items-center justify-center mb-4 group-hover:bg-purple-50 transition-colors">
                                    {tool.icon}
                                </div>
                                <h3 className="font-bold text-slate-900 mb-2">{tool.title}</h3>
                                <p className="text-sm text-slate-500">{tool.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* --- SECTION 4: STATS / TRUST --- */}
            <section className="py-20 bg-white border-t border-slate-100">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-12">
                        <h2 className="text-2xl font-bold text-slate-900">Trusted by Students & Parents</h2>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                        {[
                            { num: "150K+", label: "Active Students", icon: <Users className="mx-auto mb-2 text-blue-500"/> },
                            { num: "4.8/5", label: "App Rating", icon: <Trophy className="mx-auto mb-2 text-yellow-500"/> },
                            { num: "10M+", label: "Questions Solved", icon: <CheckCircle className="mx-auto mb-2 text-green-500"/> },
                            { num: "200+", label: "Top Educators", icon: <GraduationCap className="mx-auto mb-2 text-purple-500"/> },
                        ].map((stat, idx) => (
                            <div key={idx}>
                                {stat.icon}
                                <div className="text-4xl font-extrabold text-slate-900 mb-1">{stat.num}</div>
                                <div className="text-sm text-slate-500 font-medium uppercase tracking-wide">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-slate-900 text-slate-400 py-12 px-6">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="font-bold text-2xl text-white">Bit by Bit</div>
                    <div className="text-sm">© 2025 Bit by Bit Education. All rights reserved.</div>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;