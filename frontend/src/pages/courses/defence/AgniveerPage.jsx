import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Chart } from 'chart.js/auto';
import { 
    CheckCircle, FileText, Lock, Clock, 
    Calendar, Award, Star, ChevronDown, ChevronUp, 
    Shield, ArrowLeft, Zap, Users, BookOpen, BrainCircuit, 
    Calculator, Globe, Microscope, Target, X, CreditCard, ArrowRight
} from 'lucide-react';

// --- DETAILED COURSE DATA ---
const COURSE_DETAILS = {
    "agniveer-ultimate": {
        title: "Agniveer Ultimate Access 2025",
        subtitle: "Complete Prep: GD, Technical & Clerk",
        price: "₹999",
        originalPrice: "₹2,499",
        discount: "60% OFF",
        rating: 4.8,
        students: "25,000+",
        validity: "Valid till Exam Date",
        language: "Hinglish",
        theme: "emerald",
        dates: {
            notification: "Released (25,000+ Vacancies)",
            exam: "Online CEE 2025"
        },
        stats: [
            { label: "Mock Tests", value: "50+" },
            { label: "Chapter Notes", value: "120+" },
            { label: "PYQs Solved", value: "5 Years" }
        ],
        syllabus: [
            {
                title: "General Reasoning",
                icon: <BrainCircuit size={18} className="text-purple-500"/>,
                desc: "Verbal & Non-Verbal Logic",
                content: [
                    "Number, Ranking & Time Sequence", "Deriving Conclusions from Passages",
                    "Logical Sequence of Words", "Alphabet Test Series", "Arithmetical Reasoning",
                    "Situation Reaction Test", "Coding-Decoding", "Direction Sense Test", "Analogy",
                    "Data Sufficiency", "Clocks & Calendars", "Statement – Conclusions",
                    "Logical Venn Diagrams", "Statement – Arguments", "Inserting The Missing Character",
                    "Puzzles", "Alpha-Numeric Sequence Puzzle"
                ]
            },
            {
                title: "Mathematics",
                icon: <Calculator size={18} className="text-blue-500"/>,
                desc: "Arithmetic & Advanced Maths",
                content: [
                    "Mixture & Allegations", "Pipes and Cisterns", "Speed, Time & Distance (Train, Boats & Stream)",
                    "Mensuration", "Trigonometry", "Geometry", "Time and Work", "Probability",
                    "HCF & LCM", "Algebraic Expressions and Inequalities", "Average", "Percentage",
                    "Profit and Loss", "Number System", "Simple & Compound Interest", 
                    "Ratio and Proportion", "Partnership", "Data Interpretation", "Number Series"
                ]
            },
            {
                title: "General Knowledge (GK)",
                icon: <Globe size={18} className="text-orange-500"/>,
                desc: "Static GK & Current Affairs",
                content: [
                    "Abbreviations", "Science – Inventions & Discoveries", "Current Important Events",
                    "Current Affairs – National & International", "Awards and Honors", "Important Financial",
                    "Economic News", "Banking News", "Indian Constitution", "Books and Authors",
                    "Important Days", "History", "Sports Terminology", "Geography",
                    "Solar System", "Indian states and capitals", "Countries and Currencies"
                ]
            },
            {
                title: "General Science",
                icon: <Microscope size={18} className="text-green-500"/>,
                desc: "Physics, Chem & Bio",
                content: [
                    "Biology (10th / 12th Level)",
                    "Chemistry (10th / 12th Level)",
                    "Physics (10th / 12th Level)",
                    "Human Body & Diseases",
                    "Everyday Science Principles"
                ]
            }
        ],
        features: [
            "Access to ALL Trade Content (GD/Tech/Clerk)",
            "50+ Full Length Mock Tests with Analysis",
            "Detailed PDF Notes for Fast Revision",
            "Daily Quiz & Practice Sets",
            "Physical Training Guide included"
        ]
    }
};

