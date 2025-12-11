import React, { useState, useEffect, useRef } from 'react';
import { Chart } from 'chart.js/auto';
import { 
    Target, Shield, Award, Clock, CheckCircle, 
    BookOpen, BarChart3, AlertTriangle, ChevronRight,
    Ruler, Calendar, Zap, Lock, FileText,
    BrainCircuit, Calculator, Globe, Microscope, 
    ChevronDown, ChevronUp
} from 'lucide-react';

// --- DATA: EXAM PATTERN & SYLLABUS (Detailed from your input) ---
const EXAM_DATA = {
    gd: {
        title: "General Duty (GD)",
        desc: "The backbone of the Indian Army. Requires high physical endurance and 10th-level academics.",
        totalQ: 50,
        maxMarks: 100,
        passMarks: 35,
        negMark: 0.5,
        correctMark: 2,
        color: "emerald",
        subjects: [
            { name: "General Knowledge", questions: 15, marks: 30, color: "#d97706" },
            { name: "General Science", questions: 15, marks: 30, color: "#16a34a" },
            { name: "Maths", questions: 15, marks: 30, color: "#2563eb" },
            { name: "Logical Reasoning", questions: 5, marks: 10, color: "#9333ea" }
        ],
        // Detailed Syllabus Structure
        syllabus: {
            "General Knowledge": {
                icon: <Globe size={18} />,
                topics: [
                    "Abbreviations", "Science – Inventions & Discoveries", "Current Important Events",
                    "Current Affairs – National & International", "Awards and Honors", "Important Financial",
                    "Economic News", "Banking News", "Indian Constitution", "Books and Authors",
                    "Important Days", "History", "Sports Terminology", "Geography",
                    "Solar System", "Indian states and capitals", "Countries and Currencies"
                ]
            },
            "General Science": {
                icon: <Microscope size={18} />,
                topics: [
                    "Biology (10th / 12th Level)",
                    "Chemistry (10th / 12th Level)",
                    "Physics (10th / 12th Level)",
                    "Human Body & Diseases", "Everyday Science Principles"
                ]
            },
            "Maths": {
                icon: <Calculator size={18} />,
                topics: [
                    "Mixture & Allegations", "Pipes and Cisterns", "Speed, Time & Distance (Train, Boats & Stream)",
                    "Mensuration", "Trigonometry", "Geometry", "Time and Work", "Probability",
                    "HCF & LCM", "Algebraic Expressions and Inequalities", "Average", "Percentage",
                    "Profit and Loss", "Number System", "Simple & Compound interest", 
                    "Ratio and Proportion", "Partnership", "Data Interpretation", "Number Series"
                ]
            },
            "Logical Reasoning": {
                icon: <BrainCircuit size={18} />,
                topics: [
                    "Number, Ranking & Time Sequence", "Deriving Conclusions from Passages",
                    "Logical Sequence of Words", "Alphabet Test Series", "Arithmetical Reasoning",
                    "Situation Reaction Test", "Coding-Decoding", "Direction Sense Test", "Analogy",
                    "Data Sufficiency", "Clocks & Calendars", "Statement – Conclusions",
                    "Logical Venn Diagrams", "Statement – Arguments", "Inserting The Missing Character",
                    "Puzzles", "Alpha-Numeric Sequence Puzzle"
                ]
            }
        },
        physical: [
            { task: "1.6 KM Run", standard: "5 Min 30 Sec", marks: "60 Marks" },
            { task: "Pull Ups", standard: "10 Reps", marks: "40 Marks" },
            { task: "9 Feet Ditch", standard: "Qualify", marks: "-" },
            { task: "Zig-Zag Balance", standard: "Qualify", marks: "-" }
        ]
    },
    tech: {
        title: "Technical",
        desc: "For the tech-savvy. Focuses on technical maintenance and handling of army equipment.",
        totalQ: 50,
        maxMarks: 200,
        passMarks: 80,
        negMark: 1.0,
        correctMark: 4,
        color: "blue",
        subjects: [
            { name: "GK", questions: 10, marks: 40, color: "#d97706" },
            { name: "Maths", questions: 15, marks: 60, color: "#2563eb" },
            { name: "Physics", questions: 15, marks: 60, color: "#0891b2" },
            { name: "Chemistry", questions: 10, marks: 40, color: "#be123c" }
        ],
        syllabus: {
            "Physics": { icon: <Zap size={18}/>, topics: ["Mechanics", "Thermodynamics", "Electricity", "Optics", "Modern Physics"] },
            "Maths": { icon: <Calculator size={18}/>, topics: ["Algebra", "Calculus", "Vectors", "Trigonometry", "Geometry"] },
            "Chemistry": { icon: <Microscope size={18}/>, topics: ["Physical Chem", "Organic Chem", "Inorganic Chem"] },
            "GK": { icon: <Globe size={18}/>, topics: ["History", "Defence News", "Sports"] }
        },
        physical: [
            { task: "1.6 KM Run", standard: "5 Min 45 Sec", marks: "Qualify" },
            { task: "Pull Ups", standard: "10 Reps", marks: "Qualify" },
            { task: "9 Feet Ditch", standard: "Qualify", marks: "-" },
            { task: "Zig-Zag Balance", standard: "Qualify", marks: "-" }
        ]
    },
    clerk: {
        title: "Clerk / SKT",
        desc: "Administrative role. Requires strong command over English and Computer proficiency.",
        totalQ: 50,
        maxMarks: 200,
        passMarks: "80 (32 each part)",
        negMark: 1.0,
        correctMark: 4,
        color: "amber",
        subjects: [
            { name: "GK & Science", questions: 10, marks: 40, color: "#d97706" },
            { name: "Maths", questions: 10, marks: 40, color: "#2563eb" },
            { name: "Comp. Science", questions: 5, marks: 20, color: "#4f46e5" },
            { name: "English", questions: 25, marks: 100, color: "#059669" }
        ],
        syllabus: {
            "English": { icon: <BookOpen size={18}/>, topics: ["Grammar", "Comprehension", "Vocabulary", "Sentence Structure"] },
            "Computer": { icon: <Target size={18}/>, topics: ["MS Office", "Windows", "Hardware", "Internet"] },
            "Maths": { icon: <Calculator size={18}/>, topics: ["Arithmetic", "Basic Algebra", "Mensuration"] },
            "GK & GS": { icon: <Globe size={18}/>, topics: ["Current Affairs", "Basic Science", "Civics"] }
        },
        physical: [
            { task: "1.6 KM Run", standard: "5 Min 45 Sec", marks: "Qualify" },
            { task: "Pull Ups", standard: "10 Reps", marks: "Qualify" },
            { task: "9 Feet Ditch", standard: "Qualify", marks: "-" },
            { task: "Zig-Zag Balance", standard: "Qualify", marks: "-" }
        ]
    }
};

