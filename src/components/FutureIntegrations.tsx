import React, { useState } from 'react';
import { INTEGRACOES_FUTURAS } from '../data';
import { Lock, Sparkles, Check, HelpCircle, ChevronDown, ChevronRight, CheckCircle2 } from 'lucide-react';

export default function FutureIntegrations() {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const getStatusBadge = (status: 'breve' | 'analise' | 'planejado') => {
    switch (status) {
      case 'breve':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] bg-purple-50 text-purple-700 border border-purple-100 px-2 py-0.5 rounded-full font-medium">
            <Sparkles className="w-2.5 h-2.5" />
            Em Breve
          </span>
        );
      case 'analise':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] bg-amber-50 text-amber-700 border border-amber-100 px-2 py-0.5 rounded-full font-medium">
            <HelpCircle className="w-2.5 h-2.5" />
            Em Análise
          </span>
        );
      case 'planejado':
      default:
        return (
          <span className="inline-flex items-center gap-1 text-[10px] bg-slate-100 text-slate-600 border border-slate-200 px-2 py-0.5 rounded-full font-medium">
            Planejado
          </span>
        );
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden h-full">
      <div className="p-4 border-b border-slate-100 flex items-center justify-between">
        <div>
          <h2 className="text-sm font-bold text-slate-800 flex items-center gap-2">
            <Lock className="w-4 h-4 text-slate-400" />
            INTEGRAÇÕES FUTURAS
          </h2>
          <p className="text-[11px] text-slate-400 mt-0.5">
            Módulos de automação mapeados para faturamento
          </p>
        </div>
        <span className="text-[9px] font-bold text-slate-400 bg-slate-50 border border-slate-100 px-2 py-0.5 rounded uppercase tracking-wider">
          Backlog
        </span>
      </div>

      <div className="divide-y divide-slate-100">
        {INTEGRACOES_FUTURAS.map((item) => {
          const isExpanded = expandedId === item.id;
          return (
            <div 
              key={item.id}
              className={`transition-colors duration-200 ${
                isExpanded ? 'bg-slate-50/20' : 'hover:bg-slate-50/10'
              }`}
            >
              <button
                onClick={() => toggleExpand(item.id)}
                id={`future-item-${item.id}`}
                className="w-full text-left p-3.5 flex items-start gap-3 outline-none cursor-pointer"
              >
                <div className="p-1.5 rounded-md bg-slate-50 text-slate-400 mt-0.5 border border-slate-100">
                  <Lock className="w-3.5 h-3.5" />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[9px] font-bold text-slate-400 tracking-wider">
                      {item.categoria}
                    </span>
                    {getStatusBadge(item.status)}
                  </div>
                  
                  <h3 className="text-xs font-bold text-slate-700 mt-1 flex items-center gap-1">
                    {item.nome}
                  </h3>
                  
                  {isExpanded && (
                    <p className="text-xs text-slate-500 leading-relaxed mt-2 p-3 bg-indigo-50/40 border border-indigo-100/50 rounded-lg">
                      {item.descricao}
                      <span className="block mt-2 pt-2 border-t border-indigo-100/30 text-[10px] text-indigo-600 font-semibold flex items-center gap-1">
                        <Check className="w-3 h-3" /> Configuração via painel de chaves ASAAS Sandbox
                      </span>
                    </p>
                  )}
                </div>

                <div className="text-slate-400 p-1">
                  {isExpanded ? (
                    <ChevronDown className="w-4 h-4" />
                  ) : (
                    <ChevronRight className="w-4 h-4" />
                  )}
                </div>
              </button>
            </div>
          );
        })}
      </div>

      <div className="p-3 bg-slate-50/50 border-t border-slate-100 text-center">
        <p className="text-[10px] text-slate-400 flex items-center justify-center gap-1">
          <CheckCircle2 className="w-3.5 h-3.5 text-indigo-500" />
          Projetado de acordo com as especificações de mock Sandbox.
        </p>
      </div>
    </div>
  );
}
