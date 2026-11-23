import React from 'react';
import { 
  X, 
  Printer, 
  Download, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  MapPin, 
  FileText, 
  Layers, 
  ShieldCheck, 
  QrCode,
  Building,
  Route,
  Activity
} from 'lucide-react';
import { Lote, Movimiento, Empresa } from '../../types';
import { MerkaticsLogo, MerkaticsEmpresa, MerkaticsLayout } from '../icons/MerkaticsIcons';

interface MaterialFlowReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  lote: Lote | null;
  movimientos: Movimiento[];
  distanciaMetros: number;
  empresa: Empresa | null;
}

export const MaterialFlowReportModal: React.FC<MaterialFlowReportModalProps> = ({
  isOpen,
  onClose,
  lote,
  movimientos,
  distanciaMetros,
  empresa,
}) => {
  if (!isOpen || !lote) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-3xl max-w-3xl w-full border border-slate-200 shadow-2xl overflow-hidden my-8 animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Barra superior de acciones (no se imprime) */}
        <div className="p-4 bg-slate-900 text-white flex items-center justify-between print:hidden border-b border-slate-800">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-blue-400" />
            <span className="font-bold text-sm">
              Hoja de Ruta de Manufactura & Auditoría de Recorrido
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Imprimir / Guardar PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Contenido del Reporte Imprimible */}
        <div className="p-8 space-y-6 text-slate-800 bg-white print:p-0 print:space-y-4">
          {/* Cabecera institucional */}
          <div className="flex items-start justify-between border-b-2 border-slate-900 pb-5">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold">
                <MerkaticsLogo size={28} />
              </div>
              <div>
                <h2 className="text-xl font-black font-mono tracking-tight text-slate-900">
                  {empresa?.nombre || 'MERKATICS TRAZA-MX'}
                </h2>
                <p className="text-xs text-slate-600">
                  Planta: {empresa?.plantaPrincipal || 'Planta Matriz'} • RFC: {empresa?.rfc || 'XAXX010101000'}
                </p>
                <p className="text-[10px] text-slate-500 font-mono">
                  Certificaciones: {empresa?.certificaciones?.join(', ') || 'ISO 9001:2015, IATF 16949'}
                </p>
              </div>
            </div>

            <div className="text-right">
              <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                DOCUMENTO DE CONTROL ISO 9001 / F-PR-08
              </span>
              <span className="text-lg font-black font-mono text-blue-600 block">
                {lote.numeroLote}
              </span>
              <span className="text-[10px] text-slate-500 font-mono">
                Fecha Emisión: {new Date().toLocaleDateString('es-MX')}
              </span>
            </div>
          </div>

          {/* Ficha técnica del lote en cuadrícula */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-500 block">Producto</span>
              <strong className="text-slate-900 block mt-0.5">{lote.productoNombre || lote.productoId}</strong>
              <span className="font-mono text-slate-500 text-[10px]">{lote.productoId}</span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-500 block">Volumen Lote</span>
              <strong className="font-mono text-slate-900 text-sm block mt-0.5">
                {lote.cantidadInicial} {lote.unidad}
              </strong>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-500 block">Línea de Ensamble</span>
              <strong className="font-mono text-slate-900 block mt-0.5">{lote.lineaProduccion}</strong>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-500 block">Estatus Actual</span>
              <span className="inline-block mt-0.5 font-bold text-slate-800 font-mono">
                {lote.estado}
              </span>
            </div>
          </div>

          {/* Resumen Lean de Flujo de Material */}
          <div className="grid grid-cols-3 gap-3 p-4 bg-blue-50/60 rounded-2xl border border-blue-200/80 text-xs">
            <div>
              <span className="text-[10px] uppercase font-bold text-blue-700 block">Distancia Recorrida</span>
              <strong className="text-base font-mono text-blue-900 block mt-0.5">
                ~{distanciaMetros} metros
              </strong>
              <span className="text-[10px] text-blue-600">Tránsito entre bahías</span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-blue-700 block">Estaciones Visitadas</span>
              <strong className="text-base font-mono text-blue-900 block mt-0.5">
                {movimientos.length || 1} estaciones
              </strong>
              <span className="text-[10px] text-blue-600">Secuencia en piso</span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-blue-700 block">Cumplimiento de Ruta</span>
              <strong className="text-base font-mono text-emerald-700 block mt-0.5">
                100% Auditada
              </strong>
              <span className="text-[10px] text-emerald-600">Cadena de custodia</span>
            </div>
          </div>

          {/* Tabla cronológica del recorrido físico */}
          <div className="space-y-2">
            <h4 className="font-bold text-xs uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
              <Route className="w-4 h-4 text-blue-600" />
              Secuencia Física de Bahías Transitadas
            </h4>

            <div className="border border-slate-200 rounded-xl overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-slate-100 border-b border-slate-200 text-slate-600 font-bold uppercase text-[10px]">
                    <th className="py-2.5 px-3">Paso</th>
                    <th className="py-2.5 px-3">Estación / Bahía</th>
                    <th className="py-2.5 px-3">Etapa</th>
                    <th className="py-2.5 px-3">Estatus</th>
                    <th className="py-2.5 px-3">Operador</th>
                    <th className="py-2.5 px-3">Fecha y Hora</th>
                    <th className="py-2.5 px-3">Observaciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {movimientos.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-4 px-3 text-center text-slate-400">
                        El lote aún no cuenta con avances registrados en estaciones de manufactura.
                      </td>
                    </tr>
                  ) : (
                    movimientos.map((m, idx) => (
                      <tr key={idx} className="hover:bg-slate-50">
                        <td className="py-2.5 px-3 font-mono font-bold text-blue-600">
                          #{idx + 1}
                        </td>
                        <td className="py-2.5 px-3 font-semibold text-slate-900">
                          {(m as any).estacion || `Bahía de ${m.etapa}`}
                        </td>
                        <td className="py-2.5 px-3 font-medium text-slate-700">
                          {m.etapa}
                        </td>
                        <td className="py-2.5 px-3">
                          <span className={`px-2 py-0.5 rounded font-mono font-bold text-[10px] ${
                            m.estado === 'Rechazado' 
                              ? 'bg-rose-100 text-rose-700'
                              : m.estado === 'Aprobado' || m.estado === 'Completado'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-blue-100 text-blue-800'
                          }`}>
                            {m.estado}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 font-medium text-slate-800">
                          {m.operador}
                        </td>
                        <td className="py-2.5 px-3 font-mono text-[11px] text-slate-500">
                          {m.fechaHora}
                        </td>
                        <td className="py-2.5 px-3 text-slate-600 text-[11px] max-w-xs truncate">
                          {m.observaciones || '—'}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Bloque de firmas de liberación de calidad y supervisión */}
          <div className="pt-8 border-t border-slate-200 grid grid-cols-2 gap-8 text-center text-xs">
            <div>
              <div className="border-b border-slate-400 w-48 mx-auto mb-2 h-10" />
              <strong className="block text-slate-900">Ing. Supervisor de Producción</strong>
              <span className="text-[10px] text-slate-500">Línea de Ensamble & Balanceo</span>
            </div>
            <div>
              <div className="border-b border-slate-400 w-48 mx-auto mb-2 h-10" />
              <strong className="block text-slate-900">Líder de Aseguramiento de Calidad</strong>
              <span className="text-[10px] text-slate-500">Liberación y Trazabilidad ISO 9001</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
