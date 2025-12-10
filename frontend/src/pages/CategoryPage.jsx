import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
    ChevronRight, Calendar, Users, Award, BookOpen, 
    CheckCircle, Clock, Shield, Star, Zap, Target, 
    ArrowRight, Layout, PlayCircle, FileText
} from 'lucide-react';

// --- MOCK DATA (In a real app, this comes from your API) ---
const CATEGORY_DATA = {
    "defence": {
        title: "Defence Exams",
        tagline: "Serve the Nation with Pride",
        themeColor: "teal", // Used for dynamic styling
        heroImage: "bg-gradient-to-br from-teal-900 to-slate-900",
        stats: [
            { label: "Active Aspirants", value: "1.2 Lakh+" },
            { label: "Selections in 2024", value: "4,500+" },
            { label: "Avg. Starting Salary", value: "₹56,100" }
        ],
        subCategories: [
            { id: "nda", name: "NDA", fullName: "National Defence Academy" },
            { id: "cds", name: "CDS", fullName: "Combined Defence Services" },
            { id: "afcat", name: "AFCAT", fullName: "Air Force Common Admission Test" },
            { id: "agniveer", name: "Agniveer", fullName: "Agnipath Scheme" }
        ],
        // Intro Data for the "Intelligence Brief"
        examInfo: {
            "nda": {
                description: "The National Defence Academy (NDA) is the joint defence service training institute of the Indian Armed Forces, where cadets of the three services train together.",
                dates: "Exam: April 21, 2025",
                eligibility: "12th Pass (PCM for Air Force/Navy)",
                ageLimit: "16.5 - 19.5 Years"
            },
            "cds": {
                description: "The Combined Defence Services Examination (CDS) is conducted by the UPSC for recruitment into the Indian Military Academy, Officers Training Academy, Indian Naval Academy and Indian Air Force Academy.",
                dates: "Exam: April 21, 2025",
                eligibility: "Graduation Degree",
                ageLimit: "19 - 25 Years"
            }
            // ... add others
        },
        courses: [
            {
                id: 1,
                title: "Shaurya Batch 2.0",
                exam: "NDA",
                type: "Live Batch",
                rating: 4.8,
                students: "15k+",
                price: "₹2,999",
                originalPrice: "₹5,999",
                features: ["Daily Live Classes", "SSB Guidance", "Physical Training Tips"],
                image: "bg-teal-800" // Placeholder for real image
            },
            {
                id: 2,
                title: "Vikrant Batch",
                exam: "CDS",
                type: "Recorded + Live",
                rating: 4.9,
                students: "8k+",
                price: "₹3,499",
                originalPrice: "₹6,999",
                features: ["Complete GS Coverage", "Maths Short Tricks", "Mock Tests"],
                image: "bg-blue-800"
            },
            {
                id: 3,
                title: "Tejas Express",
                exam: "AFCAT",
                type: "Crash Course",
                rating: 4.7,
                students: "5k+",
                price: "₹1,499",
                originalPrice: "₹2,999",
                features: ["Reasoning Masterclass", "Verbal Ability", "Previous Year Qs"],
                image: "bg-sky-700"
            }
        ]
    }
    // ... add 'jee', 'neet' data here
};

