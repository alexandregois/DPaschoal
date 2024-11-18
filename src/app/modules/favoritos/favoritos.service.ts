import { Injectable } from '@angular/core';
import { environment } from '@env';
import {
  ProductFavoriteService,
  ProductFavoriteDto,
} from '@generated/api/dpk-product-svc';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FavoritosService {
  constructor(private favoriteService: ProductFavoriteService) {}

  public buscarFavoritos(): Observable<ProductFavoriteDto[]> {
    return this.favoriteService.apiProductFavoriteGetByFilterGet(
      environment.portal
    );
  }
}
