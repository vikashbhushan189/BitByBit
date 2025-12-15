import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import { 
    Search, Filter, ShoppingCart, ChevronRight, Loader2, BookOpen, 
    Clock, Award, AlertCircle 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const CourseStorePage = () => {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                // Fetch ALL courses to display in the store
                const res = await api.get('courses/');
                setCourses(res.data);
            } catch (err) {
                console.error("Error fetching store courses:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchCourses();
    }, []);

    // Filter Logic
    const filteredCourses = courses.filter(c => 
        c.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Dynamic Color Assigner (Mint, Lavender, Blue, Rose loop)
    const getCardColor = (index) => {
        const colors = ['bg-emerald-100', 'bg-purple-100', 'bg-blue-100', 'bg-rose-100'];
        return colors[index % colors.length];
    };

    if (loading) return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center">
            <Loader2 className="animate-spin text-slate-400" size={32} />
        </div>
    );

    return (
        <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-20">
            
            {/* --- HEADER & UTILITY BAR --- */}
            <div className="bg-white border-b border-slate-200 sticky top-0 z-30 px-6 py-4 shadow-sm">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
                    
                    {/* Title & Counter */}
                    <div>
                        <h1 className="text-2xl font-black text-slate-900 tracking-tight">All Courses</h1>
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mt-1">
                            {filteredCourses.length} courses available
                        </p>
                    </div>

                    {/* Controls: Search & Filter */}
                    <div className="flex items-center gap-3 w-full md:w-auto">
                        <div className="relative flex-1 md:w-80">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                            <input 
                                type="text" 
                                placeholder="Search for courses..." 
                                className="w-full pl-10 pr-4 py-2.5 bg-slate-100 border-none rounded-xl text-sm font-medium focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all outline-none"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <button className="p-2.5 bg-slate-100 hover:bg-slate-200 rounded-xl text-slate-600 transition-colors border border-transparent hover:border-slate-300">
                            <Filter size={18} />
                        </button>
                    </div>
                </div>
            </div>

            {/* --- MAIN GRID CONTENT --- */}
            <div className="max-w-7xl mx-auto px-6 py-8">
                
                {filteredCourses.length === 0 ? (
                    <div className="text-center py-20">
                        <div className="bg-slate-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
                            <AlertCircle size={32} />
                        </div>
                        <h3 className="text-lg font-bold text-slate-700">No courses found</h3>
                        <p className="text-slate-500">Try adjusting your search terms.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredCourses.map((course, idx) => (
                            <div key={course.id} className="bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-xl hover:border-slate-300 transition-all duration-300 flex flex-col h-full group">
                                
                                {/* 1. Header / Thumbnail (Solid Color Block) */}
                                <div className={`h-40 ${getCardColor(idx)} p-6 flex flex-col justify-between relative overflow-hidden`}>
                                    {/* Decor */}
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/20 rounded-full blur-2xl -mr-10 -mt-10"></div>
                                    
                                    <div className="flex justify-between items-start relative z-10">
                                        <span className="bg-white/90 backdrop-blur-sm px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider text-slate-800 shadow-sm">
                                            {course.is_paid ? 'Premium' : 'Free Access'}
                                        </span>
                                        {/* Placeholder Icon based on ID for variety */}
                                        <div className="text-slate-900/10">
                                            <Award size={48} />
                                        </div>
                                    </div>
                                    
                                    <h3 className="text-xl font-black text-slate-900 leading-tight line-clamp-2 relative z-10">
                                        {course.title}
                                    </h3>
                                </div>

                                {/* 2. Body Info */}
                                <div className="p-6 flex-1 flex flex-col">
                                    <p className="text-sm text-slate-500 leading-relaxed line-clamp-3 mb-6 flex-1">
                                        {course.description || "Comprehensive coverage of the syllabus with expert-curated notes, quizzes, and mock tests."}
                                    </p>

                                    {/* Meta Tags */}
                                    <div className="flex gap-4 mb-6 text-xs font-bold text-slate-400 uppercase tracking-wide">
                                        <div className="flex items-center gap-1"><BookOpen size={14}/> {course.subjects?.length || 0} Subjects</div>
                                        <div className="flex items-center gap-1"><Clock size={14}/> Self-Paced</div>
                                    </div>

                                    {/* Divider */}
                                    <div className="h-px bg-slate-100 w-full mb-6"></div>

                                    {/* 3. Footer (Action Area) */}
                                    <div className="flex items-end justify-between gap-4">
                                        
                                        {/* Pricing Lockup */}
                                        <div>
                                            <div className="text-[10px] text-slate-400 font-bold uppercase mb-0.5">Price</div>
                                            <div className="flex items-baseline gap-2">
                                                <span className="text-2xl font-black text-slate-900">
                                                    {course.is_paid ? `₹${course.price || '999'}` : 'Free'}
                                                </span>
                                                {course.is_paid && (
                                                    <>
                                                        <span className="text-xs text-slate-400 line-through font-medium">₹2499</span>
                                                        <span className="text-xs font-bold text-emerald-600">60% OFF</span>
                                                    </>
                                                )}
                                            </div>
                                        </div>

                                        {/* Buttons */}
                                        <div className="flex items-center gap-2">
                                            <button 
                                                onClick={() => navigate(`/course/generic/${course.id}`)} // Or specific logic
                                                className="w-10 h-10 flex items-center justify-center rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors"
                                                title="View Details"
                                            >
                                                <ChevronRight size={20} />
                                            </button>
                                            
                                            <button 
                                                onClick={() => navigate('/login')} // Redirect to login or payment
                                                className="bg-slate-900 hover:bg-black text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-slate-200 transition-transform active:scale-95 flex items-center gap-2"
                                            >
                                                {course.is_paid ? 'Buy Now' : 'Start'}
                                            </button>
                                        </div>
                                    </div>
                                </div>

                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default CourseStorePage;