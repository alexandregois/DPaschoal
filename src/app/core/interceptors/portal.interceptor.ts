import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HTTP_INTERCEPTORS,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@env';
import { portals } from '../../../environments/portals';

@Injectable()
export class PortalInterceptor implements HttpInterceptor {
  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    let xPortal = request.headers.get('x-portal');
    xPortal = xPortal === null ? environment.portal : xPortal;
    if (request.url.includes(environment.apiUrl)) {
      var regex = new RegExp(Object.keys(portals).join('|'), 'gi');
      const url = request.url.replace(regex, xPortal.toLocaleLowerCase());
      const portalRequest = request.clone({ url });
      return next.handle(portalRequest);
    }

    return next.handle(request);
  }
}

export const PortalInterceptorProvider = {
  provide: HTTP_INTERCEPTORS,
  useClass: PortalInterceptor,
  multi: true,
};
