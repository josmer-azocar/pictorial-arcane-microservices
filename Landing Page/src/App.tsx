/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ArchitectureDiagram from './components/ArchitectureDiagram';
import CapTheorem from './components/CapTheorem';
import PolyglotDictionary from './components/PolyglotDictionary';
import LiveDemo from './components/LiveDemo';
import ApiDocumentation from './components/ApiDocumentation';
import FaultTolerance from './components/FaultTolerance';
import Neo4jGraphs from './components/Neo4jGraphs';
import Team from './components/Team';
export default function App() {
  const [activeSection, setActiveSection] = useState<string>('hero');
  const [demoStep, setDemoStep] = useState<number>(0);
  const [highlightedEngine, setHighlightedEngine] = useState<string | null>(null);

  // Monitor client screen scroll positions to highlight active navigation link automatically
  useEffect(() => {
    const sections = [
      'hero',
      'architecture',
      'cap',
      'dictionary',
      'live-demo',
      'api-documentation',
      'fault-tolerance',
      'neo4j-graphs',
      'team'
    ];

    const handleScroll = () => {
      const scrollPosition = window.scrollY + 200; // threshold offset offset

      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;

          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleStepChange = (step: number) => {
    setDemoStep(step);
    // Clear engine hovers during live transactional flow so Capy focuses on operations output logs
    if (step > 0) {
      setHighlightedEngine(null);
    }
  };

  const handleEngineHighlight = (engine: string | null) => {
    // Only allow hovering highlights if the user is not actively executing the transactional demo
    if (demoStep === 0 || demoStep === 4) {
      setHighlightedEngine(engine);
    }
  };

  return (
    <div className="bg-white text-gray-900 font-sans min-h-screen selection:bg-arcane-purple/40 selection:text-white">
      {/* 1. Glassmorphic sticky header nav */}
      <Navbar activeSection={activeSection} />

      {/* 2. Main content pages */}
      <main className="relative">
        
        {/* Section 1: Hero Cover */}
        <Hero />

        {/* Section 2: Interactive SVG Architecture Path diagram */}
        <ArchitectureDiagram onNodeHover={handleEngineHighlight} />

        {/* Section 3: CAP Triangle & Eventual Consistency Pipeline */}
        <CapTheorem onEngineSelect={handleEngineHighlight} />

        {/* Section 4: Polyglot database schema matching tabs */}
        <PolyglotDictionary onEngineSelect={handleEngineHighlight} />

        {/* Section 5: Real-time user buy transactional simulator stepper */}
        <LiveDemo onStepChange={handleStepChange} />

        {/* Section 6: Swagger Spec API Expanders */}
        <ApiDocumentation />

        {/* Section 7: Failing Mitigation and PBFT Quorum panels */}
        <FaultTolerance />

        {/* Section 8: Neo4j Graph Visualization */}
        <Neo4jGraphs />

        {/* Section 9: Authors credits and institution official footer */}
        <Team />

      </main>

      
    </div>
  );
}

