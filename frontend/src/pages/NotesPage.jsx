import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import ReactMarkdown from 'react-latex-next'; // Using Latex renderer for text
import 'katex/dist/katex.min.css';
import { ArrowLeft, Lock, Loader2, FileText, AlertTriangle } from 'lucide-react';

const NotesPage = () => {
    const { topicId } = useParams();
    const navigate = useNavigate();
    const [topic, setTopic] = useState(null);
    const [loading, setLoading] = useState(true);

    // 1. Fetch Content
    useEffect(() => {
        api.get(`topics/${topicId}/`)
            .then(res => {
                setTopic(res.data);
                setLoading(false);
            })
            .catch(err => {
                alert("Could not load notes. Please check your connection.");
                navigate('/');
            });
    }, [topicId, navigate]);

    // 2. SECURITY: Disable Right Click & Copy
    useEffect(() => {
        const handleContextMenu = (e) => {
            e.preventDefault();
            return false;
        };

        const handleKeyDown = (e) => {
            // Block Ctrl+C, Ctrl+P, Ctrl+S, Ctrl+U
            if ((e.ctrlKey || e.metaKey) && ['c', 'p', 's', 'u'].includes(e.key.toLowerCase())) {
                e.preventDefault();
                alert("Content is protected. Copying and Printing are disabled.");
                return false;
            }
            // Block PrintScreen (Some browsers allow this check)
            if (e.key === 'PrintScreen') {
                alert("Screenshots are monitored."); // Social engineering deterrent
                navigator.clipboard.writeText(""); // Try to clear clipboard
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
            <p>No study notes available for this topic yet.</p>
            <button onClick={() => navigate(-1)} className="mt-4 text-blue-600 hover:underline">Go Back</button>
        </div>
    );

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col font-sans select-none print:hidden">
            {/* Header */}
            <header className="bg-white border-b px-6 py-4 flex items-center justify-between sticky top-0 z-10 print:hidden">
                <button 
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-slate-600 hover:text-blue-600 font-medium transition-colors"
                >
                    <ArrowLeft size={20} /> Back
                </button>
                <div className="flex items-center gap-2 text-xs font-bold text-slate-400 bg-slate-100 px-3 py-1 rounded-full uppercase tracking-wider">
                    <Lock size={12} /> Protected Content
                </div>
            </header>

            {/* Content Area */}
            <main className="flex-1 max-w-4xl mx-auto w-full p-6 md:p-10">
                <div className="bg-white p-10 rounded-2xl shadow-sm border border-slate-200 min-h-[80vh]">
                    <h1 className="text-3xl font-extrabold text-slate-900 mb-8 border-b pb-4">
                        {topic.title}
                    </h1>
                    
                    {/* The Notes Content */}
                    <div className="prose prose-blue max-w-none text-slate-700 leading-loose">
                        {/* We use Latex component to render Markdown + Math */}
                        <ReactMarkdown>
                            {topic.study_notes}
                        </ReactMarkdown>
                    </div>
                </div>
                
                <p className="text-center text-slate-400 text-xs mt-8 mb-4">
                    &copy; Bit by Bit. Content is watermarked and protected. ID: {topicId}
                </p>
            </main>

            {/* Print Protection Message (Visible only when printing) */}
            <div className="hidden print:flex fixed inset-0 bg-white items-center justify-center flex-col text-center p-10">
                <AlertTriangle size={64} className="text-red-500 mb-4" />
                <h1 className="text-4xl font-bold text-slate-900 mb-2">Printing Disabled</h1>
                <p className="text-xl text-slate-600">This content is protected by copyright laws.</p>
            </div>
        </div>
    );
};

export default NotesPage;