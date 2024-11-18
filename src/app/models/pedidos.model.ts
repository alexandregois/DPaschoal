export interface Pedido {
  codigo: string | undefined;
  numero: string | undefined | null;
  data: string | undefined;
  qtdItens: number | undefined;
  deposito: string | undefined | null;
  idDeposito: number | undefined;
  estado: Estado;
  valor: number | undefined;
  pagamento: string | undefined | null;
  endereco: Endereco;
  transporte: Transporte;
  planoPagamento: PlanoPagamento;
  notaFiscal: string | undefined | null;
  itens: Item[];
}

export interface Estado {
  codigo: number | undefined;
  descricao: string | null | undefined;
}

export interface Endereco {
  empresa: string | undefined | null;
  cnpj: string | undefined | null;
  logradouro: string | undefined | null;
  cep: string | undefined | null;
  complemento: string | undefined | null;
  cidade: string | undefined | null;
  estado: string | undefined | null;
  destinatario: string | undefined | null;
}

export interface Transporte {
  deposito: string | undefined | null;
  empresa: string | undefined | null;
  prazo: string | undefined | null;
  valor: number | undefined | null;
}

export interface PlanoPagamento {
  codigo: string | undefined | null;
  descricao: string | undefined | null;
  tipo: number | undefined;
  paymentId: number | undefined;
  codigoPagamento: string | undefined | null;
}

export interface Item {
  codigo: string | undefined | null;
  imagem: string | undefined | null;
  titulo: string | undefined | null;
  fabricante: string | undefined | null;
  codigoFabrica: string | undefined | null;
  distribuidora: string | undefined | null;
  codigoDistribuidora: string | undefined | null;
  quantidade: number | undefined | null;
  valor: number | undefined | null;
  imposto: number | undefined | null;
  despesas: number | undefined | null;
  posicao: number | undefined;
  idProduto: number | undefined;
  retailerIdProduto: number | undefined;
}

export interface Avaliacao {
  codigoPedido: number;
  nota: number;
  comentario: string;
}
