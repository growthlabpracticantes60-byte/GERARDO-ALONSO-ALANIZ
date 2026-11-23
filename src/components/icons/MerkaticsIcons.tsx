import React from 'react';

/**
 * MERKATICS Growth Operating System - Sistema de Iconografía Oficial
 * Especificaciones de diseño:
 * - Retícula base: 24x24 px
 * - Grosor de trazo uniforme: 2px
 * - Terminaciones: strokeLinecap="round", strokeLinejoin="round"
 * - Color base: currentColor (hereda el tono del texto / tema)
 * - Color de acento focal MERKATICS: #E2554F (Coral característico de foco y dinamismo)
 */

/**
 * IOT TECHNOLOGIES - Business Innovation Solutions
 * Manual Corporativo de Identidad Oficial (Social eThinking S.A. de C.V.)
 * Colores Institucionales:
 * - Pantone 640 C: #1d7eae (R29 G126 B174)
 * - Pantone Process Black: #231f20 (R35 G31 B32)
 * Colores Paleta Secundaria:
 * - Pantone 286 C: #0032a0 (R0 G51 B160)
 * - Pantone 304 C: #98dae9 (R153 G218 B234)
 * - Pantone 165 C: #ff661b (R255 G103 B27)
 * - Pantone 441 C: #bdc6c3 (R190 G198 B195)
 */

export const IOT_BLUE = '#1d7eae'; // Pantone 640 C
export const IOT_BLACK = '#231f20'; // Pantone Process Black
export const IOT_DEEP_BLUE = '#0032a0'; // Pantone 286 C
export const IOT_ICE_BLUE = '#98dae9'; // Pantone 304 C
export const IOT_ORANGE = '#ff661b'; // Pantone 165 C
export const IOT_GRAY = '#bdc6c3'; // Pantone 441 C

export const MERKATICS_CORAL = '#1d7eae'; // Sincronizado con IOT Blue principal

export interface MerkaticsIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
  accentColor?: string;
  disableAccent?: boolean;
  className?: string;
}

// Símbolo Antena IOT Technologies (Círculos concéntricos de señal emisora)
export const IotAntennaSymbol: React.FC<MerkaticsIconProps> = ({
  size = 28,
  accentColor = IOT_BLUE,
  className = '',
  ...props
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}
    >
      {/* Disco central emisor */}
      <circle cx="50" cy="50" r="14" fill={accentColor} />
      {/* Primer anillo de onda */}
      <circle cx="50" cy="50" r="26" stroke={accentColor} strokeWidth="7" fill="none" />
      {/* Segundo anillo de onda exterior */}
      <circle cx="50" cy="50" r="38" stroke={accentColor} strokeWidth="6" fill="none" opacity="0.9" />
      {/* Anillo de contorno exterior sutil */}
      <circle cx="50" cy="50" r="46" stroke={accentColor} strokeWidth="2.5" strokeDasharray="3 3" fill="none" opacity="0.6" />
    </svg>
  );
};

// Logotipo Completo IOT Technologies: Símbolo + Tipografía + Subtítulo
export const IotTechnologiesLogo: React.FC<{
  size?: 'sm' | 'md' | 'lg';
  theme?: 'dark' | 'light';
  className?: string;
}> = ({ size = 'md', theme = 'dark', className = '' }) => {
  const isDark = theme === 'dark';
  const textColor = isDark ? '#ffffff' : IOT_BLACK;
  const subColor = isDark ? '#98dae9' : '#52525b';

  return (
    <div className={`flex items-center gap-2.5 select-none ${className}`}>
      {/* Logo-símbolo (Antena con 'O') */}
      <div className="relative flex items-center justify-center shrink-0">
        <svg width={size === 'sm' ? 32 : size === 'lg' ? 48 : 40} height={size === 'sm' ? 32 : size === 'lg' ? 48 : 40} viewBox="0 0 120 120" fill="none">
          {/* Fondo circular de alto contraste */}
          <circle cx="60" cy="60" r="56" fill={IOT_BLACK} />
          {/* Ondas concéntricas Pantone 640C (#1d7eae) */}
          <circle cx="60" cy="60" r="44" stroke={IOT_BLUE} strokeWidth="8" fill="none" />
          <circle cx="60" cy="60" r="28" stroke="#ffffff" strokeWidth="6" fill="none" />
          <circle cx="60" cy="60" r="15" fill={IOT_BLUE} />
        </svg>
      </div>

      <div className="flex flex-col justify-center">
        <div className="flex items-baseline gap-1">
          <span className="font-extrabold tracking-tight font-sans" style={{ color: textColor, fontSize: size === 'sm' ? '14px' : size === 'lg' ? '20px' : '16px' }}>
            IOT
          </span>
          <span className="font-black tracking-wider uppercase font-sans" style={{ color: IOT_BLUE, fontSize: size === 'sm' ? '14px' : size === 'lg' ? '20px' : '16px' }}>
            TECHNOLOGIES
          </span>
        </div>
        <span
          className="text-[8px] uppercase tracking-[0.2em] font-semibold -mt-0.5 font-sans"
          style={{ color: subColor }}
        >
          Business Innovation Solutions
        </span>
      </div>
    </div>
  );
};

