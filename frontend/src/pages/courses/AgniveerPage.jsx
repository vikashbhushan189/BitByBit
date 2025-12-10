import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
    CheckCircle, PlayCircle, FileText, Lock, Clock, 
    Calendar, Award, Star, ChevronDown, ChevronUp, 
    Shield, ArrowLeft, Zap, Users
} from 'lucide-react';

// --- MOCK COURSE DATA ---
// Ideally, this comes from an API based on the ID
const COURSE_DETAILS = {
    "agniveer-ultimate": {
        title: "Agniveer Ultimate Access",
        subtitle: "Complete Preparation for GD, Technical & Clerk",
        price: "₹999",
        originalPrice: "₹2,499",
        discount: "60% OFF",
        rating: 4.8,
        students: "15,000+",
        validity: "Valid till Exam Date (April 2025)",
        language: "Hinglish (Hindi + English)",
        theme: "emerald",
        syllabus: [
            {
                title: "General Knowledge (GD/Clerk/Tech)",
                lectures: 45,
                notes: 20,
                topics: ["History of India", "Geography", "Indian Polity", "Current Affairs (Last 6 Months)"]
            },
            {
                title: "General Science (GD)",
                lectures: 30,
                notes: 15,
                topics: ["Physics Basics", "Chemistry in Everyday Life", "Biology - Human Body"]
            },
            {
                title: "Mathematics (Tech/Clerk)",
                lectures: 50,
                notes: 25,
                topics: ["Algebra & Trigonometry", "Calculus (12th Level)", "Mensuration", "Arithmetic"]
            },
            {
                title: "Mock Test Series",
                lectures: 0,
                notes: 50,
                topics: ["20 Full Length Mocks (GD)", "15 Full Length Mocks (Tech)", "15 Full Length Mocks (Clerk)", "Previous Year Papers"]
            }
        ],
        features: [
            "Access to ALL Trade Content",
            "50+ Full Length Mock Tests",
            "Physical Training Guide (PDF)",
            "Live Doubt Sessions",
            "Downloadable Notes"
        ]
    },
    "agniveer-gd": {
        title: "Agniveer GD Special Pass",
        subtitle: "Targeted Prep for General Duty",
        price: "₹499",
        originalPrice: "₹999",
        discount: "50% OFF",
        rating: 4.7,
        students: "8,500+",
        validity: "Valid till Exam Date",
        language: "Hinglish",
        theme: "blue",
        syllabus: [
            {
                title: "GD Science & Maths",
                lectures: 30,
                notes: 15,
                topics: ["10th Level Maths", "General Science Basics"]
            },
            {
                title: "General Knowledge",
                lectures: 25,
                notes: 10,
                topics: ["Static GK", "Current Affairs"]
            },
            {
                title: "GD Mock Tests",
                lectures: 0,
                notes: 20,
                topics: ["20 Full Length GD Mocks", "10 Sectional Tests"]
            }
        ],
        features: [
            "GD Specific Syllabus",
            "20 Mock Tests",
            "Basic Science Notes"
        ]
    }
    // Add other IDs (agniveer-tech, agniveer-clerk) here...
};

