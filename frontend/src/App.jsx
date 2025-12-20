import React, { useEffect, useState, useRef } from 'react';
import api from './api/axios';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate, Navigate, useLocation } from 'react-router-dom';
import { 
    // Core Navigation & UI (Placed first)
    LogOut, LayoutDashboard, BookOpen, ArrowLeft, User, ChevronDown, ChevronUp, 
    Menu, X, Search, Sun, Moon, GraduationCap, Home,
    
    // Profile Menu Helpers
    CreditCard, HelpCircle, 

    // Mega Menu Icons (Grouped)
    Atom, Stethoscope, Building2, Scale, Briefcase, Globe, Code, 
    Calculator, Landmark, Gavel, Plane, Microscope, PenTool, TrendingUp, 
    FileText, Monitor, Cpu, Trophy, CheckCircle, Users, Zap, Bell
    
} from 'lucide-react';
import { useTheme } from './hooks/useTheme';

// --- CORE PAGES ---
import CourseList from './components/CourseList';
import ExamPage from './pages/ExamPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import LandingPage from './pages/LandingPage';
import NotesPage from './pages/NotesPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import CategoryPage from './pages/CategoryPage';
import CourseStorePage from './pages/CourseStorePage';
import ProfilePage from './pages/ProfilePage';

// --- ADMIN PAGES ---
import AdminLoginPage from './pages/AdminLoginPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import AdminGeneratorPage from './pages/AdminGeneratorPage';
import AdminNotesUploadPage from './pages/AdminNotesUploadPage';
import AdminAdManagerPage from './pages/AdminAdManagerPage';
import AdminNotesEditorPage from './pages/AdminNotesEditorPage';

// --- COURSE INTRO PAGES ---
import AgniveerPage from './pages/courses/defence/AgniveerPage';
import BpscTrePage from './pages/courses/teaching/BpscTrePage';
import NdaPage from './pages/courses/defence/NdaPage';
import CdsPage from './pages/courses/defence/CdsPage';
import AfcatPage from './pages/courses/defence/AfcatPage';
import UpscPage from './pages/courses/civil-services/UpscPage';
import BpscPage from './pages/courses/civil-services/BpscPage';
import JeePage from './pages/courses/engineering/JeePage';
import GatePage from './pages/courses/engineering/GatePage';
import NeetPage from './pages/courses/medical/NeetPage';
import CtetPage from './pages/courses/teaching/CtetPage';
import UgcNetPage from './pages/courses/teaching/UgcNetPage';

