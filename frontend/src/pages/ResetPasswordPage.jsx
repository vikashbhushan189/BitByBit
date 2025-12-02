import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { Lock, CheckCircle, AlertCircle } from 'lucide-react';

const ResetPasswordPage = () => {
    const { uid, token } = useParams();
    const navigate = useNavigate();
    
    const [formData, setFormData] = useState({ new_password: '', re_new_password: '' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (formData.new_password !== formData.re_new_password) {
            setError("Passwords do not match.");
            return;
        }

        setLoading(true);
        setError(null);

        try {
            await api.post('auth/users/reset_password_confirm/', {
                uid,
                token,
                new_password: formData.new_password,
                re_new_password: formData.re_new_password
            });
            alert("Password reset successful! You can now login.");
            navigate('/login');
        } catch (err) {
            console.error(err);
            setError("Invalid or expired link. Please request a new password reset.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
                <div className="text-center mb-8">
                    <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Lock className="text-blue-600" size={28} />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900">Set New Password</h2>
                </div>

                {error && (
                    <div className="bg-red-50 text-red-700 p-4 rounded-lg mb-6 text-sm flex items-center gap-2">
                        <AlertCircle size={16} /> {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <input
                            type="password"
                            required
                            placeholder="New Password"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                            onChange={e => setFormData({...formData, new_password: e.target.value})}
                        />
                    </div>
                    <div>
                        <input
                            type="password"
                            required
                            placeholder="Confirm New Password"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                            onChange={e => setFormData({...formData, re_new_password: e.target.value})}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-bold transition-all disabled:opacity-70"
                    >
                        {loading ? "Resetting..." : "Reset Password"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ResetPasswordPage;