import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Chart } from 'chart.js/auto';
import { 
    ChevronRight, Calendar, Users, Award, BookOpen, 
    CheckCircle, Clock, Shield, Star, Zap, Target, 
    ArrowRight, Layout, PlayCircle, FileText, Ruler, 
    BarChart3, AlertTriangle, Lock, Infinity, Layers
} from 'lucide-react';

// --- MOCK DATA ---
const CATEGORY_DATA = {
    "defence": {
        title: "Defence Exams",
        tagline: "Serve the Nation with Pride",
        themeColor: "teal",
        heroImage: "bg-gradient-to-br from-teal-950 to-slate-950",
        stats: [
            { label: "Active Aspirants", value: "1.2 Lakh+" },
            { label: "Selections in 2024", value: "4,500+" },
            { label: "Avg. Starting Salary", value: "₹56,100" }
        ],
        subCategories: [
            { id: "agniveer", name: "Agniveer", fullName: "Agnipath Scheme" },
            { id: "nda", name: "NDA", fullName: "National Defence Academy" },
            { id: "cds", name: "CDS", fullName: "Combined Defence Services" },
            { id: "afcat", name: "AFCAT", fullName: "Air Force Common Admission Test" }
        ],
        // Exam Intelligence Data
        examInfo: {
            "agniveer": {
                description: "The Agnipath Scheme allows patriotic youth to serve in the Armed Forces for a period of four years. Select a trade below to view specific details.",
                dates: "Notification: Feb 2025",
                eligibility: "Varies by Trade",
                ageLimit: "17.5 - 21 Years",
                roles: {
                    "gd": {
                        title: "General Duty (GD)",
                        pattern: {
                            totalQ: 50,
                            maxMarks: 100,
                            passMarks: 35,
                            negMark: 0.5,
                            correctMark: 2,
                            subjects: [
                                { name: "GK", count: 15, color: "#d97706" },
                                { name: "Science", count: 15, color: "#16a34a" },
                                { name: "Maths", count: 15, color: "#2563eb" },
                                { name: "Reasoning", count: 5, color: "#9333ea" }
                            ]
                        },
                        syllabus: {
                            "GK": ["Current Affairs", "History", "Geography"],
                            "Science": ["Physics", "Chemistry", "Biology (10th)"],
                            "Maths": ["Arithmetic", "Algebra", "Geometry"],
                            "Reasoning": ["Verbal", "Non-Verbal"]
                        },
                        physical: [
                            { task: "1.6 KM Run", standard: "5 Min 30 Sec" },
                            { task: "Pull Ups", standard: "10 Reps" }
                        ]
                    },
                    "tech": {
                        title: "Technical",
                        pattern: {
                            totalQ: 50,
                            maxMarks: 200,
                            passMarks: 80,
                            negMark: 1.0,
                            correctMark: 4,
                            subjects: [
                                { name: "GK", count: 10, color: "#d97706" },
                                { name: "Maths", count: 15, color: "#2563eb" },
                                { name: "Physics", count: 15, color: "#0891b2" },
                                { name: "Chemistry", count: 10, color: "#be123c" }
                            ]
                        },
                        syllabus: {
                            "Physics": ["Mechanics", "Thermodynamics"],
                            "Maths": ["Calculus", "Vectors", "Trigonometry"],
                            "Chemistry": ["Physical", "Organic", "Inorganic"],
                            "GK": ["General Awareness"]
                        },
                        physical: [
                            { task: "1.6 KM Run", standard: "5 Min 45 Sec" },
                            { task: "Pull Ups", standard: "10 Reps" }
                        ]
                    },
                    "clerk": {
                        title: "Clerk / SKT",
                        pattern: {
                            totalQ: 50,
                            maxMarks: 200,
                            passMarks: 80,
                            negMark: 1.0,
                            correctMark: 4,
                            subjects: [
                                { name: "GK & Sci", count: 10, color: "#d97706" },
                                { name: "Maths", count: 10, color: "#2563eb" },
                                { name: "Comp Sci", count: 5, color: "#4f46e5" },
                                { name: "English", count: 25, color: "#059669" }
                            ]
                        },
                        syllabus: {
                            "English": ["Grammar", "Comprehension"],
                            "Computer": ["MS Office", "Windows"],
                            "Maths": ["Arithmetic", "Algebra"],
                            "GK": ["Current Affairs"]
                        },
                        physical: [
                            { task: "1.6 KM Run", standard: "5 Min 45 Sec" },
                            { task: "Pull Ups", standard: "10 Reps" }
                        ]
                    }
                }
            },
            "nda": {
                description: "The National Defence Academy (NDA) is the joint defence service training institute of the Indian Armed Forces.",
                dates: "Exam: April 21, 2025",
                eligibility: "12th Pass (PCM)",
                ageLimit: "16.5 - 19.5 Years",
                pattern: {
                    totalQ: 270,
                    maxMarks: 900,
                    passMarks: 360,
                    subjects: [
                        { name: "Maths", count: 120, color: "#dc2626" },
                        { name: "GAT", count: 150, color: "#4f46e5" }
                    ]
                },
                syllabus: {
                    "Maths": ["Algebra", "Matrices", "Trigonometry"],
                    "GAT": ["English", "Physics", "Chemistry", "General Science"]
                },
                physical: [
                    { task: "Height", standard: "157 cm (Min)" },
                    { task: "Running", standard: "2.4 km in 15 min" }
                ]
            }
        },
        // "One Course Per Exam" Approach
        courses: {
            "agniveer": {
                id: "agniveer-pass",
                title: "Agniveer Complete Access",
                subtitle: "Unlock GD, Tech & Clerk Content",
                exam: "Agniveer",
                type: "Self-Paced Bundle",
                rating: 4.8,
                price: "₹999",
                originalPrice: "₹2,499",
                features: [
                    "5000+ Practice Questions",
                    "Chapter-wise Notes (GD/Tech/Clerk)",
                    "20+ Full Length Mock Tests", 
                    "Previous Year Papers (Solved)"
                ],
                link: "/course/defence/agniveer",
                image: "bg-emerald-900"
            },
            "nda": {
                id: "nda-pass",
                title: "NDA Ultimate Pass",
                subtitle: "Maths + GAT Comprehensive",
                exam: "NDA",
                type: "Self-Paced Bundle",
                rating: 4.9,
                price: "₹1,499",
                originalPrice: "₹3,999",
                features: [
                    "Maths Concept Videos", 
                    "GAT Rapid Revision Notes",
                    "10 Years PYQ Analysis", 
                    "SSB Interview Guide"
                ],
                link: "/course/defence/nda",
                image: "bg-indigo-900"
            }
        }
    }
};

