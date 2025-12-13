import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { Loader2, Save, Trash2, Plus, Wand2, Clock, FileText, Image as ImageIcon, Layers, UploadCloud, Link as LinkIcon, FileSpreadsheet, Download, RefreshCw, HelpCircle } from 'lucide-react';

const AdminGeneratorPage = () => {
    // ... (Keep existing state variables exactly as they were) ...
    const [courses, setCourses] = useState([]);
    const [subjects, setSubjects] = useState([]);
    const [chapters, setChapters] = useState([]);
    const [exams, setExams] = useState([]);
    
    const [mode, setMode] = useState('text');
    const [scope, setScope] = useState('chapter'); 
    
    const [selectedId, setSelectedId] = useState(''); 
    const [selectedExam, setSelectedExam] = useState('');
    const [newExamTitle, setNewExamTitle] = useState('');
    const [numQ, setNumQ] = useState(5);
    const [difficulty, setDifficulty] = useState('Medium');
    const [customInstructions, setCustomInstructions] = useState('');
    
    const [imageFile, setImageFile] = useState(null);
    const [csvFile, setCsvFile] = useState(null); 
    
    const [generatedQuestions, setGeneratedQuestions] = useState([]);
    const [suggestedDuration, setSuggestedDuration] = useState(0);
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);

    // ... (Keep useEffects for loading data) ...
    useEffect(() => {
        const loadData = async () => {
            try {
                const [cRes, tRes, eRes] = await Promise.all([
                    api.get('courses/'),
                    api.get('topics/'),
                    api.get('exams/')
                ]);
                setCourses(cRes.data);
                const allSubjects = cRes.data.flatMap(c => c.subjects || []);
                setSubjects(allSubjects);
                const allChapters = allSubjects.flatMap(s => s.chapters || []);
                setChapters(allChapters);
                setExams(eRes.data);
            } catch(e) { console.error(e) }
        };
        loadData();
    }, []);

    useEffect(() => {
        setSuggestedDuration(Math.ceil(generatedQuestions.length * 1.5));
    }, [generatedQuestions]);

    // --- HANDLERS ---
    const handleTextGenerate = async () => {
        if (!selectedId) return alert("Please select a source");
        setLoading(true);
        try {
            const res = await api.post('ai-generator/generate/', {
                source_type: scope,
                source_id: selectedId,
                num_questions: numQ,
                difficulty: difficulty,
                custom_instructions: customInstructions
            });
            // Ensure explanation field exists
            const formattedData = res.data.map(q => ({ ...q, image_url: '', explanation: q.explanation || '' }));
            setGeneratedQuestions(prev => [...prev, ...formattedData]);
        } catch (err) {
            alert("Generation failed.");
        } finally {
            setLoading(false);
        }
    };

    const handleImageGenerate = async () => {
        if (!imageFile) return alert("Please upload an image first");
        setLoading(true);
        const formData = new FormData();
        formData.append('image', imageFile);
        formData.append('difficulty', difficulty);
        formData.append('custom_instructions', customInstructions);

        try {
            const res = await api.post('ai-generator/generate_image/', formData);
            const formattedData = res.data.map(q => ({ ...q, image_url: '', explanation: q.explanation || '' }));
            setGeneratedQuestions(prev => [...prev, ...formattedData]);
        } catch (err) {
            alert("Image analysis failed.");
        } finally {
            setLoading(false);
        }
    };

    // ... (Keep csv upload and template download logic) ...
    const downloadCsvTemplate = () => {
        const csvContent = "data:text/csv;charset=utf-8," 
            + "Question Text,Option A,Option B,Option C,Option D,Correct Option,Marks,Explanation\n"
            + "What is RAM?,Read Access Memory,Random Access Memory,Run Access Memory,None,B,2,RAM is volatile memory...";
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "questions_template.csv");
        document.body.appendChild(link);
        link.click();
    };

    const handleCsvUpload = async () => {
        if (!csvFile) return alert("Select a CSV file");
        if (!selectedExam && !newExamTitle) return alert("Select an Exam or Enter a New Title");
        
        setLoading(true);
        const formData = new FormData();
        formData.append('file', csvFile);
        if (selectedExam) formData.append('exam_id', selectedExam);
        if (newExamTitle) formData.append('new_exam_title', newExamTitle);

        try {
            const res = await api.post('ai-generator/upload_questions_csv/', formData);
            alert(`Success! Added ${res.data.added} questions.`);
            setCsvFile(null);
             if (newExamTitle) {
                const eRes = await api.get('exams/');
                setExams(eRes.data);
                setNewExamTitle('');
            }
        } catch (err) {
            alert("CSV Upload failed.");
        } finally {
            setLoading(false);
        }
    };

    const handleLoadExamQuestions = async () => {
        if (!selectedExam) return alert("Select an exam to load.");
        if (generatedQuestions.length > 0 && !window.confirm("Replace current content?")) return;

        setLoading(true);
        try {
            const res = await api.get(`exams/${selectedExam}/`);
            const examData = res.data;
            const loadedQuestions = examData.questions.map(q => {
                const correctIndex = q.options.findIndex(opt => opt.id === q.correct_option_id || opt.is_correct); 
                return {
                    question_text: q.text_content,
                    options: q.options.map(o => o.text),
                    correct_index: correctIndex !== -1 ? correctIndex : 0,
                    marks: q.marks,
                    image_url: '', 
                    explanation: q.explanation || '', // Load existing explanation
                    id: q.id 
                };
            });
            setGeneratedQuestions(loadedQuestions);
            if (examData.duration_minutes) setSuggestedDuration(examData.duration_minutes);
        } catch (err) {
            alert("Failed to load exam.");
        } finally {
            setLoading(false);
        }
    };

    const addManualQuestion = () => {
        setGeneratedQuestions(prev => [
            ...prev,
            {
                question_text: "New Question...",
                options: ["Option A", "Option B", "Option C", "Option D"],
                correct_index: 0,
                marks: 2,
                image_url: '',
                explanation: ''
            }
        ]);
    };

    const handleSave = async () => {
        if (!selectedExam && !newExamTitle) return alert("Select Exam or Enter New Name.");
        if (saving) return;
        
        setSaving(true);
        
        const questionsToSave = generatedQuestions.map(q => {
            let finalContent = q.question_text;
            if (q.image_url) {
                finalContent += `\n\n![Diagram](${q.image_url})`;
            }
            return { 
                ...q, 
                question_text: finalContent,
                explanation: q.explanation // Ensure explanation is sent
            };
        });

        try {
            const res = await api.post('ai-generator/save_bulk/', {
                exam_id: selectedExam || null,
                new_exam_title: newExamTitle || null,
                source_type: scope,
                source_id: selectedId,
                questions: questionsToSave,
                duration: suggestedDuration
            });
            alert(res.data.message);
            setGeneratedQuestions([]);
            setNewExamTitle('');
            api.get('exams/').then(r => setExams(r.data));
        } catch (err) { 
            alert("Failed to save."); 
        } finally {
            setSaving(false);
        }
    };

    const updateQuestion = (index, field, value) => {
        const updated = [...generatedQuestions];
        updated[index][field] = value;
        setGeneratedQuestions(updated);
    };

    // ... (renderSourceSelector same as before) ...
    const renderSourceSelector = () => {
        if (scope === 'chapter') {
            return <select className="w-full p-2 border rounded" onChange={e => setSelectedId(e.target.value)}><option value="">Select Chapter</option>{chapters.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}</select>;
        } else if (scope === 'subject') {
            return <select className="w-full p-2 border rounded" onChange={e => setSelectedId(e.target.value)}><option value="">Select Subject</option>{subjects.map(s => <option key={s.id} value={s.id}>{s.title}</option>)}</select>;
        } else {
            return <select className="w-full p-2 border rounded" onChange={e => setSelectedId(e.target.value)}><option value="">Select Course</option>{courses.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}</select>;
        }
    };

    return (
        <div className="max-w-7xl mx-auto p-8 font-sans bg-slate-50 min-h-screen">
            <h1 className="text-3xl font-bold text-slate-800 mb-8 flex items-center gap-3">
                <Wand2 className="text-purple-600" /> Versatile Exam Generator
            </h1>

            {/* MAIN CARD (Same Tabs/Config as before) */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden mb-10">
                 {/* ... (Keep Tabs and Left Config Panel exactly the same) ... */}
                 {/* I'm abbreviating the Left Panel to save space, assume it matches previous code logic */}
                 <div className="flex border-b border-slate-200">
                    <button onClick={() => setMode('text')} className={`flex-1 py-4 font-bold text-sm uppercase tracking-wider flex items-center justify-center gap-2 ${mode === 'text' ? 'bg-purple-50 text-purple-700 border-b-2 border-purple-600' : 'text-slate-500 hover:bg-slate-50'}`}><FileText size={18}/> From Notes</button>
                    <button onClick={() => setMode('image')} className={`flex-1 py-4 font-bold text-sm uppercase tracking-wider flex items-center justify-center gap-2 ${mode === 'image' ? 'bg-blue-50 text-blue-700 border-b-2 border-blue-600' : 'text-slate-500 hover:bg-slate-50'}`}><ImageIcon size={18}/> From Image</button>
                    <button onClick={() => setMode('csv')} className={`flex-1 py-4 font-bold text-sm uppercase tracking-wider flex items-center justify-center gap-2 ${mode === 'csv' ? 'bg-green-50 text-green-700 border-b-2 border-green-600' : 'text-slate-500 hover:bg-slate-50'}`}><FileSpreadsheet size={18}/> From CSV</button>
                </div>

                <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-6">
                        {mode === 'text' && (
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">1. Generation Scope</label>
                                <div className="flex gap-2 mb-4">
                                    {['chapter', 'subject', 'course'].map(s => (
                                        <button key={s} onClick={() => setScope(s)} className={`px-3 py-1 rounded-full text-xs font-bold border ${scope === s ? 'bg-slate-800 text-white border-slate-800' : 'bg-white text-slate-500 border-slate-300'}`}>{s === 'course' ? 'Full Mock' : s.charAt(0).toUpperCase() + s.slice(1)}</button>
                                    ))}
                                </div>
                                {renderSourceSelector()}
                            </div>
                        )}
                        {mode === 'image' && (
                             <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">1. Upload Image</label>
                                <div className="border-2 border-dashed border-slate-300 rounded-xl p-8 text-center bg-slate-50 hover:border-blue-400 transition-colors">
                                    <input type="file" accept="image/*" onChange={e => setImageFile(e.target.files[0])} className="hidden" id="imgUpload" />
                                    <label htmlFor="imgUpload" className="cursor-pointer"><UploadCloud className="mx-auto text-slate-400 mb-2" size={32} /><p className="text-sm text-slate-600 font-medium">{imageFile ? imageFile.name : "Click to upload diagram"}</p></label>
                                </div>
                            </div>
                        )}
                        {mode === 'csv' && (
                             <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">1. Upload CSV</label>
                                <div className="border-2 border-dashed border-green-300 rounded-xl p-8 text-center bg-green-50/50 hover:border-green-500 transition-colors">
                                    <input type="file" accept=".csv" onChange={e => setCsvFile(e.target.files[0])} className="hidden" id="csvUpload" />
                                    <label htmlFor="csvUpload" className="cursor-pointer"><FileSpreadsheet className="mx-auto text-green-500 mb-2" size={32} /><p className="text-sm text-slate-600 font-medium">{csvFile ? csvFile.name : "Click to upload CSV"}</p></label>
                                </div>
                                <button onClick={downloadCsvTemplate} className="mt-4 text-xs text-blue-600 hover:underline flex items-center gap-1"><Download size={12}/> Download Template</button>
                            </div>
                        )}

                        {mode !== 'csv' && (
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">2. Instructions & Difficulty</label>
                                <div className="flex gap-2 mb-3">
                                    {mode === 'text' && <input type="number" className="w-20 p-2 border rounded" value={numQ} onChange={e => setNumQ(e.target.value)} placeholder="Qty" />}
                                    <select className="flex-1 p-2 border rounded" value={difficulty} onChange={e => setDifficulty(e.target.value)}><option>Easy</option><option>Medium</option><option>Hard</option></select>
                                </div>
                                <textarea className="w-full p-3 border rounded-lg text-sm h-24" placeholder="E.g. Focus on numericals. Match PYQ style." value={customInstructions} onChange={e => setCustomInstructions(e.target.value)} />
                            </div>
                        )}

                        <div className="flex flex-col gap-3">
                             {mode !== 'csv' ? (
                                <button onClick={mode === 'text' ? handleTextGenerate : handleImageGenerate} disabled={loading} className={`w-full py-3 rounded-xl font-bold text-white shadow-lg transition-all flex justify-center items-center gap-2 ${mode === 'text' ? 'bg-purple-600 hover:bg-purple-700' : 'bg-blue-600 hover:bg-blue-700'}`}>{loading ? <Loader2 className="animate-spin" /> : <><Wand2 size={18}/> Generate</>}</button>
                            ) : (
                                <button onClick={handleCsvUpload} disabled={loading || !csvFile} className="w-full py-3 rounded-xl font-bold text-white bg-green-600 hover:bg-green-700 shadow-lg transition-all flex justify-center items-center gap-2">{loading ? <Loader2 className="animate-spin" /> : <><UploadCloud size={18}/> Upload & Save</>}</button>
                            )}
                            {mode !== 'csv' && (<button onClick={addManualQuestion} className="w-full py-3 rounded-xl font-bold border-2 border-dashed border-slate-300 text-slate-500 hover:border-blue-500 hover:text-blue-600 flex justify-center items-center gap-2 transition-all"><Plus size={18}/> Add Manual Question</button>)}
                        </div>
                    </div>

                    {/* RIGHT: Review Panel */}
                    <div className="bg-slate-50 rounded-xl border border-slate-200 p-6 overflow-y-auto max-h-[600px]">
                        <div className="flex flex-col gap-4 mb-6">
                            <h2 className="font-bold text-slate-700">Review ({generatedQuestions.length})</h2>
                            
                             {/* EXAM SELECTION / CREATION */}
                             <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm space-y-2">
                                <div className="text-xs font-bold text-slate-400 uppercase">Target Exam</div>
                                <select 
                                    className="w-full text-sm p-2 border rounded bg-slate-50 mb-2" 
                                    onChange={e => { setSelectedExam(e.target.value); setNewExamTitle(''); }} 
                                    value={selectedExam}
                                    disabled={!!newExamTitle}
                                >
                                    <option value="">-- Select Existing Exam --</option>
                                    {exams.map(e => <option key={e.id} value={e.id}>{e.title}</option>)}
                                </select>
                                
                                <div className="relative">
                                    <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-200"></div></div>
                                    <div className="relative flex justify-center text-xs uppercase"><span className="bg-white px-2 text-slate-400">OR Create New</span></div>
                                </div>

                                <input 
                                    className="w-full text-sm p-2 border rounded border-blue-200 focus:ring-2 focus:ring-blue-200 outline-none"
                                    placeholder="Enter New Exam Name..."
                                    value={newExamTitle}
                                    onChange={e => { setNewExamTitle(e.target.value); setSelectedExam(''); }}
                                    disabled={!!selectedExam}
                                />
                            </div>

                            <div className="flex gap-2">
                                <button onClick={handleLoadExamQuestions} disabled={!selectedExam} className="flex-1 bg-blue-100 text-blue-700 p-2 rounded hover:bg-blue-200 flex justify-center gap-2 disabled:opacity-50"><RefreshCw size={18}/> Load</button>
                                <button onClick={handleSave} disabled={saving} className="flex-1 bg-green-600 text-white p-2 rounded hover:bg-green-700 flex justify-center gap-2 shadow-lg disabled:opacity-50">
                                    {saving ? <Loader2 className="animate-spin" size={18}/> : <Save size={18}/>} Save All
                                </button>
                            </div>
                        </div>

                        {generatedQuestions.length === 0 ? (
                            <div className="text-center text-slate-400 mt-20 flex flex-col items-center">
                                <Layers size={48} className="mb-4 opacity-50"/>
                                <p>{mode === 'csv' ? "Uploaded questions are saved directly." : "Generated questions will appear here."}</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {generatedQuestions.map((q, qIdx) => (
                                    <div key={qIdx} className="bg-white p-4 rounded-lg shadow-sm border border-slate-200">
                                        <div className="flex justify-between mb-2">
                                            <span className="text-xs font-bold text-slate-400">Q{qIdx + 1}</span>
                                            <Trash2 size={14} className="text-red-400 cursor-pointer" onClick={() => setGeneratedQuestions(prev => prev.filter((_, i) => i !== qIdx))}/>
                                        </div>
                                        
                                        <textarea 
                                            className="w-full text-sm font-medium border-none p-0 resize-none focus:ring-0 mb-2" 
                                            value={q.question_text}
                                            onChange={e => updateQuestion(qIdx, 'question_text', e.target.value)}
                                            placeholder="Question text..."
                                        />

                                        <div className="mb-4 bg-slate-50 p-2 rounded border border-slate-100 flex flex-col gap-2">
                                            <div className="flex items-center gap-2">
                                                <LinkIcon size={14} className="text-slate-400"/>
                                                <input className="bg-transparent text-xs w-full outline-none text-slate-600" placeholder="Image URL..." value={q.image_url || ''} onChange={e => updateQuestion(qIdx, 'image_url', e.target.value)} />
                                            </div>
                                            {/* PREVIEW */}
                                            {q.image_url && <img src={q.image_url} alt="Preview" className="max-h-24 object-contain mx-auto" onError={(e) => e.target.style.display = 'none'} />}
                                        </div>

                                        <div className="grid grid-cols-2 gap-2 mb-4">
                                            {q.options.map((opt, oIdx) => (
                                                <div key={oIdx} className={`flex items-center gap-2 p-1.5 rounded border text-xs ${q.correct_index === oIdx ? 'bg-green-50 border-green-300' : 'bg-slate-50'}`}>
                                                    <input type="radio" checked={q.correct_index === oIdx} onChange={() => updateQuestion(qIdx, 'correct_index', oIdx)} />
                                                    <input className="bg-transparent w-full outline-none" value={opt} onChange={e => {
                                                        const updated = [...generatedQuestions];
                                                        updated[qIdx].options[oIdx] = e.target.value;
                                                        setGeneratedQuestions(updated);
                                                    }}/>
                                                </div>
                                            ))}
                                        </div>
                                        
                                        {/* --- NEW: EXPLANATION FIELD --- */}
                                        <div className="bg-blue-50 p-3 rounded-lg border border-blue-100">
                                            <div className="flex items-center gap-2 mb-1 text-xs font-bold text-blue-700">
                                                <HelpCircle size={14}/> Explanation
                                            </div>
                                            <textarea 
                                                className="w-full text-xs text-blue-900 bg-transparent border-none p-0 resize-none focus:ring-0" 
                                                rows={2}
                                                placeholder="Explain the correct answer..."
                                                value={q.explanation || ''}
                                                onChange={e => updateQuestion(qIdx, 'explanation', e.target.value)}
                                            />
                                        </div>

                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminGeneratorPage;