import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { 
    BookOpen, CheckCircle, TrendingUp, Layout, 
    ChevronRight, ShoppingCart, MoreVertical, RefreshCw, Zap, Clock
} from 'lucide-react';

const DashboardPage = () => {
    const [enrolledCourses, setEnrolledCourses] = useState([]);
    const [activeCourse, setActiveCourse] = useState(null);
    const [stats, setStats] = useState({ total: 0, passed: 0, avgScore: 0 });
    const [attempts, setAttempts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showBatchMenu, setShowBatchMenu] = useState(false); 
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const courseRes = await api.get('courses/enrolled/');
                setEnrolledCourses(courseRes.data);
                
                if (courseRes.data.length > 0) {
                    setActiveCourse(courseRes.data[0]);
                }

                const histRes = await api.get('history/');
                setAttempts(histRes.data);
                
                if (histRes.data.length > 0) {
                    const passed = histRes.data.filter(a => (a.total_score / a.exam_total_marks) >= 0.4).length;
                    const avg = histRes.data.reduce((acc, curr) => acc + curr.total_score, 0) / histRes.data.length;
                    setStats({ total: histRes.data.length, passed, avgScore: Math.round(avg) });
                }

            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) return <div className="min-h-screen flex items-center justify-center font-bold text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-950">Loading Study Center...</div>;

    // --- EMPTY STATE ---
    if (enrolledCourses.length === 0) {
        return (
            <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-8 flex items-center justify-center">
                <div className="max-w-2xl w-full bg-white dark:bg-slate-900 p-12 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800 text-center">
                    <BookOpen size={64} className="mx-auto mb-6 text-slate-300 dark:text-slate-600 opacity-80" />
                    <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-3">Start Your Journey</h2>
                    <p className="text-slate-500 dark:text-slate-400 mb-8 max-w-md mx-auto">You haven't enrolled in any batches yet. Explore our store to find the perfect course for your goal.</p>
                    <Link to="/store" className="bg-blue-600 text-white px-8 py-4 rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg hover:shadow-blue-900/50">
                        Explore Batches
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-sans pb-20 transition-colors duration-300">
            {/* --- TOP HERO SECTION --- */}
            <div className="bg-slate-900 dark:bg-black text-white pt-8 pb-20 px-6 relative overflow-hidden">
                <div className="max-w-7xl mx-auto relative z-10">
                    <div className="flex justify-between items-start">
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">CURRENT BATCH</span>
                                {enrolledCourses.length > 1 && (
                                    <button 
                                        onClick={() => setShowBatchMenu(!showBatchMenu)}
                                        className="text-xs bg-slate-800 hover:bg-slate-700 text-blue-400 px-2 py-1 rounded flex items-center gap-1 transition-colors"
                                    >
                                        <RefreshCw size={10} /> Change
                                    </button>
                                )}
                            </div>
                            
                            <div className="relative">
                                <h1 className="text-2xl md:text-4xl font-bold leading-tight max-w-2xl flex items-center gap-3">
                                    {activeCourse?.title}
                                    <ChevronRight className="text-slate-600" size={24}/>
                                </h1>
                                
                                {/* BATCH SWITCHER DROPDOWN */}
                                {showBatchMenu && (
                                    <div className="absolute top-full left-0 mt-2 w-72 bg-white dark:bg-slate-800 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                                        <div className="p-3 border-b border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs font-bold text-slate-500 uppercase">
                                            Select Active Batch
                                        </div>
                                        <div className="max-h-60 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-slate-700">
                                            {enrolledCourses.map(course => (
                                                <button
                                                    key={course.id}
                                                    onClick={() => {
                                                        setActiveCourse(course);
                                                        setShowBatchMenu(false);
                                                    }}
                                                    className={`w-full text-left px-4 py-3 text-sm font-medium flex items-center gap-3 transition-colors ${
                                                        activeCourse.id === course.id 
                                                            ? 'bg-blue-50 dark:bg-slate-700 text-blue-700 dark:text-blue-400 border-l-4 border-blue-600' 
                                                            : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700'
                                                    }`}
                                                >
                                                    <div className={`w-2 h-2 rounded-full ${activeCourse.id === course.id ? 'bg-blue-600' : 'bg-slate-300 dark:bg-slate-500'}`}></div>
                                                    {course.title}
                                                </button>
                                            ))}
                                        </div>
                                        <Link to="/store" className="block p-3 text-center text-xs font-bold text-blue-600 dark:text-blue-400 hover:bg-slate-50 dark:hover:bg-slate-900 border-t border-slate-100 dark:border-slate-700">
                                            + Enroll in New Course
                                        </Link>
                                    </div>
                                )}
                            </div>

                            <div className="mt-4 flex gap-3 text-sm">
                                <span className="bg-white/10 px-3 py-1 rounded-full border border-white/10 flex items-center gap-2">
                                    <Clock size={14} className="text-emerald-400"/> Validity: Exam Date
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
                
                {/* Decorative Background */}
                <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
            </div>

            <div className="max-w-7xl mx-auto px-6 -mt-12 relative z-20">
                {/* --- QUICK ACTIONS GRID --- */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                    <ActionCard 
                        icon={<BookOpen size={24} className="text-white"/>} 
                        bg="bg-blue-600"
                        title="Start Learning" 
                        desc="Access Chapters & Notes"
                        onClick={() => navigate('/courses?mode=enrolled')} 
                    />
                    <ActionCard 
                        icon={<CheckCircle size={24} className="text-white"/>} 
                        bg="bg-emerald-600"
                        title="Mock Tests" 
                        desc="Attempt Full Length Tests"
                        onClick={() => alert("Go to Test Series Section")} 
                    />
                    <ActionCard 
                        icon={<TrendingUp size={24} className="text-white"/>} 
                        bg="bg-purple-600"
                        title="My Progress" 
                        desc="View detailed analysis"
                        onClick={() => document.getElementById('stats-section').scrollIntoView({behavior: 'smooth'})}
                    />
                </div>

                {/* --- STATS SECTION --- */}
                <div id="stats-section" className="mb-12">
                    <h3 className="font-bold text-slate-800 dark:text-white mb-6 flex items-center gap-2 text-lg">
                        <TrendingUp size={20} className="text-blue-600"/> Your Performance
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <StatCard label="Tests Taken" value={stats.total} color="blue" />
                        <StatCard label="Exams Passed" value={stats.passed} color="emerald" />
                        <StatCard label="Avg. Score" value={stats.avgScore} color="purple" />
                    </div>
                </div>

                {/* --- RECENT ACTIVITY --- */}
                <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
                    <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/50">
                        <h3 className="font-bold text-slate-800 dark:text-white">Recent Activity</h3>
                        <Link to="/courses" className="text-xs font-bold text-blue-600 hover:underline">View All</Link>
                    </div>
                    {attempts.length > 0 ? (
                        <table className="w-full text-left text-sm">
                            <thead className="text-slate-400 font-medium border-b border-slate-100 dark:border-slate-800">
                                <tr>
                                    <th className="px-6 py-3">Exam Name</th>
                                    <th className="px-6 py-3">Date</th>
                                    <th className="px-6 py-3 text-right">Score</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                {attempts.slice(0, 5).map(a => (
                                    <tr key={a.id} className="hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                                        <td className="px-6 py-4 font-medium text-slate-700 dark:text-slate-200">{a.exam_title}</td>
                                        <td className="px-6 py-4 text-slate-500 dark:text-slate-400">{new Date(a.start_time).toLocaleDateString()}</td>
                                        <td className="px-6 py-4 text-right font-bold text-blue-600 dark:text-blue-400">{a.total_score}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <div className="p-12 text-center">
                            <div className="bg-slate-100 dark:bg-slate-800 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
                                <Clock size={32} />
                            </div>
                            <p className="text-slate-500 dark:text-slate-400 mb-2">No tests attempted yet.</p>
                            <Link to="/courses" className="text-blue-600 dark:text-blue-400 font-bold text-sm hover:underline">Start your first test now</Link>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

const ActionCard = ({ icon, title, desc, onClick, bg }) => (
    <div onClick={onClick} className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-lg hover:border-blue-400 dark:hover:border-blue-500 hover:-translate-y-1 transition-all cursor-pointer group relative overflow-hidden">
        <div className={`absolute top-0 right-0 w-24 h-24 ${bg} opacity-10 rounded-full -mr-8 -mt-8 transition-transform group-hover:scale-150`}></div>
        <div className={`${bg} w-12 h-12 rounded-xl flex items-center justify-center mb-4 shadow-md`}>
            {icon}
        </div>
        <h4 className="font-bold text-lg text-slate-900 dark:text-white group-hover:text-blue-700 dark:group-hover:text-blue-400 transition-colors">{title}</h4>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{desc}</p>
    </div>
);

const StatCard = ({ label, value, color }) => (
    <div className={`bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm border-l-4 border-l-${color}-500`}>
        <div className="text-3xl font-black text-slate-900 dark:text-white mb-1">{value}</div>
        <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">{label}</div>
    </div>
);

export default DashboardPage;