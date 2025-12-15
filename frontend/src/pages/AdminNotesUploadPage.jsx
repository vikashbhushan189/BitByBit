import React, { useState } from 'react';
import api from '../api/axios';
import { UploadCloud, FileText, Loader2, AlertCircle, CheckCircle } from 'lucide-react';

const AdminNotesUploadPage = () => {
    const [csvFile, setCsvFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [statusMessage, setStatusMessage] = useState({ type: 'info', text: 'Ready to upload notes.' });
    const [uploadSummary, setUploadSummary] = useState(null);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file && file.name.toLowerCase().endsWith('.csv')) { // Client-side check safe
            setCsvFile(file);
            setStatusMessage({ type: 'info', text: `File selected: ${file.name}` });
        } else {
            setCsvFile(null);
            setStatusMessage({ type: 'error', text: 'Please select a valid CSV file.' });
        }
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
            // FIX: Explicitly unset 'Content-Type' so the browser sets the correct boundary
            const res = await api.post('bulk-notes/upload_csv/', formData, {
                headers: {
                    'Content-Type': undefined 
                }
            });

            setStatusMessage({ type: 'success', text: res.data.message || 'Notes uploaded successfully!' });
            setUploadSummary(res.data);
            setCsvFile(null);
            // Reset file input value
            document.getElementById('csvInput').value = ""; 

        } catch (err) {
            console.error("Upload Error:", err);
            const errorText = err.response?.data?.error || "Upload failed. Check console/network logs.";
            setStatusMessage({ type: 'error', text: errorText });
        } finally {
            setLoading(false);
        }
    };
    
    // Helper for Message Styling
    const getStatusClasses = (type) => {
        switch (type) {
            case 'success': return 'bg-green-100 border-green-300 text-green-700';
            case 'error': return 'bg-red-100 border-red-300 text-red-700';
            default: return 'bg-blue-100 border-blue-300 text-blue-700';
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-8 font-sans">
            <h1 className="text-3xl font-bold text-slate-800 mb-6 flex items-center gap-3">
                <FileText className="text-blue-600" size={28} /> Bulk Notes Uploader
            </h1>

            <div className="bg-white p-8 rounded-xl shadow-lg border border-slate-200 space-y-6">
                
                <div className={`p-4 rounded-lg border flex items-center gap-3 font-medium ${getStatusClasses(statusMessage.type)}`}>
                    {statusMessage.type === 'error' ? <AlertCircle size={20} /> : <CheckCircle size={20} />}
                    <span>{statusMessage.text}</span>
                </div>

                <div className="border-2 border-dashed border-slate-300 rounded-xl p-10 text-center bg-slate-50 hover:border-blue-400 transition-colors cursor-pointer" onClick={() => document.getElementById('csvInput').click()}>
                    <input 
                        type="file" 
                        accept=".csv" 
                        onChange={handleFileChange} 
                        className="hidden" 
                        id="csvInput"
                        disabled={loading}
                    />
                    <UploadCloud className="mx-auto text-slate-400 mb-3" size={40} />
                    <p className="text-sm text-slate-600 font-medium">
                        {csvFile ? <span className="font-bold text-blue-600">{csvFile.name}</span> : "Click to select CSV"}
                    </p>
                </div>

                <button 
                    onClick={handleUpload} 
                    disabled={!csvFile || loading}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-bold shadow-md transition-all flex justify-center items-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {loading ? <Loader2 className="animate-spin" size={20} /> : <UploadCloud size={20} />}
                    {loading ? 'Uploading...' : 'Start Bulk Upload'}
                </button>

                {uploadSummary && (
                    <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                        <p className="text-sm text-green-800 font-bold">{uploadSummary.message}</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminNotesUploadPage;