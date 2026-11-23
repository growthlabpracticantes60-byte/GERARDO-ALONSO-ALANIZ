import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const isProduction = process.env.NODE_ENV === 'production';
const PORT = parseInt(process.env.PORT || '3000', 10);

const app = express();
app.use(express.json({ limit: '10mb' }));

// Inicialización oficial de Gemini SDK del lado del servidor
const apiKey = process.env.GEMINI_API_KEY;
const ai = new GoogleGenAI({
  apiKey: apiKey,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

interface ChatMessage {
  role: 'user' | 'model';
  content: string;
}

// Endpoint del Chatbot de IA para Trazabilidad Industrial
app.post('/api/chat', async (req: Request, res: Response): Promise<void> => {
  try {
    const { messages, context } = req.body as {
      messages: ChatMessage[];
      context?: {
        empresa?: any;
        stats?: any;
        lotes?: any[];
        productos?: any[];
        ultimosMovimientos?: any[];
        loteActual?: string;
        piezas?: any[];
      };
    };

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      res.status(400).json({ error: 'La conversación debe contener mensajes válidos.' });
      return;
    }

    if (!apiKey) {
      res.status(500).json({
        error: 'GEMINI_API_KEY no está configurada en las variables de entorno del servidor.',
      });
      return;
    }

    // Construcción del contexto dinámico de planta
    let livePlantContext = '';
    if (context) {
      livePlantContext = `
=== ENTIDAD PRODUCTIVA / FILIAL ACTIVA ===
* Entidad: ${context.empresa ? `${context.empresa.nombre} (${context.empresa.siglas}) [ID: ${context.empresa.id}]` : 'Consorcio Multi-Tenant Global (Todas las Filiales)'}
* Sector: ${context.empresa?.sector || 'Manufactura Avanzada (Aeroespacial / Automotriz / Dispositivos Médicos)'}
* Planta & Ubicación: ${context.empresa ? `${context.empresa.planta}, ${context.empresa.ciudad}, ${context.empresa.estado}` : 'Múltiples Plantas Operativas'}
* Certificaciones de Calidad: ${context.empresa?.certificaciones?.join(', ') || 'ISO 9001:2015, IATF 16949, AS9100D, ISO 13485'}
* Tolerancia de Scrap: ${context.empresa?.toleranciaScrap ? `${context.empresa.toleranciaScrap}%` : '1.2%'}

=== DATOS EN TIEMPO REAL DE LA PLANTA (TRAZA-MX) ===
- Estadísticas Generales:
  * Total de Productos Registrados: ${context.stats?.totalProductos ?? 'N/D'}
  * Total de Lotes: ${context.stats?.totalLotes ?? 'N/D'}
  * Lotes En Producción / Proceso: ${context.stats?.enProduccion ?? 'N/D'}
  * Lotes Terminados: ${context.stats?.terminados ?? 'N/D'}
  * Incidencias / Rechazos: ${context.stats?.incidencias ?? 'N/D'}

- Catálogo de Productos Actual:
${(context.productos || [])
  .map(
    (p: any) => `  * [${p.codigo}] ${p.nombre} — Unidad: ${p.unidad || 'Piezas'} (${p.descripcion || ''})`
  )
  .join('\n') || '  (Sin productos)'}

- Lotes Activos e Históricos:
${(context.lotes || [])
  .map(
    (l: any) =>
      `  * Lote [${l.numeroLote}]: Producto: ${l.productoNombre || l.productoId}, Cantidad: ${l.cantidadInicial} ${l.unidad || 'Pzas'}, Línea: ${l.lineaProduccion || 'N/D'}, Estado: ${l.estado}`
  )
  .join('\n') || '  (Sin lotes)'}

- Últimos Movimientos y Controles de Calidad:
${(context.ultimosMovimientos || [])
  .slice(0, 10)
  .map(
    (m: any) =>
      `  * Lote [${m.loteId}] en Etapa '${m.etapa}' | Estado: '${m.estado}' | Cantidad: ${m.cantidadProcesada} | Operador: ${m.operador} | Fecha: ${m.fechaHora} | Obs: "${m.observaciones || 'Ninguna'}"`
  )
  .join('\n') || '  (Sin movimientos)'}

- Piezas Serializadas (Trazabilidad Unitaria Pieza por Pieza):
${(context.piezas || [])
  .slice(0, 20)
  .map(
    (p: any) =>
      `  * Pieza Serial [${p.numeroSerie}]: Lote: ${p.loteId}, Producto: ${p.productoNombre || p.productoId}, Etapa: ${p.etapaActual}, Estado: ${p.estado}, Estación: ${p.estacionActual || 'N/D'}${p.defectosReportados?.length ? ` | Defectos: [${p.defectosReportados.join(', ')}]` : ''}`
  )
  .join('\n') || '  (Sin piezas serializadas aún)'}
=====================================================
`;
    }

    const systemInstruction = `
Eres "TrazaBot", el copiloto de Inteligencia Artificial para el sistema de trazabilidad industrial "TRAZA-MX".
Tu especialidad es la ingeniería de manufactura, control de calidad, trazabilidad de lote y producto, trazabilidad unitaria pieza por pieza (serialización / DataMatrix), normativas industriales (ISO 9001:2015, IATF 16949, Buenas Prácticas de Manufactura) y optimización de líneas de ensamble.

Misión y capacidades:
1. Consultar y auditar el estatus de lotes de producción (ej. LOT-2026-0001) y piezas serializadas individuales (ej. SN-LOT-2026-0001-0001).
2. Diagnosticar piezas individuales con estado "Rechazada" o defectos registrados, aislando la unidad sin necesidad de detener todo el lote bueno si no es crítico.
3. Explicar el ciclo de vida por estación de una pieza serializada a lo largo de las 5 etapas (Recepción, Producción, Inspección, Empaque, Producto terminado).
4. Resolver dudas de los operadores sobre cómo capturar avances de lote o estación de pieza individual, serializar lotes masivamente y emitir códigos QR/DataMatrix unitarios.
5. Cuantificar y explicar las mejoras en tiempos operativos y retorno de inversión de la plataforma:
   - Localización de lotes y piezas: de 25-45 minutos (búsqueda en papel/piso) a 5-10 segundos con código QR y búsqueda directa (-95% de tiempo).
   - Auditorías y rastreo completo (Mock Recall): de 2 a 4 horas a menos de 1 minuto con el historial digital consolidado (-98% de tiempo).
   - Lead Time total de entrega: reducción del 15% al 25% al eliminar tiempos muertos y lotes varados sin avance.
   - Contención de no conformidades / rechazos: de 4-24 horas a aislamiento inmediato en minutos.
   - Ahorro de tiempo administrativo: ~1.5 a 2 horas diarias por supervisor en eliminación de transcripción manual de bitácoras.
6. Generar reportes ejecutivos de cambio de turno o resúmenes de producción.
7. Explicar el plano de planta (Layout) y el recorrido físico del material a través de las bahías:
   - Flujo secuencial estándar de TRAZA-MX:
     * 1. Bahía 01 (Recepción & Descarga MP, Báscula) ->
     * 2. Bahía 02 (Celda Maquinado CNC - Línea 01) o Bahía 03 (Celda Ensamble - Línea 02) ->
     * 3. Bahía 04 (Control de Calidad, Metrología CMM & Pruebas Hidrostáticas 200 PSI) ->
     * (En caso de rechazo: desvío inmediato a Bahía 05 Cuarentena & Scrap) ->
     * 4. Bahía 06 (Marcado Láser DataMatrix & Empaque Final en Tarima QR) -> Almacén de Embarque.
   - Analizar distancias recorridas en planta (en metros) y reducción de desperdicios de transporte logístico (Muda Lean).

Pautas de respuesta:
- Responde siempre en español con tono profesional, técnico pero accesible, riguroso y colaborativo.
- Utiliza formato Markdown con viñetas, negritas para códigos de lote y producto (ej. **LOT-2026-0001**, **PZA-001**), tablas cuando amerite comparativas o listas, e iconos útiles.
- IMPORTANTE: Si dispones de los "DATOS EN TIEMPO REAL DE LA PLANTA" proporcionados a continuación, básate estrictamente en ellos para responder sobre cantidades, estados actuales, operadores y productos específicos.
- Si el usuario te pregunta por un lote que no existe en la lista, indícaselo con claridad y sugiere verificar el código o consultar la lista de lotes activos.

${livePlantContext}
`;

    // Convertir historial a formato del SDK de Gemini
    // El último mensaje es el actual del usuario
    const formattedContents = messages.map((msg) => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.content }],
    }));

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: formattedContents,
      config: {
        systemInstruction,
        temperature: 0.3,
      },
    });

    const reply = response.text || 'No se pudo generar una respuesta en este momento.';

    res.json({ reply });
  } catch (error: any) {
    console.error('Error al procesar consulta con Gemini:', error);
    res.status(500).json({
      error: error?.message || 'Error interno al comunicarse con el asistente de IA.',
    });
  }
});

// Endpoint de estado del servidor
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    geminiConfigured: Boolean(apiKey),
    timestamp: new Date().toISOString(),
  });
});

// Configuración de Vite / Servidor estático
async function startServer() {
  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Servidor industrial TRAZA-MX ejecutándose en http://0.0.0.0:${PORT}`);
  });
}

startServer();