const CourseDetailsPage = () => {
    const { courseId } = useParams();
    const course = COURSE_DETAILS[courseId] || COURSE_DETAILS["agniveer-ultimate"];
    const [activeSection, setActiveSection] = useState(0);

    return (
        <div className="min-h-screen bg-stone-50 dark:bg-slate-950 font-sans text-stone-800 dark:text-slate-200">
            
            {/* Sticky Header for Mobile */}
            <div className="md:hidden sticky top-0 z-50 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 p-4 flex justify-between items-center">
                <Link to={-1} className="p-2 -ml-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800"><ArrowLeft size={20}/></Link>
                <span className="font-bold text-sm truncate w-40">{course.title}</span>
                <button className={`bg-${course.theme}-600 text-white px-4 py-1.5 rounded-lg text-xs font-bold`}>Buy {course.price}</button>
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

                                <div className="flex flex-wrap gap-4 text-sm font-medium text-slate-600 dark:text-slate-300">
                                    <span className="flex items-center gap-1.5"><PlayCircle size={16} className="text-blue-500"/> Recorded Lectures</span>
                                    <span className="flex items-center gap-1.5"><FileText size={16} className="text-green-500"/> PDF Notes</span>
                                    <span className="flex items-center gap-1.5"><Clock size={16} className="text-orange-500"/> {course.language}</span>
                                </div>
                            </div>
                        </div>

                        {/* 2. What's Inside (Features) */}
                        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 md:p-8 shadow-lg border border-slate-200 dark:border-slate-800">
                            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                                <Zap className="text-yellow-500" /> What you get
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

                        {/* 3. Curriculum / Syllabus */}
                        <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-lg border border-slate-200 dark:border-slate-800 overflow-hidden">
                            <div className="p-6 md:p-8 border-b border-slate-100 dark:border-slate-800">
                                <h2 className="text-xl font-bold flex items-center gap-2">
                                    <BookOpen className="text-blue-500" /> Course Curriculum
                                </h2>
                            </div>
                            
                            <div className="divide-y divide-slate-100 dark:divide-slate-800">
                                {course.syllabus.map((subject, idx) => (
                                    <div key={idx} className="group">
                                        <button 
                                            onClick={() => setActiveSection(activeSection === idx ? -1 : idx)}
                                            className="w-full flex items-center justify-between p-6 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors text-left"
                                        >
                                            <div>
                                                <h3 className="font-bold text-slate-900 dark:text-white mb-1">{subject.title}</h3>
                                                <p className="text-xs text-slate-500">
                                                    {subject.lectures > 0 && `${subject.lectures} Lectures • `} 
                                                    {subject.notes} Notes
                                                </p>
                                            </div>
                                            {activeSection === idx ? <ChevronUp size={20} className="text-slate-400"/> : <ChevronDown size={20} className="text-slate-400"/>}
                                        </button>
                                        
                                        {/* Dropdown Content */}
                                        {activeSection === idx && (
                                            <div className="bg-slate-50 dark:bg-slate-800/30 px-6 pb-6 animate-in fade-in slide-in-from-top-2 duration-200">
                                                <ul className="space-y-3 pt-2">
                                                    {subject.topics.map((topic, tIdx) => (
                                                        <li key={tIdx} className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-400">
                                                            <div className="w-6 h-6 rounded-full bg-white dark:bg-slate-800 flex items-center justify-center shadow-sm border border-slate-200 dark:border-slate-700">
                                                                <Lock size={12} className="opacity-50" />
                                                            </div>
                                                            {topic}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>

                    </div>

                    {/* --- RIGHT COLUMN: CHECKOUT (Sticky) --- */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-24 space-y-6">
                            
                            {/* Price Card */}
                            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-2xl border border-slate-200 dark:border-slate-800 relative overflow-hidden">
                                <div className={`absolute top-0 left-0 w-full h-1 bg-${course.theme}-500`}></div>
                                
                                <div className="mb-6">
                                    <p className="text-sm text-slate-500 mb-1">Total Price</p>
                                    <div className="flex items-end gap-3">
                                        <span className="text-4xl font-black text-slate-900 dark:text-white">{course.price}</span>
                                        <span className="text-lg text-slate-400 line-through mb-1">{course.originalPrice}</span>
                                        <span className={`text-xs font-bold text-${course.theme}-600 bg-${course.theme}-100 dark:bg-${course.theme}-900/30 px-2 py-1 rounded mb-1.5`}>
                                            {course.discount}
                                        </span>
                                    </div>
                                </div>

                                <button className={`w-full bg-${course.theme}-600 hover:bg-${course.theme}-700 text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all active:scale-95 mb-4 flex items-center justify-center gap-2`}>
                                    Enroll Now <ArrowRight size={20} />
                                </button>

                                <p className="text-center text-xs text-slate-400">
                                    30-Day Money Back Guarantee • Secure Payment
                                </p>
                            </div>

                            {/* Help / Support */}
                            <div className="bg-slate-100 dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 flex items-center gap-4">
                                <div className="w-10 h-10 rounded-full bg-white dark:bg-slate-800 flex items-center justify-center shadow-sm">
                                    <Users size={20} className="text-slate-600" />
                                </div>
                                <div>
                                    <p className="text-xs font-bold uppercase text-slate-400">Need Help?</p>
                                    <p className="text-sm font-bold text-blue-600 cursor-pointer">Talk to our Counsellor</p>
                                </div>
                            </div>

                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default CourseDetailsPage;
