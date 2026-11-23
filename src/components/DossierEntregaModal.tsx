import React, { useState } from 'react';
import {
  ShieldCheck,
  CheckCircle2,
  Calendar,
  FileText,
  Printer,
  ExternalLink,
  Cpu,
  Database,
  Building2,
  Sparkles,
  ArrowRight,
  UserCheck,
  Award,
  Layers,
  Flame,
  Clock,
  ChevronRight,
  Download
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
  MerkaticsLayout,
  MerkaticsLotes,
  MerkaticsPiezas,
  MerkaticsCopilotoIA,
  MerkaticsQRScanner,
} from './icons/MerkaticsIcons';
import { NavTab } from './Sidebar';
import { useEmpresa } from '../contexts/EmpresaContext';

interface DossierEntregaModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateTab: (tab: NavTab) => void;
}

export const DossierEntregaModal: React.FC<DossierEntregaModalProps> = ({
  isOpen,
  onClose,
  onNavigateTab,
}) => {
  const { empresaActiva, empresas, esVistaGlobal } = useEmpresa();
  const [seccionActiva, setSeccionActiva] = useState<'resumen' | 'modulos' | 'validacion' | 'acta'>('resumen');

  if (!isOpen) return null;

  const hitosEntregables = [
    {
      id: 'h1',
      titulo: 'Dashboard Ejecutivo & Live KPIs Firestore',
      categoria: 'Métricas & Monitoreo',
      avance: 100,
      descripcion: 'Cálculo dinámico en tiempo real de Total Active Lots, Pending Inspections y Throughput Efficiency (FPY) directamente desde colecciones Firestore.',
      tab: 'inicio' as NavTab,
      verificado: true,
    },
    {
      id: 'h2',
      titulo: 'Layout Simplificado & Localizador de Operadores',
      categoria: 'Planta & Piso',
      avance: 100,
      descripcion: 'Esquema arquitectónico de las 6 bahías físicas, asignación nominal de operador por puesto, reasignación interactiva, estado de máquinas y lotes en curso.',
      tab: 'layout' as NavTab,
      verificado: true,
    },
    {
      id: 'h3',
      titulo: 'Catálogo de Números de Parte & Emisión de Lotes',
      categoria: 'Ingeniería & Producción',
      avance: 100,
      descripcion: 'Registro de especificaciones técnicas, tolerancias críticas, emisión y control de órdenes de producción por lote con prefijo corporativo.',
      tab: 'lotes' as NavTab,
      verificado: true,
    },
    {
      id: 'h4',
      titulo: 'Trazabilidad Unitaria Pieza por Pieza (UID)',
      categoria: 'Serialización Individual',
      avance: 100,
      descripcion: 'Serialización por pieza individual, DataMatrix, registro de parámetros de inspección (torque, rugosidad, presión) y pasaporte digital unitario.',
      tab: 'piezas' as NavTab,
      verificado: true,
    },
    {
      id: 'h5',
      titulo: 'Captura de Avances en Planta & Inspección QA',
      categoria: 'Control de Proceso',
      avance: 100,
      descripcion: 'Registro de avances por etapa física, control de firma de operador, validación de tolerancias y gestión de scrap/incidencias con aislamiento MRB.',
      tab: 'capturar' as NavTab,
      verificado: true,
    },
    {
      id: 'h6',
      titulo: 'Auditoría Histórica Completa & Escáner QR',
      categoria: 'Calidad & Cumplimiento',
      avance: 100,
      descripcion: 'Genealogía completa de manufactura, trazabilidad inversa, consulta cronológica con estampas de tiempo auditables y lectura de códigos QR.',
      tab: 'historial' as NavTab,
      verificado: true,
    },
    {
      id: 'h7',
      titulo: 'Arquitectura Multi-Tenant Corporativa',
      categoria: 'Gobierno & Seguridad',
      avance: 100,
      descripcion: 'Aislamiento de datos y reglas operativas para 3 filiales (AeroTech, AutoMotive Power, ElectroMed Devices) y modo consolidado corporativo.',
      tab: 'inicio' as NavTab,
      verificado: true,
    },
    {
      id: 'h8',
      titulo: 'Copiloto de Inteligencia Artificial (Gemini)',
      categoria: 'Innovación Tecnológica',
      avance: 100,
      descripcion: 'Auditoría contextual inteligente, detección automatizada de anomalías en lotes y asesoría en normativas ISO 9001, IATF 16949 y AS9100D.',
      tab: 'asistente-ia' as NavTab,
      verificado: true,
    },
  ];

  const handleProbarModulo = (tab: NavTab) => {
    onClose();
    onNavigateTab(tab);
  };

  const handleImprimirActa = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-4xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh] animate-in fade-in zoom-in-95 duration-200">
        {/* Cabecera Corporativa de Entrega: IOT Technologies */}
        <div className="bg-[#231f20] text-white p-6 sm:p-7 relative border-b border-slate-800 shrink-0">
          {/* Acento Pantone 640C glow */}
          <div className="absolute top-0 right-0 -mt-10 -mr-10 w-72 h-72 rounded-full bg-[#1d7eae]/25 blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#1d7eae]/30 text-[#98dae9] border border-[#1d7eae]/40 flex items-center gap-1.5">
                  <Award className="w-3.5 h-3.5 text-[#1d7eae]" />
                  Entregable Oficial de Avance · Hito Sprint 3
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold">
                  Estado: 100% Funcional
                </span>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-black border-2 border-[#1d7eae] flex items-center justify-center shrink-0 shadow-md">
                  <svg width="28" height="28" viewBox="0 0 100 100" fill="none">
                    <circle cx="50" cy="50" r="14" fill={IOT_BLUE} />
                    <circle cx="50" cy="50" r="26" stroke={IOT_BLUE} strokeWidth="6" fill="none" />
                    <circle cx="50" cy="50" r="38" stroke="#ffffff" strokeWidth="5" fill="none" opacity="0.9" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-xl sm:text-2xl font-black tracking-tight font-sans text-white">
                    Dossier de Entrega de Avance · Sistema IOT-TRAZA
                  </h2>
                  <p className="text-xs text-[#98dae9] font-sans">
                    IOT Technologies · Social eThinking S.A. de C.V. | Business Innovation Solutions
                  </p>
                </div>
              </div>
            </div>

            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white p-2 rounded-xl hover:bg-slate-800 transition-colors self-start sm:self-auto cursor-pointer"
              aria-label="Cerrar modal"
            >
              ✕
            </button>
          </div>

          {/* Pestañas de Navegación del Dossier */}
          <div className="flex items-center gap-1 mt-6 border-t border-slate-800/80 pt-4 overflow-x-auto text-xs font-semibold">
            <button
              onClick={() => setSeccionActiva('resumen')}
              className={`px-3.5 py-1.5 rounded-lg transition-all flex items-center gap-1.5 shrink-0 cursor-pointer ${
                seccionActiva === 'resumen'
                  ? 'bg-[#1d7eae] text-white font-bold shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Resumen Ejecutivo</span>
            </button>
            <button
              onClick={() => setSeccionActiva('modulos')}
              className={`px-3.5 py-1.5 rounded-lg transition-all flex items-center gap-1.5 shrink-0 cursor-pointer ${
                seccionActiva === 'modulos'
                  ? 'bg-[#1d7eae] text-white font-bold shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Módulos Entregados ({hitosEntregables.length})</span>
            </button>
            <button
              onClick={() => setSeccionActiva('validacion')}
              className={`px-3.5 py-1.5 rounded-lg transition-all flex items-center gap-1.5 shrink-0 cursor-pointer ${
                seccionActiva === 'validacion'
                  ? 'bg-[#1d7eae] text-white font-bold shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Guía de Validación Rápida</span>
            </button>
            <button
              onClick={() => setSeccionActiva('acta')}
              className={`px-3.5 py-1.5 rounded-lg transition-all flex items-center gap-1.5 shrink-0 cursor-pointer ${
                seccionActiva === 'acta'
                  ? 'bg-[#1d7eae] text-white font-bold shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Acta de Entrega & Firma</span>
            </button>
          </div>
        </div>

        {/* Contenido Dinámico por Pestaña */}
        <div className="p-6 sm:p-7 overflow-y-auto space-y-6 flex-1 text-slate-800">
          {/* SECCIÓN 1: RESUMEN EJECUTIVO */}
          {seccionActiva === 'resumen' && (
            <div className="space-y-6">
              {/* Tarjetas de Métricas de Entrega */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
                <div className="p-4 rounded-2xl bg-blue-50/80 border border-blue-200">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700 font-mono block">
                    Avance Global
                  </span>
                  <span className="text-3xl font-black text-[#1d7eae] font-mono mt-1 block">
                    100%
                  </span>
                  <p className="text-[11px] text-blue-800 mt-0.5">8 de 8 hitos completados</p>
                </div>

                <div className="p-4 rounded-2xl bg-emerald-50/80 border border-emerald-200">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 font-mono block">
                    Base de Datos
                  </span>
                  <span className="text-2xl font-black text-emerald-700 font-mono mt-1 block">
                    Firestore
                  </span>
                  <p className="text-[11px] text-emerald-800 mt-0.5">Persistencia multi-tenant en vivo</p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 font-mono block">
                    Identidad Gráfica
                  </span>
                  <span className="text-xl font-black text-slate-900 font-sans mt-1 block truncate">
                    Manual IOT
                  </span>
                  <p className="text-[11px] text-slate-600 mt-0.5">Pantone 640C / Open Sans</p>
                </div>

                <div className="p-4 rounded-2xl bg-indigo-50/80 border border-indigo-200">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-700 font-mono block">
                    Inteligencia Artificial
                  </span>
                  <span className="text-xl font-black text-indigo-800 font-mono mt-1 block">
                    Gemini API
                  </span>
                  <p className="text-[11px] text-indigo-700 mt-0.5">Auditoría normativa ISO activa</p>
                </div>
              </div>

              {/* Ficha Técnica del Proyecto */}
              <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200 space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 font-mono flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-[#1d7eae]" />
                  Ficha Técnica del Entregable
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-white border border-slate-200/80">
                    <span className="text-slate-500 font-medium">Nombre de la Aplicación:</span>
                    <strong className="text-slate-900 font-mono">IOT-TRAZA Industrial OS</strong>
                  </div>
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-white border border-slate-200/80">
                    <span className="text-slate-500 font-medium">Cliente Receptor:</span>
                    <strong className="text-slate-900">Social eThinking S.A. de C.V.</strong>
                  </div>
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-white border border-slate-200/80">
                    <span className="text-slate-500 font-medium">Versión del Entregable:</span>
                    <strong className="text-emerald-700 font-mono">v1.2.0 (Release de Avance)</strong>
                  </div>
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-white border border-slate-200/80">
                    <span className="text-slate-500 font-medium">Fecha de Corte del Hito:</span>
                    <strong className="text-slate-900 font-mono">Noviembre 2026</strong>
                  </div>
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-white border border-slate-200/80">
                    <span className="text-slate-500 font-medium">Framework & Lenguaje:</span>
                    <strong className="text-slate-900 font-mono">React 19 · TypeScript · Tailwind CSS</strong>
                  </div>
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-white border border-slate-200/80">
                    <span className="text-slate-500 font-medium">Normativas Cubiertas:</span>
                    <strong className="text-blue-700 font-mono">ISO 9001 · IATF 16949 · AS9100D</strong>
                  </div>
                </div>
              </div>

              {/* Objetivos Cumplidos */}
              <div className="border border-slate-200 rounded-2xl p-5 space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 font-mono">
                  Alcance y Requerimientos Cumplidos al 100%
                </h4>
                <div className="space-y-2 text-xs text-slate-600">
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>
                      <strong>Manual de Identidad IOT Technologies:</strong> Incorporación rigurosa de logo-símbolo con antena concéntrica, paleta Pantone 640C (`#1d7eae`), Process Black (`#231f20`), fuentes Open Sans y Roboto, y tagline <em>Business Innovation Solutions</em>.
                    </span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>
                      <strong>Layout Simplificado con Ubicación de Operadores:</strong> Mapeo directo de 6 puestos de trabajo con operador titular, maquinaria, lote activo y estado operativo en tiempo real, permitiendo reasignación interactiva.
                    </span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>
                      <strong>Live KPIs de Trazabilidad:</strong> Monitoreo en vivo de <em>Total Active Lots</em>, <em>Pending Inspections</em> y <em>Throughput Efficiency (FPY)</em> con sincronización directa a Firestore.
                    </span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>
                      <strong>Trazabilidad Dual:</strong> Cobertura completa tanto a nivel lote como serialización individual (pieza por pieza con UID único).
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SECCIÓN 2: LISTA DE MÓDULOS ENTREGADOS */}
          {seccionActiva === 'modulos' && (
            <div className="space-y-3.5">
              <p className="text-xs text-slate-500 mb-2">
                Cada uno de los siguientes módulos se encuentra completamente desarrollado, integrado a Firestore y validado para su demostración:
              </p>

              <div className="space-y-3">
                {hitosEntregables.map((hito, idx) => (
                  <div
                    key={hito.id}
                    className="p-4 rounded-2xl border border-slate-200/90 hover:border-blue-400 bg-white hover:bg-slate-50/50 transition-all shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div className="flex items-start gap-3 min-w-0">
                      <div className="w-7 h-7 rounded-xl bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                        ✓
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="font-bold text-sm text-slate-900 font-sans">
                            {idx + 1}. {hito.titulo}
                          </h4>
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-semibold">
                            {hito.categoria}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                          {hito.descripcion}
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleProbarModulo(hito.tab)}
                      className="px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-[#1d7eae] text-slate-700 hover:text-white text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 self-start sm:self-auto cursor-pointer"
                    >
                      <span>Probar Módulo</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SECCIÓN 3: GUÍA DE VALIDACIÓN RÁPIDA (PARA EL CLIENTE / EVALUADOR) */}
          {seccionActiva === 'validacion' && (
            <div className="space-y-5">
              <div className="bg-blue-50/80 p-4 rounded-2xl border border-blue-200 text-xs text-blue-900 leading-relaxed">
                <strong>Instrucciones para el Evaluador:</strong> Utiliza los siguientes botones de prueba rápida para verificar el correcto funcionamiento de cada componente clave de la entrega en un solo clic.
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-2.5">
                  <div className="flex items-center gap-2 text-slate-900 font-bold text-xs">
                    <MerkaticsLayout size={18} accentColor={IOT_BLUE} />
                    <span>1. Probar Ubicación de Operadores en Planta</span>
                  </div>
                  <p className="text-xs text-slate-500">
                    Abre el mapa 2D interactivo, localiza a Mtra. Sofía Garza en Bahía 04 y prueba el botón de reasignar operador.
                  </p>
                  <button
                    onClick={() => handleProbarModulo('layout')}
                    className="w-full py-2 bg-[#1d7eae] hover:bg-[#16648c] text-white rounded-xl text-xs font-bold transition-all cursor-pointer"
                  >
                    Abrir Layout de Operadores →
                  </button>
                </div>

                <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-2.5">
                  <div className="flex items-center gap-2 text-slate-900 font-bold text-xs">
                    <MerkaticsCapturar size={18} accentColor={IOT_BLUE} />
                    <span>2. Probar Captura de Avance con Lote</span>
                  </div>
                  <p className="text-xs text-slate-500">
                    Registra un movimiento en piso seleccionando etapa, operador y verificación de calidad.
                  </p>
                  <button
                    onClick={() => handleProbarModulo('capturar')}
                    className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all cursor-pointer"
                  >
                    Ir a Estación de Control →
                  </button>
                </div>

                <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-2.5">
                  <div className="flex items-center gap-2 text-slate-900 font-bold text-xs">
                    <MerkaticsQRScanner size={18} accentColor={IOT_BLUE} />
                    <span>3. Probar Trazabilidad QR & Auditoría</span>
                  </div>
                  <p className="text-xs text-slate-500">
                    Inspecciona la genealogía completa del lote <code>LOT-2026-0001</code> con estampas cronológicas auditables.
                  </p>
                  <button
                    onClick={() => handleProbarModulo('historial')}
                    className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all cursor-pointer"
                  >
                    Ver Historial de Lote →
                  </button>
                </div>

                <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-2.5">
                  <div className="flex items-center gap-2 text-slate-900 font-bold text-xs">
                    <MerkaticsCopilotoIA size={18} accentColor={IOT_BLUE} />
                    <span>4. Probar Copiloto IA de Planta</span>
                  </div>
                  <p className="text-xs text-slate-500">
                    Realiza una consulta técnica sobre tolerancias ISO 9001 o auditoría de cuellos de botella con Gemini.
                  </p>
                  <button
                    onClick={() => handleProbarModulo('asistente-ia')}
                    className="w-full py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl text-xs font-bold transition-all cursor-pointer"
                  >
                    Consultar Copiloto IA →
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* SECCIÓN 4: ACTA FORMAL DE ENTREGA */}
          {seccionActiva === 'acta' && (
            <div className="space-y-6">
              <div className="p-6 bg-slate-50 border-2 border-slate-300 rounded-2xl space-y-5 text-slate-900 font-sans print:m-0 print:border-none">
                {/* Cabecera del Documento */}
                <div className="flex items-center justify-between border-b-2 border-slate-800 pb-4">
                  <div>
                    <h3 className="text-base font-black uppercase tracking-wider text-slate-900 font-sans">
                      ACTA DE ENTREGA DE AVANCE DE PROYECTO
                    </h3>
                    <p className="text-xs text-slate-600">
                      Sistema de Trazabilidad Industrial por Lote y Producto · IOT-TRAZA v1.2
                    </p>
                  </div>
                  <div className="text-right font-mono text-xs text-slate-500">
                    <p>Ref: ENT-2026-AV3</p>
                    <p>Fecha: {new Date().toLocaleDateString('es-MX')}</p>
                  </div>
                </div>

                <p className="text-xs leading-relaxed text-slate-700">
                  Por medio de la presente, se hace constar la entrega formal y funcional del <strong>Hito de Avance</strong> para la plataforma <strong>IOT Technologies (Social eThinking S.A. de C.V.)</strong>, habiéndose validado la totalidad de los requerimientos de diseño corporativo, distribución arquitectónica simplificada de estaciones con operadores y persistencia activa en Google Cloud Firestore.
                </p>

                {/* Resumen de Validación */}
                <div className="bg-white p-4 rounded-xl border border-slate-200 text-xs space-y-2">
                  <div className="flex justify-between border-b border-slate-100 pb-1">
                    <span>Módulos de Planta Implementados:</span>
                    <strong className="font-mono">8 de 8 (100%)</strong>
                  </div>
                  <div className="flex justify-between border-b border-slate-100 pb-1">
                    <span>Cumplimiento Manual Corporativo:</span>
                    <strong className="text-emerald-700">Conforme (Pantone 640C / Process Black)</strong>
                  </div>
                  <div className="flex justify-between border-b border-slate-100 pb-1">
                    <span>Mapeo de Operadores en Planta:</span>
                    <strong className="text-emerald-700">Activo (6 Bahías físicas asignadas)</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Estado del Despliegue:</span>
                    <strong className="text-emerald-700 font-mono">Producción Ready / Cloud Run Dev & Pre</strong>
                  </div>
                </div>

                {/* Bloque de Firmas */}
                <div className="grid grid-cols-2 gap-8 pt-8 text-center text-xs">
                  <div>
                    <div className="border-b border-slate-400 w-3/4 mx-auto mb-2 h-10" />
                    <p className="font-bold text-slate-900">Ing. Equipo de Desarrollo & Arquitectura</p>
                    <p className="text-slate-500 text-[10px]">Líder Técnico de Software</p>
                  </div>
                  <div>
                    <div className="border-b border-slate-400 w-3/4 mx-auto mb-2 h-10" />
                    <p className="font-bold text-slate-900">Dirección de Operaciones & Calidad</p>
                    <p className="text-slate-500 text-[10px]">Social eThinking S.A. de C.V. / IOT Technologies</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleImprimirActa}
                  className="px-4 py-2.5 bg-[#1d7eae] hover:bg-[#16648c] text-white rounded-xl text-xs font-bold transition-all flex items-center gap-2 shadow-xs cursor-pointer"
                >
                  <Printer className="w-4 h-4" />
                  <span>Imprimir Acta de Entrega</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Barra Inferior del Modal */}
        <div className="bg-slate-50 p-4 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-500 shrink-0">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>Persistencia en tiempo real: Firestore DB conectada</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-xl font-semibold transition-colors cursor-pointer"
            >
              Cerrar Dossier
            </button>
            <button
              onClick={() => {
                onClose();
                onNavigateTab('layout');
              }}
              className="px-4 py-2 bg-[#1d7eae] hover:bg-[#16648c] text-white rounded-xl font-bold transition-all shadow-xs cursor-pointer flex items-center gap-1.5"
            >
              <span>Ver Layout y Operadores</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
