import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import { Clock, CheckCircle, XCircle, TrendingUp, BookOpen } from 'lucide-react';

const DashboardPage = () => {
    const [attempts, setAttempts] = useState([]);
    const [stats, setStats] = useState({ total: 0, passed: 0, avgScore: 0 });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get('history/')
            .then(res => {
                const data = res.data;
                setAttempts(data);
                
                // Calculate "Matrices"
                if (data.length > 0) {
                    const passed = data.filter(a => (a.total_score / a.exam_total_marks) >= 0.4).length;
                    const avg = data.reduce((acc, curr) => acc + curr.total_score, 0) / data.length;
                    setStats({ total: data.length, passed, avgScore: Math.round(avg) });
                }
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, []);

    if (loading) return <div className="p-10 text-center">Loading Dashboard...</div>;

    return (
        <div className="max-w-6xl mx-auto p-6">
            <h1 className="text-3xl font-bold text-gray-800 mb-8">My Performance</h1>

            {/* Matrices / Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
                    <div className="bg-blue-100 p-3 rounded-full text-blue-600"><BookOpen /></div>
                    <div>
                        <div className="text-2xl font-bold">{stats.total}</div>
                        <div className="text-gray-500 text-sm">Tests Taken</div>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
                    <div className="bg-green-100 p-3 rounded-full text-green-600"><CheckCircle /></div>
                    <div>
                        <div className="text-2xl font-bold">{stats.passed}</div>
                        <div className="text-gray-500 text-sm">Tests Passed</div>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
                    <div className="bg-purple-100 p-3 rounded-full text-purple-600"><TrendingUp /></div>
                    <div>
                        <div className="text-2xl font-bold">{stats.avgScore}</div>
                        <div className="text-gray-500 text-sm">Avg. Score</div>
                    </div>
                </div>
            </div>

            {/* History Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200 font-bold text-gray-700">Recent Activity</div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
                            <tr>
                                <th className="px-6 py-3">Exam Name</th>
                                <th className="px-6 py-3">Date</th>
                                <th className="px-6 py-3">Score</th>
                                <th className="px-6 py-3">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {attempts.map((attempt) => {
                                const percentage = (attempt.total_score / attempt.exam_total_marks) * 100;
                                const isPass = percentage >= 40;
                                return (
                                    <tr key={attempt.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 font-medium text-gray-900">{attempt.exam_title}</td>
                                        <td className="px-6 py-4 text-gray-500 text-sm">
                                            {new Date(attempt.start_time).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 font-bold text-gray-800">
                                            {attempt.total_score} <span className="text-gray-400 font-normal text-xs">/ {attempt.exam_total_marks}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 rounded text-xs font-bold ${isPass ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                                {isPass ? "PASS" : "FAIL"}
                                            </span>
                                        </td>
                                    </tr>
                                );
                            })}
                            {attempts.length === 0 && (
                                <tr>
                                    <td colSpan="4" className="px-6 py-8 text-center text-gray-500">
                                        No exams taken yet. Go to the <a href="/" className="text-blue-600 hover:underline">Course List</a> to start!
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default DashboardPage;