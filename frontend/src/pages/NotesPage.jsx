import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import Markdown from 'react-markdown'; // <--- CHANGED
import remarkGfm from 'remark-gfm';    // <--- CHANGED
import { ArrowLeft, Lock, Loader2, FileText, AlertTriangle } from 'lucide-react';

const NotesPage = () => {
    const { topicId } = useParams();
    const navigate = useNavigate();
    const [topic, setTopic] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get(`topics/${topicId}/`)
            .then(res => {
                setTopic(res.data);
                setLoading(false);
            })
            .catch(err => {
                alert("Could not load notes.");
                navigate('/');
            });
    }, [topicId, navigate]);

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

    if (loading) return <div className="min-h-screen flex items-center justify-center text-blue-600 font-bold"><Loader2 className="animate-spin"/> Loading Notes...</div>;

    if (!topic || !topic.study_notes) return (
        <div className="min-h-screen flex flex-col items-center justify-center text-gray-500">
            <FileText size={48} className="mb-4 text-gray-300"/>
            <p>No study notes available.</p>
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
                        {topic.title}
                    </h1>
                    
                    {/* MARKDOWN RENDERER */}
                    {/* The 'prose' class automatically styles headings, lists, and images */}
                    <div className="prose prose-blue prose-lg max-w-none text-slate-700">
                        <Markdown remarkPlugins={[remarkGfm]}>
                            {topic.study_notes}
                        </Markdown>
                    </div>
                </div>
            </main>

            {/* Print Protection Overlay */}
            <div className="hidden print:flex fixed inset-0 bg-white items-center justify-center flex-col text-center p-10">
                <AlertTriangle size={64} className="text-red-500 mb-4" />
                <h1 className="text-4xl font-bold text-slate-900 mb-2">Printing Disabled</h1>
            </div>
        </div>
    );
};

export default NotesPage;
