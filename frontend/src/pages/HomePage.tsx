import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FileUpload } from '../components/upload/FileUpload';
import type { UploadResponse } from '../types';

export const HomePage: React.FC = () => {
  const navigate = useNavigate();

  const handleUploadSuccess = (data: UploadResponse) => {
    navigate(`/analysis/${data.id}`, { state: { data } });
  };

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="absolute top-20 left-1/4 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl" />

      <div className="max-w-4xl mx-auto relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight mb-6">
            Craft the perfect resume with
            <span className="block mt-2 bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-400 to-indigo-400 animate-gradient-x">
              ResumeForge AI
            </span>
          </h1>
          <p className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto">
            Upload your resume. Get an instant ATS score. Let our AI tailor it perfectly to your dream job.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <FileUpload onUploadSuccess={handleUploadSuccess} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8 text-left"
        >
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-6 rounded-2xl">
            <div className="w-12 h-12 bg-indigo-500/20 rounded-xl flex items-center justify-center mb-4 text-2xl">🎯</div>
            <h3 className="text-lg font-medium text-white mb-2">ATS Scoring</h3>
            <p className="text-gray-400 text-sm">Get an instant score based on industry-standard Applicant Tracking Systems.</p>
          </div>
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-6 rounded-2xl">
            <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center mb-4 text-2xl">✨</div>
            <h3 className="text-lg font-medium text-white mb-2">Keyword Analysis</h3>
            <p className="text-gray-400 text-sm">Discover exactly which keywords you're missing for your target role.</p>
          </div>
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-6 rounded-2xl">
            <div className="w-12 h-12 bg-emerald-500/20 rounded-xl flex items-center justify-center mb-4 text-2xl">🤖</div>
            <h3 className="text-lg font-medium text-white mb-2">AI Tailoring</h3>
            <p className="text-gray-400 text-sm">Let our advanced AI rewrite and optimize your resume for specific job descriptions.</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
