import React, { useState, useEffect } from 'react';
import { 
  Search, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  User, 
  FileText, 
  Factory, 
  Layers, 
  Boxes, 
  ArrowRight,
  History
} from 'lucide-react';
import { 
  MerkaticsCapturar, 
  MerkaticsQRScanner,
  MerkaticsEmpresa,
  MerkaticsMultiempresa
} from '../components/icons/MerkaticsIcons';
import { Lote, Movimiento, EtapaProceso, EstadoMovimiento } from '../types';
import { 
  obtenerLotePorId, 
  registrarAvance, 
  obtenerMovimientosPorLote,
  formatearFechaHoraActual,
  obtenerLotes
} from '../firebase/service';
import { StatusBadge, EtapaBadge } from '../components/StatusBadge';
import { QRScannerModal } from '../components/QRScannerModal';
import { useEmpresa } from '../contexts/EmpresaContext';

interface CapturarAvanceViewProps {
  loteInicialId?: string;
  onVerHistorial: (numeroLote: string) => void;
}

export const CapturarAvanceView: React.FC<CapturarAvanceViewProps> = ({
  loteInicialId,
  onVerHistorial,
}) => {
  const { empresaActiva, esVistaGlobal, empresas } = useEmpresa();
  const [modalQRAbierto, setModalQRAbierto] = useState(false);
  const [inputBusqueda, setInputBusqueda] = useState(loteInicialId || 'LOT-2026-0001');
  const [loteActivo, setLoteActivo] = useState<Lote | null>(null);
  const [movimientosLote, setMovimientosLote] = useState<Movimiento[]>([]);
  const [buscando, setBuscando] = useState(false);

  // Formulario de Captura de Avance
  const [etapa, setEtapa] = useState<EtapaProceso>('Producción');
  const [estadoMovimiento, setEstadoMovimiento] = useState<EstadoMovimiento>('En proceso');
  const [cantidadProcesada, setCantidadProcesada] = useState<string>('500');
  const [operador, setOperador] = useState<string>('Juan');
  const [observaciones, setObservaciones] = useState<string>('');
  const [fechaHoraAuto, setFechaHoraAuto] = useState<string>(formatearFechaHoraActual());

  // Notificaciones y estado
  const [mensaje, setMensaje] = useState<{ tipo: 'exito' | 'error'; texto: string } | null>(null);
  const [guardando, setGuardando] = useState(false);

  // Buscar lote en Firestore
  const buscarLote = async (numeroLote: string) => {
    const loteLimpio = numeroLote.trim().toUpperCase();
    if (!loteLimpio) return;

    setBuscando(true);
    setMensaje(null);

    try {
      const lote = await obtenerLotePorId(loteLimpio);
      if (!lote) {
        setLoteActivo(null);
        setMovimientosLote([]);
        setMensaje({
          tipo: 'error',
          texto: `No se localizó el lote ${loteLimpio} en Firestore. Verifique el identificador o regístrelo en el módulo de Lotes.`,
        });
        return;
      }

      setLoteActivo(lote);
      setCantidadProcesada(String(lote.cantidadInicial));
      setFechaHoraAuto(formatearFechaHoraActual());

      // Cargar historial inmediato del lote
      const movs = await obtenerMovimientosPorLote(loteLimpio);
      setMovimientosLote(movs);
    } catch (err) {
      console.error('Error buscando lote:', err);
      setMensaje({ tipo: 'error', texto: 'Error al consultar la base de datos de Firestore.' });
    } finally {
      setBuscando(false);
    }
  };

  useEffect(() => {
    if (loteInicialId) {
      setInputBusqueda(loteInicialId);
      buscarLote(loteInicialId);
    } else {
      obtenerLotes(empresaActiva?.id).then((lotes) => {
        if (lotes.length > 0) {
          setInputBusqueda(lotes[0].numeroLote);
          buscarLote(lotes[0].numeroLote);
        } else {
          buscarLote('LOT-2026-0001');
        }
      });
    }
  }, [empresaActiva, loteInicialId]);

  const handleBuscarSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    buscarLote(inputBusqueda);
  };

  const handleRegistrarAvance = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loteActivo) {
      setMensaje({ tipo: 'error', texto: 'Primero debe identificar un lote válido.' });
      return;
    }

    if (!operador.trim()) {
      setMensaje({ tipo: 'error', texto: 'El nombre del operador es obligatorio.' });
      return;
    }

    const cantidadNum = Number(cantidadProcesada);
    if (isNaN(cantidadNum) || cantidadNum < 0) {
      setMensaje({ tipo: 'error', texto: 'La cantidad procesada no puede ser negativa.' });
      return;
    }

    setGuardando(true);
    setMensaje(null);

    try {
      const timestampActual = formatearFechaHoraActual();
      await registrarAvance(
        {
          loteId: loteActivo.numeroLote,
          etapa,
          estado: estadoMovimiento,
          cantidadProcesada: cantidadNum,
          operador: operador.trim(),
          observaciones: observaciones.trim(),
          empresaId: loteActivo.empresaId || empresaActiva?.id || 'EMP-01',
        },
        timestampActual
      );

      setMensaje({
        tipo: 'exito',
        texto: `Avance registrado correctamente para el lote ${loteActivo.numeroLote}. Se actualizó su historial.`,
      });

      // Refrescar estado y movimientos del lote
      await buscarLote(loteActivo.numeroLote);

      // Limpiar observaciones para siguiente captura
      setObservaciones('');
    } catch (err) {
      console.error('Error guardando avance:', err);
      setMensaje({ tipo: 'error', texto: 'Error al persistir el avance en Firestore.' });
    } finally {
      setGuardando(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-in fade-in duration-200">
      {/* Barra de Identificación de Lote */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4 mb-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <MerkaticsCapturar size={22} />
              Estación de Captura de Avance
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Identifique el lote mediante el escáner QR o mediante búsqueda manual por número.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setModalQRAbierto(true)}
            className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-sm font-bold shadow-xs flex items-center justify-center gap-2.5 transition-all"
          >
            <MerkaticsQRScanner size={18} />
            <span>SIMULAR ESCANEO QR</span>
          </button>
        </div>

        {/* Buscador manual rápido */}
        <form onSubmit={handleBuscarSubmit} className="flex gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={inputBusqueda}
              onChange={(e) => setInputBusqueda(e.target.value.toUpperCase())}
              placeholder="Ej. LOT-2026-0001"
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-mono font-bold tracking-wider uppercase focus:ring-2 focus:ring-blue-500 focus:bg-white focus:outline-none"
            />
          </div>
          <button
            type="submit"
            disabled={buscando}
            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold shadow-xs disabled:bg-slate-300 transition-colors"
          >
            {buscando ? 'Buscando...' : 'BUSCAR'}
          </button>
        </form>

        {/* Accesos rápidos de prueba */}
        <div className="flex items-center gap-2 mt-3 text-xs text-slate-500">
          <span className="font-semibold text-slate-600">Lotes de prueba rápida:</span>
          {['LOT-2026-0001', 'LOT-2026-0002', 'LOT-2026-0003'].map((cod) => (
            <button
              key={cod}
              type="button"
              onClick={() => {
                setInputBusqueda(cod);
                buscarLote(cod);
              }}
              className="font-mono text-blue-600 hover:text-blue-800 hover:underline px-1.5 py-0.5 rounded bg-blue-50 border border-blue-100"
            >
              {cod}
            </button>
          ))}
        </div>
      </div>

      {/* Alerta de Notificación */}
      {mensaje && (
        <div
          className={`p-4 rounded-xl text-sm font-medium flex items-center justify-between gap-3 border ${
            mensaje.tipo === 'exito'
              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
              : 'bg-rose-50 text-rose-800 border-rose-200'
          }`}
        >
          <div className="flex items-center gap-2">
            {mensaje.tipo === 'exito' ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
            )}
            <span>{mensaje.texto}</span>
          </div>
          <button
            onClick={() => setMensaje(null)}
            className="text-slate-400 hover:text-slate-600 p-0.5"
          >
            ×
          </button>
        </div>
      )}

      {/* Información del Lote Identificado */}
      {loteActivo && (
        <div className="space-y-6">
          {/* Tarjeta de Lote Activo */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="bg-slate-900 text-white px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700/80 flex items-center justify-center text-white font-mono font-bold">
                  <MerkaticsQRScanner size={20} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest block">
                      Lote Activo en Estación
                    </span>
                    {(() => {
                      const emp = empresas.find((e) => e.id === (loteActivo.empresaId || 'EMP-01'));
                      return emp ? (
                        <span 
                          className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold text-white shadow-2xs"
                          style={{ backgroundColor: emp.colorHex || '#2563EB' }}
                          title={emp.nombre}
                        >
                          <MerkaticsEmpresa size={10} />
                          {emp.siglas}
                        </span>
                      ) : null;
                    })()}
                  </div>
                  <h3 className="text-xl font-black font-mono tracking-wider text-blue-400">
                    {loteActivo.numeroLote}
                  </h3>
                </div>
              </div>

              <div className="flex items-center gap-3 self-end sm:self-auto">
                <div className="text-right">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest block">
                    Estado Actual
                  </span>
                  <StatusBadge status={loteActivo.estado} size="md" />
                </div>
                <button
                  type="button"
                  onClick={() => onVerHistorial(loteActivo.numeroLote)}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold flex items-center gap-1 border border-slate-700"
                >
                  <History className="w-3.5 h-3.5" />
                  Ver Historial
                </button>
              </div>
            </div>

            {/* Ficha técnica del lote en cuadrícula */}
            <div className="p-6 bg-slate-50/70 border-b border-slate-200 grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
                  Producto
                </span>
                <span className="font-bold text-slate-900 block mt-0.5">
                  {loteActivo.productoNombre || loteActivo.productoId}
                </span>
                <span className="text-xs font-mono text-slate-500">{loteActivo.productoId}</span>
              </div>

              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
                  Cantidad Inicial
                </span>
                <span className="font-bold text-slate-900 block mt-0.5 font-mono text-base">
                  {loteActivo.cantidadInicial}{' '}
                  <span className="text-xs font-normal text-slate-600 font-sans">
                    {loteActivo.unidad}
                  </span>
                </span>
              </div>

              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
                  Línea de Producción
                </span>
                <span className="inline-block mt-0.5 px-2.5 py-0.5 rounded-md bg-white border border-slate-200 font-mono font-bold text-slate-800 text-xs">
                  {loteActivo.lineaProduccion}
                </span>
              </div>

              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
                  Fecha de Lote
                </span>
                <span className="font-medium text-slate-700 block mt-0.5 text-xs font-mono">
                  {loteActivo.fechaProduccion}
                </span>
              </div>
            </div>

            {/* Formulario de Captura de Avance */}
            <form onSubmit={handleRegistrarAvance} className="p-6 space-y-5">
              <div className="border-b border-slate-100 pb-3">
                <h4 className="font-bold text-slate-900 text-sm uppercase tracking-wider flex items-center gap-2">
                  <MerkaticsCapturar size={18} />
                  Registro de Nuevo Avance / Inspección
                </h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  Al registrar, se actualizará el estado del lote y se agregará inmediatamente a la línea de tiempo.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* ETAPA DEL PROCESO */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    ETAPA DEL PROCESO *
                  </label>
                  <select
                    value={etapa}
                    onChange={(e) => setEtapa(e.target.value as EtapaProceso)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-semibold focus:ring-2 focus:ring-blue-500 focus:bg-white focus:outline-none"
                  >
                    <option value="Recepción">Recepción (Materia prima y componentes)</option>
                    <option value="Producción">Producción (Maquinado, armado y manufactura)</option>
                    <option value="Inspección">Inspección (Control de calidad y pruebas)</option>
                    <option value="Empaque">Empaque (Embalaje y etiquetado industrial)</option>
                    <option value="Producto terminado">Producto terminado (Liberación final)</option>
                  </select>
                </div>

                {/* ESTADO */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    ESTADO DEL MOVIMIENTO *
                  </label>
                  <select
                    value={estadoMovimiento}
                    onChange={(e) => setEstadoMovimiento(e.target.value as EstadoMovimiento)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-semibold focus:ring-2 focus:ring-blue-500 focus:bg-white focus:outline-none"
                  >
                    <option value="Pendiente">Pendiente</option>
                    <option value="En proceso">En proceso</option>
                    <option value="Aprobado">Aprobado</option>
                    <option value="Rechazado">Rechazado</option>
                    <option value="Completado">Completado</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* CANTIDAD PROCESADA */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    CANTIDAD PROCESADA *
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      min="0"
                      required
                      value={cantidadProcesada}
                      onChange={(e) => setCantidadProcesada(e.target.value)}
                      placeholder="500"
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-mono font-bold focus:ring-2 focus:ring-blue-500 focus:bg-white focus:outline-none"
                    />
                    <span className="px-3 py-2.5 bg-slate-100 border border-slate-300 rounded-xl text-xs font-bold text-slate-600 flex items-center justify-center">
                      {loteActivo.unidad}
                    </span>
                  </div>
                </div>

                {/* OPERADOR */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    OPERADOR RESPONSABLE *
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      value={operador}
                      onChange={(e) => setOperador(e.target.value)}
                      placeholder="Ej. Juan Pérez"
                      className="w-full pl-9 pr-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-medium focus:ring-2 focus:ring-blue-500 focus:bg-white focus:outline-none"
                    />
                    <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  </div>
                </div>

                {/* FECHA Y HORA */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    FECHA Y HORA (AUTOMÁTICA)
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      readOnly
                      value={fechaHoraAuto}
                      className="w-full pl-9 pr-3.5 py-2.5 bg-slate-100 border border-slate-300 rounded-xl text-xs font-mono text-slate-700 font-semibold cursor-default"
                    />
                    <Clock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  </div>
                </div>
              </div>

              {/* OBSERVACIONES */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  OBSERVACIONES / DETALLES DE CALIDAD
                </label>
                <textarea
                  rows={2}
                  value={observaciones}
                  onChange={(e) => setObservaciones(e.target.value)}
                  placeholder="Detalles sobre pruebas de tolerancia, inspección visual, máquina utilizada o incidencias encontradas..."
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:bg-white focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                <span className="text-xs text-slate-500 font-medium">
                  Lote: <strong className="font-mono text-slate-800">{loteActivo.numeroLote}</strong>
                </span>

                <button
                  type="submit"
                  disabled={guardando}
                  className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-bold shadow-md shadow-blue-600/30 disabled:bg-slate-300 transition-all hover:scale-[1.01]"
                >
                  {guardando ? 'Guardando Avance...' : 'REGISTRAR AVANCE'}
                </button>
              </div>
            </form>
          </div>

          {/* Vista previa inmediata del historial del lote */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6">
            <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
              <div>
                <h4 className="font-bold text-slate-900 text-sm uppercase tracking-wider flex items-center gap-2">
                  <History className="w-4 h-4 text-indigo-600" />
                  Historial Registrado de este Lote ({movimientosLote.length} movimientos)
                </h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  Actualización en tiempo real tras cada avance capturado
                </p>
              </div>

              <button
                type="button"
                onClick={() => onVerHistorial(loteActivo.numeroLote)}
                className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1 hover:underline"
              >
                Abrir en Módulo de Historial →
              </button>
            </div>

            {movimientosLote.length === 0 ? (
              <p className="text-slate-500 text-xs py-4 text-center">
                Este lote no tiene movimientos registrados aún. Complete el formulario superior para registrar el primer avance.
              </p>
            ) : (
              <div className="space-y-3">
                {movimientosLote.map((mov, index) => (
                  <div
                    key={mov.id || index}
                    className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center font-mono">
                        {index + 1}
                      </span>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900 text-sm">{mov.etapa}</span>
                          <StatusBadge status={mov.estado} size="sm" />
                        </div>
                        <p className="text-slate-500 mt-0.5">
                          Operador: <strong className="text-slate-700">{mov.operador}</strong> • Cantidad: <strong className="font-mono text-slate-800">{mov.cantidadProcesada} {loteActivo.unidad}</strong>
                        </p>
                        {mov.observaciones && (
                          <p className="text-slate-600 italic mt-1 bg-white p-1.5 rounded border border-slate-200/80">
                            "{mov.observaciones}"
                          </p>
                        )}
                      </div>
                    </div>

                    <span className="font-mono text-slate-500 bg-white px-2.5 py-1 rounded-md border border-slate-200 self-start sm:self-auto shrink-0">
                      {mov.fechaHora}
                    </span>
                  </div>
                ))}
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
          setInputBusqueda(codigo);
          buscarLote(codigo);
        }}
        initialCode={inputBusqueda}
      />
    </div>
  );
};