const AgniveerPage = () => {
    const [role, setRole] = useState('gd');
    const [activeSubject, setActiveSubject] = useState('');
    const [calculator, setCalculator] = useState({ correct: '', wrong: '', score: null });
    const [expandedTopic, setExpandedTopic] = useState(null); // For accordion
    
    const chartRef = useRef(null);
    const canvasRef = useRef(null);

    const currentData = EXAM_DATA[role];

    // Reset subject when role changes
    useEffect(() => {
        setActiveSubject(Object.keys(currentData.syllabus)[0]);
    }, [role]);

    // Chart Logic
    useEffect(() => {
        if (chartRef.current) chartRef.current.destroy();
        const ctx = canvasRef.current.getContext('2d');
        
        chartRef.current = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: currentData.subjects.map(s => s.name),
                datasets: [{
                    data: currentData.subjects.map(s => s.questions),
                    backgroundColor: currentData.subjects.map(s => s.color),
                    borderWidth: 0,
                    hoverOffset: 10
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                cutout: '75%',
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        backgroundColor: '#1c1917',
                        padding: 12,
                        bodyFont: { size: 14 }
                    }
                }
            }
        });
    }, [role]);

    const calculateScore = () => {
        const c = parseInt(calculator.correct) || 0;
        const w = parseInt(calculator.wrong) || 0;
        if(c+w > currentData.totalQ) return alert("Attempts exceed total questions!");
        
        const score = (c * currentData.correctMark) - (w * currentData.negMark);
        setCalculator(prev => ({...prev, score: score.toFixed(2)}));
    };

    return (
        <div className="bg-stone-50 min-h-screen font-sans text-stone-800 pb-20">
            
            {/* --- HERO SECTION --- */}
            <div className="relative bg-stone-900 text-white pt-28 pb-32 overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20"></div>
                <div className="absolute top-0 right-0 w-96 h-96 bg-green-600 rounded-full blur-[128px] opacity-20"></div>
                
                <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
                    <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-6 text-green-400">
                        <Shield size={14} /> Mission Agniveer 2025
                    </div>
                    <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tight uppercase">
                        Join the <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-600">Elite Force</span>
                    </h1>
                    <p className="text-xl text-stone-400 max-w-2xl mx-auto mb-10">
                        Detailed intelligence on Syllabus, Exam Pattern, and Physical Standards. Choose your trade and start training.
                    </p>
                    
                    {/* Role Toggles */}
                    <div className="inline-flex bg-stone-800 p-1 rounded-xl shadow-2xl border border-stone-700">
                        {Object.keys(EXAM_DATA).map((r) => (
                            <button
                                key={r}
                                onClick={() => setRole(r)}
                                className={`px-6 py-3 rounded-lg text-sm font-bold transition-all ${
                                    role === r 
                                    ? 'bg-gradient-to-b from-green-600 to-green-700 text-white shadow-lg' 
                                    : 'text-stone-400 hover:text-white hover:bg-stone-700'
                                }`}
                            >
                                {EXAM_DATA[r].title}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 -mt-20 relative z-20">
                <div className="grid lg:grid-cols-3 gap-8">
                    
                    {/* --- LEFT COLUMN: EXAM INTEL --- */}
                    <div className="lg:col-span-2 space-y-8">
                        
                        {/* 1. Exam Pattern Card */}
                        <div className="bg-white rounded-2xl shadow-xl border border-stone-200 overflow-hidden">
                            <div className="p-6 border-b border-stone-100 flex justify-between items-center bg-stone-50/50">
                                <div>
                                    <h3 className="text-xl font-bold text-stone-900 flex items-center gap-2">
                                        <Target className="text-green-600" /> Pattern Analysis
                                    </h3>
                                    <p className="text-stone-500 text-xs mt-1">Written Test Structure for {currentData.title}</p>
                                </div>
                                <div className="text-right">
                                    <div className="text-2xl font-black text-stone-900">{currentData.maxMarks}</div>
                                    <div className="text-[10px] uppercase font-bold text-stone-400">Max Marks</div>
                                </div>
                            </div>
                            
                            <div className="p-8 grid md:grid-cols-2 gap-8 items-center">
                                <div className="relative h-48 w-48 mx-auto">
                                    <canvas ref={canvasRef}></canvas>
                                    <div className="absolute inset-0 flex items-center justify-center flex-col pointer-events-none">
                                        <span className="text-3xl font-black text-stone-800">{currentData.totalQ}</span>
                                        <span className="text-[9px] uppercase font-bold text-stone-400">Questions</span>
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    {currentData.subjects.map((sub, i) => (
                                        <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-stone-50 border border-stone-100">
                                            <div className="flex items-center gap-3">
                                                <div className="w-3 h-3 rounded-full" style={{backgroundColor: sub.color}}></div>
                                                <span className="font-bold text-sm text-stone-700">{sub.name}</span>
                                            </div>
                                            <span className="text-xs font-bold text-stone-500 bg-white px-2 py-1 rounded border border-stone-200">{sub.questions} Qs</span>
                                        </div>
                                    ))}
                                    <div className="flex gap-4 mt-4 pt-4 border-t border-dashed border-stone-200">
                                        <div className="flex items-center gap-2 text-xs font-bold text-green-700 bg-green-50 px-3 py-1.5 rounded">
                                            <CheckCircle size={14} /> +{currentData.correctMark} Correct
                                        </div>
                                        <div className="flex items-center gap-2 text-xs font-bold text-red-600 bg-red-50 px-3 py-1.5 rounded">
                                            <AlertTriangle size={14} /> -{currentData.negMark} Wrong
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* 2. Detailed Syllabus Accordion (UPDATED) */}
                        <div className="bg-white rounded-2xl shadow-xl border border-stone-200 overflow-hidden">
                            <div className="p-6 border-b border-stone-100 bg-stone-50/50">
                                <h3 className="text-xl font-bold text-stone-900 flex items-center gap-2">
                                    <BookOpen className="text-amber-500" /> Tactical Syllabus
                                </h3>
                                <p className="text-stone-500 text-xs mt-1">Complete topic breakdown for written exam.</p>
                            </div>
                            
                            <div className="divide-y divide-stone-100">
                                {Object.keys(currentData.syllabus).map((subject, idx) => (
                                    <div key={idx} className="group">
                                        <button 
                                            onClick={() => setExpandedTopic(expandedTopic === idx ? null : idx)}
                                            className="w-full flex items-center justify-between p-5 hover:bg-stone-50 transition-colors text-left"
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className={`p-2 rounded-lg ${expandedTopic === idx ? 'bg-amber-100 text-amber-700' : 'bg-stone-100 text-stone-500'}`}>
                                                    {currentData.syllabus[subject].icon}
                                                </div>
                                                <span className="font-bold text-stone-800">{subject}</span>
                                            </div>
                                            {expandedTopic === idx ? <ChevronUp size={20} className="text-stone-400"/> : <ChevronDown size={20} className="text-stone-400"/>}
                                        </button>
                                        
                                        {/* Dropdown Content */}
                                        {expandedTopic === idx && (
                                            <div className="bg-stone-50 px-5 pb-5 animate-in fade-in slide-in-from-top-1 duration-200">
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                                                    {currentData.syllabus[subject].topics.map((topic, tIdx) => (
                                                        <div key={tIdx} className="flex items-start gap-2 text-sm text-stone-600 bg-white p-3 rounded-lg border border-stone-100 shadow-sm">
                                                            <div className="h-1.5 w-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0"></div>
                                                            {topic}
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* 3. Recommended Batches Section (Kept as requested) */}
                        <div className="mb-8">
                            {/* ... (Existing Batch cards code if you want it here, or handled by CategoryPage) ... */}
                            <div className="p-6 bg-stone-100 rounded-xl border border-stone-200 text-center">
                                <Lock className="mx-auto text-stone-400 mb-2" />
                                <p className="text-stone-500 text-sm">Course Enrollment is managed via the <strong>Command Center</strong> (Category Page).</p>
                                <p className="text-xs text-stone-400 mt-1">Navigate back to view available passes.</p>
                            </div>
                        </div>

                    </div>

                    {/* --- RIGHT COLUMN: TOOLS & UTILITIES --- */}
                    <div className="space-y-8">
                        
                        {/* 1. Score Simulator */}
                        <div className="bg-stone-900 text-white rounded-2xl p-6 shadow-2xl relative overflow-hidden">
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
                                    <div className={`text-xs font-bold mt-1 ${parseFloat(calculator.score) >= 35 ? 'text-green-400' : 'text-red-400'}`}>
                                        {parseFloat(calculator.score) >= 35 ? 'PASSING ZONE' : 'NEEDS WORK'}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* 2. Physical Standards Card */}
                        <div className="bg-white rounded-2xl shadow-lg border border-stone-200 p-6">
                            <h3 className="text-lg font-bold text-stone-900 mb-4 flex items-center gap-2">
                                <Award className="text-blue-600" size={20} /> Physical Standards
                            </h3>
                            <div className="space-y-4">
                                {currentData.physical.map((item, i) => (
                                    <div key={i} className="flex items-center justify-between pb-3 border-b border-stone-100 last:border-0">
                                        <div className="text-sm font-medium text-stone-700">{item.task}</div>
                                        <div className="text-right">
                                            <div className="text-xs font-bold text-stone-900">{item.standard}</div>
                                            <div className="text-[10px] font-bold text-stone-400">{item.marks}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="mt-4 pt-4 bg-blue-50 rounded-lg p-3 text-xs text-blue-800 font-medium flex gap-2">
                                <Clock size={14} className="shrink-0 mt-0.5" />
                                <span>Physical test marks are added to your final merit list for GD. Prepare well!</span>
                            </div>
                        </div>

                        {/* 3. Important Dates (Mission Timeline) */}
                        <div className="bg-white rounded-2xl shadow-lg border border-stone-200 p-6">
                            <h3 className="text-lg font-bold text-stone-900 mb-4 flex items-center gap-2">
                                <Calendar className="text-red-500" size={20} /> Mission Timeline
                            </h3>
                            <div className="space-y-4">
                                <div className="flex items-start gap-3">
                                    <div className="bg-red-50 text-red-600 rounded-lg p-2 text-center min-w-[50px]">
                                        <div className="text-[10px] uppercase font-bold">Feb</div>
                                        <div className="text-xl font-bold">13</div>
                                    </div>
                                    <div>
                                        <div className="text-sm font-bold text-stone-800">Notification Released</div>
                                        <div className="text-xs text-stone-500">Official notification for 2025 intake.</div>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="bg-stone-100 text-stone-600 rounded-lg p-2 text-center min-w-[50px]">
                                        <div className="text-[10px] uppercase font-bold">Apr</div>
                                        <div className="text-xl font-bold">21</div>
                                    </div>
                                    <div>
                                        <div className="text-sm font-bold text-stone-800">Online CEE Exam</div>
                                        <div className="text-xs text-stone-500">Phase 1 Written Examination.</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* 4. Eligibility Quick Check */}
                        <div className="bg-emerald-50 rounded-2xl border border-emerald-100 p-6">
                            <h3 className="text-lg font-bold text-emerald-900 mb-2 flex items-center gap-2">
                                <Ruler size={18} /> Eligibility Check
                            </h3>
                            <div className="space-y-3 mt-4">
                                <div className="flex justify-between text-sm">
                                    <span className="text-stone-600">Age Limit</span>
                                    <span className="font-bold text-stone-900">17.5 - 21 Years</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-stone-600">Height (Avg)</span>
                                    <span className="font-bold text-stone-900">170 cm (GD)</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-stone-600">Chest</span>
                                    <span className="font-bold text-stone-900">77 cm (+5 exp)</span>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default AgniveerPage;