import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  RefreshCw, 
  QrCode, 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  Layers, 
  ChevronRight, 
  Copy, 
  Check, 
  Printer, 
  Eye, 
  FileCheck,
  Bot
} from 'lucide-react';
import {
  MerkaticsPiezas,
  MerkaticsCapturar,
  MerkaticsCalidad,
  MerkaticsAlerta,
  MerkaticsTag,
  MerkaticsLotes,
  MerkaticsEmpresa,
  MerkaticsMultiempresa
} from '../components/icons/MerkaticsIcons';
import { PiezaSerializada, Lote, Producto } from '../types';
import { 
  obtenerPiezas, 
  obtenerLotes, 
  obtenerProductos, 
  crearPiezaSerializada 
} from '../firebase/service';
import { StatusBadge, EtapaBadge } from '../components/StatusBadge';
import { SerializarLoteModal } from '../components/SerializarLoteModal';
import { AvancePiezaModal } from '../components/AvancePiezaModal';
import { FichaPiezaModal } from '../components/FichaPiezaModal';
import { useEmpresa } from '../contexts/EmpresaContext';

interface PiezasViewProps {
  onVerHistorialLote?: (loteId: string) => void;
  onConsultarIA?: (pregunta: string) => void;
  loteFiltroInicial?: string;
}

