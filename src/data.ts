import { Cobranca, CardDemonstrativo, IntegracaoFutura } from './types';

export const INITIAL_COBRANCAS: Cobranca[] = [
  {
    id: 'ASAAS_849204',
    cliente: 'Giffoni Advocacia Integrada',
    documento: '45.892.302/0001-99',
    email: 'financeiro@giffoniadv.com',
    whatsapp: '(11) 98765-4321',
    descricao: 'Consultoria Mensal - Giffoni Connect ERP',
    valor: 2450.00,
    vencimento: '2026-06-10',
    formaPagamento: 'BOLETO',
    status: 'PENDENTE',
    dataCriacao: '2026-05-28'
  },
  {
    id: 'ASAAS_849203',
    cliente: 'Roberto Alencar Peixoto',
    documento: '123.456.789-00',
    email: 'roberto.peixoto@gmail.com',
    whatsapp: '(21) 99882-1100',
    descricao: 'Licença Comercial Anual - Plataforma SaaS Módulo Connect',
    valor: 4890.90,
    vencimento: '2026-05-29',
    formaPagamento: 'PIX',
    status: 'PAGO',
    dataCriacao: '2026-05-25'
  },
  {
    id: 'ASAAS_849202',
    cliente: 'Clínica Sorriso & Vida Ltda',
    documento: '08.232.144/0001-02',
    email: 'contato@clinicasorriso.com.br',
    whatsapp: '(31) 99122-3344',
    descricao: 'Setup e Migração de Banco de Dados de Agenda',
    valor: 1500.00,
    vencimento: '2026-05-20',
    formaPagamento: 'CREDIT_CARD',
    status: 'PAGO',
    dataCriacao: '2026-05-15'
  },
  {
    id: 'ASAAS_849201',
    cliente: 'Marina Costa e Silva',
    documento: '283.918.243-88',
    email: 'marina.silva@outlook.com',
    whatsapp: '(11) 97722-6868',
    descricao: 'Suporte Técnico Nível 3 - Desenvolvimento customizado',
    valor: 350.00,
    vencimento: '2026-05-18',
    formaPagamento: 'BOLETO',
    status: 'VENCIDO',
    dataCriacao: '2026-05-08'
  },
  {
    id: 'ASAAS_849200',
    cliente: 'TechStart Soluções Web',
    documento: '33.451.990/0001-44',
    email: 'direct@techstart.io',
    whatsapp: '(41) 98888-0022',
    descricao: 'Hospedagem Dedicada e Certificados SSL Conectividade',
    valor: 120.00,
    vencimento: '2026-06-05',
    formaPagamento: 'PIX',
    status: 'PENDENTE',
    dataCriacao: '2026-05-05'
  }
];

export const CARDS_DEMONSTRATIVOS: CardDemonstrativo[] = [
  {
    id: 'boletos',
    titulo: 'Boletos Bancários',
    valor: 'R$ 2.800,00',
    quantidade: 2,
    color: 'from-purple-500/20 to-purple-600/20 text-purple-700 border-purple-200',
    badge: 'Cobrança Registrada',
    tipo: 'BOLETO'
  },
  {
    id: 'links',
    titulo: 'Links de Pagamento',
    valor: 'R$ 1.500,00',
    quantidade: 1,
    color: 'from-violet-500/20 to-violet-600/20 text-violet-700 border-violet-200',
    badge: 'Checkout Rápido',
    tipo: 'CREDIT_CARD'
  },
  {
    id: 'pix',
    titulo: 'Pix Dinâmico',
    valor: 'R$ 5.010,90',
    quantidade: 2,
    color: 'from-emerald-500/20 to-emerald-600/20 text-emerald-700 border-emerald-200',
    badge: 'Confirmação na Hora',
    tipo: 'PIX'
  },
  {
    id: 'recorrentes',
    titulo: 'Cobranças Recorrentes',
    valor: 'R$ 2.450,00/mês',
    quantidade: 1,
    color: 'from-indigo-500/20 to-indigo-600/20 text-indigo-700 border-indigo-200',
    badge: 'Assinatura',
    tipo: 'RECORRENTE'
  },
  {
    id: 'clientes',
    titulo: 'Clientes Cadastrados',
    valor: '5 Clientes',
    quantidade: 5,
    color: 'from-blue-500/20 to-blue-600/20 text-blue-700 border-blue-200',
    badge: 'Base Ativa',
    tipo: 'CLIENTES'
  },
  {
    id: 'recebimentos',
    titulo: 'Recebimentos (Mês)',
    valor: 'R$ 6.390,90',
    quantidade: 3,
    color: 'from-teal-500/20 to-teal-600/20 text-teal-700 border-teal-200',
    badge: 'Liquidado asaas',
    tipo: 'RECEBIMENTOS'
  }
];

export const INTEGRACOES_FUTURAS: IntegracaoFutura[] = [
  {
    id: 'api',
    nome: 'Conexão API ASAAS',
    descricao: 'Sincronização instantânea com a API de produção da sua conta ASAAS para registros automáticos de cobranças.',
    status: 'breve',
    categoria: 'SISTEMA'
  },
  {
    id: 'webhook',
    nome: 'Webhook de Pagamento',
    descricao: 'Notificações em tempo real para dar baixa automática em faturas assim que liquidadas pelo cliente final.',
    status: 'analise',
    categoria: 'SISTEMA'
  },
  {
    id: 'pix_auto',
    nome: 'Pix Automático Recorrente',
    descricao: 'Débito autorizado via Pix para mensalidades do Giffoni ERP, otimizando o fluxo de caixa.',
    status: 'planejado',
    categoria: 'RECURSOS'
  },
  {
    id: 'whatsapp',
    nome: 'Envio por WhatsApp Automático',
    descricao: 'Disparo de PDFs e códigos de barra diretamente no WhatsApp do cliente com lembrete amigável na véspera do vencimento.',
    status: 'breve',
    categoria: 'NOTIFICAÇÃO'
  },
  {
    id: 'email',
    nome: 'Notificações por E-mail',
    descricao: 'Faturas em PDF personalizadas com logotipo da Giffoni Connect enviadas a cada novas emissões.',
    status: 'breve',
    categoria: 'NOTIFICAÇÃO'
  },
  {
    id: 'baixa',
    nome: 'Baixa Automática no Portal',
    descricao: 'Sem intervenção humana: pagamento no ASAAS atualiza o status de pendência nos logs principais automaticamente.',
    status: 'analise',
    categoria: 'SISTEMA'
  },
  {
    id: 'relatorios',
    nome: 'Relatórios Financeiros Avançados',
    descricao: 'Análise de inadimplência, projeção de caixa, gráficos de receita recorrente mensal (MRR) diretamente na Giffoni Connect.',
    status: 'planejado',
    categoria: 'CONCILIAÇÃO'
  }
];

// Utility string formatters
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
}

export function formatDoc(doc: string): string {
  const cleaned = doc.replace(/\D/g, '');
  if (cleaned.length <= 11) {
    // CPF
    return cleaned.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  } else {
    // CNPJ
    return cleaned.replace(/(\d{2})(\d{1,3})?(\d{1,3})?(\d{1,4})?(\d{1,2})?/, (_, p1, p2, p3, p4, p5) => {
      let res = p1;
      if (p2) res += '.' + p2;
      if (p3) res += '.' + p3;
      if (p4) res += '/' + p4;
      if (p5) res += '-' + p5;
      return res;
    });
  }
}

export function formatPhone(phone: string): string {
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.length === 11) {
    return cleaned.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
  } else if (cleaned.length === 10) {
    return cleaned.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
  }
  return phone;
}
