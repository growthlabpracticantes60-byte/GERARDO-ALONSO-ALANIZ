import React, { useState } from 'react';
import { Bot, User, Copy, Check, ExternalLink } from 'lucide-react';
import { ChatMessage } from '../services/aiService';

interface ChatMessageBubbleProps {
  message: ChatMessage;
  onSelectLote?: (loteId: string) => void;
}

export const ChatMessageBubble: React.FC<ChatMessageBubbleProps> = ({
  message,
  onSelectLote,
}) => {
  const [copied, setCopied] = useState(false);
  const isBot = message.role === 'model';

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Formateador simple y robusto de Markdown para respuestas de IA
  const renderFormattedText = (text: string) => {
    const lines = text.split('\n');

    return lines.map((line, lineIdx) => {
      // Línea vacía
      if (!line.trim()) {
        return <div key={lineIdx} className="h-2" />;
      }

      // Títulos
      if (line.startsWith('### ')) {
        return (
          <h4 key={lineIdx} className="text-sm font-bold text-slate-900 mt-3 mb-1 tracking-tight flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-600 inline-block" />
            {formatInline(line.replace('### ', ''))}
          </h4>
        );
      }
      if (line.startsWith('## ')) {
        return (
          <h3 key={lineIdx} className="text-base font-bold text-slate-900 mt-4 mb-1.5 tracking-tight border-b border-slate-200/80 pb-1">
            {formatInline(line.replace('## ', ''))}
          </h3>
        );
      }

      // Elementos de lista con viñetas
      if (line.trim().startsWith('- ') || line.trim().startsWith('* ')) {
        const itemContent = line.trim().replace(/^[-*]\s+/, '');
        return (
          <div key={lineIdx} className="flex items-start gap-2 text-xs sm:text-sm text-slate-700 my-1 leading-relaxed pl-1">
            <span className="text-blue-500 font-bold mt-1 text-base leading-none">•</span>
            <div className="flex-1">{formatInline(itemContent)}</div>
          </div>
        );
      }

      // Elementos de lista numerada
      const numberedMatch = line.trim().match(/^(\d+)\.\s+(.+)$/);
      if (numberedMatch) {
        return (
          <div key={lineIdx} className="flex items-start gap-2 text-xs sm:text-sm text-slate-700 my-1 leading-relaxed pl-1">
            <span className="font-mono font-bold text-blue-600 bg-blue-50 border border-blue-200 px-1 rounded text-[11px] mt-0.5">
              {numberedMatch[1]}
            </span>
            <div className="flex-1">{formatInline(numberedMatch[2])}</div>
          </div>
        );
      }

      // Párrafo estándar
      return (
        <p key={lineIdx} className="text-xs sm:text-sm text-slate-700 my-1 leading-relaxed">
          {formatInline(line)}
        </p>
      );
    });
  };

  // Reemplazo de inline markdown: negritas (**texto**), código (`codigo`), y tags de lotes
  const formatInline = (text: string): React.ReactNode => {
    // Dividir por negritas **texto**
    const parts = text.split(/(\*\*.*?\*\*|`.*?`)/g);

    return parts.map((part, idx) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        const inner = part.slice(2, -2);

        // Si es un código de lote, permitir click para interactuar
        const isLote = /^LOT-\d{4}-\d{4}$/i.test(inner.trim());
        if (isLote && onSelectLote) {
          return (
            <button
              key={idx}
              type="button"
              onClick={() => onSelectLote(inner.trim())}
              className="inline-flex items-center gap-1 font-mono font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 px-1.5 py-0.5 rounded text-xs transition-colors mx-0.5 cursor-pointer shadow-2xs"
              title={`Ver historial del lote ${inner.trim()}`}
            >
              <span>{inner}</span>
              <ExternalLink className="w-3 h-3 text-blue-500" />
            </button>
          );
        }

        return (
          <strong key={idx} className="font-semibold text-slate-900">
            {inner}
          </strong>
        );
      }

      if (part.startsWith('`') && part.endsWith('`')) {
        const inner = part.slice(1, -1);
        return (
          <code key={idx} className="font-mono text-xs bg-slate-100 text-slate-800 px-1.5 py-0.5 rounded border border-slate-200">
            {inner}
          </code>
        );
      }

      return part;
    });
  };

  return (
    <div className={`flex gap-3 my-3 ${isBot ? 'items-start' : 'items-start justify-end'}`}>
      {isBot && (
        <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shrink-0 shadow-md shadow-blue-500/20 mt-0.5">
          <Bot className="w-4 h-4" />
        </div>
      )}

      <div
        className={`relative max-w-[85%] sm:max-w-[75%] rounded-2xl px-4 py-3 shadow-xs ${
          isBot
            ? 'bg-white border border-slate-200/90 text-slate-800 rounded-tl-xs'
            : 'bg-blue-600 text-white rounded-tr-xs shadow-blue-600/10'
        }`}
      >
        {/* Cabecera del mensaje */}
        <div className="flex items-center justify-between gap-3 mb-1.5">
          <div className="flex items-center gap-2">
            <span
              className={`text-[11px] font-bold uppercase tracking-wider ${
                isBot ? 'text-blue-600' : 'text-blue-100'
              }`}
            >
              {isBot ? 'TrazaBot (Copiloto IA)' : 'Tú'}
            </span>
            <span
              className={`text-[10px] font-mono ${
                isBot ? 'text-slate-400' : 'text-blue-200'
              }`}
            >
              {message.timestamp}
            </span>
          </div>

          {isBot && (
            <button
              onClick={handleCopy}
              className="text-slate-400 hover:text-slate-600 p-1 rounded-md hover:bg-slate-100 transition-colors"
              title="Copiar respuesta"
            >
              {copied ? (
                <Check className="w-3.5 h-3.5 text-emerald-600" />
              ) : (
                <Copy className="w-3.5 h-3.5" />
              )}
            </button>
          )}
        </div>

        {/* Contenido */}
        <div className={isBot ? 'text-slate-800' : 'text-white'}>
          {isBot ? (
            <div className="prose-xs space-y-0.5">{renderFormattedText(message.content)}</div>
          ) : (
            <p className="text-xs sm:text-sm whitespace-pre-wrap leading-relaxed font-medium">
              {message.content}
            </p>
          )}
        </div>
      </div>

      {!isBot && (
        <div className="w-8 h-8 rounded-xl bg-slate-800 text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5 shadow-xs">
          <User className="w-4 h-4 text-blue-300" />
        </div>
      )}
    </div>
  );
};
