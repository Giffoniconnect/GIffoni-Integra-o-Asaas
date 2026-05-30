export type FormaPagamento = 'BOLETO' | 'CREDIT_CARD' | 'PIX';

export interface Cobranca {
  id: string;
  cliente: string;
  documento: string;
  email: string;
  whatsapp: string;
  descricao: string;
  valor: number;
  vencimento: string;
  formaPagamento: FormaPagamento;
  status: 'PENDENTE' | 'PAGO' | 'VENCIDO' | 'CONTESTADO';
  dataCriacao: string;
}

export interface CardDemonstrativo {
  id: string;
  titulo: string;
  valor: string;
  quantidade: number;
  color: string;
  badge: string;
  tipo: string;
}

export interface IntegracaoFutura {
  id: string;
  nome: string;
  descricao: string;
  status: 'breve' | 'analise' | 'planejado';
  categoria: string;
}
