import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  Send, 
  Maximize2, 
  RotateCcw, 
  Layers, 
  AlertCircle, 
  Database, 
  ArrowRight 
} from 'lucide-react';
import { 
  MerkaticsCopilotoIA, 
  MerkaticsSparkle 
} from './icons/MerkaticsIcons';
import { 
  ChatMessage, 
  enviarMensajeChat, 
  recopilarContextoPlanta, 
  PlantContextData, 
  CONSULTAS_RAPIDAS 
} from '../services/aiService';
import { ChatMessageBubble } from './ChatMessageBubble';
import { useEmpresa } from '../contexts/EmpresaContext';

interface ChatbotWidgetProps {
  onIrAAsistenteCompleto: () => void;
  onSelectLote: (loteId: string) => void;
  loteActualId?: string;
}

export const ChatbotWidget: React.FC<ChatbotWidgetProps> = ({
  onIrAAsistenteCompleto,
  onSelectLote,
  loteActualId,
}) => {
  const { empresaActiva } = useEmpresa();
  const [isOpen, setIsOpen] = useState(false);
  const [inputTexto, setInputTexto] = useState('');
  const [cargando, setCargando] = useState(false);
  const [contextoPlanta, setContextoPlanta] = useState<PlantContextData | null>(null);

  const [mensajes, setMensajes] = useState<ChatMessage[]>([
    {
      id: 'init-1',
      role: 'model',
      content: `¡Hola! Soy **TrazaBot**, tu copiloto de IA para la trazabilidad industrial de TRAZA-MX.

Tengo acceso directo a los lotes, productos y movimientos registrados en la planta. Puedo auditar lotes, analizar rechazos de calidad o recomendar acciones bajo normas ISO 9001.

¿En qué puedo ayudarte hoy?`,
      timestamp: 'Ahora',
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Cargar contexto en tiempo real al abrir el widget
  useEffect(() => {
    if (isOpen) {
      recopilarContextoPlanta(empresaActiva).then((ctx) => {
        if (ctx) setContextoPlanta(ctx);
      });
    }
  }, [isOpen, empresaActiva]);

  // Auto-scroll al final al recibir nuevos mensajes
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [mensajes, isOpen, cargando]);

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
      // Si el contexto no se ha cargado o queremos refrescar
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
        content: `⚠️ Hubo un inconveniente al conectar con el modelo Gemini: ${err.message || 'Error desconocido'}. Asegúrate de que la clave de API esté configurada o intenta de nuevo en unos momentos.`,
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
        content: `Conversación reiniciada. Estoy listo para ayudarte a auditar lotes, consultar especificaciones técnicas de productos o resolver no conformidades.`,
        timestamp: 'Ahora',
      },
    ]);
  };

  return (
    <>
      {/* Botón flotante para abrir el asistente */}
      {!isOpen && (
        <div className="fixed bottom-6 right-6 z-40 flex items-center gap-2">
          <button
            onClick={() => setIsOpen(true)}
            className="group relative flex items-center gap-2.5 px-4 py-3 bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white rounded-2xl shadow-xl shadow-blue-600/30 hover:shadow-blue-600/50 transition-all duration-200 border border-blue-400/30 cursor-pointer hover:scale-105 active:scale-95"
            aria-label="Abrir Copiloto IA de Trazabilidad"
          >
            <div className="relative">
              <MerkaticsCopilotoIA size={22} className="transition-transform group-hover:rotate-12" />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-indigo-700 animate-pulse" />
            </div>
            <div className="text-left">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold tracking-tight">Copiloto IA</span>
                <MerkaticsSparkle size={12} />
              </div>
              <span className="text-[10px] text-blue-100 font-medium block leading-none">
                Consultar Lotes & Calidad
              </span>
            </div>
          </button>
        </div>
      )}

      {/* Ventana flotante del Chatbot */}
      {isOpen && (
        <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 w-[calc(100vw-2rem)] sm:w-[420px] max-w-[420px] h-[580px] max-h-[85vh] bg-white rounded-3xl shadow-2xl border border-slate-200/90 flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
          {/* Cabecera del chat */}
          <div className="p-4 bg-slate-900 text-white flex items-center justify-between shrink-0 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700/80 flex items-center justify-center text-white shadow-md shadow-black/30">
                <MerkaticsCopilotoIA size={22} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-sm tracking-tight text-white flex items-center gap-1.5">
                    TrazaBot
                    <span className="text-[10px] bg-[#E2554F]/20 text-[#E2554F] border border-[#E2554F]/30 px-1.5 py-0.2 rounded font-mono font-normal">
                      Gemini 3.8
                    </span>
                  </h3>
                </div>
                <div className="flex items-center gap-1.5 text-[11px] text-emerald-400 font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Conectado a trazabilidad en vivo</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1">
              {/* Botón para abrir vista completa */}
              <button
                onClick={() => {
                  setIsOpen(false);
                  onIrAAsistenteCompleto();
                }}
                className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
                title="Abrir en pantalla completa"
              >
                <Maximize2 className="w-4 h-4" />
              </button>

              {/* Botón reiniciar conversación */}
              <button
                onClick={handleReiniciarChat}
                className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
                title="Reiniciar conversación"
              >
                <RotateCcw className="w-4 h-4" />
              </button>

              {/* Cerrar modal */}
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
                title="Minimizar"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Contexto badge activo si existe un lote enfocado */}
          {loteActualId && (
            <div className="px-4 py-2 bg-blue-50/80 border-b border-blue-100/80 flex items-center justify-between text-xs text-blue-900 shrink-0">
              <div className="flex items-center gap-1.5 truncate">
                <Layers className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                <span className="truncate">Lote enfocado: <strong className="font-mono">{loteActualId}</strong></span>
              </div>
              <button
                onClick={() => handleEnviar(`¿Cuál es el estado y trazabilidad completa del lote ${loteActualId}?`)}
                className="text-[11px] font-bold text-blue-700 hover:text-blue-900 hover:underline shrink-0"
              >
                Consultar
              </button>
            </div>
          )}

          {/* Lista de mensajes */}
          <div className="flex-1 p-4 overflow-y-auto space-y-2 bg-slate-50/50">
            {mensajes.map((msg) => (
              <ChatMessageBubble
                key={msg.id}
                message={msg}
                onSelectLote={(loteId) => {
                  onSelectLote(loteId);
                  setIsOpen(false);
                }}
              />
            ))}

            {cargando && (
              <div className="flex gap-3 my-3 items-start animate-pulse">
                <div className="w-8 h-8 rounded-xl bg-slate-900 border border-slate-800 text-white flex items-center justify-center shrink-0">
                  <MerkaticsCopilotoIA size={16} />
                </div>
                <div className="bg-white border border-slate-200 rounded-2xl rounded-tl-xs px-4 py-3 shadow-xs">
                  <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
                    <span className="w-2 h-2 rounded-full bg-blue-600 animate-ping" />
                    <span>Analizando registros de trazabilidad...</span>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Sugerencias rápidas en chips */}
          <div className="px-3 py-2 bg-white border-t border-slate-100 flex items-center gap-1.5 overflow-x-auto shrink-0 no-scrollbar">
            {CONSULTAS_RAPIDAS.map((c, i) => (
              <button
                key={i}
                onClick={() => handleEnviar(c.prompt)}
                disabled={cargando}
                className="shrink-0 text-[11px] font-medium bg-slate-100 hover:bg-blue-50 hover:text-blue-700 text-slate-700 px-2.5 py-1 rounded-lg border border-slate-200/80 transition-colors cursor-pointer"
              >
                {c.titulo}
              </button>
            ))}
          </div>

          {/* Caja de entrada */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleEnviar();
            }}
            className="p-3 bg-white border-t border-slate-200/80 flex items-center gap-2 shrink-0"
          >
            <input
              type="text"
              value={inputTexto}
              onChange={(e) => setInputTexto(e.target.value)}
              placeholder="Pregunta sobre lotes, rechazos, calidad..."
              disabled={cargando}
              className="flex-1 bg-slate-100 hover:bg-slate-100/80 focus:bg-white text-slate-800 text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-transparent focus:border-blue-500 focus:outline-none transition-all placeholder:text-slate-400"
            />
            <button
              type="submit"
              disabled={!inputTexto.trim() || cargando}
              className="w-10 h-10 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-40 disabled:hover:bg-blue-600 text-white flex items-center justify-center shrink-0 transition-colors shadow-xs cursor-pointer"
              title="Enviar mensaje"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </>
  );
};
