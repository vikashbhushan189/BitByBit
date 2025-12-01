import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate, Navigate, useLocation } from 'react-router-dom';
import CourseList from './components/CourseList';
import ExamPage from './pages/ExamPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import LandingPage from './pages/LandingPage';
import AdminGeneratorPage from './pages/AdminGeneratorPage'; // Admin Tool
import AdminLoginPage from './pages/AdminLoginPage'; // <--- NEW FILE WE WILL CREATE
import NotesPage from './pages/NotesPage';
import { LogOut, LayoutDashboard, BookOpen, ShieldCheck } from 'lucide-react';

const Navbar = ({ isLoggedIn }) => {
    const navigate = useNavigate();
    
    const handleLogout = () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        // Force a hard reload to clear all states cleanly
        window.location.href = '/login'; 
    };

    return (
        <nav className="bg-white/80 backdrop-blur-md border-b border-slate-200 px-6 py-4 flex justify-between items-center sticky top-0 z-50">
            <Link to="/" className="font-black text-2xl text-slate-900 tracking-tight flex items-center gap-2">
                <span className="text-blue-600 text-3xl">Bit</span>byBit
            </Link>
            
            <div>
                {isLoggedIn ? (
                    <div className="flex items-center gap-6">
                        <Link to="/courses" className="text-slate-600 hover:text-blue-600 font-semibold flex items-center gap-2">
                            <BookOpen size={18}/> Courses
                        </Link>
                        <Link to="/dashboard" className="text-slate-600 hover:text-blue-600 font-semibold flex items-center gap-2">
                            <LayoutDashboard size={18}/> Dashboard
                        </Link>
                        <button 
                            onClick={handleLogout} 
                            className="flex items-center gap-2 text-red-600 font-bold hover:bg-red-50 px-4 py-2 rounded-lg transition-colors"
                        >
                            <LogOut size={18} /> Logout
                        </button>
                    </div>
                ) : (
                    <div className="space-x-4 flex items-center">
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

// Helper: Protect Admin Routes (Basic check, backend verifies actual permissions)
const AdminRoute = ({ children }) => {
    const token = localStorage.getItem('access_token');
    return token ? children : <Navigate to="/admin-portal" />;
};

function App() {
  // FIX: Lazy Initialization prevents the "Flash" of landing page
  // This runs BEFORE the first render
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
      return !!localStorage.getItem('access_token');
  });

  return (
    <Router>
      <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-blue-100">
        <Navbar isLoggedIn={isLoggedIn} />
        <Routes>
            {/* If logged in, go to Courses. If not, go to Landing Page */}
            <Route path="/" element={isLoggedIn ? <Navigate to="/courses" replace /> : <LandingPage />} />
            
            {/* Student Routes */}
            <Route path="/courses" element={<PrivateRoute><CourseList /></PrivateRoute>} />
            <Route path="/dashboard" element={<PrivateRoute><DashboardPage /></PrivateRoute>} />
            <Route path="/exam/:examId" element={<PrivateRoute><ExamPage /></PrivateRoute>} />
            <Route path="/topic/:topicId/notes" element={<PrivateRoute><NotesPage /></PrivateRoute>} />
            
            {/* Admin Routes */}
            <Route path="/admin-portal" element={<AdminLoginPage />} />
            <Route path="/admin-generator" element={<AdminRoute><AdminGeneratorPage /></AdminRoute>} />

            {/* Public Routes */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;