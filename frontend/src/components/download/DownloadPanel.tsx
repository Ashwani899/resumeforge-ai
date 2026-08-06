import React, { useState } from 'react';
import { downloadResume } from '../../services/api';

interface DownloadPanelProps {
  resumeId: string;
}

export const DownloadPanel: React.FC<DownloadPanelProps> = ({ resumeId }) => {
  const [downloading, setDownloading] = useState<string | null>(null);

  const handleDownload = async (format: string) => {
    setDownloading(format);
    try {
      await downloadResume(resumeId, format);
    } catch (error) {
      console.error(error);
    } finally {
      setDownloading(null);
    }
  };

  return (
    <div className="bg-gradient-to-br from-indigo-900/40 to-purple-900/40 border border-indigo-500/30 rounded-2xl p-6 backdrop-blur-xl mt-6 text-center">
      <h3 className="text-xl font-medium text-white mb-2">Download Improved Resume</h3>
      <p className="text-indigo-200 text-sm mb-6">Your tailored resume is ready to go!</p>
      
      <div className="flex justify-center gap-4">
        <button
          onClick={() => handleDownload('pdf')}
          disabled={downloading !== null}
          className="px-6 py-2.5 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl text-white font-medium transition-colors flex items-center gap-2"
        >
          {downloading === 'pdf' ? (
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : '📄'}
          Download PDF
        </button>
        <button
          onClick={() => handleDownload('docx')}
          disabled={downloading !== null}
          className="px-6 py-2.5 bg-indigo-500 hover:bg-indigo-600 rounded-xl text-white font-medium transition-colors flex items-center gap-2"
        >
          {downloading === 'docx' ? (
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : '📝'}
          Download DOCX
        </button>
      </div>
    </div>
  );
};
