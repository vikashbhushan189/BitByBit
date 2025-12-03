import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { 
    Clock, CheckCircle, TrendingUp, BookOpen, 
    ChevronRight, GraduationCap, PlayCircle, PlusCircle 
} from 'lucide-react';

const DashboardPage = () => {
    const [enrolledCourses, setEnrolledCourses] = useState([]);
    const [attempts, setAttempts] = useState([]);
    const [stats, setStats] = useState({ total: 0, passed: 0, avgScore: 0 });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // 1. Fetch History
                const histRes = await api.get('history/');
                const histData = histRes.data;
                setAttempts(histData);
                
                // Calculate Stats
                if (histData.length > 0) {
                    const passed = histData.filter(a => (a.total_score / a.exam_total_marks) >= 0.4).length;
                    const avg = histData.reduce((acc, curr) => acc + curr.total_score, 0) / histData.length;
                    setStats({ total: histData.length, passed, avgScore: Math.round(avg) });
                }

                // 2. Fetch Enrolled Courses (NEW)
                const courseRes = await api.get('courses/enrolled/');
                setEnrolledCourses(courseRes.data);

            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) return <div className="min-h-screen flex items-center justify-center text-blue-600 font-bold">Loading Your Dashboard...</div>;

    return (
        <div className="max-w-7xl mx-auto p-6 font-sans text-slate-800">
            {/* Header */}
            <div className="flex justify-between items-center mb-10">
                <div>
                    <h1 className="text-3xl font-extrabold text-slate-900">My Study Zone</h1>
                    <p className="text-slate-500 mt-1">Welcome back! Pick up where you left off.</p>
                </div>
                <Link to="/courses" className="bg-slate-900 text-white px-5 py-2.5 rounded-lg font-bold hover:bg-slate-800 transition-colors flex items-center gap-2 shadow-lg">
                    <PlusCircle size={18} /> Explore New Courses
                </Link>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                <StatCard 
                    icon={<BookOpen className="text-blue-600" />} 
                    bg="bg-blue-50" 
                    value={stats.total} 
                    label="Tests Taken" 
                />
                <StatCard 
                    icon={<CheckCircle className="text-emerald-600" />} 
                    bg="bg-emerald-50" 
                    value={stats.passed} 
                    label="Exams Passed" 
                />
                <StatCard 
                    icon={<TrendingUp className="text-purple-600" />} 
                    bg="bg-purple-50" 
                    value={`${stats.avgScore}`} 
                    label="Average Score" 
                />
            </div>

            {/* --- MY BATCHES (Enrolled Courses) --- */}
            <div className="mb-12">
                <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                    <GraduationCap className="text-blue-600"/> Your Enrolled Batches
                </h2>

                {enrolledCourses.length > 0 ? (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {enrolledCourses.map(course => (
                            <div key={course.id} className="bg-white border border-slate-200 rounded-xl overflow-hidden hover:shadow-md transition-shadow flex flex-col">
                                <div className="h-32 bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white relative">
                                    <h3 className="font-bold text-xl relative z-10">{course.title}</h3>
                                    <BookOpen className="absolute right-[-10px] bottom-[-10px] w-24 h-24 opacity-10 rotate-12" />
                                </div>
                                <div className="p-6 flex-1 flex flex-col">
                                    <p className="text-sm text-slate-500 mb-4 line-clamp-2">{course.description}</p>
                                    
                                    <div className="mt-auto pt-4 border-t border-slate-100">
                                        <Link 
                                            // Since we reuse the CourseList component logic for now, 
                                            // we might want a specific "Study Page". 
                                            // For now, let's link to the Course Browser but filtered.
                                            // Ideally, you'd create a "MyCourseView.jsx" later.
                                            to={`/courses?filter=my`} 
                                            className="w-full bg-blue-50 text-blue-700 py-2 rounded-lg font-bold flex items-center justify-center gap-2 hover:bg-blue-100 transition-colors"
                                        >
                                            <PlayCircle size={18} /> Continue Learning
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-xl p-12 text-center">
                        <div className="bg-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                            <BookOpen className="text-slate-300" size={32} />
                        </div>
                        <h3 className="text-lg font-bold text-slate-700">No Active Batches</h3>
                        <p className="text-slate-500 mb-6">You haven't enrolled in any courses yet.</p>
                        <Link to="/courses" className="inline-flex items-center gap-2 text-blue-600 font-bold hover:underline">
                            Browse Store <ChevronRight size={16} />
                        </Link>
                    </div>
                )}
            </div>

            {/* Recent Activity Table (Simplified) */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-200 font-bold text-slate-700 bg-slate-50/50">
                    Recent Test Activity
                </div>
                {attempts.length > 0 ? (
                    <table className="w-full text-left text-sm">
                        <thead className="text-slate-400 font-medium border-b border-slate-100">
                            <tr>
                                <th className="px-6 py-3">Exam</th>
                                <th className="px-6 py-3">Date</th>
                                <th className="px-6 py-3 text-right">Score</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {attempts.slice(0, 5).map(a => (
                                <tr key={a.id} className="hover:bg-slate-50">
                                    <td className="px-6 py-3 font-medium text-slate-700">{a.exam_title}</td>
                                    <td className="px-6 py-3 text-slate-500">{new Date(a.start_time).toLocaleDateString()}</td>
                                    <td className="px-6 py-3 text-right font-bold text-blue-600">{a.total_score}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <div className="p-6 text-center text-slate-400 italic">No recent activity.</div>
                )}
            </div>
        </div>
    );
};

const StatCard = ({ icon, bg, value, label }) => (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center gap-4 hover:shadow-md transition-shadow">
        <div className={`${bg} p-4 rounded-full`}>{icon}</div>
        <div>
            <div className="text-3xl font-extrabold text-slate-900">{value}</div>
            <div className="text-sm font-semibold text-slate-400 uppercase tracking-wider">{label}</div>
        </div>
    </div>
);

export default DashboardPage;
