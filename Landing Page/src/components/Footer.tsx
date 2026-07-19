import React from 'react';
import { GraduationCap, Github, Globe } from 'lucide-react';

export default function Footer() {
  return (
    <footer
      className="text-white py-14 px-4 sm:px-6 lg:px-8 select-none relative overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #140523 0%, #0a0a12 60%, #0a0a0a 100%)' }}
    >
      {/* Ambient glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-40 blur-[80px] opacity-[0.07] bg-arcane-purple pointer-events-none" />

      {/* Dot grid */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{ backgroundImage: 'radial-gradient(#8b2fc9 1px, transparent 1px)', backgroundSize: '24px 24px' }}
      />

      <div className="max-w-4xl mx-auto text-center space-y-7 relative z-10">

        {/* Badge icon */}
        <div className="h-14 w-14 rounded-2xl bg-arcane-purple/15 border border-arcane-purple/20 flex items-center justify-center mx-auto shadow-[0_0_20px_rgba(124,58,237,0.15)]">
          <GraduationCap size={28} className="text-arcane-lavender" />
        </div>

        {/* University name */}
        <div>
          <span className="font-display font-semibold tracking-wider text-sm sm:text-base uppercase text-white/90">
            Universidad Nacional Experimental de Guayana
          </span>
          <p className="text-[10px] font-mono text-white/40 uppercase tracking-widest mt-1.5">
            Vice-rectorado Académico · Coordinación de Ingeniería en Informática
          </p>
        </div>

        {/* Shimmer divider */}
        <div className="relative h-px w-32 mx-auto overflow-hidden">
          <div className="absolute inset-0 bg-white/15" />
          <div
            className="absolute inset-0"
            style={{
              background: 'linear-gradient(90deg, transparent 0%, rgba(192,132,252,0.7) 50%, transparent 100%)',
              backgroundSize: '200% 100%',
              animation: 'shimmer-bg 2.5s linear infinite',
            }}
          />
        </div>

        {/* Details */}
        <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-[11px] font-mono text-white/50">
          <span>
            Asignatura: <strong className="text-white/80">Sistemas de Bases de Datos II (SBDII)</strong>
          </span>
          <span className="hidden sm:inline text-white/20">|</span>
          <span>
            Profesora: <strong className="text-white/80">Prof. Clinia Cordero</strong>
          </span>
          <span className="hidden sm:inline text-white/20">|</span>
          <span>
            Período Académico: <strong className="text-arcane-lavender">2026-I</strong>
          </span>
        </div>

        {/* Tech tag row */}
        <div className="flex flex-wrap justify-center gap-2">
          {['PostgreSQL', 'MongoDB', 'Cassandra', 'Neo4j', 'Spring Boot', 'React', 'Microservicios'].map(t => (
            <span
              key={t}
              className="px-2.5 py-0.5 rounded-full text-[9px] font-mono uppercase tracking-wider text-white/40 border border-white/10 hover:text-arcane-lavender hover:border-arcane-lavender/30 transition-all duration-300 cursor-default"
            >
              {t}
            </span>
          ))}
        </div>

        {/* Copyright */}
        <p className="text-[10px] font-mono text-white/30">
          &copy; 2026 Pictorial Arcane UNEG. Protegido bajo licenciamiento académico de código abierto.
        </p>
      </div>
    </footer>
  );
}
