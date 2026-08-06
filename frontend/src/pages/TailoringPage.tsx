import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { tailorResume } from '../services/api';
import type { TailorResponse } from '../types';
import { JobDescInput } from '../components/tailoring/JobDescInput';
import { TailoredPreview } from '../components/tailoring/TailoredPreview';
import { DownloadPanel } from '../components/download/DownloadPanel';

export const TailoringPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<TailorResponse | null>(null);

  const handleTailor = async (jd: string, role: string) => {
    if (!id) return;
    setLoading(true);
    try {
      const data = await tailorResume({ resume_id: id, job_description: jd, target_role: role });
      setResult(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }}
      className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto"
    >
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">AI Resume Tailoring</h1>
        <p className="text-gray-400">Optimize your resume for a specific job description to maximize your ATS match.</p>
      </div>

      {!result ? (
        <div className="max-w-3xl mx-auto">
          <JobDescInput onSubmit={handleTailor} loading={loading} />
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-xl">
              <h3 className="text-lg font-medium text-gray-200 mb-4">Improvement Summary</h3>
              <div className="space-y-4">
                {result.suggestions.map((s, i) => (
                  <div key={i} className="flex gap-3 text-sm text-gray-300">
                    <span className="text-indigo-400 shrink-0">✓</span>
                    <span>{s}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <DownloadPanel resumeId={id!} />
            
            <button
              onClick={() => setResult(null)}
              className="w-full py-2.5 bg-white/5 hover:bg-white/10 border border-white/20 rounded-xl text-white font-medium transition-colors"
            >
              Tailor for Another Job
            </button>
          </div>
          
          <div className="lg:col-span-2">
            <TailoredPreview 
              originalText={result.original_text}
              tailoredText={result.tailored_text}
              matchScore={result.match_score}
              addedKeywords={result.added_keywords}
            />
          </div>
        </div>
      )}
    </motion.div>
  );
};
