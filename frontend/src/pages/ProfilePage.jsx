import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { User, Mail, Phone, MapPin, Save, Loader2, CheckCircle, AlertCircle, Camera } from 'lucide-react';

const ProfilePage = () => {
    const [user, setUser] = useState({
        first_name: '',
        last_name: '',
        email: '',
        username: '',
        bio: '', // Assuming you might add this later or use a custom field
        phone: ''
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState(null);

    // Fetch User Data
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await api.get('auth/users/me/');
                setUser(res.data);
            } catch (err) {
                console.error("Failed to load profile", err);
                setMessage({ type: 'error', text: "Failed to load profile data." });
            } finally {
                setLoading(false);
            }
        };
        fetchUser();
    }, []);

    const handleChange = (e) => {
        setUser({ ...user, [e.target.name]: e.target.value });
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setSaving(true);
        setMessage(null);

        try {
            // Djoser uses PATCH /auth/users/me/ to update fields
            await api.patch('auth/users/me/', {
                first_name: user.first_name,
                last_name: user.last_name,
                // email: user.email, // Often restricted, uncomment if backend allows
            });
            setMessage({ type: 'success', text: "Profile updated successfully!" });
        } catch (err) {
            console.error(err);
            setMessage({ type: 'error', text: "Failed to update profile." });
        } finally {
            setSaving(false);
        }
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
            <Loader2 className="animate-spin text-blue-600" size={32} />
        </div>
    );

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-sans py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
                
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-black text-slate-900 dark:text-white">My Profile</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-2">Manage your personal information and account settings.</p>
                </div>

                <div className="bg-white dark:bg-slate-900 shadow-xl rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800">
                    
                    {/* Profile Header / Banner */}
                    <div className="h-32 bg-gradient-to-r from-blue-600 to-indigo-600 relative">
                        <div className="absolute -bottom-12 left-8">
                            <div className="relative">
                                <div className="w-24 h-24 rounded-full bg-white dark:bg-slate-800 p-1 shadow-lg">
                                    <div className="w-full h-full rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-2xl font-bold text-slate-500 dark:text-slate-400">
                                        {user.first_name?.[0] || user.username?.[0] || 'U'}
                                    </div>
                                </div>
                                <button className="absolute bottom-0 right-0 p-1.5 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors shadow-sm">
                                    <Camera size={14} />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Form Content */}
                    <div className="pt-16 p-8">
                        {message && (
                            <div className={`mb-6 p-4 rounded-lg flex items-center gap-3 text-sm font-medium ${message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
                                {message.type === 'success' ? <CheckCircle size={18}/> : <AlertCircle size={18}/>}
                                {message.text}
                            </div>
                        )}

                        <form onSubmit={handleSave} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* First Name */}
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-700 dark:text-slate-300">First Name</label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-3 text-slate-400" size={18} />
                                        <input 
                                            type="text" 
                                            name="first_name"
                                            value={user.first_name}
                                            onChange={handleChange}
                                            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all dark:text-white"
                                            placeholder="Enter your first name"
                                        />
                                    </div>
                                </div>

                                {/* Last Name */}
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Last Name</label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-3 text-slate-400" size={18} />
                                        <input 
                                            type="text" 
                                            name="last_name"
                                            value={user.last_name}
                                            onChange={handleChange}
                                            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all dark:text-white"
                                            placeholder="Enter your last name"
                                        />
                                    </div>
                                </div>

                                {/* Email (Read Only usually) */}
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Email Address</label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-3 text-slate-400" size={18} />
                                        <input 
                                            type="email" 
                                            name="email"
                                            value={user.email}
                                            disabled
                                            className="w-full pl-10 pr-4 py-2.5 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-500 cursor-not-allowed"
                                        />
                                    </div>
                                    <p className="text-xs text-slate-400">Email cannot be changed.</p>
                                </div>

                                {/* Username (Read Only) */}
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Username</label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-3 text-slate-400" size={18} />
                                        <input 
                                            type="text" 
                                            value={user.username}
                                            disabled
                                            className="w-full pl-10 pr-4 py-2.5 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-500 cursor-not-allowed"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="pt-6 border-t border-slate-100 dark:border-slate-800 flex justify-end">
                                <button 
                                    type="submit" 
                                    disabled={saving}
                                    className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-blue-500/20 transition-all flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                                >
                                    {saving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                                    Save Changes
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;