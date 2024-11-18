export interface Product {
  id: number;
  title: string;
  value: number;
  total: number;
  tags: string;
  regions: string[];
  favorite: boolean;
  manufacturer: string; // fabricante
  manufacturerCode: string; // codigo fabricante
  distributorCode: string; // codigo distribuidor
  deadline: number; // prazo
  inventory: number; // estoque
  statusProduct: StatusProduct;
  qtd: number;
}

export interface StatusProduct {
  id: string;
  description: string;
}