// 00. Logotipo / Emblema MERKATICS Growth OS
export const MerkaticsLogo: React.FC<MerkaticsIconProps> = ({
  size = 24,
  accentColor = MERKATICS_CORAL,
  disableAccent = false,
  className = '',
  ...props
}) => {
  const accent = disableAccent ? 'currentColor' : accentColor;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}
    >
      {/* Geometría "M" arquitectónica de crecimiento */}
      <path
        d="M3 19V5L9 14L15 5V19"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Vector de aceleración MERKATICS */}
      <path
        d="M15 19L21 9"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Nodo focal de crecimiento coral */}
      <circle cx="21" cy="6" r="2.5" fill={accent} stroke="white" strokeWidth="1" />
      <path
        d="M9 14L12 9"
        stroke={accent}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

// 01. Dashboard / Panel General de Métricas
export const MerkaticsDashboard: React.FC<MerkaticsIconProps> = ({
  size = 24,
  accentColor = MERKATICS_CORAL,
  disableAccent = false,
  className = '',
  ...props
}) => {
  const accent = disableAccent ? 'currentColor' : accentColor;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}
    >
      {/* Contenedor del panel */}
      <rect
        x="3"
        y="3"
        width="18"
        height="18"
        rx="2.5"
        stroke="currentColor"
        strokeWidth="2"
      />
      {/* Barras de métricas base */}
      <path
        d="M7 16V13M12 16V10M17 16V7"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      {/* Curva de tendencia con foco coral en el punto máximo */}
      <path
        d="M6 13L11 9L15 11L18 6"
        stroke={accent}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="18" cy="6" r="1.5" fill={accent} />
    </svg>
  );
};

// 02. Catálogo de Productos / Componentes
export const MerkaticsProductos: React.FC<MerkaticsIconProps> = ({
  size = 24,
  accentColor = MERKATICS_CORAL,
  disableAccent = false,
  className = '',
  ...props
}) => {
  const accent = disableAccent ? 'currentColor' : accentColor;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}
    >
      {/* Cubo isométrico 3D de producto de ingeniería */}
      <path
        d="M12 3L20 7.5V16.5L12 21L4 16.5V7.5L12 3Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path
        d="M12 12L20 7.5M12 12V21M12 12L4 7.5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Sello de especificación técnica coral */}
      <path
        d="M12 7.5L16 9.75M12 12L16 14.25"
        stroke={accent}
        strokeWidth="2"
        strokeLinecap="round"
      />
      <circle cx="12" cy="12" r="1.5" fill={accent} />
    </svg>
  );
};

// 03. Lotes de Fabricación / Inventario
export const MerkaticsLotes: React.FC<MerkaticsIconProps> = ({
  size = 24,
  accentColor = MERKATICS_CORAL,
  disableAccent = false,
  className = '',
  ...props
}) => {
  const accent = disableAccent ? 'currentColor' : accentColor;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}
    >
      {/* Capas apiladas de lotes industriales */}
      <path
        d="M2 17L12 22L22 17M2 12L12 17L22 12"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12 2L2 7L12 12L22 7L12 2Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      {/* Etiqueta / Precinto de lote en acento coral */}
      <path
        d="M10 5L14 7"
        stroke={accent}
        strokeWidth="2"
        strokeLinecap="round"
      />
      <circle cx="12" cy="7" r="1.5" fill={accent} />
    </svg>
  );
};

