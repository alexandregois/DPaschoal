import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
  HTTP_INTERCEPTORS,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { SessionService } from '@core/services/session.service';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  isRefreshing: boolean = false;
  constructor(private session: SessionService) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      catchError((error) => {
        if (
          error instanceof HttpErrorResponse &&
          !request.url.includes('login') &&
          error.status === 401
        ) {
          return throwError(() => error);
        }
        return throwError(() => error);
      })
    );
  }

  private handle401Error(request: HttpRequest<any>, next: HttpHandler) {
    if (!this.isRefreshing) {
      this.isRefreshing = true;

      const token = this.session.refreshToken;

      return next.handle(request);

      // return this.session.authRefreshToken(token).pipe(
      //   switchMap((token: any) => {
      //     this.isRefreshing = false;

      //     this.session.setToken({
      //       access: token.accessToken,
      //       id: token.idToken,
      //       refresh: token.refreshToken,
      //     });

      //     // TODO: encontrar uma forma de não precisar recarregar a página
      //     location.reload();

      //     return next.handle(request);
      //   }),
      //   catchError((error) => {
      //     this.isRefreshing = false;

      //     return throwError(() => error);
      //   })
      // );
    }
    return next.handle(request);
  }
}

export const ErrorInterceptorProvider = {
  provide: HTTP_INTERCEPTORS,
  useClass: ErrorInterceptor,
  multi: true,
};
