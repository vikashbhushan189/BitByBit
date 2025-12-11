import React, { useState } from 'react';
import api from '../api/axios';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { AlertCircle, LogIn, Lock, User } from 'lucide-react';

const LoginPage = () => {
    const [formData, setFormData] = useState({ username: '', password: '' });
    const [error, setError] = useState(''); 
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError(''); 
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            // 1. Get Token
            const res = await api.post('auth/jwt/create/', formData);
            const token = res.data.access;
            
            // 2. Check User Role (Critical Step)
            // We temporarily use this token to ask "Who am I?"
            const userRes = await api.get('auth/users/me/', {
                headers: { Authorization: `JWT ${token}` }
            });

            if (userRes.data.is_superuser || userRes.data.is_staff) {
                setError("Admins must use the Admin Portal.");
                setIsLoading(false);
                return; // Stop execution
            }

            // 3. If Student, Proceed -> Save Data
            localStorage.setItem('access_token', token);
            localStorage.setItem('refresh_token', res.data.refresh);
            localStorage.setItem('user_role', 'student');

            // 4. Smart Redirect
            // Check if we have a saved location (e.g. from clicking "Enroll" on a course page)
            const from = location.state?.from || '/dashboard';
            
            // We use window.location.href instead of navigate() here because
            // we want to FORCE A RELOAD. This ensures the Navbar updates its state 
            // (Login button -> Logout button) immediately.
            window.location.href = from;
            
        } catch (err) {
            console.error("Login Error:", err);
            if (err.response && err.response.status === 401) {
                setError("Invalid Username or Password.");
            } else {
                setError("Something went wrong. Please check your connection.");
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 font-sans">
            <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md border border-gray-100">
                <div className="text-center mb-8">
                    <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                        <LogIn className="text-blue-600" size={28} />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-800">Student Login</h2>
                    <p className="text-slate-500 text-sm mt-2">Please enter your details to sign in.</p>
                </div>

                {error && (
                    <div className="mb-6 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg flex items-center gap-3 text-sm animate-pulse">
                        <AlertCircle size={18} />
                        <span>{error}</span>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="relative">
                        <User className="absolute left-3 top-3.5 text-gray-400 w-5 h-5" />
                        <input
                            type="text"
                            name="username"
                            placeholder="Username"
                            onChange={handleChange}
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                            required
                        />
                    </div>
                    
                    <div className="relative">
                        <Lock className="absolute left-3 top-3.5 text-gray-400 w-5 h-5" />
                        <input
                            type="password"
                            name="password"
                            placeholder="Password"
                            onChange={handleChange}
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                            required
                        />
                    </div>
                    <div className="flex justify-end">
                        <Link to="/forgot-password" class="text-sm font-medium text-blue-600 hover:text-blue-500">
                        Forgot password?
                        </Link>
                    </div>
                    <button 
                        type="submit" 
                        disabled={isLoading}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-bold shadow-md hover:shadow-lg transition-all disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center gap-2"
                    >
                        {isLoading ? "Checking Access..." : "Login"}
                    </button>
                </form>

                <div className="mt-6 text-center text-sm text-gray-600">
                    <p>Don't have an account? <Link to="/register" className="text-blue-600 font-semibold hover:underline">Create one</Link></p>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;