import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { AnalyticsService } from '@shared/services/analytics.service';

@Injectable({
  providedIn: 'root',
})
export class PageviewResolver implements Resolve<boolean> {
  constructor(private analytics: AnalyticsService) {}

  resolve(route: ActivatedRouteSnapshot): Observable<boolean> {
    this.analytics.trackPageView(route.routeConfig?.title);
    return of(true);
  }
}
