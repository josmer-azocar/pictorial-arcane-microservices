import React, { useState, useEffect } from 'react';
import { Play, RotateCcw, AlertCircle, Database, Check, Terminal, ExternalLink, Sparkles, ArrowRight, LayoutDashboard } from 'lucide-react';
import { DBEngine, DemoStep } from '../types';

interface LiveDemoProps {
  onStepChange: (stepNum: number) => void;
  onNavigateFrontend?: () => void;
}

export default function LiveDemo({ onStepChange, onNavigateFrontend }: LiveDemoProps) {
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [loadingStep, setLoadingStep] = useState<boolean>(false);
  const [logs, setLogs] = useState<string[]>([
    '[SISTEMA] Sistema de Telemetría SBDII inicializado.',
    '[SISTEMA] Servidor Spring Boot escuchando en puerto 3000.',
    '[SISTEMA] Conectores de bases de datos políglotas listos.'
  ]);

  const [viewMode, setViewMode] = useState<'console' | 'frontend' | null>(null);

  const renderFrontendView = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="text-center text-gray-400 p-6 flex flex-col items-center gap-2 select-none">
            <Database size={32} className="text-gray-300" />
            <span className="font-display font-bold text-gray-500">Sin datos a&uacute;n</span>
            <span className="text-[11px] text-gray-400">Ejecuta los pasos de la izquierda para visualizar los datos</span>
          </div>
        );
      case 1:
        return (
          <div className="w-full animate-fade-in">
            <div className="bg-gradient-to-br from-purple-50 to-white rounded-xl border border-purple-200 p-4 shadow-sm">
              <div className="flex items-center justify-between border-b border-purple-100 pb-3 mb-3">
                <div>
                  <span className="text-[9px] font-mono uppercase tracking-wider text-purple-500">Factura de Venta</span>
                  <h3 className="font-display font-bold text-sm text-gray-900">FAC-2026-9918</h3>
                </div>
                <span className="text-[10px] font-mono bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full border border-emerald-200">COMPLETADO</span>
              </div>
              <div className="grid grid-cols-2 gap-3 text-[11px]">
                <div><span className="text-gray-400 block">Transacci&oacute;n ID</span><span className="font-mono text-gray-800 font-medium">txn_c1a93feb_sbdii</span></div>
                <div><span className="text-gray-400 block">Usuario DNI</span><span className="font-mono text-gray-800 font-medium">v-23456789</span></div>
                <div><span className="text-gray-400 block">Obra ID</span><span className="font-mono text-gray-800 font-medium truncate">42f9e612-da13-...</span></div>
                <div><span className="text-gray-400 block">M&eacute;todo de Pago</span><span className="font-mono text-gray-800 font-medium">Ventanilla / C&oacute;digo Bancario</span></div>
              </div>
              <div className="mt-3 pt-3 border-t border-purple-100 flex items-center justify-between">
                <span className="text-[10px] text-gray-400">Nivel de Aislamiento</span>
                <span className="text-[10px] font-mono bg-purple-100 text-purple-700 px-2 py-0.5 rounded font-bold">SERIALIZABLE</span>
              </div>
              <div className="mt-2 flex items-center justify-between">
                <span className="text-xs text-gray-400">Total</span>
                <span className="font-display font-bold text-lg text-gray-900">Bs. 450.000,00</span>
              </div>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="w-full animate-fade-in">
            <div className="bg-gradient-to-br from-amber-50 to-white rounded-xl border border-amber-200 p-4 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center text-white text-xs font-bold">CA</div>
                  <div>
                    <h3 className="font-display font-bold text-sm text-gray-900">C&iacute;rculos Arcanos en P&uacute;rpura</h3>
                    <span className="text-[10px] text-gray-400">Pintura Digital</span>
                  </div>
                </div>
                <span className="text-[10px] font-mono bg-red-100 text-red-700 px-2 py-0.5 rounded-full border border-red-200 font-bold animate-pulse">SOLD</span>
              </div>
              <div className="flex flex-wrap gap-1 mb-3">
                <span className="text-[9px] bg-purple-100 text-purple-700 px-1.5 py-0.5 rounded">arcano</span>
                <span className="text-[9px] bg-purple-100 text-purple-700 px-1.5 py-0.5 rounded">abstracto</span>
                <span className="text-[9px] bg-purple-100 text-purple-700 px-1.5 py-0.5 rounded">p&uacute;rpura</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-[11px] pt-2 border-t border-amber-100">
                <div><span className="text-gray-400 block">Due&ntilde;o</span><span className="font-mono text-gray-800">v-23456789</span></div>
                <div><span className="text-gray-400 block">Precio</span><span className="font-mono text-gray-800 font-bold">Bs. 450.000,00</span></div>
                <div className="col-span-2"><span className="text-gray-400 block">&Uacute;ltima sincronizaci&oacute;n</span><span className="font-mono text-gray-800">2026-06-11T00:15:33Z</span></div>
              </div>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="w-full animate-fade-in overflow-x-auto">
            <div className="bg-gradient-to-br from-sky-50 to-white rounded-xl border border-sky-200 p-4 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-display font-bold text-sm text-gray-900">Registro de Auditor&iacute;a Inmutable</h3>
                <span className="text-[10px] font-mono bg-sky-100 text-sky-700 px-2 py-0.5 rounded-full">Cassandra CQL</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-[10px] font-mono">
                  <thead>
                    <tr className="border-b border-sky-200 text-sky-600">
                      <th className="text-left py-1 pr-2">user_dni</th>
                      <th className="text-left py-1 pr-2">event_timestamp</th>
                      <th className="text-left py-1 pr-2">event_id</th>
                      <th className="text-left py-1 pr-2">action</th>
                      <th className="text-left py-1 pr-2">artwork_id</th>
                      <th className="text-left py-1 pr-2">client_ip</th>
                      <th className="text-left py-1">latency_ms</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-sky-100 text-gray-700 hover:bg-sky-50/50">
                      <td className="py-1 pr-2 font-bold">v-23456789</td>
                      <td className="py-1 pr-2">2026-06-11T00:15:32.4</td>
                      <td className="py-1 pr-2 text-[9px]">ccb90a2a-...</td>
                      <td className="py-1 pr-2"><span className="bg-amber-100 text-amber-700 px-1 py-0.5 rounded text-[9px] font-bold">PURCHASE</span></td>
                      <td className="py-1 pr-2 text-[9px]">42f9e612-...</td>
                      <td className="py-1 pr-2">190.140.22.180</td>
                      <td className="py-1">14</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="mt-2 pt-2 border-t border-sky-100">
                <span className="text-[10px] text-gray-400">Write Consistency: <span className="font-bold text-gray-600">QUORUM (RF=3)</span></span>
              </div>
            </div>
          </div>
        );
      case 4:
        return (
          <div className="w-full animate-fade-in">
            <span className="text-[10px] text-purple-500 font-mono block mb-2">Sugerencias calculadas via Cypher:</span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { title: 'Simetr&iacute;as Ocultas', artist: 'Salazar In&eacute;s', genre: 'Abstracto P&uacute;rpura', score: '95%', affinity: 0.95, bg: 'from-emerald-500/10', border: 'border-emerald-500/20' },
                { title: 'Ecos del P&uacute;rpura', artist: 'Avenda&ntilde;o Licett', genre: 'Abstracto / &Oacute;leo', score: '88%', affinity: 0.88, bg: 'from-purple-500/10', border: 'border-purple-500/20' },
                { title: 'Laberinto del Tiempo', artist: 'Azocar Josue', genre: 'Geom&eacute;trico', score: '72%', affinity: 0.72, bg: 'from-sky-500/10', border: 'border-sky-500/20' }
              ].map((item, id) => (
                <div key={id} className={`p-3 rounded-xl bg-gradient-to-b ${item.bg} to-white border ${item.border} shadow-sm flex flex-col justify-between`}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-mono font-bold text-gray-500">{item.score}</span>
                    <div className="h-2 w-full max-w-[60px] bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-arcane-purple to-arcane-lavender rounded-full" style={{ width: `${item.affinity * 100}%` }} />
                    </div>
                  </div>
                  <h5 className="font-display font-bold text-sm text-gray-900 mt-1">{item.title}</h5>
                  <span className="text-[10px] text-gray-400 block">{item.genre}</span>
                  <span className="text-[10px] text-gray-500 mt-1 italic">Por {item.artist}</span>
                </div>
              ))}
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  const steps: DemoStep[] = [
    {
      stepNumber: 1,
      title: 'Paso 1: Transacción ACID en Core SQL',
      engine: 'Core SQL',
      actionLabel: 'Desencadenar Venta',
      apiRoute: 'POST /api/sales/purchase',
      logMessage: 'Iniciando registro transaccional oficial en PostgreSQL...',
      payloadDescription: 'Registra al usuario, genera la factura y actualiza stock bajo transaccionalidad estricta (SERIALIZABLE).',
      codeOutput: `{
  "status": "success",
  "transaction_id": "txn_c1a93feb_sbdii",
  "timestamp": "2026-06-11T00:15:32Z",
  "data": {
    "invoice_num": "FAC-2026-9918",
    "user_dni": "v-23456789",
    "artwork_id": "42f9e612-da13-4318-8fe9-825fb4d1ff01",
    "price": 450000.00,
    "payment_method": "Ventanilla / Código Bancario",
    "isolation_level": "SERIALIZABLE",
    "outbox_status": "QUEUED"
  }
}`
    },
    {
      stepNumber: 2,
      title: 'Paso 2: Sincronización Catalog en MongoDB',
      engine: DBEngine.MongoDB,
      actionLabel: 'Actualizar Catálogo NoSQL',
      apiRoute: 'AMQP EVENT: ARTWORK_PURCHASED',
      logMessage: 'MongoDB Worker extrae mensaje de la cola. Actualizando estado de colecciones...',
      payloadDescription: 'Actualiza el documento original de la obra. El estado ("status") se conmuta de "AVAILABLE" a "SOLD" asegurando consistencia eventual.',
      codeOutput: `{
  "_id": ObjectId("6667b2d5fbcb8b2bac10de01"),
  "artwork_id": "42f9e612-da13-4318-8fe9-825fb4d1ff01",
  "title": "Círculos Arcanos en Púrpura",
  "medium": "Pintura Digital",
  "status": "SOLD", // <-- ¡Foco de cambio!
  "tags": ["arcano", "abstracto", "púrpura"],
  "price": 450000.00,
  "owner": "v-23456789",
  "last_synced_at": "2026-06-11T00:15:33Z"
}`
    },
    {
      stepNumber: 3,
      title: 'Paso 3: Registro Inmutable en Cassandra',
      engine: DBEngine.Cassandra,
      actionLabel: 'Anexar Auditoría CQL',
      apiRoute: 'AMQP EVENT: PERSIST_AUDIT',
      logMessage: 'Audit Worker escribe en el clúster circular descentralizado de Cassandra...',
      payloadDescription: 'Inserta la trama de auditoría inmutable en la familia de columnas filtrado por llave de partición user_dni.',
      codeOutput: `user_dni   | event_timestamp       | event_id     | action   | artwork_id   | client_ip      | latency_ms
-----------+-----------------------+--------------+----------+--------------+----------------+------------
v-23456789 | 2026-06-11T00:15:32.4 | ccb90a2a-... | PURCHASE | 42f9e612-... | 190.140.22.180 | 14`
    },
    {
      stepNumber: 4,
      title: 'Paso 4: Consultas de Recomendación en Neo4j',
      engine: DBEngine.Neo4j,
      actionLabel: 'Calcular Sugerencias Cypher',
      apiRoute: 'NEO4J TRANSACTIONS: SUGGEST_ARTS',
      logMessage: 'Grafo Neo4j mapea la arista :COMPRÓ. Compilando grafo de conocimiento...',
      payloadDescription: 'Sincroniza la relación del usuario con la obra de arte y calcula recomendaciones de alta afinidad usando consultas recursivas Cypher.',
      codeOutput: `// 6.7 Obtener la obra más recientemente vista por el usuario
// y recomendar obras del mismo género
MATCH (u:Comprador {id: 'user1'})-[v:SAW]->(ultima:Artwork)
WITH ultima
ORDER BY v.fecha DESC LIMIT 1
MATCH (ultima)-[:HAS_GENRE]->(g:Genre)<-[:HAS_GENRE]-(recomendada:Artwork)
WHERE recomendada.artworkId <> ultima.artworkId
  AND recomendada.status = 'AVAILABLE'
RETURN
  recomendada.artworkId AS artwork_id,
  recomendada.name AS title,
  g.name AS genre,
  recomendada.price AS price
ORDER BY recomendada.price DESC
LIMIT 3`
    }
  ];

  const triggerNextStep = () => {
    if (loadingStep || currentStep >= steps.length) return;
    setLoadingStep(true);

    const stepIndex = currentStep;
    const step = steps[stepIndex];

    // Simulated network progress
    setLogs((prev) => [...prev, `[PETICIÓN_DESENCADENADA] Despachando a -> ${step.apiRoute}`]);

    setTimeout(() => {
      let stepLogs: string[] = [];

      if (step.stepNumber === 1) {
        stepLogs = [
          '[POST/sales/purchase] Recibido por Spring Boot gateway.',
          '[SEGURIDAD] Autenticando credenciales del comprador DNI: "v-23456789"...',
          '[PostgreSQL] Transacción iniciada con aislamiento SERIALIZABLE.',
          '[PostgreSQL] Verificando estado del inventario para obra: 42f9e612...',
          '[PostgreSQL] INSERT INTO sales (sale_id, user_dni, artwork_id, amount) VALUES (uuid(), "v-23456789", 42f9e612..., 450000.00)',
          '[PostgreSQL] UPDATE artwork SET status = "SOLD" WHERE artwork_id = 42f9e612...',
          '[PostgreSQL] INSERT INTO transaction_outbox (event_id, event_type, payload) VALUES (uuid(), "ARTWORK_PURCHASED", ...)',
          '[Core SQL] Transacción ACID confirmada exitosamente en PostgreSQL (Commit).'
        ];
      } else if (step.stepNumber === 2) {
        stepLogs = [
          '[AMQP] Evento "ARTWORK_PURCHASED" extraído de la cola.',
          '[MongoDB] Modificando catálogo de la colección "artworks"...',
          '[MongoDB] Ejecutando updateOne({artwork_id: "42f9e612"}, {$set: {status: "SOLD", updated_at: now()}} )',
          '[MongoDB] Escritura de mayoría (Write Concern) confirmada por réplicas primarias',
          '[MongoDB] Sincronización documental finalizada. status: SOLD.'
        ];
      } else if (step.stepNumber === 3) {
        stepLogs = [
          '[AMQP] Emitiendo mensaje secundario hacia auditoría...',
          '[Cassandra] Enrutando por clave de partición hash para modular user_dni: "v-23456789"...',
          '[Cassandra] Insertando fila persistente de bitácora inmutable.',
          '[Cassandra] Escalado lineal completado en anillo de quórum (RF=3) en 14ms',
          '[Cassandra] Auditoría persistida inmutablemente. Fila anexada con éxito.'
        ];
      } else if (step.stepNumber === 4) {
        stepLogs = [
          '[Neo4j] Ejecutando transacción gráfica nativa en memoria...',
          '[Neo4j] MATCH (c:Comprador {dni: "v-23456789"}), (o:Obra {id: "42f9e612"}), CREATE (c)-[:COMPRÓ {timestamp: now()}]->(o)',
          '[Neo4j] Ejecutando query 6.7 — recomendación por última obra vista...',
          '[Neo4j] Navegando arista :SAW y propagando por :HAS_GENRE en RAM',
          '[Neo4j] Consulta 6.7 completa. Retorna 3 sugerencias del mismo género.'
        ];
      }

      setLogs((prev) => [...prev, ...stepLogs]);
      setCurrentStep(stepIndex + 1);
      onStepChange(stepIndex + 1);
      setLoadingStep(false);
    }, 1200);
  };

  const resetDemo = () => {
    setCurrentStep(0);
    onStepChange(0);
    setLogs([
      '[SISTEMA] Sistema de Telemetría SBDII inicializado.',
      '[SISTEMA] Servidor Spring Boot escuchando en puerto 3000.',
      '[SISTEMA] Conectores de bases de datos políglotas listos.',
      '[SISTEMA] Logs vaciados, variables transaccionales restauradas a AVAILABLE.'
    ]);
  };

  return (
    <section 
      id="live-demo" 
      className="pt-14 pb-4 px-4 sm:px-6 lg:px-8 border-b border-arcane-purple/10 bg-white relative"
    >
      <div className="absolute top-0 bottom-0 left-0 right-0 bg-[radial-gradient(ellipse_at_top_right,rgba(139,47,201,0.03),transparent_50%)] pointer-events-none" />
      
      <div className="max-w-7xl mx-auto">
        
        {/* Section Header */}
        <div className="text-center mb-4">
          <span className="text-xs font-mono uppercase tracking-widest text-arcane-purple bg-arcane-purple/10 px-3 py-1 rounded-full border border-arcane-purple/20">
            Laboratorio Interactivo
          </span>
          <h2 className="font-display font-bold text-3xl sm:text-4xl text-gray-900 mt-3 mb-4 tracking-tight">
            LIVE DEMO: TRANSACT-POLYGLOT ENGINE
          </h2>
          <p className="font-sans text-gray-500 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed">
            Ejecuta secuencialmente el flujo completo de una compra. Observa cómo la transacción rígida de PostgreSQL 
            se propaga por mensajería asíncrona hacia los motores NoSQL, consolidando el estado global.
          </p>
        </div>

        {/* Workspace: Bento Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">

          {viewMode === null ? (

            /* ── SELECTOR DE MODO (full width) ── */
            <div className="lg:col-span-12 flex flex-col items-center justify-center p-8 rounded-2xl border border-arcane-purple/10 bg-gray-50 shadow-sm gap-6">
              <div className="text-center">
                <span className="text-xs font-mono uppercase tracking-widest text-arcane-purple bg-arcane-purple/10 px-3 py-1 rounded-full border border-arcane-purple/20">
                  Panel de Visualización
                </span>
                <h3 className="font-display font-bold text-xl text-gray-900 mt-3 mb-1">
                  Selecciona el modo de visualización
                </h3>
                <p className="text-sm text-gray-500 font-sans max-w-md">
                  Elige cómo quieres ver los datos de cada paso de la transacción políglota.
                </p>
              </div>
              <div className="flex gap-4 mt-2">
                <button
                  onClick={() => setViewMode('console')}
                  className="px-8 py-4 rounded-xl bg-gradient-to-br from-gray-900 to-gray-800 text-white border border-gray-700 shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-95 transition-all cursor-pointer flex flex-col items-center gap-2 min-w-[180px]"
                >
                  <Terminal size={28} />
                  <span className="font-display font-bold text-base">Consola</span>
                  <span className="text-[10px] text-gray-400 font-sans">Terminal con logs y JSON</span>
                </button>
                <button
                  onClick={() => onNavigateFrontend?.()}
                  className="px-8 py-4 rounded-xl bg-gradient-to-br from-arcane-purple to-arcane-lavender text-white border border-arcane-purple/30 shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-95 transition-all cursor-pointer flex flex-col items-center gap-2 min-w-[180px]"
                >
                  <LayoutDashboard size={28} />
                  <span className="font-display font-bold text-base">Frontend</span>
                  <span className="text-[10px] text-purple-200 font-sans">Ir al Home del Frontend</span>
                </button>
              </div>
            </div>

          ) : (

            <>

            {/* Left Column: Línea de Secuencialidad + Steps (5 cols) */}
            <div className="lg:col-span-5 flex flex-col justify-between p-6 rounded-2xl bg-white border border-arcane-purple/10 shadow-sm arcane-glass-light">
              
              <div className="flex items-center justify-between border-b border-gray-200 pb-4 mb-6">
                <span className="text-xs font-mono text-gray-500 uppercase tracking-wider">Línea de Secuencialidad</span>
                
                <button
                  id="reset-demo-top-btn"
                  onClick={resetDemo}
                  className="px-2.5 py-1 text-[10px] font-mono text-arcane-purple hover:text-white bg-arcane-purple/10 hover:bg-arcane-purple rounded border border-arcane-purple/20 flex items-center gap-1 cursor-pointer transition"
                  title="Reiniciar flujo demostración"
                >
                  <RotateCcw size={10} /> Reiniciar Demo
                </button>
              </div>

              {/* Steps Vertical Timeline layout */}
              <div className="space-y-6 relative flex-grow mb-6">
                {/* Virtual vertical connection pipeline */}
                <div className="absolute top-4 bottom-4 left-6 w-[2px] bg-gray-200 -z-10" />
                {currentStep > 0 && (
                  <div 
                    className="absolute top-4 left-6 w-[2px] bg-gradient-to-b from-arcane-purple via-cyan-400 to-green-500 transition-all duration-500 -z-10" 
                    style={{ height: `${((currentStep - 1) / 3) * 88}%` }}
                  />
                )}

                {steps.map((step, idx) => {
                  const isActive = idx === currentStep;
                  const isCompleted = idx < currentStep;
                  const isUpcoming = idx > currentStep;
                  
                  let stepColor = 'border-gray-200 text-gray-500 bg-white';
                  let circleColor = 'border-gray-300 text-gray-500 bg-white';
                  
                  if (isActive) {
                    stepColor = 'border-arcane-purple text-gray-900 bg-arcane-purple/5 shadow-sm scale-[1.02]';
                    circleColor = 'border-arcane-purple text-arcane-purple bg-arcane-purple/10 animate-pulse';
                  } else if (isCompleted) {
                    stepColor = 'border-emerald-300 text-emerald-700 bg-emerald-50';
                    circleColor = 'border-emerald-500 text-emerald-500 bg-emerald-100';
                  }

                  return (
                    <div 
                      key={idx} 
                      id={`demo-step-card-${step.stepNumber}`}
                      className={`p-4 rounded-xl border transition-all duration-300 flex gap-4 items-start ${stepColor}`}
                    >
                      {/* Circle identifier */}
                      <div className={`h-6 w-6 shrink-0 rounded-full border-2 flex items-center justify-center font-mono text-xs font-bold transition-all duration-300 ${circleColor}`}>
                        {isCompleted ? <Check size={12} strokeWidth={3} /> : step.stepNumber}
                      </div>

                      <div className="space-y-1 pr-2">
                        <div className="flex items-center gap-2">
                          <h4 className="font-display font-bold text-xs sm:text-sm text-gray-900">{step.title}</h4>
                          <span className="text-[9px] font-mono uppercase bg-gray-100 px-1.5 py-0.2 rounded text-gray-500 border border-gray-200">
                            {step.engine}
                          </span>
                        </div>
                        <p className="text-[11px] text-gray-500 font-sans leading-relaxed">{step.payloadDescription}</p>
                        
                        {/* Interactive Button ONLY inside active card */}
                        {isActive && (
                          <div className="pt-2 animate-fade-in">
                            <button
                              id={`execute-btn-step-${step.stepNumber}`}
                              onClick={triggerNextStep}
                              disabled={loadingStep}
                              className={`px-4 py-1.5 rounded bg-gradient-to-r from-arcane-purple to-arcane-lavender text-white text-[11px] font-mono font-bold tracking-wide uppercase hover:opacity-90 active:scale-95 transition-all cursor-pointer flex items-center gap-1.5 shadow-[0_2px_12px_rgba(139,47,201,0.35)] ${
                                loadingStep ? 'opacity-40 pointer-events-none' : ''
                              }`}
                            >
                              {loadingStep ? (
                                <>
                                  <RotateCcw size={10} className="animate-spin" /> Procesando...
                                </>
                              ) : (
                                <>
                                  <Play size={10} fill="currentColor" /> {step.actionLabel}
                                </>
                              )}
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Overall finished message */}
              {currentStep === 4 && (
                <div className="p-4 rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-300 text-center animate-fade-in select-none">
                  <p className="font-display font-extrabold text-sm flex justify-center items-center gap-1">
                    <Sparkles size={14} className="text-amber-300 animate-pulse" /> Sincronización Exitosa ✓
                  </p>
                  <p className="font-sans text-[11px] text-emerald-400 mt-1 leading-relaxed">
                    PostgreSQL procesó la venta con total aislamiento ACID. MongoDB, Cassandra y Neo4j se actualizaron de forma independiente garantizando la consistencia global en milisegundos.
                  </p>
                </div>
              )}
            </div>

            {/* Right Column: Mode Selector / Viewer (7 cols) */}
            <div className="lg:col-span-7 flex flex-col rounded-2xl border border-arcane-purple/10 bg-[#050209] shadow-sm overflow-hidden">

              {viewMode === 'console' ? (
                <>

              {/* Terminal bar */}
              <div className="bg-[#0b0616] px-4 py-3 border-b border-arcane-purple/10 flex items-center justify-between select-none">
                <div className="flex items-center gap-2">
                  <Terminal size={14} className="text-arcane-lavender" />
                  <span className="text-xs font-mono font-bold text-gray-300">Terminal SBDII (Outbox + Message Broker Logger)</span>
                </div>
                <button
                  onClick={() => setViewMode(null)}
                  className="text-[9px] font-mono text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 px-2 py-1 rounded transition cursor-pointer"
                >
                  Cambiar modo
                </button>
              </div>

              {/* Terminal screen */}
              <div className="p-4 h-48 overflow-y-auto bg-black font-mono text-[10px] md:text-xs text-white leading-relaxed flex flex-col gap-1 shadow-inner select-text">
                {logs.map((log, idx) => {
                  let logClass = 'text-gray-400';
                  if (log.startsWith('[PETICIÓN')) {
                    logClass = 'text-amber-400 font-bold';
                  } else if (log.includes('[PostgreSQL]') || log.includes('[Core SQL]')) {
                    logClass = 'text-emerald-400 font-bold';
                  } else if (log.includes('[MongoDB]')) {
                    logClass = 'text-amber-300';
                  } else if (log.includes('[Cassandra]')) {
                    logClass = 'text-sky-300';
                  } else if (log.includes('[Neo4j]')) {
                    logClass = 'text-purple-300';
                  } else if (log.includes('[SEGURIDAD]')) {
                    logClass = 'text-rose-300';
                  }
                  
                  return (
                    <div key={idx} className={`${logClass} hover:bg-white/5 py-0.5 px-1 rounded transition`}>
                      {log}
                    </div>
                  );
                })}
                {loadingStep && (
                  <div className="text-amber-400 font-bold animate-pulse flex items-center gap-1.5 py-1">
                    <span className="h-1.5 w-1.5 bg-amber-400 rounded-full animate-ping"></span>
                    <span>[SISTEMA] Sincronizando con base física... Espere</span>
                  </div>
                )}
              </div>

              {/* Visual DB Output representation */}
              <div className="p-4 border-t border-arcane-purple/10 bg-gray-50 flex-grow flex flex-col justify-center">
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-[10px] uppercase font-mono tracking-wider text-gray-500">Salida de Datos por Paso</span>
                  <span className="text-[10px] font-mono text-arcane-purple">
                    {currentStep === 0 && 'Inicialice el flujo'}
                    {currentStep === 1 && 'JSON de respuesta del API Core REST'}
                    {currentStep === 2 && 'Documento BSON actualizado (MongoDB)'}
                    {currentStep === 3 && 'Fila de Auditoría Insertada (Cassandra)'}
                    {currentStep === 4 && 'Diferenciación Cypher: Sugerencias Recomendadas (Neo4j)'}
                  </span>
                </div>

                {/* Dynamic screen box for data */}
                <div className="p-4 rounded-xl bg-black border border-white/5 font-mono text-[11px] text-gray-300 leading-relaxed overflow-x-auto min-h-[160px] flex items-center justify-center">
                  
                  {currentStep === 0 && (
                    <div className="text-center text-gray-500 p-6 flex flex-col items-center gap-2 select-none">
                      <Database size={24} className="text-gray-600 animate-pulse" />
                      <span className="font-bold">Consola en espera</span>
                      <span className="text-[10px]">Presiona "DESENCADENAR VENTA" en el Paso 1 para ver el JSON transaccional</span>
                    </div>
                  )}

                  {currentStep === 1 && (
                    <pre className="text-teal-300 w-full animate-fade-in select-text">
                      <code>{steps[0].codeOutput}</code>
                    </pre>
                  )}

                  {currentStep === 2 && (
                    <pre className="text-emerald-300 w-full animate-fade-in select-text">
                      <code>{steps[1].codeOutput.split('\n').map((line, i) => {
                        if (line.includes('"status": "SOLD"')) {
                          return <span key={i} className="bg-red-500/20 text-red-300 font-bold px-1 rounded border border-red-500/30 block animate-pulse">{line}</span>;
                        }
                        return <span key={i}>{line}{'\n'}</span>;
                      })}</code>
                    </pre>
                  )}

                  {currentStep === 3 && (
                    <div className="w-full text-sky-300 overflow-x-auto animate-fade-in select-text">
                      <pre className="text-[10px] text-sky-400 font-mono mb-2">CQL schema: audit_trail_by_user</pre>
                      <pre className="bg-[#050209] p-2 rounded border border-white/5 w-full block text-[10px] leading-tight">
                        {steps[2].codeOutput}
                      </pre>
                    </div>
                  )}

                  {currentStep === 4 && (
                    <div className="w-full animate-fade-in select-text">
                      <span className="text-[10px] text-purple-400 font-mono block mb-2">// 6.7 — Recomendación por última obra vista (Cypher)</span>
                      <pre className="text-purple-300 bg-[#050209] p-3 rounded border border-white/5 text-[10px] leading-relaxed overflow-x-auto mb-4">
                        <code>{steps[3].codeOutput}</code>
                      </pre>
                      <span className="text-[10px] text-purple-400 font-mono block mb-2">Sugerencias calculadas por co‑compra:</span>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                        {[
                          { title: 'Simetrías Ocultas', artist: 'Salazar Inés', score: '95% match', bg: 'from-emerald-950/40' },
                          { title: 'Ecos del Púrpura', artist: 'Avendaño Licett', score: '88% match', bg: 'from-purple-950/40' },
                          { title: 'Laberinto del Tiempo', artist: 'Azocar Josue', score: '72% match', bg: 'from-sky-950/40' }
                        ].map((item, id) => (
                          <div key={id} className={`p-2.5 rounded-lg border border-arcane-lavender/10 bg-gradient-to-b ${item.bg} to-black flex flex-col justify-between`}>
                            <div>
                              <span className="text-[9px] font-mono text-arcane-lavender">{item.score}</span>
                              <h5 className="font-display font-bold text-xs text-white truncate mt-0.5">{item.title}</h5>
                            </div>
                            <span className="text-[10px] text-gray-400 mt-2 block italic">Por {item.artist}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                </div>
                
                {/* Stepper Footer actions triggers */}
                {currentStep > 0 && (
                  <div className="mt-3 flex justify-end">
                    <button
                      id="reset-demo-bottom-btn"
                      onClick={resetDemo}
                      className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-800 rounded text-[10px] font-mono cursor-pointer transition flex items-center gap-1 border border-gray-200"
                    >
                      <RotateCcw size={10} /> Reiniciar Simulación
                    </button>
                  </div>
                )}
              </div>

                </>
              ) : (
                <div className="p-4 bg-gray-50 flex-grow flex flex-col">
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-[10px] uppercase font-mono tracking-wider text-gray-500">Vista Visual de Datos</span>
                    <button
                      onClick={() => setViewMode(null)}
                      className="text-[9px] font-mono text-arcane-purple hover:text-white bg-arcane-purple/10 hover:bg-arcane-purple px-2 py-1 rounded transition cursor-pointer"
                    >
                      Cambiar modo
                    </button>
                  </div>

                  <div className="p-4 rounded-xl bg-white border border-gray-200 shadow-sm min-h-[280px] flex items-center justify-center">
                    {renderFrontendView()}
                  </div>

                  {currentStep > 0 && (
                    <div className="mt-3 flex justify-end">
                      <button
                        onClick={resetDemo}
                        className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-800 rounded text-[10px] font-mono cursor-pointer transition flex items-center gap-1 border border-gray-200"
                      >
                        <RotateCcw size={10} /> Reiniciar Simulación
                      </button>
                    </div>
                  )}
                </div>
              )}

            </div>

            </>

          )}

        </div>
      </div>
    </section>
  );
}