export const PiezasView: React.FC<PiezasViewProps> = ({
  onVerHistorialLote,
  onConsultarIA,
  loteFiltroInicial,
}) => {
  const { empresaActiva, esVistaGlobal, empresas } = useEmpresa();
  const [piezas, setPiezas] = useState<PiezaSerializada[]>([]);
  const [lotes, setLotes] = useState<Lote[]>([]);
  const [productos, setProductos] = useState<Producto[]>([]);
  const [cargando, setCargando] = useState(true);

  // Filtros
  const [busqueda, setBusqueda] = useState('');
  const [filtroLote, setFiltroLote] = useState(loteFiltroInicial || '');
  const [filtroEtapa, setFiltroEtapa] = useState('');
  const [filtroEstado, setFiltroEstado] = useState('');

  // Modales
  const [serializarModalOpen, setSerializarModalOpen] = useState(false);
  const [avanceModalOpen, setAvanceModalOpen] = useState(false);
  const [fichaModalOpen, setFichaModalOpen] = useState(false);
  const [piezaSeleccionada, setPiezaSeleccionada] = useState<PiezaSerializada | null>(null);

  // Copiado
  const [serialCopiado, setSerialCopiado] = useState<string | null>(null);

  const cargarDatos = async () => {
    setCargando(true);
    try {
      const [piezasData, lotesData, prodsData] = await Promise.all([
        obtenerPiezas(filtroLote || undefined, empresaActiva?.id),
        obtenerLotes(empresaActiva?.id),
        obtenerProductos(empresaActiva?.id),
      ]);
      setPiezas(piezasData);
      setLotes(lotesData);
      setProductos(prodsData);
    } catch (error) {
      console.error('Error cargando piezas serializadas:', error);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, [filtroLote, empresaActiva]);

  const handleCopiar = (serial: string) => {
    navigator.clipboard.writeText(serial);
    setSerialCopiado(serial);
    setTimeout(() => setSerialCopiado(null), 2000);
  };

  // Filtrado reactivo en memoria
  const piezasFiltradas = piezas.filter((p) => {
    const coincideBusqueda = 
      p.numeroSerie.toLowerCase().includes(busqueda.toLowerCase()) ||
      p.loteId.toLowerCase().includes(busqueda.toLowerCase()) ||
      (p.productoNombre || '').toLowerCase().includes(busqueda.toLowerCase()) ||
      (p.estacionActual || '').toLowerCase().includes(busqueda.toLowerCase());

    const coincideEtapa = !filtroEtapa || p.etapaActual === filtroEtapa;
    const coincideEstado = !filtroEstado || p.estado.toLowerCase() === filtroEstado.toLowerCase();

    return coincideBusqueda && coincideEtapa && coincideEstado;
  });

  // Métricas calculadas
  const totalPiezas = piezas.length;
  const terminadas = piezas.filter((p) => p.estado.toLowerCase() === 'terminada' || p.estado.toLowerCase() === 'completado').length;
  const aprobadas = piezas.filter((p) => p.estado.toLowerCase() === 'aprobada').length;
  const rechazadas = piezas.filter((p) => p.estado.toLowerCase() === 'rechazada').length;
  const enProceso = piezas.filter((p) => p.estado.toLowerCase() === 'en proceso' || p.estado.toLowerCase() === 'pendiente').length;

  const tasaRechazo = totalPiezas > 0 ? ((rechazadas / totalPiezas) * 100).toFixed(1) : '0.0';

  return (
    <div className="space-y-6">
      {/* Encabezado Principal */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-white shadow-lg shadow-black/20">
            <MerkaticsPiezas size={26} />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                Trazabilidad Pieza por Pieza
              </h1>
              <span className="text-xs font-bold bg-[#E2554F]/10 text-[#E2554F] border border-[#E2554F]/30 px-2.5 py-0.5 rounded-full font-mono">
                Serialización Unitaria (UID)
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Seguimiento por número de serie, pasaporte digital y control dimensional estación por estación.
            </p>
          </div>
        </div>

        {/* Acciones del encabezado */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={() => setSerializarModalOpen(true)}
            className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-600/20 flex items-center gap-2 transition-all cursor-pointer"
          >
            <MerkaticsTag size={16} />
            <span>Serializar Lote Masivo</span>
          </button>

          <button
            onClick={cargarDatos}
            className="p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-colors cursor-pointer"
            title="Refrescar datos"
          >
            <RefreshCw className={`w-4 h-4 ${cargando ? 'animate-spin text-blue-600' : ''}`} />
          </button>
        </div>
      </div>

      {/* Tarjetas de Métricas de Piezas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Serializadas */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
              Total Serializadas
            </span>
            <span className="text-2xl font-black text-slate-900 font-mono mt-1 block">
              {totalPiezas}
            </span>
            <span className="text-[11px] text-slate-500">Unidades individuales</span>
          </div>
          <div className="w-11 h-11 rounded-xl bg-slate-100 text-slate-800 flex items-center justify-center border border-slate-200">
            <MerkaticsPiezas size={22} />
          </div>
        </div>

        {/* En Línea / En Proceso */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
              En Proceso / Estación
            </span>
            <span className="text-2xl font-black text-amber-600 font-mono mt-1 block">
              {enProceso}
            </span>
            <span className="text-[11px] text-slate-500">En celdas activas</span>
          </div>
          <div className="w-11 h-11 rounded-xl bg-slate-100 text-slate-800 flex items-center justify-center border border-slate-200">
            <MerkaticsCapturar size={22} />
          </div>
        </div>

        {/* Aprobadas / Terminadas */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
              Aprobadas / Listas
            </span>
            <span className="text-2xl font-black text-emerald-600 font-mono mt-1 block">
              {terminadas + aprobadas}
            </span>
            <span className="text-[11px] text-slate-500">Superaron inspección</span>
          </div>
          <div className="w-11 h-11 rounded-xl bg-slate-100 text-slate-800 flex items-center justify-center border border-slate-200">
            <MerkaticsCalidad size={22} />
          </div>
        </div>

        {/* Rechazadas / Defectos */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
              Rechazadas / Scrap
            </span>
            <span className="text-2xl font-black text-rose-600 font-mono mt-1 block">
              {rechazadas}
            </span>
            <span className="text-[11px] text-rose-600 font-medium">Tasa: {tasaRechazo}%</span>
          </div>
          <div className="w-11 h-11 rounded-xl bg-slate-100 text-slate-800 flex items-center justify-center border border-slate-200">
            <MerkaticsAlerta size={22} />
          </div>
        </div>
      </div>

      {/* Barra de Búsqueda y Filtros */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3 sm:space-y-0 sm:flex sm:items-center sm:gap-3">
        {/* Input de Búsqueda */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Buscar por número de serie (ej. SN-LOT-...), lote o estación..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Filtro Lote */}
        <div className="w-full sm:w-48">
          <select
            value={filtroLote}
            onChange={(e) => setFiltroLote(e.target.value)}
            className="w-full py-2.5 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Todos los Lotes</option>
            {lotes.map((l) => (
              <option key={l.numeroLote} value={l.numeroLote}>
                {l.numeroLote}
              </option>
            ))}
          </select>
        </div>

        {/* Filtro Etapa */}
        <div className="w-full sm:w-44">
          <select
            value={filtroEtapa}
            onChange={(e) => setFiltroEtapa(e.target.value)}
            className="w-full py-2.5 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Todas las Etapas</option>
            <option value="Recepción">Recepción</option>
            <option value="Producción">Producción</option>
            <option value="Inspección">Inspección</option>
            <option value="Empaque">Empaque</option>
            <option value="Producto terminado">Producto terminado</option>
          </select>
        </div>

        {/* Filtro Estado */}
        <div className="w-full sm:w-40">
          <select
            value={filtroEstado}
            onChange={(e) => setFiltroEstado(e.target.value)}
            className="w-full py-2.5 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Todos los Estados</option>
            <option value="terminada">Terminada</option>
            <option value="aprobada">Aprobada</option>
            <option value="en proceso">En proceso</option>
            <option value="pendiente">Pendiente</option>
            <option value="rechazada">Rechazada</option>
          </select>
        </div>
      </div>

      {/* Tabla de Piezas Serializadas */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-sm text-slate-900 tracking-tight">
              Registro de Unidades Serializadas
            </h3>
            <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-mono font-medium">
              {piezasFiltradas.length} pieza{piezasFiltradas.length === 1 ? '' : 's'}
            </span>
          </div>
          {filtroLote && (
            <button
              onClick={() => setFiltroLote('')}
              className="text-xs font-semibold text-blue-600 hover:text-blue-800"
            >
              Quitar filtro de lote
            </button>
          )}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs sm:text-sm">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200/80 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                <th className="py-3 px-5">Número de Serie (UID)</th>
                <th className="py-3 px-5">Lote Padre</th>
                <th className="py-3 px-5">Producto</th>
                <th className="py-3 px-5">Etapa Actual</th>
                <th className="py-3 px-5">Estado</th>
                <th className="py-3 px-5">Estación / Operador</th>
                <th className="py-3 px-5 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {cargando ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    <div className="flex flex-col items-center gap-2">
                      <RefreshCw className="w-5 h-5 animate-spin text-blue-600" />
                      <span>Cargando unidades serializadas...</span>
                    </div>
                  </td>
                </tr>
              ) : piezasFiltradas.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center">
                    <div className="max-w-sm mx-auto text-center space-y-3">
                      <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-700 flex items-center justify-center mx-auto border border-slate-200">
                        <MerkaticsPiezas size={24} />
                      </div>
                      <p className="text-sm font-bold text-slate-700">No se encontraron piezas serializadas</p>
                      <p className="text-xs text-slate-500">
                        Puedes serializar un lote existente o generar piezas de demostración para iniciar el rastreo unitario.
                      </p>
                      <button
                        onClick={() => setSerializarModalOpen(true)}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
                      >
                        + Serializar un lote ahora
                      </button>
                    </div>
                  </td>
                </tr>
              ) : (
                piezasFiltradas.map((pieza) => (
                  <tr 
                    key={pieza.numeroSerie} 
                    className="hover:bg-slate-50/60 transition-colors group"
                  >
                    {/* Número de Serie */}
                    <td className="py-3.5 px-5">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-slate-900 tracking-tight">
                          {pieza.numeroSerie}
                        </span>
                        <button
                          onClick={() => handleCopiar(pieza.numeroSerie)}
                          className="opacity-0 group-hover:opacity-100 transition-opacity text-slate-400 hover:text-slate-700 p-0.5"
                          title="Copiar serial"
                        >
                          {serialCopiado === pieza.numeroSerie ? (
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                      <span className="text-[10px] text-slate-400 font-mono block">
                        Actualizado: {pieza.fechaUltimoAvance || 'Reciente'}
                      </span>
                    </td>

                    {/* Lote */}
                    <td className="py-3.5 px-5 font-mono text-slate-700 font-semibold text-xs">
                      {pieza.loteId}
                    </td>

                    {/* Producto */}
                    <td className="py-3.5 px-5 text-slate-800 font-medium">
                      <span className="truncate max-w-[160px] block" title={pieza.productoNombre || pieza.productoId}>
                        {pieza.productoNombre || pieza.productoId}
                      </span>
                    </td>

                    {/* Etapa Actual */}
                    <td className="py-3.5 px-5">
                      <EtapaBadge etapa={pieza.etapaActual} />
                    </td>

                    {/* Estado */}
                    <td className="py-3.5 px-5">
                      <StatusBadge status={pieza.estado} size="sm" />
                    </td>

                    {/* Estación y Operador */}
                    <td className="py-3.5 px-5 text-xs text-slate-600">
                      <p className="font-medium text-slate-800 truncate max-w-[140px]">
                        {pieza.estacionActual || 'Línea de ensamble'}
                      </p>
                      <p className="text-[11px] text-slate-400">
                        Op: {pieza.operadorUltimo || 'N/D'}
                      </p>
                    </td>

                    {/* Acciones */}
                    <td className="py-3.5 px-5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => {
                            setPiezaSeleccionada(pieza);
                            setFichaModalOpen(true);
                          }}
                          className="p-1.5 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                          title="Ver pasaporte y genealogía de la pieza"
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => {
                            setPiezaSeleccionada(pieza);
                            setAvanceModalOpen(true);
                          }}
                          className="px-2.5 py-1 text-xs font-semibold bg-slate-100 hover:bg-blue-600 hover:text-white text-slate-700 rounded-lg transition-colors cursor-pointer"
                        >
                          Inspección
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modales */}
      <SerializarLoteModal
        isOpen={serializarModalOpen}
        onClose={() => setSerializarModalOpen(false)}
        lotes={lotes}
        loteInicialId={filtroLote}
        onPiezasCreadas={cargarDatos}
      />

      <AvancePiezaModal
        isOpen={avanceModalOpen}
        onClose={() => {
          setAvanceModalOpen(false);
          setPiezaSeleccionada(null);
        }}
        pieza={piezaSeleccionada}
        onAvanceGuardado={cargarDatos}
      />

      <FichaPiezaModal
        isOpen={fichaModalOpen}
        onClose={() => {
          setFichaModalOpen(false);
          setPiezaSeleccionada(null);
        }}
        pieza={piezaSeleccionada}
        onRegistrarAvance={(p) => {
          setPiezaSeleccionada(p);
          setAvanceModalOpen(true);
        }}
        onConsultarIA={onConsultarIA}
      />
    </div>
  );
};
