import React, { useState } from 'react';
import api from '../api/axios';
import { UploadCloud, FileText, CheckCircle, AlertTriangle, Download, Loader2 } from 'lucide-react';

const AdminNotesUploadPage = () => {
    const [file, setFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [result, setResult] = useState(null);

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
        setResult(null);
    };

    const handleUpload = async () => {
        if (!file) return alert("Please select a file first");
        
        setUploading(true);
        setResult(null);
        
        const formData = new FormData();
        formData.append('file', file);

        try {
            // FIX: Let Axios handle headers automatically for boundary
            const res = await api.post('bulk-notes/upload_csv/', formData);
            setResult({ type: 'success', message: res.data.message });
            setFile(null); 
            // Reset the file input visually
            document.getElementById('fileInput').value = "";
        } catch (err) {
            console.error(err);
            const errorMsg = err.response?.data?.error || "Upload Failed. Check console.";
            setResult({ type: 'error', message: errorMsg });
        } finally {
            setUploading(false);
        }
    };

    // UPDATED TEMPLATE: Removed 'Topic' column
    const downloadTemplate = () => {
        const csvContent = "data:text/csv;charset=utf-8," 
            + "Course,Subject,Chapter,Notes\n"
            + "Computer Science,Operating System,Process Management,# Process Management Notes...\n"
            + "Computer Science,Operating System,Deadlocks,# Deadlock Notes...";
        
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "chapter_notes_template.csv");
        document.body.appendChild(link);
        link.click();
    };

    return (
        <div className="min-h-screen bg-slate-900 text-white p-8 font-sans">
            <div className="max-w-3xl mx-auto">
                <h1 className="text-3xl font-bold mb-8 flex items-center gap-3">
                    <UploadCloud className="text-blue-400"/> Bulk Notes Uploader
                </h1>

                <div className="bg-slate-800 p-8 rounded-2xl border border-slate-700 shadow-xl">
                    {/* Step 1: Template */}
                    <div className="mb-8 pb-8 border-b border-slate-700">
                        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                            <span className="bg-slate-700 w-8 h-8 rounded-full flex items-center justify-center text-sm">1</span>
                            Get Template
                        </h2>
                        <p className="text-slate-400 mb-4">
                            Download the updated CSV template. <br/>
                            <strong>Structure:</strong> Course &gt; Subject &gt; Chapter &gt; Notes.
                        </p>
                        <button 
                            onClick={downloadTemplate}
                            className="flex items-center gap-2 bg-slate-700 hover:bg-slate-600 px-4 py-2 rounded-lg transition-colors text-sm font-medium"
                        >
                            <Download size={16} /> Download CSV Template
                        </button>
                    </div>

                    {/* Step 2: Upload */}
                    <div>
                        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                            <span className="bg-slate-700 w-8 h-8 rounded-full flex items-center justify-center text-sm">2</span>
                            Upload Data
                        </h2>
                        
                        <div className="border-2 border-dashed border-slate-600 rounded-xl p-8 text-center hover:border-blue-500 transition-colors bg-slate-800/50">
                            <input 
                                type="file" 
                                accept=".csv"
                                onChange={handleFileChange}
                                className="hidden" 
                                id="fileInput"
                            />
                            <label htmlFor="fileInput" className="cursor-pointer flex flex-col items-center">
                                <FileText size={48} className="text-slate-500 mb-4" />
                                <span className="text-lg font-medium text-slate-300">
                                    {file ? file.name : "Click to select CSV file"}
                                </span>
                                <span className="text-sm text-slate-500 mt-2">Maximum file size: 5MB</span>
                            </label>
                        </div>

                        {/* Result Message */}
                        {result && (
                            <div className={`mt-6 p-4 rounded-lg flex items-center gap-3 ${result.type === 'success' ? 'bg-green-900/30 text-green-400 border border-green-800' : 'bg-red-900/30 text-red-400 border border-red-800'}`}>
                                {result.type === 'success' ? <CheckCircle /> : <AlertTriangle />}
                                {result.message}
                            </div>
                        )}

                        <button 
                            onClick={handleUpload}
                            disabled={!file || uploading}
                            className="w-full mt-6 bg-blue-600 hover:bg-blue-500 text-white py-3 rounded-xl font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2"
                        >
                            {uploading ? <Loader2 className="animate-spin" /> : "Upload & Sync Database"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminNotesUploadPage;