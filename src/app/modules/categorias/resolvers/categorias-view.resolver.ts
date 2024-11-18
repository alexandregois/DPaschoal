import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { AnalyticsService } from '@shared/services/analytics.service';
import { BeOnService } from '@core/services/be-on.service';

@Injectable({
  providedIn: 'root',
})
export class CategoriasViewResolver implements Resolve<boolean> {
  constructor(private analytics: AnalyticsService, private beOn: BeOnService) {}

  resolve(route: ActivatedRouteSnapshot): Observable<boolean> {
    const params = this.beOn.prepareParams({
      params: route.params,
      queryParams: route.queryParams,
    });
    this.analytics.trackProductListView(params);
    return of(true);
  }
}
