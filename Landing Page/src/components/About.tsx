import React from 'react';
import { Search, ShoppingCart, Palette, Building2, Globe, Zap } from 'lucide-react';

const features = [
  { label: 'Catálogo de Obras', icon: Palette, color: 'text-arcane-purple' },
  { label: 'Búsqueda Semántica', icon: Search, color: 'text-arcane-purple' },
  { label: 'Compra Integrada', icon: ShoppingCart, color: 'text-arcane-purple' },
  { label: 'Museo Digital', icon: Building2, color: 'text-arcane-purple' },
  { label: 'Acceso Global', icon: Globe, color: 'text-arcane-purple' },
  { label: 'Microservicios', icon: Zap, color: 'text-arcane-purple' },
];

export default function About() {
  return (
    <section
      id="about"
      className="py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden text-white"
    >
      {/* Decorative background radial gradients */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-arcane-purple/[0.04] rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-arcane-lavender/[0.05] rounded-full blur-[100px] pointer-events-none" />

      {/* Dot pattern */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.025]"
        style={{ backgroundImage: 'radial-gradient(#8b2fc9 1.2px, transparent 1.2px)', backgroundSize: '28px 28px' }}
      />

      {/* Decorative blur circles */}
      <div className="absolute top-8 left-8 w-16 h-16 rounded-full bg-arcane-purple/20 blur-2xl opacity-[0.25] pointer-events-none" />
      <div className="absolute top-8 right-8 w-12 h-12 rounded-full bg-arcane-lavender/20 blur-xl opacity-[0.20] pointer-events-none" />
      <div className="absolute bottom-8 left-8 w-14 h-14 rounded-full bg-arcane-lavender/15 blur-xl opacity-[0.20] pointer-events-none" />
      <div className="absolute bottom-8 right-8 w-10 h-10 rounded-full bg-arcane-purple/20 blur-xl opacity-[0.25] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-14 animate-slide-up">
          <span className="inline-block text-xs font-mono uppercase tracking-[0.2em] text-arcane-purple bg-arcane-purple/10 px-4 py-1.5 rounded-full border border-arcane-purple/20">
            Quiénes Somos
          </span>
          <h2 className="font-display font-bold text-3xl sm:text-4xl md:text-5xl text-[#2d0050] mt-5 mb-4 tracking-tight">
            EXPLICACIÓN DE LA PLATAFORMA
          </h2>
          <p className="text-gray-500 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed">
            Pictorial Arcane es un museo digital que integra un motor de búsqueda
            y compra de obras de arte, sustentado en una arquitectura de bases de datos políglota.
          </p>
        </div>

        {/* 3-Column layout: bubble | image | bubble */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 items-center">

          {/* ── Left Bubble ── */}
          <div className="order-2 md:order-1 relative group perspective-card">
            {/* Speech bubble tail (desktop) */}
            <div className="absolute right-[-10px] top-1/2 -translate-y-1/2 w-5 h-5 bg-[#0f061c] border-t border-r border-purple-500/20 rotate-45 hidden md:block z-10" />

            <div className="relative p-8 rounded-2xl bg-[#0f061c]/55 border border-purple-500/20
              shadow-[0_4px_20px_rgba(124,58,237,0.08)]
              hover:shadow-[0_16px_40px_rgba(124,58,237,0.25)]
              transition-all duration-400 flex flex-col justify-center min-h-[240px]
              hover:border-arcane-purple/40 text-white"
            >
              {/* Mobile bubble tail (top) */}
              <div className="absolute top-[-10px] left-1/2 -translate-x-1/2 w-5 h-5 bg-[#0f061c] border-t border-l border-purple-500/20 rotate-45 md:hidden" />

              {/* Dot pattern inside bubble */}
              <div className="absolute inset-0 rounded-2xl overflow-hidden opacity-[0.03] pointer-events-none"
                style={{ backgroundImage: 'radial-gradient(#7c3aed 1px, transparent 1px)', backgroundSize: '20px 20px' }}
              />

              <div className="absolute -top-3 -right-3 w-10 h-10 rounded-full bg-arcane-purple/10 blur-md opacity-[0.40]" />

              <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-arcane-purple/20 to-purple-950/40 flex items-center justify-center border border-arcane-purple/20 mb-5 flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                <Palette size={22} className="text-arcane-lavender" />
              </div>
              <h3 className="font-display font-bold text-xl text-white mb-3 tracking-tight">
                Un Museo Virtual con Identidad
              </h3>
              <p className="text-purple-200/80 font-sans text-sm leading-relaxed">
                Pictorial Arcane funciona como un museo en línea donde los usuarios pueden explorar
                un catálogo diverso de obras de arte, cada una con su ficha detallada, artista, género y precio,
                permitiendo a coleccionistas descubrir y adquirir piezas directamente desde la galería virtual.
              </p>
            </div>
          </div>

          {/* ── Central Image ── */}
          <div className="order-1 md:order-2 flex flex-col items-center justify-center py-4">
            <div className="relative w-full max-w-[340px] md:max-w-none group/img">

              {/* Outer pulsing glow */}
              <div
                className="absolute -inset-4 rounded-3xl pointer-events-none opacity-30 group-hover/img:opacity-60 transition-opacity duration-700"
                style={{
                  background: 'conic-gradient(from 0deg, #7c3aed, #c084fc, #ffd700, #c084fc, #7c3aed)',
                  filter: 'blur(20px)',
                  animation: 'conic-spin 6s linear infinite, pulseGlow 4s ease-in-out infinite',
                }}
              />

              {/* Conic spinning border frame */}
              <div className="conic-border-spin p-1 transition-transform duration-500 group-hover/img:scale-[1.03]">
                {/* Inner glass padding */}
                <div className="bg-purple-950/40 backdrop-blur-md rounded-[1.25rem] p-3 shadow-xl border border-white/10">
                  <img
                    src="/lan01.gif"
                    alt="Visualización de Pictorial Arcane"
                    className="w-full h-auto rounded-2xl object-contain"
                    style={{ minHeight: '160px' }}
                  />
                </div>
              </div>

              {/* Floating decorative dots */}
              <div className="absolute -top-4 -left-4 w-8 h-8 rounded-full border-2 border-arcane-purple/30 bg-arcane-purple/10 animate-float" style={{ animationDelay: '0s' }} />
              <div className="absolute -bottom-4 -right-4 w-10 h-10 rounded-full border-2 border-arcane-lavender/30 bg-arcane-lavender/10 animate-float" style={{ animationDelay: '1.5s' }} />
              <div className="absolute -top-2 right-6 w-4 h-4 rounded-full bg-arcane-gold/30 animate-float" style={{ animationDelay: '0.8s' }} />
            </div>
          </div>

          {/* ── Right Bubble ── */}
          <div className="order-3 relative group perspective-card">
            {/* Speech bubble tail (desktop) */}
            <div className="absolute left-[-10px] top-1/2 -translate-y-1/2 w-5 h-5 bg-[#0f061c] border-b border-l border-purple-500/20 rotate-45 hidden md:block z-10" />

            <div className="relative p-8 rounded-2xl bg-[#0f061c]/55 border border-purple-500/20
              shadow-[0_4px_20px_rgba(124,58,237,0.08)]
              hover:shadow-[0_16px_40px_rgba(124,58,237,0.25)]
              transition-all duration-400 flex flex-col justify-center min-h-[240px]
              hover:border-arcane-purple/40 text-white"
            >
              {/* Mobile bubble tail (top) */}
              <div className="absolute top-[-10px] left-1/2 -translate-x-1/2 w-5 h-5 bg-[#0f061c] border-t border-l border-purple-500/20 rotate-45 md:hidden" />

              {/* Dot pattern inside bubble */}
              <div className="absolute inset-0 rounded-2xl overflow-hidden opacity-[0.03] pointer-events-none"
                style={{ backgroundImage: 'radial-gradient(#7c3aed 1px, transparent 1px)', backgroundSize: '20px 20px' }}
              />

              <div className="absolute -top-3 -left-3 w-10 h-10 rounded-full bg-arcane-lavender/10 blur-md opacity-[0.40]" />

              <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-arcane-purple/20 to-purple-950/40 flex items-center justify-center border border-arcane-purple/20 mb-5 flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                <Search size={22} className="text-arcane-lavender" />
              </div>
              <h3 className="font-display font-bold text-xl text-white mb-3 tracking-tight">
                Motor de Búsqueda y Compras Integrado
              </h3>
              <p className="text-purple-200/80 font-sans text-sm leading-relaxed">
                La plataforma cuenta con un motor de búsqueda semántica que permite filtrar obras por artista,
                género, técnica o precio, y un sistema de compras que gestiona desde la reserva hasta la
                facturación, orquestado sobre microservicios escalables y resilientes.
              </p>
            </div>
          </div>

        </div>

        {/* Feature chips */}
        <div className="mt-14 flex flex-wrap items-center justify-center gap-3">
          {features.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <span
                key={feature.label}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gray-50 border border-gray-200 text-gray-600 text-xs font-medium tracking-wide transition-all duration-300 hover:bg-white hover:border-arcane-purple/30 hover:shadow-[0_4px_12px_rgba(124,58,237,0.10)] hover:text-arcane-purple cursor-default animate-slide-up"
                style={{ animationDelay: `${idx * 0.08}s` }}
              >
                <Icon size={14} className={feature.color} />
                {feature.label}
              </span>
            );
          })}
        </div>
      </div>
    </section>
  );
}
