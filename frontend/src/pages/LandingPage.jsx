import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
    BookOpen, CheckCircle, Clock, Trophy, ChevronDown, Menu, X, 
    GraduationCap, ArrowRight, Monitor, Cpu, FileText, Globe, Cloud 
} from 'lucide-react';

// --- NAVIGATION DATA ---
const NAV_LINKS = [
    {
        label: "All Courses",
        type: "mega",
        columns: [
            {
                title: "Competitive Exams",
                items: ["IIT JEE", "NEET", "GATE", "UGC NET", "Olympiad"]
            },
            {
                title: "Govt Exams",
                items: ["SSC CGL", "Banking (IBPS/SBI)", "Railways (RRB)", "Defence (CDS/AFCAT)", "Teaching (CTET)"]
            },
            {
                title: "School Prep",
                items: ["Class 11-12", "Class 9-10", "CBSE Boards", "ICSE Boards"]
            },
            {
                title: "Upskilling",
                items: ["Data Science", "Web Development", "Finance & Stock Market", "Generative AI"]
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
        type: "text", // Garbage/No Action
    }
];

const LandingPage = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [activeDropdown, setActiveDropdown] = useState(null);
    const [showAd, setShowAd] = useState(true); // State for Top Banner

    return (
        <div className="bg-white font-sans text-slate-800">
            
            {/* --- TOP ADS BANNER --- */}
            {showAd && (
                <div className="relative bg-gradient-to-r from-sky-50 via-white to-blue-50 border-b border-blue-100 p-4 md:py-8 overflow-hidden">
                    {/* Background decoration */}
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-500 via-blue-500 to-green-500"></div>
                    
                    <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8 relative z-10">
                        {/* Text Side */}
                        <div className="flex-1 space-y-4 text-center md:text-left">
                            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight font-serif italic">
                                Learn <span className="text-slate-800">Cloud Computing</span>
                            </h2>
                            <p className="text-slate-600 font-medium text-lg">
                                Build your skills with Google Cloud's newest offerings!
                            </p>
                            <div className="flex gap-4 justify-center md:justify-start pt-2">
                                <button className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-2.5 rounded-full font-bold text-sm transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5">
                                    Explore offerings
                                </button>
                                <button className="bg-white hover:bg-slate-50 text-orange-600 border-2 border-orange-200 px-6 py-2.5 rounded-full font-bold text-sm transition-all">
                                    Learn more
                                </button>
                            </div>
                        </div>

                        {/* Visual Side (Floating Cards) */}
                        <div className="hidden md:flex items-center gap-6 pr-8">
                            {/* Card 1 */}
                            <div className="bg-slate-900 text-white p-5 rounded-2xl shadow-xl w-64 transform rotate-[-3deg] border border-slate-700 hover:rotate-0 transition-transform duration-300">
                                <div className="flex items-center gap-2 mb-4">
                                    <div className="bg-white p-1.5 rounded-lg"><Cloud className="w-4 h-4 text-slate-900"/></div>
                                    <span className="font-bold text-xs tracking-wider">GOOGLE CLOUD</span>
                                </div>
                                <div className="h-20 mb-3 bg-gradient-to-br from-slate-800 to-slate-950 rounded-xl border border-slate-700/50 flex items-center justify-center">
                                    <div className="w-10 h-1 bg-slate-700 rounded-full"></div>
                                </div>
                                <p className="font-bold text-base leading-tight">Computing Foundations</p>
                                <div className="mt-3 text-[10px] bg-slate-800 inline-block px-2 py-1 rounded text-slate-400 font-medium border border-slate-700">Professional Certificate</div>
                            </div>
                             {/* Card 2 */}
                             <div className="bg-white text-slate-900 p-5 rounded-2xl shadow-xl w-64 transform rotate-[3deg] border border-slate-200 hover:rotate-0 transition-transform duration-300 translate-y-4">
                                <div className="flex items-center gap-2 mb-4">
                                    <div className="bg-blue-50 p-1.5 rounded-lg border border-blue-100"><Cloud className="w-4 h-4 text-blue-600"/></div>
                                    <span className="font-bold text-xs text-slate-500 tracking-wider">GOOGLE CLOUD</span>
                                </div>
                                <div className="h-20 mb-3 bg-yellow-50 rounded-xl border border-yellow-100 flex items-center justify-center">
                                    <BookOpen className="text-yellow-500 w-8 h-8" />
                                </div>
                                <p className="font-bold text-base leading-tight">Workspace Admin</p>
                                <div className="mt-3 text-[10px] bg-slate-100 inline-block px-2 py-1 rounded text-slate-500 font-medium">Professional Certificate</div>
                            </div>
                        </div>
                    </div>

                    {/* Close Button */}
                    <button 
                        onClick={() => setShowAd(false)}
                        className="absolute top-3 right-3 p-2 text-slate-400 hover:text-slate-600 hover:bg-black/5 rounded-full transition-colors"
                        title="Dismiss"
                    >
                        <X size={20} />
                    </button>
                </div>
            )}

            {/* --- NAVIGATION BAR --- */}
            <nav className={`sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm ${showAd ? '' : 'top-0'}`}>
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
                        <div className="hidden lg:flex items-center space-x-1">
                            {NAV_LINKS.map((link, idx) => (
                                <div 
                                    key={idx}
                                    className="relative group"
                                    onMouseEnter={() => setActiveDropdown(idx)}
                                    onMouseLeave={() => setActiveDropdown(null)}
                                >
                                    {/* Menu Item Button */}
                                    <button className={`px-3 py-2 rounded-md text-sm font-bold flex items-center gap-1 transition-colors ${link.type === 'text' ? 'text-slate-400 cursor-default' : 'text-slate-700 hover:text-blue-600 hover:bg-blue-50'}`}>
                                        {link.label}
                                        {['mega', 'dropdown'].includes(link.type) && <ChevronDown size={14} className="mt-0.5 group-hover:rotate-180 transition-transform"/>}
                                    </button>

                                    {/* Dropdowns */}
                                    {activeDropdown === idx && (
                                        <div className="absolute top-full left-0 pt-2 w-max">
                                            {link.type === 'mega' && (
                                                <div className="bg-white rounded-xl shadow-xl border border-slate-100 p-6 grid grid-cols-4 gap-8 w-[800px] -ml-20">
                                                    {link.columns.map((col, cIdx) => (
                                                        <div key={cIdx}>
                                                            <h4 className="font-bold text-blue-600 mb-3 uppercase text-xs tracking-wider border-b pb-2">{col.title}</h4>
                                                            <ul className="space-y-2">
                                                                {col.items.map((item, iIdx) => (
                                                                    <li key={iIdx} className="text-sm text-slate-600 hover:text-slate-900 cursor-pointer hover:underline decoration-blue-300 underline-offset-4">{item}</li>
                                                                ))}
                                                            </ul>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}

                                            {link.type === 'dropdown' && (
                                                <div className="bg-white rounded-xl shadow-xl border border-slate-100 p-2 w-56">
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
                            <Link to="/register" className="bg-blue-600 text-white px-5 py-2.5 rounded-lg font-bold hover:bg-blue-700 transition-all shadow-md shadow-blue-200">
                                Get Started
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
                        <div className="p-4 space-y-4">
                            {NAV_LINKS.map((link, idx) => (
                                <div key={idx} className="border-b border-slate-50 pb-2 last:border-0">
                                    <div className="font-bold text-slate-800 mb-2">{link.label}</div>
                                    {link.type === 'mega' && (
                                        <div className="pl-4 space-y-4">
                                            {link.columns.map((col, cIdx) => (
                                                <div key={cIdx}>
                                                    <div className="text-xs font-bold text-blue-500 uppercase mb-1">{col.title}</div>
                                                    <div className="grid grid-cols-2 gap-2">
                                                        {col.items.map((item, iIdx) => (
                                                            <div key={iIdx} className="text-sm text-slate-500">{item}</div>
                                                        ))}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                    {link.type === 'dropdown' && (
                                        <div className="pl-4 grid grid-cols-1 gap-2">
                                            {link.items.map((item, iIdx) => (
                                                <div key={iIdx} className="text-sm text-slate-500 flex items-center gap-2">
                                                    {item.icon} {item.name}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))}
                            <div className="flex flex-col gap-3 mt-6">
                                <Link to="/login" className="w-full text-center border border-slate-200 py-3 rounded-lg font-bold text-slate-700">Login</Link>
                                <Link to="/register" className="w-full text-center bg-blue-600 text-white py-3 rounded-lg font-bold">Get Started</Link>
                            </div>
                        </div>
                    </div>
                )}
            </nav>

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
                        {/* 3D Floating Elements Placeholder */}
                        <div className="relative bg-gradient-to-br from-slate-800 to-slate-900 p-8 rounded-3xl border border-slate-700 shadow-2xl">
                            <div className="flex items-center justify-between mb-8">
                                <div className="flex gap-2">
                                    <div className="w-3 h-3 rounded-full bg-red-500"/>
                                    <div className="w-3 h-3 rounded-full bg-yellow-500"/>
                                    <div className="w-3 h-3 rounded-full bg-green-500"/>
                                </div>
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

            {/* --- FEATURES GRID --- */}
            <section className="py-24 px-6 bg-slate-50">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold text-slate-900 mb-4">Why Choose Bit by Bit?</h2>
                        <p className="text-slate-500">Structured courses, endless practice, and AI-powered insights.</p>
                    </div>
                    <div className="grid md:grid-cols-3 gap-8">
                        <FeatureCard icon={<BookOpen size={24} className="text-white"/>} color="bg-blue-600" title="Comprehensive Notes" desc="Detailed chapter-wise notes curated by top faculties."/>
                        <FeatureCard icon={<Clock size={24} className="text-white"/>} color="bg-purple-600" title="Real-time Mock Tests" desc="Practice in an actual exam-like environment with negative marking."/>
                        <FeatureCard icon={<Trophy size={24} className="text-white"/>} color="bg-emerald-600" title="Performance Analysis" desc="Track your weak areas and improve bit by bit every day."/>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-white border-t border-slate-200 py-12 text-center text-slate-500 text-sm">
                &copy; 2025 Bit by Bit Education. All rights reserved.
            </footer>
        </div>
    );
};

const FeatureCard = ({ icon, color, title, desc }) => (
    <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-lg transition-shadow">
        <div className={`w-14 h-14 ${color} rounded-xl flex items-center justify-center mb-6 shadow-lg shadow-slate-200`}>
            {icon}
        </div>
        <h3 className="text-xl font-bold text-slate-900 mb-2">{title}</h3>
        <p className="text-slate-500 leading-relaxed">{desc}</p>
    </div>
);

export default LandingPage;