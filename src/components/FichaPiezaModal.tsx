import React, { useState, useEffect } from 'react';
import { 
  X, 
  QrCode, 
  Printer, 
  Copy, 
  Check, 
  Layers, 
  Package, 
  Clock, 
  User, 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  Bot, 
  Calendar,
  FileCheck,
  Cpu
} from 'lucide-react';
import { PiezaSerializada, MovimientoPieza } from '../types';
import { obtenerMovimientosPorPieza } from '../firebase/service';
import { StatusBadge, EtapaBadge } from './StatusBadge';

interface FichaPiezaModalProps {
  isOpen: boolean;
  onClose: () => void;
  pieza: PiezaSerializada | null;
  onRegistrarAvance: (pieza: PiezaSerializada) => void;
  onConsultarIA?: (pregunta: string) => void;
}

export const FichaPiezaModal: React.FC<FichaPiezaModalProps> = ({
  isOpen,
  onClose,
  pieza,
  onRegistrarAvance,
  onConsultarIA,
}) => {
  const [movimientos, setMovimientos] = useState<MovimientoPieza[]>([]);
  const [cargando, setCargando] = useState(true);
  const [copiado, setCopiado] = useState(false);

  useEffect(() => {
    if (isOpen && pieza) {
      setCargando(true);
      obtenerMovimientosPorPieza(pieza.numeroSerie)
        .then((data) => setMovimientos(data))
        .finally(() => setCargando(false));
    }
  }, [isOpen, pieza]);

  if (!isOpen || !pieza) return null;

  const handleCopiarSerial = () => {
    navigator.clipboard.writeText(pieza.numeroSerie);
    setCopiado(true);
    setTimeout(() => setCopiado(false), 2000);
  };

  const handleImprimir = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-150">
      <div 
        className="bg-white rounded-3xl max-w-2xl w-full max-h-[92vh] overflow-y-auto border border-slate-200 shadow-2xl flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Cabecera */}
        <div className="p-6 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white flex items-center justify-between border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-600/30">
              <Cpu className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-black tracking-tight text-white font-mono">
                  {pieza.numeroSerie}
                </h3>
                <StatusBadge status={pieza.estado} size="sm" />
              </div>
              <p className="text-xs text-slate-300">
                Pasaporte Digital de Pieza • Trazabilidad Unitaria
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleImprimir}
              className="p-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
              title="Imprimir etiqueta industrial"
            >
              <Printer className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tarjeta de Etiqueta Industrial Imprimible */}
        <div className="p-6 bg-slate-50 border-b border-slate-200">
          <div className="bg-white border-2 border-dashed border-slate-300 rounded-2xl p-5 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-6 print:border-solid print:border-black">
            <div className="flex-1 space-y-2 text-center sm:text-left">
              <div className="flex items-center gap-2 justify-center sm:justify-start">
                <span className="text-[10px] font-bold uppercase tracking-wider bg-slate-900 text-white px-2 py-0.5 rounded font-mono">
                  ETIQUETA SERIALIZADA
                </span>
                <span className="text-xs font-bold text-slate-500">TRAZA-MX</span>
              </div>

              <div className="flex items-center gap-2 justify-center sm:justify-start">
                <span className="text-lg font-black font-mono tracking-wider text-slate-900">
                  {pieza.numeroSerie}
                </span>
                <button
                  onClick={handleCopiarSerial}
                  className="text-slate-400 hover:text-slate-700 p-1"
                  title="Copiar número de serie"
                >
                  {copiado ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 pt-1">
                <div>
                  <span className="text-[10px] text-slate-400 font-bold block uppercase">Lote:</span>
                  <span className="font-mono font-bold text-slate-800">{pieza.loteId}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-bold block uppercase">Producto:</span>
                  <span className="font-semibold text-slate-800 truncate block">
                    {pieza.productoNombre || pieza.productoId}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-bold block uppercase">Etapa Actual:</span>
                  <span className="font-medium text-slate-800">{pieza.etapaActual}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-bold block uppercase">Estación:</span>
                  <span className="font-medium text-slate-800 truncate block">{pieza.estacionActual || 'N/D'}</span>
                </div>
              </div>
            </div>

            {/* Código QR / DataMatrix visual estilizado */}
            <div className="shrink-0 flex flex-col items-center bg-slate-900 text-white p-3.5 rounded-xl shadow-md">
              <QrCode className="w-24 h-24 text-white" />
              <span className="text-[9px] font-mono tracking-widest text-slate-400 mt-1 uppercase">
                DataMatrix 2D
              </span>
            </div>
          </div>
        </div>

        {/* Defectos / No conformidades si los hay */}
        {pieza.defectosReportados && pieza.defectosReportados.length > 0 && (
          <div className="mx-6 mt-4 p-3.5 bg-rose-50 border border-rose-200 rounded-2xl flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <div>
              <h5 className="text-xs font-bold text-rose-900 uppercase tracking-wider">
                No Conformidad / Defectos Identificados en Pieza
              </h5>
              <ul className="text-xs text-rose-700 list-disc list-inside mt-1 space-y-0.5">
                {pieza.defectosReportados.map((d, i) => (
                  <li key={i}>{d}</li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* Línea de tiempo de estaciones y controles de calidad */}
        <div className="p-6 flex-1 space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
              <Clock className="w-4 h-4 text-blue-600" />
              Historial Cronológico de Estaciones & Pruebas
            </h4>
            <span className="text-xs text-slate-400 font-mono">
              {movimientos.length} checkpoint{movimientos.length === 1 ? '' : 's'}
            </span>
          </div>

          {cargando ? (
            <div className="py-8 text-center text-xs text-slate-400">
              Cargando historial de la pieza...
            </div>
          ) : movimientos.length === 0 ? (
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl text-center text-xs text-slate-500">
              Esta pieza está recién serializada en la etapa de <strong>{pieza.etapaActual}</strong>. Aún no se han registrado checkpoints adicionales.
            </div>
          ) : (
            <div className="relative pl-6 space-y-4 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
              {movimientos.map((mov, idx) => (
                <div key={idx} className="relative">
                  {/* Punto en la línea de tiempo */}
                  <div
                    className={`absolute -left-[1.85rem] top-1 w-3.5 h-3.5 rounded-full border-2 border-white shadow-xs ${
                      mov.estado === 'Rechazado'
                        ? 'bg-rose-600'
                        : mov.estado === 'Aprobado' || mov.estado === 'Completado'
                        ? 'bg-emerald-600'
                        : 'bg-blue-600'
                    }`}
                  />

                  <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-2">
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <div className="flex items-center gap-2">
                        <EtapaBadge etapa={mov.etapa} />
                        <StatusBadge status={mov.estado} size="sm" />
                      </div>
                      <span className="text-[11px] font-mono text-slate-400">
                        {mov.fechaHora}
                      </span>
                    </div>

                    <div className="text-xs text-slate-700">
                      <span className="font-semibold text-slate-900">Estación: </span>
                      <span>{mov.estacion}</span>
                      <span className="text-slate-400 mx-1.5">•</span>
                      <span className="font-semibold text-slate-900">Operador: </span>
                      <span>{mov.operador}</span>
                    </div>

                    {mov.observaciones && (
                      <p className="text-xs text-slate-600 italic bg-slate-50 p-2 rounded-lg border border-slate-100">
                        "{mov.observaciones}"
                      </p>
                    )}

                    {/* Parámetros de inspección si existen */}
                    {mov.parametros && mov.parametros.length > 0 && (
                      <div className="pt-1">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                          Pruebas Realizadas:
                        </span>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                          {mov.parametros.map((param, pI) => (
                            <div
                              key={pI}
                              className={`p-1.5 rounded-lg text-[11px] flex items-center justify-between border ${
                                param.cumple
                                  ? 'bg-emerald-50/70 text-emerald-800 border-emerald-200'
                                  : 'bg-rose-50/70 text-rose-800 border-rose-200'
                              }`}
                            >
                              <span className="font-medium">{param.nombre}</span>
                              <span className="font-mono font-bold">
                                {param.valor} {param.cumple ? '✓' : '✗'}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Pie con acciones */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            {onConsultarIA && (
              <button
                onClick={() => {
                  onClose();
                  onConsultarIA(`¿Cuál es el diagnóstico de trazabilidad y calidad de la pieza individual ${pieza.numeroSerie}?`);
                }}
                className="inline-flex items-center gap-1.5 px-3 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 rounded-xl text-xs font-semibold transition-colors cursor-pointer w-full sm:w-auto justify-center"
              >
                <Bot className="w-4 h-4 text-indigo-600" />
                <span>Analizar con IA</span>
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              onClick={() => {
                onClose();
                onRegistrarAvance(pieza);
              }}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors cursor-pointer w-full sm:w-auto"
            >
              Registrar Avance / Inspección
            </button>
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