// 04. Trazabilidad Pieza por Pieza (Serialización Unitaria UID)
export const MerkaticsPiezas: React.FC<MerkaticsIconProps> = ({
  size = 24,
  accentColor = MERKATICS_CORAL,
  disableAccent = false,
  className = '',
  ...props
}) => {
  const accent = disableAccent ? 'currentColor' : accentColor;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}
    >
      {/* Núcleo de pieza micro-mecanizada con pistas de trazabilidad */}
      <rect
        x="5"
        y="5"
        width="14"
        height="14"
        rx="2"
        stroke="currentColor"
        strokeWidth="2"
      />
      {/* Conexiones perimetrales */}
      <path
        d="M9 2V5M15 2V5M9 19V22M15 19V22M2 9H5M2 15H5M19 9H22M19 15H22"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      {/* Chip serial unitario UID con foco coral */}
      <rect
        x="9"
        y="9"
        width="6"
        height="6"
        rx="1"
        stroke={accent}
        strokeWidth="2"
        fill={disableAccent ? 'none' : `${accentColor}20`}
      />
      <circle cx="12" cy="12" r="1.2" fill={accent} />
    </svg>
  );
};

// 05. Layout de Planta & Recorrido del Material
export const MerkaticsLayout: React.FC<MerkaticsIconProps> = ({
  size = 24,
  accentColor = MERKATICS_CORAL,
  disableAccent = false,
  className = '',
  ...props
}) => {
  const accent = disableAccent ? 'currentColor' : accentColor;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}
    >
      {/* Estructura perimetral de bahías de planta */}
      <rect
        x="3"
        y="3"
        width="18"
        height="18"
        rx="3"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path
        d="M3 10H10V3M14 21V15H21"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Recorrido de material en línea de acento coral con estaciones */}
      <path
        d="M6 16C6 16 9 16 11 14C13 12 13 8 17 8"
        stroke={accent}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray="1 1"
      />
      <circle cx="6" cy="16" r="1.8" fill="currentColor" />
      <circle cx="17" cy="8" r="2.2" fill={accent} stroke="white" strokeWidth="0.8" />
    </svg>
  );
};

// 06. Capturar Avance de Producción / Estación de Control
export const MerkaticsCapturar: React.FC<MerkaticsIconProps> = ({
  size = 24,
  accentColor = MERKATICS_CORAL,
  disableAccent = false,
  className = '',
  ...props
}) => {
  const accent = disableAccent ? 'currentColor' : accentColor;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}
    >
      {/* Escáner de estación de control */}
      <rect
        x="4"
        y="4"
        width="16"
        height="16"
        rx="3"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path
        d="M8 12H16M12 8V16"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      {/* Haz dinámico de captura de avance coral */}
      <path
        d="M4 8H2M20 8H22M4 16H2M20 16H22"
        stroke={accent}
        strokeWidth="2"
        strokeLinecap="round"
      />
      <circle cx="12" cy="12" r="2" fill={accent} />
    </svg>
  );
};

// 07. Historial y Auditoría Cronológica
export const MerkaticsHistorial: React.FC<MerkaticsIconProps> = ({
  size = 24,
  accentColor = MERKATICS_CORAL,
  disableAccent = false,
  className = '',
  ...props
}) => {
  const accent = disableAccent ? 'currentColor' : accentColor;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}
    >
      {/* Cronología / Bitácora con aguja de tiempo */}
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
      <path
        d="M12 7V12L15 15"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      {/* Hito de auditoría en acento coral */}
      <path
        d="M12 3C16.9706 3 21 7.02944 21 12"
        stroke={accent}
        strokeWidth="2"
        strokeLinecap="round"
      />
      <circle cx="20" cy="8" r="1.5" fill={accent} />
    </svg>
  );
};

