import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { AnalyticsService } from '@shared/services/analytics.service';

@Injectable({
  providedIn: 'root',
})
export class ProdutoViewResolver implements Resolve<boolean> {
  constructor(private analytics: AnalyticsService) {}

  resolve(route: ActivatedRouteSnapshot): Observable<boolean> {
    const productId = route.params['produtoId'];
    this.analytics.trackProductView(productId);
    return of(true);
  }
}
