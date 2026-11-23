import React, { useState, useMemo } from 'react';
import {
  Users,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  ArrowRight,
  ShieldAlert,
  ArrowUpRight,
  Cpu,
  BadgeCheck,
  UserCheck,
  Zap,
  MapPin,
  RefreshCw,
  Building2,
  Settings
} from 'lucide-react';
import {
  IOT_BLUE,
  IOT_BLACK,
  IOT_ICE_BLUE,
  IOT_ORANGE,
  IOT_DEEP_BLUE,
  IOT_GRAY,
  MerkaticsCapturar,
  MerkaticsCalidad,
  MerkaticsMaquinado,
  MerkaticsDespacho,
  MerkaticsLayout,
  MerkaticsAlerta,
} from '../icons/MerkaticsIcons';
import { useEmpresa } from '../../contexts/EmpresaContext';
import { Lote, Movimiento } from '../../types';

export interface OperadorEstacion {
  id: string;
  nombre: string;
  rol: string;
  avatarInitials: string;
  turno: 'Matutino' | 'Vespertino' | 'Nocturno';
  estadoOperador: 'Activo en estación' | 'En inspección' | 'En relevo' | 'En pausa';
  experiencia: string;
  certificaciones: string[];
  contactoInterno: string;
}

export interface EstacionConOperador {
  id: string;
  codigoBahia: string;
  nombre: string;
  etapaCorrespondiente: string;
  zonaPiso: 'Zona Entrada / Logística' | 'Nave Principal A' | 'Nave Principal B' | 'Área Calidad & Metrología' | 'Área Cuarentena MRB' | 'Zona Embarque / Salida';
  tipo: 'almacen' | 'maquinado' | 'ensamble' | 'calidad' | 'cuarentena' | 'empaque';
  maquinariaPrincipal: string;
  operadorAsignado: OperadorEstacion;
  loteEnProceso?: {
    numeroLote: string;
    productoNombre: string;
    piezasActuales: number;
    piezasMeta: number;
    tiempoEnEstacion: string;
    estadoLote: string;
  };
  oeePromedio: number;
  estatusEstacion: 'Operando normalmente' | 'Inspección activa' | 'Mantenimiento preventivo' | 'Esperando liberación';
}