// 08. Copiloto IA Industrial (Gemini Assistant)
export const MerkaticsCopilotoIA: React.FC<MerkaticsIconProps> = ({
  size = 24,
  accentColor = MERKATICS_CORAL,
  disableAccent = false,
  className = '',
  ...props
}) => {
  const accent = disableAccent ? 'currentColor' : accentColor;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}
    >
      {/* Cabeza / Core inteligente */}
      <rect
        x="4"
        y="5"
        width="16"
        height="14"
        rx="4"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path
        d="M9 12H9.01M15 12H15.01"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <path
        d="M2 12H4M20 12H22M12 2V5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      {/* Destello de inteligencia coral en antena superior */}
      <path
        d="M12 2L13 0.5L14 2L15.5 3L14 4L13 5.5L12 4L10.5 3L12 2Z"
        fill={accent}
      />
      <path
        d="M8.5 15C9.5 16 14.5 16 15.5 15"
        stroke={accent}
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
};

// 09. Escáner Barcode & QR Code
export const MerkaticsQRScanner: React.FC<MerkaticsIconProps> = ({
  size = 24,
  accentColor = MERKATICS_CORAL,
  disableAccent = false,
  className = '',
  ...props
}) => {
  const accent = disableAccent ? 'currentColor' : accentColor;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}
    >
      {/* Esquinas del visor */}
      <path
        d="M4 8V5C4 4.44772 4.44772 4 5 4H8M16 4H19C19.5523 4 20 4.44772 20 5V8M20 16V19C20 19.5523 19.5523 20 19 20H16M8 20H5C4.44772 20 4 19.5523 4 19V16"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      {/* Código matriz interior */}
      <rect x="7" y="7" width="3" height="3" fill="currentColor" />
      <rect x="14" y="7" width="3" height="3" fill="currentColor" />
      <rect x="7" y="14" width="3" height="3" fill="currentColor" />
      {/* Línea láser de lectura coral */}
      <path
        d="M2 12H22"
        stroke={accent}
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
};

// 10. Ahorro de Tiempos & Cronómetro de Eficiencia
export const MerkaticsTiemposMejora: React.FC<MerkaticsIconProps> = ({
  size = 24,
  accentColor = MERKATICS_CORAL,
  disableAccent = false,
  className = '',
  ...props
}) => {
  const accent = disableAccent ? 'currentColor' : accentColor;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}
    >
      {/* Cronómetro de precisión */}
      <circle cx="12" cy="13" r="8" stroke="currentColor" strokeWidth="2" />
      <path
        d="M12 2V5M10 2H14M18.5 6.5L19.5 5.5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      {/* Sector de tiempo ahorrado en acento coral */}
      <path
        d="M12 13L16 9"
        stroke={accent}
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M12 5C16.4183 5 20 8.58172 20 13"
        stroke={accent}
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <circle cx="12" cy="13" r="1.5" fill={accent} />
    </svg>
  );
};

// 11. Control de Calidad & Inspección
export const MerkaticsCalidad: React.FC<MerkaticsIconProps> = ({
  size = 24,
  accentColor = MERKATICS_CORAL,
  disableAccent = false,
  className = '',
  ...props
}) => {
  const accent = disableAccent ? 'currentColor' : accentColor;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}
    >
      {/* Escudo de certificación de calidad */}
      <path
        d="M12 2L3 6V11C3 16.55 6.84 21.74 12 23C17.16 21.74 21 16.55 21 11V6L12 2Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Marca de verificación aprobada en coral */}
      <path
        d="M8.5 12L11 14.5L15.5 9.5"
        stroke={accent}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

// 12. Despacho / Logística de Salida
export const MerkaticsDespacho: React.FC<MerkaticsIconProps> = ({
  size = 24,
  accentColor = MERKATICS_CORAL,
  disableAccent = false,
  className = '',
  ...props
}) => {
  const accent = disableAccent ? 'currentColor' : accentColor;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}
    >
      {/* Camión / Transporte de entrega de lotes */}
      <path
        d="M1 4H15V16H1V4ZM15 8H19L23 12V16H15V8Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="5.5" cy="18.5" r="2.5" stroke="currentColor" strokeWidth="2" />
      <circle cx="18.5" cy="18.5" r="2.5" stroke="currentColor" strokeWidth="2" />
      {/* Flecha de despacho rápido en acento coral */}
      <path
        d="M5 10H11M11 10L9 8M11 10L9 12"
        stroke={accent}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

