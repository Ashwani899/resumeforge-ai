import React from 'react';
import { motion } from 'framer-motion';
import type { KeywordsResult } from '../../types';

interface KeywordAnalysisProps {
  keywords: KeywordsResult;
}

export const KeywordAnalysis: React.FC<KeywordAnalysisProps> = ({ keywords }) => {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.05 }
    }
  };

  const item = {
    hidden: { opacity: 0, scale: 0.8 },
    show: { opacity: 1, scale: 1 }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-medium text-gray-200">Keyword Analysis</h3>
        <div className="px-3 py-1 bg-white/10 rounded-full border border-white/20 text-sm font-medium">
          Match Score: <span className="text-indigo-400">{keywords.match_score}%</span>
        </div>
      </div>

      <div>
        <h4 className="text-sm font-medium text-emerald-400 mb-3">Matched Keywords ({keywords.matched.length})</h4>
        <motion.div 
          variants={container}
          initial="hidden"
          animate="show"
          className="flex flex-wrap gap-2"
        >
          {keywords.matched.map((kw, i) => (
            <motion.div
              key={i}
              variants={item}
              className="px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 rounded-full text-sm flex items-center gap-2"
            >
              {kw.keyword}
              <span className="bg-emerald-500/20 px-1.5 py-0.5 rounded-full text-xs">{kw.count}</span>
            </motion.div>
          ))}
        </motion.div>
      </div>

      <div>
        <h4 className="text-sm font-medium text-amber-400 mb-3 mt-6">Missing Keywords ({keywords.missing.length})</h4>
        <motion.div 
          variants={container}
          initial="hidden"
          animate="show"
          className="flex flex-wrap gap-2"
        >
          {keywords.missing.map((kw, i) => {
            const isHigh = kw.importance === 'high';
            return (
              <motion.div
                key={i}
                variants={item}
                className={`px-3 py-1.5 border rounded-full text-sm ${
                  isHigh 
                    ? 'bg-red-500/10 border-red-500/20 text-red-300' 
                    : 'bg-amber-500/10 border-amber-500/20 text-amber-300'
                }`}
              >
                {kw.keyword}
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </div>
  );
};