// --- DATA: NAV LINKS (The Mega Menu Structure) ---
const NAV_LINKS = [
    {
        label: "All Exams",
        type: "mega_tabs",  
        categories: [
            {
                id: "competitive",
                name: "Competitive",
                items: [
                    { name: "IIT JEE", icon: <Atom size={20} className="text-orange-500"/>, link: "/engineering/jee" },
                    { name: "NEET", icon: <Stethoscope size={20} className="text-blue-500"/>, link: "/medical/neet" },
                    { name: "GATE", icon: <Cpu size={20} className="text-purple-500"/>, link: "/engineering/gate" },
                    { name: "UGC NET", icon: <BookOpen size={20} className="text-green-500"/>, link: "/teaching/ugc_net" }
                ]
            },
            {
                id: "govt",
                name: "Govt Exams",
                items: [
                    { name: "SSC CGL", icon: <Building2 size={20} className="text-red-500"/>, link: "/category/ssc" },
                    { name: "Banking", icon: <Briefcase size={20} className="text-indigo-500"/>, link: "/category/banking" },
                    { name: "Railways", icon: <Monitor size={20} className="text-slate-500"/>, link: "/category/railways" }
                ]
            },
            {
                id: "defence",
                name: "Defence",
                items: [
                    { name: "NDA", icon: <CheckCircle size={20} className="text-teal-500"/>, link: "/defence/nda" },
                    { name: "CDS", icon: <CheckCircle size={20} className="text-teal-500"/>, link: "/defence/cds" },
                    { name: "AFCAT", icon: <Plane size={20} className="text-teal-500"/>, link: "/defence/afcat" },
                    { name: "Agniveer", icon: <CheckCircle size={20} className="text-teal-500"/>, link: "/defence/agniveer" }
                ]
            },
            {
                id: "civil",
                name: "Civil Services",
                items: [
                    { name: "UPSC CSE", icon: <Landmark size={20} className="text-yellow-600"/>, link: "/civil-services/upsc" },
                    { name: "BPSC", icon: <Landmark size={20} className="text-orange-600"/>, link: "/civil-services/bpsc" }
                ]
            },
            {
                id: "teaching",
                name: "Teaching",
                items: [
                    { name: "BPSC TRE", icon: <Users size={20} className="text-green-600"/>, link: "/teaching/bpsc_tre" },
                    { name: "CTET", icon: <BookOpen size={20} className="text-teal-600"/>, link: "/teaching/ctet" }
                ]
            },
            {
                id: "school",
                name: "School Boards",
                items: [
                    { name: "CBSE 12", icon: <BookOpen size={20} className="text-blue-400"/>, link: "/category/school" },
                    { name: "CBSE 10", icon: <BookOpen size={20} className="text-blue-400"/>, link: "/category/school" }
                ]
            }
        ]
    },
    {
        label: "India's Update",
        type: "link",
        to: "/news"
    },
    {
        label: "AI Tools",
        type: "dropdown",
        items: [
            { name: "AI Summarizer", icon: <FileText size={16}/> },
            { name: "Video to Text", icon: <Monitor size={16}/> },
            { name: "Mind Map Generator", icon: <Cpu size={16}/> },
            { name: "Auto-Notes Maker", icon: <BookOpen size={16}/> }
        ]
    },
    {
        label: "Test Series",
        type: "dropdown",
        items: [
            { name: "GATE Mock Tests" },
            { name: "SSC CGL Tier-1" },
            { name: "Banking Prelims" },
            { name: "UGC NET Paper 1" }
        ]
    },
    {
        label: "Full Length PYQs",
        type: "dropdown",
        items: [
            { name: "JEE Advanced PYQ" },
            { name: "NEET Previous Years" },
            { name: "UPSC Prelims PYQ" },
            { name: "GATE CS 2010-2024" }
        ]
    },
    {
        label: "Power Batch",
        type: "text",
    }
];
// --- HELPER COMPONENTS ---

// 1. Search Modal
const SearchModal = ({ isOpen, onClose }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 z-[100] bg-slate-900/60 backdrop-blur-sm flex items-start justify-center pt-20 px-4 animate-in fade-in duration-200">
            <div className="absolute inset-0" onClick={onClose}></div>
            <div className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-2xl shadow-2xl p-6 relative z-10 border border-slate-200 dark:border-slate-800">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-bold dark:text-white">Search Exams</h2>
                    <button onClick={onClose}><X className="text-slate-400 hover:text-slate-600"/></button>
                </div>
                <div className="relative">
                    <Search className="absolute left-4 top-3.5 text-slate-400" size={20} />
                    <input type="text" placeholder="Search for JEE, NEET, UPSC..." className="w-full pl-12 pr-4 py-3 bg-slate-50 dark:bg-slate-800 rounded-xl border-none focus:ring-2 focus:ring-blue-500 outline-none dark:text-white" autoFocus />
                </div>
            </div>
        </div>
    );
};

