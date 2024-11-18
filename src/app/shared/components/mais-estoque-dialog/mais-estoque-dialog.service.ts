import { Observable } from 'rxjs';
import { PriceResponseDto } from '@generated/api/dpk-price-svc/model/priceResponseDto';
import { PriceService } from '@generated/api/dpk-price-svc';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class MaisEstoqueDialogService {
  constructor(private priceService: PriceService) {}

  public buscarPrecoProduto(params: {
    storeCode: number;
    storePortal: string;
    sapCodes: number[];
  }): Observable<PriceResponseDto[]> {
    return this.priceService.apiPriceDpkGet(
      params.storePortal,
      params.storeCode,
      undefined,
      undefined,
      undefined,
      params.sapCodes
    );
  }
}
