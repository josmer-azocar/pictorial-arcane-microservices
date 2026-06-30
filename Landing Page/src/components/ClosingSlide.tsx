import React, { useEffect, useState } from 'react';

export default function ClosingSlide() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 300);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section
      className="h-full w-full bg-[#f5f0ff] relative overflow-hidden flex items-center justify-center"
    >
      {/* Ambient glow */}
      <div className="absolute w-[400px] h-[400px] rounded-full blur-[100px] opacity-[0.12] pointer-events-none -top-12 -left-12 bg-purple-500" />
      <div className="absolute w-[450px] h-[450px] rounded-full blur-[110px] opacity-[0.08] pointer-events-none -bottom-16 -right-16 bg-arcane-lavender" />

      {/* Dot grid texture */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.04]" style={{ backgroundImage: 'radial-gradient(#8b2fc9 1.5px, transparent 1.5px)', backgroundSize: '24px 24px' }} />

      <div className="flex items-center justify-center h-full w-full relative z-10 px-6">
        <div
          className="flex flex-row items-center justify-center gap-12 max-w-4xl mx-auto"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? 'scale(1) translateY(0)' : 'scale(0.9) translateY(20px)',
            transition: 'opacity 1s cubic-bezier(0.4, 0, 0.2, 1), transform 1s cubic-bezier(0.4, 0, 0.2, 1)',
          }}
        >
          {/* Pictorial Arcane Logo */}
          <div className="text-center">
            <span className="font-logo text-5xl md:text-6xl bg-gradient-to-r from-arcane-purple to-arcane-lavender bg-clip-text text-transparent drop-shadow-md">
              PICTORIAL ARCANE
            </span>
            <p className="text-[10px] font-mono text-gray-400 uppercase tracking-widest mt-2">
              Microservicios · Políglota · Escalable
            </p>
          </div>

          {/* Vertical divider */}
          <div className="h-24 w-px bg-gradient-to-b from-transparent via-arcane-purple/30 to-transparent rounded-full" />

          {/* UNEG */}
          <div className="text-center">
            <span className="font-display font-bold text-2xl md:text-3xl text-arcane-dark/70 tracking-tight">
              UNEG
            </span>
            <p className="text-[10px] font-mono text-gray-400 uppercase tracking-widest mt-2 max-w-[200px]">
              Universidad Nacional Experimental de Guayana
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
