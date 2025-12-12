import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';
import { ArrowLeft, Lock, Loader2, FileText, AlertTriangle } from 'lucide-react';

const NotesPage = () => {
    const { topicId, chapterId } = useParams(); // Get both potential IDs
    const navigate = useNavigate();
    const [data, setData] = useState(null); // Changed 'topic' to generic 'data'
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchNotes = async () => {
            try {
                // Determine Endpoint based on URL
                const endpoint = chapterId ? `chapters/${chapterId}/` : `topics/${topicId}/`;
                const res = await api.get(endpoint);
                setData(res.data);
            } catch (err) {
                console.error("Notes Error:", err);
                if (err.response && err.response.status === 403) {
                    setError("Access Denied: This is Premium content.");
                } else if (err.response && err.response.status === 404) {
                    setError("Notes not found.");
                } else {
                    setError("Could not load notes. Check your connection.");
                }
            } finally {
                setLoading(false);
            }
        };
        fetchNotes();
    }, [topicId, chapterId]);

    // Security Features (Prevent Copy/Print)
    useEffect(() => {
        const handleContextMenu = (e) => { e.preventDefault(); return false; };
        const handleKeyDown = (e) => {
            if ((e.ctrlKey || e.metaKey) && ['c', 'p', 's', 'u'].includes(e.key.toLowerCase())) {
                e.preventDefault();
                return false;
            }
        };
        document.addEventListener('contextmenu', handleContextMenu);
        document.addEventListener('keydown', handleKeyDown);
        return () => {
            document.removeEventListener('contextmenu', handleContextMenu);
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, []);

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center text-blue-600 font-bold gap-2">
            <Loader2 className="animate-spin"/> Loading Notes...
        </div>
    );

    if (error) return (
        <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
            <div className="bg-red-50 p-6 rounded-full mb-4"><Lock size={48} className="text-red-500" /></div>
            <h2 className="text-2xl font-bold text-slate-800 mb-2">{error}</h2>
            <button onClick={() => navigate(-1)} className="px-6 py-3 bg-slate-900 text-white rounded-lg font-bold hover:bg-slate-800 transition-colors">Go Back</button>
        </div>
    );

    if (!data || !data.study_notes) return (
        <div className="min-h-screen flex flex-col items-center justify-center text-gray-500">
            <FileText size={48} className="mb-4 text-gray-300"/>
            <p>No notes available for this section yet.</p>
            <button onClick={() => navigate(-1)} className="mt-4 text-blue-600 hover:underline">Go Back</button>
        </div>
    );

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col font-sans select-none print:hidden">
            {/* Header */}
            <header className="bg-white border-b px-6 py-4 flex items-center justify-between sticky top-0 z-10">
                <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-slate-600 hover:text-blue-600 font-medium">
                    <ArrowLeft size={20} /> Back
                </button>
                <div className="flex items-center gap-2 text-xs font-bold text-slate-400 bg-slate-100 px-3 py-1 rounded-full uppercase">
                    <Lock size={12} /> Protected Content
                </div>
            </header>

            {/* Content Area */}
            <main className="flex-1 max-w-4xl mx-auto w-full p-6 md:p-10">
                <div className="bg-white p-10 rounded-2xl shadow-sm border border-slate-200 min-h-[80vh]">
                    <h1 className="text-3xl font-extrabold text-slate-900 mb-8 border-b pb-4">
                        {data.title}
                    </h1>
                    
                    <div className="prose prose-blue prose-lg max-w-none text-slate-700">
                        <Markdown remarkPlugins={[remarkGfm, remarkMath]} rehypePlugins={[rehypeKatex]}>
                            {data.study_notes}
                        </Markdown>
                    </div>
                </div>
                
                <p className="text-center text-slate-400 text-xs mt-8 mb-4">
                    &copy; Bit by Bit. Content is secured. ID: {chapterId || topicId}
                </p>
            </main>

            <div className="hidden print:flex fixed inset-0 bg-white items-center justify-center flex-col text-center p-10">
                <AlertTriangle size={64} className="text-red-500 mb-4" />
                <h1 className="text-4xl font-bold text-slate-900 mb-2">Printing Disabled</h1>
            </div>
        </div>
    );
};

export default NotesPage;