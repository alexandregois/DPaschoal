import { CartDto, OrderItemDto } from '@generated/api/dpk-order-svc';
import { Warehouse } from '@models/deposito.model';

export interface ViewCDByProduct {
  data: {
    produtoId: number; // Código do produto (SuperK)
    produtoErpId: number; // Código do produto no SAP
  };
  callback?: Function; // Método executado após o processamento do evento
}

export interface NavigateToSimilarProducts {
  data: {
    produtoId: number; // Código do produto (SuperK)
    produtoDescription?: string; // Descrição do produto
  };
  callback?: Function; // Método executado após o processamento do evento
}

export interface AddProductToCart {
  data: {
    produtoId: number;
    produtoErpId: number;
    produtoQtd: number;
    depositoId?: number; // hubId
    code?: string | null;
    description?: string | null;
    manufacturer?: string | null;
  };
  callback?: Function; // Método executado após o processamento do evento
}

export interface AddCart {
  data: {
    cart: CartDto;
  };
  callback?: Function; // Método executado após o processamento do evento
}

export interface AddProductToAlert {
  data: {
    produtoId: number; // Código do produto (SuperK)
  };
  callback?: Function; // Método executado após o processamento do evento
}

export interface NavigateToProduct {
  data: {
    produtoId: number; // Código do produto (SuperK)
    produtoDescription?: string; // Descrição do produto
  };
  callback?: Function; // Método executado após o processamento do evento
}

export interface ViewProductPrice {
  data: {
    storeCode: number;
    paymentCode?: number;
    shippingCost?: number;
    expenseValue?: number;
    arrProdutoErp: Array<number>;
    orderItem?: Array<OrderItemDto>;
    produtoId?: number; // Código do produto (SuperK)
  };
  callback?: Function; // Método executado após o processamento do evento
}

export interface AddProductToBookmarks {
  data: {
    produtoId: number; // Código do produto (SuperK)
    produtoErpId: number; // Código SAP
    depositoId?: number; // Código do depósito / hubId
  };
  callback?: Function; // Método executado após o processamento do evento
}

export interface RemoveProductFromBookmarks {
  data: {
    produtoId: number; // Código do produto (SuperK)
    depositoId?: number; // Código do depósito / hubId
  };
  callback?: Function; // Método executado após o processamento do evento
}

export interface CheckProductOnBookmarks {
  data: {
    produtosId: number[]; // Código do produto (SuperK)
  };
  callback?: Function; // Método executado após o processamento do evento
}

export interface UpdateCD {
  data: Warehouse;
  callback?: Function; // Método executado após o processamento do evento
}
