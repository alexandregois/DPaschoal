import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { AnalyticsService } from '@shared/services/analytics.service';

@Injectable({
  providedIn: 'root',
})
export class CarrinhoViewResolver implements Resolve<boolean> {
  constructor(private analytics: AnalyticsService) {}

  resolve(route: ActivatedRouteSnapshot): Observable<boolean> {
    this.analytics.trackShoppingCartView({
      shipping: {
        post_code: '88000-000',
        price: '10.00',
        method: 'Transportadora ABC',
      },
      coupon: ['vip10'],
      items: [
        {
          product_id: '1234',
          qty: '1',
          price_to: '10.00',
        },
        {
          product_id: '5678',
          qty: '2',
          price_to: '5.00',
        },
      ],
    });
    return of(true);
  }
}