const CategoryPage = () => {
    const { categoryId } = useParams(); // Get 'defence' from URL
    const [selectedSubCat, setSelectedSubCat] = useState(null);
    
    const data = CATEGORY_DATA[categoryId] || CATEGORY_DATA["defence"]; // Fallback to defence for demo
    
    // Default to first subcategory if none selected
    useEffect(() => {
        if (data && !selectedSubCat) {
            setSelectedSubCat(data.subCategories[0].id);
        }
    }, [data, selectedSubCat]);

    const currentInfo = data.examInfo[selectedSubCat] || data.examInfo["nda"]; // Fallback

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-sans text-slate-800 dark:text-slate-200">
            
            {/* --- 1. IMMERSIVE HERO SECTION --- */}
            <div className={`relative ${data.heroImage} text-white pt-32 pb-20 px-6 overflow-hidden`}>
                <div className="absolute top-0 right-0 w-full h-full opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
                <div className="max-w-7xl mx-auto relative z-10">
                    <div className="flex flex-col md:flex-row justify-between items-end gap-8">
                        <div>
                            <div className="flex items-center gap-2 text-white/70 mb-4 text-sm font-medium">
                                <Link to="/" className="hover:text-white">Home</Link> 
                                <ChevronRight size={14}/> 
                                <span className="uppercase tracking-wider">{data.title}</span>
                            </div>
                            <h1 className="text-5xl md:text-6xl font-black mb-4 tracking-tight">{data.title}</h1>
                            <p className="text-xl text-white/80 max-w-2xl font-light">{data.tagline}</p>
                        </div>
                        
                        {/* Quick Stats Grid */}
                        <div className="grid grid-cols-3 gap-4 bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/10">
                            {data.stats.map((stat, idx) => (
                                <div key={idx} className="text-center px-4 border-r last:border-0 border-white/20">
                                    <div className="font-bold text-xl md:text-2xl">{stat.value}</div>
                                    <div className="text-[10px] uppercase tracking-wide opacity-70">{stat.label}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* --- 2. SUB-CATEGORY NAVIGATOR (Sticky) --- */}
            <div className="sticky top-20 z-40 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
                <div className="max-w-7xl mx-auto px-6 overflow-x-auto no-scrollbar">
                    <div className="flex gap-8">
                        {data.subCategories.map((sub) => (
                            <button
                                key={sub.id}
                                onClick={() => setSelectedSubCat(sub.id)}
                                className={`py-4 text-sm font-bold border-b-2 transition-all whitespace-nowrap
                                    ${selectedSubCat === sub.id 
                                        ? `border-${data.themeColor}-500 text-${data.themeColor}-600 dark:text-${data.themeColor}-400` 
                                        : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-white'}`}
                            >
                                {sub.name}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 py-12 flex flex-col lg:flex-row gap-12">
                
                {/* --- 3. LEFT COLUMN: EXAM INTRO & SYLLABUS --- */}
                <div className="lg:w-1/3 space-y-8">
                    {/* Intelligence Brief Card */}
                    <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-800 sticky top-40">
                        <div className="flex items-center gap-3 mb-6">
                            <div className={`p-3 rounded-lg bg-${data.themeColor}-100 dark:bg-${data.themeColor}-900/30 text-${data.themeColor}-600 dark:text-${data.themeColor}-400`}>
                                <Shield size={24} />
                            </div>
                            <h2 className="text-xl font-bold">Exam Intelligence</h2>
                        </div>
                        
                        <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed mb-6">
                            {currentInfo.description}
                        </p>

                        <div className="space-y-4">
                            <InfoRow icon={<Calendar size={16}/>} label="Next Exam" value={currentInfo.dates} />
                            <InfoRow icon={<Users size={16}/>} label="Age Limit" value={currentInfo.ageLimit} />
                            <InfoRow icon={<BookOpen size={16}/>} label="Eligibility" value={currentInfo.eligibility} />
                        </div>

                        <button className={`w-full mt-6 py-3 rounded-xl font-bold border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors flex items-center justify-center gap-2 text-sm`}>
                            <FileText size={16} /> Download Syllabus
                        </button>
                    </div>
                </div>

                {/* --- 4. RIGHT COLUMN: COURSES LIST --- */}
                <div className="lg:w-2/3">
                    <div className="flex justify-between items-end mb-8">
                        <div>
                            <h2 className="text-2xl font-bold mb-2">Recommended Batches</h2>
                            <p className="text-slate-500 text-sm">Curated courses for {data.subCategories.find(s => s.id === selectedSubCat)?.fullName}</p>
                        </div>
                        
                        {/* Filter Pills */}
                        <div className="flex gap-2">
                            <span className="px-3 py-1 rounded-full bg-blue-600 text-white text-xs font-bold">All</span>
                            <span className="px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 text-xs font-bold hover:bg-slate-200 cursor-pointer">Live</span>
                            <span className="px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 text-xs font-bold hover:bg-slate-200 cursor-pointer">Recorded</span>
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                        {data.courses.map((course) => (
                            <div key={course.id} className="group bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden hover:shadow-xl hover:border-blue-500/30 transition-all duration-300">
                                {/* Course Image Area */}
                                <div className={`h-32 ${course.image} relative p-4 flex flex-col justify-between`}>
                                    <div className="flex justify-between items-start">
                                        <span className="bg-white/20 backdrop-blur-md text-white text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wide">
                                            {course.type}
                                        </span>
                                        <span className="bg-yellow-400 text-yellow-900 text-[10px] font-bold px-2 py-1 rounded flex items-center gap-1">
                                            <Star size={10} fill="currentColor" /> {course.rating}
                                        </span>
                                    </div>
                                    <h3 className="text-white font-bold text-lg">{course.title}</h3>
                                </div>

                                {/* Body */}
                                <div className="p-5">
                                    <div className="flex gap-2 mb-4">
                                        {course.features.slice(0, 2).map((feat, i) => (
                                            <span key={i} className="text-[10px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 px-2 py-1 rounded flex items-center gap-1">
                                                <CheckCircle size={10} /> {feat}
                                            </span>
                                        ))}
                                    </div>

                                    <div className="flex items-end justify-between mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                                        <div>
                                            <p className="text-xs text-slate-400 line-through">{course.originalPrice}</p>
                                            <p className="text-xl font-extrabold text-slate-900 dark:text-white">{course.price}</p>
                                        </div>
                                        <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-bold text-sm transition-transform active:scale-95">
                                            Explore
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                        
                        {/* Upsell Card (Test Series) */}
                        <div className="border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl p-6 flex flex-col items-center justify-center text-center hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer group">
                            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 text-purple-600 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                                <Target size={24} />
                            </div>
                            <h3 className="font-bold text-slate-700 dark:text-slate-300">View All Test Series</h3>
                            <p className="text-xs text-slate-400 mt-1">Practice with 50+ Mocks</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const InfoRow = ({ icon, label, value }) => (
    <div className="flex items-start gap-3">
        <div className="text-slate-400 mt-0.5">{icon}</div>
        <div>
            <div className="text-xs font-bold text-slate-400 uppercase">{label}</div>
            <div className="text-sm font-semibold text-slate-800 dark:text-slate-200">{value}</div>
        </div>
    </div>
);

export default CategoryPage;
