import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { AnalyticsService } from '@shared/services/analytics.service';

@Injectable({
  providedIn: 'root',
})
export class BuscaViewResolver implements Resolve<boolean> {
  constructor(private analytics: AnalyticsService) {}

  resolve(route: ActivatedRouteSnapshot): Observable<boolean> {
    const buscaId = route.queryParams['pesquisa'];
    this.analytics.trackSearchListView(buscaId);
    return of(true);
  }
}
