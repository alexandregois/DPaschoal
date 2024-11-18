import { Injectable } from '@angular/core';
import { environment } from '@env';
import {
  CarrierDeliveryTimeDto,
  CarrierDeliveryTimeService,
} from '@generated/api/dpk-shipping-svc';
import { StoreService } from '@shared/services/store.service';
import { finalize, first, Observable, tap } from 'rxjs';
import { portals } from 'src/environments/portals';

@Injectable({
  providedIn: 'root',
})
export class CardShippingSelectService {
  constructor(
    private store: StoreService,
    private carrierService: CarrierDeliveryTimeService
  ) {}
  public buscarTransportes(
    hubId: number,
    orderTotal: number,
    paymentCode: number
  ): Observable<CarrierDeliveryTimeDto[]> {
    this.store.setLoadingState('shipping', true);
    const warehouse = this.store
      .getData('warehouse')
      .getValue()
      ?.filter((warehouse) => warehouse.id === hubId)[0];
    const retailerId = warehouse?.retailerId;
    let storeCode = warehouse?.priceId;
    if (retailerId === 1) {
      storeCode = warehouse?.code;
    }

    let xPortal = environment.portal;
    if (environment.portal === portals.kdp && retailerId === 2) {
      xPortal = portals.dpk;
    }

    return this.carrierService
      .apiCarrierDpkGet(xPortal, storeCode, orderTotal, paymentCode)
      .pipe(
        first(),
        tap((data) => this.store.setData('shipping', data)),
        finalize(() => this.store.setLoadingState('shipping', false))
      );
  }
}
