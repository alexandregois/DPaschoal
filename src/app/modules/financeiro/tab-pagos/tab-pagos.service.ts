import { HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@env';
import {
  FinancialDto,
  InvoiceService,
  SecuritiesControllersService,
} from '@generated/api/dpk-financial-svc';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TabPagosService {
  constructor(
    private securitiesControllersService: SecuritiesControllersService,
    private invoiceService: InvoiceService
  ) {}

  fetch(skip: number, top: number, status: number): Observable<FinancialDto> {
    return this.securitiesControllersService.apiOpenSecuritiesSkipTopStatusGet(
      skip,
      top,
      status,
      environment.portal
    );
  }

  getInvoiceDocument(
    documentNumber: string,
    type: string
  ): Observable<HttpResponse<string>> {
    return this.invoiceService.apiGetInvoiceDocumentDocumentNumberTypeGet(
      documentNumber,
      type,
      environment.portal,
      'response',
      true,
      { httpHeaderAccept: 'text/plain' }
    );
  }
}
