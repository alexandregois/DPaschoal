import { ChangeDetectionStrategy, Component } from '@angular/core';
import { EventsApiService } from '@core/services/events-api.service';

@Component({
  selector: 'app-produtos',
  templateUrl: './produtos.component.html',
  styleUrls: ['./produtos.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProdutosComponent {
  constructor(private events: EventsApiService) {}

  viewCDByProduct() {
    this.events.viewCDByProduct({
      data: {
        produtoId: 2923844,
        produtoErpId: 0,
      },
      callback: (result: any) =>
        this.defaultCallBack('viewCDByProduct', result),
    });
  }

  navigateToSimilarProducts() {
    this.events.navigateToSimilarProducts({
      data: { produtoId: 123 },
      callback: () => this.defaultCallBack('navigateToSimilarProducts'),
    });
  }

  addProductToCart() {
    this.events.addProductToCart({
      data: {
        produtoId: 123,
        produtoErpId: 123,
        produtoQtd: 1,
        depositoId: 123,
      },
      callback: (result: any) =>
        this.defaultCallBack('addProductToCart', result),
    });
  }

  addProductToAlert() {
    this.events.addProductToAlert({
      data: {
        produtoId: 123,
      },
      callback: (result: any) =>
        this.defaultCallBack('addProductToAlert', result),
    });
  }

  navigateToProduct() {
    this.events.navigateToProduct({
      data: { produtoId: 123 },
      callback: (result: any) =>
        this.defaultCallBack('navigateToProduct', result),
    });
  }

  viewProductPrice() {
    this.events.viewProductPrice({
      data: {
        storeCode: 0,
        paymentCode: 1,
        shippingCost: 1,
        expenseValue: 1,
        arrProdutoErp: [123],
        orderItem: [],
      },
      callback: (result: any) =>
        this.defaultCallBack('viewProductPrice', result),
    });
  }

  addProductToBookmarks() {
    this.events.addProductToBookmarks({
      data: {
        depositoId: 123,
        produtoErpId: 123,
        produtoId: 123,
      },
      callback: (result: any) =>
        this.defaultCallBack('addProductToBookmarks', result),
    });
  }

  removeProductFromBookmarks() {
    this.events.removeProductFromBookmarks({
      data: {
        depositoId: 123,
        produtoId: 123,
      },
      callback: (result: any) =>
        this.defaultCallBack('removeProductFromBookmarks', result),
    });
  }

  checkProductOnBookmarks() {
    this.events.checkProductOnBookmarks({
      data: {
        produtosId: [123],
      },
      callback: (result: any) =>
        this.defaultCallBack('checkProductOnBookmarks', result),
    });
  }

  defaultCallBack(callbackName: string, result?: any) {
    console.log(callbackName, 'callback works', result);
  }
}
