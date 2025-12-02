import React, { useState } from 'react';
import api from '../api/axios';
import { useNavigate, Link } from 'react-router-dom';
import { AlertCircle, User, Mail, Lock, CheckCircle } from 'lucide-react';

const RegisterPage = () => {
    // Added re_password to state
    const [formData, setFormData] = useState({ 
        username: '', 
        email: '', 
        password: '', 
        re_password: '' 
    });
    
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // 1. Client-side Validation
        if (formData.password !== formData.re_password) {
            setError("Passwords do not match.");
            return;
        }

        setIsLoading(true);
        setError('');

        try {
            // 2. Send Data (Djoser expects 're_password' if configured)
            await api.post('auth/users/', formData);
            
            // Success!
            alert("Registration Successful! Please check your email to activate or login.");
            navigate('/login');
        } catch (err) {
            console.error("Registration Error:", err);
            
            if (err.response && err.response.data) {
                const data = err.response.data;
                const firstErrorKey = Object.keys(data)[0];
                const errorMessage = Array.isArray(data[firstErrorKey]) 
                    ? data[firstErrorKey][0] 
                    : data[firstErrorKey];
                setError(`${firstErrorKey.toUpperCase()}: ${errorMessage}`);
            } else {
                setError("Network error. Please check your connection.");
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 font-sans">
            <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md border border-gray-100">
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-extrabold text-blue-900">Create Account</h2>
                    <p className="text-gray-500 mt-2">Join us and start learning bit by bit.</p>
                </div>

                {error && (
                    <div className="mb-6 bg-red-50 text-red-700 p-4 rounded-lg flex items-start gap-3 text-sm animate-pulse border border-red-100">
                        <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
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
                        <Mail className="absolute left-3 top-3.5 text-gray-400 w-5 h-5" />
                        <input
                            type="email"
                            name="email"
                            placeholder="Email Address"
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
                            placeholder="Password (Min 8 chars)"
                            onChange={handleChange}
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                            required
                        />
                    </div>

                    {/* NEW: Confirm Password Field */}
                    <div className="relative">
                        <CheckCircle className="absolute left-3 top-3.5 text-gray-400 w-5 h-5" />
                        <input
                            type="password"
                            name="re_password"
                            placeholder="Confirm Password"
                            onChange={handleChange}
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold shadow-md hover:shadow-lg transition-all disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center gap-2"
                    >
                        {isLoading ? "Creating Account..." : "Register"}
                    </button>
                </form>

                <p className="mt-6 text-center text-sm text-gray-600">
                    Already have an account?{' '}
                    <Link to="/login" className="font-semibold text-blue-600 hover:text-blue-700">
                        Log in here
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default RegisterPage;