// 13. Maquinado CNC / Centro de Operación
export const MerkaticsMaquinado: React.FC<MerkaticsIconProps> = ({
  size = 24,
  accentColor = MERKATICS_CORAL,
  disableAccent = false,
  className = '',
  ...props
}) => {
  const accent = disableAccent ? 'currentColor' : accentColor;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}
    >
      {/* Husillo y cortador CNC */}
      <path
        d="M10 2H14V6H10V2ZM9 6H15L13 13H11L9 6Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12 13V18"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <rect
        x="4"
        y="18"
        width="16"
        height="4"
        rx="1"
        stroke="currentColor"
        strokeWidth="2"
      />
      {/* Punta de corte y chispa de precisión coral */}
      <circle cx="12" cy="18" r="1.5" fill={accent} />
      <path
        d="M14 15L16 14M10 15L8 14"
        stroke={accent}
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
};

// 14. Alertas & Discrepancias en Producción
export const MerkaticsAlerta: React.FC<MerkaticsIconProps> = ({
  size = 24,
  accentColor = MERKATICS_CORAL,
  disableAccent = false,
  className = '',
  ...props
}) => {
  const accent = disableAccent ? 'currentColor' : accentColor;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}
    >
      <path
        d="M10.29 3.86L1.82 18C1.64537 18.3024 1.55296 18.6453 1.55199 18.9945C1.55101 19.3437 1.64151 19.6871 1.81442 19.9905C1.98734 20.2939 2.23672 20.5467 2.53771 20.7239C2.83869 20.901 3.18079 20.9962 3.53 21H20.47C20.8192 20.9962 21.1613 20.901 21.4623 20.7239C21.7633 20.5467 22.0127 20.2939 22.1856 19.9905C22.3585 19.6871 22.449 19.3437 22.448 18.9945C22.447 18.6453 22.3546 18.3024 22.18 18L13.71 3.86C13.5317 3.56611 13.2807 3.32312 12.9812 3.15449C12.6817 2.98587 12.3437 2.89746 12 2.89746C11.6563 2.89746 11.3183 2.98587 11.0188 3.15449C10.7193 3.32312 10.4683 3.56611 10.29 3.86Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Signo de exclamación en acento coral */}
      <path
        d="M12 9V13"
        stroke={accent}
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <circle cx="12" cy="17" r="1.2" fill={accent} />
    </svg>
  );
};

// 15. Operador / Usuario de Planta
export const MerkaticsOperador: React.FC<MerkaticsIconProps> = ({
  size = 24,
  accentColor = MERKATICS_CORAL,
  disableAccent = false,
  className = '',
  ...props
}) => {
  const accent = disableAccent ? 'currentColor' : accentColor;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}
    >
      <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="2" />
      <path
        d="M4 21V19C4 16.7909 5.79086 15 8 15H16C18.2091 15 20 16.7909 20 19V21"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      {/* Casco o distintivo coral de rol operativo */}
      <path
        d="M7 6C7 3.23858 9.23858 1 12 1C14.7614 1 17 3.23858 17 6"
        stroke={accent}
        strokeWidth="2"
        strokeLinecap="round"
      />
      <circle cx="18" cy="15" r="1.5" fill={accent} />
    </svg>
  );
};

// 16. Escalamiento / Growth OS / Cohete
export const MerkaticsGrowth: React.FC<MerkaticsIconProps> = ({
  size = 24,
  accentColor = MERKATICS_CORAL,
  disableAccent = false,
  className = '',
  ...props
}) => {
  const accent = disableAccent ? 'currentColor' : accentColor;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}
    >
      <path
        d="M4.5 16.5C3.5 17.5 2 22 2 22C2 22 6.5 20.5 7.5 19.5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M14.5 9.5L9.5 14.5M12 12L7.5 16.5L3.5 12.5L8 8"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M8 8C9 4 14 2 22 2C22 10 20 15 16 16L12 12"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Propulsión y propulsor en acento coral */}
      <path
        d="M5 19L2 22M2 19L5 22"
        stroke={accent}
        strokeWidth="2"
        strokeLinecap="round"
      />
      <circle cx="15.5" cy="8.5" r="1.5" fill={accent} />
    </svg>
  );
};

