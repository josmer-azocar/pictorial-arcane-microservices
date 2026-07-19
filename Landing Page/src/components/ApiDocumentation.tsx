import React, { useState } from 'react';
import { BookOpen, ChevronDown, ChevronUp, Copy, Check, Info, Server, Database } from 'lucide-react';
import { ApiEndpoint, DBEngine } from '../types';

export default function ApiDocumentation() {
  const [expandedId, setExpandedId] = useState<string | null>('get-artworks');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const endpoints: ApiEndpoint[] = [
    {
      method: 'GET',
      path: '/api/artworks',
      service: 'Catálogo / MongoDB',
      dbType: DBEngine.MongoDB,
      description: 'Consulta el catálogo polimórfico completo de obras de arte contemporáneo o filtrado por atributos. Ideal para búsquedas ágiles soportadas por los índices b-tree de MongoDB.',
      parameters: [
        { name: 'tag', type: 'string', required: false, description: 'Filtra obras por estilos (p. ej. "abstracto", "escultura", "NFT").' },
        { name: 'status', type: 'string', required: false, description: 'Filtra disponibilidad. Valores: "AVAILABLE", "SOLD", "RESERVED".' }
      ],
      responseBody: `[
  {
    "_id": "6667b2d5fbcb8b2bac10de01",
    "artwork_id": "42f9e612-da13-4318-8fe9-825fb4d1ff01",
    "title": "Círculos Arcanos en Púrpura",
    "medium": "Pintura Digital",
    "status": "AVAILABLE",
    "price": 450000.00,
    "artist": { "artist_id": "e45a20d4-1a93...", "name": "Salazar Inés" },
    "digital_metadata": { "is_nft": true, "blockchain": "Ethereum" }
  }
]`,
      statusCode: 200
    },
    {
      method: 'POST',
      path: '/api/sales',
      service: 'Ventas / PostgreSQL Core',
      dbType: DBEngine.PostgreSQL,
      description: 'Registra la compraventa de una obra de arte físico/digital de forma atómica en el Core Relacional. Bloquea el registro oficial para evitar dobles adquisiciones físicas y dispara la cola de sincronización hacia NoSQL (Outbox Pattern).',
      parameters: [],
      requestBody: `{
  "user_dni": "v-23456789",
  "artwork_id": "42f9e612-da13-4318-8fe9-825fb4d1ff01",
  "payment_method": "DEBIT_CARD"
}`,
      responseBody: `{
  "success": true,
  "sale_id": "c1a93feb-491a-45ef-a330-9f82d3cdff90",
  "invoice_num": "FAC-2026-9918",
  "amount_paid": 450000.00,
  "transaction_isolation": "SERIALIZABLE",
  "outbox_status": "QUEUED"
}`,
      statusCode: 211 // 201 Created representation
    },
    {
      method: 'GET',
      path: '/api/audit/events',
      service: 'Auditoría / Cassandra',
      dbType: DBEngine.Cassandra,
      description: 'Recupera de Cassandra la bitácora inmutable de eventos asociados a un DNI de usuario para auditoría de navegación, seguridad e históricos. Realiza la lectura ultra rápida mediante la llave de partición user_dni.',
      parameters: [
        { name: 'userDni', type: 'string', required: true, description: 'DNI del usuario. Clave de partición CQL primaria para acelerar consultas sin sobrecargar el anillo Cassandra.' }
      ],
      responseBody: `[
  {
    "user_dni": "v-23456789",
    "event_timestamp": "2026-06-11T00:15:32.410Z",
    "event_id": "ccb90a2a-883c-11eb",
    "action": "PURCHASE",
    "artwork_id": "42f9e612-da13-4318-8fe9-825fb4d1ff01",
    "client_ip": "190.140.22.180",
    "latency_ms": 14
  }
]`,
      statusCode: 200
    },
    
    {
      method: 'GET',
      path: '/api/reports/billing',
      service: 'Reportería / Cassandra',
      dbType: DBEngine.Cassandra,
      description: 'Genera el agregado estadístico de ventas acumuladas procesadas históricamente desde Cassandra wide-tables para reportar cargas masivas de auditoría contable.',
      parameters: [
        { name: 'year', type: 'integer', required: false, description: 'Filtra el reporte contable por año.' },
        { name: 'limit', type: 'integer', required: false, description: 'Número de filas máximas a analizar.' }
      ],
      responseBody: `{
  "report_year": 2026,
  "total_sales_count": 4820,
  "total_revenue_usd": 15920000.00,
  "engine": "Apache Cassandra Engine (AP)"
}`,
      statusCode: 200
    },
    {
      method: 'POST',
      path: '/api/users/register',
      service: 'Usuarios / PostgreSQL Core',
      dbType: DBEngine.PostgreSQL,
      description: 'Registra un nuevo coleccionista, artista o administrador en la base relacional PostgreSQL principal, asegurando unicidad de DNI mediante restricciones de clave externa.',
      parameters: [],
      requestBody: `{
  "dni": "v-23456789",
  "name": "José",
  "email": "jose@uneg.edu.ve",
  "role": "COLLECTOR"
}`,
      responseBody: `{
  "status": "registered",
  "user_id": "b1b1b1-2c2c-4a3d-ae90-cfdf9918df90",
  "registered_at": "2026-06-11T00:15:20Z",
  "db_catalog": "PostgreSQL ACID"
}`,
      statusCode: 211 // 201 Created
    }
  ];

  const handleToggle = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <section 
      id="api-documentation" 
      className="pt-16 pb-8 px-4 sm:px-6 lg:px-8 border-b border-arcane-purple/10"
    >
      <div className="max-w-7xl mx-auto">
        
        {/* Section Header */}
        <div className="text-center mb-8">
          <span className="text-xs font-mono uppercase tracking-widest text-arcane-purple bg-arcane-purple/10 px-3 py-1 rounded-full border border-arcane-purple/20">
            Documentación Técnica de APIs
          </span>
          <h2 className="font-display font-bold text-3xl sm:text-4xl text-gray-900 mt-3 mb-4 tracking-tight">
            INTERFACE CONTRACTS (SWAGGER SPEC)
          </h2>
          <p className="font-sans text-gray-500 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed">
            Consulte las firmas de entrada y salida para la comunicación asíncrona de los microservicios. 
            Cada endpoint interactúa con su motor asignado para garantizar la persistencia óptima.
          </p>
        </div>

        {/* Console Swagger Container */}
        <div className="bg-white border border-arcane-purple/10 rounded-2xl overflow-hidden shadow-sm arcane-glass-light">
          
          {/* Swagger header */}
          <div className="bg-gray-50 py-4 px-6 border-b border-gray-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="px-3 py-1.5 bg-amber-50 text-amber-700 border border-amber-200 rounded-md text-xs font-mono font-bold flex items-center gap-1.5">
                <Server size={14} /> Open-API Spec
              </div>
              <div>
                <h3 className="font-display font-bold text-base text-gray-900">Swagger UI SBDII</h3>
                <p className="text-[10px] text-gray-500 font-mono">v1.2.0 · SpringDoc Open-API Engine</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <a
                href="https://api-gateway.calmgrass-156d398a.eastus.azurecontainerapps.io/swagger-ui/index.html#/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-[11px] font-bold tracking-wide uppercase transition-all duration-300 bg-gradient-to-r from-arcane-purple-dark via-arcane-purple to-arcane-purple-dark text-white shadow-[0_4px_16px_rgba(124,58,237,0.35)] hover:shadow-[0_6px_24px_rgba(124,58,237,0.5)] hover:scale-105 active:scale-95 border border-arcane-lavender/30"
              >
                <BookOpen size={14} />
                Swagger UI
              </a>
            </div>
          </div>

          {/* Endpoints listing wrapper */}
          <div className="p-4 sm:p-6 space-y-4">
            
            {endpoints.map((ep, idx) => {
              const isGet = ep.method === 'GET';
              const epId = `${ep.method.toLowerCase()}-${ep.path.replace(/[\/\{\}]/g, '-')}`;
              const isExpanded = expandedId === epId;
              
              const methodBg = isGet 
                ? 'bg-sky-500/10 text-sky-400 border-sky-500/20' 
                : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';

              const methodLabelBg = isGet ? 'bg-sky-500' : 'bg-emerald-500';

              return (
                <div 
                  key={idx}
                  id={`endpoint-card-${epId}`}
                  className={`border rounded-xl transition-all duration-300 ${
                    isExpanded 
                      ? 'bg-white border-arcane-purple/20 shadow-sm' 
                      : 'bg-white border-gray-200 hover:border-gray-300'
                  }`}
                >
                  
                  {/* Expandible Endpoint Header row */}
                  <div 
                    onClick={() => handleToggle(epId)}
                    className="p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 cursor-pointer select-none"
                  >
                    <div className="flex items-center gap-3 flex-grow">
                      {/* Method Badge */}
                      <span className={`px-3 py-1 rounded text-xs font-black tracking-wider text-white ${methodLabelBg} min-w-[65px] text-center shadow-md`}>
                        {ep.method}
                      </span>
                      
                      <span className="font-mono text-sm font-bold text-gray-800 tracking-wide truncate">{ep.path}</span>
                      
                      {/* Microservice tag */}
                      <span className="hidden sm:inline-block text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-gray-100 border border-gray-200 text-gray-500">
                        {ep.service}
                      </span>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-4">
                      <span className="text-xs text-gray-400 truncate max-w-xs hidden md:inline">{ep.description.slice(0, 50)}...</span>
                      {isExpanded ? <ChevronUp size={16} className="text-gray-400" /> : <ChevronDown size={16} className="text-gray-400" />}
                    </div>
                  </div>

                  {/* Expanded documentation details area */}
                  {isExpanded && (
                    <div className="p-4 sm:p-6 border-t border-gray-200 bg-gray-50 space-y-6 animate-fade-in select-text">
                      
                      {/* Detailed Description */}
                      <div>
                        <span className="text-[10px] uppercase font-mono tracking-wider text-gray-500 block mb-1">Descripción:</span>
                        <p className="text-xs sm:text-sm text-gray-700 leading-relaxed font-sans">{ep.description}</p>
                      </div>

                      {/* Path / Query Parameters */}
                      {ep.parameters.length > 0 && (
                        <div>
                          <span className="text-[10px] uppercase font-mono tracking-wider text-gray-500 block mb-2">Parámetros de consulta:</span>
                          <div className="overflow-x-auto rounded-lg border border-gray-200">
                            <table className="w-full text-left font-sans text-xs">
                              <thead>
                                <tr className="bg-gray-100 text-gray-500 font-mono text-[10px] border-b border-gray-200">
                                  <th className="p-3">Nombre</th>
                                  <th className="p-3">Tipo</th>
                                  <th className="p-3">Requerido</th>
                                  <th className="p-3">Descripción</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-gray-200 text-gray-700">
                                {ep.parameters.map((param, i) => (
                                  <tr key={i} className="hover:bg-gray-100">
                                    <td className="p-3 font-mono font-bold text-arcane-purple">{param.name}</td>
                                    <td className="p-3 font-mono text-gray-400">{param.type}</td>
                                    <td className="p-3">
                                      {param.required ? (
                                        <span className="text-rose-400 font-bold font-mono">true</span>
                                      ) : (
                                        <span className="text-gray-500 font-mono">false</span>
                                      )}
                                    </td>
                                    <td className="p-3 text-gray-300">{param.description}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      )}

                      {/* Request and Response payload outputs */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        
                        {/* Request JSON (if POST) */}
                        {ep.requestBody && (
                          <div className="flex flex-col">
                            <span className="text-[10px] uppercase font-mono tracking-wider text-gray-500 mb-1.5 flex items-center justify-between">
                              Request Body Payload (JSON):
                              <button 
                                id={`copy-req-payload-btn-${epId}`}
                                onClick={() => handleCopy(`${epId}-req`, ep.requestBody || '')}
                                className="text-gray-500 hover:text-white flex items-center gap-1 cursor-pointer"
                              >
                                {copiedId === `${epId}-req` ? (
                                  <>
                                    <Check size={10} className="text-emerald-400" /> Copiado
                                  </>
                                ) : (
                                  <>
                                    <Copy size={10} /> Copiar
                                  </>
                                )}
                              </button>
                            </span>
                            <pre className="p-4 rounded-xl bg-black border border-white/5 font-mono text-[11px] text-teal-300 overflow-x-auto flex-grow max-h-[180px]">
                              <code>{ep.requestBody}</code>
                            </pre>
                          </div>
                        )}

                        {/* Response JSON */}
                        <div className="flex flex-col col-span-1 md:col-span-2">
                          <span className="text-[10px] uppercase font-mono tracking-wider text-gray-500 mb-1.5 flex items-center justify-between">
                            Response Body Schema ({ep.statusCode === 211 ? '201 Created' : '200 OK'}):
                            <button 
                              id={`copy-res-payload-btn-${epId}`}
                              onClick={() => handleCopy(`${epId}-res`, ep.responseBody)}
                              className="text-gray-500 hover:text-white flex items-center gap-1 cursor-pointer"
                            >
                              {copiedId === `${epId}-res` ? (
                                <>
                                  <Check size={10} className="text-emerald-400" /> Copiado
                                </>
                              ) : (
                                <>
                                  <Copy size={10} /> Copiar
                                  </>
                              )}
                            </button>
                          </span>
                          <pre className="p-4 rounded-xl bg-black border border-white/5 font-mono text-[11px] text-emerald-300 overflow-x-auto max-h-[220px]">
                            <code>{ep.responseBody}</code>
                          </pre>
                        </div>

                      </div>
                      
                      {/* Technical Footnote */}
                      <div className="p-3 rounded-lg bg-gray-100 border border-gray-200 flex items-center gap-2 text-xs text-gray-500 font-mono">
                        <Info size={12} className="text-arcane-purple" />
                        <span>Mapeador SBDII: Este endpoint desencadena flujos en {ep.dbType}. El tiempo de respuesta óptimo ronda los {ep.dbType === DBEngine.Cassandra ? '14ms' : '23ms'}.</span>
                      </div>

                    </div>
                  )}

                </div>
              );
            })}

          </div>
        </div>

      </div>
    </section>
  );
}
