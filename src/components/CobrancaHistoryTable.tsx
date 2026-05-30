import React, { useState } from 'react';
import { Cobranca, FormaPagamento } from '../types';
import { formatCurrency, formatDoc } from '../data';
import { 
  Search, FileText, QrCode, CreditCard, CheckCircle2, 
  HelpCircle, AlertTriangle, ExternalLink, Trash2, 
  Check, RefreshCw, Filter, DollarSign 
} from 'lucide-react';

interface CobrancaHistoryTableProps {
  cobrancas: Cobranca[];
  onUpdateStatus: (id: string, newStatus: 'PENDENTE' | 'PAGO' | 'VENCIDO') => void;
  onRemoveCobranca: (id: string) => void;
  activeTypeFilter: string | null;
  activeStatusFilter: string | null;
  onClearFilters: () => void;
}

export default function CobrancaHistoryTable({
  cobrancas,
  onUpdateStatus,
  onRemoveCobranca,
  activeTypeFilter,
  activeStatusFilter,
  onClearFilters
}: CobrancaHistoryTableProps) {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'PENDENTE' | 'PAGO' | 'VENCIDO'>('ALL');

  // Format Status Badge
  const getStatusBadge = (status: 'PENDENTE' | 'PAGO' | 'VENCIDO' | 'CONTESTADO') => {
    switch (status) {
      case 'PAGO':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] uppercase font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
            Pago
          </span>
        );
      case 'VENCIDO':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] uppercase font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded">
            Vencido
          </span>
        );
      case 'PENDENTE':
      default:
        return (
          <span className="inline-flex items-center gap-1 text-[10px] uppercase font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded">
            Pendente
          </span>
        );
    }
  };

  // Get Payments format icon
  const getPaymentIcon = (tipo: FormaPagamento) => {
    switch (tipo) {
      case 'BOLETO':
        return <FileText className="w-3.5 h-3.5 text-indigo-600" />;
      case 'PIX':
        return <QrCode className="w-3.5 h-3.5 text-indigo-600" />;
      case 'CREDIT_CARD':
      default:
        return <CreditCard className="w-3.5 h-3.5 text-indigo-600" />;
    }
  };

  // Filtered List calculation
  const filteredCobrancas = cobrancas.filter((item) => {
    const matchesSearch = item.cliente.toLowerCase().includes(search.toLowerCase()) || 
                          item.documento.includes(search) || 
                          (item.descricao && item.descricao.toLowerCase().includes(search.toLowerCase())) ||
                          item.id.toLowerCase().includes(search.toLowerCase());

    const matchesStatus = statusFilter === 'ALL' || item.status === statusFilter;
    const matchesCardType = !activeTypeFilter || item.formaPagamento === activeTypeFilter;
    const matchesCardStatus = !activeStatusFilter || item.status === activeStatusFilter;

    return matchesSearch && matchesStatus && matchesCardType && matchesCardStatus;
  });

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
      
      {/* Filtering Header Area */}
      <div className="p-4 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-50/20">
        <div>
          <h2 className="text-sm font-bold text-slate-800 flex items-center gap-2">
            HISTÓRICO DE COBRANÇAS
          </h2>
          <p className="text-[11px] text-slate-400 mt-0.5">
            Logs de faturamento cadastrados na memória da sandbox
          </p>
        </div>

        {/* Filters and search box */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Active Card Quick Filter Banner */}
          {(activeTypeFilter || activeStatusFilter) && (
            <div className="flex items-center gap-1 text-xs bg-indigo-50 border border-indigo-100 text-indigo-700 px-2.5 py-1 rounded-md font-semibold">
              <Filter className="w-3 h-3" />
              {activeTypeFilter || `Status ${activeStatusFilter}`}
              <button 
                onClick={onClearFilters}
                className="hover:bg-indigo-200/50 p-0.5 rounded cursor-pointer leading-none text-indigo-900 text-xs font-bold ml-1"
                title="Limpar filtro"
              >
                ×
              </button>
            </div>
          )}

          {/* Search Input */}
          <div className="relative min-w-[180px]">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Pesquisar..."
              className="w-full text-xs pl-8 pr-3 py-1.5 rounded-md border border-slate-200 focus:outline-none focus:border-indigo-400 bg-white text-slate-800"
            />
          </div>

          {/* Status quick select */}
          <div className="flex border border-slate-200 rounded-md overflow-hidden bg-white">
            {(['ALL', 'PENDENTE', 'PAGO', 'VENCIDO'] as const).map((status) => (
              <button
                key={status}
                type="button"
                onClick={() => setStatusFilter(status)}
                className={`px-2.5 py-1.5 text-[11px] font-semibold transition-all cursor-pointer ${
                  statusFilter === status 
                    ? 'bg-indigo-600 text-white' 
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                {status === 'ALL' ? 'Todos' : status === 'PENDENTE' ? 'Pendentes' : status === 'PAGO' ? 'Pagos' : 'Vencidos'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Table responsive element */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/50 border-b border-slate-100 text-slate-450 text-[10px] font-bold tracking-wider select-none uppercase">
              <th className="p-3 pl-5">ID</th>
              <th className="p-3">CLIENTE / DOCUMENTO</th>
              <th className="p-3">MEIO</th>
              <th className="p-3">DESCRIÇÃO</th>
              <th className="p-3 text-right">VALOR</th>
              <th className="p-3">VENCIMENTO</th>
              <th className="p-3">STATUS</th>
              <th className="p-3 pr-5 text-center">AÇÕES</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs">
            {filteredCobrancas.length === 0 ? (
              <tr>
                <td colSpan={8} className="p-10 text-center text-slate-400 bg-slate-50/10">
                  <div className="flex flex-col items-center justify-center gap-1">
                    <HelpCircle className="w-6 h-6 text-slate-300" />
                    <p className="font-semibold text-xs">Nenhuma cobrança encontrada para os filtros aplicados.</p>
                  </div>
                </td>
              </tr>
            ) : (
              filteredCobrancas.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/20 transition-colors group">
                  {/* Transaction ID */}
                  <td className="p-3 pl-5 font-mono text-slate-400 text-[11px]">
                    {item.id}
                  </td>
                  
                  {/* Client Info */}
                  <td className="p-3">
                    <div className="font-semibold text-slate-700">{item.cliente}</div>
                    <div className="text-[10px] text-slate-400 font-mono mt-0.5">{item.documento}</div>
                  </td>
                  
                  {/* Payment Type */}
                  <td className="p-3">
                    <span className="inline-flex items-center gap-1 font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                      {getPaymentIcon(item.formaPagamento)}
                      <span className="text-[10px]">{item.formaPagamento}</span>
                    </span>
                  </td>
                  
                  {/* Description */}
                  <td className="p-3 max-w-[200px] truncate text-slate-500" title={item.descricao}>
                    {item.descricao || <span className="italic text-slate-300">Sem descrição</span>}
                  </td>
                  
                  {/* Value */}
                  <td className="p-3 text-right font-mono font-bold text-slate-800">
                    {formatCurrency(item.valor)}
                  </td>
                  
                  {/* Due Date */}
                  <td className="p-3 font-mono text-[11px] text-slate-500">
                    {item.vencimento.split('-').reverse().join('/')}
                  </td>
                  
                  {/* Status */}
                  <td className="p-3">
                    {getStatusBadge(item.status)}
                  </td>
                  
                  {/* Interactive actions */}
                  <td className="p-3 pr-5 text-center">
                    <div className="flex items-center justify-center gap-1.5 opacity-80 group-hover:opacity-100 transition-opacity">
                      {item.status !== 'PAGO' && (
                        <button
                          onClick={() => onUpdateStatus(item.id, 'PAGO')}
                          title="Faturar"
                          className="px-2 py-1 bg-emerald-50 border border-emerald-100 text-emerald-700 rounded text-[10px] font-bold hover:bg-emerald-100 transition-all cursor-pointer"
                        >
                          LIQUIDAR
                        </button>
                      )}
                      
                      <button
                        onClick={() => onRemoveCobranca(item.id)}
                        className="p-1 px-1.5 rounded hover:bg-red-50 border border-slate-100 hover:border-red-250 text-slate-400 hover:text-red-500 transition-all cursor-pointer"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Statistics info in bottom of table */}
      <div className="p-3 bg-slate-50/50 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between text-[10px] text-slate-400 font-medium">
        <span>Mostrando {filteredCobrancas.length} de {cobrancas.length} faturas</span>
        <span className="mt-1 sm:mt-0 flex items-center gap-1">
          <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full"></span>
          Simulação de conciliação financeira local ativada.
        </span>
      </div>
    </div>
  );
}
