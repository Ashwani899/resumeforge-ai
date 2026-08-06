import React, { useState } from 'react';

interface JobDescInputProps {
  onSubmit: (jd: string, role: string) => void;
  loading: boolean;
}

export const JobDescInput: React.FC<JobDescInputProps> = ({ onSubmit, loading }) => {
  const [jd, setJd] = useState('');
  const [role, setRole] = useState('Software Intern');

  const roles = [
    'Software Intern', 'Data Science Intern', 'DevOps Intern', 
    'ML Intern', 'Frontend Intern', 'Backend Intern', 'Custom'
  ];

  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-xl">
      <h2 className="text-xl font-medium text-gray-200 mb-4">Target Job Description</h2>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-400 mb-2">Select Target Role</label>
        <select 
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="w-full bg-gray-900 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:ring-2 focus:ring-indigo-500 outline-none"
        >
          {roles.map(r => <option key={r} value={r}>{r}</option>)}
        </select>
      </div>
      <div className="mb-4 relative">
        <label className="block text-sm font-medium text-gray-400 mb-2">Paste Job Description</label>
        <textarea
          value={jd}
          onChange={(e) => setJd(e.target.value)}
          placeholder="Paste the requirements and description here..."
          className="w-full h-48 bg-gray-900 border border-white/10 rounded-xl p-4 text-gray-300 focus:ring-2 focus:ring-indigo-500 outline-none resize-none font-sans"
        />
        <div className="absolute bottom-4 right-4 text-xs text-gray-500">
          {jd.length} chars
        </div>
      </div>
      <button
        onClick={() => onSubmit(jd, role)}
        disabled={loading || jd.length < 50}
        className="w-full py-3 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl text-white font-medium hover:shadow-lg hover:shadow-indigo-500/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            Analyzing & Tailoring...
          </>
        ) : (
          'Analyze & Tailor Resume'
        )}
      </button>
    </div>
  );
};
