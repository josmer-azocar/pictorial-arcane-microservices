import React, { useEffect, useRef, useState } from 'react';

interface Star {
  x: number; y: number;
  radius: number;
  alpha: number;
  speed: number;
  phase: number;
}

function useStarCanvas(canvasRef: React.RefObject<HTMLCanvasElement>) {
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    const stars: Star[] = [];
    const COUNT = 120;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    for (let i = 0; i < COUNT; i++) {
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 1.8 + 0.3,
        alpha: Math.random(),
        speed: Math.random() * 0.015 + 0.005,
        phase: Math.random() * Math.PI * 2,
      });
    }

    let t = 0;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      t += 0.016;
      for (const s of stars) {
        const alpha = 0.15 + 0.85 * Math.abs(Math.sin(t * s.speed + s.phase));
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(192, 132, 252, ${alpha * 0.8})`;
        ctx.fill();
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

export default function ClosingSlide() {
  const [visible, setVisible] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null!);
  useStarCanvas(canvasRef);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 300);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="h-full w-full relative overflow-hidden flex items-center justify-center"
      style={{ background: 'radial-gradient(ellipse at 40% 40%, #1a0530 0%, #0a0012 60%, #000 100%)' }}
    >
      {/* Star canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{ zIndex: 0 }}
      />

      {/* Large ambient glows */}
      <div className="absolute w-[600px] h-[600px] rounded-full blur-[160px] opacity-[0.08] pointer-events-none -top-24 -left-24 bg-arcane-purple" />
      <div className="absolute w-[500px] h-[500px] rounded-full blur-[140px] opacity-[0.06] pointer-events-none -bottom-20 -right-20 bg-arcane-lavender" />

      {/* Dot grid */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.04]"
        style={{ backgroundImage: 'radial-gradient(#8b2fc9 1.5px, transparent 1.5px)', backgroundSize: '24px 24px' }}
      />

      <div className="flex items-center justify-center h-full w-full relative z-10 px-6">
        <div
          className="flex flex-row items-center justify-center gap-16 max-w-4xl mx-auto"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? 'scale(1) translateY(0)' : 'scale(0.88) translateY(24px)',
            transition: 'opacity 1s cubic-bezier(0.4, 0, 0.2, 1), transform 1s cubic-bezier(0.4, 0, 0.2, 1)',
          }}
        >
          {/* Pictorial Arcane Logo */}
          <div className="text-center">
            {/* Animated glowing logo */}
            <span
              className="font-logo text-5xl md:text-6xl block"
              style={{
                background: 'linear-gradient(135deg, #7c3aed 0%, #c084fc 30%, #ffd700 55%, #c084fc 80%, #7c3aed 100%)',
                backgroundSize: '300% auto',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                animation: 'gradient-shift 4s linear infinite',
                filter: 'drop-shadow(0 0 20px rgba(192, 132, 252, 0.4))',
              }}
            >
              PICTORIAL ARCANE
            </span>
            <p className="text-[10px] font-mono text-white/40 uppercase tracking-widest mt-3">
              Microservicios · Políglota · Escalable
            </p>

            {/* Tech chips */}
            <div className="flex flex-wrap justify-center gap-2 mt-5">
              {['PostgreSQL', 'MongoDB', 'Cassandra', 'Neo4j', 'Spring Boot'].map((tech, i) => (
                <span
                  key={tech}
                  className="px-3 py-1 rounded-full text-[9px] font-mono uppercase tracking-wider border animate-slide-up"
                  style={{
                    animationDelay: `${0.5 + i * 0.1}s`,
                    borderColor: 'rgba(192, 132, 252, 0.2)',
                    color: 'rgba(192, 132, 252, 0.7)',
                    background: 'rgba(124, 58, 237, 0.06)',
                  }}
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>

          {/* Vertical divider */}
          <div className="h-32 w-px relative flex-shrink-0 hidden sm:block">
            <div
              className="absolute inset-0"
              style={{
                background: 'linear-gradient(to bottom, transparent, rgba(192, 132, 252, 0.5), transparent)',
                boxShadow: '0 0 8px rgba(192, 132, 252, 0.3)',
                animation: 'pulseGlow 3s ease-in-out infinite',
              }}
            />
          </div>

          {/* UNEG */}
          <div className="text-center">
            <span className="font-display font-bold text-2xl md:text-3xl text-white/80 tracking-tight block">
              UNEG
            </span>
            <p className="text-[10px] font-mono text-white/35 uppercase tracking-widest mt-2 max-w-[200px] mx-auto">
              Universidad Nacional Experimental de Guayana
            </p>
            <div className="mt-5 relative inline-block">
              <div className="absolute inset-0 blur-xl opacity-30 bg-white rounded-full" />
              <img
                src="/assets/uneg-logo.png"
                alt="UNEG"
                className="relative w-[160px] mx-auto object-contain"
                style={{ filter: 'brightness(1.1) drop-shadow(0 4px 12px rgba(255,255,255,0.1))' }}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
