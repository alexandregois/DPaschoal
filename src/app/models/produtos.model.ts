import { FormControl } from '@angular/forms';
export interface Produto {
  product: product;
  technicalInformation: technicalInformation;
  specification: specification[];
  application: application[];
  restriction: restriction[];
  equivalent: equivalent[];
  image: image[];
  video: null;
  shortApplication: string;
}
export interface product {
  id: number;
  code: string;
  sapCode: string;
  description: string;
  manufacturerId: number;
  manufacturer: string;
  dpa: boolean;
  dpk: boolean;
  hasEquivalent: boolean;
  display: null;
  totalRecords: number;
  groupId: number;
  group: string;
  subGroupId: number;
  subGroup: string;
}
export interface technicalInformation {
  productId: number;
  code: string;
  sapCode: string;
  description: string;
  manufacturerId: number;
  manufacturer: string;
  productWeight: number; //1.190,
  totalWeight: number; //1.190,
  measurementUnitId: number;
  measurementUnit: string;
  availableConsult: boolean;
  dpa: boolean;
  dpk: boolean;
  pendenteCatalogo: boolean;
  aplicacaoUniversal: boolean;
  dataAlteracao: Date; //"2022-06-14T13:21:37.91+00:00"
  ncmCode: string;
  eanCode: string;
  width: number;
  height: number;
  length: number;
  oldManufacturerId: null;
}
export interface specification {
  id: number;
  name: string;
  description: string;
  updateDate: string; //"2016-01-05T15:38:52.24+00:00",
  active: boolean;
  group: null;
  product: null;
  productId: number;
  featureId: number;
}
export interface application {
  application: string;
  startDate: string; //"1973-01-01T00:00:00+00:00",
  endDate: string; //"1982-12-31T00:00:00+00:00",
  image: null;
  updateDate: string; //"2022-08-31T12:49:52.9681014+00:00",
  active: boolean;
}
export interface restriction {
  vehicle: string;
  restriction: string;
}
export interface equivalent {
  productId: number;
  description: string;
}
export interface image {
  thumbnailImage: string;
  largeImage: string;
  name: null;
  updateDate: string;
  active: boolean;
}

export interface Imagem {
  codigo: number;
  descricao: string;
  src: string;
}

export interface ProdutoResumido {
  imagem: Imagem;
  tag: string;
  favorito: boolean;
  codigo: number;
  nome: string;
  fabricante: string;
  codigoFabrica: string;
  distribuidora: string;
  codigoDistribuidora: number;
  deposito: string;
  valor: number;
  valorTotal: number;
  quantidade: number;
  prazo: string;
  estoque: number;
}

export interface Inconsistencia {
  codigoTipo: number;
  descricao: FormControl;
}
