import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate, Navigate } from 'react-router-dom';
import CourseList from './components/CourseList';
import ExamPage from './pages/ExamPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import LandingPage from './pages/LandingPage';
import NotesPage from './pages/NotesPage'; // <--- NEW IMPORT
import { LogOut, LayoutDashboard, BookOpen } from 'lucide-react';

const Navbar = () => {
    const navigate = useNavigate();
    const isLoggedIn = !!localStorage.getItem('access_token');
    
    const handleLogout = () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        navigate('/login');
        window.location.reload(); 
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
    const isLoggedIn = !!localStorage.getItem('access_token');
    return isLoggedIn ? children : <Navigate to="/login" />;
};

function App() {
  const isLoggedIn = !!localStorage.getItem('access_token');

  return (
    <Router>
      <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-blue-100">
        <Navbar />
        <Routes>
            {/* If logged in, go to Courses. If not, go to Landing Page */}
            <Route path="/" element={isLoggedIn ? <Navigate to="/courses" /> : <LandingPage />} />
            
            {/* Protected Routes */}
            <Route path="/courses" element={<PrivateRoute><CourseList /></PrivateRoute>} />
            <Route path="/dashboard" element={<PrivateRoute><DashboardPage /></PrivateRoute>} />
            <Route path="/exam/:examId" element={<PrivateRoute><ExamPage /></PrivateRoute>} />
            
            {/* NEW: Secure Notes Route */}
            <Route path="/topic/:topicId/notes" element={<PrivateRoute><NotesPage /></PrivateRoute>} />
            
            {/* Public Routes */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;