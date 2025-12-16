import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { useNavigate, Link, useLocation } from 'react-router-dom'; 
import { AlertCircle, LogIn, Lock, User, CheckCircle, Smartphone, ArrowRight, KeyRound, Loader2, AlertTriangle, ShieldAlert } from 'lucide-react';

// --- FIREBASE IMPORTS ---
import { initializeApp } from "firebase/app";
import { getAuth, RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";

// --- CONFIGURATION ---
// 1. To use Real SMS: Replace these with keys from https://console.firebase.google.com/
// 2. To use Mock/Test Mode: Leave these as they are. The app will auto-detect and switch to Mock mode.
const firebaseConfig = {
  apiKey: "AIzaSyDkKhMareDbHJP2wNSY91r1B6LCpJNBYZw",
  authDomain: "bitbybit-c99de.firebaseapp.com",
  projectId: "bitbybit-c99de",
  storageBucket: "bitbybit-c99de.firebasestorage.app",
  messagingSenderId: "486805649744",
  appId: "1:486805649744:web:9a2d0a1b82136bf27a1455",
  measurementId: "G-B9LWQGQ6VP"
};

// Logic to detect if we should use Firebase or Mock Mode
const isFirebaseConfigured = firebaseConfig.apiKey !== "YOUR_API_KEY";

let auth = null;
if (isFirebaseConfigured) {
    try {
        const app = initializeApp(firebaseConfig);
        auth = getAuth(app);
    } catch (e) {
        console.error("Firebase Init Error:", e);
    }
}

const LoginPage = () => {
    const [loginMethod, setLoginMethod] = useState('password'); 
    const [formData, setFormData] = useState({ username: '', password: '' });
    const [phone, setPhone] = useState('');
    const [otp, setOtp] = useState('');
    const [otpStep, setOtpStep] = useState(1); 
    const [confirmationResult, setConfirmationResult] = useState(null);
    
    // UI State
    const [step, setStep] = useState(1); // 1: Login Form, 3: Conflict Modal
    const [isMockMode, setIsMockMode] = useState(!isFirebaseConfigured);
    const [error, setError] = useState(''); 
    const [isLoading, setIsLoading] = useState(false);
    
    const navigate = useNavigate();
    const location = useLocation(); 

    // --- RECAPTCHA SETUP (Only for Real Firebase) ---
    useEffect(() => {
        if (isFirebaseConfigured && !window.recaptchaVerifier && loginMethod === 'otp') {
            try {
                window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
                    'size': 'invisible',
                    'callback': () => { /* reCAPTCHA solved */ }
                });
            } catch (e) {
                console.warn("Recaptcha init failed, falling back to mock mode");
                setIsMockMode(true);
            }
        }
    }, [loginMethod]);


    // --- SHARED LOGIN HANDLER ---
    const handleLoginSuccess = (data) => {
        localStorage.setItem('access_token', data.access);
        localStorage.setItem('refresh_token', data.refresh);
        localStorage.setItem('user_role', data.role || 'student');
        const from = location.state?.from || '/dashboard';
        window.location.href = from;
    };

    const handleConflict = () => {
        setStep(3); // Show Modal
    };

    const confirmForceLogin = () => {
        if (loginMethod === 'password') handlePasswordLogin(null, true);
        else handleVerifyOTP(true);
    };

    // --- PASSWORD LOGIN ---
    const handlePasswordLogin = async (e, force = false) => {
        if (e) e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            // Include force_login flag
            const payload = { ...formData, force_login: force };
            const res = await api.post('auth/jwt/create/', payload);
            handleLoginSuccess(res.data);
        } catch (err) {
            if (err.response && err.response.status === 409) {
                handleConflict();
            } else {
                setError("Invalid Username or Password.");
            }
        } finally {
            setIsLoading(false);
        }
    };

    // --- OTP: SEND ---
    const handleSendOTP = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        
        const phoneNumber = phone.startsWith('+') ? phone : `+91${phone}`;

        if (isMockMode) {
            // --- MOCK FLOW (Backend generates OTP) ---
            try {
                const res = await api.post('auth-otp/send_otp/', { phone: phoneNumber });
                if (res.data.debug_otp) {
                    alert(`🔐 TEST OTP: ${res.data.debug_otp}`); // Show Popup
                    console.log("Mock OTP:", res.data.debug_otp);
                    // In a real app, we don't store OTP on client, but for this mock simulation:
                    // We will trust the backend verify_otp endpoint.
                }
                setOtpStep(2);
            } catch (err) {
                setError("Failed to send Mock OTP. Is Backend running?");
            }
        } else {
            // --- REAL FIREBASE FLOW ---
            try {
                const appVerifier = window.recaptchaVerifier;
                const confirmation = await signInWithPhoneNumber(auth, phoneNumber, appVerifier);
                setConfirmationResult(confirmation);
                setOtpStep(2);
            } catch (err) {
                console.error(err);
                setError(`Firebase Error: ${err.message}. Switching to Mock Mode.`);
                setIsMockMode(true); // Fallback automatically if Firebase fails
            }
        }
        setIsLoading(false);
    };

    // --- OTP: VERIFY ---
    const handleVerifyOTP = async (force = false) => {
        setIsLoading(true);
        setError('');
        try {
            let res;
            if (isMockMode) {
                res = await api.post('auth-otp/verify_otp/', { 
                    phone: phone.startsWith('+') ? phone : `+91${phone}`,
                    otp, 
                    force_login: force 
                });
            } else {
                const result = await confirmationResult.confirm(otp);
                const user = result.user;
                res = await api.post('auth-otp/firebase_exchange/', { 
                    phone: user.phoneNumber, 
                    force_login: force 
                });
            }
            
            handleLoginSuccess(res.data);

        } catch (err) {
            console.error(err);
            if (err.response) {
                if (err.response.status === 409) {
                    // Conflict (Already logged in)
                    if(window.confirm(err.response.data.message)) {
                        handleVerifyOTP(true); 
                    }
                } else if (err.response.status === 404) {
                    // FIX: User not found -> Redirect to Register
                    alert("Account not found! Redirecting to Registration...");
                    navigate('/register', { state: { phone: phone } }); // Pass phone to register page
                } else {
                    setError(err.response.data.error || "Verification Failed");
                }
            } else {
                setError("Network Error");
            }
        } finally {
            setIsLoading(false);
        }
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

                {error && (
                    <div className="mb-6 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg flex items-center gap-3 text-sm animate-pulse">
                        <AlertTriangle size={18} /> <span>{error}</span>
                    </div>
                )}

                {/* STEP 3: CONFLICT MODAL (Override everything else) */}
                {step === 3 ? (
                    <div className="text-center space-y-6 animate-in fade-in zoom-in duration-300">
                        <div className="bg-orange-50 p-4 rounded-xl border border-orange-100 text-orange-800 text-sm">
                            <h4 className="font-bold flex items-center justify-center gap-2 mb-2"><ShieldAlert size={18}/> Device Conflict</h4>
                            <p>You are currently logged in on another device.</p>
                            <p className="mt-2 font-medium">Do you want to logout that device and continue here?</p>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <button onClick={() => { setStep(1); setIsLoading(false); }} className="py-3 rounded-xl border border-slate-200 font-bold text-slate-600 hover:bg-slate-50">Cancel</button>
                            <button onClick={confirmForceLogin} className="py-3 rounded-xl bg-red-600 text-white font-bold hover:bg-red-700 shadow-lg">Yes, Login Here</button>
                        </div>
                    </div>
                ) : (
                    <>
                        {/* TOGGLE TABS */}
                        <div className="flex bg-slate-100 p-1 rounded-xl mb-8">
                            <button onClick={() => setLoginMethod('password')} className={`flex-1 py-2 rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-all ${loginMethod === 'password' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}><KeyRound size={16}/> Password</button>
                            <button onClick={() => setLoginMethod('otp')} className={`flex-1 py-2 rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-all ${loginMethod === 'otp' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}><Smartphone size={16}/> OTP</button>
                        </div>

                        {/* PASSWORD FORM */}
                        {loginMethod === 'password' && (
                            <form onSubmit={(e) => handlePasswordLogin(e, false)} className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-300">
                                <div className="relative">
                                    <User className="absolute left-3 top-3.5 text-gray-400 w-5 h-5" />
                                    <input type="text" name="username" placeholder="Username / Email" onChange={(e) => setFormData({...formData, username: e.target.value})} className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" required />
                                </div>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-3.5 text-gray-400 w-5 h-5" />
                                    <input type="password" name="password" placeholder="Password" onChange={(e) => setFormData({...formData, password: e.target.value})} className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" required />
                                </div>
                                <div className="flex justify-end"><Link to="/forgot-password" class="text-sm font-bold text-blue-600 hover:text-blue-500">Forgot password?</Link></div>
                                <button type="submit" disabled={isLoading} className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3.5 rounded-xl font-bold shadow-lg transition-all flex justify-center items-center gap-2">{isLoading ? <Loader2 className="animate-spin"/> : "Secure Login"}</button>
                            </form>
                        )}

                        {/* OTP FORM */}
                        {loginMethod === 'otp' && (
                            <div className="space-y-5 animate-in fade-in slide-in-from-left-4 duration-300">
                                <div id="recaptcha-container"></div>
                                {otpStep === 1 ? (
                                    <form onSubmit={handleSendOTP} className="space-y-5">
                                        <div>
                                            <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Mobile Number</label>
                                            <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full p-3.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none font-bold tracking-wider" placeholder="9876543210" required />
                                        </div>
                                        <button disabled={isLoading} className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3.5 rounded-xl font-bold shadow-lg flex justify-center items-center gap-2">{isLoading ? <Loader2 className="animate-spin"/> : <>Get OTP <ArrowRight size={20}/></>}</button>
                                    </form>
                                ) : (
                                    <div className="space-y-5">
                                        <div>
                                            <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Enter OTP</label>
                                            <input type="text" value={otp} onChange={(e) => setOtp(e.target.value)} className="w-full p-4 rounded-xl border border-blue-500 ring-2 ring-blue-100 text-center text-2xl font-black tracking-[1em]" placeholder="----" maxLength={6} autoFocus />
                                        </div>
                                        <button onClick={() => handleVerifyOTP(false)} disabled={isLoading} className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3.5 rounded-xl font-bold shadow-lg flex justify-center items-center gap-2">{isLoading ? <Loader2 className="animate-spin"/> : "Verify & Login"}</button>
                                        <button onClick={() => setOtpStep(1)} className="w-full text-slate-400 text-sm font-medium hover:text-slate-600">Change Number</button>
                                    </div>
                                )}
                            </div>
                        )}
                        <div className="mt-8 text-center text-sm text-gray-500 font-medium">New here? <Link to="/register" className="text-blue-600 font-bold hover:underline">Create an account</Link></div>
                    </>
                )}
            </div>
        </div>
    );
};

export default LoginPage;