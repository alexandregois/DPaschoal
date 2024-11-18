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
import { SessionService } from '@core/services/session.service';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  constructor(private session: SessionService) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    const accessToken = this.session.accessToken;
    const isLoggedIn = this.session.isAuth;
    const isApiUrl = request.url.startsWith(environment.apiUrl);
    let authorization;
    let xPortal = request.headers.get('x-portal');
    xPortal = xPortal === null ? environment.portal : xPortal;
    let headers = {
      Accept: 'application/json',
      'Access-Control-Allow-Headers': 'Content-Type',
      'x-portal': xPortal,
      'Ocp-Apim-Subscription-Key': environment.ocpApimsubscriptionkey,
    };
    if (isLoggedIn && isApiUrl) {
      authorization = { Authorization: `Bearer ${accessToken}` };
    }
    request = request.clone({
      setHeaders: { ...headers, ...authorization },
    });
    return next.handle(request);
  }
}

export const JwtInterceptorProvider = {
  provide: HTTP_INTERCEPTORS,
  useClass: JwtInterceptor,
  multi: true,
};
