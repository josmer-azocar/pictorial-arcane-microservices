import React from 'react';

export default function Footer() {
  return (
    <footer className="bg-[#1a0a2e] text-white py-10 px-4 sm:px-6 lg:px-8 select-none">
      <div className="max-w-4xl mx-auto text-center space-y-5">
        {/* Icon */}
        <div className="h-12 w-12 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-xl mx-auto shadow-sm">
          🎓
        </div>

        {/* University Name */}
        <div>
          <span className="font-display font-semibold tracking-wider text-sm sm:text-base uppercase text-white/90">
            Universidad Nacional Experimental de Guayana
          </span>
          <p className="text-[10px] font-mono text-white/50 uppercase tracking-widest mt-1">
            Vice-rectorado Académico · Coordinación de Ingeniería en Informática
          </p>
        </div>

        {/* Divider */}
        <div className="w-16 h-px bg-white/20 mx-auto" />

        {/* Details */}
        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-[11px] font-mono text-white/60">
          <span>Asignatura: <strong className="text-white/80">Sistemas de Bases de Datos II (SBDII)</strong></span>
          <span className="hidden sm:inline text-white/20">|</span>
          <span>Profesora: <strong className="text-white/80">Prof. Clinia Cordero</strong></span>
          <span className="hidden sm:inline text-white/20">|</span>
          <span>Período Académico: <strong className="text-purple-300">2026-I</strong></span>
        </div>

        {/* Copyright */}
        <p className="text-[10px] font-mono text-white/40">
          &copy; 2026 Pictorial Arcane UNEG. Protegido bajo licenciamiento académico de código abierto.
        </p>
      </div>
    </footer>
  );
}
