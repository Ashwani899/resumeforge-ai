import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { Navbar } from './components/layout/Navbar';
import { HomePage } from './pages/HomePage';
import { AnalysisPage } from './pages/AnalysisPage';
import { TailoringPage } from './pages/TailoringPage';

function App() {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-[#06060e] text-gray-100 font-sans selection:bg-indigo-500/30">
      <Navbar />
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<HomePage />} />
          <Route path="/analysis/:id" element={<AnalysisPage />} />
          <Route path="/tailor/:id" element={<TailoringPage />} />
        </Routes>
      </AnimatePresence>
    </div>
  );
}

export default App;
