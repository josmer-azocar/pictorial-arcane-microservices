import React, { useEffect, useRef } from 'react';
import { ArrowDown, Compass, Sparkles } from 'lucide-react';

interface HeroProps {
  onNavigate?: (index: number) => void;
}

const SLIDE_INDEX: Record<string, number> = {
  architecture: 2,
  'live-demo': 8
};

/* ── Particle Canvas ── */
interface Particle {
  x: number; y: number;
  vx: number; vy: number;
  radius: number;
  alpha: number;
}

function useParticleCanvas(canvasRef: React.RefObject<HTMLCanvasElement>) {
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    const particles: Particle[] = [];
    const COUNT = 70;
    const MAX_DIST = 130;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    for (let i = 0; i < COUNT; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        radius: Math.random() * 2.5 + 0.8,
        alpha: Math.random() * 0.6 + 0.3,
      });
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Update + draw particles
      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(192, 132, 252, ${p.alpha})`;
        ctx.fill();
      }

      // Draw connections
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < MAX_DIST) {
            const opacity = (1 - dist / MAX_DIST) * 0.35;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(139, 47, 201, ${opacity})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }
      }

      animId = requestAnimationFrame(draw);
    };

    draw();
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, [canvasRef]);
}

export default function Hero({ onNavigate }: HeroProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null!);
  useParticleCanvas(canvasRef);

  const handleNavigate = (id: string) => {
    const index = SLIDE_INDEX[id];
    if (index !== undefined && onNavigate) onNavigate(index);
  };

  const words = ['El', 'museo', 'que', 'vive', 'en'];
  const highlightWords = ['múltiples', 'dimensiones.'];

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
      <div className="absolute inset-0 bg-black/65" />

      {/* Particle Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{ zIndex: 2 }}
      />

      {/* Warm museum spotlight */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_25%_at_50%_0%,rgba(255,200,100,0.10)_0%,transparent_70%)]" style={{ zIndex: 1 }} />

      {/* Soft ambient gallery light */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_50%,rgba(255,255,255,0.04)_0%,transparent_70%)]" style={{ zIndex: 1 }} />

      {/* Vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_75%_70%_at_55%_45%,transparent_35%,rgba(0,0,0,0.65)_100%)]" style={{ zIndex: 1 }} />

      {/* Orbiting orbs */}
      <div className="absolute top-1/2 left-1/2 pointer-events-none" style={{ zIndex: 1 }}>
        <div
          className="absolute w-3 h-3 rounded-full bg-arcane-lavender/60 blur-sm"
          style={{ animation: 'orbit 22s linear infinite' }}
        />
        <div
          className="absolute w-2 h-2 rounded-full bg-arcane-gold/50 blur-sm"
          style={{ animation: 'orbit-reverse 15s linear infinite' }}
        />
      </div>

      {/* Glow backdrop orbs */}
      <div className="absolute top-1/4 left-1/4 w-80 h-80 rounded-full bg-arcane-purple/[0.04] blur-[120px] glow-backdrop" style={{ zIndex: 1 }} />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-[#3d0066]/[0.05] blur-[150px] glow-backdrop" style={{ animationDelay: '3s', zIndex: 1 }} />
      <div className="absolute top-1/3 right-1/3 w-64 h-64 rounded-full bg-arcane-lavender/[0.03] blur-[100px] glow-backdrop" style={{ animationDelay: '6s', zIndex: 1 }} />

      <div className="relative w-full max-w-7xl px-4 sm:px-6 lg:px-8 ml-4 sm:ml-8 lg:ml-16 text-left z-10 py-12">

        {/* Animated top badge */}
        <div
          className="inline-flex items-center gap-2 mb-6 px-4 py-2 rounded-full border border-arcane-lavender/25 bg-white/5 backdrop-blur-md badge-float"
          style={{ animationDelay: '0s' }}
        >
          <Sparkles size={12} className="text-arcane-gold" />
          <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-white/70">
            Sistema Políglota · Microservicios · Arte Digital
          </span>
          <Sparkles size={12} className="text-arcane-gold" />
        </div>

        {/* Welcome intro */}
        <p className="font-display text-lg sm:text-xl text-white/70 font-light mb-4 tracking-wide drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] animate-slide-up stagger-1">
          Pictorial Arcane <span className="text-arcane-lavender font-semibold">te da la bienvenida.</span>
        </p>

        {/* Animated title — word by word */}
        <div className="relative mb-8" style={{ perspective: '600px' }}>
          <div className="absolute inset-0 bg-arcane-purple/20 blur-3xl rounded-full scale-150 pointer-events-none" />
          <h1 className="relative font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-white/90 font-bold drop-shadow-[0_4px_12px_rgba(0,0,0,0.9)] leading-tight">
            {words.map((word, i) => (
              <span
                key={word}
                className="inline-block mr-3"
                style={{
                  animation: `word-appear 0.7s cubic-bezier(0.22,1,0.36,1) ${i * 0.12}s both`,
                }}
              >
                {word}
              </span>
            ))}
            <br />
            {highlightWords.map((word, i) => (
              <span
                key={word}
                className="inline-block mr-3 text-gradient-arcane"
                style={{
                  animation: `word-appear 0.7s cubic-bezier(0.22,1,0.36,1) ${(words.length + i) * 0.12}s both`,
                }}
              >
                {word}
              </span>
            ))}
          </h1>
        </div>

        {/* Promo text */}
        <p
          className="text-white/75 text-sm sm:text-base mb-8 font-sans drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] max-w-lg animate-slide-up"
          style={{ animationDelay: '0.7s' }}
        >
          Regístrate ahora y desbloquea acceso exclusivo a colecciones únicas por solo{' '}
          <span className="text-arcane-gold font-bold">$10</span>
        </p>

        {/* CTAs */}
        <div
          className="flex flex-wrap justify-start gap-4 animate-slide-up"
          style={{ animationDelay: '0.9s' }}
        >
          <button
            id="cta-btn-architecture"
            onClick={() => handleNavigate('architecture')}
            className="btn-shimmer relative w-full sm:w-auto px-8 py-4 rounded-xl text-sm font-bold tracking-wide uppercase transition-all duration-300 bg-gradient-to-r from-arcane-purple-dark via-arcane-purple to-arcane-purple-dark text-white shadow-[0_4px_25px_rgba(124,58,237,0.45)] hover:shadow-[0_6px_40px_rgba(124,58,237,0.7)] hover:scale-105 active:scale-95 cursor-pointer border border-arcane-lavender/30 flex items-center justify-center gap-2 animate-glow-pulse"
          >
            Regístrate
            <ArrowDown size={16} className="text-arcane-pale animate-bounce" />
          </button>

          <button
            id="cta-btn-livedemo"
            onClick={() => handleNavigate('live-demo')}
            className="btn-shimmer w-full sm:w-auto px-8 py-4 rounded-xl text-sm font-bold tracking-wide uppercase transition-all duration-300 bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white border border-white/20 hover:border-arcane-lavender/50 hover:scale-105 active:scale-95 cursor-pointer flex items-center justify-center gap-2"
          >
            Live Demo
            <Compass size={16} className="text-arcane-lavender" />
          </button>
        </div>

        {/* Scroll indicator */}
        <div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 opacity-40 hover:opacity-70 transition cursor-pointer"
          onClick={() => handleNavigate('architecture')}
        >
          <span className="text-[10px] uppercase tracking-widest font-mono text-gray-400">Ver proyecto</span>
          <div className="h-6 w-4 border border-gray-400 rounded-full flex justify-center p-0.5">
            <span className="h-1.5 w-1 bg-arcane-purple rounded-full animate-scroll-dot" />
          </div>
        </div>
      </div>
    </section>
  );
}
