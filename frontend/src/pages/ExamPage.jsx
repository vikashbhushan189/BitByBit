import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import 'katex/dist/katex.min.css';
import Latex from 'react-latex-next';
import { 
    Clock, CheckCircle, ChevronLeft, ChevronRight, AlertCircle, 
    Award, Loader2, Flag, HelpCircle, X, Check, ShieldAlert, Maximize 
} from 'lucide-react';

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
    
    // Practice Mode State
    const [practiceFeedback, setPracticeFeedback] = useState({});
    
    const [timeLeft, setTimeLeft] = useState(0);
    const [result, setResult] = useState(null);

    // --- PROCTORING STATE ---
    const [isProctored, setIsProctored] = useState(false);
    const violationCountRef = useRef(0); // Ref for immediate access in event listeners
    const [violationCountDisplay, setViolationCountDisplay] = useState(0); // State for UI display
    const [isFullScreen, setIsFullScreen] = useState(true); 
    const [showViolationModal, setShowViolationModal] = useState(false);
    const [violationReason, setViolationReason] = useState("");

    // --- 1. INITIALIZE ---
    useEffect(() => {
        const initExam = async () => {
            try {
                const examRes = await api.get(`exams/${examId}/`);
                setExam(examRes.data);
                
                // --- PROCTORING CONFIG ---
                // Enable for specific types OR all types. 
                // Removed 'TOPIC_QUIZ' from exclusion to test proctoring easily.
                // You can add it back if needed: !['TOPIC_QUIZ'].includes(type)
                const shouldProctor = true; 
                setIsProctored(shouldProctor);

                if (shouldProctor) {
                    setIsFullScreen(false); // Trigger the blocker immediately
                }

                setTimeLeft((examRes.data.duration_minutes || 30) * 60);

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

    // --- 2. SUBMIT LOGIC (Hoisted) ---
    const handleSubmit = async (autoSubmit = false) => {
        if (!autoSubmit && !window.confirm("Finish Test? This cannot be undone.")) return;
        
        // Clean up full screen
        if (document.fullscreenElement) {
            document.exitFullscreen().catch(err => {}); // Ignore error if already exited
        }

        setSubmitting(true);
        try {
            const payload = {
                attempt_id: attemptId,
                answers: answersRef.current
            };
            
            const res = await api.post(`exams/${examId}/submit_exam/`, payload);
            setResult(res.data);
        } catch (err) {
            alert("Submission failed. Check connection.");
        } finally {
            setSubmitting(false);
        }
    };

    // --- 3. PROCTORING LISTENERS ---
    useEffect(() => {
        if (!isProctored || loading || result || submitting) return;

        const triggerViolation = (reason) => {
            if (violationCountRef.current >= 4) return; // Already maxed out

            violationCountRef.current += 1;
            setViolationCountDisplay(violationCountRef.current);
            setViolationReason(reason);

            if (violationCountRef.current >= 4) {
                alert("Maximum violations reached (4/4). The test is auto-submitting.");
                handleSubmit(true);
            } else {
                setShowViolationModal(true);
            }
        };

        // A. Tab Switching (Standard)
        const handleVisibilityChange = () => {
            if (document.hidden) {
                triggerViolation("Tab switching is not allowed.");
            }
        };

        // B. Full Screen Exit (Robust)
        const handleFullScreenChange = () => {
            if (!document.fullscreenElement) {
                setIsFullScreen(false);
                // Note: We don't trigger a violation count here immediately,
                // we just show the blocker screen which forces them back.
            } else {
                setIsFullScreen(true);
            }
        };

        // C. Window Blur (Alt-Tab / Clicking outside)
        const handleWindowBlur = () => {
            // Only trigger if we are supposed to be in the exam
            if (document.fullscreenElement) {
                 triggerViolation("You moved away from the exam window.");
            }
        };

        // D. Disable Right Click
        const handleContextMenu = (e) => e.preventDefault();

        // Attach
        document.addEventListener("visibilitychange", handleVisibilityChange);
        document.addEventListener("fullscreenchange", handleFullScreenChange);
        window.addEventListener("blur", handleWindowBlur);
        document.addEventListener("contextmenu", handleContextMenu);

        // Cleanup
        return () => {
            document.removeEventListener("visibilitychange", handleVisibilityChange);
            document.removeEventListener("fullscreenchange", handleFullScreenChange);
            window.removeEventListener("blur", handleWindowBlur);
            document.removeEventListener("contextmenu", handleContextMenu);
        };
    }, [isProctored, loading, result, submitting]);

    const enterFullScreen = () => {
        const elem = document.documentElement;
        if (elem.requestFullscreen) {
            elem.requestFullscreen().then(() => setIsFullScreen(true)).catch(err => console.log(err));
        }
    };

    // --- 4. TIMER ---
    useEffect(() => {
        if (!timeLeft || result || loading) return;
        
        // Pause timer visual if user is blocked (optional choice)
        // keeping it running adds pressure to return
        
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

    // --- 5. HELPERS ---
    const handleAnswerSelect = (qId, optId) => {
        if (practiceFeedback[qId]) return;
        const newAnswers = { ...answers, [qId]: optId };
        setAnswers(newAnswers);
        answersRef.current = newAnswers;
    };

    const handleCheckAnswer = async (qId) => {
        const selectedOpt = answers[qId];
        if (!selectedOpt) return alert("Please select an option first.");

        try {
            const res = await api.post(`exams/${examId}/check_answer/`, {
                question_id: qId,
                option_id: selectedOpt
            });
            setPracticeFeedback(prev => ({ ...prev, [qId]: res.data }));
        } catch (err) { console.error(err); }
    };

    const formatTime = (seconds) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m}:${s < 10 ? '0' : ''}${s}`;
    };

    // --- RENDER STATES ---
    
    if (loading) return <div className="min-h-screen flex items-center justify-center gap-2 text-blue-600 font-bold"><Loader2 className="animate-spin"/> Loading Exam...</div>;
    
    // 1. PROCTORING: FULL SCREEN BLOCKER (High Z-Index)
    if (isProctored && !isFullScreen && !result) {
        return (
            <div className="fixed inset-0 z-[100] bg-slate-950 flex flex-col items-center justify-center text-white p-6 text-center">
                <ShieldAlert size={80} className="text-red-500 mb-6 animate-pulse" />
                <h2 className="text-3xl font-bold mb-4">Exam Paused</h2>
                <p className="text-slate-300 max-w-md mb-8 text-lg leading-relaxed">
                    You have exited Full Screen mode. <br/>
                    Please return immediately to continue.
                </p>
                <button 
                    onClick={enterFullScreen}
                    className="bg-blue-600 hover:bg-blue-500 text-white px-10 py-4 rounded-xl font-bold text-lg shadow-lg flex items-center gap-3 transition-all hover:scale-105"
                >
                    <Maximize size={24} /> Return to Exam
                </button>
            </div>
        );
    }

    // 2. RESULT VIEW
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
                    <p className="text-slate-500 mb-8">Your exam has been evaluated.</p>
                    <div className="grid grid-cols-2 gap-4 mb-8">
                        <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                            <div className="text-3xl font-black text-blue-700">{result.score}</div>
                            <div className="text-xs font-bold text-blue-400 uppercase tracking-wider">Score</div>
                        </div>
                        <div className="bg-purple-50 p-4 rounded-xl border border-purple-100">
                            <div className="text-3xl font-black text-purple-700">{percentage}%</div>
                            <div className="text-xs font-bold text-purple-400 uppercase tracking-wider">Accuracy</div>
                        </div>
                    </div>
                    <button onClick={() => navigate('/dashboard')} className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold hover:bg-slate-800 transition-all">Back to Dashboard</button>
                </div>
            </div>
        );
    }

    // 3. EXAM INTERFACE
    const questions = exam?.questions || [];
    const currentQ = questions[currentQIndex];
    // Allow check answer if specifically a topic quiz AND we have feedback for it
    // Or if you want "Check Answer" always available for topic quizzes:
    const canCheckAnswer = exam?.exam_type === 'TOPIC_QUIZ';
    
    const feedback = practiceFeedback[currentQ.id];
    const isLastQ = currentQIndex === questions.length - 1;

    return (
        <div className={`flex flex-col h-screen bg-slate-50 font-sans text-slate-800 select-none`}> 
            {/* 'select-none' prevents text highlighting */}
            
            {/* PROCTORING WARNING MODAL */}
            {showViolationModal && (
                <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-red-950/80 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white p-8 rounded-2xl shadow-2xl border-2 border-red-500 max-w-sm text-center">
                        <ShieldAlert size={48} className="text-red-600 mx-auto mb-4" />
                        <h3 className="text-2xl font-black text-red-700 mb-2">Proctoring Warning</h3>
                        <div className="bg-red-50 text-red-800 text-sm p-3 rounded mb-4 font-mono font-bold">
                            Violation {violationCountDisplay}/4
                        </div>
                        <p className="text-slate-600 mb-6">
                            {violationReason || "Suspicious activity detected."} <br/>
                            <strong>The exam will auto-submit on the 4th violation.</strong>
                        </p>
                        <button 
                            onClick={() => setShowViolationModal(false)}
                            className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg font-bold shadow-lg"
                        >
                            I Understand
                        </button>
                    </div>
                </div>
            )}

            {/* HEADER */}
            <header className="h-16 bg-white border-b flex items-center justify-between px-6 shadow-sm z-20">
                <h1 className="font-bold text-lg truncate max-w-xs">{exam.title}</h1>
                <div className={`flex items-center gap-2 font-mono text-xl font-bold px-4 py-1.5 rounded-lg ${timeLeft < 300 ? 'bg-red-50 text-red-600 animate-pulse' : 'bg-slate-100 text-slate-700'}`}>
                    <Clock size={20} /> {formatTime(timeLeft)}
                </div>
                <button onClick={() => handleSubmit(false)} disabled={submitting} className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg font-semibold shadow-sm transition-colors flex items-center gap-2">
                    {submitting && <Loader2 size={16} className="animate-spin"/>} Submit
                </button>
            </header>

            <div className="flex flex-1 overflow-hidden">
                <main className="flex-1 overflow-y-auto p-6 md:p-10 bg-slate-50">
                    <div className="max-w-4xl mx-auto bg-white p-8 rounded-2xl shadow-sm border border-slate-200 min-h-[60vh] flex flex-col">
                        <div className="flex justify-between items-center mb-6 pb-4 border-b border-slate-100">
                            <span className="font-bold text-blue-600">Question {currentQIndex + 1} of {questions.length}</span>
                            <div className="flex gap-2">
                                <span className="text-xs font-bold bg-green-50 text-green-700 px-2 py-1 rounded">+{currentQ.marks}</span>
                                <span className="text-xs font-bold bg-red-50 text-red-700 px-2 py-1 rounded">-{currentQ.marks * (exam.negative_marking_ratio || 0.25)}</span>
                            </div>
                        </div>

                        <div className="text-xl text-slate-800 mb-8 leading-relaxed font-medium flex-grow">
                            <Latex>{currentQ.text_content}</Latex>
                        </div>

                        <div className="grid gap-3">
                            {currentQ.options.map((opt) => {
                                const isSelected = answers[currentQ.id] === opt.id;
                                let borderClass = 'border-gray-100 hover:border-blue-300';
                                if (feedback) {
                                    if (opt.id === feedback.correct_option_id) borderClass = 'border-green-500 bg-green-50 ring-1 ring-green-500';
                                    else if (isSelected && !feedback.is_correct) borderClass = 'border-red-500 bg-red-50 ring-1 ring-red-500';
                                } else if (isSelected) borderClass = 'border-blue-600 bg-blue-50 ring-1 ring-blue-600';

                                return (
                                    <div 
                                        key={opt.id}
                                        onClick={() => handleAnswerSelect(currentQ.id, opt.id)}
                                        className={`group p-4 border-2 rounded-xl cursor-pointer transition-all flex items-center justify-between ${borderClass}`}
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${isSelected ? 'border-blue-600' : 'border-gray-300'}`}>
                                                {isSelected && <div className="w-2.5 h-2.5 bg-blue-600 rounded-full" />}
                                            </div>
                                            <span className="text-lg text-slate-700 font-medium"><Latex>{opt.text}</Latex></span>
                                        </div>
                                        {feedback && opt.id === feedback.correct_option_id && <CheckCircle size={20} className="text-green-600"/>}
                                        {feedback && isSelected && !feedback.is_correct && <X size={20} className="text-red-600"/>}
                                    </div>
                                );
                            })}
                        </div>

                        {feedback && (
                            <div className="mt-8 p-6 bg-blue-50 rounded-xl border border-blue-100 animate-in fade-in slide-in-from-bottom-2">
                                <h4 className="font-bold text-blue-800 mb-2 flex items-center gap-2"><HelpCircle size={18}/> Explanation</h4>
                                <div className="text-blue-900 leading-relaxed text-sm">
                                    <Latex>{feedback.explanation || "No explanation provided."}</Latex>
                                </div>
                            </div>
                        )}
                    </div>
                </main>

                <aside className="w-80 bg-white border-l border-slate-200 hidden lg:flex flex-col p-6">
                    <h3 className="font-bold text-slate-700 mb-4">Question Palette</h3>
                    <div className="grid grid-cols-5 gap-2">
                         {questions.map((q, idx) => {
                            const isAnswered = answers[q.id] !== undefined;
                            const isReview = markedForReview[q.id];
                            const isCurrent = idx === currentQIndex;
                            let bg = "bg-white text-slate-600 hover:bg-slate-100";
                            if (isAnswered) bg = "bg-blue-600 text-white border-blue-600";
                            if (isReview) bg = "bg-purple-500 text-white border-purple-600";
                            return (
                                <button key={q.id} onClick={() => setCurrentQIndex(idx)} className={`h-10 w-10 rounded-lg text-sm font-bold shadow-sm transition-all border ${bg} ${isCurrent ? 'ring-2 ring-blue-500 border-transparent' : 'border-gray-200'}`}>
                                    {idx + 1}
                                </button>
                            );
                         })}
                    </div>
                    {isProctored && (
                        <div className="mt-auto pt-4 border-t border-slate-100">
                             <div className="flex items-center gap-2 text-xs font-bold text-red-500 bg-red-50 p-3 rounded-lg border border-red-100">
                                <ShieldAlert size={16}/> Warnings: {violationCountDisplay}/3
                             </div>
                        </div>
                    )}
                </aside>
            </div>

            <footer className="h-20 bg-white border-t border-slate-200 px-8 flex items-center justify-between z-20">
                <button onClick={() => setCurrentQIndex(Math.max(0, currentQIndex - 1))} disabled={currentQIndex === 0} className="flex items-center gap-2 px-6 py-3 text-slate-600 hover:bg-slate-100 rounded-xl font-bold disabled:opacity-30">Previous</button>
                <div className="flex gap-4">
                    <button onClick={() => toggleReview(currentQ.id)} className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all border-2 ${markedForReview[currentQ.id] ? 'bg-purple-50 border-purple-200 text-purple-700' : 'bg-white border-slate-200 text-slate-500'}`}><Flag size={18}/> Mark</button>
                    
                    {/* CHECK ANSWER BUTTON (Only if Practice Mode) */}
                    {canCheckAnswer && !feedback ? (
                        <button onClick={() => handleCheckAnswer(currentQ.id)} className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-xl font-bold shadow-lg transition-all">Check Answer</button>
                    ) : (
                        <button onClick={() => setCurrentQIndex(Math.min(questions.length - 1, currentQIndex + 1))} disabled={isLastQ} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-bold shadow-lg transition-all disabled:opacity-50">{isLastQ ? "Finish" : "Next"} <ChevronRight size={20} /></button>
                    )}
                </div>
            </footer>
        </div>
    );
};

export default ExamPage;