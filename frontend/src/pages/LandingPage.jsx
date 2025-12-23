import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
    // UI Icons
    ChevronDown, ChevronUp, LayoutGrid, X, Search, ArrowRight,
    
    // Feature Icons
    BookOpen, CheckCircle, Clock, Trophy, BrainCircuit, Zap, Users,
    
    // Category Icons (Used in the Grid)
    Atom, Stethoscope, Building2, Scale, Briefcase, Globe, Code, 
    Calculator, Landmark, Gavel, Plane, Microscope, PenTool, TrendingUp,
    FileText, Monitor, Cpu, GraduationCap, Shield
} from 'lucide-react';
import api from '../api/axios';
import { useTheme } from '../hooks/useTheme';

const mockBanners = [
    {
        id: 1,
        title: "GATE 2026 Batch Started",
        description: "Enroll now and get early bird discount of 20%",
        button_text: "Join Now",
        link: "/register",
        bg_gradient_from: "blue-600",
        bg_gradient_to: "purple-600"
    },
    {
        id: 2,
        title: "All India Mock Test Live",
        description: "Test your preparation with thousands of students.",
        button_text: "Attempt Now",
        link: "/tests",
        bg_gradient_from: "emerald-600",
        bg_gradient_to: "teal-600"
    }
];

// --- EXAM DATA WITH STATUS ---
const EXAM_CATEGORIES_DATA = [
    { 
        name: "IIT JEE", 
        icon: <Atom size={20} className="text-orange-500"/>, 
        items: [{name: "Mains"}, {name: "Advanced"}],
        link: "/engineering/jee",
        status: "active"
    },
    { 
        name: "NEET", 
        icon: <Stethoscope size={20} className="text-blue-500"/>, 
        items: [{name: "Class 11"}, {name: "Class 12"}],
        link: "/medical/neet",
        status: "active"
    },
    { 
        name: "GATE", 
        icon: <Cpu size={20} className="text-purple-600"/>, 
        items: [{name: "CS & IT"}, {name: "Mechanical"}],
        link: "/engineering/gate",
        status: "active"
    },
    { 
        name: "UPSC CSE", 
        icon: <Landmark size={20} className="text-yellow-600"/>, 
        items: [{name: "Prelims"}, {name: "Mains"}],
        link: "/civil-services/upsc",
        status: "active"
    },
    { 
        name: "BPSC", 
        icon: <Landmark size={20} className="text-orange-600"/>, 
        items: [{name: "Prelims"}, {name: "Mains"}],
        link: "/civil-services/bpsc",
        status: "active"
    },
    { 
        name: "Defence", 
        icon: <Shield size={20} className="text-teal-500"/>, 
        items: [{name: "NDA"}, {name: "Agniveer"}],
        link: "/defence/agniveer",
        status: "active"
    },
    { 
        name: "UGC NET", 
        icon: <BookOpen size={20} className="text-green-500"/>, 
        items: [{name: "Paper 1"}, {name: "Computer Sc"}],
        link: "/teaching/ugc_net",
        status: "active"
    },
    { 
        name: "Teaching (CTET)", 
        icon: <Users size={20} className="text-emerald-600"/>, 
        items: [{name: "Paper 1"}, {name: "Paper 2"}],
        link: "/teaching/ctet",
        status: "active"
    },
    // --- COMING SOON CATEGORIES ---
    { 
        name: "SSC CGL", 
        icon: <Building2 size={20} className="text-red-500"/>, 
        items: [{name: "Tier 1"}, {name: "Tier 2"}],
        link: "#",
        status: "coming_soon"
    },
    { 
        name: "Banking", 
        icon: <Briefcase size={20} className="text-indigo-500"/>, 
        items: [{name: "PO"}, {name: "Clerk"}],
        link: "#",
        status: "coming_soon"
    },
    { 
        name: "School Boards", 
        icon: <Globe size={20} className="text-pink-500"/>, 
        items: [{name: "CBSE"}, {name: "ICSE"}],
        link: "#",
        status: "coming_soon"
    },
    { 
        name: "CA / CS", 
        icon: <Calculator size={20} className="text-blue-600"/>, 
        items: [{name: "Foundation"}, {name: "Inter"}],
        link: "#",
        status: "coming_soon"
    },
    { 
        name: "MBA", 
        icon: <TrendingUp size={20} className="text-purple-600"/>, 
        items: [{name: "CAT"}, {name: "XAT"}],
        link: "#",
        status: "coming_soon"
    },
    { 
        name: "Law (CLAT)", 
        icon: <Scale size={20} className="text-slate-700"/>, 
        items: [{name: "UG"}, {name: "PG"}],
        link: "#",
        status: "coming_soon"
    }
];

