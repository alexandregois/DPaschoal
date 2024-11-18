import { Injectable } from '@angular/core';
import { environment } from '@env';
import { CustomerWarehouseService } from '@generated/api/dpk-customer-svc';
import { Warehouse } from '@models/deposito.model';
import { finalize, first, map, Observable, of, tap } from 'rxjs';
import { StoreService } from '@shared/services/store.service';
import { PortalService } from '@shared/services/portal.service';

@Injectable({
  providedIn: 'root',
})
export class FiltersService {
  constructor(
    private store: StoreService,
    private customerWarehouseService: CustomerWarehouseService,
    private portal: PortalService
  ) {}

  public buscarWarehouses(): Observable<Warehouse[] | undefined> {
    const data = this.store.getData('warehouse');
    if (data.value?.length && data.getValue()) {
      return data;
    }
    this.store.setLoadingState('warehouse', true);
    return this.customerWarehouseService
      .apiCustomerWarehouseGet(environment.portal)
      .pipe(
        first(),
        map((response: Warehouse[]) =>
          response.map((warehouse) => ({
            ...warehouse,
            priceId: this.portal.warehousePriceIdFactory(warehouse),
          }))
        ),
        tap((data) => this.store.setData('warehouse', data)),
        finalize(() => this.store.setLoadingState('warehouse', false))
      );
  }
}
