import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { BookOpen, ChevronRight, GraduationCap } from 'lucide-react';

const CourseList = () => {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get('courses/')
            .then(res => {
                setCourses(res.data);
                setLoading(false);
            })
            .catch(err => {
                console.error("Error fetching courses:", err);
                setLoading(false);
            });
    }, []);

    if (loading) return <div className="p-10 text-center text-blue-600">Loading your courses...</div>;

    return (
        <div className="max-w-6xl mx-auto p-6">
            <header className="mb-10 text-center">
                <h1 className="text-4xl font-extrabold text-blue-900 flex items-center justify-center gap-3">
                    <GraduationCap size={40} />
                    Bit by Bit
                </h1>
                <p className="text-gray-600 mt-2 text-lg">Master your exams one topic at a time.</p>
            </header>

            <div className="grid gap-8 md:grid-cols-1">
                {courses.map(course => (
                    <div key={course.id} className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
                        {/* Course Header */}
                        <div className="bg-blue-600 p-6 text-white">
                            <h2 className="text-2xl font-bold">{course.title}</h2>
                            <p className="opacity-90 mt-1">{course.description}</p>
                            {course.is_paid && (
                                <span className="inline-block mt-3 bg-yellow-400 text-blue-900 text-xs font-bold px-2 py-1 rounded">
                                    PREMIUM
                                </span>
                            )}
                        </div>

                        {/* Subjects List */}
                        <div className="p-6">
                            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">
                                Syllabus
                            </h3>
                            <div className="space-y-6">
                                {course.subjects && course.subjects.map(subject => (
                                    <div key={subject.id} className="border-l-4 border-blue-100 pl-4">
                                        <h4 className="font-bold text-gray-800 flex items-center gap-2 mb-2">
                                            <BookOpen size={18} className="text-blue-500"/>
                                            {subject.title}
                                        </h4>
                                        
                                        {/* Chapters & Topics */}
                                        <div className="pl-2 space-y-3">
                                            {subject.chapters && subject.chapters.map(chapter => (
                                                <div key={chapter.id}>
                                                    <h5 className="text-sm font-semibold text-gray-600">{chapter.title}</h5>
                                                    <div className="mt-1 space-y-1 pl-2">
                                                        {chapter.topics && chapter.topics.map(topic => (
                                                            <div key={topic.id} className="flex items-center justify-between text-sm group hover:bg-gray-50 p-1 rounded">
                                                                <span className="text-gray-500">{topic.title}</span>
                                                                
                                                                {/* LINK TO EXAM PAGE */}
                                                                {topic.quiz_id ? (
                                                                    <Link 
                                                                        to={`/exam/${topic.quiz_id}`}
                                                                        className="text-xs bg-blue-100 text-blue-700 px-3 py-1 rounded-full hover:bg-blue-600 hover:text-white transition-colors"
                                                                    >
                                                                        Start Quiz
                                                                    </Link>
                                                                ) : (
                                                                    <span className="text-[10px] text-gray-300 italic">No Quiz</span>
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