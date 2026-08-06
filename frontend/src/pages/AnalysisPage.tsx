import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getAnalysis } from '../services/api';
import type { AnalysisResponse } from '../types';
import { ATSScoreGauge } from '../components/analysis/ATSScoreGauge';
import { ScoreBreakdown } from '../components/analysis/ScoreBreakdown';
import { KeywordAnalysis } from '../components/analysis/KeywordAnalysis';
import { SuggestionsList } from '../components/analysis/SuggestionsList';

export const AnalysisPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const [data, setData] = useState<AnalysisResponse | null>(location.state?.data || null);
  const [loading, setLoading] = useState(!data);
  const [activeTab, setActiveTab] = useState<'score' | 'keywords' | 'suggestions'>('score');

  useEffect(() => {
    if (!data && id) {
      const fetchData = async () => {
        try {
          const result = await getAnalysis(id);
          setData(result);
        } catch (error) {
          console.error(error);
          navigate('/');
        } finally {
          setLoading(false);
        }
      };
      fetchData();
    }
  }, [id, data, navigate]);

  if (loading || !data) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }}
      className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto"
    >
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Resume Analysis</h1>
          <p className="text-gray-400">Analyzing: <span className="text-gray-200 font-medium">{data.filename}</span></p>
        </div>
        <button
          onClick={() => navigate(`/tailor/${data.id}`)}
          className="px-6 py-2.5 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl text-white font-medium hover:shadow-lg hover:shadow-indigo-500/25 transition-all"
        >
          Tailor for Job Description
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-6">
          <ATSScoreGauge score={data.overall_score} />
          <ScoreBreakdown breakdown={data.breakdown} />
        </div>
        
        <div className="lg:col-span-2 bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-xl">
          <div className="flex border-b border-white/10 mb-6 pb-2 gap-6">
            {(['score', 'keywords', 'suggestions'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-2 px-1 relative text-sm font-medium transition-colors ${
                  activeTab === tab ? 'text-indigo-400' : 'text-gray-400 hover:text-gray-200'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
                {activeTab === tab && (
                  <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-400 rounded-full" />
                )}
              </button>
            ))}
          </div>

          <div className="min-h-[400px]">
            {activeTab === 'score' && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-gray-300 space-y-4">
                <h3 className="text-xl font-medium text-gray-200">Analysis Summary</h3>
                <p>Based on our ATS analysis, your resume has a score of {data.overall_score}/100.</p>
                <p>To improve your score, focus on addressing the suggestions provided and tailoring your keywords to specific job descriptions.</p>
              </motion.div>
            )}
            
            {activeTab === 'keywords' && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                <KeywordAnalysis keywords={data.keywords} />
              </motion.div>
            )}
            
            {activeTab === 'suggestions' && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                <SuggestionsList resumeId={data.id} initialSuggestions={data.suggestions} />
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};
