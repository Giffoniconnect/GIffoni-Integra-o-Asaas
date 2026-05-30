import React, { useState, useEffect } from 'react';
import { Cobranca, FormaPagamento } from '../types';
import { formatCurrency, formatDoc, formatPhone } from '../data';
import { 
  FileText, Link2, Copy, Trash2, Check, QrCode, 
  CreditCard, Calendar, User, Mail, DollarSign, 
  Briefcase, MessageSquare, AlertCircle, ShoppingCart 
} from 'lucide-react';

interface CobrancaFormAndPreviewProps {
  onAddCobranca: (cobranca: Cobranca) => void;
  onShowToast: (message: string, type: 'success' | 'info' | 'error') => void;
}

const DEFAULT_FORM = {
  cliente: '',
  documento: '',
  email: '',
  whatsapp: '',
  descricao: '',
  valor: '',
  vencimento: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 7 days from now
  formaPagamento: 'BOLETO' as FormaPagamento
};

export default function CobrancaFormAndPreview({
  onAddCobranca,
  onShowToast
}: CobrancaFormAndPreviewProps) {
  const [form, setForm] = useState(DEFAULT_FORM);
  const [isCopied, setIsCopied] = useState(false);
  const [isGenerating, setIsGenerating] = useState<string | null>(null);

  // Sync state changes with local input typing
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    // Auto formatting for CNPJ/CPF, WhatsApp and Currency where applicable
    if (name === 'documento') {
      const numbersOnly = value.replace(/\D/g, '');
      const capped = numbersOnly.slice(0, 14); // Limit to CNPJ length
      setForm(prev => ({ ...prev, [name]: capped }));
    } else if (name === 'whatsapp') {
      const numbersOnly = value.replace(/\D/g, '');
      const capped = numbersOnly.slice(0, 11); // Limit to 11 chars
      setForm(prev => ({ ...prev, [name]: capped }));
    } else {
      setForm(prev => ({ ...prev, [name]: value }));
    }
  };

  // Set default mockup client data for easy testing when fields are empty
  const getPreviewData = () => {
    return {
      cliente: form.cliente.trim() || 'Cliente Demonstrativo Ltda',
      documento: form.documento ? formatDoc(form.documento) : '00.000.000/0001-00',
      email: form.email.trim() || 'financeiro@cliente.com.br',
      whatsapp: form.whatsapp ? formatPhone(form.whatsapp) : '(11) 99999-9999',
      descricao: form.descricao.trim() || 'Serviços de consultoria digital Connect e setup de integradora.',
      valor: parseFloat(form.valor) || 350.00,
      vencimento: form.vencimento || '2026-06-30',
      formaPagamento: form.formaPagamento
    };
  };

  const preview = getPreviewData();

  // Reset form data
  const handleClear = () => {
    setForm({
      ...DEFAULT_FORM,
      vencimento: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    });
    onShowToast('Campos do formulário limpos.', 'info');
  };

  const handleSimulateGeneration = (type: 'BOLETO' | 'LINK') => {
    if (!form.cliente) {
      onShowToast('Por favor, informe o nome do cliente para simulação.', 'error');
      return;
    }
    if (!form.valor || parseFloat(form.valor) <= 0) {
      onShowToast('Por favor, informe um valor de cobrança válido.', 'error');
      return;
    }

    setIsGenerating(type);

    setTimeout(() => {
      // Create new Simulated payment
      const newCobranca: Cobranca = {
        id: `ASAAS_${Math.floor(100000 + Math.random() * 900000)}`,
        cliente: preview.cliente,
        documento: preview.documento,
        email: preview.email,
        whatsapp: preview.whatsapp,
        descricao: preview.descricao,
        valor: preview.valor,
        vencimento: preview.vencimento,
        formaPagamento: form.formaPagamento,
        status: 'PENDENTE',
        dataCriacao: new Date().toISOString().split('T')[0]
      };

      onAddCobranca(newCobranca);
      setIsGenerating(null);

      if (type === 'BOLETO') {
        onShowToast(`Boleto ASAAS gerado com sucesso (Simulado)! Código: ${newCobranca.id}`, 'success');
      } else {
        onShowToast(`Link de pagamento ASAAS ativo com sucesso (Simulado)!`, 'success');
      }
    }, 900);
  };

  // Simulate link copy
  const handleCopyLink = () => {
    setIsCopied(true);
    const mockUrl = `https://sandbox.asaas.com/pay/connect/${Math.floor(100000 + Math.random() * 900000)}`;
    navigator.clipboard.writeText(mockUrl).catch(() => {});
    onShowToast('Link de pagamento (simulado/sandbox) copiado para a área de transferência!', 'success');
    
    setTimeout(() => {
      setIsCopied(false);
    }, 2000);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
      {/* Principal Form UI Card (NOVA COBRANÇA) */}
      <div className="lg:col-span-7 bg-white rounded-xl border border-slate-200 shadow-xs p-5 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-5 border-b border-slate-100 pb-3">
            <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <span className="w-2 h-6 bg-indigo-600 rounded-full"></span>
              NOVA COBRANÇA
            </h2>
            <span className="text-[10px] text-slate-400 bg-slate-100 px-2 py-1 rounded font-mono font-bold">
              ASAAS Sandbox
            </span>
          </div>

          <div className="space-y-4">
            {/* Cliente e CPF/CNPJ Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1 flex items-center gap-1">
                  <User className="w-3 h-3 text-slate-400" />
                  Nome do Cliente <span className="text-indigo-600 font-bold">*</span>
                </label>
                <input
                  type="text"
                  name="cliente"
                  value={form.cliente}
                  onChange={handleInputChange}
                  placeholder="Ex: João Silva Sauro"
                  className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-md text-slate-800 transition-all focus:outline-none focus:border-indigo-400 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1 flex items-center gap-1">
                  <FileText className="w-3 h-3 text-slate-400" />
                  CPF / CNPJ
                </label>
                <input
                  type="text"
                  name="documento"
                  value={form.documento}
                  onChange={handleInputChange}
                  placeholder="000.000.000-00"
                  className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-md text-slate-800 transition-all focus:outline-none focus:border-indigo-400 focus:bg-white font-mono"
                />
              </div>
            </div>

            {/* E-mail e WhatsApp Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1 flex items-center gap-1">
                  <Mail className="w-3 h-3 text-slate-400" />
                  E-mail
                </label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleInputChange}
                  placeholder="contato@email.com"
                  className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-md text-slate-800 transition-all focus:outline-none focus:border-indigo-400 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1 flex items-center gap-1">
                  <MessageSquare className="w-3 h-3 text-slate-400" />
                  WhatsApp
                </label>
                <input
                  type="text"
                  name="whatsapp"
                  value={form.whatsapp}
                  onChange={handleInputChange}
                  placeholder="(00) 00000-0000"
                  className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-md text-slate-800 transition-all focus:outline-none focus:border-indigo-400 focus:bg-white font-mono"
                />
              </div>
            </div>

            {/* Descrição */}
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1 flex items-center gap-1">
                <Briefcase className="w-3 h-3 text-slate-400" />
                Descrição da cobrança
              </label>
              <textarea
                name="descricao"
                value={form.descricao}
                onChange={handleInputChange}
                rows={2}
                placeholder="Serviço de manutenção mensal..."
                className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-md text-slate-800 transition-all focus:outline-none focus:border-indigo-400 focus:bg-white resize-none"
              ></textarea>
            </div>

            {/* Valor, Vencimento e Forma de Pagamento */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1 flex items-center gap-1">
                  <DollarSign className="w-3 h-3 text-slate-400" />
                  Valor (R$) <span className="text-indigo-600 font-bold">*</span>
                </label>
                <input
                  type="number"
                  step="0.01"
                  name="valor"
                  value={form.valor}
                  onChange={handleInputChange}
                  placeholder="0,00"
                  className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-md text-slate-800 transition-all focus:outline-none focus:border-indigo-400 focus:bg-white font-mono font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1 flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-slate-400" />
                  Vencimento <span className="text-indigo-600 font-bold">*</span>
                </label>
                <input
                  type="date"
                  name="vencimento"
                  value={form.vencimento}
                  onChange={handleInputChange}
                  className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-md text-slate-800 transition-all focus:outline-none focus:border-indigo-400 focus:bg-white font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1 flex items-center gap-1">
                  <CreditCard className="w-3 h-3 text-slate-400" />
                  Forma de Pagamento
                </label>
                <select
                  name="formaPagamento"
                  value={form.formaPagamento}
                  onChange={handleInputChange}
                  className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-md text-slate-800 transition-all focus:outline-none focus:border-indigo-400 focus:bg-white font-semibold"
                >
                  <option value="BOLETO">Boleto Bancário</option>
                  <option value="PIX">Pix Dinâmico</option>
                  <option value="CREDIT_CARD">Cartão de Crédito</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Action button Grid - styling based on Clean Minimalism design */}
        <div className="flex flex-wrap lg:flex-nowrap gap-2 mt-6 pt-4 border-t border-slate-100">
          <button
            type="button"
            onClick={() => handleSimulateGeneration('BOLETO')}
            disabled={isGenerating !== null}
            id="btn-simulate-boleto"
            className="flex-1 bg-indigo-600 text-white py-2.5 px-3 rounded-lg text-xs font-bold hover:bg-indigo-700 transition-all shadow-xs disabled:opacity-50 cursor-pointer flex items-center justify-center gap-1.5"
          >
            {isGenerating === 'BOLETO' ? (
              <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
            ) : (
              <FileText className="w-3.5 h-3.5" />
            )}
            GERAR BOLETO
          </button>
          
          <button
            type="button"
            onClick={() => handleSimulateGeneration('LINK')}
            disabled={isGenerating !== null}
            id="btn-simulate-link"
            className="flex-1 bg-indigo-500 text-white py-2.5 px-3 rounded-lg text-xs font-bold hover:bg-indigo-600 transition-all shadow-xs disabled:opacity-50 cursor-pointer flex items-center justify-center gap-1.5"
          >
            {isGenerating === 'LINK' ? (
              <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
            ) : (
              <Link2 className="w-3.5 h-3.5" />
            )}
            LINK DE PAGAMENTO
          </button>

          <button
            type="button"
            onClick={handleCopyLink}
            id="btn-simulate-copy"
            className="px-4 border border-slate-300 text-slate-600 py-2.5 rounded-lg text-xs font-bold hover:bg-slate-50 transition-colors cursor-pointer flex items-center justify-center gap-1"
          >
            {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
            COPIAR LINK
          </button>

          <button
            type="button"
            onClick={handleClear}
            id="btn-simulate-clear"
            className="px-4 border border-red-100 text-red-500 py-2.5 rounded-lg text-xs font-bold hover:bg-red-50 transition-colors cursor-pointer flex items-center justify-center gap-1"
          >
            <Trash2 className="w-3.5 h-3.5" />
            LIMPAR
          </button>
        </div>
      </div>

      {/* Clean Minimalism Digital Premium Ticket Preview Card (Prévia da cobrança) */}
      <div className="lg:col-span-5 bg-indigo-900 rounded-xl p-5 text-white shadow-xl relative overflow-hidden flex flex-col justify-between min-h-[460px]">
        
        {/* Ticket Circle accents */}
        <div className="absolute -left-3 top-28 w-6 h-6 rounded-full bg-slate-50 opacity-10"></div>
        <div className="absolute -right-3 top-28 w-6 h-6 rounded-full bg-slate-50 opacity-10"></div>

        <div>
          {/* Header */}
          <div className="flex items-center justify-between border-b border-indigo-800 pb-3 mb-4">
            <h3 className="text-xs uppercase font-bold tracking-widest text-indigo-300 italic">
              Prévia da Cobrança
            </h3>
            <span className="bg-indigo-500/30 px-2.5 py-0.5 rounded text-[10px] uppercase font-semibold text-indigo-200">
              Rascunho
            </span>
          </div>

          <div className="text-indigo-200 text-xs mt-1">
            Beneficiário: <strong className="text-indigo-100">Giffoni Connect</strong>
          </div>

          {/* Main Info */}
          <div className="my-5 border-t border-indigo-800 pt-4">
            <p className="text-3xl font-light mb-1 mt-2 tracking-tight">
              {formatCurrency(preview.valor)}
            </p>
            <p className="text-[10px] text-indigo-300 uppercase tracking-wider font-semibold">
              VALOR DA TRANSAÇÃO
            </p>
          </div>

          {/* Segment Details */}
          <div className="mt-4 space-y-3.5 text-xs text-indigo-200">
            <div className="flex justify-between items-start">
              <span className="opacity-60">Cliente/Pagador:</span>
              <span className="font-semibold text-indigo-50 text-right max-w-[200px] truncate">
                {form.cliente ? preview.cliente : 'Aguardando dados...'}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="opacity-60">CPF / CNPJ:</span>
              <span className="font-mono font-semibold text-indigo-150">{preview.documento}</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="opacity-60">Meio Recebimento:</span>
              <span className="font-semibold text-indigo-50 capitalize">
                {preview.formaPagamento === 'BOLETO' && 'Boleto Bancário'}
                {preview.formaPagamento === 'PIX' && 'Pix Dinâmico'}
                {preview.formaPagamento === 'CREDIT_CARD' && 'Cartão de Crédito'}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="opacity-60">Vencimento:</span>
              <span className="font-semibold text-indigo-100">
                {form.cliente ? preview.vencimento.split('-').reverse().join('/') : '--/--/----'}
              </span>
            </div>

            {preview.descricao && form.descricao && (
              <div className="pt-2.5 border-t border-indigo-800/80 mt-1">
                <span className="text-[10px] uppercase tracking-wider font-bold text-indigo-300">Mensagem da fatura</span>
                <p className="text-[11px] text-indigo-100 leading-relaxed italic bg-indigo-950/30 p-2.5 rounded border border-indigo-800/40 mt-1">
                  “ {preview.descricao} ”
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Dynamic Interactive Render Component inside Deep Blue frame */}
        <div className="mt-6 pt-4 border-t border-indigo-800">
          {preview.formaPagamento === 'BOLETO' && (
            <div className="flex flex-col items-center justify-center p-2.5 rounded-lg bg-indigo-950/40 border border-indigo-800/50">
              <div className="flex items-center justify-center w-full gap-[2px] h-8 opacity-80">
                {Array.from({ length: 22 }).map((_, i) => (
                  <div key={i} className={`h-full bg-indigo-200 ${(i%3===0) ? 'w-[3px]' : (i%4===0) ? 'w-[4px]' : 'w-[1.5px]'}`}></div>
                ))}
              </div>
              <span className="text-[9px] font-mono text-indigo-300 mt-2 tracking-wide truncate max-w-full">
                34191.79001 01043.513184 91020.150008 7 97430000035000
              </span>
            </div>
          )}

          {preview.formaPagamento === 'PIX' && (
            <div className="flex flex-col items-center justify-center p-2 rounded-lg bg-indigo-950/30">
              <div className="flex items-center gap-2 text-[10px] text-indigo-200 font-semibold">
                <QrCode className="w-4 h-4 text-emerald-400" />
                Pix ativado para cópia instantânea
              </div>
            </div>
          )}

          {preview.formaPagamento === 'CREDIT_CARD' && (
            <div className="flex flex-col items-stretch p-2.5 rounded-lg bg-gradient-to-tr from-indigo-950 to-indigo-900 border border-indigo-800 text-left">
              <div className="flex justify-between items-center">
                <span className="text-[9px] font-bold text-indigo-300 tracking-wider">CONNECT VIRTUAL</span>
                <span className="w-5 h-4 bg-amber-400/80 rounded"></span>
              </div>
              <span className="text-xs font-mono font-bold tracking-widest text-indigo-100 mt-1.5 shrink-0 block">
                ••••  ••••  ••••  8904
              </span>
            </div>
          )}

          <div className="mt-4 text-[10px] text-indigo-400 text-center uppercase tracking-widest">
            Simulação Visual ASAAS
          </div>
        </div>

        {/* Interactive glow ambient effect */}
        <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-indigo-700 rounded-full opacity-20 pointer-events-none"></div>
      </div>
    </div>
  );
}
