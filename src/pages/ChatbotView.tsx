import React, { useState, useEffect, useRef } from 'react';
import { 
  Send, 
  RotateCcw, 
  Download, 
  Layers, 
  AlertTriangle, 
  CheckCircle2, 
  Package, 
  Activity, 
  ShieldCheck, 
  RefreshCw, 
  ArrowRight,
  Database,
  Cpu,
  Info
} from 'lucide-react';
import { 
  MerkaticsCopilotoIA, 
  MerkaticsSparkle,
  MerkaticsEmpresa,
  MerkaticsMultiempresa
} from '../components/icons/MerkaticsIcons';
import { 
  ChatMessage, 
  enviarMensajeChat, 
  recopilarContextoPlanta, 
  PlantContextData, 
  CONSULTAS_RAPIDAS 
} from '../services/aiService';
import { ChatMessageBubble } from '../components/ChatMessageBubble';
import { StatusBadge } from '../components/StatusBadge';
import { useEmpresa } from '../contexts/EmpresaContext';

interface ChatbotViewProps {
  onSelectLote: (numeroLote: string, destino?: 'capturar' | 'historial') => void;
  loteInicialId?: string;
}

export const ChatbotView: React.FC<ChatbotViewProps> = ({
  onSelectLote,
  loteInicialId,
}) => {
  const { empresaActiva, esVistaGlobal, empresas } = useEmpresa();
  const [inputTexto, setInputTexto] = useState('');
  const [cargando, setCargando] = useState(false);
  const [refrescandoContexto, setRefrescandoContexto] = useState(false);
  const [contextoPlanta, setContextoPlanta] = useState<PlantContextData | null>(null);

  const [mensajes, setMensajes] = useState<ChatMessage[]>([
    {
      id: 'init-view-1',
      role: 'model',
      content: `¡Bienvenido al **Centro de Inteligencia y Copiloto IA de TRAZA-MX**!

Estoy sincronizado en tiempo real con la base de datos de producción y las directrices normativas de la empresa activa. Puedo ayudarte con:

1. **Auditoría de Lotes:** Consulta el historial, piezas procesadas, operadores y estatus de cualquier lote (**LOT-2026-0001**, etc.).
2. **Layout y Recorrido de Material:** Rastreo de flujo físico a través de las bahías (Recepción -> Maquinado CNC / Ensamble -> Metrología Calidad -> Empaque).
3. **Detección de Incidencias:** Identificación de rechazos y planes de acción correctiva (5 Porqués / 8D).
4. **Cumplimiento Normativo:** Verificación de lineamientos ISO 9001:2015, IATF 16949 y AS9100D.
5. **Reporte de Turno:** Generación inmediata de resúmenes de producción para entrega de guardia.

¿Qué consulta deseas realizar hoy?`,
      timestamp: 'Inicio de sesión',
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const cargarContexto = async () => {
    setRefrescandoContexto(true);
    try {
      const data = await recopilarContextoPlanta(empresaActiva);
      if (data) {
        setContextoPlanta(data);
      }
    } finally {
      setRefrescandoContexto(false);
    }
  };

  useEffect(() => {
    cargarContexto();
  }, [empresaActiva]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [mensajes, cargando]);

  // Si se pasa un lote inicial, sugerir consulta
  useEffect(() => {
    if (loteInicialId) {
      // no sobreescribir si ya hay charla
    }
  }, [loteInicialId]);

  const handleEnviar = async (textoAEnviar?: string) => {
    const texto = (textoAEnviar || inputTexto).trim();
    if (!texto || cargando) return;

    const ahora = new Date();
    const horaFormateada = `${String(ahora.getHours()).padStart(2, '0')}:${String(ahora.getMinutes()).padStart(2, '0')}`;

    const mensajeUsuario: ChatMessage = {
      id: `usr-${Date.now()}`,
      role: 'user',
      content: texto,
      timestamp: horaFormateada,
    };

    const nuevoHistorial = [...mensajes, mensajeUsuario];
    setMensajes(nuevoHistorial);
    setInputTexto('');
    setCargando(true);

    try {
      const ctx = contextoPlanta || (await recopilarContextoPlanta());
      if (ctx && !contextoPlanta) {
        setContextoPlanta(ctx);
      }

      const respuestaIA = await enviarMensajeChat(nuevoHistorial, ctx);

      const mensajeRespuesta: ChatMessage = {
        id: `bot-${Date.now()}`,
        role: 'model',
        content: respuestaIA,
        timestamp: `${String(new Date().getHours()).padStart(2, '0')}:${String(new Date().getMinutes()).padStart(2, '0')}`,
      };

      setMensajes([...nuevoHistorial, mensajeRespuesta]);
    } catch (err: any) {
      const mensajeError: ChatMessage = {
        id: `err-${Date.now()}`,
        role: 'model',
        content: `⚠️ Hubo un error de comunicación con el servicio de IA: ${err.message || 'Error desconocido'}. Verifica la conectividad o la configuración del servidor.`,
        timestamp: `${String(new Date().getHours()).padStart(2, '0')}:${String(new Date().getMinutes()).padStart(2, '0')}`,
      };
      setMensajes([...nuevoHistorial, mensajeError]);
    } finally {
      setCargando(false);
    }
  };

  const handleReiniciarChat = () => {
    setMensajes([
      {
        id: `init-${Date.now()}`,
        role: 'model',
        content: `Conversación reiniciada. ¿Qué información operativa o de calidad necesitas consultar?`,
        timestamp: 'Ahora',
      },
    ]);
  };

  const handleExportarChat = () => {
    const contenido = mensajes
      .map((m) => `[${m.timestamp}] ${m.role === 'user' ? 'OPERADOR' : 'TRAZABOT'}:\n${m.content}\n`)
      .join('\n---\n\n');

    const blob = new Blob([contenido], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Reporte-Trazabilidad-IA-${new Date().toISOString().split('T')[0]}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Encabezado Principal */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-white shadow-lg shadow-black/20">
            <MerkaticsCopilotoIA size={26} />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                Copiloto de Inteligencia Artificial
              </h1>
              <span className="inline-flex items-center gap-1.5 text-xs font-bold bg-[#E2554F]/10 text-[#E2554F] border border-[#E2554F]/30 px-2.5 py-0.5 rounded-full font-mono">
                <MerkaticsSparkle size={12} />
                MERKATICS Copilot • Gemini
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Auditoría inteligente de lotes, detección de cuellos de botella, normas ISO y reportes de producción.
            </p>
          </div>
        </div>

        {/* Acciones de la barra superior */}
        <div className="flex items-center gap-2 self-start md:self-auto">
          <button
            onClick={cargarContexto}
            disabled={refrescandoContexto}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
            title="Sincronizar datos de Firestore"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${refrescandoContexto ? 'animate-spin text-blue-600' : ''}`} />
            <span>Actualizar Datos</span>
          </button>

          <button
            onClick={handleExportarChat}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
            title="Descargar registro de la conversación"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Exportar Reporte</span>
          </button>

          <button
            onClick={handleReiniciarChat}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-red-50 hover:text-red-600 text-slate-700 transition-colors cursor-pointer"
            title="Limpiar conversación"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Reiniciar</span>
          </button>
        </div>
      </div>

      {/* Grid: Chat Principal + Panel Lateral de Operaciones */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Columna Izquierda: Feed del Chat (8 cols en desktop) */}
        <div className="lg:col-span-8 flex flex-col h-[700px] bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          {/* Barra de estado del asistente */}
          <div className="px-5 py-3.5 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
            <div className="flex items-center gap-3">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <div>
                <p className="text-xs font-bold tracking-wide text-white">TrazaBot Industrial</p>
                <p className="text-[10px] text-slate-400 font-mono">
                  {contextoPlanta
                    ? `Contexto: ${contextoPlanta.lotes.length} lotes, ${contextoPlanta.productos.length} productos sincronizados`
                    : 'Cargando contexto de manufactura...'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs text-slate-300">
              <Database className="w-3.5 h-3.5 text-blue-400" />
              <span className="text-[11px] font-medium hidden sm:inline">Firestore Grounding</span>
            </div>
          </div>

          {/* Feed de mensajes con scroll */}
          <div className="flex-1 p-5 overflow-y-auto space-y-3 bg-slate-50/40">
            {mensajes.map((msg) => (
              <ChatMessageBubble
                key={msg.id}
                message={msg}
                onSelectLote={(loteId) => onSelectLote(loteId, 'historial')}
              />
            ))}

            {cargando && (
              <div className="flex gap-3 my-3 items-start animate-pulse">
                <div className="w-8 h-8 rounded-xl bg-slate-900 border border-slate-800 text-white flex items-center justify-center shrink-0">
                  <MerkaticsCopilotoIA size={16} />
                </div>
                <div className="bg-white border border-slate-200 rounded-2xl rounded-tl-xs px-4 py-3 shadow-xs">
                  <div className="flex items-center gap-2 text-xs font-semibold text-slate-600">
                    <span className="w-2 h-2 rounded-full bg-blue-600 animate-ping" />
                    <span>TrazaBot está procesando los registros de trazabilidad...</span>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Barra de sugerencias frecuentes */}
          <div className="px-4 py-2.5 bg-slate-100/70 border-t border-slate-200/80 flex items-center gap-2 overflow-x-auto no-scrollbar">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider shrink-0 flex items-center gap-1.5">
              <MerkaticsSparkle size={14} />
              Sugerencias:
            </span>
            {CONSULTAS_RAPIDAS.map((c, i) => (
              <button
                key={i}
                onClick={() => handleEnviar(c.prompt)}
                disabled={cargando}
                className="shrink-0 text-xs font-medium bg-white hover:bg-blue-50 hover:text-blue-700 text-slate-700 px-3 py-1.5 rounded-lg border border-slate-200 shadow-2xs transition-colors cursor-pointer disabled:opacity-50"
              >
                {c.titulo}
              </button>
            ))}
          </div>

          {/* Caja de texto para enviar mensaje */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleEnviar();
            }}
            className="p-4 bg-white border-t border-slate-200 flex items-center gap-3"
          >
            <input
              type="text"
              value={inputTexto}
              onChange={(e) => setInputTexto(e.target.value)}
              placeholder="Escribe tu consulta o pide un análisis (ej. '¿Qué lotes tienen rechazos?')..."
              disabled={cargando}
              className="flex-1 bg-slate-50 hover:bg-slate-100/70 focus:bg-white text-slate-800 text-sm px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:outline-none transition-all placeholder:text-slate-400"
            />
            <button
              type="submit"
              disabled={!inputTexto.trim() || cargando}
              className="px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-40 disabled:hover:bg-blue-600 text-white font-semibold text-sm flex items-center gap-2 shrink-0 transition-colors shadow-xs cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span className="hidden sm:inline">Enviar</span>
            </button>
          </form>
        </div>

        {/* Columna Derecha: Panel de Contexto de Planta & Acciones Rápidas (4 cols) */}
        <div className="lg:col-span-4 space-y-5">
          {/* Tarjeta: Pulso Operativo en Vivo */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-sm text-slate-900 tracking-tight flex items-center gap-2">
                <Activity className="w-4 h-4 text-blue-600" />
                Pulso Operativo Actual
              </h3>
              <span className="text-[10px] font-mono text-slate-400">En tiempo real</span>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                  Total Lotes
                </span>
                <span className="text-xl font-black text-slate-800 font-mono">
                  {contextoPlanta?.stats.totalLotes ?? '—'}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-blue-50/70 border border-blue-100">
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 block">
                  En Proceso
                </span>
                <span className="text-xl font-black text-blue-700 font-mono">
                  {contextoPlanta?.stats.enProduccion ?? '—'}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-emerald-50/70 border border-emerald-100">
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 block">
                  Terminados
                </span>
                <span className="text-xl font-black text-emerald-700 font-mono">
                  {contextoPlanta?.stats.terminados ?? '—'}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-100">
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600 block">
                  Incidencias
                </span>
                <span className="text-xl font-black text-amber-700 font-mono">
                  {contextoPlanta?.stats.incidencias ?? '—'}
                </span>
              </div>
            </div>

            <p className="text-[11px] text-slate-500 leading-relaxed bg-slate-50 p-2.5 rounded-lg border border-slate-100">
              💡 TrazaBot utiliza estas métricas de Firestore para fundamentar todas sus respuestas con datos verídicos de la planta.
            </p>
          </div>

          {/* Tarjeta: Lotes Activos para Auditoría Rápida */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <h3 className="font-bold text-sm text-slate-900 tracking-tight flex items-center gap-2 mb-3">
              <Layers className="w-4 h-4 text-indigo-600" />
              Auditoría Directa de Lotes
            </h3>
            <p className="text-xs text-slate-500 mb-3">
              Haz clic en cualquier lote registrado para que el asistente analice su historial y estado:
            </p>

            <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
              {contextoPlanta?.lotes && contextoPlanta.lotes.length > 0 ? (
                contextoPlanta.lotes.map((lote) => (
                  <div
                    key={lote.numeroLote}
                    className="p-2.5 rounded-xl border border-slate-100 hover:border-blue-200 bg-slate-50/60 hover:bg-blue-50/50 flex items-center justify-between transition-all"
                  >
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono font-bold text-xs text-slate-800">
                          {lote.numeroLote}
                        </span>
                        <StatusBadge status={lote.estado} size="sm" />
                      </div>
                      <p className="text-[11px] text-slate-500 truncate max-w-[170px] mt-0.5">
                        {lote.productoNombre || lote.productoId} • {lote.cantidadInicial} {lote.unidad}
                      </p>
                    </div>

                    <button
                      onClick={() =>
                        handleEnviar(
                          `Realiza una auditoría completa del lote ${lote.numeroLote}: ¿cuál es su estado, en qué etapa se encuentra, quiénes han sido los operadores y si presenta alguna anomalía?`
                        )
                      }
                      className="text-xs font-semibold text-blue-600 hover:text-blue-800 p-1.5 hover:bg-blue-100 rounded-lg transition-colors cursor-pointer"
                      title="Auditar lote con IA"
                    >
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                ))
              ) : (
                <div className="text-center py-4 text-xs text-slate-400">
                  Cargando lotes registrados...
                </div>
              )}
            </div>
          </div>

          {/* Tarjeta: Asistente Normativo */}
          <div className="bg-gradient-to-br from-slate-900 to-indigo-950 text-white p-5 rounded-2xl shadow-sm border border-slate-800">
            <div className="flex items-center gap-2 mb-2 text-indigo-300">
              <ShieldCheck className="w-5 h-5" />
              <h4 className="font-bold text-sm tracking-tight">Estándares de Calidad</h4>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed mb-4">
              Pregunta por metodologías de control de calidad o formatos de no conformidad:
            </p>

            <div className="space-y-1.5">
              <button
                onClick={() =>
                  handleEnviar(
                    '¿Cuáles son los pasos recomendados para elaborar un informe 8D ante un lote rechazado en Inspección?'
                  )
                }
                className="w-full text-left text-xs bg-white/10 hover:bg-white/20 text-slate-200 px-3 py-2 rounded-xl transition-colors cursor-pointer"
              >
                • Protocolo 8D ante rechazo en Inspección
              </button>
              <button
                onClick={() =>
                  handleEnviar(
                    'Explica la importancia de la identificación por código QR en tarimas de empaque para evitar mezclas de lote.'
                  )
                }
                className="w-full text-left text-xs bg-white/10 hover:bg-white/20 text-slate-200 px-3 py-2 rounded-xl transition-colors cursor-pointer"
              >
                • Prevención de mezclas de lote con código QR
              </button>
              <button
                onClick={() =>
                  handleEnviar(
                    '¿Cómo se define el requisito 8.5.2 de Trazabilidad e Identificación en ISO 9001:2015?'
                  )
                }
                className="w-full text-left text-xs bg-white/10 hover:bg-white/20 text-slate-200 px-3 py-2 rounded-xl transition-colors cursor-pointer"
              >
                • Requisito ISO 9001:2015 cláusula 8.5.2
              </button>
              <button
                onClick={() =>
                  handleEnviar(
                    '¿Cuánto tiempo se ahorra en localización de lotes, auditorías mock recall y tiempos de entrega con TRAZA-MX?'
                  )
                }
                className="w-full text-left text-xs bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/30 px-3 py-2 rounded-xl transition-colors cursor-pointer font-medium"
              >
                ⚡ Cuantificación de tiempos ahorrados y ROI
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
