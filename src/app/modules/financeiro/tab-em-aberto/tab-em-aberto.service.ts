import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@env';
import {
  InvoiceService,
  SecuritiesControllersService,
  SecuritiesDocumentDto,
} from '@generated/api/dpk-financial-svc';
import { FinancialDto } from '@generated/api/dpk-financial-svc/model/financialDto';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TabEmAbertoService {
  constructor(
    private securitiesControllersService: SecuritiesControllersService,
    private invoiceService: InvoiceService,
    protected httpClient: HttpClient
  ) {}

  fetch(skip: number, top: number, status: number): Observable<FinancialDto> {
    return this.securitiesControllersService.apiOpenSecuritiesSkipTopStatusGet(
      skip,
      top,
      status,
      environment.portal
    );
  }

  getInvoice(
    documentNumber: string,
    exercise: string,
    company: string
  ): Observable<HttpResponse<string>> {
    return this.invoiceService.apiGetInvoiceDocumentNumberExerciseCompanyGet(
      documentNumber,
      exercise,
      company,
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

  getSecuritiesDocument(
    billCode: string
  ): Observable<HttpResponse<SecuritiesDocumentDto>> {
    return this.securitiesControllersService.apiGetSecuritiesDocumentBillCodeGet(
      billCode,
      environment.portal,
      'response',
      true,
      { httpHeaderAccept: 'text/plain' }
    );
  }
}
