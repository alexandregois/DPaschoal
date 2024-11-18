import { FluigService } from '@generated/api/dpk-customer-svc';
import { Injectable } from '@angular/core';
import { environment } from '@env';
import { Observable } from 'rxjs';
import {
  KDClientDomainDtosFluigSolicitationDto,
  CustomerComplementService,
} from '@generated/api/dpk-customer-svc';

@Injectable({
  providedIn: 'root',
})
export class CreditoService {
  constructor(
    private fluigService: FluigService,
    private customerComplementService: CustomerComplementService
  ) {}

  //TODO: Retirar any do response quando o swagger for ajustado
  public postFluigSolicitation(
    request: KDClientDomainDtosFluigSolicitationDto
  ): Observable<any> {
    return this.fluigService.apiFluigSolicitationPost(
      environment.portal,
      request
    );
  }

  //TODO: Retirar any do response quando o swagger for ajustado
  public getCreditLimit(cnpj: string): Observable<any> {
    return this.customerComplementService.apiCustomerComplementCnpjGet(
      cnpj,
      environment.portal
    );
  }
}
