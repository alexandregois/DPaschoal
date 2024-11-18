import { Injectable } from '@angular/core';
import { environment } from '@env';
import { Observable } from 'rxjs';
import {
  PreAuthenticationDto,
  AuthenticationService,
} from '@generated/api/portalkd-auth-svc';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  constructor(private authenticationService: AuthenticationService) {}

  public authPreToken(account: PreAuthenticationDto): Observable<any> {
    return this.authenticationService.apiAuthPreTokenPost(
      environment.portal,
      account
    );
  }
  public authToken(token: string): Observable<any> {
    return this.authenticationService.apiAuthPost(environment.portal, token);
  }
}
