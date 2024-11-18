import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@env';
import { firstValueFrom } from 'rxjs';
import {
  BasicInfoCustomer,
  BasicInfoCustomerEconomicActivity,
} from '@models/basicInfoCustomer.model';
import { StateTaxInfoCustomer } from '@models/stateTaxInfoCustomer.model';

@Injectable({
  providedIn: 'root',
})
export class CadastroService {
  constructor(private http: HttpClient) {}

  public async isNotDuplicatedCustomer(cnpj: string): Promise<boolean> {
    const source$ = this.http.get(
      `${environment.apiUrl}/kdp-customer/api/customer/checkDuplicateCustomer/${cnpj}`
    );
    return (await firstValueFrom(source$)) as Promise<boolean>;
  }

  public async getDataFromCnpj(cnpj: string): Promise<BasicInfoCustomer> {
    const source$ = this.http.get(
      `${environment.apiUrl}/api-external/api/nfe-io/basicInfoCustomer`,
      { params: { cnpj } }
    );
    return (await firstValueFrom(source$)) as Promise<BasicInfoCustomer>;
  }

  public async isValidCnae(data: {
    economicActivities: BasicInfoCustomerEconomicActivity[];
  }): Promise<boolean> {
    const source$ = this.http.post(
      `${environment.apiUrl}/kdp-customer/api/customer/checkValidCnae`,
      data
    );
    return (await firstValueFrom(source$)) as Promise<boolean>;
  }

  // TODO: SUBSTITUIR ANY
  public async createCustomer(customer: object): Promise<any> {
    const source$ = this.http.post(
      `${environment.apiUrl}/kdp-customer/api/customer/createAccountAndPostCustomer`,
      customer
    );
    return await firstValueFrom(source$);
  }

  public async createCustomerMulti(customer: object): Promise<any> {
    const source$ = this.http.post(
      `${environment.apiUrl}/kdp-customer/api/customer/PostCustomer`,
      customer
    );
    return await firstValueFrom(source$);
  }

  public async getDataFromCnpjAndUf(
    cnpj: string,
    uf: string
  ): Promise<StateTaxInfoCustomer> {
    const source$ = this.http.get(
      `${environment.apiUrl}/api-external/api/nfe-io/stateTaxInfoCustomer`,
      { params: { cnpj, uf } }
    );
    return (await firstValueFrom(source$)) as Promise<StateTaxInfoCustomer>;
  }
}
