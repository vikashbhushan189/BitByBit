import React from 'react';
import { Link } from 'react-router-dom';
import { Wand2, Layout, LogOut, ShieldCheck, ExternalLink, UploadCloud } from 'lucide-react';

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

            <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-6">
                {/* 1. AI Generator */}
                <Link to="/admin-generator" className="group bg-slate-800 p-6 rounded-2xl border border-slate-700 hover:border-purple-500 hover:bg-slate-800/80 transition-all shadow-xl">
                    <div className="bg-purple-900/50 w-14 h-14 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                        <Wand2 className="text-purple-400" size={28} />
                    </div>
                    <h2 className="text-xl font-bold mb-2">AI Question Generator</h2>
                    <p className="text-slate-400 text-sm">Generate questions from notes using Gemini AI.</p>
                </Link>

                {/* 2. Bulk Notes Uploader (NEW) */}
                <Link to="/admin-notes-upload" className="group bg-slate-800 p-6 rounded-2xl border border-slate-700 hover:border-emerald-500 hover:bg-slate-800/80 transition-all shadow-xl">
                    <div className="bg-emerald-900/50 w-14 h-14 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                        <UploadCloud className="text-emerald-400" size={28} />
                    </div>
                    <h2 className="text-xl font-bold mb-2">Bulk Notes Upload</h2>
                    <p className="text-slate-400 text-sm">Upload CSVs to create courses & notes instantly.</p>
                </Link>
                {/* 4. edit notes */}
                <Link to="/admin-notes-editor" className="group bg-slate-800 p-6 rounded-2xl border border-slate-700 hover:border-yellow-500 hover:bg-slate-800/80 transition-all shadow-xl">
                    <div className="bg-yellow-900/50 w-14 h-14 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                        <FileText className="text-yellow-400" size={28} />
                    </div>
                    <h2 className="text-xl font-bold mb-2">Edit Notes</h2>
                    <p className="text-slate-400 text-sm">Manually update content for existing topics.</p>
                </Link>
                {/* 3. Live Site */}
                <Link to="/courses" className="group bg-slate-800 p-6 rounded-2xl border border-slate-700 hover:border-blue-500 hover:bg-slate-800/80 transition-all shadow-xl">
                    <div className="bg-blue-900/50 w-14 h-14 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                        <Layout className="text-blue-400" size={28} />
                    </div>
                    <h2 className="text-xl font-bold mb-2">Test Live Website</h2>
                    <p className="text-slate-400 text-sm">Explore student view in God Mode.</p>
                </Link>
                {/* 4. Ads Banner */}
                <Link to="/admin-ads" className="group bg-slate-800 p-6 rounded-2xl border border-slate-700 hover:border-blue-500 hover:bg-slate-800/80 transition-all shadow-xl">
                    <div className="bg-blue-900/50 w-14 h-14 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                        <Layout className="text-blue-400" size={28} />
                    </div>
                    <h2 className="text-xl font-bold mb-2">Customise Ads Banner</h2>
                    <p className="text-slate-400 text-sm">Set and Customise the ads banner in Landing Page.</p>
                </Link>
            </div>
        </div>
    );
};

export default AdminDashboardPage;