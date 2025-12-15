import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import api from '../api/axios';
import { 
    BookOpen, ChevronRight, GraduationCap, FileText, Lock, 
    PlayCircle, AlertCircle, Clock, Zap, BookMarked, Trophy, 
    Layers, ChevronLeft // Added ChevronLeft
} from 'lucide-react';

const CourseCard = ({ course, mode }) => {
    const [activeTab, setActiveTab] = useState('notes'); 
    
    // New State for "Drill Down" Navigation in Notes
    const [selectedSubject, setSelectedSubject] = useState(null);

    const isLocked = !((mode === 'enrolled') || !course.is_paid);

    // --- HELPER TO FORMAT SUBTITLES ---
    const formatSubtitle = (prefix, details) => {
        const parts = [];
        if (prefix) parts.push(prefix);
        if (details.question_count) parts.push(`${details.question_count} Qs`);
        if (details.total_marks) parts.push(`${details.total_marks} Marks`);
        if (details.duration_minutes) parts.push(`${details.duration_minutes} Mins`);
        return parts.join(" • ");
    };

    // --- DATA AGGREGATION (For Quizzes Only) ---
    // Note: Notes data is now handled directly from course.subjects for hierarchy
    
    const chapterQuizData = course.subjects?.flatMap(sub => 
        sub.chapters?.filter(ch => ch.quiz_details).map(ch => ({
            id: ch.quiz_details.id, 
            title: ch.quiz_details.title || ch.title, 
            subtitle: formatSubtitle(sub.title, ch.quiz_details), 
            section: sub.section || "General",
            type: 'quiz', 
            link: `/exam/${ch.quiz_details.id}`
        }))
    ) || [];

    const subjectQuizData = course.subjects?.flatMap(sub => 
        sub.tests?.map(test => ({
            id: test.id, 
            title: test.title, 
            subtitle: formatSubtitle(sub.title, test), 
            section: sub.section || "General",
            type: 'quiz', 
            link: `/exam/${test.id}`
        }))
    ) || [];

    const mockData = course.mocks?.map(m => ({
        id: m.id, 
        title: m.title, 
        subtitle: formatSubtitle("Full Syllabus", m), 
        section: "Full Mock Tests",
        type: 'mock', 
        link: `/exam/${m.id}`
    })) || [];

    const pyqData = course.pyqs?.map(p => ({
        id: p.id, 
        title: p.title, 
        subtitle: formatSubtitle("Previous Year", p), 
        section: "Previous Year Papers",
        type: 'pyq', 
        link: `/exam/${p.id}`
    })) || [];

    // --- RENDERERS ---

    // 1. NOTES VIEW: SUBJECT GRID -> CHAPTER LIST
    const renderNotesView = () => {
        // Filter subjects that actually have notes
        const subjectsWithNotes = course.subjects?.filter(sub => 
            sub.chapters?.some(ch => ch.study_notes)
        ) || [];

        if (subjectsWithNotes.length === 0) return (
            <div className="flex flex-col items-center justify-center py-12 text-slate-400 bg-slate-50/50 rounded-xl border-2 border-dashed border-slate-200">
                <FileText size={40} className="opacity-50"/>
                <p className="mt-2 text-sm font-medium">No notes uploaded yet.</p>
            </div>
        );

        // VIEW 1: CHAPTER LIST (If a subject is selected)
        if (selectedSubject) {
            const chapters = selectedSubject.chapters?.filter(ch => ch.study_notes) || [];
            return (
                <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                    <button 
                        onClick={() => setSelectedSubject(null)}
                        className="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-blue-600 mb-6 transition-colors"
                    >
                        <ChevronLeft size={16}/> Back to Subjects
                    </button>

                    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                        <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
                            <h3 className="font-bold text-slate-800 flex items-center gap-2">
                                <BookOpen size={18} className="text-indigo-600"/>
                                {selectedSubject.title}
                            </h3>
                            <span className="text-xs font-medium text-slate-500 bg-white px-2 py-1 rounded border border-slate-200">
                                {chapters.length} Chapters
                            </span>
                        </div>
                        
                        <div className="divide-y divide-slate-100">
                            {chapters.map((ch) => (
                                <div key={ch.id} className="p-4 flex items-center justify-between hover:bg-blue-50/30 transition-colors group">
                                    <div className="flex items-center gap-4">
                                        <div className="h-8 w-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold text-xs shrink-0">
                                            {ch.order}
                                        </div>
                                        <span className="font-medium text-slate-700 text-sm">{ch.title}</span>
                                    </div>
                                    
                                    {isLocked ? (
                                        <Lock size={16} className="text-slate-400"/>
                                    ) : (
                                        <Link 
                                            to={`/chapter/${ch.id}/notes`}
                                            className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg hover:bg-emerald-600 hover:text-white transition-all shadow-sm"
                                        >
                                            Read <ChevronRight size={14}/>
                                        </Link>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            );
        }

        // VIEW 2: SUBJECT GRID (Default)
        // Group by Section (Paper 1, Computer, etc.)
        const groupedSubjects = subjectsWithNotes.reduce((acc, sub) => {
            const sec = sub.section || "General";
            if (!acc[sec]) acc[sec] = [];
            acc[sec].push(sub);
            return acc;
        }, {});

        return (
            <div className="space-y-8 animate-in fade-in slide-in-from-left-4 duration-300">
                {Object.keys(groupedSubjects).map(section => (
                    <div key={section}>
                         <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                            <Layers size={14} /> {section}
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {groupedSubjects[section].map((sub) => (
                                <div 
                                    key={sub.id} 
                                    onClick={() => setSelectedSubject(sub)}
                                    className="group relative bg-white border border-slate-200 rounded-xl p-5 hover:shadow-lg hover:border-indigo-400 transition-all duration-300 cursor-pointer"
                                >
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="p-3 rounded-lg bg-indigo-50 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                                            <BookOpen size={24}/>
                                        </div>
                                        <div className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-1 rounded border border-slate-200">
                                            {sub.chapters.filter(c => c.study_notes).length} Chaps
                                        </div>
                                    </div>
                                    <h4 className="font-bold text-slate-800 text-sm mb-1 line-clamp-1">{sub.title}</h4>
                                    <p className="text-xs text-slate-400">Click to view chapters</p>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        );
    };

    // 2. QUIZ/MOCK VIEW (Existing Logic)
    const renderContentGrid = (items, emptyMsg, icon) => {
        if (items.length === 0) return (
            <div className="flex flex-col items-center justify-center py-12 text-slate-400 bg-slate-50/50 rounded-xl border-2 border-dashed border-slate-200">
                {icon}
                <p className="mt-2 text-sm font-medium">{emptyMsg}</p>
            </div>
        );

        const groupedItems = items.reduce((acc, item) => {
            const sec = item.section;
            if (!acc[sec]) acc[sec] = [];
            acc[sec].push(item);
            return acc;
        }, {});

        return (
            <div className="space-y-8 animate-in fade-in duration-300">
                {Object.keys(groupedItems).map((sectionTitle) => (
                    <div key={sectionTitle}>
                        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4 flex items-center gap-2 border-b border-slate-200 pb-2">
                            <Layers size={14} /> {sectionTitle}
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {groupedItems[sectionTitle].map((item, idx) => (
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
                                        <button disabled className="w-full py-2 rounded-lg bg-slate-100 text-slate-400 text-xs font-bold cursor-not-allowed">Locked</button>
                                    ) : (
                                        <Link to={item.link} className="block w-full py-2 rounded-lg bg-slate-900 text-white text-xs font-bold text-center group-hover:bg-blue-600 transition-colors">Start Test</Link>
                                    )}
                                </div>
                            ))}
                        </div>
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
                        onClick={() => { setActiveTab(tab.id); setSelectedSubject(null); }} // Reset drill down on tab change
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
                {activeTab === 'notes' && renderNotesView()}
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