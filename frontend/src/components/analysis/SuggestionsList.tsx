import React, { useState } from 'react';
import { motion } from 'framer-motion';
import type { Suggestion } from '../../types';
import { getAISuggestions } from '../../services/api';

interface SuggestionsListProps {
  resumeId: string;
  initialSuggestions?: Suggestion[];
}

export const SuggestionsList: React.FC<SuggestionsListProps> = ({ resumeId, initialSuggestions }) => {
  const [suggestions, setSuggestions] = useState<Suggestion[] | undefined>(initialSuggestions);
  const [loading, setLoading] = useState(false);

  const generateSuggestions = async () => {
    setLoading(true);
    try {
      const data = await getAISuggestions(resumeId);
      setSuggestions(data.suggestions);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  if (!suggestions && !loading) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center border border-white/10 rounded-2xl bg-white/5">
        <h3 className="text-xl font-medium text-gray-200 mb-2">Want to improve your score?</h3>
        <p className="text-gray-400 mb-6">Our AI can analyze your resume and provide specific suggestions.</p>
        <button
          onClick={generateSuggestions}
          className="px-6 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl text-white font-medium hover:opacity-90 transition-opacity"
        >
          Generate AI Suggestions
        </button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-12">
        <div className="w-8 h-8 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin mb-4" />
        <p className="text-indigo-400 animate-pulse">AI is analyzing your resume...</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-medium text-gray-200">AI Suggestions</h3>
      </div>
      <motion.div variants={container} initial="hidden" animate="show" className="space-y-4">
        {suggestions?.map((sugg, i) => (
          <motion.div key={i} variants={item} className="p-4 bg-white/5 border border-white/10 rounded-xl">
            <div className="flex items-center gap-3 mb-2">
              <span className={`px-2 py-0.5 text-xs font-bold uppercase rounded-full ${
                sugg.priority === 'high' ? 'bg-red-500/20 text-red-400' :
                sugg.priority === 'medium' ? 'bg-amber-500/20 text-amber-400' :
                'bg-emerald-500/20 text-emerald-400'
              }`}>
                {sugg.priority}
              </span>
              <span className="text-sm font-medium text-gray-400">{sugg.category}</span>
            </div>
            <p className="text-gray-200 mb-3">{sugg.text}</p>
            {sugg.example && (
              <div className="p-3 bg-gray-900 rounded-lg text-sm font-mono text-indigo-300 border border-gray-800">
                {sugg.example}
              </div>
            )}
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};
