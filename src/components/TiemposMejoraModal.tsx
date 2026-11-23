import React from 'react';
import { 
  X, 
  Clock, 
  TrendingUp, 
  Zap, 
  CheckCircle2, 
  ShieldCheck, 
  Search, 
  Truck, 
  FileSpreadsheet, 
  AlertTriangle,
  ArrowRight
} from 'lucide-react';

interface TiemposMejoraModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConsultarIA?: (pregunta: string) => void;
}

export const TiemposMejoraModal: React.FC<TiemposMejoraModalProps> = ({
  isOpen,
  onClose,
  onConsultarIA,
}) => {
  if (!isOpen) return null;

  const metricas = [
    {
      titulo: 'Localización de Lote en Planta',
      icono: <Search className="w-5 h-5 text-blue-600" />,
      antes: '25 – 45 min',
      despues: '5 – 10 seg',
      mejora: '98% más rápido',
      detalle: 'Escaneo inmediato de código QR o búsqueda por IA en lugar de recorrer físicamente el piso de producción o revisar carpetas.',
      color: 'blue',
    },
    {
      titulo: 'Auditoría Completa / Mock Recall',
      icono: <ShieldCheck className="w-5 h-5 text-indigo-600" />,
      antes: '2 – 4 horas',
      despues: '< 1 minuto',
      mejora: '99% reducción',
      detalle: 'Consolidación cronológica de las 5 etapas (Recepción, Producción, Inspección, Empaque, Producto terminado) con operarios y horas en 1 clic.',
      color: 'indigo',
    },
    {
      titulo: 'Lead Time y Tiempo de Entrega',
      icono: <Truck className="w-5 h-5 text-emerald-600" />,
      antes: 'Variable (+30% holgura)',
      despues: '-15% a -25%',
      mejora: '20% reducción',
      detalle: 'Eliminación de tiempos muertos y lotes estancados en espera de firma o inspección. Liberación para embarque el mismo día.',
      color: 'emerald',
    },
    {
      titulo: 'Contención de Rechazos / No Conformes',
      icono: <AlertTriangle className="w-5 h-5 text-rose-600" />,
      antes: '4 – 24 horas',
      despues: 'Inmediato (< 2 min)',
      mejora: 'Detección en tiempo real',
      detalle: 'Al marcar un lote como "Rechazado", el sistema bloquea su avance instantáneamente, previniendo mezclas y reprocesos masivos.',
      color: 'rose',
    },
    {
      titulo: 'Captura y Registro Administrativo',
      icono: <FileSpreadsheet className="w-5 h-5 text-amber-600" />,
      antes: '1.5 – 2 hrs/día',
      despues: '0 hrs (en línea)',
      mejora: '~10 hrs/sem ahorradas',
      detalle: 'Eliminación total del llenado de bitácoras físicas en papel y doble captura en hojas de cálculo por parte de supervisores.',
      color: 'amber',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-150">
      <div 
        className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto border border-slate-200 shadow-2xl flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Cabecera */}
        <div className="p-6 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white flex items-center justify-between border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-600/30">
              <Zap className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-black tracking-tight text-white">
                  Impacto Operativo & Reducción de Tiempos
                </h3>
                <span className="text-xs bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full font-bold">
                  ROI Industrial
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                Comparativa de tiempos de ciclo: Métodos tradicionales vs. TRAZA-MX
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Resumen Superior */}
        <div className="p-6 bg-blue-50/60 border-b border-blue-100/80">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
            <div className="bg-white p-4 rounded-2xl border border-blue-200/60 shadow-2xs">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
                Localización de Lotes
              </span>
              <span className="text-2xl font-black text-blue-700 font-mono">
                -98%
              </span>
              <span className="text-xs text-slate-600 block mt-0.5 font-medium">
                De 35 min a 5 seg
              </span>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-blue-200/60 shadow-2xs">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
                Respuesta a Auditorías
              </span>
              <span className="text-2xl font-black text-indigo-700 font-mono">
                -99%
              </span>
              <span className="text-xs text-slate-600 block mt-0.5 font-medium">
                De horas a 1 minuto
              </span>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-blue-200/60 shadow-2xs">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
                Lead Time de Fabricación
              </span>
              <span className="text-2xl font-black text-emerald-700 font-mono">
                -20%
              </span>
              <span className="text-xs text-slate-600 block mt-0.5 font-medium">
                Eliminación de estancamiento
              </span>
            </div>
          </div>
        </div>

        {/* Lista detallada de métricas */}
        <div className="p-6 space-y-4">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Desglose por Proceso Operativo
          </h4>

          <div className="space-y-3">
            {metricas.map((m, idx) => (
              <div 
                key={idx}
                className="p-4 rounded-2xl border border-slate-200 hover:border-blue-300 bg-white transition-all shadow-2xs"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-2">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-slate-100 shrink-0">
                      {m.icono}
                    </div>
                    <div>
                      <h5 className="font-bold text-sm text-slate-900">{m.titulo}</h5>
                      <p className="text-xs text-slate-500 mt-0.5">{m.detalle}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                    <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200">
                      {m.mejora}
                    </span>
                  </div>
                </div>

                {/* Comparación visual Antes vs. Después */}
                <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-slate-100 text-xs">
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">
                      Método Tradicional (Papel / Excel)
                    </span>
                    <span className="font-mono font-bold text-slate-700 mt-0.5 block">
                      {m.antes}
                    </span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-blue-50/70 border border-blue-200/80">
                    <span className="text-[10px] uppercase font-bold text-blue-600 block">
                      Con TRAZA-MX + Copiloto IA
                    </span>
                    <span className="font-mono font-bold text-blue-800 mt-0.5 block">
                      {m.despues}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pie con llamada a acción hacia el Chatbot */}
        <div className="p-5 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <p className="text-xs text-slate-600 text-center sm:text-left">
            ¿Deseas una estimación de ahorro personalizada para tu volumen de producción?
          </p>

          <div className="flex items-center gap-2">
            {onConsultarIA && (
              <button
                onClick={() => {
                  onClose();
                  onConsultarIA('¿Cómo impacta TRAZA-MX en los tiempos de entrega y localización de lotes en mi planta?');
                }}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <span>Consultar con Copiloto IA</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
            <button
              onClick={onClose}
              className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
