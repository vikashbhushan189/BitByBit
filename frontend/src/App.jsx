import React, { useEffect } from 'react'; 
import { BrowserRouter as Router, Routes, Route, Link, useNavigate, Navigate, useLocation } from 'react-router-dom';
import { LogOut, LayoutDashboard, BookOpen, ArrowLeft, GraduationCap, User } from 'lucide-react';

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

const Navbar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const isLoggedIn = !!localStorage.getItem('access_token');
    const userRole = localStorage.getItem('user_role');
    
    // SMART LOGOUT LOGIC
    const handleLogout = () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user_role');
        
        if (userRole === 'admin') {
            window.location.href = '/admin-portal'; 
        } else {
            window.location.href = '/login'; 
        }
    };

    // Determine if Back Button should be shown
    // Hide on main dashboard and landing page to prevent confusion
    const showBackButton = location.pathname !== '/dashboard' && location.pathname !== '/';

    return (
        <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-200/60 shadow-sm transition-all">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    
                    {/* LEFT: Logo & Back */}
                    <div className="flex items-center gap-6">
                        {showBackButton && (
                            <button 
                                onClick={() => navigate(-1)}
                                className="group flex items-center gap-1.5 text-slate-500 hover:text-slate-800 transition-colors text-sm font-medium"
                                title="Go Back"
                            >
                                <ArrowLeft size={18} className="transition-transform group-hover:-translate-x-1" />
                                <span className="hidden sm:inline">Back</span>
                            </button>
                        )}
                        
                        <Link to={isLoggedIn ? "/dashboard" : "/"} className="flex items-center gap-2 group">
                            <div className="bg-slate-900 text-white p-1.5 rounded-lg transition-transform group-hover:scale-105 shadow-md">
                                <GraduationCap size={20} />
                            </div>
                            <span className="font-black text-xl tracking-tight text-slate-900">
                                <span className="text-blue-600">Bit</span>byBit
                            </span>
                        </Link>
                    </div>
                    
                    {/* RIGHT: Actions */}
                    <div className="flex items-center gap-4">
                        {isLoggedIn ? (
                            <>
                                <Link 
                                    to="/courses" 
                                    className={`hidden md:flex items-center gap-2 text-sm font-semibold transition-colors ${location.pathname === '/courses' ? 'text-blue-600' : 'text-slate-600 hover:text-slate-900'}`}
                                >
                                    <BookOpen size={18}/> 
                                    <span>Library</span>
                                </Link>
                                
                                <Link 
                                    to="/dashboard" 
                                    className={`hidden md:flex items-center gap-2 text-sm font-semibold transition-colors ${location.pathname === '/dashboard' ? 'text-blue-600' : 'text-slate-600 hover:text-slate-900'}`}
                                >
                                    <LayoutDashboard size={18}/> 
                                    <span>Dashboard</span>
                                </Link>

                                <div className="h-6 w-px bg-slate-200 hidden md:block"></div>

                                <button 
                                    onClick={handleLogout} 
                                    className="flex items-center gap-2 text-red-600 hover:text-red-700 hover:bg-red-50 px-3 py-1.5 rounded-lg transition-all text-sm font-bold"
                                >
                                    <LogOut size={16} /> 
                                    <span className="hidden sm:inline">Logout</span>
                                </button>
                                
                                {/* Mobile Profile Icon (Placeholder for menu) */}
                                <div className="md:hidden w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold text-xs">
                                    <User size={16}/>
                                </div>
                            </>
                        ) : (
                            <div className="flex items-center gap-3">
                                <Link to="/login" className="text-slate-600 font-bold hover:text-slate-900 text-sm px-3 py-2">
                                    Login
                                </Link>
                                <Link to="/register" className="bg-slate-900 hover:bg-slate-800 text-white px-5 py-2 rounded-lg font-bold text-sm shadow-lg shadow-slate-900/20 transition-all hover:-translate-y-0.5">
                                    Get Started
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
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

// Layout Component to Handle Navbar Visibility
const Layout = ({ children }) => {
    const location = useLocation();
    
    // Hide Student Navbar on:
    // 1. Admin Pages
    // 2. Landing Page '/' (It has its own Mega Menu Navbar)
    // 3. Exam/Notes Pages (Distraction Free)
    // NOTE: We do NOT hide it on Course Intro pages anymore, as per user request.
    const hideNavbar = 
        location.pathname.startsWith('/admin') || 
        location.pathname === '/' || 
        location.pathname.startsWith('/exam/') || 
        (location.pathname.startsWith('/topic/') && location.pathname.endsWith('/notes')) ||
        (location.pathname.startsWith('/chapter/') && location.pathname.endsWith('/notes'));

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-blue-100">
            {!hideNavbar && <Navbar />}
            {children}
        </div>
    );
};

function App() {
  const isLoggedIn = !!localStorage.getItem('access_token');

  // FIX: Force re-validation on history navigation (Back Button)
  useEffect(() => {
    const handleFocus = () => {
        // List of public paths that don't require login
        const isPublic = [
            '/', '/login', '/register', '/forgot-password', 
            '/defence/agniveer', '/teaching/bpsc_tre', '/store'
        ].includes(window.location.pathname) || 
        window.location.pathname.startsWith('/category/') ||
        window.location.pathname.startsWith('/course/') ||
        window.location.pathname.startsWith('/defence/') ||
        window.location.pathname.startsWith('/teaching/') ||
        window.location.pathname.startsWith('/engineering/') ||
        window.location.pathname.startsWith('/medical/') ||
        window.location.pathname.startsWith('/password-reset');

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
        <Layout>
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