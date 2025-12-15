import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { 
    Layout, BookOpen, User, LogOut, ChevronRight, ShoppingCart, 
    Flame, Zap, PlayCircle, Trophy, MoreVertical, Star, Shield, 
    Clock, CheckCircle, AlertTriangle, Menu, X, TrendingUp, RefreshCw, Home
} from 'lucide-react';

const DashboardPage = () => {
    // --- STATE ---
    const [user, setUser] = useState({ name: "Student", email: "" });
    const [enrolledCourses, setEnrolledCourses] = useState([]);
    const [activeCourse, setActiveCourse] = useState(null);
    const [attempts, setAttempts] = useState([]);
    
    // Gamification
    const [xp, setXP] = useState(0);
    const [streak, setStreak] = useState(1); 
    const [progress, setProgress] = useState(0);

    // UI State
    const [loading, setLoading] = useState(true);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    
    // Sidebar State: Now handles both Mobile (overlay) and Desktop (collapsible)
    const [isSidebarOpen, setIsSidebarOpen] = useState(true); // Default open on desktop
    const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);
    const [showBatchMenu, setShowBatchMenu] = useState(false);

    const navigate = useNavigate();

    // Handle Resize for Responsive Sidebar
    useEffect(() => {
        const handleResize = () => {
            const mobile = window.innerWidth < 1024;
            setIsMobile(mobile);
            if (mobile) setIsSidebarOpen(false); // Auto-close on mobile
            else setIsSidebarOpen(true); // Auto-open on desktop
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // --- INITIAL LOAD ---
    const fetchDashboardData = async () => {
        setLoading(true);
        try {
            // Use Promise.all to fetch concurrently
            const [userRes, courseRes, histRes] = await Promise.all([
                api.get('auth/users/me/'),
                api.get('courses/enrolled/'),
                api.get('history/')
            ]);

            setUser({ 
                name: userRes.data.first_name || userRes.data.username || "Scholar",
                email: userRes.data.email
            });

            setEnrolledCourses(courseRes.data);
            // FIX: Ensure activeCourse is set if data exists
            if (courseRes.data.length > 0) {
                setActiveCourse(courseRes.data[0]);
            } else {
                console.warn("No enrolled courses found for user.");
            }

            setAttempts(histRes.data);

        } catch (err) {
            console.error("Dashboard Load Error:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDashboardData();
    }, []);

    // --- EFFECT: Calculate Stats ---
    useEffect(() => {
        if (!attempts) return;
        const totalScore = attempts.reduce((acc, curr) => acc + (curr.total_score || 0), 0);
        setXP(Math.round(totalScore * 10));

        if(activeCourse) {
            let totalItems = 10; 
            if(activeCourse.subjects) totalItems += activeCourse.subjects.length * 5;
            const completedCount = attempts.filter(a => a.exam_title && activeCourse.title.includes(a.exam_title)).length; 
            setProgress(Math.min(Math.round((completedCount / totalItems) * 100) + 5, 100));
        }
    }, [activeCourse, attempts]);

    const handleLogout = () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user_role');
        window.location.href = '/login';
    };

    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

    const lastActivity = attempts.length > 0 ? attempts[0] : null;

    // --- RENDER ---
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-sans text-slate-800 dark:text-slate-200 flex overflow-hidden">
            
            {/* --- SIDEBAR OVERLAY (Mobile Only) --- */}
            {isMobile && isSidebarOpen && (
                <div 
                    className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
                    onClick={() => setIsSidebarOpen(false)}
                ></div>
            )}

            {/* --- SIDEBAR --- */}
            <aside 
                className={`fixed lg:relative inset-y-0 left-0 z-50 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 transition-all duration-300 ease-in-out
                    ${isSidebarOpen ? 'w-64 translate-x-0' : 'w-0 -translate-x-full lg:translate-x-0 lg:w-0 overflow-hidden'}
                `}
            >
                <div className="p-6 h-full flex flex-col w-64"> {/* Fixed width container to prevent layout shift content squishing */}
                    <div className="flex items-center justify-between mb-10">
                        <div className="flex items-center gap-2 text-blue-600 dark:text-white font-black text-2xl">
                            <Zap className="fill-current" /> BitByBit
                        </div>
                        {isMobile && (
                            <button onClick={() => setIsSidebarOpen(false)} className="text-slate-500 hover:text-slate-700">
                                <X size={24} />
                            </button>
                        )}
                    </div>

                    <nav className="space-y-2 flex-1">
                        <SidebarItem icon={<Layout size={20}/>} label="My Learning" active />
                        <SidebarItem icon={<ShoppingCart size={20}/>} label="Course Store" onClick={() => navigate('/store')} />
                        <SidebarItem icon={<Trophy size={20}/>} label="Leaderboard" />
                        <SidebarItem icon={<User size={20}/>} label="My Profile" onClick={() => navigate('/profile')}/>
                    </nav>

                    <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-xl border border-slate-100 dark:border-slate-700 mt-auto">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-bold text-slate-500 uppercase">Daily Streak</span>
                            <Flame className="text-orange-500 fill-orange-500" size={16} />
                        </div>
                        <div className="text-2xl font-black text-slate-800 dark:text-white">{streak} Days</div>
                        <p className="text-xs text-slate-400 mt-1">Keep learning to maintain it!</p>
                    </div>
                </div>
            </aside>

            {/* --- MAIN CONTENT --- */}
            <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
                
                {/* HEADER */}
                <header className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-6 sticky top-0 z-40 shrink-0">
                    <div className="flex items-center gap-4">
                        {/* GLOBAL MENU BUTTON */}
                        <button 
                            onClick={toggleSidebar} 
                            className="p-2 -ml-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                        >
                            <Menu size={24}/>
                        </button>
                        
                        <div className="hidden md:flex items-center gap-2">
                            <span className="text-slate-400 text-sm font-medium">Current:</span>
                            <div className="relative group">
                                <button 
                                    onClick={() => setShowBatchMenu(!showBatchMenu)}
                                    className="flex items-center gap-2 font-bold text-slate-800 dark:text-white hover:text-blue-600 transition-colors"
                                >
                                    {activeCourse?.title || "No Active Batch"} <ChevronRight size={16} className="rotate-90"/>
                                </button>
                                {showBatchMenu && enrolledCourses.length > 0 && (
                                    <div className="absolute top-full left-0 mt-2 w-64 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl p-2 z-50">
                                        {enrolledCourses.map(c => (
                                            <button 
                                                key={c.id} 
                                                onClick={() => { setActiveCourse(c); setShowBatchMenu(false); }}
                                                className={`w-full text-left p-2 rounded-lg text-sm font-medium ${activeCourse?.id === c.id ? 'bg-blue-50 text-blue-600' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700'}`}
                                            >
                                                {c.title}
                                            </button>
                                        ))}
                                        <Link to="/store" className="block p-2 text-center text-xs font-bold text-blue-600 border-t border-slate-100 dark:border-slate-700 mt-1">+ Add New</Link>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-6">
                        <div className="hidden md:flex items-center gap-2 bg-yellow-50 dark:bg-yellow-900/20 px-3 py-1.5 rounded-full border border-yellow-200 dark:border-yellow-700">
                            <div className="bg-yellow-400 p-1 rounded-full"><Star size={12} className="text-yellow-900 fill-current"/></div>
                            <span className="text-xs font-bold text-yellow-700 dark:text-yellow-400">{xp} XP</span>
                        </div>

                        <div className="relative">
                            <button onClick={() => setIsProfileOpen(!isProfileOpen)} className="flex items-center gap-3 focus:outline-none">
                                <div className="text-right hidden sm:block">
                                    <div className="text-sm font-bold text-slate-800 dark:text-white">{user.name}</div>
                                    <div className="text-[10px] text-slate-500 uppercase tracking-wider">Student</div>
                                </div>
                                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold shadow-lg">
                                    {user.name[0]}
                                </div>
                            </button>
                            {isProfileOpen && (
                                <div className="absolute right-0 top-full mt-2 w-56 bg-white dark:bg-slate-900 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden animate-in fade-in slide-in-from-top-2 z-50">
                                    <div className="p-4 border-b border-slate-100 dark:border-slate-800">
                                        <p className="text-sm font-bold text-slate-900 dark:text-white truncate">{user.email}</p>
                                    </div>
                                    <div className="p-2">
                                        <button onClick={handleLogout} className="w-full flex items-center gap-2 p-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg">
                                            <LogOut size={16}/> Logout
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </header>

                {/* SCROLLABLE CONTENT */}
                <main className="p-6 md:p-10 overflow-y-auto pb-32">
                    
                    {/* CASE 1: LOADING */}
                    {loading && (
                        <div className="flex flex-col items-center justify-center py-20">
                            <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                            <p className="text-slate-500 font-medium">Loading your learning space...</p>
                        </div>
                    )}

                    {/* CASE 2: EMPTY STATE (No Courses) */}
                    {!loading && enrolledCourses.length === 0 && (
                         <div className="max-w-2xl mx-auto text-center py-16 bg-white dark:bg-slate-900 rounded-3xl border border-dashed border-slate-300 dark:border-slate-700 p-8">
                            <div className="bg-slate-50 dark:bg-slate-800 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-300 dark:text-slate-600">
                                <BookOpen size={40} />
                            </div>
                            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">No Active Courses</h2>
                            <p className="text-slate-500 dark:text-slate-400 mb-8 max-w-md mx-auto">
                                You haven't enrolled in any batches yet. Visit the store to start your journey.
                            </p>
                            <div className="flex gap-4 justify-center">
                                <button 
                                    onClick={fetchDashboardData}
                                    className="inline-flex items-center gap-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-6 py-3 rounded-xl font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition-all"
                                >
                                    <RefreshCw size={20}/> Refresh
                                </button>
                                <Link 
                                    to="/store" 
                                    className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-blue-500/20 transition-all"
                                >
                                    <ShoppingCart size={20}/> Explore Course Store
                                </Link>
                            </div>
                        </div>
                    )}

                    {/* CASE 3: ACTIVE COURSE DASHBOARD */}
                    {!loading && activeCourse && (
                        <>
                            <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-3xl p-8 text-white shadow-2xl relative overflow-hidden mb-10 animate-in fade-in zoom-in duration-500">
                                <div className="relative z-10 flex flex-col md:flex-row items-start md:items-end justify-between gap-6">
                                    <div className="space-y-4 max-w-2xl">
                                        <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border border-white/20">
                                            <Shield size={12}/> Active Batch
                                        </div>
                                        <h1 className="text-3xl md:text-4xl font-black leading-tight">{activeCourse.title}</h1>
                                        <div className="w-full bg-black/20 rounded-full h-3 max-w-md backdrop-blur-sm overflow-hidden">
                                            <div className="bg-emerald-400 h-full rounded-full transition-all duration-1000 ease-out" style={{ width: `${progress}%` }}></div>
                                        </div>
                                        <div className="flex justify-between max-w-md text-xs font-medium text-blue-100">
                                            <span>{progress}% Completed</span>
                                            <span>Keep going!</span>
                                        </div>
                                    </div>
                                    <Link to={`/courses?mode=enrolled`} className="bg-white text-blue-700 px-6 py-3 rounded-xl font-bold shadow-lg hover:bg-blue-50 transition-all flex items-center gap-2">
                                        <BookOpen size={20}/> Go to Content
                                    </Link>
                                </div>
                                <BookOpen className="absolute right-[-20px] bottom-[-40px] text-white opacity-10 w-64 h-64 rotate-12" />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <StatBox label="Mock Tests Taken" value={attempts.length} icon={<CheckCircle/>} color="emerald" />
                                <StatBox label="Avg. Score" value={activeCourse ? "72%" : "-"} icon={<TrendingUp/>} color="purple" />
                                <StatBox label="Hours Spent" value="12.5" icon={<Clock/>} color="orange" />
                            </div>
                        </>
                    )}

                </main>
            </div>

            {/* --- FLOATING RESUME BAR --- */}
            {lastActivity && (
                <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-full max-w-3xl px-6 z-50 animate-in slide-in-from-bottom-6 duration-700">
                    <div className="bg-slate-900 text-white p-4 rounded-2xl shadow-2xl border border-slate-700 flex items-center justify-between gap-4">
                        <div className="flex items-center gap-4 overflow-hidden">
                            <div className="bg-blue-600 p-3 rounded-xl shrink-0 animate-pulse"><PlayCircle size={24} fill="currentColor" className="text-white"/></div>
                            <div className="min-w-0">
                                <p className="text-xs text-slate-400 uppercase font-bold tracking-wider mb-0.5">Resume Learning</p>
                                <p className="font-bold truncate text-sm md:text-base">{lastActivity.exam_title || "Recent Activity"}</p>
                            </div>
                        </div>
                        <button className="bg-white text-slate-900 px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-slate-200 transition-colors whitespace-nowrap">Continue</button>
                    </div>
                </div>
            )}
        </div>
    );
};

const SidebarItem = ({ icon, label, active, onClick }) => (
    <button onClick={onClick} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${active ? 'bg-blue-50 dark:bg-slate-800 text-blue-600 dark:text-blue-400' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'}`}>
        {icon} <span>{label}</span>
    </button>
);

const StatBox = ({ label, value, icon, color }) => (
    <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4">
        <div className={`p-4 rounded-full bg-${color}-50 dark:bg-${color}-900/20 text-${color}-500`}>{icon}</div>
        <div>
            <div className="text-2xl font-black text-slate-900 dark:text-white">{value}</div>
            <div className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">{label}</div>
        </div>
    </div>
);

export default DashboardPage;