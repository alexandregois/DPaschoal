export interface Customer {
  etClientes: Array<{
    document: number;
    flag: string;
    id: number;
    name: string;
  }>;
}
export interface Garantia {
  id: string;
  fileName: string | null;
  idStatus: string;
  idStep: string;
  idWarehouse: string;
  number: string;
  requestDate: string;
  statusDescription: string;
  stepDescription: string;
  approvedValue: number;
  warrantyItemNavigation: Array<GarantiaProduto>;
  warrantyStatusProgressNavigation: [] | null;
  warrantyWarehouse: GarantiaDeposito;
  hideProtocolo: boolean;
}

export interface GarantiaProduto {
  id: string;
  idWarrantyNavigation: null;
  product: ProdutoBusca;
  productCode: string;
  quantity: number;
  warrantyRequiredDocumentNavigation: [] | null;
}

export interface GarantiaDeposito {
  address: string;
  createdDate: string;
  id: string;
  name: string;
  sapCode: string;
  warrantys: [];
}

export interface Invoice {
  correlationId?: string;
  garantia?: string | null;
  numNfe?: string | null;
  series?: string | null;
}

export interface Espelho {
  clientSapCode: string;
  document: string;
  id: string;
  invoiceDate: string;
  invoiceNumber: string;
  invoiceQuantity: number;
  invoiceUnitPrice: number;
  items: Array<NotaEspelho>;
  origin: string;
  warrantyId: string;
  liquidValue: number;
}

export interface NotaEspelho {
  basicUnitMeasurement: string;
  cfopCode: string;
  controlCode: string;
  customerAccountGroup: string;
  document: string;
  icmsBase: number;
  icmsRate: number;
  icmsTax: number;
  icmsTaxSituation: number;
  icmsType: string;
  id: string;
  idWarrantyInvoice: string;
  ipiBase: number;
  ipiRate: number;
  ipiTax: number;
  ipiTaxType: string;
  liquidValue: number;
  numMaterial: string;
  quantity: string;
  referenceInvoice: string;
  sourceMaterial: number;
  unityValue: number;
}

export interface CentrosDistribuicao {
  etCentro: Array<CentroDistribuicao>;
}

export interface CentroDistribuicao {
  id: number;
  cdName?: string;
  document?: number;
  local?: string;
  neighborhood?: string;
  streetAndNumber?: string;
  zipCode?: string;
}

export interface ProdutoBusca {
  categoria: null;
  codigo: string;
  codigoDpk: number;
  codigoSap: string;
  descontoPolitica: number;
  descricao: string;
  distribuidorId: string;
  distribuidores: [];
  distribuidoresEncomenda: [];
  dpa: boolean;
  dpk: boolean;
  estoque: number;
  estoqueExcelencia: number;
  estoqueOutrosDepositos: boolean;
  exclusividadeEquipeVendas: boolean;
  fabricante: string;
  fabricanteId: number;
  grupoProduto: number;
  icms: number;
  id: number;
  imagem: null;
  minimoParaCompra: number;
  nomeGrupoProduto: null;
  possuiOutroDistribuidor: boolean;
  possuiSimilar: boolean;
  precoDpk: number;
  precoVenda: number;
  produtoEmPromocao: boolean;
  status: number;
  quantidadeSelecionada?: number;
}

export interface GarantiaOrigin {
  correlationId: string;
  document: string;
  origin: string;
  itItens: Array<{
    sapMaterialCode: string;
    sourceInvoiceNumber: string;
    itemQuantity: string;
  }>;
}

export interface RetornoGarantiaOrigin {
  etItemResponseList: Array<GarantiaCreatNotaCompraProduto>;
  itHeaderReponse: Array<{
    clientSapCode: number;
    document: number;
    origin: number;
  }>;
  etReturn?: StatusRetornoGarantiaOrigin;
}

export interface StatusRetornoGarantiaOrigin {
  id: string;
  message: string;
  number: string;
  qtdNum: string;
  type: string;
}

export interface ProdutoNota {
  produto: ProdutoBusca;
  notas: Array<GarantiaCreatNotaCompraProduto>;
}

export interface GarantiaCreat {
  token?: string | null;
  correlationId?: string;
  sapCustomerCode?: string | null;
  sapCenter?: string | null;
  emissionDate?: string | null;
  itItens?: Array<GarantiaCreatItem> | null;
  warrantyWarehouse?: GarantiaCreatEnderecoCD;
  warrantyInvoice?: Array<GarantiaCreatNotaCompraProduto> | null;
}

export interface GarantiaCreatItem {
  sapMaterialCode?: string | null;
  itemNumber?: number;
  sourceInvoiceNumber?: string | null;
  sourceInvoiceSeries?: string | null;
  itemQuantity?: string | null;
  itemUnitPrice?: string | null;
  invoiceOrigin?: string | null;
}

export interface GarantiaCreatEnderecoCD {
  name?: string | null;
  sapCode?: string | null;
  address?: string | null;
}

export interface GarantiaCreatNotaCompraProduto {
  document?: string | null;
  origin?: string | null;
  clientSapCode?: string | null;
  invoiceNumber?: string | null;
  invoiceDate?: string;
  invoiceQuantity?: number;
  invoiceUnitPrice?: number;
  numMaterial?: string | null;
  quantity?: string | null;
  referenceInvoice?: string | null;
  docDataNf?: string | null;
  unityValue?: number;
  customerAccountGroup?: string | null;
  controlCode?: string | null;
  sourceMaterial?: number;
  icmsTaxSituation?: number;
  basicUnitMeasurement?: string | null;
  cfopCode?: string | null;
  liquidValue?: number;
  icmsType?: string | null;
  icmsBase?: number;
  icmsRate?: number;
  icmsTax?: number;
  ipiTaxType?: string | null;
  ipiBase?: number;
  ipiRate?: number;
  ipiTax?: number;
}

export interface ProdutoDocument {
  cdId: string;
  material: Array<string>;
}

export interface RetornoProdutoDocument {
  documents: Array<{
    count: string;
    idNr: string;
    text: string;
  }>;
  documentsJson: {
    valueKind: number;
  };
  material: string;
  product?: ProdutoBusca;
}

export interface StatusGarantia {
  correlationId?: string;
  garantia?: string | null;
  status?: string | null;
}
