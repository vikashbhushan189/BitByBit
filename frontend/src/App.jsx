import React, { useEffect, useState, useRef } from 'react'; 
import { BrowserRouter as Router, Routes, Route, Link, useNavigate, Navigate, useLocation } from 'react-router-dom';
import { LogOut, LayoutDashboard, BookOpen, ArrowLeft, User, ChevronDown, CreditCard, Settings, HelpCircle, GraduationCap, Sun, Moon } from 'lucide-react';
import { useTheme } from './hooks/useTheme'; // Ensure you import your theme hook

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

// --- Components ---

// NEW: Profile Dropdown Component
const ProfileMenu = ({ handleLogout }) => {
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef(null);
    const navigate = useNavigate();

    // Close menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Helper to close menu on navigation
    const handleNav = (path) => {
        setIsOpen(false);
        navigate(path);
    };

    return (
        <div className="relative" ref={menuRef}>
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 p-1.5 pr-3 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors border border-transparent hover:border-slate-200 dark:hover:border-slate-700"
            >
                <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm shadow-sm">
                    U {/* Placeholder for User Initial - could be dynamic */}
                </div>
                <ChevronDown size={16} className={`text-slate-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {isOpen && (
                <div className="absolute right-0 top-full mt-2 w-56 bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200 z-50">
                    <div className="p-4 border-b border-slate-100 dark:border-slate-800">
                        <p className="text-sm font-bold text-slate-900 dark:text-white">Student Account</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 truncate">student@example.com</p>
                    </div>
                    
                    <div className="p-2 space-y-1">
                        <button onClick={() => handleNav('/dashboard')} className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors text-left">
                            <LayoutDashboard size={16} className="text-blue-500"/> Dashboard
                        </button>
                        <button onClick={() => handleNav('/courses?mode=enrolled')} className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors text-left">
                            <BookOpen size={16} className="text-emerald-500"/> My Library
                        </button>
                        <button onClick={() => handleNav('/purchases')} className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors text-left">
                            <CreditCard size={16} className="text-purple-500"/> My Purchases
                        </button>
                         <button onClick={() => handleNav('/profile')} className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors text-left">
                            <User size={16} className="text-orange-500"/> My Profile
                        </button>
                    </div>

                    <div className="p-2 border-t border-slate-100 dark:border-slate-800">
                         <button onClick={() => handleNav('/help')} className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors text-left">
                            <HelpCircle size={16} className="text-slate-400"/> Help & Support
                        </button>
                        <button 
                            onClick={handleLogout} 
                            className="w-full flex items-center gap-3 px-3 py-2 text-sm font-bold text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors text-left mt-1"
                        >
                            <LogOut size={16} /> Logout
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

const Navbar = ({ theme, toggleTheme }) => { // Accept theme props
    const navigate = useNavigate();
    const location = useLocation();
    const isLoggedIn = !!localStorage.getItem('access_token');
    
    const handleLogout = () => {
        const role = localStorage.getItem('user_role');
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user_role');
        
        if (role === 'admin') {
            window.location.href = '/admin-portal'; 
        } else {
            window.location.href = '/login'; 
        }
    };

    const showBackButton = location.pathname !== '/dashboard' && location.pathname !== '/';

    return (
        <nav className="bg-white/80 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-6 py-4 flex justify-between items-center sticky top-0 z-50 transition-colors">
            <div className="flex items-center gap-4">
                {showBackButton && (
                    <button 
                        onClick={() => navigate(-1)}
                        className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 transition-colors"
                        title="Go Back"
                    >
                        <ArrowLeft size={20} />
                    </button>
                )}
                
                <Link to="/" className="font-black text-2xl text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
                     <div className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 p-1.5 rounded-lg transition-colors">
                        <GraduationCap size={20} />
                    </div>
                    <span><span className="text-blue-600">Bit</span>byBit</span>
                </Link>
            </div>
            
            <div className="flex items-center gap-4">
                {/* Theme Toggle is always visible */}
                <button 
                    onClick={toggleTheme}
                    className="p-2 rounded-full text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    title={theme === 'dark' ? "Switch to Light Mode" : "Switch to Dark Mode"}
                >
                    {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
                </button>

                {isLoggedIn ? (
                    <div className="flex items-center gap-4">
                        {/* Keep 'All Courses' visible for quick access? Or hide to clean up? 
                            Let's keep it but make it subtle, or rely on the dropdown.
                            For now, let's keep it as a primary action next to profile.
                        */}
                        <Link 
                            to="/courses" 
                            className="hidden md:flex items-center gap-2 text-sm font-bold text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                        >
                            <BookOpen size={18}/> <span className="hidden lg:inline">Library</span>
                        </Link>

                        {/* NEW: Profile Dropdown replaces Dashboard/Logout buttons */}
                        <ProfileMenu handleLogout={handleLogout} />
                    </div>
                ) : (
                    <div className="flex items-center gap-4">
                        <Link to="/login" className="text-slate-600 dark:text-slate-300 font-bold hover:text-blue-600 transition-colors">
                            Login
                        </Link>
                        <Link to="/register" className="bg-blue-600 text-white px-5 py-2.5 rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 dark:shadow-none hover:-translate-y-0.5">
                            Get Started
                        </Link>
                    </div>
                )}
            </div>
        </nav>
    );
};

// Helper: Protect Routes
const PrivateRoute = ({ children }) => {
    const token = localStorage.getItem('access_token');
    return token ? children : <Navigate to="/login" />;
};

const AdminRoute = ({ children }) => {
    const token = localStorage.getItem('access_token');
    return token ? children : <Navigate to="/admin-portal" />;
};

// Layout Component
const Layout = ({ children, theme, toggleTheme }) => {
    const location = useLocation();
    
    // Hide Student Navbar on Admin Pages ONLY.
    // Show on Landing ('/') and Course Pages now.
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
  const { theme, toggleTheme } = useTheme(); // Use Global Theme

  useEffect(() => {
    const handleFocus = () => {
        const publicPaths = [
            '/', '/login', '/register', '/forgot-password', 
            '/defence/agniveer', '/teaching/bpsc_tre', '/store'
        ];
        // Allow public access to category and course pages too
        const isPublic = publicPaths.some(path => 
            window.location.pathname === path || 
            window.location.pathname.startsWith('/password-reset') || 
            window.location.pathname.startsWith('/category/') || 
            window.location.pathname.startsWith('/course/') ||
            window.location.startsWith('/defence/') || // Catch all defence sub-pages
            window.location.startsWith('/teaching/')   // Catch all teaching sub-pages
        );

        const hasToken = !!localStorage.getItem('access_token');
        
        if (!isPublic && !hasToken) {
            window.location.href = '/login';
        }
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
                
                {/* Public Course Pages */}
                <Route path="/defence/agniveer" element={<AgniveerPage />} />
                <Route path="/teaching/bpsc_tre" element={<BpscTrePage />} />
                <Route path="/course/:category/:courseId" element={<AgniveerPage />} />
                <Route path="/category/:categoryId" element={<CategoryPage />} />
                
                <Route path="/store" element={<CourseStorePage />} /> 

                {/* 2. PROTECTED ROUTES */}
                <Route path="/courses" element={<PrivateRoute><CourseList /></PrivateRoute>} />
                <Route path="/dashboard" element={<PrivateRoute><DashboardPage /></PrivateRoute>} />
                <Route path="/exam/:examId" element={<PrivateRoute><ExamPage /></PrivateRoute>} />
                <Route path="/topic/:topicId/notes" element={<PrivateRoute><NotesPage /></PrivateRoute>} />
                <Route path="/chapter/:chapterId/notes" element={<PrivateRoute><NotesPage /></PrivateRoute>} />
                
                {/* Placeholder routes for new profile menu links - redirect to dashboard for now */}
                <Route path="/purchases" element={<PrivateRoute><Navigate to="/dashboard" /></PrivateRoute>} />
                <Route path="/profile" element={<PrivateRoute><Navigate to="/dashboard" /></PrivateRoute>} />
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