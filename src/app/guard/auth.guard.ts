import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Observable } from 'rxjs';
import { Token } from '@core/enum/auth.enum';
import { SessionService } from '@core/services/session.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private session: SessionService) {}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Promise<boolean | UrlTree> {
    return new Promise((resolve) => {
      if (this.session.isAuth) {
        const JWT = localStorage.getItem(Token.ACCESS_TOKEN);
        if (JWT) {
          const jwtPayload = JSON.parse(window.atob(JWT.split('.')[1]));
          const expiration = jwtPayload.exp;
          if (Date.now() >= expiration * 1000) {
            this.session.logout(true, true, state.url);
            resolve(false);
          }
        }
        resolve(true);
      } else {
        this.session.logout(true, true, state.url);
        resolve(false);
      }
    });
  }
}
