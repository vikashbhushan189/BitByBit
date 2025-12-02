import React, { useState } from 'react';
import api from '../api/axios';
import { useNavigate } from 'react-router-dom';
import { AlertCircle, ShieldCheck, Lock, UserCog } from 'lucide-react';

const AdminLoginPage = () => {
    const [formData, setFormData] = useState({ username: '', password: '' });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            // 1. Authenticate to get Token
            const res = await api.post('auth/jwt/create/', formData);
            const token = res.data.access;

            // 2. Verify Admin Status (Critical Security Check)
            const userRes = await api.get('auth/users/me/', {
                headers: { Authorization: `JWT ${token}` }
            });

            if (!userRes.data.is_superuser && !userRes.data.is_staff) {
                setError("Access Denied: You do not have admin privileges.");
                setIsLoading(false);
                return;
            }
            
            // 3. Save tokens and Redirect
            localStorage.setItem('access_token', token);
            localStorage.setItem('refresh_token', res.data.refresh);
            
            // Redirect to Admin Dashboard
            window.location.href = '/admin-dashboard';
        } catch (err) {
            console.error(err);
            if (err.response && err.response.status === 401) {
                setError("Access Denied: Invalid Admin Credentials.");
            } else {
                setError("System Error. Check backend connection.");
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-900 px-4 font-sans">
            <div className="bg-slate-800 p-10 rounded-2xl shadow-2xl w-full max-w-md border border-slate-700">
                <div className="text-center mb-8">
                    <div className="bg-purple-900/50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 border border-purple-500/30">
                        <ShieldCheck className="text-purple-400" size={40} />
                    </div>
                    <h2 className="text-3xl font-bold text-white tracking-tight">Admin Portal</h2>
                    <p className="text-slate-400 text-sm mt-3">Authorized personnel only.</p>
                </div>

                {error && (
                    <div className="mb-6 bg-red-900/20 border border-red-800 text-red-300 px-4 py-3 rounded-lg flex items-center gap-3 text-sm">
                        <AlertCircle size={18} />
                        <span>{error}</span>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="relative">
                        <UserCog className="absolute left-3 top-3.5 text-slate-500 w-5 h-5" />
                        <input
                            type="text"
                            name="username"
                            placeholder="Admin Username"
                            onChange={handleChange}
                            className="w-full pl-10 pr-4 py-3 bg-slate-900/50 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
                            required
                        />
                    </div>
                    
                    <div className="relative">
                        <Lock className="absolute left-3 top-3.5 text-slate-500 w-5 h-5" />
                        <input
                            type="password"
                            name="password"
                            placeholder="Password"
                            onChange={handleChange}
                            className="w-full pl-10 pr-4 py-3 bg-slate-900/50 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
                            required
                        />
                    </div>

                    <button 
                        type="submit" 
                        disabled={isLoading}
                        className="w-full bg-purple-600 hover:bg-purple-500 text-white py-3.5 rounded-lg font-bold shadow-lg shadow-purple-900/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2"
                    >
                        {isLoading ? "Authenticating..." : "Access Dashboard"}
                    </button>
                </form>

                <div className="mt-8 text-center">
                    <a href="/" className="text-slate-500 hover:text-slate-300 text-xs transition-colors">
                        ← Back to Student Site
                    </a>
                </div>
            </div>
        </div>
    );
};

export default AdminLoginPage;