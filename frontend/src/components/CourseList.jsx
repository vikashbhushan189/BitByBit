import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom'; // Added useSearchParams
import api from '../api/axios';
import { BookOpen, ChevronRight, GraduationCap, FileText, Lock } from 'lucide-react';

const CourseList = () => {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchParams] = useSearchParams();
    const mode = searchParams.get('mode'); // 'enrolled' or null

    useEffect(() => {
        const fetchCourses = async () => {
            setLoading(true);
            try {
                // Dynamic Endpoint based on mode
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

    // Empty State for My Courses
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
        <div className="max-w-6xl mx-auto p-6 font-sans">
            <header className="mb-12 text-center">
                <h1 className="text-4xl font-extrabold text-blue-900 flex items-center justify-center gap-3">
                    <GraduationCap size={40} />
                    {mode === 'enrolled' ? 'My Enrolled Courses' : 'Bit by Bit'}
                </h1>
                <p className="text-gray-500 mt-3 text-lg">
                    {mode === 'enrolled' ? 'Resume your learning journey.' : 'Master your exams one topic at a time.'}
                </p>
            </header>

            <div className="grid gap-10 md:grid-cols-1">
                {courses.map(course => (
                    <div key={course.id} className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-shadow">
                        {/* Course Header */}
                        <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-8 text-white relative overflow-hidden">
                            <div className="relative z-10">
                                <h2 className="text-3xl font-bold">{course.title}</h2>
                                <p className="opacity-90 mt-2 text-blue-50 max-w-2xl">{course.description}</p>
                                {/* Show Badge if viewing All Courses */}
                                {!mode && course.is_paid && (
                                    <span className="inline-block mt-4 bg-yellow-400 text-blue-900 text-xs font-bold px-3 py-1 rounded-full shadow-sm">
                                        PREMIUM
                                    </span>
                                )}
                                {/* Show Active Badge if viewing Enrolled */}
                                {mode === 'enrolled' && (
                                    <span className="inline-block mt-4 bg-emerald-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm">
                                        ACTIVE
                                    </span>
                                )}
                            </div>
                            <BookOpen className="absolute right-[-20px] bottom-[-20px] text-blue-500 opacity-20 w-48 h-48 rotate-12" />
                        </div>

                        {/* Syllabus Content */}
                        <div className="p-8 bg-slate-50/50">
                            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6">
                                Course Syllabus
                            </h3>
                            
                            <div className="space-y-8">
                                {course.subjects && course.subjects.map(subject => (
                                    <div key={subject.id} className="bg-white border border-slate-200 rounded-xl overflow-hidden">
                                        <div className="px-6 py-4 bg-slate-100 border-b border-slate-200 flex items-center gap-3">
                                            <div className="bg-blue-100 p-1.5 rounded text-blue-600">
                                                <BookOpen size={18} />
                                            </div>
                                            <h4 className="font-bold text-slate-700">{subject.title}</h4>
                                        </div>
                                        
                                        <div className="p-6 space-y-6">
                                            {subject.chapters && subject.chapters.map(chapter => (
                                                <div key={chapter.id}>
                                                    <h5 className="text-sm font-semibold text-slate-500 mb-3 flex items-center gap-2">
                                                        <span className="w-1.5 h-1.5 bg-slate-300 rounded-full"></span>
                                                        {chapter.title}
                                                    </h5>
                                                    
                                                    <div className="space-y-2 pl-4 border-l-2 border-slate-100">
                                                        {chapter.topics && chapter.topics.map(topic => (
                                                            <div key={topic.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 rounded-lg hover:bg-blue-50 transition-colors group">
                                                                <span className="text-slate-700 font-medium group-hover:text-blue-700 transition-colors mb-2 sm:mb-0">
                                                                    {topic.title}
                                                                </span>
                                                                
                                                                {/* Only show Access Buttons if Enrolled or Course is Free */}
                                                                {(mode === 'enrolled' || !course.is_paid) ? (
                                                                    <div className="flex items-center gap-3">
                                                                        {topic.study_notes && (
                                                                            <Link 
                                                                                to={`/topic/${topic.id}/notes`}
                                                                                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-600 bg-white border border-slate-200 rounded-lg hover:border-blue-300 hover:text-blue-600 transition-all shadow-sm"
                                                                            >
                                                                                <FileText size={14} /> Notes
                                                                            </Link>
                                                                        )}
                                                                        {topic.quiz_id ? (
                                                                            <Link 
                                                                                to={`/exam/${topic.quiz_id}`}
                                                                                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-all shadow-sm hover:shadow-md"
                                                                            >
                                                                                Start Quiz <ChevronRight size={14} />
                                                                            </Link>
                                                                        ) : (
                                                                            <span className="text-[10px] text-slate-300 font-medium italic px-2">No Quiz</span>
                                                                        )}
                                                                    </div>
                                                                ) : (
                                                                    <div className="flex items-center gap-1 text-xs text-slate-400 bg-slate-100 px-2 py-1 rounded">
                                                                        <Lock size={12}/> Locked
                                                                    </div>
                                                                )}
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            ))}
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