const LandingPage = () => {
    const [showAd, setShowAd] = useState(true);
    const [banners, setBanners] = useState([]);
    const [currentAdIndex, setCurrentAdIndex] = useState(0);
    const navigate = useNavigate();

    // --- TOAST STATE ---
    const [toast, setToast] = useState(null); // { message, type }

    const [showAllCategories, setShowAllCategories] = useState(false);
    const INITIAL_CATEGORY_COUNT = 6; 

    const displayedCategories = showAllCategories ? EXAM_CATEGORIES_DATA : EXAM_CATEGORIES_DATA.slice(0, INITIAL_CATEGORY_COUNT);

    useEffect(() => {
        api.get('banners/').then(res => {
            if (res.data.length > 0) setBanners(res.data);
            else setBanners(mockBanners);
        }).catch(() => setBanners(mockBanners));
    }, []);

    useEffect(() => {
        if (banners.length <= 1) return;
        const timer = setInterval(() => {
            setCurrentAdIndex(prev => (prev + 1) % banners.length);
        }, 4000); 
        return () => clearInterval(timer);
    }, [banners]);

    // Toast Timer
    useEffect(() => {
        if (toast) {
            const timer = setTimeout(() => setToast(null), 3000);
            return () => clearTimeout(timer);
        }
    }, [toast]);

    const activeBanner = banners[currentAdIndex];

    const handleCategoryClick = (category) => {
        if (category.status === 'coming_soon') {
            setToast({ type: 'info', message: "Course is being prepared. We will notify you when added!" });
        } else {
            navigate(category.link);
        }
    };

    return (
        <div className="bg-white dark:bg-slate-900 font-sans text-slate-800 dark:text-slate-200 transition-colors duration-300">
            
            {/* --- TOAST NOTIFICATION --- */}
            {toast && (
                <div className="fixed top-24 right-6 z-50 animate-in slide-in-from-right-10 fade-in duration-300">
                    <div className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3 border border-slate-700 dark:border-slate-200">
                        <AlertCircle size={20} className="text-yellow-400 dark:text-yellow-600" />
                        <div>
                            <h4 className="font-bold text-sm">Coming Soon</h4>
                            <p className="text-xs opacity-90">{toast.message}</p>
                        </div>
                        <button onClick={() => setToast(null)}><X size={16} className="opacity-50 hover:opacity-100"/></button>
                    </div>
                </div>
            )}

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
                        {/* 3D VIDEO CONTAINER */}
                        <div className="relative bg-gradient-to-br from-slate-800 to-slate-900 p-8 rounded-3xl border border-slate-700 shadow-2xl">
                            {/* Window Controls */}
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex gap-2">
                                    <div className="w-3 h-3 rounded-full bg-red-500 hover:bg-red-400 transition-colors"/>
                                    <div className="w-3 h-3 rounded-full bg-yellow-500 hover:bg-yellow-400 transition-colors"/>
                                    <div className="w-3 h-3 rounded-full bg-green-500 hover:bg-green-400 transition-colors"/>
                                </div>
                                <div className="text-slate-500 text-xs font-mono bg-slate-800 px-3 py-1 rounded-full border border-slate-700">
                                    intro_video.mp4
                                </div>
                            </div>

                            {/* --- THE VIDEO PLAYER --- */}
                            <div className="bg-black rounded-xl overflow-hidden shadow-inner border border-slate-800 aspect-video relative group">
                                <video 
                                    className="w-full h-full object-cover"
                                    autoPlay 
                                    loop 
                                    muted 
                                    playsInline
                                    poster="/assets/video-thumbnail.jpg" // Optional: Add a thumbnail image
                                >
                                    {/* Make sure the file exists at frontend/public/assets/intro.mp4 */}
                                    <source src="/assets/intro.mp4" type="video/mp4" />
                                    Your browser does not support the video tag.
                                </video>
                                
                                {/* Overlay Gradient (Optional) */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent pointer-events-none"></div>
                            </div>

                            {/* Progress Bar (Decorative) */}
                            <div className="mt-6 flex gap-4 items-center">
                                <PlayCircle size={20} className="text-blue-500"/>
                                <div className="flex-1 h-1.5 bg-slate-700 rounded-full overflow-hidden">
                                    <div className="h-full w-2/3 bg-blue-500 animate-pulse"></div>
                                </div>
                                <span className="text-xs text-slate-400 font-mono">01:24 / 02:00</span>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* --- EXAM CATEGORIES GRID --- */}
            <section className="py-24 px-6 bg-slate-50 dark:bg-slate-900 transition-colors">
                <div className="max-w-6xl mx-auto">
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
                        {displayedCategories.map((category, idx) => (
                            <div 
                                key={idx} 
                                onClick={() => handleCategoryClick(category)} // <--- CLICK HANDLER
                                className={`bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-700 rounded-2xl p-6 transition-all group relative overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-300 cursor-pointer
                                    ${category.status === 'coming_soon' ? 'opacity-70 hover:opacity-100 grayscale hover:grayscale-0' : 'hover:shadow-xl hover:border-blue-200 dark:hover:border-slate-600'}
                                `}
                            >
                                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-100/50 dark:bg-blue-900/20 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-110"></div>
                                <div className="relative z-10">
                                    <div className="flex justify-between items-start mb-4">
                                        <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                            {category.name}
                                        </h3>
                                        {category.status === 'coming_soon' && (
                                            <span className="text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-500 px-2 py-1 rounded">Soon</span>
                                        )}
                                    </div>
                                    
                                    <div className="flex flex-wrap gap-2 mb-6">
                                        {category.items.map((exam, eIdx) => (
                                            <span key={eIdx} className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5">
                                                {React.cloneElement(category.icon, { size: 14 })} 
                                                {exam.name}
                                            </span>
                                        ))}
                                    </div>
                                    
                                    <div className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 font-bold text-sm group-hover:translate-x-1 transition-transform">
                                        {category.status === 'coming_soon' ? 'Notify Me' : 'Explore Category'} 
                                        <ArrowRight size={16} />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    
                    <div className="mt-12 text-center">
                         <button onClick={() => setShowAllCategories(!showAllCategories)} className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-bold text-sm bg-blue-50 dark:bg-slate-800 px-6 py-3 rounded-full transition-all hover:shadow-md">
                            {showAllCategories ? <>View Less Categories <ChevronUp size={16}/></> : <>View All Categories ({EXAM_CATEGORIES_DATA.length}) <ChevronDown size={16}/></>}
                        </button>
                    </div>
                </div>
            </section>

             {/* --- PHILOSOPHY SECTION --- */}
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
                            Don't let them just <span className="text-red-500 font-bold">watch</span>. <br/>
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
                        <div className="pt-4">
                            <Link to="/register" className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 font-bold hover:text-blue-800 transition-colors text-lg">
                                See the difference yourself <ArrowRight size={20} />
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* --- STATS & TESTIMONIALS --- */}
            <section className="py-24 bg-white dark:bg-slate-800 border-t border-slate-100 dark:border-slate-800 transition-colors">
                <div className="max-w-6xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Our students and parents love us</h2>
                    </div>
                    <div className="grid md:grid-cols-3 gap-8">
                        <FeatureCard icon={<BookOpen size={24} className="text-white"/>} color="bg-blue-600" title="Comprehensive Notes" desc="Detailed chapter-wise notes curated by top faculties."/>
                        <FeatureCard icon={<Clock size={24} className="text-white"/>} color="bg-purple-600" title="Real-time Mock Tests" desc="Practice in an actual exam-like environment with negative marking."/>
                        <FeatureCard icon={<Trophy size={24} className="text-white"/>} color="bg-emerald-600" title="Performance Analysis" desc="Track your weak areas and improve bit by bit every day."/>
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