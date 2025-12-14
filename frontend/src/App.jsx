import React, { useEffect } from 'react'; 
import { BrowserRouter as Router, Routes, Route, Link, useNavigate, Navigate, useLocation } from 'react-router-dom';
import { LogOut, LayoutDashboard, BookOpen, ArrowLeft } from 'lucide-react';

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
    
    // SMART LOGOUT LOGIC
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

    // Determine if Back Button should be shown (hide on main landing & dashboard)
    const showBackButton = location.pathname !== '/dashboard' && location.pathname !== '/';

    return (
        <nav className="bg-white/80 backdrop-blur-md border-b border-slate-200 px-6 py-4 flex justify-between items-center sticky top-0 z-50">
            <div className="flex items-center gap-4">
                {/* BACK BUTTON */}
                {showBackButton && (
                    <button 
                        onClick={() => navigate(-1)}
                        className="p-2 rounded-full hover:bg-slate-100 text-slate-500 transition-colors"
                        title="Go Back"
                    >
                        <ArrowLeft size={20} />
                    </button>
                )}
                
                <Link to="/" className="font-black text-2xl text-slate-900 tracking-tight flex items-center gap-2">
                    <span className="text-blue-600 text-3xl">Bit</span>byBit
                </Link>
            </div>
            
            <div>
                {isLoggedIn ? (
                    <div className="flex items-center gap-6">
                        <Link to="/courses" className="text-slate-600 hover:text-blue-600 font-semibold flex items-center gap-2">
                            <BookOpen size={18}/> All Courses
                        </Link>
                        <Link to="/dashboard" className="text-blue-600 font-bold flex items-center gap-2 bg-blue-50 px-4 py-2 rounded-lg">
                            <LayoutDashboard size={18}/> My Learning
                        </Link>
                        <button 
                            onClick={handleLogout} 
                            className="flex items-center gap-2 text-red-600 font-bold hover:bg-red-50 px-4 py-2 rounded-lg transition-colors"
                        >
                            <LogOut size={18} /> Logout
                        </button>
                    </div>
                ) : (
                    <div className="space-x-4">
                        <Link to="/login" className="text-slate-600 font-bold hover:text-blue-600 transition-colors">
                            Login
                        </Link>
                        <Link to="/register" className="bg-blue-600 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200">
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

// Layout Component to Handle Navbar Visibility
const Layout = ({ children }) => {
    const location = useLocation();
    
    // UPDATED LOGIC: Only hide Navbar on Admin pages.
    // It will now show on Landing Page ('/') and Course Intro pages.
    const hideNavbar = location.pathname.startsWith('/admin');

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
        const publicPaths = [
            '/', '/login', '/register', '/forgot-password', 
            '/defence/agniveer', '/teaching/bpsc_tre', '/store'
        ];
        // Check public paths
        const isPublic = publicPaths.some(path => window.location.pathname === path || window.location.pathname.startsWith('/password-reset') || window.location.pathname.startsWith('/category/') || window.location.pathname.startsWith('/course/'));
        const hasToken = !!localStorage.getItem('access_token');
        
        // Only force login if accessing a PROTECTED route without a token
        if (!isPublic && !hasToken) {
            window.location.href = '/login';
        }
    };
    window.addEventListener('pageshow', handleFocus);
    return () => window.removeEventListener('pageshow', handleFocus);
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