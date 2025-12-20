import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { Save, FileText, CheckCircle, Loader2 } from 'lucide-react';

const AdminNotesEditorPage = () => {
    // Data Sources
    const [courses, setCourses] = useState([]);
    const [subjects, setSubjects] = useState([]);
    const [chapters, setChapters] = useState([]);
    
    // Selection State
    const [selectedCourse, setSelectedCourse] = useState('');
    const [selectedSubject, setSelectedSubject] = useState('');
    const [selectedChapter, setSelectedChapter] = useState('');
    
    // Editor State
    const [notesContent, setNotesContent] = useState('');
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState(null);

    // 1. Initial Load (Courses)
    useEffect(() => {
        api.get('courses/').then(res => setCourses(res.data)).catch(console.error);
    }, []);

    // 2. Cascade Filters
    useEffect(() => {
        if (selectedCourse) {
            const course = courses.find(c => c.id === parseInt(selectedCourse));
            setSubjects(course?.subjects || []);
            setSelectedSubject('');
        }
    }, [selectedCourse, courses]);

    useEffect(() => {
        if (selectedSubject) {
            const subject = subjects.find(s => s.id === parseInt(selectedSubject));
            setChapters(subject?.chapters || []);
            setSelectedChapter('');
        }
    }, [selectedSubject, subjects]);

    // 3. Load Notes when Chapter Selected (Now directly from Chapter)
    useEffect(() => {
        if (selectedChapter) {
            setLoading(true);
            api.get(`chapters/${selectedChapter}/`)
                .then(res => {
                    setNotesContent(res.data.study_notes || "");
                    setMessage(null);
                })
                .catch(err => {
                    console.error(err);
                    alert("Failed to load notes.");
                })
                .finally(() => setLoading(false));
        } else {
            setNotesContent('');
        }
    }, [selectedChapter]);

    // 4. Save Changes
    const handleSave = async () => {
        if (!selectedChapter) return;
        setSaving(true);
        setMessage(null);

        try {
            await api.patch(`chapters/${selectedChapter}/`, {
                study_notes: notesContent
            });
            setMessage("Notes updated successfully!");
            setTimeout(() => setMessage(null), 3000);
        } catch (err) {
            console.error(err);
            alert("Failed to save changes.");
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white p-8 font-sans transition-colors duration-300">
            <div className="max-w-5xl mx-auto">
                <h1 className="text-3xl font-bold mb-8 flex items-center gap-3">
                    <FileText className="text-blue-600 dark:text-blue-400"/> Admin Notes Editor
                </h1>

                {/* --- SELECTION PANEL --- */}
                <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm mb-8 grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-2">1. Course</label>
                        <select className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none" 
                            onChange={e => setSelectedCourse(e.target.value)} value={selectedCourse}>
                            <option value="">-- Select Course --</option>
                            {courses.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-2">2. Subject</label>
                        <select className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none" 
                            onChange={e => setSelectedSubject(e.target.value)} value={selectedSubject} disabled={!selectedCourse}>
                            <option value="">-- Select Subject --</option>
                            {subjects.map(s => <option key={s.id} value={s.id}>{s.title}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-2">3. Chapter</label>
                        <select className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none" 
                            onChange={e => setSelectedChapter(e.target.value)} value={selectedChapter} disabled={!selectedSubject}>
                            <option value="">-- Select Chapter --</option>
                            {chapters.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
                        </select>
                    </div>
                </div>

                {/* --- EDITOR AREA --- */}
                {selectedChapter && (
                    <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl relative">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold">Edit Content (Markdown)</h2>
                            {message && (
                                <div className="flex items-center gap-2 text-green-700 dark:text-green-400 text-sm font-bold bg-green-100 dark:bg-green-900/30 px-3 py-1 rounded-full">
                                    <CheckCircle size={16}/> {message}
                                </div>
                            )}
                        </div>

                        {loading ? (
                            <div className="h-64 flex items-center justify-center text-slate-500">
                                <Loader2 className="animate-spin mr-2"/> Fetching notes...
                            </div>
                        ) : (
                            <textarea
                                className="w-full h-[500px] bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg p-4 text-slate-800 dark:text-slate-200 font-mono text-sm leading-relaxed focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none"
                                value={notesContent}
                                onChange={e => setNotesContent(e.target.value)}
                                placeholder="# Add your notes here..."
                            />
                        )}

                        <div className="flex justify-end mt-6">
                            <button 
                                onClick={handleSave}
                                disabled={saving || loading}
                                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-bold transition-all shadow-lg flex items-center gap-2 disabled:opacity-50"
                            >
                                {saving ? <Loader2 className="animate-spin"/> : <Save size={20}/>}
                                Save Changes
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminNotesEditorPage;