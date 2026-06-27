import React, { useState } from 'react';
import { ShieldAlert, RefreshCw, Layers, Database, HardDrive, WifiOff, CheckCircle, Info } from 'lucide-react';

export default function FaultTolerance() {
  const [activeTab, setActiveTab] = useState<string>('all');

  const crashScenarios = [
    {
      id: 'mongodb',
      title: 'Caída del Microservicio MongoDB',
      impact: 'ALTO - Pérdida de actualización de catálogo',
      status: 'Resistencia: Solo Lectura',
      descriptionBg: 'border-emerald-500/20 bg-emerald-500/5',
      accentColor: 'text-emerald-400',
      icon: Database,
      rootCause: 'Pérdida de conectividad con el clúster de base de datos documental Atlas o microservicio de catálogo.',
      mitigation: 'El Core SQL relacional (PostgreSQL) sigue operando transacciones de venta prioritarias. El catálogo de obras se mantiene disponible en el frontend React degradándose a Modo Solo-Lectura sirviendo las fichas estáticas de arte desde un Caché Redis en memoria RAM local. El carrito de compras se almacena en localStorage local hasta que reanude el microservicio.'
    },
    {
      id: 'cassandra',
      title: 'Caída de Nodo Cassandra clúster',
      impact: 'MEDIO - Disminución de réplicas de logs',
      status: 'Resistencia: Consistencia Quórum',
      descriptionBg: 'border-sky-500/20 bg-sky-500/5',
      accentColor: 'text-sky-400',
      icon: HardDrive,
      rootCause: 'Caída o desconexión física de uno de los 3 nodos que componen el anillo circular persistente de Cassandra.',
      mitigation: 'Cassandra opera bajo un Factor de Replicación RF=3 y nivel consistencia Write: QUORUM. Al caer un nodo, la mayoría sigue viva (2/3 nodos). Cassandra sigue aceptando escrituras masivas de auditoría. El nodo sano almacena el mensaje en búfer "Hinted Handoff" entregándolo automáticamente al nodo caído una vez reanudado, re-sincronizando el clúster.'
    },
    {
      id: 'neo4j',
      title: 'Caída del Motor de Recomendaciones Neo4j',
      impact: 'BAJO - Pérdida de sugerencias adaptativas',
      status: 'Resistencia: Fallback Determinista',
      descriptionBg: 'border-rose-500/20 bg-rose-500/5',
      accentColor: 'text-rose-400',
      icon: WifiOff,
      rootCause: 'Caída del nodo líder (core server) del clúster Neo4j Causal Clustering o pérdida de conectividad con el microservicio de recomendaciones. El motor de grafos queda inaccesible, imposibilitando las consultas Cypher de navegación semántica (travellers por aristas :SAW, :COMPRÓ, :HAS_GENRE).',
      mitigation: 'Neo4j Core Cluster usa un conjunto de servidores principales que eligen un líder mediante consenso Raft. Si el líder falla, los core servers restantes celebran una nueva elección (~7 seg) y promueven un nuevo líder. Mientras tanto, el frontend degrada la sección "Recomendados para ti" a un fallback determinista: obras del mismo género servidas desde el catálogo MongoDB (consulta plana sin traversal). Las aristas :SAW y :COMPRÓ se encolan en un buffer Redis y se re-sincronizan con Neo4j vía un job programado una vez el clúster se recupere.'
    }
  ];

  const filteredScenarios = activeTab === 'all' 
    ? crashScenarios 
    : crashScenarios.filter(s => s.id === activeTab);

  return (
    <section 
      id="fault-tolerance" 
      className="py-20 px-4 sm:px-6 lg:px-8 border-b border-arcane-purple/10 bg-white"
    >
      <div className="max-w-7xl mx-auto">
        
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="text-xs font-mono uppercase tracking-widest text-arcane-purple bg-arcane-purple/10 px-3 py-1 rounded-full border border-arcane-purple/20">
            Resiliencia y Alta Disponibilidad
          </span>
          <h2 className="font-display font-bold text-3xl sm:text-4xl text-gray-900 mt-3 mb-4 tracking-tight">
            TOLERANCIA A CRASHES Y REGLAS DE CONSISTENCIA
          </h2>
          <p className="font-sans text-gray-500 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed">
            Una verdadera persistencia políglota asume el fallo por diseño. 
            Analiza cómo nuestra arquitectura de microservicios evita el colapso absoluto ante cortes eléctricos o pérdidas de conectividad.
          </p>
        </div>

        {/* Filter buttons */}
        <div className="flex justify-center gap-2 mb-8 select-none">
          <button 
            id="fault-filter-btn-all"
            onClick={() => setActiveTab('all')} 
            className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all border cursor-pointer ${activeTab === 'all' ? 'bg-arcane-purple text-white border-arcane-lavender' : 'bg-white text-gray-500 border-gray-200 hover:text-gray-800 hover:border-gray-300'}`}
          >
            Ver Todos
          </button>
          <button 
            id="fault-filter-btn-mongodb"
            onClick={() => setActiveTab('mongodb')} 
            className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all border cursor-pointer ${activeTab === 'mongodb' ? 'bg-emerald-100 text-emerald-700 border-emerald-300' : 'bg-white text-gray-500 border-gray-200 hover:text-gray-800 hover:border-gray-300'}`}
          >
            Fallo MongoDB
          </button>
          <button 
            id="fault-filter-btn-cassandra"
            onClick={() => setActiveTab('cassandra')} 
            className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all border cursor-pointer ${activeTab === 'cassandra' ? 'bg-sky-100 text-sky-700 border-sky-300' : 'bg-white text-gray-500 border-gray-200 hover:text-gray-800 hover:border-gray-300'}`}
          >
            Fallo Cassandra
          </button>
          <button 
            id="fault-filter-btn-neo4j"
            onClick={() => setActiveTab('neo4j')} 
            className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all border cursor-pointer ${activeTab === 'neo4j' ? 'bg-rose-100 text-rose-700 border-rose-300' : 'bg-white text-gray-500 border-gray-200 hover:text-gray-800 hover:border-gray-300'}`}
          >
            Fallo Neo4j
          </button>
        </div>

        {/* Cards mapping layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch mb-16">
          {filteredScenarios.map((sc, idx) => {
            const Icon = sc.icon;
            return (
              <div 
                key={idx}
                id={`fault-scenario-card-${sc.id}`}
                className={`p-6 rounded-2xl border-2 bg-white shadow-sm flex flex-col justify-between arcane-glass-light ${sc.descriptionBg}`}
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[10px] uppercase font-mono bg-gray-100 px-2 py-0.5 rounded border border-gray-200 text-gray-600 flex items-center gap-1">
                      <ShieldAlert size={12} /> {sc.impact}
                    </span>
                    <span className="text-[10px] font-mono font-bold text-gray-500">{sc.status}</span>
                  </div>

                  <h3 className="font-display font-black text-lg text-gray-900 mb-1 flex items-center gap-2">
                    <Icon size={18} className={sc.accentColor} />
                    {sc.title}
                  </h3>
                  
                  <div className="mt-3 space-y-3 text-xs">
                    <div>
                      <span className="font-mono text-gray-500 block uppercase text-[9px]">Causa raíz:</span>
                      <p className="text-gray-600 font-sans mt-0.5 leading-relaxed">{sc.rootCause}</p>
                    </div>

                    <div className="pt-2 border-t border-gray-200">
                      <span className="font-mono text-amber-600 block uppercase text-[9px]">Plan de Mitigación:</span>
                      <p className="text-gray-700 font-sans mt-0.5 leading-relaxed">
                        {sc.mitigation}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="pt-4 mt-4 border-t border-gray-200 flex justify-between items-center text-[10px] font-mono text-gray-500">
                  <span>Alta Disponibilidad SBDII ✓</span>
                  <CheckCircle size={12} className="text-emerald-500 animate-pulse" />
                </div>
              </div>
            );
          })}
        </div>

        {/* Deep Byzantine / Quorum theory info panel */}
        <div className="p-6 sm:p-8 bg-gray-50 rounded-2xl border border-arcane-purple/10 shadow-sm relative overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-arcane-purple/[0.03] rounded-full blur-[100px]" />
          
          <div className="flex items-start gap-3 border-b border-gray-200 pb-4 mb-6 select-none animate-fade-in">
            <Info size={20} className="text-arcane-purple shrink-0 mt-0.5" />
            <div>
              <h3 className="font-display font-bold text-base sm:text-lg text-gray-900">Prontuario Teórico Avanzado: Fallas Bizantinas y Quórums</h3>
              <p className="text-xs text-gray-500 font-sans mt-0.5">Apuntes esenciales del temario para la defensa oral del proyecto en el aula.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10 text-xs sm:text-sm">
            
            <div className="space-y-2">
              <h4 className="font-display font-bold text-gray-700 flex items-center gap-1.5 uppercase tracking-wide text-xs">
                ☠️ Fallas Bizantinas y Consenso PBFT
              </h4>
              <p className="text-gray-600 font-sans leading-relaxed">
                En sistemas distribuidos, una <strong className="text-gray-900">Falla Bizantina</strong> ocurre cuando los nodos colapsan, demoran mensajes o actúan de forma maliciosa e inconsistente enviando respuestas falsas a distintas partes del anillo de red. 
              </p>
              <p className="text-gray-500 font-sans leading-relaxed text-xs">
                Para mitigarlo se usa <strong className="text-gray-800">PBFT (Practical Byzantine Fault Tolerance)</strong>, un algoritmo de consenso donde los nodos repiten fases de verificación mutua (Pre-prepare, Prepare, Commit). Permite tolerancia siempre que el número de nodos traidores <code>f</code> cumpla con <code>f &lt; (N - 1)/3</code>.
              </p>
            </div>

            <div className="space-y-2">
              <h4 className="font-display font-bold text-gray-700 flex items-center gap-1.5 uppercase tracking-wide text-xs">
                📐 Ecuación de Quórum Distribuido
              </h4>
              <p className="text-semibold text-gray-600 font-sans leading-relaxed">
                Cassandra y DynamoDB resuelven consistencias configurables mediante fórmulas matemáticas de quórums distribuidos.
              </p>
              <div className="bg-white p-3 rounded border border-gray-200 font-mono text-[11px] text-arcane-purple space-y-1 text-center my-2 shadow-sm">
                <div>Fórmula de Consistencia Estricta:</div>
                <div className="text-gray-900 text-xs font-bold font-mono">W + R &gt; RF</div>
                <div className="text-[10px] text-gray-500 font-sans">(Escr. + Lect. &gt; Factor Replicación)</div>
              </div>
              <p className="text-gray-500 font-sans leading-relaxed text-xs">
                Si escribes en la mayoría (QUORUM) y lees de la mayoría (QUORUM), la intersección garantiza que al menos un nodo consultado guarde la mutación más reciente, logrando consistencia estricta en un sistema AP.
              </p>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
