import React from 'react';
import { Link, useLocation } from 'react-router-dom';

export const Navbar: React.FC = () => {
  const location = useLocation();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-gray-950/50 backdrop-blur-xl border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center gap-2">
              <span className="text-2xl">⚡</span>
              <span className="font-bold text-xl bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-500">
                ResumeForge AI
              </span>
            </Link>
          </div>
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              <Link
                to="/"
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  location.pathname === '/'
                    ? 'bg-white/10 text-white'
                    : 'text-gray-300 hover:bg-white/5 hover:text-white'
                }`}
              >
                Home
              </Link>
              {location.pathname.startsWith('/analysis') && (
                <Link
                  to={location.pathname}
                  className="bg-white/10 text-white px-3 py-2 rounded-md text-sm font-medium"
                >
                  Analysis
                </Link>
              )}
              {location.pathname.startsWith('/tailor') && (
                <Link
                  to={location.pathname}
                  className="bg-white/10 text-white px-3 py-2 rounded-md text-sm font-medium"
                >
                  Tailor
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};