const ESTACIONES_OPERADORES_DEFAULT: EstacionConOperador[] = [
  {
    id: 'est-01',
    codigoBahia: 'BAHIA-01',
    nombre: 'Recepción & Descarga de Material',
    etapaCorrespondiente: 'Recepción',
    zonaPiso: 'Zona Entrada / Logística',
    tipo: 'almacen',
    maquinariaPrincipal: 'Báscula Avery 5,000 kg & Escáner RFID Zebra',
    oeePromedio: 94.5,
    estatusEstacion: 'Operando normalmente',
    operadorAsignado: {
      id: 'OP-101',
      nombre: 'Carlos Gómez',
      rol: 'Inspector de Materia Prima',
      avatarInitials: 'CG',
      turno: 'Matutino',
      estadoOperador: 'Activo en estación',
      experiencia: '4 años en almacén técnico',
      certificaciones: ['ISO 9001:2015', 'RFID Logistics Specialist'],
      contactoInterno: 'Ext. 104 · Radio Ch-01',
    },
    loteEnProceso: {
      numeroLote: 'LOT-2026-0001',
      productoNombre: 'Válvula de Control Hidráulico VCH-200',
      piezasActuales: 500,
      piezasMeta: 500,
      tiempoEnEstacion: '22 min',
      estadoLote: 'Completado',
    },
  },
  {
    id: 'est-02',
    codigoBahia: 'BAHIA-02',
    nombre: 'Celda Maquinado CNC & Torneado',
    etapaCorrespondiente: 'Producción',
    zonaPiso: 'Nave Principal A',
    tipo: 'maquinado',
    maquinariaPrincipal: 'Centro Mazak 5 Ejes & Torno Haas VF-2',
    oeePromedio: 88.2,
    estatusEstacion: 'Operando normalmente',
    operadorAsignado: {
      id: 'OP-102',
      nombre: 'Juan Carlos Méndez',
      rol: 'Maquinista Master CNC',
      avatarInitials: 'JM',
      turno: 'Matutino',
      estadoOperador: 'Activo en estación',
      experiencia: '8 años en centros de maquinado 5 ejes',
      certificaciones: ['AS9100D', 'Mazak Certified Pro', 'FANUC Master'],
      contactoInterno: 'Ext. 210 · Radio Ch-02',
    },
    loteEnProceso: {
      numeroLote: 'AUTO-LOT-2026-0101',
      productoNombre: 'Árbol de Levas Forjado V8',
      piezasActuales: 1180,
      piezasMeta: 1200,
      tiempoEnEstacion: '1h 15m',
      estadoLote: 'En proceso',
    },
  },
  {
    id: 'est-03',
    codigoBahia: 'BAHIA-03',
    nombre: 'Celda Ensamble & Ajuste Mecánico',
    etapaCorrespondiente: 'Producción',
    zonaPiso: 'Nave Principal B',
    tipo: 'ensamble',
    maquinariaPrincipal: 'Prensa Schmidt 25 kN & Atornillador Atlas Copco',
    oeePromedio: 92.1,
    estatusEstacion: 'Operando normalmente',
    operadorAsignado: {
      id: 'OP-103',
      nombre: 'Laura Velázquez',
      rol: 'Líder Celda de Ensamble',
      avatarInitials: 'LV',
      turno: 'Matutino',
      estadoOperador: 'Activo en estación',
      experiencia: '6 años en líneas de ensamble IATF',
      certificaciones: ['IATF 16949 Pokayoke', 'Six Sigma Green Belt'],
      contactoInterno: 'Ext. 215 · Radio Ch-03',
    },
    loteEnProceso: {
      numeroLote: 'MED-LOT-2026-0201',
      productoNombre: 'Sensor Catéter Biosónico Ultra-Thin',
      piezasActuales: 250,
      piezasMeta: 250,
      tiempoEnEstacion: '45 min',
      estadoLote: 'En proceso',
    },
  },
  {
    id: 'est-04',
    codigoBahia: 'BAHIA-04',
    nombre: 'Control Calidad & Metrología CMM',
    etapaCorrespondiente: 'Inspección',
    zonaPiso: 'Área Calidad & Metrología',
    tipo: 'calidad',
    maquinariaPrincipal: 'Máquina CMM Mitutoyo Crysta-Apex (1.7 µm) & Banco Presión',
    oeePromedio: 93.8,
    estatusEstacion: 'Inspección activa',
    operadorAsignado: {
      id: 'OP-104',
      nombre: 'Mtra. Sofía Garza',
      rol: 'Inspectora Senior Calidad & Metrología',
      avatarInitials: 'SG',
      turno: 'Matutino',
      estadoOperador: 'Activo en estación',
      experiencia: '9 años en laboratorios CMM y ensayos destructivos',
      certificaciones: ['ISO/IEC 17025', 'Nivel III Ensayos No Destructivos'],
      contactoInterno: 'Ext. 301 · Radio Ch-Calidad',
    },
    loteEnProceso: {
      numeroLote: 'LOT-2026-0001',
      productoNombre: 'Válvula de Control Hidráulico VCH-200',
      piezasActuales: 480,
      piezasMeta: 480,
      tiempoEnEstacion: '38 min',
      estadoLote: 'En inspección',
    },
  },
  {
    id: 'est-05',
    codigoBahia: 'BAHIA-05',
    nombre: 'Área de Scrap & Cuarentena MRB',
    etapaCorrespondiente: 'Con incidencia',
    zonaPiso: 'Área Cuarentena MRB',
    tipo: 'cuarentena',
    maquinariaPrincipal: 'Mesa de Análisis 8D, Boroscopio Industrial Olympus',
    oeePromedio: 78.0,
    estatusEstacion: 'Esperando liberación',
    operadorAsignado: {
      id: 'OP-105',
      nombre: 'Ing. Fernando Castro',
      rol: 'Especialista MRB & Material Review',
      avatarInitials: 'FC',
      turno: 'Matutino',
      estadoOperador: 'En inspección',
      experiencia: '5 años en ingeniería de confiabilidad',
      certificaciones: ['ISO 9001 §8.7', 'Auditor Líder 8D'],
      contactoInterno: 'Ext. 305 · Radio Ch-Seguridad',
    },
    loteEnProceso: {
      numeroLote: 'LOT-2026-0002',
      productoNombre: 'Bomba Centrífuga de Alta Presión BC-500',
      piezasActuales: 15,
      piezasMeta: 15,
      tiempoEnEstacion: '1h 40m',
      estadoLote: 'En contención',
    },
  },
  {
    id: 'est-06',
    codigoBahia: 'BAHIA-06',
    nombre: 'Marcado Láser, Empaque & Despacho',
    etapaCorrespondiente: 'Empaque',
    zonaPiso: 'Zona Embarque / Salida',
    tipo: 'empaque',
    maquinariaPrincipal: 'Marcador Láser Trumpf FiberMark & Envolvedora Lantech',
    oeePromedio: 96.0,
    estatusEstacion: 'Operando normalmente',
    operadorAsignado: {
      id: 'OP-106',
      nombre: 'Carlos Ortega',
      rol: 'Supervisor de Empaque & Trazabilidad QR',
      avatarInitials: 'CO',
      turno: 'Matutino',
      estadoOperador: 'Activo en estación',
      experiencia: '7 años en despacho y serialización GS1',
      certificaciones: ['GS1 Barcode / DataMatrix Specialist', 'OEA / C-TPAT'],
      contactoInterno: 'Ext. 402 · Radio Ch-04',
    },
    loteEnProceso: {
      numeroLote: 'LOT-2026-0001',
      productoNombre: 'Válvula de Control Hidráulico VCH-200',
      piezasActuales: 480,
      piezasMeta: 480,
      tiempoEnEstacion: '15 min',
      estadoLote: 'Listo para embarque',
    },
  },
];

interface SimplifiedPlantLayoutProps {
  onSelectEstacion?: (estacionId: string) => void;
  onCapturarParaEstacion?: (estacion: EstacionConOperador) => void;
  onVerHistorialLote?: (loteId: string) => void;
  filtroLoteId?: string;
  compactMode?: boolean; // Para modo Dashboard embebido
}

export const SimplifiedPlantLayout: React.FC<SimplifiedPlantLayoutProps> = ({
  onSelectEstacion,
  onCapturarParaEstacion,
  onVerHistorialLote,
  filtroLoteId,
  compactMode = false,
}) => {
  const { empresaActiva, esVistaGlobal } = useEmpresa();
  const [estaciones, setEstaciones] = useState<EstacionConOperador[]>(ESTACIONES_OPERADORES_DEFAULT);
  const [busqueda, setBusqueda] = useState('');
  const [filtroTipo, setFiltroTipo] = useState<'todos' | 'produccion' | 'calidad' | 'almacen'>('todos');
  const [estacionSeleccionadaId, setEstacionSeleccionadaId] = useState<string>(
    filtroLoteId ? 'est-04' : 'est-02'
  );
  const [modalReasignarOpen, setModalReasignarOpen] = useState(false);
  const [nuevoOperadorNombre, setNuevoOperadorNombre] = useState('');
  const [nuevoOperadorRol, setNuevoOperadorRol] = useState('');

  // Estaciones filtradas por búsqueda y categoría
  const estacionesFiltradas = useMemo(() => {
    return estaciones.filter((est) => {
      const matchBusqueda =
        busqueda === '' ||
        est.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
        est.codigoBahia.toLowerCase().includes(busqueda.toLowerCase()) ||
        est.operadorAsignado.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
        est.operadorAsignado.rol.toLowerCase().includes(busqueda.toLowerCase()) ||
        est.loteEnProceso?.numeroLote.toLowerCase().includes(busqueda.toLowerCase());

      if (!matchBusqueda) return false;

      if (filtroTipo === 'produccion') {
        return est.tipo === 'maquinado' || est.tipo === 'ensamble';
      }
      if (filtroTipo === 'calidad') {
        return est.tipo === 'calidad' || est.tipo === 'cuarentena';
      }
      if (filtroTipo === 'almacen') {
        return est.tipo === 'almacen' || est.tipo === 'empaque';
      }
      return true;
    });
  }, [estaciones, busqueda, filtroTipo]);

  const estacionActiva = useMemo(() => {
    return estaciones.find((e) => e.id === estacionSeleccionadaId) || estaciones[0];
  }, [estaciones, estacionSeleccionadaId]);

  const handleReasignarOperador = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nuevoOperadorNombre.trim()) return;

    setEstaciones((prev) =>
      prev.map((est) => {
        if (est.id === estacionSeleccionadaId) {
          const initials = nuevoOperadorNombre
            .split(' ')
            .map((w) => w[0])
            .join('')
            .slice(0, 2)
            .toUpperCase();

          return {
            ...est,
            operadorAsignado: {
              ...est.operadorAsignado,
              nombre: nuevoOperadorNombre.trim(),
              rol: nuevoOperadorRol.trim() || est.operadorAsignado.rol,
              avatarInitials: initials || 'OP',
              estadoOperador: 'Activo en estación',
            },
          };
        }
        return est;
      })
    );
    setModalReasignarOpen(false);
    setNuevoOperadorNombre('');
    setNuevoOperadorRol('');
  };

  const getTipoIcon = (tipo: EstacionConOperador['tipo']) => {
    switch (tipo) {
      case 'maquinado':
        return <MerkaticsMaquinado size={18} accentColor={IOT_BLUE} />;
      case 'calidad':
        return <MerkaticsCalidad size={18} accentColor={IOT_BLUE} />;
      case 'empaque':
        return <MerkaticsDespacho size={18} accentColor={IOT_BLUE} />;
      case 'cuarentena':
        return <MerkaticsAlerta size={18} accentColor={IOT_ORANGE} />;
      default:
        return <MerkaticsLayout size={18} accentColor={IOT_BLUE} />;
    }
  };

  return (
    <div className="space-y-4">
      {/* Barra de Controles y Búsqueda */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          {/* Símbolo antena IOT Technologies */}
          <div className="w-9 h-9 rounded-xl bg-[#231f20] text-white flex items-center justify-center shrink-0 shadow-xs border border-[#1d7eae]/30">
            <svg width="22" height="22" viewBox="0 0 100 100" fill="none">
              <circle cx="50" cy="50" r="14" fill={IOT_BLUE} />
              <circle cx="50" cy="50" r="26" stroke={IOT_BLUE} strokeWidth="7" fill="none" />
              <circle cx="50" cy="50" r="38" stroke="#ffffff" strokeWidth="6" fill="none" opacity="0.9" />
            </svg>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-slate-900 tracking-tight font-sans">
                Layout de Planta & Ubicación de Operadores
              </h3>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#1d7eae]/10 text-[#1d7eae] font-bold border border-[#1d7eae]/20">
                En vivo
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Identificación en tiempo real de cada operador asignado a su estación de trabajo
            </p>
          </div>
        </div>

        {/* Buscador y Filtros */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="relative min-w-[220px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              placeholder="Buscar operador o estación..."
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#1d7eae] transition-all font-sans"
            />
          </div>

          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-semibold text-slate-600">
            <button
              onClick={() => setFiltroTipo('todos')}
              className={`px-2.5 py-1 rounded-lg transition-all ${
                filtroTipo === 'todos' ? 'bg-white text-slate-900 shadow-xs font-bold' : 'hover:text-slate-900'
              }`}
            >
              Todos (6)
            </button>
            <button
              onClick={() => setFiltroTipo('produccion')}
              className={`px-2.5 py-1 rounded-lg transition-all ${
                filtroTipo === 'produccion' ? 'bg-white text-slate-900 shadow-xs font-bold' : 'hover:text-slate-900'
              }`}
            >
              Maquinado & Ensamble
            </button>
            <button
              onClick={() => setFiltroTipo('calidad')}
              className={`px-2.5 py-1 rounded-lg transition-all ${
                filtroTipo === 'calidad' ? 'bg-white text-slate-900 shadow-xs font-bold' : 'hover:text-slate-900'
              }`}
            >
              Calidad CMM
            </button>
            <button
              onClick={() => setFiltroTipo('almacen')}
              className={`px-2.5 py-1 rounded-lg transition-all ${
                filtroTipo === 'almacen' ? 'bg-white text-slate-900 shadow-xs font-bold' : 'hover:text-slate-900'
              }`}
            >
              Logística & Empaque
            </button>
          </div>
        </div>
      </div>

      {/* PLANO DE PLANTA 2D SIMPLIFICADO: DISTRIBUCIÓN EN PISO */}
      <div className="bg-slate-900 rounded-2xl p-4 sm:p-5 border border-slate-800 text-white relative overflow-hidden shadow-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 border-b border-slate-800/80 pb-3">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-300 font-mono">
              Distribución Arquitectónica de Planta · 6 Bahías Físicas
            </span>
          </div>
          <div className="flex items-center gap-3 text-[11px] text-slate-400 font-mono">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#1d7eae]" /> Estación Operando
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-400" /> Inspección QA
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400" /> Empaque
            </span>
          </div>
        </div>

        {/* Retícula Física de la Nave de Manufactura */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {estacionesFiltradas.map((est) => {
            const isSelected = est.id === estacionSeleccionadaId;
            return (
              <div
                key={est.id}
                onClick={() => {
                  setEstacionSeleccionadaId(est.id);
                  if (onSelectEstacion) onSelectEstacion(est.id);
                }}
                className={`relative rounded-xl p-4 transition-all cursor-pointer border flex flex-col justify-between ${
                  isSelected
                    ? 'bg-slate-800/95 border-[#1d7eae] ring-2 ring-[#1d7eae]/40 shadow-lg'
                    : 'bg-slate-800/60 hover:bg-slate-800 border-slate-700/80 hover:border-slate-500'
                }`}
              >
                {/* Cabecera de la Estación */}
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="font-mono text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-[#98dae9]">
                      {est.codigoBahia}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono truncate max-w-[130px]">
                      {est.zonaPiso}
                    </span>
                  </div>

                  <h4 className="text-sm font-bold text-white tracking-tight leading-snug">
                    {est.nombre}
                  </h4>
                  <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
                    {est.maquinariaPrincipal}
                  </p>
                </div>

                {/* FICHA DEL OPERADOR EN SU ESTACIÓN (Objetivo clave del usuario) */}
                <div className="mt-3.5 pt-3 border-t border-slate-700/70 bg-slate-900/60 -mx-4 -mb-4 p-3.5 rounded-b-xl">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2.5 min-w-0">
                      {/* Avatar del Operador */}
                      <div className="w-8 h-8 rounded-lg bg-[#1d7eae] text-white font-black text-xs flex items-center justify-center shrink-0 border border-white/20 shadow-xs">
                        {est.operadorAsignado.avatarInitials}
                      </div>

                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-bold text-white truncate block">
                            {est.operadorAsignado.nombre}
                          </span>
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" title="En turno" />
                        </div>
                        <span className="text-[10px] text-[#98dae9] block truncate">
                          {est.operadorAsignado.rol}
                        </span>
                      </div>
                    </div>

                    <span className="text-[10px] font-mono font-semibold text-slate-400 bg-slate-800 px-1.5 py-0.5 rounded shrink-0">
                      {est.operadorAsignado.turno}
                    </span>
                  </div>

                  {/* Lote actual en proceso */}
                  {est.loteEnProceso && (
                    <div className="mt-2.5 pt-2 border-t border-slate-800 flex items-center justify-between text-[10px] text-slate-400 font-mono">
                      <span className="text-blue-300 font-semibold truncate max-w-[140px]">
                        {est.loteEnProceso.numeroLote}
                      </span>
                      <span className="text-slate-300">
                        {est.loteEnProceso.piezasActuales} pzas · {est.loteEnProceso.tiempoEnEstacion}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* DETALLE EJECUTIVO DE LA ESTACIÓN Y OPERADOR SELECCIONADO */}
      {estacionActiva && (
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-5">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-100 pb-4 mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-center text-[#1d7eae] shrink-0">
                {getTipoIcon(estacionActiva.tipo)}
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                    {estacionActiva.codigoBahia}
                  </span>
                  <span className="text-xs text-slate-500 font-medium">
                    · {estacionActiva.zonaPiso}
                  </span>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 font-mono">
                    OEE {estacionActiva.oeePromedio}%
                  </span>
                </div>
                <h3 className="text-base font-black text-slate-900 tracking-tight mt-0.5">
                  {estacionActiva.nombre}
                </h3>
              </div>
            </div>

            {/* Acciones de Operación y Reasignación */}
            <div className="flex items-center gap-2 flex-wrap">
              <button
                type="button"
                onClick={() => {
                  setNuevoOperadorNombre(estacionActiva.operadorAsignado.nombre);
                  setNuevoOperadorRol(estacionActiva.operadorAsignado.rol);
                  setModalReasignarOpen(true);
                }}
                className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Settings className="w-3.5 h-3.5 text-slate-500" />
                <span>Reasignar Operador</span>
              </button>

              {onCapturarParaEstacion && (
                <button
                  type="button"
                  onClick={() => onCapturarParaEstacion(estacionActiva)}
                  className="px-4 py-2 rounded-xl bg-[#1d7eae] hover:bg-[#16648c] text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <MerkaticsCapturar size={14} />
                  <span>Capturar Avance en {estacionActiva.codigoBahia}</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Grid de 3 Columnas: Operador / Trabajo en Curso / Maquinaria */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Columna 1: Expediente del Operador en Estación */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-3">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5 font-mono">
                <Users className="w-3.5 h-3.5 text-[#1d7eae]" />
                Operador en Turno Activo
              </span>

              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-[#231f20] text-white font-black text-sm flex items-center justify-center border border-[#1d7eae]/40">
                  {estacionActiva.operadorAsignado.avatarInitials}
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">
                    {estacionActiva.operadorAsignado.nombre}
                  </h4>
                  <p className="text-xs text-slate-500">
                    {estacionActiva.operadorAsignado.rol}
                  </p>
                </div>
              </div>

              <div className="space-y-1.5 text-xs text-slate-600 pt-1 border-t border-slate-200/70">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Turno & Estado:</span>
                  <span className="font-semibold text-slate-800">
                    {estacionActiva.operadorAsignado.turno} · {estacionActiva.operadorAsignado.estadoOperador}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Experiencia:</span>
                  <span className="font-medium text-slate-700">
                    {estacionActiva.operadorAsignado.experiencia}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Canal / Radio:</span>
                  <span className="font-mono text-slate-700 font-medium">
                    {estacionActiva.operadorAsignado.contactoInterno}
                  </span>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-200/70">
                <span className="text-[10px] text-slate-400 block mb-1">Certificaciones de Estación:</span>
                <div className="flex flex-wrap gap-1">
                  {estacionActiva.operadorAsignado.certificaciones.map((cert) => (
                    <span
                      key={cert}
                      className="text-[10px] px-2 py-0.5 rounded bg-white text-slate-700 border border-slate-200 font-mono"
                    >
                      {cert}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Columna 2: Lote & Trazabilidad Activa */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-3">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5 font-mono">
                <BadgeCheck className="w-3.5 h-3.5 text-emerald-600" />
                Lote en Proceso Actual
              </span>

              {estacionActiva.loteEnProceso ? (
                <>
                  <div className="flex items-baseline justify-between">
                    <div>
                      <span className="text-xs text-slate-400 font-mono">Orden de Manufactura:</span>
                      <p className="font-mono font-bold text-base text-[#1d7eae]">
                        {estacionActiva.loteEnProceso.numeroLote}
                      </p>
                    </div>
                    {onVerHistorialLote && (
                      <button
                        type="button"
                        onClick={() => onVerHistorialLote(estacionActiva.loteEnProceso!.numeroLote)}
                        className="text-xs font-semibold text-[#1d7eae] hover:underline flex items-center gap-0.5"
                      >
                        Ver historial →
                      </button>
                    )}
                  </div>

                  <p className="text-xs font-semibold text-slate-800 line-clamp-1">
                    {estacionActiva.loteEnProceso.productoNombre}
                  </p>

                  <div className="space-y-1.5 text-xs text-slate-600 pt-1 border-t border-slate-200/70">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Progreso de Estación:</span>
                      <span className="font-mono font-bold text-slate-800">
                        {estacionActiva.loteEnProceso.piezasActuales} / {estacionActiva.loteEnProceso.piezasMeta} pzas
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Tiempo en Puesto:</span>
                      <span className="font-mono text-slate-700">
                        {estacionActiva.loteEnProceso.tiempoEnEstacion}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Estado de Calidad:</span>
                      <span className="text-emerald-700 font-semibold font-mono text-[11px]">
                        {estacionActiva.loteEnProceso.estadoLote}
                      </span>
                    </div>
                  </div>
                </>
              ) : (
                <div className="py-6 text-center text-xs text-slate-400">
                  Estación lista y despejada para el siguiente lote
                </div>
              )}
            </div>

            {/* Columna 3: Maquinaria & Sensores IOT */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-3">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5 font-mono">
                <Cpu className="w-3.5 h-3.5 text-[#1d7eae]" />
                Equipamiento & Sensores IOT
              </span>

              <div>
                <span className="text-[10px] text-slate-400 block font-semibold">Máquinas Principales:</span>
                <p className="text-xs text-slate-800 font-medium mt-0.5 leading-snug">
                  {estacionActiva.maquinariaPrincipal}
                </p>
              </div>

              <div className="space-y-1.5 text-xs text-slate-600 pt-1 border-t border-slate-200/70">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Estatus del Puesto:</span>
                  <span className="font-semibold text-emerald-600 flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    {estacionActiva.estatusEstacion}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Telemetría Conectada:</span>
                  <span className="font-mono text-slate-700">MQTT · 915 MHz RFID</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Protocolo de Auditoría:</span>
                  <span className="font-mono text-slate-700">Norma ISO §8.5</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL PARA REASIGNAR OPERADOR A LA ESTACIÓN */}
      {modalReasignarOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <UserCheck className="w-5 h-5 text-[#1d7eae]" />
                <h3 className="font-bold text-slate-900 text-sm">
                  Reasignar Operador · {estacionActiva.codigoBahia}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setModalReasignarOpen(false)}
                className="text-slate-400 hover:text-slate-700 text-sm font-bold p-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleReasignarOperador} className="space-y-3.5">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Nombre del Operador
                </label>
                <input
                  type="text"
                  required
                  value={nuevoOperadorNombre}
                  onChange={(e) => setNuevoOperadorNombre(e.target.value)}
                  placeholder="Ej. Ing. Martín Rodríguez"
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:border-[#1d7eae]"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Puesto / Especialidad
                </label>
                <input
                  type="text"
                  value={nuevoOperadorRol}
                  onChange={(e) => setNuevoOperadorRol(e.target.value)}
                  placeholder="Ej. Técnico CNC Nivel 2"
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:border-[#1d7eae]"
                />
              </div>

              <div className="bg-blue-50/70 p-3 rounded-xl border border-blue-200 text-xs text-blue-900 flex items-start gap-2">
                <span className="text-blue-600 font-bold">ℹ</span>
                <span>
                  Al reasignar, todos los avances futuros capturados en <strong>{estacionActiva.codigoBahia}</strong> se registrarán automáticamente con la firma de este operador.
                </span>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setModalReasignarOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#1d7eae] hover:bg-[#16648c] text-white text-xs font-bold shadow-xs cursor-pointer"
                >
                  Confirmar Asignación
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