// 17. Persistencia Firestore / Base de Datos
export const MerkaticsDatabase: React.FC<MerkaticsIconProps> = ({
  size = 24,
  accentColor = MERKATICS_CORAL,
  disableAccent = false,
  className = '',
  ...props
}) => {
  const accent = disableAccent ? 'currentColor' : accentColor;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}
    >
      <ellipse cx="12" cy="5" rx="9" ry="3" stroke="currentColor" strokeWidth="2" />
      <path
        d="M3 5V12C3 13.6569 7.02944 15 12 15C16.9706 15 21 13.6569 21 12V5"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path
        d="M3 12V19C3 20.6569 7.02944 22 12 22C16.9706 22 21 20.6569 21 19V12"
        stroke="currentColor"
        strokeWidth="2"
      />
      {/* Nodo de sincronización en acento coral */}
      <circle cx="17" cy="12" r="1.8" fill={accent} />
      <circle cx="17" cy="19" r="1.8" fill={accent} />
    </svg>
  );
};

// 18. Filtro de Alta Precisión
export const MerkaticsFilter: React.FC<MerkaticsIconProps> = ({
  size = 24,
  accentColor = MERKATICS_CORAL,
  disableAccent = false,
  className = '',
  ...props
}) => {
  const accent = disableAccent ? 'currentColor' : accentColor;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}
    >
      <polygon
        points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Indicador de filtro activo coral */}
      <circle cx="19" cy="5" r="2" fill={accent} />
    </svg>
  );
};

// 19. Etiqueta / RFID Tag
export const MerkaticsTag: React.FC<MerkaticsIconProps> = ({
  size = 24,
  accentColor = MERKATICS_CORAL,
  disableAccent = false,
  className = '',
  ...props
}) => {
  const accent = disableAccent ? 'currentColor' : accentColor;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}
    >
      <path
        d="M20.59 13.41L13.42 20.58C13.0457 20.9537 12.5383 21.1637 12.01 21.1637C11.4817 21.1637 10.9743 20.9537 10.6 20.58L2 12V2H12L20.59 10.59C20.9637 10.9643 21.1737 11.4717 21.1737 12C21.1737 12.5283 20.9637 13.0357 20.59 13.41Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Ojal / Chip de lectura coral */}
      <circle cx="7" cy="7" r="2" fill={accent} />
    </svg>
  );
};

// 20. Destello Sparkle MERKATICS
export const MerkaticsSparkle: React.FC<MerkaticsIconProps> = ({
  size = 24,
  accentColor = MERKATICS_CORAL,
  disableAccent = false,
  className = '',
  ...props
}) => {
  const accent = disableAccent ? 'currentColor' : accentColor;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}
    >
      <path
        d="M12 2L14.2 8.8L21 11L14.2 13.2L12 20L9.8 13.2L3 11L9.8 8.8L12 2Z"
        stroke={accent}
        strokeWidth="2"
        fill={disableAccent ? 'none' : `${accentColor}25`}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="19" cy="5" r="1.5" fill="currentColor" />
      <circle cx="5" cy="18" r="1.2" fill="currentColor" />
    </svg>
  );
};

// 21. Empresa Individual / Planta Matriz
export const MerkaticsEmpresa: React.FC<MerkaticsIconProps> = ({
  size = 24,
  accentColor = MERKATICS_CORAL,
  disableAccent = false,
  className = '',
  ...props
}) => {
  const accent = disableAccent ? 'currentColor' : accentColor;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}
    >
      {/* Línea base de cimentación */}
      <path d="M2 21H22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      {/* Nave industrial y edificio corporativo */}
      <path
        d="M4 21V7L12 3V21"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Ala secundaria de producción */}
      <path
        d="M12 11L20 14V21"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Módulos de ventana / bahías */}
      <path d="M8 8V9M8 12V13M8 16V17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M16 17V18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      {/* Baliza focal MERKATICS en cumbre */}
      <circle cx="12" cy="3" r="2.2" fill={accent} stroke="white" strokeWidth="0.8" />
    </svg>
  );
};

