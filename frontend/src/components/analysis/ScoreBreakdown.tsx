import React from 'react';
import { motion } from 'framer-motion';
import type { ATSBreakdownItem } from '../../types';

interface ScoreBreakdownProps {
  breakdown: Record<string, ATSBreakdownItem>;
}

export const ScoreBreakdown: React.FC<ScoreBreakdownProps> = ({ breakdown }) => {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, x: -20 },
    show: { opacity: 1, x: 0 }
  };

  return (
    <motion.div 
      variants={container}
      initial="hidden"
      animate="show"
      className="bg-white/5 rounded-2xl border border-white/10 p-6 backdrop-blur-xl mt-6 space-y-4"
    >
      <h3 className="text-lg font-medium text-gray-200 mb-4">Score Breakdown</h3>
      
      {Object.entries(breakdown).map(([key, data]) => {
        let color = 'bg-red-500';
        if (data.score >= 85) color = 'bg-emerald-400';
        else if (data.score >= 65) color = 'bg-indigo-400';
        else if (data.score >= 40) color = 'bg-amber-400';

        return (
          <motion.div key={key} variants={item} className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-300">{data.label}</span>
              <span className="text-gray-400 font-medium">{data.score}/100</span>
            </div>
            <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${data.score}%` }}
                transition={{ duration: 1, delay: 0.2 }}
                className={`h-full ${color}`}
              />
            </div>
          </motion.div>
        );
      })}
    </motion.div>
  );
};
