import React, { useState, useEffect, useCallback } from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Team from './components/Team';
import ArchitectureDiagram from './components/ArchitectureDiagram';
import CapTheorem from './components/CapTheorem';
import PolyglotDictionary from './components/PolyglotDictionary';
import Neo4jGraphs from './components/Neo4jGraphs';
import ApiDocumentation from './components/ApiDocumentation';
import About from './components/About';
import LiveDemo from './components/LiveDemo';
import ClosingSlide from './components/ClosingSlide';
import Footer from './components/Footer';

const SLIDE_IDS = [
  'hero', 'team', 'architecture', 'cap', 'dictionary',
  'neo4j-graphs', 'api-documentation', 'about', 'live-demo', 'closing'
];

export default function App() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [demoStep, setDemoStep] = useState(0);
  const [highlightedEngine, setHighlightedEngine] = useState<string | null>(null);

  const goToSlide = useCallback((index: number) => {
    if (index >= 0 && index < SLIDE_IDS.length) {
      setCurrentSlide(index);
    }
  }, []);

  const nextSlide = useCallback(() => {
    if (currentSlide < SLIDE_IDS.length - 1) {
      setCurrentSlide(s => s + 1);
    }
  }, [currentSlide]);

  const prevSlide = useCallback(() => {
    if (currentSlide > 0) {
      setCurrentSlide(s => s - 1);
    }
  }, [currentSlide]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown') { e.preventDefault(); nextSlide(); }
      if (e.key === 'ArrowUp') { e.preventDefault(); prevSlide(); }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [nextSlide, prevSlide]);

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (e.deltaY > 0) nextSlide();
      else prevSlide();
    };
    window.addEventListener('wheel', handleWheel, { passive: true });
    return () => window.removeEventListener('wheel', handleWheel);
  }, [nextSlide, prevSlide]);

  const handleStepChange = (step: number) => {
    setDemoStep(step);
    if (step > 0) setHighlightedEngine(null);
  };

  const handleEngineHighlight = (engine: string | null) => {
    if (demoStep === 0 || demoStep === 4) setHighlightedEngine(engine);
  };

  return (
    <div className="bg-white text-gray-900 font-sans selection:bg-arcane-purple/40 selection:text-white">
      <Navbar activeSection={SLIDE_IDS[currentSlide]} onNavigate={goToSlide} />

      <main className="h-screen w-full overflow-hidden relative">
        <div
          className="flex flex-col transition-transform duration-700 ease-in-out will-change-transform"
          style={{ transform: `translateY(-${currentSlide * 100}vh)` }}
        >
          <div id="hero" className="h-screen w-full flex-shrink-0 overflow-y-auto pb-16"><Hero onNavigate={goToSlide} /></div>
          <div id="team" className="h-screen w-full flex-shrink-0 overflow-y-auto pb-16 bg-arcane-purple-dark/20"><Team /></div>
          <div id="architecture" className="h-screen w-full flex-shrink-0 overflow-y-auto pb-16 bg-arcane-lavender/20"><ArchitectureDiagram onNodeHover={handleEngineHighlight} /></div>
          <div id="cap" className="h-screen w-full flex-shrink-0 overflow-y-auto pb-16 bg-arcane-purple-dark/20"><CapTheorem onEngineSelect={handleEngineHighlight} /></div>
          <div id="dictionary" className="h-screen w-full flex-shrink-0 overflow-y-auto pb-16 bg-arcane-lavender/20"><PolyglotDictionary onEngineSelect={handleEngineHighlight} /></div>
          <div id="neo4j-graphs" className="h-screen w-full flex-shrink-0 overflow-y-auto pb-16 bg-arcane-purple-dark/20"><Neo4jGraphs /></div>
          <div id="api-documentation" className="h-screen w-full flex-shrink-0 overflow-y-auto pb-16 bg-arcane-lavender/20"><ApiDocumentation /></div>
          <div id="about" className="h-screen w-full flex-shrink-0 overflow-y-auto pb-16 bg-arcane-purple-dark/20"><About /></div>
          <div id="live-demo" className="h-screen w-full flex-shrink-0 overflow-y-auto pb-16 bg-arcane-lavender/20"><LiveDemo onStepChange={handleStepChange} onNavigateFrontend={() => window.open('http://localhost:5173', '_blank')} /></div>
          <div id="closing" className="h-screen w-full flex-shrink-0 overflow-y-auto bg-arcane-purple-dark/20"><ClosingSlide /><Footer /></div>
        </div>

        {/* Navigation arrows */}
        <div className="fixed bottom-8 right-8 flex flex-col gap-2 z-50">
          {currentSlide > 0 && (
            <button onClick={prevSlide} className="w-10 h-10 rounded-full bg-white/90 border border-arcane-purple/20 shadow-lg flex items-center justify-center text-arcane-purple hover:bg-arcane-purple hover:text-white transition-all cursor-pointer">
              <ChevronUp size={20} />
            </button>
          )}
          {currentSlide < SLIDE_IDS.length - 1 && (
            <button onClick={nextSlide} className="w-10 h-10 rounded-full bg-white/90 border border-arcane-purple/20 shadow-lg flex items-center justify-center text-arcane-purple hover:bg-arcane-purple hover:text-white transition-all cursor-pointer">
              <ChevronDown size={20} />
            </button>
          )}
        </div>

        {/* Dot indicator */}
        <div className="fixed bottom-8 left-8 flex flex-col gap-2 z-50">
          {SLIDE_IDS.map((_, idx) => (
            <button key={idx} onClick={() => goToSlide(idx)}
              className={`w-2.5 h-2.5 rounded-full transition-all cursor-pointer ${
                idx === currentSlide ? 'bg-arcane-purple scale-125' : 'bg-gray-300 hover:bg-gray-400'
              }`}
            />
          ))}
        </div>
      </main>
    </div>
  );
}