import React from 'react';
import { Link } from 'react-router-dom';
import { Wand2, Layout, LogOut, ShieldCheck, ExternalLink } from 'lucide-react';

const AdminDashboardPage = () => {
    
    const handleLogout = () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user_role');
        window.location.href = '/admin-portal';
    };

    return (
        <div className="min-h-screen bg-slate-900 font-sans text-white p-8">
            <header className="max-w-5xl mx-auto flex justify-between items-center mb-16 border-b border-slate-700 pb-6">
                <div className="flex items-center gap-3">
                    <div className="bg-purple-600 p-2 rounded-lg"><ShieldCheck size={24}/></div>
                    <h1 className="text-2xl font-bold tracking-tight">Admin<span className="text-purple-400">Portal</span></h1>
                </div>
                <button onClick={handleLogout} className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
                    <LogOut size={18} /> Logout
                </button>
            </header>

            <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-8">
                {/* Option 1: AI Generator */}
                <Link to="/admin-generator" className="group bg-slate-800 p-8 rounded-2xl border border-slate-700 hover:border-purple-500 hover:bg-slate-800/80 transition-all shadow-xl">
                    <div className="bg-purple-900/50 w-16 h-16 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                        <Wand2 className="text-purple-400" size={32} />
                    </div>
                    <h2 className="text-2xl font-bold mb-3">AI Question Generator</h2>
                    <p className="text-slate-400 leading-relaxed">
                        Generate bulk questions from study notes using Google Gemini. Edit, review, and publish instantly.
                    </p>
                </Link>

                {/* Option 2: Explore Website */}
                <Link to="/courses" className="group bg-slate-800 p-8 rounded-2xl border border-slate-700 hover:border-blue-500 hover:bg-slate-800/80 transition-all shadow-xl">
                    <div className="bg-blue-900/50 w-16 h-16 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                        <Layout className="text-blue-400" size={32} />
                    </div>
                    <h2 className="text-2xl font-bold mb-3">Test Live Website</h2>
                    <p className="text-slate-400 leading-relaxed">
                        Explore the student interface in <strong>God Mode</strong>. Bypass all payments and restrictions to verify content.
                    </p>
                    <div className="mt-4 flex items-center gap-2 text-blue-400 text-sm font-bold">
                        OPEN APP <ExternalLink size={14} />
                    </div>
                </Link>
            </div>
        </div>
    );
};

export default AdminDashboardPage;