import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { environment } from '@env';
import {
  CartDto,
  CartService,
  OrderCreateDto,
  OrderDto,
  OrderItemDto,
  OrderPaymentCreditCardDto,
  OrderService,
} from '@generated/api/dpk-order-svc';
import {
  PriceDpkFilter,
  PriceResponseDto,
  PriceService,
} from '@generated/api/dpk-price-svc';
import {
  finalize,
  first,
  firstValueFrom,
  Observable,
  tap,
  throwError,
} from 'rxjs';
import { AnalyticsService } from '@shared/services/analytics.service';
import { StoreService } from '@shared/services/store.service';
import { EventEmitter } from '@angular/core';
import { StepperSelectionEvent } from '@angular/cdk/stepper';
import { portals } from 'src/environments/portals';
import { SnackBarColorService } from '@shared/services/snackbarColor.service';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class CarrinhoService {
  constructor(
    private cartService: CartService,
    private priceService: PriceService,
    private store: StoreService,
    private orderService: OrderService,
    private analytics: AnalyticsService,
    private snackBar: MatSnackBar,
    private snackbarColorService: SnackBarColorService,
    private http: HttpClient
  ) {}
  loadStepEvent = new EventEmitter<StepperSelectionEvent>();

  getCarts(): Observable<CartDto[]> {
    this.store.setLoadingState('cart', true);
    return this.cartService.apiCartGetByFilterGet(environment.portal).pipe(
      first(),
      tap((data) => this.store.setData('cart', data)),
      finalize(() => this.store.setLoadingState('cart', false))
    );
  }

  getAdditionalTax(params: {
    hubId: number;
    paymentCode: number;
    shippingCompanyId: number;
    totalOrder: number;
    totalWeight: number;
    deliveryType: string;
  }): Observable<number> {
    const warehouse = this.store
      .getData('warehouse')
      .getValue()
      ?.filter((warehouse) => warehouse.id === params.hubId)[0];
    const retailerId = warehouse?.retailerId;
    if (retailerId === 1) {
      return new Observable<number>();
    }
    let storeCode = warehouse?.priceId;

    let xPortal = environment.portal;
    if (environment.portal === portals.kdp && retailerId === 2) {
      xPortal = portals.dpk;
    }

    return this.priceService.apiPriceDpkExpenseGet(
      xPortal,
      storeCode,
      params.paymentCode,
      params.shippingCompanyId,
      params.totalOrder,
      params.totalWeight,
      params.deliveryType
    );
  }

  deleteAllCartItems(cartId: string): Observable<boolean> {
    return this.cartService.apiCartIdDelete(cartId, environment.portal);
  }

  submitOrder(value: {
    total: number | undefined;
    impostos: number | undefined;
    frete: number | undefined;
    despesasAcessorias: number | undefined;
    orderItems: OrderItemDto[];
    orderPaymentCreditCard: OrderPaymentCreditCardDto | undefined;
  }): Observable<OrderDto | undefined> {
    const customerData = this.store.getData('customer').getValue()!;
    const address = customerData[0]?.customerAddresses?.[0];
    const cart = this.store.getSelected('cart').value;
    const shipping = this.store.getSelected('shipping').value;
    const payment = this.store.getSelected('payment').value;

    if (!cart) {
      this.snackBar.open(
        'Selecione um carrinho válido',
        'Ok',
        this.snackbarColorService.getSnackBarConfig()
      );
    } else if (!address) {
      this.snackBar.open(
        'Atualize seu cadastro, seu endereço é inválido',
        'Ok',
        this.snackbarColorService.getSnackBarConfig()
      );
    } else if (!shipping) {
      this.snackBar.open(
        'Selecione uma forma de entrega',
        'Ok',
        this.snackbarColorService.getSnackBarConfig()
      );
    } else if (!payment) {
      this.snackBar.open(
        'Selecione um plano de pagamento',
        'Ok',
        this.snackbarColorService.getSnackBarConfig()
      );
    }
    if (value.total === undefined) {
      this.snackBar.open(
        'Valor total não encontrado, revise o pedido',
        'Ok',
        this.snackbarColorService.getSnackBarConfig()
      );
    } else if (value.frete === undefined) {
      this.snackBar.open(
        'Frete não encontrado, revise o pedido',
        'Ok',
        this.snackbarColorService.getSnackBarConfig()
      );
    } else if (value.impostos === undefined) {
      this.snackBar.open(
        'Imposto não encontrado, revise o pedido',
        'Ok',
        this.snackbarColorService.getSnackBarConfig()
      );
    } else if (!value.orderItems || !value.orderItems.length) {
      this.snackBar.open(
        'Nenhum item encontrado, revise o pedido',
        'Ok',
        this.snackbarColorService.getSnackBarConfig()
      );
    } else if (!shipping) {
      this.snackBar.open(
        'Nenhuma forma de entrega definida, revise o pedido',
        'Ok',
        this.snackbarColorService.getSnackBarConfig()
      );
    } else if (!cart) {
      this.snackBar.open(
        'Nenhum carrinho selecionado, revise o pedido',
        'Ok',
        this.snackbarColorService.getSnackBarConfig()
      );
    } else if (!payment) {
      this.snackBar.open(
        'Nenhuma forma de pagamento selecionada, revise o pedido',
        'Ok',
        this.snackbarColorService.getSnackBarConfig()
      );
    } else {
      const purchaseDate = new Date();
      purchaseDate.setMinutes(
        purchaseDate.getMinutes() - purchaseDate.getTimezoneOffset()
      );

      const deliveryDate = new Date();
      deliveryDate.setMinutes(
        deliveryDate.getMinutes() - deliveryDate.getTimezoneOffset()
      );
      if (shipping.deliveryTime) {
        deliveryDate.setDate(deliveryDate.getDate() + shipping.deliveryTime);
      }

      const order: OrderCreateDto = {
        retailerId: cart.retailerId,
        hubId: cart.hubId,
        cartId: cart.id,
        purchaseDate: purchaseDate.toISOString(),
        paymentId: payment.id,
        quantity: cart.cartItems?.length,
        shippingCompanyId: shipping.id,
        deliveryDate: deliveryDate?.toISOString(),
        delivery: shipping.inStorePickup ? false : true,
        orderItems: value.orderItems,
        orderPaymentCreditCard: value.orderPaymentCreditCard,
      };

      return this.orderService
        .apiOrderPost(environment.portal, undefined, order)
        .pipe(
          tap({
            next: (order) => {
              this.analytics.trackPurchaseView({
                order_id: order.id,
                timestamp: order.purchaseDate,
                shipping: {
                  post_code: address?.zipcode,
                  price: shipping.shippingCost,
                  method: shipping.id,
                },
                items: order.orderItems?.map((orderItem) => ({
                  product_id: orderItem.productId,
                  qty: orderItem.quantity,
                  price_to: orderItem.unitePrice,
                })),
                payment_method: payment.description,
                subtotal: order.total,
                discount_total: 0,
                order_total: order.total,
                order_status:
                  order.ordersStatus && order.ordersStatus[0].statusId,
                order_reason: '',
              });
            },
          })
        );
    }
    return throwError(() => undefined);
  }

  getCartPrices(
    priceFilter: PriceDpkFilter
  ): Observable<Array<PriceResponseDto>> {
    if (priceFilter.paymentCode === undefined) {
      priceFilter.paymentCode = this.store
        .getSelected('payment')
        .getValue()?.id;
    }

    const warehouse = this.store
      .getData('warehouse')
      .getValue()
      ?.filter((warehouse) => warehouse.id === priceFilter.storeCode)[0];
    const retailerId = warehouse?.retailerId;
    const storeCode = warehouse?.priceId;
    priceFilter.storeCode = storeCode;

    let xPortal = environment.portal;
    if (environment.portal === portals.kdp && retailerId === 2) {
      xPortal = portals.dpk;
    }

    return this.priceService.apiPriceDpkTaxPost(xPortal, '', priceFilter);
  }
  public async buscarEndereco(cep: string): Promise<any> {
    const source$ = this.http.get(
      `${environment.apiUrl}/api-external/api/address?zipcode=${cep}`
    );
    return (await firstValueFrom(source$)) as Promise<any>;
  }
  // public async getDataFromCnpj(cnpj: string): Promise<BasicInfoCustomer> {
  //   const source$ = this.http.get(
  //     `${environment.apiUrl}/api-external/api/nfe-io/basicInfoCustomer`,
  //     { params: { cnpj } }
  //   );
  //   return (await firstValueFrom(source$)) as Promise<BasicInfoCustomer>;
  // }
}
