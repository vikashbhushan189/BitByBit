import React, { useState } from 'react';
import api from '../api/axios';
import { Mail, ArrowLeft, Send } from 'lucide-react';
import { Link } from 'react-router-dom';

const ForgotPasswordPage = () => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(null);
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setMessage(null);

        try {
            await api.post('auth/users/reset_password/', { email });
            setMessage("If an account exists with this email, we have sent you a reset link.");
        } catch (err) {
            console.error(err);
            setError("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
                <Link to="/login" className="flex items-center text-gray-500 hover:text-blue-600 mb-6 transition-colors">
                    <ArrowLeft size={18} className="mr-2" /> Back to Login
                </Link>
                
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Forgot Password?</h2>
                <p className="text-gray-500 mb-8">Enter your email address and we'll send you a link to reset your password.</p>

                {message && (
                    <div className="bg-green-50 text-green-700 p-4 rounded-lg mb-6 text-sm border border-green-200">
                        {message}
                    </div>
                )}

                {error && (
                    <div className="bg-red-50 text-red-700 p-4 rounded-lg mb-6 text-sm border border-red-200">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-3.5 text-gray-400 w-5 h-5" />
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                placeholder="name@example.com"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-bold transition-all disabled:opacity-70 flex justify-center items-center gap-2"
                    >
                        {loading ? "Sending..." : <>Send Reset Link <Send size={18}/></>}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ForgotPasswordPage;