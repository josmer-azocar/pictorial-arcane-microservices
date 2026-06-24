import React, { useState, useEffect } from 'react';
import { Menu, X, Shield, Users, Layers, Cpu, Database, BookOpen, Terminal } from 'lucide-react';

interface NavbarProps {
  activeSection: string;
}

export default function Navbar({ activeSection }: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { id: 'hero', label: 'Inicio', icon: Cpu },
    { id: 'architecture', label: 'Arquitectura', icon: Layers },
    { id: 'cap', label: 'CAP', icon: Database },
    { id: 'dictionary', label: 'Diccionario', icon: BookOpen },
    { id: 'live-demo', label: 'Demo', icon: Terminal },
    { id: 'api-documentation', label: 'APIs', icon: BookOpen },
    { id: 'fault-tolerance', label: 'Tolerancia', icon: Shield },
    { id: 'team', label: 'Equipo', icon: Users },
  ];

  const handleScrollTo = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      const offset = 80;
      const elementPosition = element.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({
        top: elementPosition - offset,
        behavior: 'smooth'
      });
    }
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
      isScrolled 
        ? 'bg-white/85 border-b border-arcane-purple/10 shadow-sm backdrop-blur-md py-2' 
        : 'bg-transparent py-4'
    }`}>
      {/* White overlay at top for readability when transparent */}
      {!isScrolled && <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-transparent h-24 pointer-events-none" />}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo in Zen Tokyo Zoo font (pictorial-arcane style) */}
          <div 
            onClick={() => handleScrollTo('hero')} 
            className="flex items-center cursor-pointer select-none group relative"
          >
            {/* White glow behind logo */}
            <div className="absolute inset-0 bg-white/20 blur-xl rounded-full scale-[1.8]"></div>
            <span className={`relative font-logo text-2xl md:text-3xl tracking-wide transition-all duration-300 group-hover:text-arcane-purple ${
              isScrolled ? 'text-gray-900' : 'text-white'
            }`}>
              PICTORIAL{' '}
              <span className="text-arcane-purple">
                ARCANE
              </span>
            </span>
          </div>

          {/* Desktop Navigation with underline animation */}
          <div className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleScrollTo(item.id)}
                  className={`nav-underline px-3 py-2 text-[11px] font-semibold tracking-wide uppercase transition-colors duration-300 flex items-center gap-1.5 cursor-pointer ${
                    isActive 
                      ? 'text-arcane-purple nav-underline-active'
                      : isScrolled
                        ? 'text-gray-500 hover:text-gray-800'
                        : 'text-white/80 hover:text-white'
                  }`}
                >
                  <Icon size={12} className={isActive ? 'text-arcane-purple' : isScrolled ? 'text-gray-400' : 'text-white/60'} />
                  {item.label}
                </button>
              );
            })}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex lg:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`inline-flex items-center justify-center p-2 rounded-md focus:outline-none cursor-pointer transition-colors duration-300 ${
                isScrolled
                  ? 'text-gray-500 hover:text-gray-800 hover:bg-gray-100'
                  : 'text-white/80 hover:text-white hover:bg-white/10'
              }`}
              title="Alternar menú"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Panel */}
      {mobileMenuOpen && (
        <div className="lg:hidden animate-fade-in arcane-glass-light border-b border-arcane-purple/10">
          <div className="px-2 pt-2 pb-4 space-y-1 sm:px-3">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleScrollTo(item.id)}
                  className={`w-full text-left px-4 py-3 rounded-xl text-sm font-semibold tracking-wide uppercase transition-all flex items-center gap-3 cursor-pointer ${
                    isActive 
                      ? 'bg-arcane-purple/10 text-arcane-purple border-l-4 border-arcane-purple'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <Icon size={16} className={isActive ? 'text-arcane-purple' : 'text-gray-400'} />
                  {item.label}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </nav>
  );
}
