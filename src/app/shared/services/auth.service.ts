import { CustomerComplementService } from '@generated/api/dpk-customer-svc/api/customerComplement.service';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom, Observable } from 'rxjs';
import { Segment } from '@models/segment.model';
import { environment } from '@env';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(
    private http: HttpClient,
    private customerServ: CustomerComplementService
  ) {}

  public async getSegments(): Promise<Segment[]> {
    const source$ = this.http.get(
      `${environment.apiUrl}/kdp-customer/api/segmentsCustomer`
    );
    return (await firstValueFrom(source$)) as Promise<Segment[]>;
  }

  // TODO: SUBSTITUIR ANY
  public recoveryPasswordSendEmail(email: string): Observable<any> {
    return this.http.get(
      `${environment.apiUrl}/azure-ad/api/auth/forgotSendCode`,
      { params: { email } }
    );
  }

  public getCustomerComplement(cnpj: string): Observable<any> {
    return this.customerServ.apiCustomerComplementCnpjGet(
      cnpj,
      environment.portal
    );
  }
}
