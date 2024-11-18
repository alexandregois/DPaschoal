import { Injectable } from '@angular/core';
import { environment } from '@env';
import { portals } from '../../../environments/portals';
import { Warehouse } from '@models/deposito.model';

@Injectable({
  providedIn: 'root',
})
export class PortalService {
  constructor() {}

  environment = environment;

  public distribuidoPor(isDPK: boolean | undefined): string {
    return environment.portal === portals.dpk ? 'DPK' : isDPK ? 'DPK' : 'KDP';
  }

  public warehousePriceIdFactory(warehouse: Warehouse): number {
    let priceId = warehouse.id;
    if (
      environment.portal === portals.kdp &&
      warehouse.retailerId === 2 &&
      warehouse.code
    ) {
      priceId = warehouse.code / 100;
    }
    return priceId;
  }
}
