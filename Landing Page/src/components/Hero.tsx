import React from 'react';
import { ArrowDown, Compass } from 'lucide-react';

interface HeroProps {
  onNavigate?: (index: number) => void;
}

const SLIDE_INDEX: Record<string, number> = {
  architecture: 2,
  'live-demo': 8
};

export default function Hero({ onNavigate }: HeroProps) {

  const handleNavigate = (id: string) => {
    const index = SLIDE_INDEX[id];
    if (index !== undefined && onNavigate) onNavigate(index);
  };

  return (
    <section 
      id="hero" 
      className="relative min-h-screen flex items-center justify-center pt-24 overflow-hidden bg-black select-none"
    >
      {/* Background image */}
      <img 
        src="/assets/p1.png" 
        alt="" 
        className="absolute inset-0 w-full h-full object-cover select-none pointer-events-none"
      />
      <div className="absolute inset-0 bg-black/60" />

      {/* Warm museum spotlight from above */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_25%_at_50%_0%,rgba(255,200,100,0.12)_0%,transparent_70%)]" />
      
      {/* Soft ambient gallery light */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_50%,rgba(255,255,255,0.04)_0%,transparent_70%)]" />

      {/* Vignette — darker edges, bottom-left más claro para el capibara */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_75%_70%_at_55%_45%,transparent_35%,rgba(0,0,0,0.65)_100%)]" />

      {/* Subtle Glowing Backdrop Orbs */}
      <div className="absolute top-1/4 left-1/4 w-80 h-80 rounded-full bg-arcane-purple/[0.03] blur-[120px] glow-backdrop"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-[#3d0066]/[0.04] blur-[150px] glow-backdrop" style={{ animationDelay: '3s' }}></div>
      <div className="absolute top-1/3 right-1/3 w-64 h-64 rounded-full bg-arcane-lavender/[0.02] blur-[100px] glow-backdrop" style={{ animationDelay: '6s' }}></div>

        <div className="relative w-full max-w-7xl px-4 sm:px-6 lg:px-8 ml-4 sm:ml-8 lg:ml-16 text-left z-10 py-12">
        {/* Welcome intro */}
        <p className="font-display text-lg sm:text-xl text-white/70 font-light mb-2 tracking-wide w-full drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
          Pictorial Arcane <span className="text-arcane-purple font-semibold">te da la bienvenida.</span>
        </p>

        {/* Title with purple glow behind */}
        <div className="relative w-full mb-6">
          <div className="relative w-full mb-6">
            <div className="absolute inset-0 bg-arcane-purple/25 blur-3xl rounded-full scale-150"></div>
            <p className="relative font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-white/90 font-bold drop-shadow-[0_4px_12px_rgba(0,0,0,0.9)]">
              El museo que vive en <span className="text-arcane-purple">múltiples dimensiones</span>.
            </p>
          </div>
        </div>










        {/* Promo text */}
        <p className="text-white/80 text-sm sm:text-base mb-6 w-full font-sans drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
          Regístrate ahora y desbloquea acceso exclusivo a colecciones únicas por solo $10
        </p>

        {/* Double customized Call To Actions */}
        <div className="flex justify-start gap-4 w-full">
          <button
            id="cta-btn-architecture"
            onClick={() => handleNavigate('architecture')}
            className="w-full sm:w-auto px-8 py-4 rounded-xl text-sm font-bold tracking-wide uppercase transition-all duration-300 bg-gradient-to-r from-arcane-purple-dark via-arcane-purple to-arcane-purple-dark text-white shadow-[0_4px_25px_rgba(139,47,201,0.4)] hover:shadow-[0_4px_35px_rgba(139,47,201,0.6)] hover:scale-105 active:scale-95 cursor-pointer border border-arcane-lavender/30 flex items-center justify-center gap-2 group-hover:bg-opacity-90"
          >
            Regístrate
            <ArrowDown size={16} className="text-arcane-pale animate-bounce" />
          </button>

          <button
            id="cta-btn-livedemo"
            onClick={() => handleNavigate('live-demo')}
            className="w-full sm:w-auto px-8 py-4 rounded-xl text-sm font-bold tracking-wide uppercase transition-all duration-300 bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-200 hover:border-arcane-purple/50 hover:scale-105 active:scale-95 cursor-pointer flex items-center justify-center gap-2"
          >
            Live Demo
            <Compass size={16} className="text-arcane-purple" />
          </button>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 opacity-40 hover:opacity-70 transition cursor-pointer" onClick={() => handleNavigate('architecture')}>
          <span className="text-[10px] uppercase tracking-widest font-mono text-gray-400">Ver proyecto</span>
          <div className="h-6 w-4 border border-gray-400 rounded-full flex justify-center p-0.5">
            <span className="h-1.5 w-1 bg-arcane-purple rounded-full animate-scroll-dot"></span>
          </div>
        </div>
      </div>
      
      {/* Inline animations for dot scroll */}
      <style>{`
        @keyframes scrollDot {
          0% { transform: translateY(0); opacity: 1; }
          100% { transform: translateY(8px); opacity: 0; }
        }
        .animate-scroll-dot {
          animation: scrollDot 1.8s infinite ease-in-out;
        }
      `}</style>
    </section>
  );
}