// 22. Multi-Empresa / Ecosistema Multi-Tenant y Filiales
export const MerkaticsMultiempresa: React.FC<MerkaticsIconProps> = ({
  size = 24,
  accentColor = MERKATICS_CORAL,
  disableAccent = false,
  className = '',
  ...props
}) => {
  const accent = disableAccent ? 'currentColor' : accentColor;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}
    >
      {/* Red de interconexión entre filiales */}
      <path d="M3 21H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      {/* Planta Filial 1 (Izquierda) */}
      <path
        d="M3 21V10L8 7L12 10V21"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Planta Filial 2 (Derecha) */}
      <path
        d="M12 14L17 11L21 13.5V21"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Nodos de sincronización corporativa */}
      <circle cx="8" cy="7" r="1.5" fill="currentColor" />
      <circle cx="17" cy="11" r="1.5" fill="currentColor" />
      {/* Nodo central neurálgico de Multi-Tenant MERKATICS */}
      <circle cx="12" cy="10" r="2.5" fill={accent} stroke="white" strokeWidth="0.8" />
      <path d="M7 14H9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
};

// Catálogo completo de iconos MERKATICS para el visor del sistema de diseño
export type MerkaticsIconName =
  | 'logo'
  | 'empresa'
  | 'multiempresa'
  | 'dashboard'
  | 'productos'
  | 'lotes'
  | 'piezas'
  | 'layout'
  | 'capturar'
  | 'historial'
  | 'copiloto-ia'
  | 'qr-scanner'
  | 'tiempos-mejora'
  | 'calidad'
  | 'despacho'
  | 'maquinado'
  | 'alerta'
  | 'operador'
  | 'growth'
  | 'database'
  | 'filter'
  | 'tag'
  | 'sparkle';

export interface MerkaticsIconMeta {
  name: MerkaticsIconName;
  label: string;
  category: 'Navegación' | 'Operaciones' | 'Trazabilidad' | 'Métricas & IA' | 'Soporte';
  description: string;
  component: React.FC<MerkaticsIconProps>;
}

