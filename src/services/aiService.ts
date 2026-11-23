import { 
  obtenerEstadisticasDashboard, 
  obtenerLotes, 
  obtenerProductos, 
  obtenerUltimosMovimientos,
  obtenerPiezas 
} from '../firebase/service';
import { Lote, Producto, Movimiento, DashboardStats, PiezaSerializada, Empresa } from '../types';

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  content: string;
  timestamp: string;
}

export interface PlantContextData {
  empresa?: Empresa | null;
  stats: DashboardStats;
  lotes: Lote[];
  productos: Producto[];
  ultimosMovimientos: (Movimiento & { productoNombre?: string })[];
  piezas?: PiezaSerializada[];
}

/**
 * Obtiene la fotografía actual del sistema de trazabilidad desde Firestore
 * para inyectar como contexto fáctico a Gemini.
 */
export async function recopilarContextoPlanta(empresa?: Empresa | null): Promise<PlantContextData | null> {
  try {
    const [stats, lotes, productos, ultimosMovimientos, piezas] = await Promise.all([
      obtenerEstadisticasDashboard(empresa?.id),
      obtenerLotes(empresa?.id),
      obtenerProductos(empresa?.id),
      obtenerUltimosMovimientos(15, empresa?.id),
      obtenerPiezas(undefined, empresa?.id),
    ]);

    return {
      empresa,
      stats,
      lotes,
      productos,
      ultimosMovimientos,
      piezas,
    };
  } catch (err) {
    console.warn('No se pudo recopilar el contexto en tiempo real de Firestore:', err);
    return null;
  }
}

/**
 * Envía la conversación al servidor Express para procesarla con el modelo gemini-3.8-flash.
 */
export async function enviarMensajeChat(
  historial: ChatMessage[],
  contexto?: PlantContextData | null
): Promise<string> {
  // Limitar el historial a los últimos 10 mensajes para mantener relevancia y agilidad
  const mensajesParaEnviar = historial.slice(-10).map((m) => ({
    role: m.role,
    content: m.content,
  }));

  const res = await fetch('/api/chat', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      messages: mensajesParaEnviar,
      context: contexto,
    }),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || `Error del servidor (${res.status})`);
  }

  const data = await res.json();
  return data.reply;
}

/**
 * Sugerencias de consultas industriales rápidas
 */
export const CONSULTAS_RAPIDAS = [
  {
    titulo: 'Estado de Lotes',
    prompt: '¿Cuál es el estado actual de los lotes y cuáles están en producción o pendientes?',
    icono: 'layers',
  },
  {
    titulo: 'Auditoría de Incidencias',
    prompt: '¿Qué lotes presentan incidencias o movimientos con estado Rechazado y qué acciones de contención recomiendas?',
    icono: 'alert',
  },
  {
    titulo: 'Resumen de Producción',
    prompt: 'Genera un resumen ejecutivo del estado general de la planta con los datos actuales.',
    icono: 'activity',
  },
  {
    titulo: 'Normativa ISO / Calidad',
    prompt: '¿Cuáles son los requisitos clave de trazabilidad bajo la norma ISO 9001:2015 en la etapa de Inspección y Empaque?',
    icono: 'shield',
  },
  {
    titulo: 'Ahorro de Tiempos y ROI',
    prompt: '¿Cuánto tiempo se mejora en localización de lotes, auditorías y tiempos de entrega con TRAZA-MX frente a métodos tradicionales?',
    icono: 'clock',
  },
  {
    titulo: 'Recorrido & Layout',
    prompt: '¿Por qué bahías y estaciones físicas se realiza el recorrido del material en la planta según el layout?',
    icono: 'route',
  },
];
