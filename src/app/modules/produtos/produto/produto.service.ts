import { Injectable } from '@angular/core';
import { environment } from '@env';
import { ProductService } from '@generated/api/api-external-svc/api/product.service';
import { ProducDetailDto } from '@generated/api/api-external-svc/model/producDetailDto';
import {
  InconsistencyDto,
  InconsistencyService,
} from '@generated/api/portalkd-auth-svc';
import { StoreService } from '@shared/services/store.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProdutoService {
  warehouse$ = this.store.getSelected('warehouse');
  constructor(
    private inconsistencyService: InconsistencyService,
    private productService: ProductService,
    private store: StoreService
  ) {}

  public inconsistencyPost(
    inconsistencyDto: InconsistencyDto
  ): Observable<any> {
    inconsistencyDto.idSuperK = environment.portal;
    return this.inconsistencyService.postInconsistencyPost(
      environment.portal,
      inconsistencyDto
    );
  }

  public buscarProduto(id: number): Observable<ProducDetailDto> {
    let storeCode = 0;
    if (this.warehouse$.value?.priceId) {
      storeCode = this.warehouse$.value?.priceId;
    }
    return this.productService.apiSuperkProductDetailStoreCodeIdGet(
      storeCode,
      id,
      environment.portal
    );
  }
}
