import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface ATSScoreGaugeProps {
  score: number;
}

export const ATSScoreGauge: React.FC<ATSScoreGaugeProps> = ({ score }) => {
  const [animatedScore, setAnimatedScore] = useState(0);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedScore(score);
    }, 300);
    return () => clearTimeout(timer);
  }, [score]);

  const radius = 52;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (animatedScore / 100) * circumference;

  let color = 'text-red-500';
  let stroke = 'stroke-red-500';
  if (score >= 85) {
    color = 'text-emerald-400';
    stroke = 'stroke-emerald-400';
  } else if (score >= 65) {
    color = 'text-indigo-400';
    stroke = 'stroke-indigo-400';
  } else if (score >= 40) {
    color = 'text-amber-400';
    stroke = 'stroke-amber-400';
  }

  return (
    <div className="flex flex-col items-center justify-center p-6 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-xl">
      <div className="relative w-32 h-32">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 120 120">
          <circle
            cx="60"
            cy="60"
            r={radius}
            className="stroke-white/10 fill-none"
            strokeWidth="8"
          />
          <motion.circle
            cx="60"
            cy="60"
            r={radius}
            className={`${stroke} fill-none drop-shadow-lg`}
            strokeWidth="8"
            strokeLinecap="round"
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            style={{ strokeDasharray: circumference }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={`text-3xl font-bold ${color}`}>
            {score}
          </span>
        </div>
      </div>
      <div className="mt-4 text-center">
        <h3 className="text-lg font-medium text-gray-200">ATS Match Score</h3>
        <p className="text-sm text-gray-400 mt-1">
          {score >= 85 ? 'Excellent!' : score >= 65 ? 'Good, but needs work.' : 'Significant improvements needed.'}
        </p>
      </div>
    </div>
  );
};