// 2. Notification Dropdown (NEW)
const NotificationMenu = () => {
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef(null);
    // Mock notifications for now
    const [notifications, setNotifications] = useState([
        { id: 1, title: "New Quiz Available", msg: "Chapter 3: Thermodynamics quiz is live.", time: "2m ago", read: false },
        { id: 2, title: "Notes Updated", msg: "Updated PDF notes for Organic Chemistry.", time: "1h ago", read: false },
        { id: 3, title: "Welcome!", msg: "Thanks for joining Bit by Bit.", time: "1d ago", read: true }
    ]);
    const unreadCount = notifications.filter(n => !n.read).length;

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) setIsOpen(false);
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const markAllRead = () => {
        setNotifications(prev => prev.map(n => ({...n, read: true})));
    };

    return (
        <div className="relative" ref={menuRef}>
            <button 
                onClick={() => setIsOpen(!isOpen)} 
                className="relative p-2 rounded-full text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                title="Notifications"
            >
                <Bell size={20} />
                {unreadCount > 0 && (
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white dark:ring-slate-900 animate-pulse"></span>
                )}
            </button>

            {isOpen && (
                <div className="absolute right-0 top-full mt-2 w-80 bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-slate-200 dark:border-slate-800 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2">
                    <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
                        <h3 className="font-bold text-slate-800 dark:text-white">Notifications</h3>
                        {unreadCount > 0 && (
                            <button onClick={markAllRead} className="text-xs text-blue-600 font-medium hover:underline">
                                Mark all read
                            </button>
                        )}
                    </div>
                    <div className="max-h-80 overflow-y-auto">
                        {notifications.length === 0 ? (
                            <div className="p-8 text-center text-slate-400 text-sm">No new notifications</div>
                        ) : (
                            notifications.map(n => (
                                <div key={n.id} className={`p-4 border-b border-slate-50 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors ${n.read ? 'opacity-60' : 'bg-blue-50/30 dark:bg-blue-900/10'}`}>
                                    <div className="flex justify-between items-start mb-1">
                                        <h4 className={`text-sm font-semibold ${n.read ? 'text-slate-700 dark:text-slate-300' : 'text-slate-900 dark:text-white'}`}>{n.title}</h4>
                                        <span className="text-[10px] text-slate-400 whitespace-nowrap ml-2">{n.time}</span>
                                    </div>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">{n.msg}</p>
                                </div>
                            ))
                        )}
                    </div>
                    <div className="p-2 border-t border-slate-100 dark:border-slate-800 text-center">
                         <button className="text-xs font-bold text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 py-1">
                            View All Activity
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};


// 2. Profile Dropdown
const ProfileMenu = ({ handleLogout }) => {
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) setIsOpen(false);
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleNav = (path) => {
        setIsOpen(false);
        navigate(path);
    };

    return (
        <div className="relative" ref={menuRef}>
            <button onClick={() => setIsOpen(!isOpen)} className="flex items-center gap-2 p-1.5 pr-3 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors border border-transparent hover:border-slate-200 dark:hover:border-slate-700">
                <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm shadow-sm">U</div>
                <ChevronDown size={16} className={`text-slate-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>
            {isOpen && (
                <div className="absolute right-0 top-full mt-2 w-56 bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-slate-200 dark:border-slate-800 overflow-hidden z-50">
                    <div className="p-4 border-b border-slate-100 dark:border-slate-800">
                        <p className="text-sm font-bold text-slate-900 dark:text-white">Student Account</p>
                    </div>
                    <div className="p-2 space-y-1">
                        <button onClick={() => handleNav('/dashboard')} className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg text-left">
                            <LayoutDashboard size={16} className="text-blue-500"/> Dashboard
                        </button>
                        <button onClick={() => handleNav('/profile')} className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg text-left">
                            <User size={16} className="text-orange-500"/> My Profile
                        </button>
                        <button onClick={() => handleNav('/purchases')} className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg text-left">
                            <CreditCard size={16} className="text-purple-500"/> My Purchases
                        </button>
                    </div>
                    <div className="p-2 border-t border-slate-100 dark:border-slate-800">
                        <button onClick={() => handleNav('/help')} className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg text-left">
                            <HelpCircle size={16} className="text-slate-400"/> Help & Support
                        </button>
                        <button onClick={handleLogout} className="w-full flex items-center gap-3 px-3 py-2 text-sm font-bold text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg text-left">
                            <LogOut size={16} /> Logout
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

// --- MAIN NAVBAR ---
const Navbar = ({ theme, toggleTheme }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const isLoggedIn = !!localStorage.getItem('access_token');
    
    const [activeDropdown, setActiveDropdown] = useState(null);
    const [activeTab, setActiveTab] = useState(0);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);

    const handleLogout = async () => {
        try {
            // 1. Tell backend we are leaving
            await api.post('auth-otp/logout/');
        } catch (e) {
            console.error("Logout API failed (ignoring)", e);
        } finally {
            // 2. Clear local storage ALWAYS
            const role = localStorage.getItem('user_role');
            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');
            localStorage.removeItem('user_role');
            
            // 3. Redirect
            window.location.href = role === 'admin' ? '/admin-portal' : '/login'; 
        }
    };

    const showBackButton = location.pathname !== '/dashboard' && location.pathname !== '/';

    return (
        <>
            <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
            
            <nav className="sticky top-0 z-50 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 shadow-sm transition-colors">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-20">
                        
                        {/* LEFT: Logo & Back/Home Navigation */}
                        <div className="flex items-center gap-4">
                            {/* Back Button */}
                            {showBackButton && (
                                <button onClick={() => navigate(-1)} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 transition-colors" title="Go Back">
                                    <ArrowLeft size={20} />
                                </button>
                            )}

                            {/* Home Button (Always visible as a shortcut, hides when on '/') */}
                            {location.pathname !== '/' && (
                                <Link to="/" className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 transition-colors" title="Go Home">
                                    <Home size={20} />
                                </Link>
                            )}

                            {/* Logo: Always links to the absolute root / */}
                            <Link to="/" className="flex items-center gap-2 cursor-pointer">
                                <div className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 p-2 rounded-lg transition-colors"><GraduationCap size={24} /></div>
                                <span className="font-black text-2xl tracking-tighter text-slate-900 dark:text-white"><span className="text-blue-600">Bit</span>byBit</span>
                            </Link>
                        </div>

                        {/* CENTER: Mega Menu */}
                        <div className="hidden lg:flex items-center space-x-1">
                            {NAV_LINKS.map((link, idx) => (
                                <div key={idx} className="relative group" onMouseEnter={() => setActiveDropdown(idx)} onMouseLeave={() => setActiveDropdown(null)}>
                                    <button className={`px-4 py-2.5 rounded-lg text-sm font-bold flex items-center gap-1.5 transition-all ${activeDropdown === idx ? 'bg-blue-50 dark:bg-slate-800 text-blue-600' : 'text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-50 dark:hover:bg-slate-800'}`}>
                                        {link.label}
                                        {link.type === 'mega_tabs' && <ChevronDown size={14} className={`mt-0.5 transition-transform duration-200 ${activeDropdown === idx ? 'rotate-180' : ''}`}/>}
                                    </button>

                                    {/* Dropdown Content */}
                                    {activeDropdown === idx && link.type === 'mega_tabs' && (
                                        <div className="absolute top-full left-0 pt-2 w-max animate-in fade-in slide-in-from-top-2 duration-200">
                                            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-100 dark:border-slate-700 flex overflow-hidden w-[700px] -ml-20">
                                                {/* Sidebar */}
                                                <div className="w-1/3 bg-slate-50 dark:bg-slate-900 border-r border-slate-100 dark:border-slate-700 p-2">
                                                    {link.categories.map((cat, cIdx) => (
                                                        <div key={cIdx} onMouseEnter={() => setActiveTab(cIdx)} className={`px-4 py-3 rounded-xl text-sm font-bold cursor-pointer flex justify-between items-center transition-all mb-1 ${activeTab === cIdx ? 'bg-white dark:bg-slate-800 text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
                                                            {cat.name}
                                                            {activeTab === cIdx && <div className="w-1.5 h-1.5 rounded-full bg-blue-600"></div>}
                                                        </div>
                                                    ))}
                                                </div>
                                                {/* Grid */}
                                                <div className="w-2/3 p-6 bg-white dark:bg-slate-800">
                                                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 border-b border-slate-100 pb-2">{link.categories[activeTab].name}</h4>
                                                    <div className="grid grid-cols-2 gap-3">
                                                        {link.categories[activeTab].items.map((item, iIdx) => (
                                                            <Link to={item.link || '#'} key={iIdx} onClick={() => setActiveDropdown(null)} className="flex items-center gap-3 p-3 rounded-xl border border-slate-100 dark:border-slate-700 hover:border-blue-200 hover:shadow-md transition-all group bg-slate-50/50 dark:bg-slate-900/50 hover:bg-white dark:hover:bg-slate-900">
                                                                <div className="bg-white dark:bg-slate-800 p-2 rounded-lg shadow-sm group-hover:scale-110 transition-transform">{item.icon}</div>
                                                                <span className="text-sm font-bold text-slate-700 dark:text-slate-300 group-hover:text-blue-700">{item.name}</span>
                                                            </Link>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>

                        {/* RIGHT: Actions */}
                        <div className="flex items-center gap-3">
                            <button onClick={() => setIsSearchOpen(true)} className="p-2 rounded-full text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors hidden sm:block"><Search size={20} /></button>
                            <button onClick={toggleTheme} className="p-2 rounded-full text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">{theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}</button>
                            
                            {isLoggedIn ? (
                                <div className="flex items-center gap-3">
                                    <Link 
                                        to="/courses" 
                                        className={`hidden md:flex items-center gap-2 text-sm font-semibold transition-colors ${location.pathname === '/courses' ? 'text-blue-600' : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'}`}
                                    >
                                        <BookOpen size={18}/> 
                                        <span>Library</span>
                                    </Link>
                                    
                                    <div className="h-6 w-px bg-slate-200 dark:bg-slate-700 hidden md:block"></div>

                                    {/* NOTIFICATION BELL */}
                                    <NotificationMenu />
                                    
                                    {/* PROFILE DROPDOWN */}
                                    <ProfileMenu handleLogout={handleLogout} />
                                </div>
                            ) : (
                                <div className="flex items-center gap-3">
                                    <Link to="/login" className="text-slate-600 dark:text-slate-300 font-bold hover:text-blue-600 px-3 py-2 hidden sm:block">Login</Link>
                                    <Link to="/register" className="bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-200 text-white dark:text-slate-900 px-5 py-2 rounded-lg font-bold text-sm shadow-lg shadow-slate-900/20 dark:shadow-none transition-all hover:-translate-y-0.5">Get Started</Link>
                                </div>
                            )}

                            {/* Mobile Menu Toggle */}
                            <div className="lg:hidden">
                                <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 text-slate-600 dark:text-slate-300">
                                    {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Mobile Drawer */}
                {isMobileMenuOpen && (
                    <div className="lg:hidden bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 absolute w-full left-0 shadow-xl h-screen overflow-y-auto pb-20">
                        <div className="p-4 space-y-2">
                            {NAV_LINKS.map((link, idx) => (
                                <div key={idx} className="border-b border-slate-50 dark:border-slate-800 pb-2">
                                    <div className="font-bold text-slate-800 dark:text-slate-200 py-2">{link.label}</div>
                                </div>
                            ))}
                            {!isLoggedIn && (
                                <div className="flex flex-col gap-3 mt-6">
                                    <Link to="/login" className="w-full text-center border-2 border-slate-100 dark:border-slate-700 py-3 rounded-xl font-bold text-slate-700 dark:text-slate-300">Login</Link>
                                    <Link to="/register" className="w-full text-center bg-blue-600 text-white py-3 rounded-xl font-bold">Register</Link>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </nav>
        </>
    );
};

// --- ROUTE PROTECTION COMPONENTS ---
const PrivateRoute = ({ children }) => {
    const token = localStorage.getItem('access_token');
    return token ? children : <Navigate to="/login" />;
};

// FIX: AdminRoute now strictly checks for 'admin' role
const AdminRoute = ({ children }) => {
    const token = localStorage.getItem('access_token');
    const userRole = localStorage.getItem('user_role');
    
    // 1. Not logged in? Go to Admin Login
    if (!token) return <Navigate to="/admin-portal" replace />;
    
    // 2. Logged in but NOT admin? Kick them to Student Dashboard
    if (userRole !== 'admin') return <Navigate to="/dashboard" replace />;
    
    // 3. Admin? Let them in
    return children;
};

// --- APP & LAYOUT ---
const Layout = ({ children, theme, toggleTheme }) => {
    const location = useLocation();
    const hideNavbar = location.pathname.startsWith('/admin');
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-200 font-sans selection:bg-blue-100 transition-colors duration-300">
            {!hideNavbar && <Navbar theme={theme} toggleTheme={toggleTheme} />}
            {children}
        </div>
    );
};

function App() {
  const isLoggedIn = !!localStorage.getItem('access_token');
  const { theme, toggleTheme } = useTheme();

  // FIX: Force re-validation
  useEffect(() => {
    const handleFocus = () => {
        const isPublic = [
            '/', '/login', '/register', '/forgot-password', 
            '/store'
        ].includes(window.location.pathname) || 
        window.location.pathname.startsWith('/category/') ||
        window.location.pathname.startsWith('/course/') ||
        window.location.pathname.startsWith('/defence/') ||
        window.location.pathname.startsWith('/teaching/') ||
        window.location.pathname.startsWith('/engineering/') ||
        window.location.pathname.startsWith('/medical/') ||
        window.location.pathname.startsWith('/password-reset');

        const hasToken = !!localStorage.getItem('access_token');
        if (!isPublic && !hasToken) window.location.href = '/login';
    };
    window.addEventListener('pageshow', handleFocus);
    window.addEventListener('popstate', handleFocus);
    return () => {
        window.removeEventListener('pageshow', handleFocus);
        window.removeEventListener('popstate', handleFocus);
    };
  }, []);

  return (
    <Router>
        <Layout theme={theme} toggleTheme={toggleTheme}>
            <Routes>
                {/* 1. PUBLIC ROUTES */}
                <Route path="/" element={<LandingPage />} />
                
                {/* Public Course Pages (All Categories) */}
                <Route path="/defence/agniveer" element={<AgniveerPage />} />
                <Route path="/defence/nda" element={<NdaPage />} />
                <Route path="/defence/cds" element={<CdsPage />} />
                <Route path="/defence/afcat" element={<AfcatPage />} />
                
                <Route path="/civil-services/upsc" element={<UpscPage />} />
                <Route path="/civil-services/bpsc" element={<BpscPage />} />

                <Route path="/engineering/jee" element={<JeePage />} />
                <Route path="/engineering/gate" element={<GatePage />} />

                <Route path="/medical/neet" element={<NeetPage />} />

                <Route path="/teaching/bpsc_tre" element={<BpscTrePage />} />
                <Route path="/teaching/ctet" element={<CtetPage />} />
                <Route path="/teaching/ugc_net" element={<UgcNetPage />} />

                {/* Dynamic & Store Pages */}
                <Route path="/course/:category/:courseId" element={<AgniveerPage />} />
                <Route path="/category/:categoryId" element={<CategoryPage />} />
                <Route path="/store" element={<CourseStorePage />} /> 

                {/* 2. PROTECTED ROUTES */}
                <Route path="/courses" element={<PrivateRoute><CourseList /></PrivateRoute>} />
                <Route path="/dashboard" element={<PrivateRoute><DashboardPage /></PrivateRoute>} />
                <Route path="/exam/:examId" element={<PrivateRoute><ExamPage /></PrivateRoute>} />
                <Route path="/topic/:topicId/notes" element={<PrivateRoute><NotesPage /></PrivateRoute>} />
                <Route path="/chapter/:chapterId/notes" element={<PrivateRoute><NotesPage /></PrivateRoute>} />
                
                {/* Profile Routes */}
                <Route path="/profile" element={<PrivateRoute><ProfilePage /></PrivateRoute>} /> {/* Updated Link */}
                <Route path="/purchases" element={<PrivateRoute><Navigate to="/dashboard" /></PrivateRoute>} />
                <Route path="/help" element={<PrivateRoute><Navigate to="/dashboard" /></PrivateRoute>} />

                {/* 3. ADMIN ROUTES */}
                <Route path="/admin-portal" element={<AdminLoginPage />} />
                <Route path="/admin-dashboard" element={<AdminRoute><AdminDashboardPage /></AdminRoute>} />
                <Route path="/admin-generator" element={<AdminRoute><AdminGeneratorPage /></AdminRoute>} />
                <Route path="/admin-notes-upload" element={<AdminRoute><AdminNotesUploadPage /></AdminRoute>} />
                <Route path="/admin-notes-editor" element={<AdminRoute><AdminNotesEditorPage /></AdminRoute>} />
                <Route path="/admin-ads" element={<AdminRoute><AdminAdManagerPage /></AdminRoute>} /> 

                {/* 4. AUTH ROUTES */}
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                <Route path="/password-reset/:uid/:token" element={<ResetPasswordPage />} />
            </Routes>
        </Layout>
    </Router>
  );
}

export default App;