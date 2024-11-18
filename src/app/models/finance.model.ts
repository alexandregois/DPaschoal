export interface Finance {
  nota: string;
  titulo: string;
  parcela: string;
  emissao: string;
  vencimento: Date;
  parcelaValor: number;
  atualValor?: number | null;
  status?: string | null;
  xml: string;
  danfe: string;
  boleto?: string | null;
}
