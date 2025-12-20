import React, { useState } from 'react';
import api from '../api/axios';
import { UploadCloud, FileText, Loader2, AlertCircle, CheckCircle, Download } from 'lucide-react';

const AdminNotesUploadPage = () => {
    const [csvFile, setCsvFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [statusMessage, setStatusMessage] = useState({ type: 'info', text: 'Ready to upload notes.' });
    const [uploadSummary, setUploadSummary] = useState(null);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file && file.name.toLowerCase().endsWith('.csv')) { 
            setCsvFile(file);
            setStatusMessage({ type: 'info', text: `File selected: ${file.name}` });
        } else {
            setCsvFile(null);
            setStatusMessage({ type: 'error', text: 'Please select a valid CSV file.' });
        }
    };

    // --- RESTORED: DOWNLOAD TEMPLATE FUNCTION ---
    const downloadTemplate = () => {
        const csvContent = "data:text/csv;charset=utf-8," 
            + "Course,Paper,Subject,Chapter,Notes\n"
            + "UGC NET Computer Science,Paper 1,Teaching Aptitude,Methods of Teaching,# Markdown Notes here...\n"
            + "UGC NET Computer Science,Paper 2,Operating System,Process Management,# OS Notes here...";
        
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "ugc_net_template.csv");
        document.body.appendChild(link);
        link.click();
    };

    const handleUpload = async () => {
        if (!csvFile) {
            setStatusMessage({ type: 'error', text: 'Please select a CSV file first.' });
            return;
        }

        setLoading(true);
        setStatusMessage({ type: 'info', text: 'Uploading... Please wait.' });
        setUploadSummary(null);

        const formData = new FormData();
        formData.append('file', csvFile);

        try {
            const res = await api.post('bulk-notes/upload_csv/', formData, {
                headers: { 'Content-Type': undefined }
            });

            setStatusMessage({ type: 'success', text: res.data.message || 'Notes uploaded successfully!' });
            setUploadSummary(res.data);
            setCsvFile(null);
            document.getElementById('csvInput').value = ""; 

        } catch (err) {
            console.error("Upload Error:", err);
            const errorText = err.response?.data?.error || "Upload failed. Check console/network logs.";
            setStatusMessage({ type: 'error', text: errorText });
        } finally {
            setLoading(false);
        }
    };
    
    const getStatusClasses = (type) => {
        switch (type) {
            case 'success': return 'bg-green-100 dark:bg-green-900/30 border-green-300 dark:border-green-700 text-green-700 dark:text-green-300';
            case 'error': return 'bg-red-100 dark:bg-red-900/30 border-red-300 dark:border-red-700 text-red-700 dark:text-red-300';
            default: return 'bg-blue-100 dark:bg-blue-900/30 border-blue-300 dark:border-blue-700 text-blue-700 dark:text-blue-300';
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-8 font-sans transition-colors duration-300">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold text-slate-800 dark:text-white mb-6 flex items-center gap-3">
                    <FileText className="text-blue-600 dark:text-blue-400" size={28} /> Bulk Notes Uploader
                </h1>

                <div className="bg-white dark:bg-slate-900 p-8 rounded-xl shadow-lg border border-slate-200 dark:border-slate-800 space-y-6">
                    
                    {/* Status Bar */}
                    <div className={`p-4 rounded-lg border flex items-center gap-3 font-medium transition-colors ${getStatusClasses(statusMessage.type)}`}>
                        {statusMessage.type === 'error' ? <AlertCircle size={20} /> : <CheckCircle size={20} />}
                        <span>{statusMessage.text}</span>
                    </div>

                    {/* Template Download Area */}
                    <div className="flex justify-end">
                         <button 
                            onClick={downloadTemplate}
                            className="text-sm font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-2"
                        >
                            <Download size={16} /> Download CSV Template
                        </button>
                    </div>

                    {/* File Input Area */}
                    <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl p-10 text-center bg-slate-50 dark:bg-slate-800 hover:border-blue-400 dark:hover:border-blue-500 transition-colors cursor-pointer group" onClick={() => document.getElementById('csvInput').click()}>
                        <input 
                            type="file" 
                            accept=".csv" 
                            onChange={handleFileChange} 
                            className="hidden" 
                            id="csvInput"
                            disabled={loading}
                        />
                        <UploadCloud className="mx-auto text-slate-400 dark:text-slate-500 group-hover:text-blue-500 transition-colors mb-3" size={40} />
                        <p className="text-sm text-slate-600 dark:text-slate-300 font-medium">
                            {csvFile ? <span className="font-bold text-blue-600 dark:text-blue-400">{csvFile.name}</span> : "Click to select CSV"}
                        </p>
                    </div>

                    {/* Action Button */}
                    <button 
                        onClick={handleUpload} 
                        disabled={!csvFile || loading}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-bold shadow-md transition-all flex justify-center items-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? <Loader2 className="animate-spin" size={20} /> : <UploadCloud size={20} />}
                        {loading ? 'Uploading...' : 'Start Bulk Upload'}
                    </button>

                    {/* Result Summary */}
                    {uploadSummary && (
                        <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-200 dark:border-green-800">
                            <p className="text-sm text-green-800 dark:text-green-300 font-bold">{uploadSummary.message}</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminNotesUploadPage;