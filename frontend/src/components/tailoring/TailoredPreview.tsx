import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface TailoredPreviewProps {
  originalText: string;
  tailoredText: string;
  matchScore: number;
  addedKeywords: string[];
}

export const TailoredPreview: React.FC<TailoredPreviewProps> = ({ originalText, tailoredText, matchScore, addedKeywords }) => {
  const [activeTab, setActiveTab] = useState<'tailored' | 'original' | 'diff'>('tailored');

  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden backdrop-blur-xl h-[600px] flex flex-col">
      <div className="border-b border-white/10 p-4 flex items-center justify-between bg-gray-900/50">
        <div className="flex gap-2">
          <button 
            onClick={() => setActiveTab('tailored')}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${activeTab === 'tailored' ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30' : 'text-gray-400 hover:bg-white/5'}`}
          >
            Tailored
          </button>
          <button 
            onClick={() => setActiveTab('original')}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${activeTab === 'original' ? 'bg-gray-700 text-gray-200 border border-gray-600' : 'text-gray-400 hover:bg-white/5'}`}
          >
            Original
          </button>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-400">Match Score:</span>
          <span className="px-2 py-1 bg-emerald-500/20 text-emerald-400 font-bold rounded-lg text-sm border border-emerald-500/30">
            {matchScore}%
          </span>
        </div>
      </div>
      
      {addedKeywords.length > 0 && (
        <div className="p-3 border-b border-white/5 bg-emerald-900/10 flex items-center gap-2 overflow-x-auto">
          <span className="text-xs font-medium text-emerald-500 whitespace-nowrap">Added Keywords:</span>
          <div className="flex gap-2">
            {addedKeywords.map((kw, i) => (
              <span key={i} className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 rounded text-xs whitespace-nowrap">
                {kw}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="flex-1 overflow-y-auto p-6 text-sm text-gray-300 font-mono leading-relaxed whitespace-pre-wrap">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
        >
          {activeTab === 'tailored' ? tailoredText : originalText}
        </motion.div>
      </div>
    </div>
  );
};
