import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import 'katex/dist/katex.min.css';
import Latex from 'react-latex-next';
import { Clock, CheckCircle, ChevronLeft, ChevronRight, AlertCircle, Award, Loader2, Flag, HelpCircle } from 'lucide-react';

const ExamPage = () => {
    const { examId } = useParams();
    const navigate = useNavigate();
    
    // --- STATE ---
    const [exam, setExam] = useState(null);
    const [attemptId, setAttemptId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    
    const [currentQIndex, setCurrentQIndex] = useState(0);
    const [answers, setAnswers] = useState({}); // { qId: optionId }
    const [markedForReview, setMarkedForReview] = useState({}); // { qId: boolean }
    
    const [timeLeft, setTimeLeft] = useState(0);
    const [result, setResult] = useState(null);

    // --- 1. INITIALIZE ---
    useEffect(() => {
        const initExam = async () => {
            try {
                const examRes = await api.get(`exams/${examId}/`);
                setExam(examRes.data);
                setTimeLeft(examRes.data.duration_minutes * 60);

                const attemptRes = await api.post(`exams/${examId}/start_attempt/`);
                setAttemptId(attemptRes.data.attempt_id);
                setLoading(false);
            } catch (err) {
                console.error("Exam Error:", err);
                alert("Failed to start exam. Please log in.");
                navigate('/login');
            }
        };
        initExam();
    }, [examId, navigate]);

    // --- 2. KEYBOARD NAVIGATION & TIMER ---
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (result || loading) return;
            if (e.key === 'ArrowRight') setCurrentQIndex(prev => Math.min(exam?.questions.length - 1 || 0, prev + 1));
            if (e.key === 'ArrowLeft') setCurrentQIndex(prev => Math.max(0, prev - 1));
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [exam, result, loading]);

    useEffect(() => {
        if (!timeLeft || result) return;
        const timerId = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) {
                    clearInterval(timerId);
                    handleSubmit(true);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
        return () => clearInterval(timerId);
    }, [timeLeft, result]);

    // --- 3. ACTIONS ---
    const toggleReview = (qId) => {
        setMarkedForReview(prev => ({ ...prev, [qId]: !prev[qId] }));
    };

    const handleSubmit = async (autoSubmit = false) => {
        if (!autoSubmit && !window.confirm("Finish Test? This cannot be undone.")) return;
        
        setSubmitting(true);
        try {
            const res = await api.post(`exams/${examId}/submit_exam/`, {
                attempt_id: attemptId,
                answers: answers
            });
            console.log("Submission Result:", res.data); // Debugging
            setResult(res.data);
        } catch (err) {
            console.error("Submit Error:", err);
            alert("Submission failed. Check connection.");
        } finally {
            setSubmitting(false);
        }
    };

    const formatTime = (seconds) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m}:${s < 10 ? '0' : ''}${s}`;
    };

    // --- RENDER ---
    if (loading) return <div className="min-h-screen flex items-center justify-center gap-2 text-blue-600 font-bold"><Loader2 className="animate-spin"/> Loading Exam...</div>;
    
    // Result View
    if (result) {
        // Safety check for division by zero
        const total = result.total_marks || 1; 
        const percentage = Math.round((result.score / total) * 100);

        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 font-sans">
                <div className="bg-white p-10 rounded-2xl shadow-xl text-center max-w-md w-full border border-slate-200">
                    <div className="mb-6 flex justify-center">
                        <div className="bg-yellow-100 p-4 rounded-full">
                            <Award size={48} className="text-yellow-600" />
                        </div>
                    </div>
                    <h2 className="text-3xl font-extrabold text-slate-800 mb-2">Test Complete</h2>
                    
                    <div className="my-8">
                        <div className="text-5xl font-black text-blue-600 mb-2">{result.score} <span className="text-2xl text-slate-400 font-medium">/ {result.total_marks}</span></div>
                        <div className="inline-block bg-slate-100 px-3 py-1 rounded-full text-xs font-bold text-slate-500 uppercase tracking-wider">
                            Score Summary
                        </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 mb-8">
                        <div className="bg-green-50 p-4 rounded-xl border border-green-100">
                            <div className="text-2xl font-bold text-green-700">{percentage}%</div>
                            <div className="text-xs text-green-600 font-bold uppercase">Percentage</div>
                        </div>
                        <div className="bg-purple-50 p-4 rounded-xl border border-purple-100">
                            <div className="text-2xl font-bold text-purple-700">{result.status || "Done"}</div>
                            <div className="text-xs text-purple-600 font-bold uppercase">Status</div>
                        </div>
                    </div>

                    <button 
                        onClick={() => navigate('/')} 
                        className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold hover:bg-slate-800 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                    >
                        Back to Dashboard
                    </button>
                </div>
            </div>
        );
    }

    const questions = exam?.questions || [];
    const currentQ = questions[currentQIndex];
    const isLastQ = currentQIndex === questions.length - 1;

    return (
        <div className="flex flex-col h-screen bg-slate-50 font-sans text-slate-800">
            {/* Header */}
            <header className="h-16 bg-white border-b flex items-center justify-between px-6 shadow-sm z-20">
                <h1 className="font-bold text-lg truncate max-w-xs">{exam.title}</h1>
                <div className={`flex items-center gap-2 font-mono text-xl font-bold px-4 py-1.5 rounded-lg ${timeLeft < 300 ? 'bg-red-50 text-red-600 animate-pulse' : 'bg-slate-100 text-slate-700'}`}>
                    <Clock size={20} /> {formatTime(timeLeft)}
                </div>
            </header>

            <div className="flex flex-1 overflow-hidden">
                {/* Main Content */}
                <main className="flex-1 overflow-y-auto p-4 md:p-8">
                    <div className="max-w-4xl mx-auto bg-white p-8 rounded-2xl shadow-sm border border-slate-200 min-h-[60vh] flex flex-col">
                        
                        {/* Question Meta */}
                        <div className="flex justify-between items-center mb-6 pb-4 border-b border-slate-100">
                            <span className="font-bold text-slate-500 text-sm">Question {currentQIndex + 1} of {questions.length}</span>
                            <div className="flex gap-2">
                                <span className="text-xs font-bold bg-green-50 text-green-700 px-2 py-1 rounded">+{currentQ.marks}</span>
                                <span className="text-xs font-bold bg-red-50 text-red-700 px-2 py-1 rounded">-{currentQ.marks * (exam.negative_marking_ratio || 0.25)}</span>
                            </div>
                        </div>

                        {/* Question Text */}
                        <div className="text-xl text-slate-800 mb-8 leading-relaxed font-medium flex-grow">
                            <Latex>{currentQ.text_content}</Latex>
                        </div>

                        {/* Options */}
                        <div className="grid gap-3">
                            {currentQ.options.map((opt) => {
                                const isSelected = answers[currentQ.id] === opt.id;
                                return (
                                    <div 
                                        key={opt.id}
                                        onClick={() => setAnswers({...answers, [currentQ.id]: opt.id})}
                                        className={`group p-4 border-2 rounded-xl cursor-pointer transition-all flex items-center gap-4
                                            ${isSelected 
                                                ? 'border-blue-600 bg-blue-50/50 shadow-sm ring-1 ring-blue-600' 
                                                : 'border-slate-200 hover:border-blue-300 hover:bg-slate-50'
                                            }
                                        `}
                                    >
                                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors
                                            ${isSelected ? 'border-blue-600 bg-blue-600' : 'border-slate-300 group-hover:border-blue-400'}
                                        `}>
                                            {isSelected && <div className="w-2.5 h-2.5 bg-white rounded-full" />}
                                        </div>
                                        <span className={`text-lg ${isSelected ? 'text-blue-900 font-semibold' : 'text-slate-600'}`}>
                                            <Latex>{opt.text}</Latex>
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </main>

                {/* Sidebar Palette */}
                <aside className="w-80 bg-white border-l border-slate-200 flex flex-col hidden lg:flex shadow-xl z-10">
                    <div className="p-6 border-b border-slate-100 bg-slate-50/50">
                        <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                            <CheckCircle size={18} className="text-blue-500"/> Question Palette
                        </h3>
                        <div className="grid grid-cols-2 gap-2 text-xs text-slate-500 font-medium">
                            <div className="flex items-center gap-2"><div className="w-3 h-3 bg-green-500 rounded-sm"></div> Answered</div>
                            <div className="flex items-center gap-2"><div className="w-3 h-3 bg-purple-500 rounded-sm"></div> Review</div>
                            <div className="flex items-center gap-2"><div className="w-3 h-3 bg-white border border-slate-300 rounded-sm"></div> Skipped</div>
                            <div className="flex items-center gap-2"><div className="w-3 h-3 border-2 border-blue-500 rounded-sm"></div> Current</div>
                        </div>
                    </div>
                    
                    <div className="flex-1 overflow-y-auto p-6">
                        <div className="grid grid-cols-5 gap-3">
                            {questions.map((q, idx) => {
                                const isAnswered = answers[q.id] !== undefined;
                                const isReview = markedForReview[q.id];
                                const isCurrent = idx === currentQIndex;
                                
                                let bg = "bg-white text-slate-600 hover:bg-slate-100"; // Default
                                if (isAnswered) bg = "bg-green-500 text-white border-green-600";
                                if (isReview) bg = "bg-purple-500 text-white border-purple-600";
                                if (isAnswered && isReview) bg = "bg-purple-600 text-white border-purple-700 ring-2 ring-green-400"; // Review + Answered

                                return (
                                    <button
                                        key={q.id}
                                        onClick={() => setCurrentQIndex(idx)}
                                        className={`h-10 w-10 rounded-lg text-sm font-bold shadow-sm transition-all border border-slate-200
                                            ${bg}
                                            ${isCurrent ? 'ring-2 ring-blue-500 ring-offset-2 z-10' : ''}
                                        `}
                                    >
                                        {idx + 1}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                    
                    <div className="p-6 border-t border-slate-200 bg-slate-50">
                        <button 
                            onClick={() => handleSubmit(false)} 
                            className="w-full bg-slate-900 hover:bg-slate-800 text-white py-3 rounded-xl font-bold shadow-lg shadow-slate-200 transition-all flex items-center justify-center gap-2"
                            disabled={submitting}
                        >
                            {submitting ? <Loader2 className="animate-spin"/> : "Submit Test"}
                        </button>
                    </div>
                </aside>
            </div>

            {/* Footer Navigation */}
            <footer className="h-20 bg-white border-t border-slate-200 px-8 flex items-center justify-between shadow-[0_-4px_20px_-5px_rgba(0,0,0,0.05)] z-20">
                <button 
                    onClick={() => setCurrentQIndex(Math.max(0, currentQIndex - 1))}
                    disabled={currentQIndex === 0}
                    className="flex items-center gap-2 px-6 py-3 text-slate-600 hover:bg-slate-100 rounded-xl font-bold disabled:opacity-30 transition-colors"
                >
                    <ChevronLeft size={20} /> Previous
                </button>

                <div className="flex gap-4">
                    <button 
                        onClick={() => toggleReview(currentQ.id)}
                        className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all border-2
                            ${markedForReview[currentQ.id] 
                                ? 'bg-purple-50 border-purple-200 text-purple-700' 
                                : 'bg-white border-slate-200 text-slate-500 hover:border-purple-200 hover:text-purple-600'}
                        `}
                    >
                        <Flag size={18} fill={markedForReview[currentQ.id] ? "currentColor" : "none"} /> 
                        {markedForReview[currentQ.id] ? "Marked" : "Mark for Review"}
                    </button>

                    <button 
                        onClick={() => setCurrentQIndex(Math.min(questions.length - 1, currentQIndex + 1))}
                        disabled={isLastQ}
                        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-blue-200 transition-all disabled:opacity-50 disabled:shadow-none"
                    >
                        {isLastQ ? "Last Question" : "Save & Next"} <ChevronRight size={20} />
                    </button>
                </div>
            </footer>
        </div>
    );
};

export default ExamPage;
