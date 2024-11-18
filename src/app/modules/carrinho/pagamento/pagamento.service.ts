import { portals } from 'src/environments/portals';
import { EventEmitter, Injectable } from '@angular/core';
import { environment } from '@env';

import {
  CartDto,
  CartService,
  PaymentDpkDto,
  PaymentService,
  PaymentTypeDto,
} from '@generated/api/dpk-order-svc';
import { StoreService } from '@shared/services/store.service';
import { finalize, first, Observable, tap } from 'rxjs';
import {
  ProducDetailDto,
  ProductService,
} from '@generated/api/api-external-svc';

@Injectable({
  providedIn: 'root',
})
export class PagamentoService {
  selectDepositOnChartEvent = new EventEmitter<string>();

  warehouse$ = this.store.getSelected('warehouse');

  constructor(
    private paymentService: PaymentService,
    private store: StoreService,
    private productService: ProductService,
    private cartService: CartService
  ) {}

  getCarts(): Observable<CartDto[]> {
    this.store.setLoadingState('cart', true);
    return this.cartService.apiCartGetByFilterGet(environment.portal).pipe(
      first(),
      tap((data) => this.store.setData('cart', data)),
      finalize(() => this.store.setLoadingState('cart', false))
    );
  }

  deleteCartItem(cartId: string, itemId: string): Observable<boolean> {
    return this.cartService.apiCartIdIdItemDelete(
      cartId,
      itemId,
      environment.portal
    );
  }

  updateCart(cartDto: CartDto): Observable<CartDto> {
    return this.cartService.apiCartPut(environment.portal, 'auth', cartDto);
  }

  getPayments(
    paymentType: number,
    retailerId: number
  ): Observable<PaymentDpkDto[]> {
    this.store.setLoadingState('payment', true);
    let xPortal = environment.portal;
    if (environment.portal === portals.kdp && retailerId === 2) {
      xPortal = portals.dpk;
    }
    return this.paymentService
      .apiPaymentDpkGet(xPortal, paymentType, retailerId)
      .pipe(
        first(),
        tap((data) => this.store.setData('payment', data)),
        finalize(() => this.store.setLoadingState('payment', false))
      );
  }

  getPaymentTypes(retailerId: number): Observable<Array<PaymentTypeDto>> {
    this.store.setLoadingState('paymentType', true);

    let xPortal = environment.portal;
    if (environment.portal === portals.kdp && retailerId === 2) {
      xPortal = portals.dpk;
    }

    return this.paymentService
      .apiPaymentPaymentTypeGet(xPortal, retailerId)
      .pipe(
        first(),
        tap((data) => this.store.setData('paymentType', data)),
        finalize(() => this.store.setLoadingState('paymentType', false))
      );
  }

  getProductById(productId: number): Observable<ProducDetailDto> {
    let storeCode = 0;
    if (this.warehouse$.value?.priceId) {
      storeCode = this.warehouse$.value?.priceId;
    }
    return this.productService.apiSuperkProductDetailStoreCodeIdGet(
      storeCode,
      productId,
      environment.portal
    );
  }
}
