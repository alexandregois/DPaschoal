import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@env';
import { RecuperarSenha } from '@models/recuperar-senha.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RecuperarSenhaService {
  constructor(private http: HttpClient) {}

  // TODO: SUBSTITUIR ANY
  public forgotChangePassword(
    recuperarSenha: RecuperarSenha,
    email: string
  ): Observable<any> {
    return this.http.patch(
      `${environment.apiUrl}/azure-ad/api/auth/forgotChangePassword`,
      recuperarSenha,
      { params: { email } }
    );
  }

  // TODO: SUBSTITUIR ANY
  public recoveryPasswordSendEmail(email: string): Observable<any> {
    return this.http.get(
      //`${environment.apiUrl}/azure-ad/api/auth/forgotSendCode`,
      `${environment.apiUrl}/azure-ad/api/account/forgot-password`,
      { params: { email } }
    );
  }

  // TODO: SUBSTITUIR ANY
  public validateCodeOTP(email: string, code: string): Observable<any> {
    return this.http.get(
      `${environment.apiUrl}/azure-ad/api/auth/validateCodeOTP`,
      { params: { email, code } }
    );
  }
}
