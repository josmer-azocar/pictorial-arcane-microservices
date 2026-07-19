import React, { useState, useEffect, useCallback, useRef } from 'react';
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

  const currentSlideRef = useRef(currentSlide);
  currentSlideRef.current = currentSlide;

  const goToSlide = useCallback((index: number) => {
    if (index >= 0 && index < SLIDE_IDS.length) {
      setCurrentSlide(index);
    }
  }, []);

  const nextSlide = useCallback(() => {
    if (currentSlideRef.current < SLIDE_IDS.length - 1) {
      setCurrentSlide(s => s + 1);
    }
  }, []);

  const prevSlide = useCallback(() => {
    if (currentSlideRef.current > 0) {
      setCurrentSlide(s => s - 1);
    }
  }, []);

  const nextSlideRef = useRef(nextSlide);
  nextSlideRef.current = nextSlide;
  const prevSlideRef = useRef(prevSlide);
  prevSlideRef.current = prevSlide;

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown') { e.preventDefault(); nextSlideRef.current(); }
      if (e.key === 'ArrowUp') { e.preventDefault(); prevSlideRef.current(); }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      const slideEl = document.getElementById(SLIDE_IDS[currentSlideRef.current]);
      if (slideEl) {
        const { scrollTop, scrollHeight, clientHeight } = slideEl;
        const atTop = scrollTop <= 0;
        const atBottom = Math.abs(scrollHeight - clientHeight - scrollTop) < 2;

        if (e.deltaY > 0) {
          if (!atBottom) return;
          nextSlideRef.current();
        } else {
          if (!atTop) return;
          prevSlideRef.current();
        }
      } else {
        if (e.deltaY > 0) nextSlideRef.current();
        else prevSlideRef.current();
      }
      e.preventDefault();
    };
    window.addEventListener('wheel', handleWheel, { passive: false });
    return () => window.removeEventListener('wheel', handleWheel);
  }, []);

  const handleStepChange = (step: number) => {
    setDemoStep(step);
    if (step > 0) setHighlightedEngine(null);
  };

  const handleEngineHighlight = (engine: string | null) => {
    if (demoStep === 0 || demoStep === 4) setHighlightedEngine(engine);
  };

  return (
    <div className="bg-[#f8f6fc] text-[#2d0050] font-sans selection:bg-arcane-lavender/50 selection:text-white">
      <Navbar activeSection={SLIDE_IDS[currentSlide]} onNavigate={goToSlide} />

      <main className="h-screen w-full overflow-hidden relative">
        <div
          className="flex flex-col transition-transform duration-700 ease-in-out will-change-transform"
          style={{ transform: `translateY(-${currentSlide * 100}vh)` }}
        >
          <div id="hero" className="h-screen w-full flex-shrink-0 overflow-y-auto"><Hero onNavigate={goToSlide} /></div>
          <div id="team" className="h-screen w-full flex-shrink-0 overflow-y-auto pb-16" style={{background:'linear-gradient(135deg, #f8f6fc 0%, #f0ebfa 100%)'}}><Team /></div>
          <div id="architecture" className="h-screen w-full flex-shrink-0 overflow-y-auto pb-16" style={{background:'linear-gradient(135deg, #f8f6fc 0%, #f0ebfa 100%)'}}><ArchitectureDiagram onNodeHover={handleEngineHighlight} /></div>
          <div id="cap" className="h-screen w-full flex-shrink-0 overflow-y-auto pb-16" style={{background:'linear-gradient(135deg, #f8f6fc 0%, #f0ebfa 100%)'}}><CapTheorem onEngineSelect={handleEngineHighlight} /></div>
          <div id="dictionary" className="h-screen w-full flex-shrink-0 overflow-y-auto pb-16" style={{background:'linear-gradient(135deg, #f8f6fc 0%, #f0ebfa 100%)'}}><PolyglotDictionary onEngineSelect={handleEngineHighlight} /></div>
          <div id="neo4j-graphs" className="h-screen w-full flex-shrink-0 overflow-y-auto pb-16" style={{background:'linear-gradient(135deg, #f8f6fc 0%, #f0ebfa 100%)'}}><Neo4jGraphs /></div>
          <div id="api-documentation" className="h-screen w-full flex-shrink-0 overflow-y-auto pb-16" style={{background:'linear-gradient(135deg, #f8f6fc 0%, #f0ebfa 100%)'}}><ApiDocumentation /></div>
          <div id="about" className="h-screen w-full flex-shrink-0 overflow-y-auto" style={{background:'linear-gradient(135deg, #f8f6fc 0%, #f0ebfa 100%)'}}><About /></div>
          <div id="live-demo" className="h-screen w-full flex-shrink-0 overflow-y-auto pb-16" style={{background:'linear-gradient(135deg, #f8f6fc 0%, #f0ebfa 100%)'}}><LiveDemo onStepChange={handleStepChange} onNavigateFrontend={() => window.open('http://localhost:5173', '_blank')} /></div>
          <div id="closing" className="h-screen w-full flex-shrink-0 overflow-y-auto"><ClosingSlide /><Footer /></div>
        </div>

        {/* Navigation arrows */}
        <div className="fixed bottom-8 right-8 flex flex-col gap-2 z-50">
          {currentSlide > 0 && (
            <button onClick={prevSlide} className="w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm border border-arcane-purple/20 shadow-lg shadow-arcane-purple/10 flex items-center justify-center text-arcane-purple hover:bg-arcane-purple hover:text-white hover:shadow-[0_0_20px_rgba(124,58,237,0.4)] transition-all duration-300 cursor-pointer">
              <ChevronUp size={20} />
            </button>
          )}
          {currentSlide < SLIDE_IDS.length - 1 && (
            <button onClick={nextSlide} className="w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm border border-arcane-purple/20 shadow-lg shadow-arcane-purple/10 flex items-center justify-center text-arcane-purple hover:bg-arcane-purple hover:text-white hover:shadow-[0_0_20px_rgba(124,58,237,0.4)] transition-all duration-300 cursor-pointer">
              <ChevronDown size={20} />
            </button>
          )}
        </div>

        {/* Dot indicator */}
        <div className="fixed bottom-8 left-8 flex flex-col gap-2 z-50">
          {SLIDE_IDS.map((_, idx) => (
            <button
              key={idx}
              onClick={() => goToSlide(idx)}
              className="cursor-pointer transition-all duration-300"
              style={{
                width: idx === currentSlide ? '20px' : '8px',
                height: '8px',
                borderRadius: '9999px',
                background: idx === currentSlide
                  ? 'linear-gradient(90deg, #7c3aed, #c084fc)'
                  : 'rgba(200,200,220,0.7)',
                boxShadow: idx === currentSlide ? '0 0 10px rgba(124,58,237,0.5)' : 'none',
                transition: 'all 0.3s ease',
              }}
            />
          ))}
        </div>
      </main>
    </div>
  );
}