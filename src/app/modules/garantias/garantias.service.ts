import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { Garantia } from '@models/warranty.model';
import { WarrantyService } from '@generated/api/dpk-warranty-svc';

@Injectable({
  providedIn: 'root',
})
export class GarantiasService {
  constructor(private service: WarrantyService) {}

  getListGarantias(): Observable<Array<Garantia>> {
    return this.service.warrantyGetListGet();
  }
}
