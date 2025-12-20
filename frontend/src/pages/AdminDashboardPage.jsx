import React from 'react';
import { Link } from 'react-router-dom';
import { Wand2, Layout, LogOut, ShieldCheck, UploadCloud, FileText, Megaphone } from 'lucide-react';

const AdminDashboardPage = () => {
    
    const handleLogout = () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user_role');
        window.location.href = '/admin-portal';
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-sans text-slate-900 dark:text-white p-8 transition-colors duration-300">
            <header className="max-w-6xl mx-auto flex justify-between items-center mb-16 border-b border-slate-200 dark:border-slate-800 pb-6">
                <div className="flex items-center gap-3">
                    <div className="bg-purple-600 p-2 rounded-lg text-white shadow-lg"><ShieldCheck size={24}/></div>
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                        Admin<span className="text-purple-600 dark:text-purple-400">Portal</span>
                    </h1>
                </div>
                <button onClick={handleLogout} className="flex items-center gap-2 text-slate-500 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 transition-colors font-medium">
                    <LogOut size={18} /> Logout
                </button>
            </header>

            <div className="max-w-6xl mx-auto grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                
                {/* 1. AI Generator */}
                <Link to="/admin-generator" className="group bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-purple-500 dark:hover:border-purple-500 hover:shadow-xl transition-all">
                    <div className="bg-purple-100 dark:bg-purple-900/30 w-14 h-14 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                        <Wand2 className="text-purple-600 dark:text-purple-400" size={28} />
                    </div>
                    <h2 className="text-xl font-bold mb-2 text-slate-900 dark:text-white">AI Question Generator</h2>
                    <p className="text-slate-500 dark:text-slate-400 text-sm">Generate questions from notes using Gemini AI.</p>
                </Link>

                {/* 2. Bulk Notes Uploader */}
                <Link to="/admin-notes-upload" className="group bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-emerald-500 dark:hover:border-emerald-500 hover:shadow-xl transition-all">
                    <div className="bg-emerald-100 dark:bg-emerald-900/30 w-14 h-14 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                        <UploadCloud className="text-emerald-600 dark:text-emerald-400" size={28} />
                    </div>
                    <h2 className="text-xl font-bold mb-2 text-slate-900 dark:text-white">Bulk Notes Upload</h2>
                    <p className="text-slate-500 dark:text-slate-400 text-sm">Upload CSVs to create courses & notes instantly.</p>
                </Link>

                 {/* 3. Notes Editor */}
                 <Link to="/admin-notes-editor" className="group bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-yellow-500 dark:hover:border-yellow-500 hover:shadow-xl transition-all">
                    <div className="bg-yellow-100 dark:bg-yellow-900/30 w-14 h-14 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                        <FileText className="text-yellow-600 dark:text-yellow-400" size={28} />
                    </div>
                    <h2 className="text-xl font-bold mb-2 text-slate-900 dark:text-white">Edit Notes</h2>
                    <p className="text-slate-500 dark:text-slate-400 text-sm">Manually update content for existing topics.</p>
                </Link>

                {/* 4. Ad Manager */}
                <Link to="/admin-ads" className="group bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-orange-500 dark:hover:border-orange-500 hover:shadow-xl transition-all">
                    <div className="bg-orange-100 dark:bg-orange-900/30 w-14 h-14 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                        <Megaphone className="text-orange-600 dark:text-orange-400" size={28} />
                    </div>
                    <h2 className="text-xl font-bold mb-2 text-slate-900 dark:text-white">Ad Banners</h2>
                    <p className="text-slate-500 dark:text-slate-400 text-sm">Manage sliding promotional banners.</p>
                </Link>

                {/* 5. Live Site */}
                <Link to="/dashboard" className="group bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-blue-500 dark:hover:border-blue-500 hover:shadow-xl transition-all">
                    <div className="bg-blue-100 dark:bg-blue-900/30 w-14 h-14 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                        <Layout className="text-blue-600 dark:text-blue-400" size={28} />
                    </div>
                    <h2 className="text-xl font-bold mb-2 text-slate-900 dark:text-white">View Student App</h2>
                    <p className="text-slate-500 dark:text-slate-400 text-sm">Jump to the student dashboard.</p>
                </Link>

            </div>
        </div>
    );
};

export default AdminDashboardPage;