const CategoryPage = () => {
    const { categoryId } = useParams();
    const [selectedSubCat, setSelectedSubCat] = useState('agniveer'); 
    const [agniveerRole, setAgniveerRole] = useState('gd'); 
    const [activeSubject, setActiveSubject] = useState('');
    const [calculator, setCalculator] = useState({ correct: '', wrong: '', score: null });
    
    const canvasRef = useRef(null);
    const chartRef = useRef(null);
    
    const data = CATEGORY_DATA[categoryId] || CATEGORY_DATA["defence"];
    
    let currentInfo = data.examInfo[selectedSubCat] || data.examInfo["nda"];
    
    if (selectedSubCat === 'agniveer' && currentInfo.roles) {
        const roleData = currentInfo.roles[agniveerRole];
        currentInfo = { 
            ...currentInfo, 
            pattern: roleData.pattern, 
            syllabus: roleData.syllabus,
            physical: roleData.physical
        };
    }

    useEffect(() => {
        if(currentInfo.syllabus) {
            setActiveSubject(Object.keys(currentInfo.syllabus)[0]);
        }
        setCalculator({ correct: '', wrong: '', score: null });
    }, [selectedSubCat, agniveerRole]); 

    useEffect(() => {
        if (currentInfo?.pattern && canvasRef.current) {
            if (chartRef.current) chartRef.current.destroy();
            const ctx = canvasRef.current.getContext('2d');
            
            chartRef.current = new Chart(ctx, {
                type: 'doughnut',
                data: {
                    labels: currentInfo.pattern.subjects.map(s => s.name),
                    datasets: [{
                        data: currentInfo.pattern.subjects.map(s => s.count),
                        backgroundColor: currentInfo.pattern.subjects.map(s => s.color),
                        borderWidth: 0,
                        hoverOffset: 10
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    cutout: '70%',
                    plugins: {
                        legend: { display: false },
                        tooltip: { backgroundColor: '#1c1917', padding: 12 }
                    }
                }
            });
        }
    }, [selectedSubCat, agniveerRole, currentInfo]);

    const calculateScore = () => {
        if(!currentInfo.pattern) return;
        const c = parseInt(calculator.correct) || 0;
        const w = parseInt(calculator.wrong) || 0;
        if(c+w > currentInfo.pattern.totalQ) return alert("Attempts exceed total questions!");
        const score = (c * (currentInfo.pattern.correctMark || 1)) - (w * (currentInfo.pattern.negMark || 0));
        setCalculator(prev => ({...prev, score: score.toFixed(2)}));
    };

    // --- GET THE SINGLE COURSE FOR THE SELECTED EXAM ---
    const activeCourse = data.courses[selectedSubCat];

    return (
        <div className="min-h-screen bg-stone-50 dark:bg-slate-950 font-sans text-slate-800 dark:text-slate-200">
            
            {/* HERO SECTION */}
            <div className={`relative ${data.heroImage} text-white pt-32 pb-24 px-6 overflow-hidden`}>
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20"></div>
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white/5 rounded-full blur-[100px] pointer-events-none"></div>
                <div className="max-w-7xl mx-auto relative z-10">
                    <div className="flex flex-col md:flex-row justify-between items-end gap-8">
                        <div>
                            <div className="flex items-center gap-2 text-white/60 mb-4 text-sm font-medium uppercase tracking-widest">
                                <Link to="/" className="hover:text-white transition-colors">Home</Link> 
                                <ChevronRight size={12}/> 
                                <span>{data.title}</span>
                            </div>
                            <h1 className="text-5xl md:text-7xl font-black mb-4 tracking-tighter uppercase">
                                {data.title} <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">HQ</span>
                            </h1>
                            <p className="text-xl text-white/70 max-w-2xl font-light leading-relaxed">{data.tagline}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* NAVIGATOR */}
            <div className="sticky top-20 z-40 bg-white/80 dark:bg-slate-900/90 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800 shadow-sm">
                <div className="max-w-7xl mx-auto px-6 overflow-x-auto no-scrollbar">
                    <div className="flex gap-8">
                        {data.subCategories.map((sub) => (
                            <button
                                key={sub.id}
                                onClick={() => setSelectedSubCat(sub.id)}
                                className={`py-5 text-sm font-bold border-b-[3px] transition-all whitespace-nowrap flex items-center gap-2
                                    ${selectedSubCat === sub.id 
                                        ? `border-${data.themeColor}-500 text-${data.themeColor}-600 dark:text-${data.themeColor}-400` 
                                        : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'}`}
                            >
                                {selectedSubCat === sub.id && <Target size={16} className="animate-pulse"/>}
                                {sub.name}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 py-12">
                
                {/* AGNIVEER ROLE SELECTOR */}
                {selectedSubCat === 'agniveer' && (
                    <div className="flex justify-center mb-12 animate-in fade-in slide-in-from-top-4 duration-500">
                        <div className="inline-flex bg-white dark:bg-slate-800 p-1.5 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700">
                            {[
                                { id: 'gd', label: 'General Duty (GD)' },
                                { id: 'tech', label: 'Technical' },
                                { id: 'clerk', label: 'Clerk / SKT' }
                            ].map((role) => (
                                <button
                                    key={role.id}
                                    onClick={() => setAgniveerRole(role.id)}
                                    className={`px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${
                                        agniveerRole === role.id
                                        ? 'bg-emerald-600 text-white shadow-md'
                                        : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'
                                    }`}
                                >
                                    {role.label}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* COMMAND CENTER DASHBOARD */}
                <div className="grid lg:grid-cols-3 gap-8 mb-16 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    
                    {/* Left Panel */}
                    <div className="lg:col-span-2 space-y-6">
                        
                        {/* 1. Exam Pattern Card */}
                        <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl border border-slate-200 dark:border-slate-800 overflow-hidden relative">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-[80px]"></div>
                            <div className="p-8 relative z-10">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="p-3 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400">
                                        <Shield size={28} />
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-bold dark:text-white">Exam Intelligence</h2>
                                        <p className="text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wide font-bold">
                                            {selectedSubCat === 'agniveer' ? `Agniveer - ${CATEGORY_DATA.defence.examInfo.agniveer.roles[agniveerRole].title}` : data.subCategories.find(s => s.id === selectedSubCat)?.fullName}
                                        </p>
                                    </div>
                                </div>
                                <p className="text-slate-600 dark:text-slate-300 text-base leading-relaxed mb-8 border-l-4 border-emerald-500 pl-4">
                                    {currentInfo.description}
                                </p>
                                <div className="grid md:grid-cols-2 gap-8 items-center bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-6 border border-slate-100 dark:border-slate-700">
                                    <div className="relative h-40 w-40 mx-auto">
                                        <canvas ref={canvasRef}></canvas>
                                        <div className="absolute inset-0 flex items-center justify-center flex-col pointer-events-none">
                                            <span className="text-2xl font-black text-slate-800 dark:text-white">{currentInfo.pattern?.totalQ}</span>
                                            <span className="text-[9px] uppercase font-bold text-slate-400">Questions</span>
                                        </div>
                                    </div>
                                    <div className="space-y-3">
                                        {currentInfo.pattern?.subjects.map((sub, i) => (
                                            <div key={i} className="flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-2 h-2 rounded-full" style={{backgroundColor: sub.color}}></div>
                                                    <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">{sub.name}</span>
                                                </div>
                                                <span className="text-xs font-bold text-slate-500 dark:text-slate-500">{sub.count} Qs</span>
                                            </div>
                                        ))}
                                        <div className="pt-3 mt-3 border-t border-slate-200 dark:border-slate-700 flex justify-between text-xs">
                                            <span className="text-emerald-600 font-bold flex items-center gap-1"><CheckCircle size={12}/> Pass Marks: {currentInfo.pattern?.passMarks}</span>
                                            <span className="text-slate-400 font-bold">Total: {currentInfo.pattern?.maxMarks} Marks</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* 2. Syllabus Accordion */}
                        {currentInfo.syllabus && (
                            <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-lg border border-slate-200 dark:border-slate-800 p-6">
                                <h3 className="text-xl font-bold text-stone-900 dark:text-white mb-6 flex items-center gap-2">
                                    <BookOpen className="text-amber-500" /> Tactical Syllabus
                                </h3>
                                <div className="flex gap-2 overflow-x-auto pb-4 mb-4 no-scrollbar">
                                    {Object.keys(currentInfo.syllabus).map(sub => (
                                        <button 
                                            key={sub}
                                            onClick={() => setActiveSubject(sub)}
                                            className={`px-4 py-2 rounded-lg text-sm font-bold whitespace-nowrap transition-all ${activeSubject === sub ? 'bg-stone-800 dark:bg-white text-white dark:text-slate-900 shadow-lg' : 'bg-stone-100 dark:bg-slate-800 text-stone-500 dark:text-slate-400 hover:bg-stone-200 dark:hover:bg-slate-700'}`}
                                        >
                                            {sub}
                                        </button>
                                    ))}
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 animate-in fade-in slide-in-from-bottom-2 duration-300">
                                    {currentInfo.syllabus[activeSubject]?.map((topic, idx) => (
                                        <div key={idx} className="flex items-center gap-3 p-3 rounded-lg border border-stone-100 dark:border-slate-700 bg-stone-50/50 dark:bg-slate-800/50">
                                            <div className="h-2 w-2 rounded-full bg-green-500"></div>
                                            <span className="text-sm font-medium text-stone-700 dark:text-slate-300">{topic}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Right Panel */}
                    <div className="space-y-6">
                        {/* Calculator */}
                        <div className="bg-slate-900 text-white rounded-3xl p-6 shadow-xl relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500 rounded-full blur-[80px] opacity-20"></div>
                            <h3 className="text-lg font-bold mb-1 flex items-center gap-2 relative z-10">
                                <BarChart3 size={18} className="text-amber-500" /> Score Simulator
                            </h3>
                            <p className="text-xs text-stone-400 mb-6 relative z-10">Estimate your written test potential.</p>
                            
                            <div className="space-y-4 relative z-10">
                                <div>
                                    <label className="text-[10px] uppercase font-bold text-stone-500 mb-1 block">Correct Attempts</label>
                                    <input 
                                        type="number" 
                                        value={calculator.correct}
                                        onChange={(e) => setCalculator({...calculator, correct: e.target.value})}
                                        className="w-full bg-stone-800 border border-stone-700 rounded-lg p-3 text-sm focus:border-amber-500 outline-none transition-colors"
                                        placeholder="0"
                                    />
                                </div>
                                <div>
                                    <label className="text-[10px] uppercase font-bold text-stone-500 mb-1 block">Wrong Attempts</label>
                                    <input 
                                        type="number" 
                                        value={calculator.wrong}
                                        onChange={(e) => setCalculator({...calculator, wrong: e.target.value})}
                                        className="w-full bg-stone-800 border border-stone-700 rounded-lg p-3 text-sm focus:border-red-500 outline-none transition-colors"
                                        placeholder="0"
                                    />
                                </div>
                                <button 
                                    onClick={calculateScore}
                                    className="w-full bg-amber-600 hover:bg-amber-700 text-white py-3 rounded-lg font-bold text-sm shadow-lg transition-colors"
                                >
                                    Calculate Score
                                </button>
                            </div>

                            {calculator.score !== null && (
                                <div className="mt-6 p-4 bg-stone-800 rounded-xl border border-stone-700 text-center animate-in fade-in zoom-in duration-300">
                                    <div className="text-xs text-stone-400 uppercase font-bold mb-1">Projected Score</div>
                                    <div className="text-3xl font-black text-white">{calculator.score}</div>
                                    <div className={`text-xs font-bold mt-1 ${parseFloat(calculator.score) >= (currentInfo.pattern?.passMarks || 35) ? 'text-green-400' : 'text-red-400'}`}>
                                        {parseFloat(calculator.score) >= (currentInfo.pattern?.passMarks || 35) ? 'PASSING ZONE' : 'NEEDS WORK'}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Physical Standards */}
                        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-lg border border-slate-200 dark:border-slate-800">
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                                <Ruler className="text-orange-500" size={20} /> Physical Standards
                            </h3>
                            <div className="space-y-3">
                                {currentInfo.physical?.map((item, idx) => (
                                    <div key={idx} className="flex justify-between items-center p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                                        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{item.task}</span>
                                        <span className="text-xs font-bold text-slate-900 dark:text-white bg-white dark:bg-slate-700 px-2 py-1 rounded shadow-sm">
                                            {item.standard}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* --- 4. START LEARNING (The "One Enrollment" Card) --- */}
                {activeCourse ? (
                    <div className="mb-16">
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
                                <Zap className="text-yellow-500 fill-yellow-500" size={28} /> 
                                Start Your Prep
                            </h2>
                        </div>

                        {/* PREMIUM "ALL ACCESS" CARD */}
                        <div className="relative group bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-2xl hover:shadow-3xl transition-all duration-300">
                            
                            {/* Decorative Blur */}
                            <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-3xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
                            
                            <div className="relative flex flex-col md:flex-row h-full bg-white dark:bg-slate-900 rounded-3xl">
                                
                                {/* Image / Banner Side */}
                                <div className={`md:w-2/5 ${activeCourse.image} relative p-8 flex flex-col justify-between overflow-hidden`}>
                                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/diagmonds-light.png')] opacity-10"></div>
                                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-[80px]"></div>
                                    
                                    <div className="relative z-10">
                                        <span className="inline-block bg-white/20 backdrop-blur-md border border-white/10 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-4">
                                            {activeCourse.type}
                                        </span>
                                        <h3 className="text-3xl font-black text-white leading-tight mb-2">{activeCourse.title}</h3>
                                        <p className="text-white/80 text-sm font-medium">{activeCourse.subtitle}</p>
                                    </div>

                                    <div className="relative z-10 mt-8">
                                        <div className="flex items-center gap-2 text-white/90 text-sm font-bold">
                                            <Infinity size={18} className="text-yellow-400" />
                                            Unlimited Access
                                        </div>
                                    </div>
                                </div>

                                {/* Content Side */}
                                <div className="md:w-3/5 p-8 flex flex-col justify-between">
                                    <div>
                                        <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                                            <Layers className="text-blue-500" /> What's Included?
                                        </h4>
                                        <div className="grid sm:grid-cols-2 gap-4">
                                            {activeCourse.features.map((feat, i) => (
                                                <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700">
                                                    <div className="bg-green-100 dark:bg-green-900/30 p-1.5 rounded-full text-green-600 dark:text-green-400">
                                                        <CheckCircle size={14} />
                                                    </div>
                                                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{feat}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
                                        <div className="text-center sm:text-left">
                                            <div className="text-sm text-slate-400 line-through font-medium">Original Price: {activeCourse.originalPrice}</div>
                                            <div className="flex items-center gap-2">
                                                <span className="text-3xl font-black text-slate-900 dark:text-white">{activeCourse.price}</span>
                                                <span className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-bold px-2 py-1 rounded">60% OFF</span>
                                            </div>
                                        </div>
                                        <Link 
                                            to={activeCourse.link} 
                                            className="w-full sm:w-auto bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-200 dark:text-slate-900 text-white px-8 py-4 rounded-xl font-bold text-base transition-all shadow-xl hover:shadow-2xl flex items-center justify-center gap-2 group"
                                        >
                                            Start Learning Now <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="mb-16 py-12 text-center text-slate-400 bg-slate-50 dark:bg-slate-900/50 rounded-3xl border border-dashed border-slate-200 dark:border-slate-800">
                        <Lock className="mx-auto mb-4 opacity-50" size={32} />
                        <p>Access for this exam category is opening soon.</p>
                    </div>
                )}

            </div>
        </div>
    );
};

export default CategoryPage;