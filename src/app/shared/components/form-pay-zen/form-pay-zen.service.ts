import { Injectable } from '@angular/core';
import { PaymentService, PaymentTypeDto } from '@generated/api/dpk-order-svc';
import { environment } from '@env';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FormPayZenService {
  constructor(private paymentService: PaymentService) {}

  public getFormToken(
    order: string,
    totalOrder: number
  ): Observable<PaymentTypeDto[]> {
    return this.paymentService.apiPaymentPaymentTypeGet(
      environment.portal,
      totalOrder
    );
  }
}
