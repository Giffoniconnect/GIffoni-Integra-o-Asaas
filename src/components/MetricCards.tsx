import React from 'react';
import { CardDemonstrativo } from '../types';
import { CARDS_DEMONSTRATIVOS } from '../data';
import { FileText, Link as LinkIcon, QrCode, RefreshCw, Users, TrendingUp } from 'lucide-react';

interface MetricCardsProps {
  activeTypeFilter: string | null;
  activeStatusFilter: string | null;
  onSelectFilter: (type: string | null, status: string | null) => void;
  totalCobrancasCount: number;
  totalPagasSum: number;
}

export default function MetricCards({
  activeTypeFilter,
  activeStatusFilter,
  onSelectFilter,
  totalCobrancasCount,
  totalPagasSum
}: MetricCardsProps) {
  
  // Dynamically map icon based on card id
  const getIcon = (id: string) => {
    switch (id) {
      case 'boletos':
        return <FileText className="w-5 h-5 text-purple-600" />;
      case 'links':
        return <LinkIcon className="w-5 h-5 text-indigo-600" />;
      case 'pix':
        return <QrCode className="w-5 h-5 text-emerald-600" />;
      case 'recorrentes':
        return <RefreshCw className="w-5 h-5 text-violet-600 animate-spin-slow" />;
      case 'clientes':
        return <Users className="w-5 h-5 text-blue-600" />;
      case 'recebimentos':
        default:
        return <TrendingUp className="w-5 h-5 text-teal-600" />;
    }
  };

  // Compute dynamic counters/sums based on current list state
  const getCardValue = (card: CardDemonstrativo) => {
    if (card.id === 'clientes') {
      return `${totalCobrancasCount} Clientes`;
    }
    if (card.id === 'recebimentos') {
      return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalPagasSum);
    }
    return card.valor;
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3">
      {CARDS_DEMONSTRATIVOS.map((card) => {
        // Evaluate active state
        let isActive = false;
        if (card.id === 'boletos' && activeTypeFilter === 'BOLETO') isActive = true;
        if (card.id === 'links' && activeTypeFilter === 'CREDIT_CARD') isActive = true;
        if (card.id === 'pix' && activeTypeFilter === 'PIX') isActive = true;
        if (card.id === 'recorrentes' && activeTypeFilter === 'RECORRENTE') isActive = true;
        if (card.id === 'recebimentos' && activeStatusFilter === 'PAGO') isActive = true;

        const handleClick = () => {
          if (card.id === 'boletos') {
            onSelectFilter(activeTypeFilter === 'BOLETO' ? null : 'BOLETO', null);
          } else if (card.id === 'links') {
            onSelectFilter(activeTypeFilter === 'CREDIT_CARD' ? null : 'CREDIT_CARD', null);
          } else if (card.id === 'pix') {
            onSelectFilter(activeTypeFilter === 'PIX' ? null : 'PIX', null);
          } else if (card.id === 'recorrentes') {
            onSelectFilter(activeTypeFilter === 'RECORRENTE' ? null : 'RECORRENTE', null);
          } else if (card.id === 'recebimentos') {
            onSelectFilter(null, activeStatusFilter === 'PAGO' ? null : 'PAGO');
          } else {
            onSelectFilter(null, null);
          }
        };

        return (
          <button
            key={card.id}
            onClick={handleClick}
            id={`metric-btn-${card.id}`}
            className={`flex flex-col justify-between text-left p-3.5 rounded-xl border bg-white transition-all duration-200 outline-none group cursor-pointer ${
              isActive
                ? 'border-indigo-600 ring-1 ring-indigo-600 shadow-xs'
                : 'border-slate-200 hover:border-indigo-300 hover:shadow-xs'
            }`}
          >
            <div className="flex items-center justify-between w-full mb-2">
              <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                {card.titulo.split(' ')[0]} {/* Simple display */}
              </p>
              <span className={`p-1 rounded-md bg-slate-50 text-slate-400 group-hover:text-indigo-600 transition-colors`}>
                {getIcon(card.id)}
              </span>
            </div>
            
            <div className="mt-1">
              <h3 className="text-xl font-bold tracking-tight text-slate-800 font-sans">
                {getCardValue(card)}
              </h3>
              <p className="text-[10px] text-slate-400 mt-1 truncate">
                {card.badge}
              </p>
            </div>
          </button>
        );
      })}
    </div>
  );
}
