import React from 'react';
import { Users, ArrowRight } from 'lucide-react';

const UgcNetPage = () => {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 p-8">
      <div className="max-w-4xl mx-auto bg-white dark:bg-slate-800 p-10 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 text-center">
        <Users size={64} className="text-emerald-600 mx-auto mb-4" />
        <h1 className="text-3xl font-extrabold text-slate-800 dark:text-white mb-2">UGC NET Preparation Course</h1>
        <p className="text-lg text-slate-500 dark:text-slate-400 mb-6">
          Comprehensive preparation course for the UGC National Eligibility Test (NET).
        </p>
        <button className="bg-emerald-600 text-white px-6 py-3 rounded-xl font-bold flex items-center justify-center mx-auto hover:bg-emerald-700 transition-colors">
          Enroll Now <ArrowRight size={20} className="ml-2" />
        </button>
      </div>
    </div>
  );
};

export default UgcNetPage;