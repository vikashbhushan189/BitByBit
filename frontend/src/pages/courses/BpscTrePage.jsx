import React, { useEffect, useState, useRef } from 'react';
import { Chart } from 'chart.js/auto';

// --- DATA STORE (From your HTML) ---
const EXAM_DATA = {
    tech: {
        title: "Part III: Computer Science",
        totalQ: 80,
        maxMarks: 80,
        target: "65+",
        negMark: 0, // Assuming 0 for now based on your note
        negLabel: "None*", 
        chartLabels: ["Fundamentals & Arch", "Programming (C++/Py)", "Data Structures", "Networks & Web", "DBMS & SQL", "OS & Others"],
        chartData: [15, 20, 10, 12, 10, 13], 
        colors: ["#6366f1", "#3b82f6", "#0ea5e9", "#06b6d4", "#8b5cf6", "#a855f7"],
        syllabus: {
            "Foundations": [
                "Computer Fundamentals (Generations, I/O, Memory)",
                "Number Systems (Binary, Hex, Arithmetic)",
                "Boolean Algebra & Logic Gates (K-Maps)",
                "Computer Architecture (Von Neumann, ALU, Memory Hierarchy)"
            ],
            "Programming & DS": [
                "Programming Concepts (C/C++, Python Basics)",
                "Control Statements, Functions, Arrays",
                "Data Structures (Stacks, Queues, Linked Lists, Trees, Graphs)",
                "Searching & Sorting Algorithms"
            ],
            "Web & Networks": [
                "Networking (LAN/WAN, Topologies, OSI/TCP-IP, Devices)",
                "Internet & Web Tech (HTML, CSS, Browsers)",
                "Information Security (Threats, Cryptography basics)"
            ],
            "Systems & Data": [
                "Operating Systems (Process Mgmt, Memory Mgmt, Linux/Windows)",
                "DBMS (SQL Queries, Normalization, Data Models)",
                "Software Engineering (SDLC, Agile, Testing)",
                "Math for CS (Sets, Matrices, Probability)"
            ]
        }
    },
    gs: {
        title: "Part II: General Studies",
        totalQ: 40,
        maxMarks: 40,
        target: "25+",
        negMark: 0,
        negLabel: "None*",
        chartLabels: ["Math & Reasoning", "General Science", "Current Affairs", "Indian National Movement", "Geography & GK"],
        chartData: [12, 8, 8, 6, 6],
        colors: ["#f59e0b", "#10b981", "#ef4444", "#8b5cf6", "#64748b"],
        syllabus: {
            "Math & Mental Ability": [
                "Number System, LCM/HCF", "Ratio, Percentage, Profit/Loss",
                "Time & Distance, Data Interpretation",
                "Coding-Decoding, Series, Blood Relations", "Analogies, Syllogisms"
            ],
            "General Science": [
                "Physics (Motion, Light, Electricity)",
                "Chemistry (Matter, Acids/Bases)",
                "Biology (Life processes, Environment)",
                "Inventions & Discoveries"
            ],
            "General Awareness": [
                "Indian National Movement (1857, Freedom Struggle)",
                "Geography (India & Bihar: Rivers, Soil, Crops)",
                "Polity (Constitution, Rights, Panchayati Raj)",
                "Economy (GDP, Five year plans, Bihar Economy)",
                "Current Affairs (National, International, Bihar Special)"
            ]
        }
    },
    lang: {
        title: "Part I: Language (Qualifying)",
        totalQ: 30,
        maxMarks: 30,
        target: "9 (30%)",
        negMark: 0,
        negLabel: "None",
        chartLabels: ["English (Compulsory)", "Hindi/Urdu/Bangla"],
        chartData: [8, 22],
        colors: ["#ec4899", "#14b8a6"],
        syllabus: {
            "English (8 Qs)": [
                "Vocabulary (Synonyms, Antonyms)",
                "Grammar (Parts of Speech, Tenses)",
                "Fill in the Blanks (Prepositions, Articles)",
                "Reading Comprehension"
            ],
            "Hindi/Urdu (22 Qs)": [
                "Vyakaran (Grammar)",
                "Sentence Structure",
                "Synonyms/Antonyms",
                "Idioms & Phrases",
                "Reading Comprehension"
            ]
        }
    }
};

const BpscTrePage = () => {
    const [section, setSection] = useState('tech');
    const [activeSubject, setActiveSubject] = useState(Object.keys(EXAM_DATA['tech'].syllabus)[0]);
    const [calculator, setCalculator] = useState({ correct: '', score: null, feedback: '', feedbackClass: '' });
    
    const chartRef = useRef(null);
    const canvasRef = useRef(null);

    const currentData = EXAM_DATA[section];

    // --- CHART EFFECT ---
    useEffect(() => {
        if (chartRef.current) {
            chartRef.current.destroy();
        }

        const ctx = canvasRef.current.getContext('2d');
        chartRef.current = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: currentData.chartLabels,
                datasets: [{
                    data: currentData.chartData,
                    backgroundColor: currentData.colors,
                    borderWidth: 2,
                    borderColor: '#ffffff',
                    hoverOffset: 4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: { boxWidth: 12, padding: 15, font: { size: 11, family: "'ui-sans-serif', system-ui" } }
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                let label = context.label || '';
                                if (label) label += ': ';
                                let val = context.raw;
                                let total = context.chart._metasets[context.datasetIndex].total;
                                let percentage = Math.round((val / total) * 100) + '%';
                                return label + 'Est. Weight: ' + percentage;
                            }
                        }
                    }
                }
            }
        });

        // Reset sub-states on section switch
        setActiveSubject(Object.keys(currentData.syllabus)[0]);
        setCalculator({ correct: '', score: null, feedback: '', feedbackClass: '' });

    }, [section]);

    // --- CALCULATOR ---
    const handleCalculate = () => {
        const correct = parseInt(calculator.correct) || 0;
        const max = currentData.totalQ;

        if (correct > max) {
            alert(`Correct attempts cannot exceed ${max} for this section!`);
            return;
        }

        const score = correct; // No negative marking logic for now as per template
        const percentage = Math.round((score / max) * 100);
        
        let feedbackText = "";
        let feedbackClass = "";

        if (section === 'lang') {
            if (score >= 9) {
                feedbackText = "QUALIFIED (Language)";
                feedbackClass = "text-emerald-400";
            } else {
                feedbackText = "NOT QUALIFIED (< 9 Marks)";
                feedbackClass = "text-rose-400";
            }
        } else {
            if (percentage >= 75) {
                feedbackText = "EXCELLENT (Safe Zone)";
                feedbackClass = "text-emerald-400";
            } else if (percentage >= 50) {
                feedbackText = "GOOD (Competitive)";
                feedbackClass = "text-indigo-400";
            } else {
                feedbackText = "NEEDS WORK";
                feedbackClass = "text-amber-400";
            }
        }

        setCalculator({ ...calculator, score, feedback: feedbackText, feedbackClass });
    };

    return (
        <div className="bg-slate-50 min-h-screen text-slate-800 font-sans pb-20 selection:bg-indigo-200 selection:text-indigo-900">
            {/* Header */}
            <header className="bg-slate-900 text-slate-100 shadow-lg border-b-4 border-indigo-500">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight text-white uppercase flex items-center gap-2">
                                BPSC TRE <span className="text-indigo-400">4.0 / 5.0</span>
                            </h1>
                            <p className="text-slate-400 text-sm mt-1">Computer Science (Class 11-12) • Interactive Syllabus & Roadmap</p>
                        </div>
                        <div className="text-center md:text-right">
                            <span className="inline-block bg-indigo-900 text-indigo-100 text-xs px-3 py-1 rounded-full uppercase tracking-wider font-semibold border border-indigo-700">PGT Computer Science</span>
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
                
                {/* Introduction & Selector */}
                <section className="max-w-4xl mx-auto text-center">
                    <h2 className="text-2xl font-semibold text-slate-800 mb-3">Exam Architecture</h2>
                    <p className="text-slate-600 mb-8">
                        The BPSC TRE Computer Science exam is a <strong>150-mark</strong> test divided into three strategic parts. 
                        Select a section below to decode its syllabus, weightage, and topic distribution.
                    </p>
                    <div className="flex flex-wrap justify-center gap-4">
                        <SectionButton 
                            id="tech" label="💻 Technical (CS)" isActive={section === 'tech'} onClick={() => setSection('tech')} 
                        />
                        <SectionButton 
                            id="gs" label="📚 General Studies" isActive={section === 'gs'} onClick={() => setSection('gs')} 
                        />
                        <SectionButton 
                            id="lang" label="🗣️ Language" isActive={section === 'lang'} onClick={() => setSection('lang')} 
                        />
                    </div>
                </section>

                {/* Intelligence Brief */}
                <section className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                    {/* Left: Stats & Chart */}
                    <div className="bg-white rounded-xl shadow-md border border-slate-200 p-6">
                        <div className="mb-6">
                            <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                                <span className="text-indigo-600 text-2xl">⦿</span> Section Analysis
                            </h3>
                            <p className="text-slate-500 text-sm mt-1">Breakdown for <span className="font-bold text-indigo-700">{currentData.title}</span>.</p>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                            <StatBox label="Questions" value={currentData.totalQ} />
                            <StatBox label="Max Marks" value={currentData.maxMarks} />
                            <StatBox label="Target" value={currentData.target} color="text-emerald-600" />
                            <StatBox label="Neg. Mark" value={currentData.negLabel} color="text-slate-400" />
                        </div>

                        <div className="h-[300px] w-full flex justify-center relative">
                            <canvas ref={canvasRef}></canvas>
                        </div>
                        <p className="text-xs text-center text-slate-400 mt-4">Graph represents estimated topic distribution.</p>
                    </div>

                    {/* Right: Syllabus */}
                    <div className="bg-white rounded-xl shadow-md border border-slate-200 p-6 flex flex-col h-full min-h-[400px]">
                        <div className="mb-4">
                            <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                                <span className="text-indigo-600 text-2xl">☰</span> Detailed Syllabus
                            </h3>
                            <p className="text-slate-500 text-sm mt-1">Comprehensive topics list based on the Roadmap.</p>
                        </div>

                        {/* Syllabus Tabs */}
                        <div className="flex space-x-2 mb-4 overflow-x-auto pb-2 border-b border-slate-100 no-scrollbar">
                            {Object.keys(currentData.syllabus).map(subj => (
                                <button
                                    key={subj}
                                    onClick={() => setActiveSubject(subj)}
                                    className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-semibold transition-colors border ${activeSubject === subj ? 'bg-indigo-100 text-indigo-800 border-indigo-200' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'}`}
                                >
                                    {subj}
                                </button>
                            ))}
                        </div>

                        {/* Syllabus Content */}
                        <div className="flex-grow bg-slate-50 rounded-lg p-4 border border-slate-100 overflow-y-auto max-h-[300px]">
                            <h4 className="font-bold text-slate-800 mb-3 sticky top-0 bg-slate-50 py-2 border-b border-slate-200">{activeSubject} Topics</h4>
                            <ul className="grid grid-cols-1 gap-2">
                                {currentData.syllabus[activeSubject]?.map((topic, i) => (
                                    <li key={i} className="flex items-start gap-2 text-sm text-slate-600 bg-white p-2 rounded shadow-sm border border-slate-100">
                                        <span className="text-indigo-500 font-bold mt-0.5">›</span> {topic}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </section>

                {/* Strategy Room */}
                <section className="bg-slate-800 rounded-xl shadow-lg p-6 md:p-8 text-slate-100 border border-slate-700">
                    <div className="flex flex-col md:flex-row gap-8 items-center">
                        <div className="md:w-1/2 space-y-4">
                            <h3 className="text-2xl font-bold text-indigo-400">Section Goal Simulator</h3>
                            <p className="text-slate-300">
                                Set a target for this specific section. <br/>
                                <span className="text-xs text-slate-400 block mt-2">*Note: Always verify final admit card instructions for negative marking. We assume 0 for this simulation.</span>
                            </p>
                            
                            {calculator.score !== null && (
                                <div className="p-4 bg-slate-700 rounded-lg border-l-4 border-indigo-500 shadow-inner animate-in fade-in slide-in-from-left-4 duration-500">
                                    <div className="flex justify-between items-end border-b border-slate-500 pb-2 mb-2">
                                        <span className="text-slate-300 text-sm">Status</span>
                                        <span className={`${calculator.feedbackClass} font-bold tracking-wider text-sm`}>{calculator.feedback}</span>
                                    </div>
                                    <div className="grid grid-cols-2 gap-y-1 text-sm">
                                        <div className="text-slate-400">Section Score:</div>
                                        <div className="text-right text-white font-mono">{calculator.score} / {currentData.totalQ}</div>
                                        <div className="col-span-2 border-t border-slate-600 mt-2 pt-2 text-center text-xs text-slate-400">
                                            {section === 'lang' ? 'Qualifying only.' : 'Adds to Merit Rank.'}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="md:w-1/2 w-full bg-slate-900 p-6 rounded-lg border border-slate-700">
                            <div className="mb-6">
                                <label className="block text-xs uppercase tracking-wide text-slate-400 mb-2">Projected Correct Answers</label>
                                <div className="flex items-center gap-3">
                                    <input 
                                        type="number" 
                                        min="0" 
                                        className="w-full bg-slate-800 border border-slate-600 rounded p-3 text-white focus:border-indigo-500 focus:outline-none transition-colors text-lg"
                                        placeholder={`Max: ${currentData.totalQ}`}
                                        value={calculator.correct}
                                        onChange={(e) => setCalculator({...calculator, correct: e.target.value})}
                                    />
                                    <span className="text-slate-500 font-bold text-lg">/ {currentData.totalQ}</span>
                                </div>
                            </div>
                            <button onClick={handleCalculate} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded transition-colors shadow-lg shadow-indigo-900/50">
                                Calculate Score
                            </button>
                        </div>
                    </div>
                </section>
            </main>
            
            <footer className="bg-slate-900 text-slate-400 py-8 mt-12 border-t border-slate-800 text-center">
                <p className="mb-2">&copy; 2025 BPSC TRE Preparation Guide.</p>
                <p className="text-xs">Based on "MasterG Thoughts" Roadmap & Career Power Guidelines.</p>
            </footer>
        </div>
    );
};

// --- SUB-COMPONENTS ---

const SectionButton = ({ id, label, isActive, onClick }) => (
    <button 
        onClick={onClick}
        className={`px-6 py-3 rounded-lg border-2 font-bold shadow-sm transition-all transform hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 flex items-center gap-2
            ${isActive ? 'bg-indigo-700 text-white border-indigo-700' : 'bg-white text-slate-600 border-slate-300 hover:bg-slate-50'}
        `}
    >
        {label}
    </button>
);

const StatBox = ({ label, value, color = "text-slate-800" }) => (
    <div className="bg-slate-50 p-3 rounded-lg text-center border border-slate-100">
        <div className="text-xs text-slate-500 uppercase tracking-wide">{label}</div>
        <div className={`text-xl font-bold ${color}`}>{value}</div>
    </div>
);

export default BpscTrePage;