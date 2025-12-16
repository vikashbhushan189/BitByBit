import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate, useLocation } from 'react-router-dom';
import { Chart } from 'chart.js/auto';
import { 
    CheckCircle, FileText, Lock, Clock, 
    Calendar, Award, Star, ChevronDown, ChevronUp, 
    Shield, ArrowLeft, Zap, Users, BookOpen, BrainCircuit, 
    Calculator, Globe, Microscope, Target, X, CreditCard, ArrowRight,
    Cpu, Code, Database, Layers, Network, Server
} from 'lucide-react';
import api from '../../../../api/axios';

// --- COURSE DATA ---
const UGC_NET_DETAILS = {
    title: "UGC NET Computer Science & Applications",
    subtitle: "Complete Prep: Paper 1 + Paper 2 (Code 87)",
    price: "₹1,999",
    originalPrice: "₹4,999",
    discount: "60% OFF",
    rating: 4.9,
    students: "10,000+",
    validity: "Valid till Dec 2025 Exam",
    language: "English",
    theme: "purple",
    dates: {
        notification: "Expected Mar 2025",
        exam: "Jun 2025 (Cycle 1)"
    },
    stats: [
        { label: "Mock Tests", value: "20+" },
        { label: "Unit Notes", value: "20 Units" }, // 10 Paper 1 + 10 Paper 2
        { label: "PYQs Solved", value: "10 Years" }
    ],
    features: [
        "Comprehensive Paper 1 & 2 Coverage",
        "Unit-wise Detailed Notes & Quizzes",
        "10 Full-Length Mock Tests (CBT Mode)",
        "Previous Year Papers Analysis (2018-2024)",
        "Doubt Solving & Mentorship"
    ],
    // Syllabus Data based on provided text
    syllabus: [
        {
            title: "Paper 2: Computer Science (10 Units)",
            icon: <Cpu size={18} className="text-purple-600"/>,
            desc: "Subject Code 87 - In-depth Technical Coverage",
            content: [
                "Unit 1: Discrete Structures and Optimization (Logic, Sets, Graph Theory, LPP)",
                "Unit 2: Computer System Architecture (Digital Logic, Organization, Pipeline)",
                "Unit 3: Programming Languages & Computer Graphics (C++, Java, OpenGL)",
                "Unit 4: Database Management Systems (SQL, Normalization, NoSQL, Mining)",
                "Unit 5: System Software & Operating System (Process, Deadlock, Memory)",
                "Unit 6: Software Engineering (SDLC, Agile, Testing, Design)",
                "Unit 7: Data Structures and Algorithms (Complexity, Trees, Graphs)",
                "Unit 8: Theory of Computation and Compilers (Automata, Parsing)",
                "Unit 9: Data Communication and Computer Networks (OSI, TCP/IP, Security)",
                "Unit 10: Artificial Intelligence (AI, NLP, Neural Networks, GA)"
            ]
        },
        {
            title: "Paper 1: General Paper (10 Units)",
            icon: <BookOpen size={18} className="text-teal-600"/>,
            desc: "Teaching & Research Aptitude (Common for All)",
            content: [
                "I. Teaching Aptitude",
                "II. Research Aptitude",
                "III. Comprehension (Reading)",
                "IV. Communication",
                "V. Mathematical Reasoning and Aptitude",
                "VI. Logical Reasoning (Indian Logic included)",
                "VII. Data Interpretation (DI)",
                "VIII. ICT (Information & Communication Tech)",
                "IX. People, Development and Environment",
                "X. Higher Education System"
            ]
        }
    ],
    weightage: [
        { unit: "Discrete Structures", range: "10-15 Qs" },
        { unit: "System Software & OS", range: "10-15 Qs" },
        { unit: "Data Structures & Algo", range: "10-14 Qs" },
        { unit: "Computer Networks", range: "10-15 Qs" },
        { unit: "TOC & Compilers", range: "9-14 Qs" },
        { unit: "DBMS", range: "9-13 Qs" },
        { unit: "Prog. Lang & Graphics", range: "9-12 Qs" },
        { unit: "Artificial Intelligence", range: "7-12 Qs" },
        { unit: "Computer Architecture", range: "7-12 Qs" },
        { unit: "Software Engineering", range: "7-10 Qs" },
    ]
};

// --- PAYMENT MODAL ---
const PaymentModal = ({ isOpen, onClose, course }) => {
    const [step, setStep] = useState(1); 
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    if (!isOpen) return null;

    const handlePayment = async () => {
        setLoading(true);
        try {
            await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate gateway
            // CALL BACKEND TO SUBSCRIBE (Assuming Course ID for UGC NET is 2 - UPDATE THIS)
            // You need to ensure a Course with ID 2 exists in Django Admin or fetch it dynamically
            await api.post(`courses/2/subscribe/`); 
            setLoading(false);
            setStep(3); 
        } catch (err) {
            console.error("Subscription failed", err);
            alert("Payment simulation failed. Ensure you are logged in.");
            setLoading(false);
        }
    };

    const handleStartLearning = () => {
        onClose();
        navigate('/dashboard'); 
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-stone-900/80 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-3xl shadow-2xl overflow-hidden border border-stone-200 dark:border-slate-700 relative">
                <button onClick={onClose} className="absolute top-4 right-4 p-2 rounded-full hover:bg-stone-100 dark:hover:bg-slate-800 transition-colors z-10"><X size={20} className="text-stone-500" /></button>

                {step === 1 && (
                    <div className="p-6">
                        <div className="text-center mb-6">
                            <div className={`inline-flex p-3 rounded-2xl bg-purple-100 dark:bg-purple-900/30 text-purple-600 mb-4`}><Lock size={24} /></div>
                            <h2 className="text-2xl font-bold text-stone-900 dark:text-white">Secure Checkout</h2>
                            <p className="text-sm text-stone-500">Complete your purchase for UGC NET 2025.</p>
                        </div>
                        <div className="bg-stone-50 dark:bg-slate-800 p-4 rounded-xl mb-6 flex gap-4 items-center">
                            <div className={`w-16 h-16 rounded-lg bg-purple-500 shrink-0`}></div>
                            <div>
                                <h3 className="font-bold text-sm text-stone-900 dark:text-white line-clamp-1">{course.title}</h3>
                                <div className="text-lg font-black text-stone-900 dark:text-white mt-1">{course.price}</div>
                            </div>
                        </div>
                        <button onClick={() => setStep(2)} className="w-full bg-stone-900 dark:bg-white text-white dark:text-stone-900 py-3.5 rounded-xl font-bold text-sm shadow-lg hover:shadow-xl transition-all active:scale-95">
                            Proceed to Pay {course.price}
                        </button>
                    </div>
                )}

                {step === 2 && (
                    <div className="p-6">
                        <h2 className="text-xl font-bold text-stone-900 dark:text-white mb-6">Select Payment Method</h2>
                        <div className="space-y-3 mb-8">
                            <button onClick={handlePayment} className="w-full flex items-center gap-3 p-4 rounded-xl border border-stone-200 dark:border-slate-700 hover:border-emerald-500 transition-all text-left"><Zap size={18} className="text-purple-600"/><span className="font-bold text-sm text-stone-700 dark:text-stone-300">UPI (GPay, PhonePe)</span></button>
                            <button onClick={handlePayment} className="w-full flex items-center gap-3 p-4 rounded-xl border border-stone-200 dark:border-slate-700 hover:border-emerald-500 transition-all text-left"><CreditCard size={18} className="text-blue-600"/><span className="font-bold text-sm text-stone-700 dark:text-stone-300">Card</span></button>
                        </div>
                        {loading && (
                            <div className="absolute inset-0 bg-white/80 dark:bg-slate-900/80 flex flex-col items-center justify-center z-20">
                                <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mb-3"></div>
                                <p className="text-sm font-bold text-emerald-600 animate-pulse">Processing Payment...</p>
                            </div>
                        )}
                        <button onClick={() => setStep(1)} className="text-xs text-stone-400 hover:text-stone-600 underline">Go Back</button>
                    </div>
                )}

                {step === 3 && (
                    <div className="p-8 text-center">
                        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce"><CheckCircle size={40} className="text-green-600" /></div>
                        <h2 className="text-2xl font-black text-stone-900 dark:text-white mb-2">Payment Successful!</h2>
                        <p className="text-stone-500 text-sm mb-6">Welcome to Bit by Bit. Your UGC NET course is now active.</p>
                        <button onClick={handleStartLearning} className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3 rounded-xl font-bold shadow-lg transition-transform active:scale-95">
                            Start Learning
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

const UgcNetPage = () => {
    const navigate = useNavigate(); 
    const location = useLocation();
    const [isPaymentOpen, setIsPaymentOpen] = useState(false);
    const [activeSection, setActiveSection] = useState(0); // For syllabus accordion

    // --- GATEKEEPER LOGIC ---
    const handleEnrollClick = () => {
        const token = localStorage.getItem('access_token');
        if (!token) {
            navigate('/login', { state: { from: `${location.pathname}?enroll=true` } });
        } else {
            setIsPaymentOpen(true);
        }
    };

    // Auto-open payment if returned from login
    useEffect(() => {
        const params = new URLSearchParams(location.search);
        if (params.get('enroll') === 'true') {
            const token = localStorage.getItem('access_token');
            if (token) setIsPaymentOpen(true);
        }
    }, [location]);

    return (
        <div className="min-h-screen bg-stone-50 dark:bg-slate-950 font-sans text-stone-800 dark:text-slate-200">
            
            <PaymentModal isOpen={isPaymentOpen} onClose={() => setIsPaymentOpen(false)} course={UGC_NET_DETAILS} />

            {/* Sticky Mobile Enroll Bar */}
            <div className="md:hidden sticky top-0 z-50 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 p-4 flex justify-between items-center shadow-sm">
                <Link to={-1} className="p-2 -ml-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800"><ArrowLeft size={20}/></Link>
                <span className="font-bold text-sm truncate">UGC NET Comp. Sci.</span>
                <button onClick={handleEnrollClick} className="bg-purple-600 text-white px-4 py-1.5 rounded-lg text-xs font-bold">
                    Enroll {UGC_NET_DETAILS.price}
                </button>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
                <div className="grid lg:grid-cols-3 gap-8">
                    
                    {/* --- MAIN CONTENT --- */}
                    <div className="lg:col-span-2 space-y-10">
                        
                        {/* 1. Hero Card */}
                        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 md:p-8 shadow-xl border border-slate-200 dark:border-slate-800 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 rounded-full blur-[80px]"></div>
                            <div className="relative z-10">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 text-xs font-bold uppercase tracking-wider">
                                        <Award size={12} /> NET JRF Ready
                                    </div>
                                    <div className="flex items-center gap-1 text-yellow-500 text-sm font-bold">
                                        <Star fill="currentColor" size={16} /> {UGC_NET_DETAILS.rating} ({UGC_NET_DETAILS.students})
                                    </div>
                                </div>
                                <h1 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white mb-2 leading-tight">
                                    {UGC_NET_DETAILS.title}
                                </h1>
                                <p className="text-lg text-slate-500 dark:text-slate-400 mb-6">
                                    {UGC_NET_DETAILS.subtitle}
                                </p>
                                <div className="grid grid-cols-3 gap-4 border-t border-slate-100 dark:border-slate-800 pt-6">
                                    {UGC_NET_DETAILS.stats.map((stat, idx) => (
                                        <div key={idx}>
                                            <div className="text-xl font-bold text-slate-900 dark:text-white">{stat.value}</div>
                                            <div className="text-xs text-slate-500 dark:text-slate-400 font-medium uppercase">{stat.label}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* 2. Exam Pattern Table */}
                        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 md:p-8 shadow-lg border border-slate-200 dark:border-slate-800">
                            <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-slate-900 dark:text-white">
                                <Layout size={20} className="text-blue-500" /> Exam Pattern (CBT Mode)
                            </h2>
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm text-left">
                                    <thead className="text-xs text-slate-500 uppercase bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
                                        <tr>
                                            <th className="px-6 py-3">Particulars</th>
                                            <th className="px-6 py-3">Paper 1 (General)</th>
                                            <th className="px-6 py-3">Paper 2 (Comp Sci)</th>
                                            <th className="px-6 py-3">Total</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                        <tr className="bg-white dark:bg-slate-900">
                                            <td className="px-6 py-4 font-bold text-slate-900 dark:text-white">Questions</td>
                                            <td className="px-6 py-4 text-slate-600 dark:text-slate-400">50 (10 Units)</td>
                                            <td className="px-6 py-4 text-slate-600 dark:text-slate-400">100 (10 Units)</td>
                                            <td className="px-6 py-4 font-bold text-purple-600">150 Qs</td>
                                        </tr>
                                        <tr className="bg-white dark:bg-slate-900">
                                            <td className="px-6 py-4 font-bold text-slate-900 dark:text-white">Marks</td>
                                            <td className="px-6 py-4 text-slate-600 dark:text-slate-400">100 (2 per Q)</td>
                                            <td className="px-6 py-4 text-slate-600 dark:text-slate-400">200 (2 per Q)</td>
                                            <td className="px-6 py-4 font-bold text-purple-600">300 Marks</td>
                                        </tr>
                                        <tr className="bg-white dark:bg-slate-900">
                                            <td className="px-6 py-4 font-bold text-slate-900 dark:text-white">Duration</td>
                                            <td colSpan="3" className="px-6 py-4 text-center text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/50">
                                                Single 3-Hour Session (No Break)
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            <p className="mt-4 text-xs text-slate-400 italic text-center">* No negative marking for incorrect answers.</p>
                        </div>

                        {/* 3. Syllabus Accordion */}
                        <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-lg border border-slate-200 dark:border-slate-800 overflow-hidden">
                            <div className="p-6 md:p-8 border-b border-slate-100 dark:border-slate-800">
                                <h2 className="text-xl font-bold flex items-center gap-2 text-slate-900 dark:text-white">
                                    <BookOpen className="text-emerald-500" /> Syllabus Breakdown
                                </h2>
                                <p className="text-sm text-slate-500 mt-1">Detailed unit-wise topics for both papers</p>
                            </div>
                            
                            <div className="divide-y divide-slate-100 dark:divide-slate-800">
                                {UGC_NET_DETAILS.syllabus.map((paper, idx) => (
                                    <div key={idx} className="group">
                                        <button 
                                            onClick={() => setActiveSection(activeSection === idx ? -1 : idx)}
                                            className="w-full flex items-center justify-between p-6 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors text-left"
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-lg">
                                                    {paper.icon}
                                                </div>
                                                <div>
                                                    <h3 className="font-bold text-slate-900 dark:text-white">{paper.title}</h3>
                                                    <p className="text-xs text-slate-500">{paper.desc}</p>
                                                </div>
                                            </div>
                                            {activeSection === idx ? <ChevronUp size={20} className="text-slate-400"/> : <ChevronDown size={20} className="text-slate-400"/>}
                                        </button>
                                        
                                        {activeSection === idx && (
                                            <div className="bg-slate-50 dark:bg-slate-800/30 px-6 pb-6 animate-in fade-in slide-in-from-top-2 duration-200">
                                                <div className="grid sm:grid-cols-2 gap-3 pt-2">
                                                    {paper.content.map((unit, tIdx) => (
                                                        <div key={tIdx} className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-400 bg-white dark:bg-slate-900 p-3 rounded-lg border border-slate-100 dark:border-slate-700 shadow-sm">
                                                            <div className="h-1.5 w-1.5 rounded-full bg-slate-400 mt-1.5 shrink-0"></div>
                                                            {unit}
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* 4. Weightage Analysis */}
                        <div className="bg-slate-900 text-white rounded-3xl p-6 md:p-8 shadow-xl relative overflow-hidden">
                             <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/20 rounded-full blur-[80px]"></div>
                             <h2 className="text-xl font-bold mb-6 flex items-center gap-2 relative z-10">
                                <TrendingUp className="text-emerald-400" /> High Weightage Units (Paper 2)
                             </h2>
                             <div className="grid sm:grid-cols-2 gap-4 relative z-10">
                                {UGC_NET_DETAILS.weightage.map((item, idx) => (
                                    <div key={idx} className="flex justify-between items-center p-3 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-colors">
                                        <span className="text-sm font-medium text-slate-200">{item.unit}</span>
                                        <span className="text-xs font-bold bg-emerald-500/20 text-emerald-300 px-2 py-1 rounded">{item.range}</span>
                                    </div>
                                ))}
                             </div>
                             <p className="mt-6 text-xs text-slate-400 text-center italic border-t border-white/10 pt-4">
                                Strategy Tip: Focus on Discrete Structures, OS, and Algorithms for maximum scoring.
                             </p>
                        </div>
                    </div>

                    {/* --- RIGHT COLUMN: CHECKOUT & DATES --- */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-24 space-y-6">
                            
                            {/* Price Card */}
                            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-2xl border border-slate-200 dark:border-slate-800 relative overflow-hidden">
                                <div className="absolute top-0 left-0 w-full h-1 bg-purple-500"></div>
                                <div className="mb-6">
                                    <p className="text-sm text-slate-500 mb-1">Full Course Access</p>
                                    <div className="flex items-end gap-3">
                                        <span className="text-4xl font-black text-slate-900 dark:text-white">{UGC_NET_DETAILS.price}</span>
                                        <span className="text-lg text-slate-400 line-through mb-1">{UGC_NET_DETAILS.originalPrice}</span>
                                        <span className="text-xs font-bold text-purple-600 bg-purple-100 dark:bg-purple-900/30 px-2 py-1 rounded mb-1.5">{UGC_NET_DETAILS.discount}</span>
                                    </div>
                                </div>
                                <button onClick={() => setIsPaymentOpen(true)} className="w-full bg-purple-600 hover:bg-purple-700 text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all active:scale-95 mb-4 flex items-center justify-center gap-2">
                                    Enroll Now <ArrowRight size={20} />
                                </button>
                                <p className="text-center text-xs text-slate-400 flex items-center justify-center gap-1"><Lock size={10} /> Secure Checkout</p>
                            </div>

                            {/* Important Dates */}
                            <div className="bg-slate-900 text-white rounded-2xl p-6 shadow-lg relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-purple-600 rounded-full blur-[60px] opacity-20"></div>
                                <h3 className="font-bold mb-4 flex items-center gap-2 relative z-10"><Calendar size={18} className="text-purple-400"/> Key Dates</h3>
                                <div className="space-y-4 relative z-10">
                                    <div className="flex justify-between items-center text-sm border-b border-white/10 pb-2">
                                        <span className="text-white/60">Notification</span>
                                        <span className="font-medium text-emerald-400">{UGC_NET_DETAILS.dates.notification}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-white/60">Exam Date</span>
                                        <span className="font-medium text-white">{UGC_NET_DETAILS.dates.exam}</span>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UgcNetPage;