export const MERKATICS_ICON_CATALOG: MerkaticsIconMeta[] = [
  {
    name: 'logo',
    label: 'MERKATICS Brand Emblem',
    category: 'Métricas & IA',
    description: 'Emblema geométrico institucional con nodo focal coral de crecimiento.',
    component: MerkaticsLogo,
  },
  {
    name: 'empresa',
    label: 'Empresa & Planta Individual',
    category: 'Navegación',
    description: 'Complejo industrial y sede corporativa con baliza de planta en coral.',
    component: MerkaticsEmpresa,
  },
  {
    name: 'multiempresa',
    label: 'Multiempresa & Filiales',
    category: 'Navegación',
    description: 'Ecosistema multi-tenant de plantas interconectadas con nodo neurálgico coral.',
    component: MerkaticsMultiempresa,
  },
  {
    name: 'dashboard',
    label: 'Dashboard & Métricas',
    category: 'Navegación',
    description: 'Métricas en tiempo real, KPIs de planta y curva de tendencia con acento coral.',
    component: MerkaticsDashboard,
  },
  {
    name: 'productos',
    label: 'Catálogo de Productos',
    category: 'Navegación',
    description: 'Cubo isométrico de especificación de número de parte y ensamble.',
    component: MerkaticsProductos,
  },
  {
    name: 'lotes',
    label: 'Gestión de Lotes',
    category: 'Navegación',
    description: 'Capas apiladas de producción con precinto de validación en acento coral.',
    component: MerkaticsLotes,
  },
  {
    name: 'piezas',
    label: 'Pieza por Pieza (Serial UID)',
    category: 'Trazabilidad',
    description: 'Microcomponente de ingeniería con núcleo serial unitario en coral.',
    component: MerkaticsPiezas,
  },
  {
    name: 'layout',
    label: 'Layout & Recorrido de Material',
    category: 'Trazabilidad',
    description: 'Plano espacial de planta industrial con trazo dinámico y baliza coral.',
    component: MerkaticsLayout,
  },
  {
    name: 'capturar',
    label: 'Capturar Avance',
    category: 'Operaciones',
    description: 'Estación de control en piso con registro activo y pulso de escaneo coral.',
    component: MerkaticsCapturar,
  },
  {
    name: 'historial',
    label: 'Historial & Auditoría',
    category: 'Trazabilidad',
    description: 'Línea de tiempo cronológica inmutable con hito de verificación coral.',
    component: MerkaticsHistorial,
  },
  {
    name: 'copiloto-ia',
    label: 'Copiloto IA (Gemini)',
    category: 'Métricas & IA',
    description: 'Núcleo de inteligencia industrial con destello neural en coral MERKATICS.',
    component: MerkaticsCopilotoIA,
  },
  {
    name: 'qr-scanner',
    label: 'Escáner QR & Barcode',
    category: 'Operaciones',
    description: 'Marco óptico de captura con haz láser horizontal en coral de lectura.',
    component: MerkaticsQRScanner,
  },
  {
    name: 'tiempos-mejora',
    label: 'Ahorro de Tiempos & ROI',
    category: 'Métricas & IA',
    description: 'Cronómetro industrial con sector dinámico de horas/minutos reducidos.',
    component: MerkaticsTiemposMejora,
  },
  {
    name: 'calidad',
    label: 'Control de Calidad & Metrología',
    category: 'Operaciones',
    description: 'Escudo de conformidad con verificación de tolerancias en coral.',
    component: MerkaticsCalidad,
  },
  {
    name: 'despacho',
    label: 'Despacho & Logística',
    category: 'Operaciones',
    description: 'Transporte de expedición con vector de salida rápida.',
    component: MerkaticsDespacho,
  },
  {
    name: 'maquinado',
    label: 'Maquinado CNC & Estaciones',
    category: 'Operaciones',
    description: 'Herramienta de precisión y punto de corte activo en acento coral.',
    component: MerkaticsMaquinado,
  },
  {
    name: 'alerta',
    label: 'Alertas & Incidencias',
    category: 'Soporte',
    description: 'Triángulo de contención inmediata con exclamación coral de advertencia.',
    component: MerkaticsAlerta,
  },
  {
    name: 'operador',
    label: 'Operador & Turno',
    category: 'Soporte',
    description: 'Perfil de operario certificado en piso con indicador de turno.',
    component: MerkaticsOperador,
  },
  {
    name: 'growth',
    label: 'Escalabilidad & Crecimiento',
    category: 'Métricas & IA',
    description: 'Vector exponencial de aceleración de manufactura y productividad.',
    component: MerkaticsGrowth,
  },
  {
    name: 'database',
    label: 'Persistencia Firestore',
    category: 'Soporte',
    description: 'Sincronización de base de datos en la nube con nodos vivos.',
    component: MerkaticsDatabase,
  },
  {
    name: 'filter',
    label: 'Filtro Dinámico',
    category: 'Soporte',
    description: 'Embudo de filtrado por etapa, lote o número de serie.',
    component: MerkaticsFilter,
  },
  {
    name: 'tag',
    label: 'Etiqueta RFID / Serial',
    category: 'Trazabilidad',
    description: 'Identificador físico con microchip de radiofrecuencia.',
    component: MerkaticsTag,
  },
  {
    name: 'sparkle',
    label: 'Destello de Innovación',
    category: 'Métricas & IA',
    description: 'Destello estético distintivo de la marca MERKATICS.',
    component: MerkaticsSparkle,
  },
];

/**
 * Componente unificado MerkaticsIcon
 */
export const MerkaticsIcon: React.FC<
  MerkaticsIconProps & { name: MerkaticsIconName }
> = ({ name, ...rest }) => {
  const iconMeta = MERKATICS_ICON_CATALOG.find((i) => i.name === name);
  if (!iconMeta) return <MerkaticsLogo {...rest} />;
  const IconComponent = iconMeta.component;
  return <IconComponent {...rest} />;
};
