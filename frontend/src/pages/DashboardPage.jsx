import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { 
    BookOpen, CheckCircle, Clock, MoreVertical, 
    PlayCircle, HelpCircle, FileText, Layout, 
    ChevronRight, ShoppingCart
} from 'lucide-react';

const DashboardPage = () => {
    const [enrolledCourses, setEnrolledCourses] = useState([]);
    const [activeCourse, setActiveCourse] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await api.get('courses/enrolled/');
                setEnrolledCourses(res.data);
                if (res.data.length > 0) {
                    setActiveCourse(res.data[0]); // Default to first course
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) return <div className="min-h-screen flex items-center justify-center font-bold text-slate-600">Loading Study Center...</div>;

    // --- EMPTY STATE (New User) ---
    if (enrolledCourses.length === 0) {
        return (
            <div className="max-w-5xl mx-auto p-8 text-center mt-10">
                <div className="bg-white p-12 rounded-3xl shadow-sm border border-slate-200">
                    <img src="https://cdn-icons-png.flaticon.com/512/7486/7486744.png" alt="No Courses" className="w-32 h-32 mx-auto mb-6 opacity-80" />
                    <h2 className="text-3xl font-bold text-slate-900 mb-3">Start Your Journey</h2>
                    <p className="text-slate-500 mb-8 max-w-md mx-auto">You haven't enrolled in any batches yet. Explore our store to find the perfect course for your goal.</p>
                    <Link to="/store" className="bg-blue-600 text-white px-8 py-4 rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg hover:shadow-blue-200">
                        Explore Batches
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 font-sans pb-20">
            {/* --- TOP HERO SECTION (Dark Theme like PW) --- */}
            <div className="bg-slate-900 text-white pt-8 pb-16 px-6 relative overflow-hidden">
                <div className="max-w-7xl mx-auto relative z-10">
                    <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">YOUR BATCH</div>
                    <div className="flex justify-between items-start">
                        <div>
                            <h1 className="text-2xl md:text-3xl font-bold leading-tight max-w-2xl">
                                {activeCourse?.title || "Select a Batch"}
                            </h1>
                            {activeCourse && (
                                <div className="mt-4 flex gap-3 text-sm">
                                    <span className="bg-white/10 px-3 py-1 rounded-full border border-white/10">Validity: Lifetime</span>
                                    <span className="bg-green-500/20 text-green-400 px-3 py-1 rounded-full border border-green-500/20">Active</span>
                                </div>
                            )}
                        </div>
                        
                        {/* Batch Switcher (Simple Dropdown Trigger) */}
                        <div className="relative group">
                            <button className="p-2 hover:bg-white/10 rounded-full transition-colors">
                                <MoreVertical size={24} className="text-slate-400" />
                            </button>
                            {/* Hover Dropdown for switching batches */}
                            <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-xl shadow-xl border border-slate-200 hidden group-hover:block text-slate-800 z-50">
                                <div className="p-3 border-b border-slate-100 font-bold text-xs text-slate-400 uppercase">Switch Batch</div>
                                {enrolledCourses.map(c => (
                                    <button 
                                        key={c.id} 
                                        onClick={() => setActiveCourse(c)}
                                        className={`w-full text-left px-4 py-3 text-sm font-medium hover:bg-slate-50 transition-colors ${activeCourse?.id === c.id ? 'text-blue-600 bg-blue-50' : ''}`}
                                    >
                                        {c.title}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
                
                {/* Decorative Background */}
                <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
            </div>

            <div className="max-w-7xl mx-auto px-6 -mt-8 relative z-20">
                {/* --- BATCH OFFERINGS (Action Cards) --- */}
                <h3 className="font-bold text-slate-800 mb-4 ml-1">Batch Offerings</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
                    <ActionCard 
                        icon={<BookOpen size={24} className="text-blue-600"/>} 
                        title="All Classes" 
                        desc="Watch recorded lectures"
                        onClick={() => navigate('/courses')} // Or specific lecture page
                    />
                    <ActionCard 
                        icon={<FileText size={24} className="text-purple-600"/>} 
                        title="All Tests" 
                        desc="Attempt mock exams"
                        onClick={() => navigate(`/exam/${activeCourse?.id || ''}`)} // Should link to list of exams for this course
                    />
                    <ActionCard 
                        icon={<HelpCircle size={24} className="text-orange-600"/>} 
                        title="My Doubts" 
                        desc="Ask experts"
                        onClick={() => alert("Doubt engine coming soon!")}
                    />
                </div>

                {/* --- MY STUDY ZONE (Navigation) --- */}
                <h3 className="font-bold text-slate-800 mb-4 ml-1">My Study Zone</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Card 1: My Batches */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow cursor-pointer group">
                        <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center mb-4 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                            <Layout size={24} />
                        </div>
                        <h4 className="font-bold text-lg text-slate-800 mb-1">My Batches</h4>
                        <p className="text-slate-500 text-sm mb-4">View list of batches in which you are enrolled.</p>
                        <span className="text-blue-600 font-bold text-sm flex items-center gap-1 group-hover:translate-x-1 transition-transform">View All <ChevronRight size={16}/></span>
                    </div>

                    {/* Card 2: Analytics */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow cursor-pointer group">
                        <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center mb-4 group-hover:bg-purple-50 group-hover:text-purple-600 transition-colors">
                            <Clock size={24} />
                        </div>
                        <h4 className="font-bold text-lg text-slate-800 mb-1">Analytics</h4>
                        <p className="text-slate-500 text-sm mb-4">Track your progress through detailed reports.</p>
                        <span className="text-purple-600 font-bold text-sm flex items-center gap-1 group-hover:translate-x-1 transition-transform">Check Stats <ChevronRight size={16}/></span>
                    </div>

                    {/* Card 3: Store */}
                    <Link to="/store" className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow cursor-pointer group">
                        <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center mb-4 group-hover:bg-emerald-50 group-hover:text-emerald-600 transition-colors">
                            <ShoppingCart size={24} />
                        </div>
                        <h4 className="font-bold text-lg text-slate-800 mb-1">Course Store</h4>
                        <p className="text-slate-500 text-sm mb-4">Explore new courses and upgrade your skills.</p>
                        <span className="text-emerald-600 font-bold text-sm flex items-center gap-1 group-hover:translate-x-1 transition-transform">Buy Now <ChevronRight size={16}/></span>
                    </Link>
                </div>
            </div>
        </div>
    );
};

const ActionCard = ({ icon, title, desc, onClick }) => (
    <div onClick={onClick} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4 cursor-pointer hover:border-blue-300 hover:shadow-md transition-all">
        <div className="bg-slate-50 p-3 rounded-lg">
            {icon}
        </div>
        <div>
            <div className="font-bold text-slate-800">{title}</div>
            <div className="text-xs text-slate-500">{desc}</div>
        </div>
        <ChevronRight size={18} className="ml-auto text-slate-300" />
    </div>
);

export default DashboardPage;