// --- PAYMENT MODAL COMPONENT ---
const PaymentModal = ({ isOpen, onClose, course }) => {
    const [step, setStep] = useState(1); // 1: Details, 2: Payment, 3: Success
    const [loading, setLoading] = useState(false);

    if (!isOpen) return null;

    const handlePayment = () => {
        setLoading(true);
        // Simulate API Call
        setTimeout(() => {
            setLoading(false);
            setStep(3); // Success
        }, 2000);
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-stone-900/80 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-3xl shadow-2xl overflow-hidden border border-stone-200 dark:border-slate-700 relative">
                
                {/* Close Button */}
                <button 
                    onClick={onClose} 
                    className="absolute top-4 right-4 p-2 rounded-full hover:bg-stone-100 dark:hover:bg-slate-800 transition-colors z-10"
                >
                    <X size={20} className="text-stone-500" />
                </button>

                {/* STEP 1: SUMMARY & DETAILS */}
                {step === 1 && (
                    <div className="p-6">
                        <div className="text-center mb-6">
                            <div className={`inline-flex p-3 rounded-2xl bg-${course.theme}-100 dark:bg-${course.theme}-900/30 text-${course.theme}-600 mb-4`}>
                                <Lock size={24} />
                            </div>
                            <h2 className="text-2xl font-bold text-stone-900 dark:text-white">Secure Checkout</h2>
                            <p className="text-sm text-stone-500">Complete your purchase to start learning.</p>
                        </div>

                        <div className="bg-stone-50 dark:bg-slate-800 p-4 rounded-xl mb-6 flex gap-4 items-center">
                            <div className={`w-16 h-16 rounded-lg bg-${course.theme}-500 shrink-0`}></div>
                            <div>
                                <h3 className="font-bold text-sm text-stone-900 dark:text-white line-clamp-1">{course.title}</h3>
                                <p className="text-xs text-stone-500">{course.subtitle}</p>
                                <div className="text-lg font-black text-stone-900 dark:text-white mt-1">{course.price} <span className="text-xs font-normal text-stone-400 line-through">{course.originalPrice}</span></div>
                            </div>
                        </div>

                        <div className="space-y-3 mb-6">
                            <input type="text" placeholder="Full Name" className="w-full p-3 rounded-xl bg-stone-50 dark:bg-slate-800 border border-stone-200 dark:border-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" />
                            <input type="email" placeholder="Email Address" className="w-full p-3 rounded-xl bg-stone-50 dark:bg-slate-800 border border-stone-200 dark:border-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" />
                            <input type="tel" placeholder="Phone Number" className="w-full p-3 rounded-xl bg-stone-50 dark:bg-slate-800 border border-stone-200 dark:border-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" />
                        </div>

                        <button 
                            onClick={() => setStep(2)}
                            className="w-full bg-stone-900 dark:bg-white text-white dark:text-stone-900 py-3.5 rounded-xl font-bold text-sm shadow-lg hover:shadow-xl transition-all active:scale-95"
                        >
                            Proceed to Pay {course.price}
                        </button>
                    </div>
                )}

                {/* STEP 2: PAYMENT METHOD (Simulation) */}
                {step === 2 && (
                    <div className="p-6">
                        <h2 className="text-xl font-bold text-stone-900 dark:text-white mb-6">Select Payment Method</h2>
                        
                        <div className="space-y-3 mb-8">
                            <button onClick={handlePayment} className="w-full flex items-center gap-3 p-4 rounded-xl border border-stone-200 dark:border-slate-700 hover:border-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-all text-left group">
                                <div className="p-2 bg-white rounded-full shadow-sm"><Zap size={18} className="text-purple-600"/></div>
                                <span className="font-bold text-sm text-stone-700 dark:text-stone-300">UPI (GPay, PhonePe)</span>
                            </button>
                            <button onClick={handlePayment} className="w-full flex items-center gap-3 p-4 rounded-xl border border-stone-200 dark:border-slate-700 hover:border-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-all text-left group">
                                <div className="p-2 bg-white rounded-full shadow-sm"><CreditCard size={18} className="text-blue-600"/></div>
                                <span className="font-bold text-sm text-stone-700 dark:text-stone-300">Card (Debit/Credit)</span>
                            </button>
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

                {/* STEP 3: SUCCESS */}
                {step === 3 && (
                    <div className="p-8 text-center">
                        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
                            <CheckCircle size={40} className="text-green-600" />
                        </div>
                        <h2 className="text-2xl font-black text-stone-900 dark:text-white mb-2">Payment Successful!</h2>
                        <p className="text-stone-500 text-sm mb-6">Welcome to the elite force. Your course content is now unlocked.</p>
                        <button 
                            onClick={onClose}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3 rounded-xl font-bold shadow-lg transition-transform active:scale-95"
                        >
                            Start Learning
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

const AgniveerPage = () => {
    const { courseId } = useParams();
    const course = COURSE_DETAILS[courseId] || COURSE_DETAILS["agniveer-ultimate"];
    const [activeSection, setActiveSection] = useState(0);
    const [isPaymentOpen, setIsPaymentOpen] = useState(false); // STATE FOR MODAL

    // --- LOGIC: GATEKEEPER ---
    const handleEnrollClick = () => {
        const isLoggedIn = !!localStorage.getItem('access_token');
        
        if (!isLoggedIn) {
            // User is Guest -> Send to Login
            // Optional: You could save the current URL to redirect back after login
            navigate('/login');
        } else {
            // User is Logged In -> Open Payment
            setIsPaymentOpen(true);
        }
    };
    return (
        <div className="min-h-screen bg-stone-50 dark:bg-slate-950 font-sans text-stone-800 dark:text-slate-200">
            
            {/* PAYMENT MODAL */}
            <PaymentModal 
                isOpen={isPaymentOpen} 
                onClose={() => setIsPaymentOpen(false)} 
                course={course} 
            />

            {/* Mobile Header (Sticky) */}
            <div className="md:hidden sticky top-0 z-50 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 p-4 flex justify-between items-center shadow-sm">
                <Link to={-1} className="p-2 -ml-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800"><ArrowLeft size={20}/></Link>
                <span className="font-bold text-sm truncate w-40">{course.title}</span>
                <button 
                    onClick={() => setIsPaymentOpen(true)}
                    className={`bg-${course.theme}-600 text-white px-4 py-1.5 rounded-lg text-xs font-bold`}
                >
                    Enroll {course.price}
                </button>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
                <div className="grid lg:grid-cols-3 gap-8">
                    
                    {/* --- LEFT COLUMN: CONTENT --- */}
                    <div className="lg:col-span-2 space-y-8">
                        
                        {/* 1. Hero Card */}
                        <div className={`bg-white dark:bg-slate-900 rounded-3xl p-6 md:p-8 shadow-xl border border-slate-200 dark:border-slate-800 relative overflow-hidden`}>
                            <div className={`absolute top-0 right-0 w-64 h-64 bg-${course.theme}-500/10 rounded-full blur-[80px]`}></div>
                            
                            <div className="relative z-10">
                                <div className="flex items-start justify-between mb-4">
                                    <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full bg-${course.theme}-50 dark:bg-${course.theme}-900/30 text-${course.theme}-600 dark:text-${course.theme}-400 text-xs font-bold uppercase tracking-wider`}>
                                        <Shield size={12} /> {course.validity}
                                    </div>
                                    <div className="flex items-center gap-1 text-yellow-500 text-sm font-bold">
                                        <Star fill="currentColor" size={16} /> {course.rating} ({course.students})
                                    </div>
                                </div>
                                
                                <h1 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white mb-2 leading-tight">
                                    {course.title}
                                </h1>
                                <p className="text-lg text-slate-500 dark:text-slate-400 mb-6">
                                    {course.subtitle}
                                </p>

                                {/* Course Stats Grid */}
                                <div className="grid grid-cols-3 gap-4 border-t border-slate-100 dark:border-slate-800 pt-6">
                                    {course.stats.map((stat, idx) => (
                                        <div key={idx}>
                                            <div className="text-xl font-bold text-slate-900 dark:text-white">{stat.value}</div>
                                            <div className="text-xs text-slate-500 dark:text-slate-400 font-medium uppercase">{stat.label}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* 2. What's Inside (Features) */}
                        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 md:p-8 shadow-lg border border-slate-200 dark:border-slate-800">
                            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                                <Zap className="text-yellow-500" /> Fast-Pace Learning
                            </h2>
                            <div className="grid sm:grid-cols-2 gap-4">
                                {course.features.map((feat, idx) => (
                                    <div key={idx} className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800 rounded-xl">
                                        <CheckCircle size={18} className={`text-${course.theme}-500 shrink-0`} />
                                        <span className="text-sm font-medium">{feat}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* 3. Detailed Curriculum (Checklist Style) */}
                        <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-lg border border-slate-200 dark:border-slate-800 overflow-hidden">
                            <div className="p-6 md:p-8 border-b border-slate-100 dark:border-slate-800">
                                <h2 className="text-xl font-bold flex items-center gap-2">
                                    <BookOpen className="text-blue-500" /> Syllabus & Curriculum
                                </h2>
                                <p className="text-sm text-slate-500 mt-1">Topic-wise breakdown for Written Test</p>
                            </div>
                            
                            <div className="divide-y divide-slate-100 dark:divide-slate-800">
                                {course.syllabus.map((subject, idx) => (
                                    <div key={idx} className="group">
                                        <button 
                                            onClick={() => setActiveSection(activeSection === idx ? -1 : idx)}
                                            className="w-full flex items-center justify-between p-6 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors text-left"
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-lg">
                                                    {subject.icon}
                                                </div>
                                                <div>
                                                    <h3 className="font-bold text-slate-900 dark:text-white">{subject.title}</h3>
                                                    <p className="text-xs text-slate-500">{subject.desc}</p>
                                                </div>
                                            </div>
                                            {activeSection === idx ? <ChevronUp size={20} className="text-slate-400"/> : <ChevronDown size={20} className="text-slate-400"/>}
                                        </button>
                                        
                                        {/* Dropdown Content */}
                                        {activeSection === idx && (
                                            <div className="bg-slate-50 dark:bg-slate-800/30 px-6 pb-6 animate-in fade-in slide-in-from-top-2 duration-200">
                                                <div className="grid sm:grid-cols-2 gap-3 pt-2">
                                                    {subject.content.map((topic, tIdx) => (
                                                        <div key={tIdx} className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-400 bg-white dark:bg-slate-800 p-2 rounded border border-slate-100 dark:border-slate-700">
                                                            <div className="h-1.5 w-1.5 rounded-full bg-slate-400 mt-1.5 shrink-0"></div>
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

                    </div>

                    {/* --- RIGHT COLUMN: CHECKOUT & DATES (Sticky) --- */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-24 space-y-6">
                            
                            {/* Price Card */}
                            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-2xl border border-slate-200 dark:border-slate-800 relative overflow-hidden">
                                <div className={`absolute top-0 left-0 w-full h-1 bg-${course.theme}-500`}></div>
                                
                                <div className="mb-6">
                                    <p className="text-sm text-slate-500 mb-1">One-Time Payment</p>
                                    <div className="flex items-end gap-3">
                                        <span className="text-4xl font-black text-slate-900 dark:text-white">{course.price}</span>
                                        <span className="text-lg text-slate-400 line-through mb-1">{course.originalPrice}</span>
                                        <span className={`text-xs font-bold text-${course.theme}-600 bg-${course.theme}-100 dark:bg-${course.theme}-900/30 px-2 py-1 rounded mb-1.5`}>
                                            {course.discount}
                                        </span>
                                    </div>
                                </div>

                                <button 
                                    onClick={handleEnrollClick}
                                    className={`w-full bg-${course.theme}-600 hover:bg-${course.theme}-700 text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all active:scale-95 mb-4 flex items-center justify-center gap-2`}
                                >
                                    Unlock Access <ArrowRight size={20} />
                                </button>

                                <p className="text-center text-xs text-slate-400 flex items-center justify-center gap-1">
                                    <Lock size={10} /> Secure Checkout
                                </p>
                            </div>

                            {/* Mission Dates */}
                            <div className="bg-slate-900 text-white rounded-2xl p-6 shadow-lg relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600 rounded-full blur-[60px] opacity-20"></div>
                                <h3 className="font-bold mb-4 flex items-center gap-2 relative z-10">
                                    <Calendar size={18} className="text-blue-400"/> Important Dates
                                </h3>
                                <div className="space-y-4 relative z-10">
                                    <div className="flex justify-between items-center text-sm border-b border-white/10 pb-2">
                                        <span className="text-white/60">Notification</span>
                                        <span className="font-medium text-emerald-400">{course.dates.notification}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-white/60">Exam Date</span>
                                        <span className="font-medium text-white">{course.dates.exam}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Help / Support */}
                            <div className="bg-slate-100 dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 flex items-center gap-4">
                                <div className="w-10 h-10 rounded-full bg-white dark:bg-slate-800 flex items-center justify-center shadow-sm">
                                    <Users size={20} className="text-slate-600" />
                                </div>
                                <div>
                                    <p className="text-xs font-bold uppercase text-slate-400">Need Help?</p>
                                    <p className="text-sm font-bold text-blue-600 cursor-pointer hover:underline">Talk to Counsellor</p>
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