import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import api from '../api/axios';
import { BookOpen, ChevronRight, ChevronDown, ChevronUp, GraduationCap, FileText, Lock, PlayCircle, AlertCircle } from 'lucide-react';

// --- HELPER COMPONENT FOR CHAPTER ACCORDION ---
const ChapterItem = ({ chapter, mode, isPaid }) => {
    const [isOpen, setIsOpen] = useState(false);
    const hasTopics = chapter.topics && chapter.topics.length > 0;
    const hasNotes = !!chapter.study_notes;
    
    return (
        <div className="border-b border-slate-100 last:border-0">
            <div className="flex items-center justify-between py-3 pr-2">
                <div className="flex items-center gap-3 flex-1">
                    <button 
                        onClick={() => setIsOpen(!isOpen)}
                        className="flex items-center gap-2 text-sm font-bold text-slate-700 hover:text-blue-600 text-left transition-colors"
                    >
                        <span className={`p-1 rounded-md transition-colors ${isOpen ? 'bg-blue-100 text-blue-600' : 'bg-slate-100 text-slate-400'}`}>
                            {isOpen ? <ChevronUp size={14}/> : <ChevronDown size={14}/>}
                        </span>
                        {chapter.title}
                    </button>
                </div>

                <div className="flex items-center gap-2">
                    {/* NOTES BUTTON (Always visible at Chapter level) */}
                    {(mode === 'enrolled' || !isPaid) && hasNotes && (
                        <Link 
                            to={`/chapter/${chapter.id}/notes`}
                            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg hover:bg-emerald-100 transition-all shadow-sm"
                        >
                            <FileText size={14} /> Notes
                        </Link>
                    )}
                </div>
            </div>
            
            {/* DROPDOWN FOR TOPICS/QUIZZES */}
            {isOpen && (
                <div className="pl-9 pb-4 pr-2 space-y-2 animate-in slide-in-from-top-1 duration-200">
                    {hasTopics ? (
                        chapter.topics.map(topic => (
                            <div key={topic.id} className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-100 hover:border-blue-200 transition-colors">
                                <div className="flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-blue-400"></div>
                                    <span className="text-xs font-medium text-slate-600">
                                        {/* If topic name == chapter name, show 'Practice Quiz' instead of repeating name */}
                                        {topic.title === chapter.title ? "Practice Quiz" : topic.title}
                                    </span>
                                </div>
                                
                                {(mode === 'enrolled' || !isPaid) ? (
                                    topic.quiz_id ? (
                                        <Link 
                                            to={`/exam/${topic.quiz_id}`}
                                            className="flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-bold text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-all shadow-sm"
                                        >
                                            Start <ChevronRight size={10} />
                                        </Link>
                                    ) : (
                                        <span className="text-[10px] text-slate-400 italic px-2">No Quiz</span>
                                    )
                                ) : (
                                    <Lock size={12} className="text-slate-400"/>
                                )}
                            </div>
                        ))
                    ) : (
                        <div className="text-xs text-slate-400 italic flex items-center gap-1 pl-2">
                            <AlertCircle size={12}/> No quizzes available yet.
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

const CourseList = () => {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchParams] = useSearchParams();
    const mode = searchParams.get('mode'); 

    useEffect(() => {
        const fetchCourses = async () => {
            setLoading(true);
            try {
                const endpoint = mode === 'enrolled' ? 'courses/enrolled/' : 'courses/';
                const res = await api.get(endpoint);
                setCourses(res.data);
            } catch (err) {
                console.error("Error fetching courses:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchCourses();
    }, [mode]);

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="text-blue-600 font-semibold animate-pulse">Loading content...</div>
        </div>
    );

    if (mode === 'enrolled' && courses.length === 0) {
        return (
            <div className="max-w-4xl mx-auto p-12 text-center mt-10">
                <div className="bg-slate-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-400">
                    <BookOpen size={40} />
                </div>
                <h2 className="text-2xl font-bold text-slate-800 mb-2">No Active Courses</h2>
                <p className="text-slate-500 mb-8">You haven't enrolled in any courses yet.</p>
                <Link to="/store" className="bg-blue-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-blue-700 transition-colors">
                    Browse Store
                </Link>
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto p-6 font-sans">
            <header className="mb-10 text-center">
                <h1 className="text-3xl font-extrabold text-slate-900 flex items-center justify-center gap-3">
                    <GraduationCap size={32} className="text-blue-600" />
                    {mode === 'enrolled' ? 'My Enrolled Courses' : 'Course Library'}
                </h1>
                <p className="text-slate-500 mt-2 text-sm">
                    {mode === 'enrolled' ? 'Resume your learning journey.' : 'Explore structured courses for your exam.'}
                </p>
            </header>

            <div className="space-y-8">
                {courses.map(course => (
                    <div key={course.id} className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                        {/* Course Header */}
                        <div className="bg-slate-900 p-6 text-white flex justify-between items-start">
                            <div>
                                <h2 className="text-xl font-bold">{course.title}</h2>
                                <p className="text-slate-400 text-sm mt-1">{course.description}</p>
                            </div>
                            {/* Badges */}
                            <div className="flex flex-col items-end gap-2">
                                {mode === 'enrolled' ? (
                                    <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-bold px-2 py-1 rounded border border-emerald-500/30">
                                        ACTIVE
                                    </span>
                                ) : course.is_paid ? (
                                    <span className="bg-yellow-500/20 text-yellow-300 text-[10px] font-bold px-2 py-1 rounded border border-yellow-500/30">
                                        PREMIUM
                                    </span>
                                ) : (
                                    <span className="bg-blue-500/20 text-blue-300 text-[10px] font-bold px-2 py-1 rounded border border-blue-500/30">
                                        FREE
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Syllabus Content */}
                        <div className="p-6 bg-slate-50">
                            <div className="space-y-6">
                                {course.subjects && course.subjects.map(subject => (
                                    <div key={subject.id} className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                                        <div className="px-5 py-3 bg-slate-100 border-b border-slate-200 flex items-center justify-between">
                                            <h4 className="font-bold text-slate-700 text-sm flex items-center gap-2">
                                                <BookOpen size={16} className="text-blue-500"/>
                                                {subject.title}
                                            </h4>
                                            {subject.section && subject.section !== 'Main' && (
                                                <span className="text-[10px] font-bold bg-white border border-slate-300 text-slate-500 px-2 py-0.5 rounded">
                                                    {subject.section}
                                                </span>
                                            )}
                                        </div>
                                        
                                        <div className="p-4">
                                            {subject.chapters && subject.chapters.map(chapter => (
                                                <ChapterItem 
                                                    key={chapter.id} 
                                                    chapter={chapter} 
                                                    mode={mode} 
                                                    isPaid={course.is_paid} 
                                                />
                                            ))}
                                            {(!subject.chapters || subject.chapters.length === 0) && (
                                                <p className="text-xs text-slate-400 italic text-center py-2">No chapters added.</p>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CourseList;