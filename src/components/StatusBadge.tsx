import React from 'react';
import { 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  PlayCircle, 
  Boxes, 
  ShieldCheck, 
  PackageCheck 
} from 'lucide-react';

interface StatusBadgeProps {
  status: string;
  size?: 'sm' | 'md' | 'lg';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'md' }) => {
  const sizeClasses = {
    sm: 'text-[11px] px-2 py-0.5',
    md: 'text-xs px-2.5 py-1',
    lg: 'text-sm px-3 py-1.5',
  };

  const statusNormalizado = status.trim().toLowerCase();

  switch (statusNormalizado) {
    case 'terminado':
    case 'terminada':
    case 'completado':
      return (
        <span className={`inline-flex items-center gap-1.5 font-medium rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200/80 ${sizeClasses[size]}`}>
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
          {status}
        </span>
      );

    case 'aprobado':
    case 'aprobada':
      return (
        <span className={`inline-flex items-center gap-1.5 font-medium rounded-md bg-teal-50 text-teal-700 border border-teal-200/80 ${sizeClasses[size]}`}>
          <ShieldCheck className="w-3.5 h-3.5 text-teal-600 shrink-0" />
          {status}
        </span>
      );

    case 'en producción':
    case 'en proceso':
      return (
        <span className={`inline-flex items-center gap-1.5 font-medium rounded-md bg-amber-50 text-amber-700 border border-amber-200/80 ${sizeClasses[size]}`}>
          <PlayCircle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
          {status}
        </span>
      );

    case 'rechazado':
    case 'rechazada':
    case 'con incidencia':
      return (
        <span className={`inline-flex items-center gap-1.5 font-medium rounded-md bg-rose-50 text-rose-700 border border-rose-200/80 ${sizeClasses[size]}`}>
          <AlertTriangle className="w-3.5 h-3.5 text-rose-600 shrink-0" />
          {status}
        </span>
      );

    case 'retrabajo':
      return (
        <span className={`inline-flex items-center gap-1.5 font-medium rounded-md bg-purple-50 text-purple-700 border border-purple-200/80 ${sizeClasses[size]}`}>
          <Clock className="w-3.5 h-3.5 text-purple-600 shrink-0" />
          {status}
        </span>
      );

    case 'pendiente':
      return (
        <span className={`inline-flex items-center gap-1.5 font-medium rounded-md bg-slate-100 text-slate-700 border border-slate-300 ${sizeClasses[size]}`}>
          <Clock className="w-3.5 h-3.5 text-slate-500 shrink-0" />
          {status}
        </span>
      );

    default:
      return (
        <span className={`inline-flex items-center gap-1.5 font-medium rounded-md bg-blue-50 text-blue-700 border border-blue-200 ${sizeClasses[size]}`}>
          <Boxes className="w-3.5 h-3.5 text-blue-500 shrink-0" />
          {status}
        </span>
      );
  }
};

export const EtapaBadge: React.FC<{ etapa: string }> = ({ etapa }) => {
  const etapaNorm = etapa.trim().toLowerCase();

  const getIcon = () => {
    switch (etapaNorm) {
      case 'recepción':
        return <Boxes className="w-3.5 h-3.5 text-sky-600" />;
      case 'producción':
        return <PlayCircle className="w-3.5 h-3.5 text-indigo-600" />;
      case 'inspección':
        return <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />;
      case 'empaque':
        return <PackageCheck className="w-3.5 h-3.5 text-emerald-600" />;
      case 'producto terminado':
        return <CheckCircle2 className="w-3.5 h-3.5 text-teal-600" />;
      default:
        return <Boxes className="w-3.5 h-3.5 text-slate-600" />;
    }
  };

  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-md bg-slate-100/90 text-slate-800 border border-slate-200">
      {getIcon()}
      {etapa}
    </span>
  );
};
