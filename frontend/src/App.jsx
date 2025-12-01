import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import CourseList from './components/CourseList';
import ExamPage from './pages/ExamPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import { LogOut, User } from 'lucide-react'; 

// --- Navbar Component ---
const Navbar = () => {
    const navigate = useNavigate();
    const isLoggedIn = !!localStorage.getItem('access_token');
    
    const handleLogout = () => {
        // Clear tokens and redirect
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        navigate('/login');
        window.location.reload(); // Force refresh to update UI state
    };

    return (
        <nav className="bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center sticky top-0 z-50 shadow-sm">
            <Link to="/" className="font-extrabold text-2xl text-blue-900 tracking-tight">
                Bit by Bit
            </Link>
            
            <div>
                {isLoggedIn ? (
                    <div className="flex items-center gap-4">
                        <Link to="/dashboard" className="text-gray-600 hover:text-blue-600 font-medium">Dashboard</Link>
                        <span className="text-sm text-gray-500 hidden md:inline flex items-center gap-1">
                             <User size={16} /> Student
                        </span>
                        <button 
                            onClick={handleLogout} 
                            className="flex items-center gap-2 text-red-600 font-medium hover:bg-red-50 px-3 py-2 rounded transition-colors"
                        >
                            <LogOut size={18} /> Logout
                        </button>
                    </div>
                ) : (
                    <div className="space-x-3">
                        <Link 
                            to="/login" 
                            className="text-gray-600 font-medium hover:text-blue-600 transition-colors"
                        >
                            Login
                        </Link>
                        <Link 
                            to="/register" 
                            className="bg-blue-600 text-white px-5 py-2.5 rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-sm"
                        >
                            Get Started
                        </Link>
                    </div>
                )}
            </div>
        </nav>
    );
};

// --- Main App Component ---
function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50 text-slate-900 font-sans">
        <Navbar />
        <Routes>
            <Route path="/" element={<CourseList />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/exam/:examId" element={<ExamPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;