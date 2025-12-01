import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import 'katex/dist/katex.min.css';
import Latex from 'react-latex-next';
import { Clock, CheckCircle, ChevronLeft, ChevronRight, AlertCircle, Award, Loader2 } from 'lucide-react';

const ExamPage = () => {
    const { examId } = useParams();
    const navigate = useNavigate();
    
    // --- STATE ---
    const [exam, setExam] = useState(null);
    const [attemptId, setAttemptId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [currentQIndex, setCurrentQIndex] = useState(0);
    const [answers, setAnswers] = useState({}); // { questionId: optionId }
    const [timeLeft, setTimeLeft] = useState(0);
    const [result, setResult] = useState(null); // Stores final score data

    // --- 1. INITIALIZE EXAM ---
    useEffect(() => {
        const initExam = async () => {
            try {
                // 1. Fetch Exam Details
                const examRes = await api.get(`exams/${examId}/`);
                setExam(examRes.data);
                setTimeLeft(examRes.data.duration_minutes * 60);

                // 2. Start Attempt on Backend (Get Attempt ID)
                const attemptRes = await api.post(`exams/${examId}/start_attempt/`);
                setAttemptId(attemptRes.data.attempt_id);
                
                setLoading(false);
            } catch (err) {
                console.error("Exam Start Error:", err);
                alert("Failed to start exam. Please ensure you are logged in.");
                navigate('/login');
            }
        };
        initExam();
    }, [examId, navigate]);

    // --- 2. TIMER LOGIC ---
    useEffect(() => {
        if (!timeLeft || result) return; // Stop timer if time is up or result is shown

        const timerId = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) {
                    clearInterval(timerId);
                    handleSubmit(true); // Auto-submit when time runs out
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timerId);
    }, [timeLeft, result]);

    // --- 3. SUBMIT LOGIC ---
    const handleSubmit = async (autoSubmit = false) => {
        if (!autoSubmit && !window.confirm("Are you sure you want to finish the test?")) return;
        
        setSubmitting(true);
        try {
            const payload = {
                attempt_id: attemptId,
                answers: answers
            };
            // Send answers to backend for scoring
            const res = await api.post(`exams/${examId}/submit_exam/`, payload);
            setResult(res.data); // Save result to state to show Result Screen
        } catch (err) {
            console.error("Submission Error:", err);
            alert("Submission failed. Please check your internet connection.");
        } finally {
            setSubmitting(false);
        }
    };

    // Helper: Format Seconds to MM:SS
    const formatTime = (seconds) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m}:${s < 10 ? '0' : ''}${s}`;
    };

    // --- RENDER STATES ---

    // 1. Loading Screen
    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 text-blue-600 font-semibold gap-2">
            <Loader2 className="animate-spin" /> Preparing your exam environment...
        </div>
    );

    // 2. Result Screen (Shows after submit)
    if (result) {
        const percentage = Math.round((result.score / result.total_marks) * 100);
        const isPass = percentage >= 40; // Assuming 40% passing criteria

        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 font-sans">
                <div className="bg-white p-8 rounded-2xl shadow-xl text-center max-w-md w-full border border-gray-100">
                    <div className={`mb-6 flex justify-center mx-auto w-20 h-20 rounded-full items-center ${isPass ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                        <Award size={40} />
                    </div>
                    
                    <h2 className="text-3xl font-extrabold text-gray-900 mb-2">
                        {isPass ? "Excellent Job!" : "Keep Practicing!"}
                    </h2>
                    <p className="text-gray-500 mb-8">Your exam has been submitted successfully.</p>
                    
                    <div className="grid grid-cols-2 gap-4 mb-8">
                        <div className="bg-blue-50 p-4 rounded-xl">
                            <div className="text-3xl font-bold text-blue-700">{result.score}</div>
                            <div className="text-xs font-bold text-blue-400 uppercase tracking-wider">Score</div>
                        </div>
                        <div className="bg-purple-50 p-4 rounded-xl">
                            <div className="text-3xl font-bold text-purple-700">{percentage}%</div>
                            <div className="text-xs font-bold text-purple-400 uppercase tracking-wider">Accuracy</div>
                        </div>
                    </div>
                    
                    <button 
                        onClick={() => navigate('/')}
                        className="w-full bg-slate-900 text-white py-3.5 rounded-xl font-bold hover:bg-slate-800 transition-colors shadow-lg shadow-slate-200"
                    >
                        Return to Dashboard
                    </button>
                </div>
            </div>
        );
    }

    // 3. Exam Interface
    const questions = exam?.questions || [];
    const currentQ = questions[currentQIndex];

    return (
        <div className="flex flex-col h-screen bg-white font-sans text-slate-800">
            {/* --- HEADER --- */}
            <header className="h-16 border-b flex items-center justify-between px-6 bg-white sticky top-0 z-10">
                <h1 className="font-bold text-lg text-slate-700 truncate w-1/3">{exam.title}</h1>
                
                {/* Timer Display */}
                <div className={`flex items-center gap-2 font-mono text-xl font-bold px-4 py-1.5 rounded-lg border ${timeLeft < 300 ? 'bg-red-50 text-red-600 border-red-100 animate-pulse' : 'bg-slate-50 text-slate-700 border-slate-200'}`}>
                    <Clock size={20} /> {formatTime(timeLeft)}
                </div>

                <button 
                    onClick={() => handleSubmit(false)} 
                    disabled={submitting}
                    className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg font-semibold shadow-sm transition-colors disabled:opacity-50 flex items-center gap-2"
                >
                    {submitting && <Loader2 size={16} className="animate-spin"/>}
                    Submit
                </button>
            </header>

            <div className="flex flex-1 overflow-hidden">
                {/* --- MAIN QUESTION AREA --- */}
                <main className="flex-1 overflow-y-auto p-6 md:p-10 bg-gray-50/30">
                    <div className="max-w-4xl mx-auto bg-white p-8 rounded-2xl shadow-sm border border-gray-100 min-h-[500px]">
                        
                        {/* Question Meta */}
                        <div className="flex justify-between items-center mb-8 pb-4 border-b border-gray-100">
                            <span className="font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full text-sm">
                                Question {currentQIndex + 1} / {questions.length}
                            </span>
                            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                                Marks: +{currentQ.marks}
                            </span>
                        </div>

                        {/* Question Content (Latex Supported) */}
                        <div className="text-xl text-slate-800 mb-10 leading-relaxed font-medium">
                            <Latex>{currentQ.text_content}</Latex>
                        </div>

                        {/* Options Grid */}
                        <div className="grid gap-3">
                            {currentQ.options.map((opt) => {
                                const isSelected = answers[currentQ.id] === opt.id;
                                return (
                                    <div 
                                        key={opt.id}
                                        onClick={() => setAnswers({...answers, [currentQ.id]: opt.id})}
                                        className={`group p-4 border-2 rounded-xl cursor-pointer transition-all flex items-center gap-4 hover:shadow-md
                                            ${isSelected 
                                                ? 'border-blue-600 bg-blue-50/50 shadow-sm' 
                                                : 'border-gray-100 hover:border-blue-200 hover:bg-white'
                                            }
                                        `}
                                    >
                                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors
                                            ${isSelected ? 'border-blue-600 bg-blue-600' : 'border-gray-300 group-hover:border-blue-400'}
                                        `}>
                                            {isSelected && <div className="w-2.5 h-2.5 bg-white rounded-full" />}
                                        </div>
                                        <span className={`text-lg ${isSelected ? 'text-blue-900 font-medium' : 'text-slate-600'}`}>
                                            <Latex>{opt.text}</Latex>
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </main>

                {/* --- SIDEBAR PALETTE --- */}
                <aside className="w-80 border-l bg-white flex flex-col hidden lg:flex">
                    <div className="p-6 border-b">
                        <h3 className="font-bold text-slate-800 flex items-center gap-2">
                            <CheckCircle size={18} className="text-blue-500"/> Question Palette
                        </h3>
                        <div className="flex gap-4 mt-4 text-xs text-gray-500">
                            <div className="flex items-center gap-1"><div className="w-3 h-3 bg-blue-600 rounded"></div> Answered</div>
                            <div className="flex items-center gap-1"><div className="w-3 h-3 border border-gray-300 rounded"></div> Unanswered</div>
                        </div>
                    </div>
                    
                    <div className="flex-1 overflow-y-auto p-6">
                        <div className="grid grid-cols-5 gap-3">
                            {questions.map((q, idx) => {
                                const isAnswered = answers[q.id] !== undefined;
                                const isCurrent = idx === currentQIndex;
                                return (
                                    <button
                                        key={q.id}
                                        onClick={() => setCurrentQIndex(idx)}
                                        className={`h-10 w-10 rounded-lg text-sm font-bold shadow-sm transition-all
                                            ${isCurrent ? 'ring-2 ring-blue-500 ring-offset-1 border-blue-600' : 'border-gray-200 border'}
                                            ${isAnswered ? 'bg-blue-600 text-white border-transparent' : 'bg-white text-gray-500 hover:bg-gray-50'}
                                        `}
                                    >
                                        {idx + 1}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </aside>
            </div>

            {/* --- FOOTER --- */}
            <footer className="h-20 border-t bg-white px-8 flex items-center justify-between shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-20">
                <button 
                    onClick={() => setCurrentQIndex(Math.max(0, currentQIndex - 1))}
                    disabled={currentQIndex === 0}
                    className="flex items-center gap-2 px-6 py-2.5 text-slate-600 hover:bg-slate-100 rounded-lg disabled:opacity-30 disabled:cursor-not-allowed font-medium transition-colors"
                >
                    <ChevronLeft size={20} /> Previous
                </button>
                <button 
                    onClick={() => setCurrentQIndex(Math.min(questions.length - 1, currentQIndex + 1))}
                    className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-8 py-2.5 rounded-lg font-medium shadow-lg shadow-slate-200 transition-all hover:translate-y-[-1px]"
                >
                    Save & Next <ChevronRight size={20} />
                </button>
            </footer>
        </div>
    );
};

export default ExamPage;