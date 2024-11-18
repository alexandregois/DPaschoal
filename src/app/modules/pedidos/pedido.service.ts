import {
  OrderDto,
  OrderResponseFilterDto,
  OrderService,
  PaymentCheckResponseDto,
  PaymentService,
  StatusOrderDto,
} from '@generated/api/dpk-order-svc';
import { Injectable } from '@angular/core';
import { environment } from '@env';
import { Observable } from 'rxjs';
import {
  ProducDetailDto,
  ProductService,
} from '@generated/api/api-external-svc';
import {
  CarrierDeliveryTimeDto,
  CarrierDeliveryTimeService,
} from '@generated/api/dpk-shipping-svc';
import { StoreService } from '@shared/services/store.service';

@Injectable({
  providedIn: 'root',
})
export class PedidoService {
  warehouse$ = this.store.getSelected('warehouse');

  constructor(
    private orderService: OrderService,
    private produtoService: ProductService,
    private paymentService: PaymentService,
    private carrierDeliveryTimeService: CarrierDeliveryTimeService,
    private store: StoreService
  ) {}

  public getOrderByFilter(arg: {
    skip?: number;
    take?: number;
    customerId?: number;
    retailerId?: number;
    statusId?: number;
    createdDate?: string;
  }): Observable<OrderResponseFilterDto> {
    return this.orderService.apiOrderGetByFilterGet(
      environment.portal,
      arg?.skip,
      arg?.take,
      arg?.customerId,
      arg?.retailerId,
      arg?.statusId,
      arg?.createdDate
    );
  }

  public getOrderDetails(id: string): Observable<OrderDto> {
    return this.orderService.apiOrderIdGet(id, environment.portal);
  }

  public getOrdersItem(id: number): Observable<ProducDetailDto> {
    let storeCode = 0;
    if (this.warehouse$.value?.priceId) {
      storeCode = this.warehouse$.value?.priceId;
    }
    return this.produtoService.apiSuperkProductDetailStoreCodeIdGet(
      storeCode,
      id,
      environment.portal
    );
  }

  public getOrdersShipping(arg: {
    storeCode?: number;
    totalOrder?: number;
  }): Observable<CarrierDeliveryTimeDto[]> {
    return this.carrierDeliveryTimeService.apiCarrierKdpGet(
      environment.portal,
      arg?.storeCode,
      arg?.totalOrder
    );
  }

  public getStatus(): Observable<Array<StatusOrderDto>> {
    return this.orderService.apiOrderGetStatusGet(environment.portal);
  }

  public getPayment(
    paymentCode?: string,
    paymentId?: number
  ): Observable<PaymentCheckResponseDto> {
    return this.paymentService.apiPaymentCheckGet(
      environment.portal,
      paymentCode,
      paymentId
    );
  }
}
