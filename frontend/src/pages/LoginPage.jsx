import React, { useState } from 'react';
import api from '../api/axios';
import { useNavigate, Link, useLocation } from 'react-router-dom'; 
import { AlertCircle, LogIn, Lock, User, CheckCircle, Smartphone, ArrowRight, KeyRound, Loader2, AlertTriangle } from 'lucide-react';

const LoginPage = () => {
    const [loginMethod, setLoginMethod] = useState('password'); // 'password' or 'otp'
    const [formData, setFormData] = useState({ username: '', password: '' });
    const [phone, setPhone] = useState('');
    const [otp, setOtp] = useState('');
    const [otpStep, setOtpStep] = useState(1); // 1: Send, 2: Verify
    
    const [error, setError] = useState(''); 
    const [isLoading, setIsLoading] = useState(false);
    
    const navigate = useNavigate();
    const location = useLocation(); 

    // --- PASSWORD LOGIN ---
    const handlePasswordLogin = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            const res = await api.post('auth/jwt/create/', formData);
            handleLoginSuccess(res.data);
        } catch (err) {
            setError("Invalid Username or Password.");
        } finally {
            setIsLoading(false);
        }
    };

    // --- OTP LOGIN ---
    const handleSendOTP = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        try {
            await api.post('auth-otp/send_otp/', { phone });
            setOtpStep(2);
        } catch (err) {
            setError("Failed to send OTP. Check number.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleVerifyOTP = async (force = false) => {
        setIsLoading(true);
        setError('');
        try {
            const res = await api.post('auth-otp/verify_otp/', { 
                phone, otp, force_login: force 
            });
            handleLoginSuccess(res.data);
        } catch (err) {
            if (err.response && err.response.status === 409) {
                // Conflict: Handle force login UI if needed (simplified here)
                if(window.confirm(err.response.data.message)) {
                    handleVerifyOTP(true);
                }
            } else {
                setError("Invalid OTP");
            }
        } finally {
            setIsLoading(false);
        }
    };

    // --- SHARED SUCCESS LOGIC ---
    const handleLoginSuccess = (data) => {
        localStorage.setItem('access_token', data.access);
        localStorage.setItem('refresh_token', data.refresh);
        // Default to student if role not sent (Password login adds it now, OTP adds it)
        localStorage.setItem('user_role', data.role || 'student');

        const from = location.state?.from || '/dashboard';
        window.location.href = from;
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 font-sans">
            <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-gray-100">
                
                <div className="text-center mb-8">
                    <div className="bg-blue-600 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-200">
                        <LogIn className="text-white" size={32} />
                    </div>
                    <h2 className="text-2xl font-black text-slate-800">Welcome Back</h2>
                    <p className="text-slate-500 text-sm mt-2">Login to continue your learning journey.</p>
                </div>

                {/* TOGGLE TABS */}
                <div className="flex bg-slate-100 p-1 rounded-xl mb-8">
                    <button 
                        onClick={() => setLoginMethod('password')}
                        className={`flex-1 py-2 rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-all ${loginMethod === 'password' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                        <KeyRound size={16}/> Password
                    </button>
                    <button 
                        onClick={() => setLoginMethod('otp')}
                        className={`flex-1 py-2 rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-all ${loginMethod === 'otp' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                        <Smartphone size={16}/> OTP
                    </button>
                </div>

                {error && (
                    <div className="mb-6 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg flex items-center gap-3 text-sm animate-pulse">
                        <AlertTriangle size={18} />
                        <span>{error}</span>
                    </div>
                )}

                {/* --- FORM 1: PASSWORD --- */}
                {loginMethod === 'password' && (
                    <form onSubmit={handlePasswordLogin} className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-300">
                        <div className="relative">
                            <User className="absolute left-3 top-3.5 text-gray-400 w-5 h-5" />
                            <input
                                type="text"
                                name="username"
                                placeholder="Username / Email"
                                onChange={(e) => setFormData({...formData, username: e.target.value})}
                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                required
                            />
                        </div>
                        
                        <div className="relative">
                            <Lock className="absolute left-3 top-3.5 text-gray-400 w-5 h-5" />
                            <input
                                type="password"
                                name="password"
                                placeholder="Password"
                                onChange={(e) => setFormData({...formData, password: e.target.value})}
                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                required
                            />
                        </div>

                        <div className="flex justify-end">
                            <Link to="/forgot-password" class="text-sm font-bold text-blue-600 hover:text-blue-500">
                                Forgot password?
                            </Link>
                        </div>

                        <button 
                            type="submit" 
                            disabled={isLoading}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3.5 rounded-xl font-bold shadow-lg shadow-blue-200 transition-all flex justify-center items-center gap-2"
                        >
                            {isLoading ? <Loader2 className="animate-spin"/> : "Secure Login"}
                        </button>
                    </form>
                )}

                {/* --- FORM 2: OTP --- */}
                {loginMethod === 'otp' && (
                    <div className="space-y-5 animate-in fade-in slide-in-from-left-4 duration-300">
                        {otpStep === 1 ? (
                            <form onSubmit={handleSendOTP} className="space-y-5">
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Mobile Number</label>
                                    <input 
                                        type="tel" 
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                        className="w-full p-3.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none font-bold tracking-wider"
                                        placeholder="9876543210"
                                        required
                                    />
                                </div>
                                <button disabled={isLoading} className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3.5 rounded-xl font-bold shadow-lg flex justify-center items-center gap-2">
                                    {isLoading ? <Loader2 className="animate-spin"/> : <>Get OTP <ArrowRight size={20}/></>}
                                </button>
                            </form>
                        ) : (
                            <div className="space-y-5">
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Enter 4-Digit OTP</label>
                                    <input 
                                        type="text" 
                                        value={otp}
                                        onChange={(e) => setOtp(e.target.value)}
                                        className="w-full p-4 rounded-xl border border-blue-500 ring-2 ring-blue-100 text-center text-2xl font-black tracking-[1em]"
                                        placeholder="----"
                                        maxLength={4}
                                        autoFocus
                                    />
                                </div>
                                <button onClick={() => handleVerifyOTP(false)} disabled={isLoading} className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3.5 rounded-xl font-bold shadow-lg flex justify-center items-center gap-2">
                                    {isLoading ? <Loader2 className="animate-spin"/> : "Verify & Login"}
                                </button>
                                <button onClick={() => setOtpStep(1)} className="w-full text-slate-400 text-sm font-medium hover:text-slate-600">Change Number</button>
                            </div>
                        )}
                    </div>
                )}

                <div className="mt-8 text-center text-sm text-gray-500 font-medium">
                    New here? <Link to="/register" className="text-blue-600 font-bold hover:underline">Create an account</Link>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;