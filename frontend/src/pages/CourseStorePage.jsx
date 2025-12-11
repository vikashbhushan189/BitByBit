import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, Circle, ShoppingCart, Loader2 } from 'lucide-react';

const CourseStorePage = () => {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedCourseId, setSelectedCourseId] = useState(null);

    useEffect(() => {
        api.get('courses/').then(res => {
                setCourses(res.data);
                setLoading(false);
            }).catch(err => console.error(err));
    }, []);

    if (loading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin text-blue-600"/></div>;

    const paidCourses = courses.filter(c => c.is_paid);
    const freeCourses = courses.filter(c => !c.is_paid);

    const handleEnroll = () => {
        if(!selectedCourseId) return alert("Please select a batch first.");
        
        const isLoggedIn = !!localStorage.getItem('access_token');
        
        if (!isLoggedIn) {
            navigate('/login'); // Send guest to login
        } else {
            // User is logged in -> Proceed to Payment
            alert(`Redirecting to payment for Course ID: ${selectedCourseId} (Payment Gateway integration pending)`);
        }
    };

    return (
        <div className="min-h-screen bg-white font-sans">
            <div className="max-w-2xl mx-auto p-6">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-2xl font-bold text-slate-900">Select your batch</h1>
                    <button onClick={() => window.history.back()} className="text-slate-400 hover:text-slate-600 text-2xl">&times;</button>
                </div>

                {/* Paid Batches Section */}
                <div className="mb-8">
                    <h2 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4">Paid Batches</h2>
                    <div className="space-y-3">
                        {paidCourses.map(course => (
                            <CourseOption 
                                key={course.id} 
                                course={course} 
                                isSelected={selectedCourseId === course.id}
                                onSelect={() => setSelectedCourseId(course.id)}
                            />
                        ))}
                        {paidCourses.length === 0 && <p className="text-slate-400 text-sm italic">No paid batches available.</p>}
                    </div>
                </div>

                {/* Free Batches Section */}
                <div>
                    <h2 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4">Free Batches</h2>
                    <div className="space-y-3">
                        {freeCourses.map(course => (
                            <CourseOption 
                                key={course.id} 
                                course={course} 
                                isSelected={selectedCourseId === course.id}
                                onSelect={() => setSelectedCourseId(course.id)}
                            />
                        ))}
                    </div>
                </div>

                {/* Bottom Action Bar */}
                <div className="fixed bottom-0 left-0 w-full bg-white border-t border-slate-200 p-4 shadow-2xl">
                    <div className="max-w-2xl mx-auto">
                        <button 
                            onClick={handleEnroll}
                            disabled={!selectedCourseId}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-xl font-bold text-lg shadow-lg shadow-blue-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            <ShoppingCart size={20} /> Continue to Enroll
                        </button>
                    </div>
                </div>
                <div className="h-24"></div> {/* Spacer for fixed footer */}
            </div>
        </div>
    );
};

const CourseOption = ({ course, isSelected, onSelect }) => (
    <div 
        onClick={onSelect}
        className={`flex items-start gap-4 p-4 rounded-xl border cursor-pointer transition-all ${isSelected ? 'bg-blue-50 border-blue-500 shadow-sm' : 'bg-white border-slate-100 hover:border-slate-300'}`}
    >
        <div className="mt-1">
            {isSelected 
                ? <CheckCircle className="text-blue-600 fill-blue-100" size={20} /> 
                : <Circle className="text-slate-300" size={20} />
            }
        </div>
        <div>
            <h3 className={`font-bold text-sm ${isSelected ? 'text-blue-800' : 'text-slate-700'}`}>{course.title}</h3>
            <p className="text-xs text-slate-500 mt-1 line-clamp-1">{course.description}</p>
        </div>
    </div>
);

export default CourseStorePage;
