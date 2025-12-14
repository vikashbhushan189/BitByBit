import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import api from '../api/axios';
import { 
    BookOpen, ChevronRight, GraduationCap, FileText, Lock, 
    PlayCircle, AlertCircle, Clock, Zap, BookMarked, Trophy 
} from 'lucide-react';

const CourseCard = ({ course, mode }) => {
    const [activeTab, setActiveTab] = useState('notes'); 

    const isLocked = !((mode === 'enrolled') || !course.is_paid);

    // --- HELPER TO FORMAT SUBTITLES ---
    const formatSubtitle = (prefix, details) => {
        const parts = [];
        if (prefix) parts.push(prefix);
        // Only add if value exists to avoid "undefined Qs"
        if (details.question_count) parts.push(`${details.question_count} Qs`);
        if (details.total_marks) parts.push(`${details.total_marks} Marks`);
        if (details.duration_minutes) parts.push(`${details.duration_minutes} Mins`);
        return parts.join(" • ");
    };

    // --- DATA AGGREGATION ---
    
    // 1. Notes
    const notesData = course.subjects?.flatMap(sub => 
        sub.chapters?.filter(ch => ch.study_notes).map(ch => ({
            id: ch.id, 
            title: ch.title, 
            subtitle: sub.title, // Just Subject Name for notes
            type: 'note', 
            link: `/chapter/${ch.id}/notes`
        }))
    ) || [];

    // 2. Chapter Quizzes
    const chapterQuizData = course.subjects?.flatMap(sub => 
        sub.chapters?.filter(ch => ch.quiz_details).map(ch => ({
            id: ch.quiz_details.id, 
            title: ch.quiz_details.title || ch.title, 
            subtitle: formatSubtitle(sub.title, ch.quiz_details), 
            type: 'quiz', 
            link: `/exam/${ch.quiz_details.id}`
        }))
    ) || [];

    // 3. Subject Quizzes
    const subjectQuizData = course.subjects?.flatMap(sub => 
        sub.tests?.map(test => ({
            id: test.id, 
            title: test.title, 
            subtitle: formatSubtitle(sub.title, test), 
            type: 'quiz', 
            link: `/exam/${test.id}`
        }))
    ) || [];

    // 4. Mocks
    const mockData = course.mocks?.map(m => ({
        id: m.id, 
        title: m.title, 
        subtitle: formatSubtitle("Full Syllabus", m), 
        type: 'mock', 
        link: `/exam/${m.id}`
    })) || [];

    // 5. PYQs
    const pyqData = course.pyqs?.map(p => ({
        id: p.id, 
        title: p.title, 
        subtitle: formatSubtitle("Previous Year", p), 
        type: 'pyq', 
        link: `/exam/${p.id}`
    })) || [];

    // --- RENDER HELPERS ---
    const renderContentGrid = (items, emptyMsg, icon) => {
        if (items.length === 0) return (
            <div className="flex flex-col items-center justify-center py-12 text-slate-400 bg-slate-50/50 rounded-xl border-2 border-dashed border-slate-200">
                {icon}
                <p className="mt-2 text-sm font-medium">{emptyMsg}</p>
            </div>
        );

        return (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {items.map((item, idx) => (
                    <div key={idx} className="group relative bg-white border border-slate-200 rounded-xl p-4 hover:shadow-lg hover:border-blue-400 transition-all duration-300">
                        <div className="flex justify-between items-start mb-3">
                            <div className={`p-2 rounded-lg ${item.type === 'note' ? 'bg-emerald-100 text-emerald-600' : 'bg-blue-100 text-blue-600'}`}>
                                {item.type === 'note' ? <FileText size={20}/> : <Clock size={20}/>}
                            </div>
                            {isLocked ? <Lock size={16} className="text-slate-400"/> : <div className="h-2 w-2 rounded-full bg-green-500"></div>}
                        </div>
                        
                        <h4 className="font-bold text-slate-800 text-sm line-clamp-2 mb-1" title={item.title}>{item.title}</h4>
                        <p className="text-xs text-slate-500 font-medium mb-4">{item.subtitle}</p>

                        {isLocked ? (
                            <button disabled className="w-full py-2 rounded-lg bg-slate-100 text-slate-400 text-xs font-bold cursor-not-allowed">
                                Locked
                            </button>
                        ) : (
                            <Link to={item.link} className="block w-full py-2 rounded-lg bg-slate-900 text-white text-xs font-bold text-center group-hover:bg-blue-600 transition-colors">
                                {item.type === 'note' ? 'Read Notes' : 'Start Test'}
                            </Link>
                        )}
                    </div>
                ))}
            </div>
        );
    };

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden mb-10">
            {/* Header */}
            <div className="bg-slate-900 p-6 md:p-8 text-white relative overflow-hidden">
                <div className="relative z-10">
                    <h2 className="text-2xl font-bold">{course.title}</h2>
                    <p className="text-slate-400 text-sm mt-1 max-w-2xl">{course.description}</p>
                </div>
                <BookOpen className="absolute right-[-20px] bottom-[-20px] text-blue-600 opacity-20 w-48 h-48 rotate-12" />
            </div>

            {/* Navigation Tabs */}
            <div className="flex overflow-x-auto border-b border-slate-200 bg-white sticky top-0 z-20 no-scrollbar">
                {[
                    { id: 'notes', label: 'Notes', icon: <BookMarked size={16}/> },
                    { id: 'chapter_quiz', label: 'Chapter Quiz', icon: <Zap size={16}/> },
                    { id: 'subject_quiz', label: 'Subject Quiz', icon: <BookOpen size={16}/> },
                    { id: 'mock', label: 'Full Mock Test', icon: <Trophy size={16}/> },
                    { id: 'pyq', label: 'Full Length PYQs', icon: <Clock size={16}/> },
                ].map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center gap-2 px-6 py-4 text-sm font-bold whitespace-nowrap transition-all border-b-2 
                            ${activeTab === tab.id 
                                ? 'border-blue-600 text-blue-600 bg-blue-50/50' 
                                : 'border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-50'
                            }`}
                    >
                        {tab.icon} {tab.label}
                    </button>
                ))}
            </div>

            {/* Content Area */}
            <div className="p-6 bg-slate-50 min-h-[300px]">
                {activeTab === 'notes' && renderContentGrid(notesData, "No notes uploaded yet.", <FileText size={40} className="opacity-50"/>)}
                {activeTab === 'chapter_quiz' && renderContentGrid(chapterQuizData, "No chapter quizzes available.", <Zap size={40} className="opacity-50"/>)}
                {activeTab === 'subject_quiz' && renderContentGrid(subjectQuizData, "No subject tests added.", <BookOpen size={40} className="opacity-50"/>)}
                {activeTab === 'mock' && renderContentGrid(mockData, "Mock tests coming soon.", <Trophy size={40} className="opacity-50"/>)}
                {activeTab === 'pyq' && renderContentGrid(pyqData, "PYQs will be uploaded shortly.", <Clock size={40} className="opacity-50"/>)}
            </div>
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
            <div className="text-blue-600 font-semibold animate-pulse flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></div>
                Loading content...
            </div>
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
        <div className="max-w-7xl mx-auto p-6 font-sans">
            <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-extrabold text-slate-900 flex items-center gap-3">
                        <GraduationCap size={32} className="text-blue-600" />
                        {mode === 'enrolled' ? 'My Library' : 'All Courses'}
                    </h1>
                    <p className="text-slate-500 mt-2 text-sm">
                        {mode === 'enrolled' ? 'Resume your learning journey.' : 'Explore structured courses for your exam.'}
                    </p>
                </div>
                {mode === 'enrolled' && (
                    <Link to="/courses" className="text-sm font-bold text-blue-600 hover:underline">
                        View Course Catalog &rarr;
                    </Link>
                )}
            </header>

            <div className="space-y-12">
                {courses.map(course => (
                    <CourseCard key={course.id} course={course} mode={mode} />
                ))}
            </div>
        </div>
    );
};

export default CourseList;