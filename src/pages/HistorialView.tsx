import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Clock, 
  Layers, 
  User, 
  Calendar, 
  AlertCircle, 
  Boxes, 
  PlayCircle, 
  ShieldCheck, 
  PackageCheck, 
  CheckCircle2, 
  ArrowDown, 
  PlusCircle,
  FileCheck
} from 'lucide-react';
import { 
  MerkaticsHistorial, 
  MerkaticsQRScanner,
  MerkaticsEmpresa,
  MerkaticsMultiempresa
} from '../components/icons/MerkaticsIcons';
import { Lote, Movimiento } from '../types';
import { obtenerLotePorId, obtenerMovimientosPorLote, obtenerLotes } from '../firebase/service';
import { StatusBadge, EtapaBadge } from '../components/StatusBadge';
import { QRScannerModal } from '../components/QRScannerModal';
import { useEmpresa } from '../contexts/EmpresaContext';

interface HistorialViewProps {
  loteInicialId?: string;
  onCapturarAvance: (numeroLote: string) => void;
}

export const HistorialView: React.FC<HistorialViewProps> = ({
  loteInicialId,
  onCapturarAvance,
}) => {
  const { empresaActiva, esVistaGlobal, empresas } = useEmpresa();
  const [busqueda, setBusqueda] = useState(loteInicialId || 'LOT-2026-0001');
  const [loteActual, setLoteActual] = useState<Lote | null>(null);
  const [movimientos, setMovimientos] = useState<Movimiento[]>([]);
  const [cargando, setCargando] = useState(false);
  const [mensajeError, setMensajeError] = useState<string | null>(null);
  const [modalQRAbierto, setModalQRAbierto] = useState(false);
  const [listaLotesDisponibles, setListaLotesDisponibles] = useState<Lote[]>([]);

  const consultarHistorial = async (termino: string) => {
    const terminoLimpio = termino.trim().toUpperCase();
    if (!terminoLimpio) return;

    setCargando(true);
    setMensajeError(null);

    try {
      // 1. Intentar buscar por número de lote directo
      let lote = await obtenerLotePorId(terminoLimpio);

      // 2. Si no se encontró por número de lote, verificar si coincide con código de producto
      if (!lote) {
        const todosLosLotes = await obtenerLotes(empresaActiva?.id);
        const coincidenciaPorProd = todosLosLotes.find(
          (l) => l.productoId.toUpperCase() === terminoLimpio
        );
        if (coincidenciaPorProd) {
          lote = coincidenciaPorProd;
        }
      }

      if (!lote) {
        setLoteActual(null);
        setMovimientos([]);
        setMensajeError(
          `No se encontró información para el lote o producto "${terminoLimpio}". Pruebe con los lotes disponibles mostrados abajo.`
        );
        return;
      }

      setLoteActual(lote);
      const movs = await obtenerMovimientosPorLote(lote.numeroLote);
      setMovimientos(movs);
    } catch (err) {
      console.error('Error consultando historial:', err);
      setMensajeError('Error al consultar Firestore.');
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    // Cargar lista de lotes para selector rápido según la empresa activa
    obtenerLotes(empresaActiva?.id).then((data) => {
      setListaLotesDisponibles(data);
      if (data.length > 0) {
        // Si el lote actual no está en la nueva empresa, cambiar al primero
        const existe = data.find((d) => d.numeroLote === busqueda);
        const objetivo = existe ? busqueda : data[0].numeroLote;
        setBusqueda(objetivo);
        consultarHistorial(objetivo);
      }
    });
  }, [empresaActiva, loteInicialId]);

  const handleBuscar = (e: React.FormEvent) => {
    e.preventDefault();
    consultarHistorial(busqueda);
  };

  const getEtapaIcon = (etapa: string) => {
    const et = etapa.toLowerCase();
    if (et.includes('recep')) return <Boxes className="w-5 h-5 text-sky-600" />;
    if (et.includes('prod')) return <PlayCircle className="w-5 h-5 text-indigo-600" />;
    if (et.includes('inspec')) return <ShieldCheck className="w-5 h-5 text-amber-600" />;
    if (et.includes('empaq')) return <PackageCheck className="w-5 h-5 text-emerald-600" />;
    return <CheckCircle2 className="w-5 h-5 text-teal-600" />;
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-200">
      {/* Buscador de Trazabilidad */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4 mb-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <MerkaticsHistorial size={22} />
              HISTORIAL DE TRAZABILIDAD
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Auditoría cronológica de producción por lote o código de producto.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setModalQRAbierto(true)}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold shadow-xs flex items-center justify-center gap-2"
          >
            <MerkaticsQRScanner size={18} />
            <span>ESCANEAR QR</span>
          </button>
        </div>

        <form onSubmit={handleBuscar} className="flex gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              required
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value.toUpperCase())}
              placeholder="Buscar número de lote (Ej. LOT-2026-0001)..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-mono font-bold tracking-wider uppercase focus:ring-2 focus:ring-blue-500 focus:bg-white focus:outline-none"
            />
          </div>
          <button
            type="submit"
            disabled={cargando}
            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold shadow-xs disabled:bg-slate-300 transition-colors"
          >
            {cargando ? 'Consultando...' : 'BUSCAR'}
          </button>
        </form>

        {/* Chips de acceso rápido */}
        <div className="flex flex-wrap items-center gap-2 mt-3 text-xs text-slate-500">
          <span className="font-semibold text-slate-600">Lotes registrados:</span>
          {listaLotesDisponibles.map((l) => (
            <button
              key={l.numeroLote}
              type="button"
              onClick={() => {
                setBusqueda(l.numeroLote);
                consultarHistorial(l.numeroLote);
              }}
              className={`font-mono text-xs px-2.5 py-1 rounded-lg border transition-all ${
                loteActual?.numeroLote === l.numeroLote
                  ? 'bg-blue-600 text-white border-blue-600 font-bold shadow-xs'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'
              }`}
            >
              {l.numeroLote}
            </button>
          ))}
        </div>
      </div>

      {/* Error */}
      {mensajeError && (
        <div className="p-4 rounded-xl text-sm font-medium bg-rose-50 border border-rose-200 text-rose-800 flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
          <span>{mensajeError}</span>
        </div>
      )}

      {/* Contenido del Historial */}
      {loteActual && (
        <div className="space-y-6">
          {/* Tarjeta: INFORMACIÓN DEL LOTE */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="bg-slate-900 text-white px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest block">
                  INFORMACIÓN DEL LOTE
                </span>
                <h3 className="text-xl font-black font-mono tracking-wider text-blue-400">
                  {loteActual.numeroLote}
                </h3>
              </div>

              <div className="flex items-center gap-3 self-end sm:self-auto">
                <div className="text-right">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest block">
                    Estado Actual
                  </span>
                  <StatusBadge status={loteActual.estado} size="md" />
                </div>
                <button
                  type="button"
                  onClick={() => onCapturarAvance(loteActual.numeroLote)}
                  className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold shadow-xs flex items-center gap-1.5 transition-all"
                >
                  <PlusCircle className="w-4 h-4" />
                  + Registrar Avance
                </button>
              </div>
            </div>

            <div className="p-6 bg-slate-50/70 border-b border-slate-200 grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
                  Producto
                </span>
                <span className="font-bold text-slate-900 block mt-0.5">
                  {loteActual.productoNombre || loteActual.productoId}
                </span>
                <span className="text-xs font-mono text-slate-500">{loteActual.productoId}</span>
              </div>

              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
                  Cantidad Inicial
                </span>
                <span className="font-bold text-slate-900 block mt-0.5 font-mono text-base">
                  {loteActual.cantidadInicial} {loteActual.unidad}
                </span>
              </div>

              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
                  Línea de Producción
                </span>
                <span className="inline-block mt-0.5 px-2.5 py-0.5 rounded-md bg-white border border-slate-200 font-mono font-bold text-slate-800 text-xs">
                  {loteActual.lineaProduccion}
                </span>
              </div>

              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
                  Fecha de Fabricación
                </span>
                <span className="font-medium text-slate-700 block mt-0.5 text-xs font-mono">
                  {loteActual.fechaProduccion}
                </span>
              </div>
            </div>
          </div>

          {/* HISTORIAL DEL PROCESO - Línea de Tiempo Vertical */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-8 border-b border-slate-100 pb-4">
              <div>
                <h3 className="font-black text-slate-900 text-base uppercase tracking-wider flex items-center gap-2">
                  <FileCheck className="w-5 h-5 text-blue-600" />
                  HISTORIAL DEL PROCESO (LÍNEA DE TIEMPO)
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Auditoría paso a paso del lote desde Recepción hasta Producto terminado
                </p>
              </div>

              <span className="text-xs font-bold text-slate-600 bg-slate-100 px-3 py-1 rounded-full border border-slate-200 self-start sm:self-auto">
                {movimientos.length} etapas registradas
              </span>
            </div>

            {movimientos.length === 0 ? (
              <div className="text-center py-12 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                <Clock className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                <p className="text-slate-600 text-sm font-semibold">
                  No hay movimientos registrados para este lote.
                </p>
                <p className="text-slate-400 text-xs mt-1">
                  Use el módulo de "Capturar avance" para registrar la primera etapa.
                </p>
                <button
                  onClick={() => onCapturarAvance(loteActual.numeroLote)}
                  className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-xs inline-flex items-center gap-1.5"
                >
                  <PlusCircle className="w-4 h-4" />
                  Registrar Primer Avance
                </button>
              </div>
            ) : (
              <div className="relative pl-6 sm:pl-10 space-y-8">
                {/* Línea vertical conectora continua */}
                <div className="absolute left-[15px] sm:left-[23px] top-3 bottom-6 w-0.5 bg-slate-200" />

                {movimientos.map((mov, idx) => {
                  const esUltimo = idx === movimientos.length - 1;

                  return (
                    <div key={mov.id || idx} className="relative group">
                      {/* Nodo o Punto indicador en la línea de tiempo */}
                      <div className="absolute -left-[30px] sm:-left-[46px] top-1 w-8 h-8 rounded-full border-4 border-white bg-slate-900 text-white flex items-center justify-center shadow-md z-10">
                        <span className="text-[11px] font-mono font-bold">
                          {idx + 1}
                        </span>
                      </div>

                      {/* Tarjeta del Movimiento */}
                      <div className="bg-slate-50/80 hover:bg-white border border-slate-200 hover:border-blue-300 rounded-2xl p-5 shadow-xs hover:shadow-md transition-all">
                        {/* Cabecera del Movimiento: Fecha/Hora y Etapa */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200/80 pb-3 mb-3">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-xl bg-white border border-slate-200 flex items-center justify-center shadow-xs">
                              {getEtapaIcon(mov.etapa)}
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <h4 className="font-black text-slate-900 text-base uppercase tracking-wide">
                                  {mov.etapa}
                                </h4>
                                <StatusBadge status={mov.estado} size="sm" />
                              </div>
                              <span className="text-[11px] text-slate-500 font-medium">
                                Etapa de trazabilidad #{idx + 1}
                              </span>
                            </div>
                          </div>

                          {/* Marca de tiempo */}
                          <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-slate-600 bg-white px-3 py-1.5 rounded-lg border border-slate-200 self-start sm:self-auto shadow-xs">
                            <Calendar className="w-3.5 h-3.5 text-slate-400" />
                            <span>{mov.fechaHora}</span>
                          </div>
                        </div>

                        {/* Datos técnicos */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                          <div className="p-2.5 bg-white rounded-xl border border-slate-200/70">
                            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                              Cantidad procesada
                            </span>
                            <span className="font-mono font-bold text-slate-900 text-base">
                              {mov.cantidadProcesada}{' '}
                              <span className="text-xs font-medium text-slate-600 font-sans">
                                {loteActual.unidad}
                              </span>
                            </span>
                          </div>

                          <div className="p-2.5 bg-white rounded-xl border border-slate-200/70">
                            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                              Operador responsable
                            </span>
                            <span className="font-bold text-slate-800 flex items-center gap-1.5 mt-0.5">
                              <User className="w-4 h-4 text-slate-400" />
                              {mov.operador}
                            </span>
                          </div>
                        </div>

                        {/* Observaciones */}
                        {mov.observaciones && (
                          <div className="mt-3 bg-white p-3 rounded-xl border border-slate-200/80 text-xs">
                            <span className="font-bold text-slate-700 block mb-0.5">
                              Observaciones de Control:
                            </span>
                            <p className="text-slate-600 leading-relaxed">
                              {mov.observaciones}
                            </p>
                          </div>
                        )}
                      </div>

                      {/* Flecha visual hacia el siguiente paso si no es el último */}
                      {!esUltimo && (
                        <div className="flex justify-center my-1 text-slate-300">
                          <ArrowDown className="w-4 h-4 text-slate-300" />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Modal QR */}
      <QRScannerModal
        isOpen={modalQRAbierto}
        onClose={() => setModalQRAbierto(false)}
        onSelectLote={(codigo) => {
          setBusqueda(codigo);
          consultarHistorial(codigo);
        }}
        initialCode={busqueda}
      />
    </div>
  );
};
