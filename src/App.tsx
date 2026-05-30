import React, { useState } from 'react';
import { Cobranca, FormaPagamento } from './types';
import { INITIAL_COBRANCAS } from './data';
import MetricCards from './components/MetricCards';
import CobrancaFormAndPreview from './components/CobrancaFormAndPreview';
import FutureIntegrations from './components/FutureIntegrations';
import CobrancaHistoryTable from './components/CobrancaHistoryTable';
import NotificationToast, { ToastMessage } from './components/NotificationToast';
import { 
  Lock, Sparkles, ShieldCheck, Cpu, Terminal, 
  Layers, HelpCircle, ArrowUpRight, Github, Info
} from 'lucide-react';

export default function App() {
  const [cobrancas, setCobrancas] = useState<Cobranca[]>(INITIAL_COBRANCAS);
  const [activeTypeFilter, setActiveTypeFilter] = useState<string | null>(null);
  const [activeStatusFilter, setActiveStatusFilter] = useState<string | null>(null);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Trigger Toast Notification
  const handleShowToast = (message: string, type: 'success' | 'info' | 'error') => {
    const id = `toast-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const newToast: ToastMessage = { id, message, type };
    
    setToasts((prev) => [...prev, newToast]);

    // Auto dismiss after 4 seconds
    setTimeout(() => {
      handleRemoveToast(id);
    }, 4500);
  };

  const handleRemoveToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Add new invoice to state
  const handleAddCobranca = (newCobranca: Cobranca) => {
    setCobrancas((prev) => [newCobranca, ...prev]);
    handleShowToast(`Sucesso! Cobrança criada para ${newCobranca.cliente}.`, 'success');
  };

  // Update Status (e.g. Simulating a payment)
  const handleUpdateStatus = (id: string, newStatus: 'PENDENTE' | 'PAGO' | 'VENCIDO') => {
    setCobrancas((prev) =>
      prev.map((cob) => {
        if (cob.id === id) {
          handleShowToast(`Cobrança ${id} alterada para ${newStatus}!`, 'success');
          return { ...cob, status: newStatus };
        }
        return cob;
      })
    );
  };

  // Remove invoice
  const handleRemoveCobranca = (id: string) => {
    setCobrancas((prev) => prev.filter((cob) => cob.id !== id));
    handleShowToast(`Cobrança ${id} foi removida dos logs locais.`, 'info');
  };

  // Update active metric card filters
  const handleSelectFilter = (type: string | null, status: string | null) => {
    setActiveTypeFilter(type);
    setActiveStatusFilter(status);
    
    if (type) {
      handleShowToast(`Filtro rápido ativado para listar: ${type}`, 'info');
    } else if (status) {
      handleShowToast(`Filtro rápido ativado para listar status: ${status}`, 'info');
    } else {
      handleShowToast(`Filtros de cabeçalho limpos.`, 'info');
    }
  };

  const handleClearFilters = () => {
    setActiveTypeFilter(null);
    setActiveStatusFilter(null);
    handleShowToast(`Filtros rápidos limpos.`, 'info');
  };

  // Compute Metrics Sums dynamically from local state
  const totalCobrancasCount = Array.from(new Set(cobrancas.map(c => c.cliente))).length;
  const totalPagasSum = cobrancas
    .filter(c => c.status === 'PAGO')
    .reduce((sum, current) => sum + current.valor, 0);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 pb-16">
      
      {/* Upper Status Bar */}
      <div className="bg-slate-900 text-slate-300 text-xs py-2 px-4 flex flex-wrap items-center justify-between gap-2 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></span>
          <span className="font-mono text-[10px] tracking-wider text-indigo-200 uppercase font-bold">MODE: STANDALONE PROTOTYPE</span>
        </div>
        <div className="flex items-center gap-4 text-[11px]">
          <span className="flex items-center gap-1 text-slate-400">
            <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
            Sandbox Segura (Sem chaves reais no browser)
          </span>
          <span className="text-slate-500 hidden sm:inline">|</span>
          <span className="text-slate-400 hidden sm:inline">Conectividade: Desconectado de APIs</span>
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        
        {/* Layout App Header */}
        <header className="mb-6 border-b border-slate-200 pb-4">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-3">
            <div>
              <h1 className="text-2xl font-extrabold text-indigo-900 tracking-tight flex items-center flex-wrap">
                Giffoni Connect 
                <span className="font-normal text-indigo-300 mx-2">|</span> 
                <span className="text-indigo-600 font-bold">Integração ASAAS</span>
              </h1>
              <p className="text-slate-500 text-sm mt-1">
                Central futura para geração de boletos, links de pagamento e gestão de cobranças.
              </p>
            </div>
            
            <div className="flex gap-2">
              <span className="bg-indigo-100 text-indigo-700 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md self-start sm:self-center">
                Módulo Fundacional
              </span>
              <span className="bg-slate-100 text-slate-600 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md self-start sm:self-center">
                ASAAS Sandbox
              </span>
            </div>
          </div>
        </header>

        {/* 2. Top Statistic/Demonstrative Cards Grid */}
        <section className="mb-8 p-1">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                Demonstrativo de Indicadores
              </h2>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Clique nos cards para aplicar filtros de exibição rápida na tabela de histórico abaixo.
              </p>
            </div>
            
            {(activeTypeFilter || activeStatusFilter) && (
              <button
                onClick={handleClearFilters}
                className="text-xs font-bold text-purple-600 hover:text-purple-700 transition-colors bg-purple-50 hover:bg-purple-100 border border-purple-150 px-2.5 py-1 rounded-lg cursor-pointer"
              >
                Limpar Filtros Quick
              </button>
            )}
          </div>
          
          <MetricCards
            activeTypeFilter={activeTypeFilter}
            activeStatusFilter={activeStatusFilter}
            onSelectFilter={handleSelectFilter}
            totalCobrancasCount={totalCobrancasCount}
            totalPagasSum={totalPagasSum}
          />
        </section>

        {/* 3 & 4. Primary Form & Invoice Ticket Sheet Side-by-side Layout */}
        <section className="mb-8">
          <CobrancaFormAndPreview 
            onAddCobranca={handleAddCobranca}
            onShowToast={handleShowToast}
          />
        </section>

        {/* 5 & 6. Bottom Grid (Future Backlog locked layout + Dynamic Database Log Table) */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* List of Simulated Charges Logs */}
          <div className="lg:col-span-2">
            <CobrancaHistoryTable
              cobrancas={cobrancas}
              onUpdateStatus={handleUpdateStatus}
              onRemoveCobranca={handleRemoveCobranca}
              activeTypeFilter={activeTypeFilter}
              activeStatusFilter={activeStatusFilter}
              onClearFilters={handleClearFilters}
            />
          </div>

          {/* List of future integration locks backlog */}
          <div className="lg:col-span-1">
            <FutureIntegrations />
          </div>
        </section>

        {/* Dedicated Interactive Sandbox Notice/Alert Frame */}
        <section className="mt-8 p-5 bg-indigo-50/40 border border-indigo-100 rounded-2xl flex flex-col sm:flex-row items-start gap-4">
          <div className="p-2 rounded-xl bg-indigo-100/80 text-indigo-700 shrink-0">
            <Info className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-indigo-950">
              Diretrizes de Implementação da Central ASAAS da Giffoni Connect
            </h3>
            <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
              Este painel representa as especificações visuais de fidelidade para faturamento em Pix, boletos e cartão de crédito. Seguindo as regras do build, o fluxo é totalmente independente da estrutura principal do <strong>Portal BOSS</strong>. Uma vez pronto o backend de produção do ASAAS, os botões visuais acima dispararão requisições autenticadas para o endpoint <code className="bg-white/80 px-1 py-0.5 rounded font-mono border border-indigo-105">POST /v3/payments</code> passando a credencial e retornando os dados que preenchem este histórico.
            </p>
          </div>
        </section>

      </div>

      {/* Custom Dynamic Notifications Layer */}
      <NotificationToast toasts={toasts} onRemoveToast={handleRemoveToast} />

      {/* Styled minimalistic Footer */}
      <footer className="mt-16 text-center border-t border-slate-100 pt-8 text-[11px] text-slate-400 select-none">
        <p>© {new Date().getFullYear()} Giffoni Connect | Integração Integrada ASAAS Sandbox. Todos os direitos reservados.</p>
        <p className="mt-1 opacity-80">Criado com foco em desempenho, UI moderna e arquitetura fundacional limpa.</p>
      </footer>

    </div>
  );
}
