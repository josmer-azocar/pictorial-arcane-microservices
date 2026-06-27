import React from 'react';
import { Info, Search, ShoppingCart, Palette, Building2, Globe } from 'lucide-react';

export default function About() {
  return (
    <section 
      id="about" 
      className="py-20 px-4 sm:px-6 lg:px-8 border-b border-arcane-purple/10 bg-white relative overflow-hidden"
    >
      <div className="absolute top-0 left-0 w-80 h-80 bg-arcane-purple/[0.03] rounded-full blur-[120px]" />
      
      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="text-xs font-mono uppercase tracking-widest text-arcane-purple bg-arcane-purple/10 px-3 py-1 rounded-full border border-arcane-purple/20">
            Quiénes Somos
          </span>
          <h2 className="font-display font-bold text-3xl sm:text-4xl text-gray-900 mt-3 mb-4 tracking-tight">
            EXPLICACIÓN DE LA PLATAFORMA
          </h2>
          <p className="font-sans text-gray-500 max-w-3xl mx-auto text-sm sm:text-base leading-relaxed">
            Pictorial Arcane es un museo digital que integra un motor de búsqueda 
            y compra de obras de arte, sustentado en una arquitectura de bases de datos políglota.
          </p>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
          
          {/* Left: Museum description */}
          <div className="p-8 rounded-2xl bg-gradient-to-br from-purple-50 to-white border border-arcane-purple/10 shadow-sm arcane-glass-light flex flex-col justify-center">
            <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-arcane-purple/20 to-purple-100 flex items-center justify-center border border-arcane-purple/20 mb-5 shadow-sm">
              <Palette size={28} className="text-arcane-purple" />
            </div>
            <h3 className="font-display font-bold text-xl text-gray-900 mb-3 tracking-tight">
              Un Museo Virtual con Identidad
            </h3>
            <p className="text-gray-600 font-sans text-sm leading-relaxed">
              Pictorial Arcane funciona como un museo en línea donde los usuarios pueden explorar 
              un catálogo diverso de obras de arte —pinturas, esculturas, piezas digitales— cada una 
              con su ficha detallada, artista, género y precio. La plataforma no solo exhibe el 
              patrimonio artístico, sino que permite a los coleccionistas navegar, descubrir y 
              adquirir piezas directamente desde la galería virtual.
            </p>
          </div>

          {/* Right: Search and purchase engine */}
          <div className="p-8 rounded-2xl bg-gradient-to-br from-amber-50 to-white border border-arcane-purple/10 shadow-sm arcane-glass-light flex flex-col justify-center">
            <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-amber-500/20 to-amber-100 flex items-center justify-center border border-amber-500/20 mb-5 shadow-sm">
              <Search size={28} className="text-amber-600" />
            </div>
            <h3 className="font-display font-bold text-xl text-gray-900 mb-3 tracking-tight">
              Motor de Búsqueda y Compras Integrado
            </h3>
            <p className="text-gray-600 font-sans text-sm leading-relaxed">
              Más allá de la exhibición, la plataforma cuenta con un motor de búsqueda 
              semántica que permite filtrar obras por artista, género, técnica o precio. 
              El sistema de compras integrado gestiona transacciones completas: desde la 
              reserva de la obra y el procesamiento del pago hasta la actualización del 
              catálogo y la generación de facturas. Todo ello orquestado sobre una 
              arquitectura de microservicios que garantiza escalabilidad, consistencia y 
              resiliencia en cada operación.
            </p>
          </div>

        </div>

        {/* Bottom summary */}
        <div className="mt-10 p-6 rounded-2xl bg-gray-50 border border-arcane-purple/10 text-center">
          <div className="flex flex-wrap items-center justify-center gap-6 text-xs font-mono text-gray-500">
            <span className="flex items-center gap-1.5">
              <Palette size={14} className="text-arcane-purple" /> Catálogo de Obras
            </span>
            <span className="flex items-center gap-1.5">
              <Search size={14} className="text-amber-600" /> Búsqueda Semántica
            </span>
            <span className="flex items-center gap-1.5">
              <ShoppingCart size={14} className="text-emerald-600" /> Compra Integrada
            </span>
            <span className="flex items-center gap-1.5">
              <Building2 size={14} className="text-sky-600" /> Museo Digital
            </span>
            <span className="flex items-center gap-1.5">
              <Globe size={14} className="text-rose-500" /> Acceso Global
            </span>
          </div>
        </div>

      </div>
    </section>
  );
}
