import React, { useState } from 'react';
import api from '../api/axios';
import { useNavigate } from 'react-router-dom';
import { ShieldAlert, Lock, User, Loader2, AlertTriangle } from 'lucide-react';

const AdminLoginPage = () => {
    const [formData, setFormData] = useState({ username: '', password: '' });
    const [error, setError] = useState(''); 
    const [isLoading, setIsLoading] = useState(false);
    const [showConflictModal, setShowConflictModal] = useState(false); // New state for conflict
    
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError(''); 
    };

    const handleSubmit = async (e, force = false) => {
        if (e) e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            // 1. Attempt Login (send force_login flag if needed)
            const payload = { ...formData, force_login: force };
            const res = await api.post('auth/jwt/create/', payload);
            const token = res.data.access;

            // 2. Check Role (Double Security)
            // Even though backend serializer returns role, we double check /users/me
            // to ensure is_superuser is true before redirecting to dashboard.
            const userRes = await api.get('auth/users/me/', {
                headers: { Authorization: `JWT ${token}` }
            });

            if (!userRes.data.is_superuser && !userRes.data.is_staff) {
                setError("Access Denied. Admins only.");
                setIsLoading(false);
                return; 
            }

            // 3. Success -> Save & Redirect
            localStorage.setItem('access_token', token);
            localStorage.setItem('refresh_token', res.data.refresh);
            localStorage.setItem('user_role', 'admin');
            
            // Force reload to ensure navbar updates
            window.location.href = '/admin-dashboard';

        } catch (err) {
            console.error("Login Error:", err);
            
            // Handle 409 Conflict (Single Device Enforcement)
            if (err.response && err.response.status === 409) {
                setShowConflictModal(true);
            } else if (err.response && err.response.status === 401) {
                setError("Invalid Admin Credentials.");
            } else {
                setError("Login failed. Check server connection.");
            }
        } finally {
            setIsLoading(false);
        }
    };

    const confirmForceLogin = () => {
        setShowConflictModal(false);
        handleSubmit(null, true); // Call submit again with force=true
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-900 px-4 font-sans">
            
            {/* CONFLICT MODAL */}
            {showConflictModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
                    <div className="bg-slate-800 border border-slate-700 p-8 rounded-2xl shadow-2xl max-w-md w-full text-center">
                        <ShieldAlert size={48} className="text-orange-500 mx-auto mb-4" />
                        <h3 className="text-xl font-bold text-white mb-2">Active Session Detected</h3>
                        <p className="text-slate-400 mb-6 text-sm">
                            You are already logged in on another device. <br/>
                            Do you want to terminate that session and login here?
                        </p>
                        <div className="grid grid-cols-2 gap-4">
                            <button 
                                onClick={() => { setShowConflictModal(false); setIsLoading(false); }}
                                className="py-3 rounded-xl border border-slate-600 text-slate-300 font-bold hover:bg-slate-700 transition-colors"
                            >
                                Cancel
                            </button>
                            <button 
                                onClick={confirmForceLogin}
                                className="py-3 rounded-xl bg-red-600 text-white font-bold hover:bg-red-700 shadow-lg transition-colors"
                            >
                                Yes, Logout Other
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="bg-slate-800 p-10 rounded-3xl shadow-2xl w-full max-w-md border border-slate-700 relative overflow-hidden">
                {/* Decorative Elements */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/20 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none"></div>
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-purple-600/20 rounded-full blur-3xl -ml-10 -mb-10 pointer-events-none"></div>

                <div className="text-center mb-10 relative z-10">
                    <div className="bg-slate-700/50 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-inner border border-slate-600">
                        <ShieldAlert className="text-blue-400" size={40} />
                    </div>
                    <h2 className="text-3xl font-black text-white tracking-tight">Admin Portal</h2>
                    <p className="text-slate-400 text-sm mt-2 font-medium">Restricted Access Area</p>
                </div>

                {error && (
                    <div className="mb-6 bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-xl flex items-center gap-3 text-sm animate-pulse relative z-10">
                        <AlertTriangle size={18} />
                        <span>{error}</span>
                    </div>
                )}

                <form onSubmit={(e) => handleSubmit(e, false)} className="space-y-6 relative z-10">
                    <div className="relative group">
                        <User className="absolute left-4 top-4 text-slate-500 group-focus-within:text-blue-400 transition-colors" size={20} />
                        <input
                            type="text"
                            name="username"
                            placeholder="Admin Username"
                            onChange={handleChange}
                            className="w-full pl-12 pr-4 py-3.5 bg-slate-900/50 border border-slate-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-white placeholder-slate-500 transition-all font-medium"
                            required
                        />
                    </div>
                    
                    <div className="relative group">
                        <Lock className="absolute left-4 top-4 text-slate-500 group-focus-within:text-blue-400 transition-colors" size={20} />
                        <input
                            type="password"
                            name="password"
                            placeholder="Secure Password"
                            onChange={handleChange}
                            className="w-full pl-12 pr-4 py-3.5 bg-slate-900/50 border border-slate-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-white placeholder-slate-500 transition-all font-medium"
                            required
                        />
                    </div>

                    <button 
                        type="submit" 
                        disabled={isLoading}
                        className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white py-4 rounded-xl font-bold shadow-lg shadow-blue-900/20 transition-all transform active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center gap-2 mt-4"
                    >
                        {isLoading ? <Loader2 className="animate-spin"/> : "Authenticate"}
                    </button>
                </form>

                <div className="mt-8 text-center text-xs text-slate-500 relative z-10">
                    <p>Protected by Single Device Enforcement Policy</p>
                </div>
            </div>
        </div>
    );
};

export default AdminLoginPage;