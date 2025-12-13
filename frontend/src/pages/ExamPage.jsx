import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import 'katex/dist/katex.min.css';
import Latex from 'react-latex-next';
import { Clock, CheckCircle, ChevronLeft, ChevronRight, AlertCircle, Award, Loader2, Flag, HelpCircle, X, Check } from 'lucide-react';

const ExamPage = () => {
    const { examId } = useParams();
    const navigate = useNavigate();
    
    // --- STATE ---
    const [exam, setExam] = useState(null);
    const [attemptId, setAttemptId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    
    const [currentQIndex, setCurrentQIndex] = useState(0);
    const answersRef = useRef({}); 
    const [answers, setAnswers] = useState({}); 
    const [markedForReview, setMarkedForReview] = useState({});
    
    // PRACTICE MODE STATE
    const [practiceFeedback, setPracticeFeedback] = useState({}); // { qId: { is_correct, correct_option_id, explanation } }
    
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

    // --- 2. TIMER ---
    useEffect(() => {
        if (!timeLeft || result || loading) return;
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
    }, [timeLeft, result, loading]);

    // --- 3. ACTIONS ---
    const handleAnswerSelect = (qId, optId) => {
        // If already checked in practice mode, don't allow changing
        if (practiceFeedback[qId]) return;
        
        const newAnswers = { ...answers, [qId]: optId };
        setAnswers(newAnswers);
        answersRef.current = newAnswers;
    };

    const handleCheckAnswer = async () => {
        const questions = exam?.questions || [];
        const currentQ = questions[currentQIndex];
        const selectedOpt = answers[currentQ.id];
        
        if (!selectedOpt) return alert("Please select an option first.");

        try {
            const res = await api.post(`exams/${examId}/check_answer/`, {
                question_id: currentQ.id,
                option_id: selectedOpt
            });
            
            setPracticeFeedback(prev => ({
                ...prev,
                [currentQ.id]: res.data 
            }));
        } catch (err) {
            console.error(err);
        }
    };

    const handleSubmit = async (autoSubmit = false) => {
        if (!autoSubmit && !window.confirm("Finish Test? This cannot be undone.")) return;
        setSubmitting(true);
        try {
            const res = await api.post(`exams/${examId}/submit_exam/`, {
                attempt_id: attemptId,
                answers: answersRef.current
            });
            setResult(res.data);
        } catch (err) {
            alert("Submission failed.");
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
    if (loading) return <div className="min-h-screen flex items-center justify-center gap-2 text-blue-600 font-bold"><Loader2 className="animate-spin"/> Loading...</div>;
    
    if (result) {
        const total = result.total_marks || 1; 
        const percentage = Math.round((result.score / total) * 100);
        const isPass = percentage >= 40; 
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 font-sans">
                <div className="bg-white p-10 rounded-2xl shadow-xl text-center max-w-md w-full border border-slate-200">
                    <div className={`mb-6 flex justify-center mx-auto w-20 h-20 rounded-full items-center ${isPass ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                        <Award size={40} />
                    </div>
                    <h2 className="text-3xl font-extrabold text-slate-900 mb-2">{isPass ? "Well Done!" : "Keep Practicing"}</h2>
                    <div className="my-8">
                        <div className="text-5xl font-black text-blue-600 mb-2">{result.score} <span className="text-2xl text-slate-400 font-medium">/ {result.total_marks}</span></div>
                    </div>
                    <button onClick={() => navigate('/dashboard')} className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold hover:bg-slate-800 transition-all">Back to Dashboard</button>
                </div>
            </div>
        );
    }

    const questions = exam?.questions || [];
    const currentQ = questions[currentQIndex];
    // FIX: Broader check for Practice Mode (Topic Quiz OR generic Subject Test with low duration)
    // You can adjust this logic if you want ALL tests to have immediate feedback, or just specific types.
    // For now, we trust 'TOPIC_QUIZ'.
    const isPracticeMode = exam?.exam_type === 'TOPIC_QUIZ';
    
    const feedback = practiceFeedback[currentQ.id];
    const isLastQ = currentQIndex === questions.length - 1;

    return (
        <div className="flex flex-col h-screen bg-slate-50 font-sans text-slate-800">
            <header className="h-16 bg-white border-b flex items-center justify-between px-6 shadow-sm z-20">
                <h1 className="font-bold text-lg truncate max-w-xs">{exam.title}</h1>
                <div className={`flex items-center gap-2 font-mono text-xl font-bold px-4 py-1.5 rounded-lg ${timeLeft < 300 ? 'bg-red-50 text-red-600 animate-pulse' : 'bg-slate-100 text-slate-700'}`}>
                    <Clock size={20} /> {formatTime(timeLeft)}
                </div>
                <button onClick={() => handleSubmit(false)} className="bg-green-600 text-white px-5 py-2 rounded-lg font-semibold shadow-sm">Submit</button>
            </header>

            <div className="flex flex-1 overflow-hidden">
                <main className="flex-1 overflow-y-auto p-6 md:p-10 bg-slate-50">
                    <div className="max-w-4xl mx-auto bg-white p-8 rounded-2xl shadow-sm border border-slate-200 min-h-[60vh] flex flex-col">
                        <div className="flex justify-between items-center mb-6 pb-4 border-b border-slate-100">
                            <span className="font-bold text-blue-600">Question {currentQIndex + 1} of {questions.length}</span>
                            <span className="text-xs font-bold bg-gray-100 text-gray-600 px-2 py-1 rounded">+{currentQ.marks} Marks</span>
                        </div>

                        <div className="text-xl text-slate-800 mb-8 leading-relaxed font-medium flex-grow">
                            <Latex>{currentQ.text_content}</Latex>
                        </div>

                        {/* Options */}
                        <div className="grid gap-3">
                            {currentQ.options.map((opt) => {
                                const isSelected = answers[currentQ.id] === opt.id;
                                let borderClass = 'border-gray-100 hover:border-blue-300';
                                let bgClass = 'hover:bg-gray-50';
                                let icon = null;

                                if (feedback) {
                                    if (opt.id === feedback.correct_option_id) {
                                        borderClass = 'border-green-500 bg-green-50 ring-1 ring-green-500';
                                        icon = <CheckCircle size={20} className="text-green-600" />;
                                    } else if (isSelected && !feedback.is_correct) {
                                        borderClass = 'border-red-500 bg-red-50 ring-1 ring-red-500';
                                        icon = <X size={20} className="text-red-600" />;
                                    } else {
                                        borderClass = 'border-gray-100 opacity-50'; // Dim other options
                                    }
                                } else if (isSelected) {
                                    borderClass = 'border-blue-600 bg-blue-50 ring-1 ring-blue-600';
                                }

                                return (
                                    <div 
                                        key={opt.id}
                                        onClick={() => handleAnswerSelect(currentQ.id, opt.id)}
                                        className={`group p-4 border-2 rounded-xl cursor-pointer transition-all flex items-center justify-between ${borderClass} ${bgClass}`}
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${isSelected ? 'border-blue-600' : 'border-gray-300'}`}>
                                                {isSelected && <div className="w-2.5 h-2.5 bg-blue-600 rounded-full" />}
                                            </div>
                                            <span className="text-lg text-slate-700 font-medium"><Latex>{opt.text}</Latex></span>
                                        </div>
                                        {icon}
                                    </div>
                                );
                            })}
                        </div>

                        {/* Explanation Box (Visible after check) */}
                        {feedback && (
                            <div className="mt-8 p-6 bg-blue-50 rounded-xl border border-blue-100 animate-in fade-in slide-in-from-bottom-2">
                                <h4 className="font-bold text-blue-800 mb-2 flex items-center gap-2"><HelpCircle size={18}/> Explanation</h4>
                                <div className="text-blue-900 leading-relaxed text-sm">
                                    <Latex>{feedback.explanation || "No explanation provided for this question."}</Latex>
                                </div>
                            </div>
                        )}
                    </div>
                </main>

                <aside className="w-80 bg-white border-l border-slate-200 hidden lg:flex flex-col p-6">
                    <h3 className="font-bold text-slate-700 mb-4">Question Palette</h3>
                    <div className="grid grid-cols-5 gap-2">
                         {questions.map((q, idx) => (
                            <button
                                key={q.id}
                                onClick={() => setCurrentQIndex(idx)}
                                className={`h-10 w-10 rounded-lg text-sm font-bold shadow-sm transition-all border
                                    ${idx === currentQIndex ? 'ring-2 ring-blue-500 border-transparent' : 'border-gray-200'}
                                    ${answers[q.id] ? 'bg-blue-600 text-white' : 'bg-white text-gray-600'}
                                `}
                            >
                                {idx + 1}
                            </button>
                        ))}
                    </div>
                </aside>
            </div>

            <footer className="h-20 bg-white border-t border-slate-200 px-8 flex items-center justify-between z-20">
                <button onClick={() => setCurrentQIndex(Math.max(0, currentQIndex - 1))} disabled={currentQIndex === 0} className="flex items-center gap-2 px-6 py-3 text-slate-600 hover:bg-slate-100 rounded-xl font-bold disabled:opacity-30">Previous</button>
                
                {/* DYNAMIC ACTION BUTTON */}
                {isPracticeMode && !feedback ? (
                    <button 
                        onClick={handleCheckAnswer}
                        className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-xl font-bold shadow-lg transition-all"
                    >
                        Check Answer
                    </button>
                ) : (
                    <button 
                        onClick={() => {
                            setPracticeFeedback(prev => ({...prev, [currentQ.id]: null})); // Optional: Clear feedback when moving? No, keep it.
                            setCurrentQIndex(Math.min(questions.length - 1, currentQIndex + 1));
                        }}
                        disabled={isLastQ}
                        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-bold shadow-lg transition-all disabled:opacity-50 disabled:shadow-none"
                    >
                        {isLastQ ? "Finish" : "Next"} <ChevronRight size={20} />
                    </button>
                )}
            </footer>
        </div>
    );
};

export default ExamPage;