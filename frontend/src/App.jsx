import React, { useEffect } from 'react'; 
import { BrowserRouter as Router, Routes, Route, Link, useNavigate, Navigate, useLocation } from 'react-router-dom';
import CourseList from './components/CourseList';
import ExamPage from './pages/ExamPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import LandingPage from './pages/LandingPage';
import NotesPage from './pages/NotesPage';
import AdminLoginPage from './pages/AdminLoginPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import AdminGeneratorPage from './pages/AdminGeneratorPage';
import { LogOut, LayoutDashboard, BookOpen } from 'lucide-react';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import AdminNotesUploadPage from './pages/AdminNotesUploadPage';
import CourseStorePage from './pages/CourseStorePage';
import AdminAdManagerPage from './pages/AdminAdManagerPage';
import AgniveerPage from './pages/courses/defence/AgniveerPage'; 
import BpscTrePage from './pages/courses/teaching/BpscTrePage';
import AdminNotesEditorPage from './pages/AdminNotesEditorPage';
import CategoryPage from './pages/CategoryPage';
// --- Components ---

const Navbar = () => {
    const navigate = useNavigate();
    const isLoggedIn = !!localStorage.getItem('access_token');
    
    // SMART LOGOUT LOGIC
    const handleLogout = () => {
        // 1. Check Role BEFORE clearing data
        const role = localStorage.getItem('user_role');

        // 2. Clear Data
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user_role');
        
        // 3. Redirect based on Role
        if (role === 'admin') {
            window.location.href = '/admin-portal'; 
        } else {
            window.location.href = '/login'; 
        }
    };

    return (
        <nav className="bg-white/80 backdrop-blur-md border-b border-slate-200 px-6 py-4 flex justify-between items-center sticky top-0 z-50">
            <Link to="/" className="font-black text-2xl text-slate-900 tracking-tight flex items-center gap-2">
                <span className="text-blue-600 text-3xl">Bit</span>byBit
            </Link>
            
            <div>
                {isLoggedIn ? (
                    <div className="flex items-center gap-6">
                        {/* STORE LINK */}
                        <Link to="/courses" className="text-slate-600 hover:text-blue-600 font-semibold flex items-center gap-2">
                            <BookOpen size={18}/> All Courses
                        </Link>
                        {/* DASHBOARD LINK (Primary) */}
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
    
    // Hide Student Navbar on Admin Pages AND Landing Page (since Landing has its own)
    const hideNavbar = location.pathname.startsWith('/admin') || location.pathname === '/';

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
        // If we are on a protected page but have no token, force reload
        const isPublic = ['/login', '/register', '/', '/defence/agniveer', 
            '/teaching/bpsc_tre'].includes(window.location.pathname);
        const hasToken = !!localStorage.getItem('access_token');
        
        if (!isPublic && !hasToken) {
            window.location.href = '/login';
        }
    };

    window.addEventListener('pageshow', handleFocus); // Standard navigation
    window.addEventListener('popstate', handleFocus); // Back button navigation
    
    return () => {
        window.removeEventListener('pageshow', handleFocus);
        window.removeEventListener('popstate', handleFocus);
    };
  }, []);

  return (
    <Router>
        <Layout>
            <Routes>
                {/* Landing / Home */}
                <Route path="/" element={isLoggedIn ? <Navigate to="/dashboard" replace /> : <LandingPage />} />

                {/* Introduction Pages (Public) */}
                <Route path="/defence/agniveer" element={<AgniveerPage />} />
                <Route path="/teaching/bpsc_tre" element={<BpscTrePage />} />

                {/* Student Routes */}
                <Route path="/courses" element={<PrivateRoute><CourseList /></PrivateRoute>} />
                <Route path="/dashboard" element={<PrivateRoute><DashboardPage /></PrivateRoute>} />
                <Route path="/exam/:examId" element={<PrivateRoute><ExamPage /></PrivateRoute>} />
                <Route path="/topic/:topicId/notes" element={<PrivateRoute><NotesPage /></PrivateRoute>} />
                <Route path="/store" element={<PrivateRoute><CourseStorePage /></PrivateRoute>} />
                <Route path="/category/:categoryId" element={<CategoryPage />} />

                {/* Admin Routes */}
                <Route path="/admin-portal" element={<AdminLoginPage />} />
                <Route path="/admin-dashboard" element={<AdminRoute><AdminDashboardPage /></AdminRoute>} />
                <Route path="/admin-generator" element={<AdminRoute><AdminGeneratorPage /></AdminRoute>} />
                <Route path="/admin-notes-upload" element={<AdminRoute><AdminNotesUploadPage /></AdminRoute>} />
                <Route path="/admin-ads" element={<AdminRoute><AdminAdManagerPage /></AdminRoute>} />
                <Route path="/admin-notes-editor" element={<AdminRoute><AdminNotesEditorPage /></AdminRoute>} /> 

                {/* Auth Routes */}
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

