import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PaymentTypeService {
  private paymentTypeSource = new BehaviorSubject<string | number | null>(null);
  currentPaymentType = this.paymentTypeSource.asObservable();

  private priceListSource = new BehaviorSubject([]);
  currentPriceList = this.priceListSource.asObservable();

  private formStatusSource = new BehaviorSubject<boolean>(false);
  currentFormStatus = this.formStatusSource.asObservable();

  private formDataSource = new BehaviorSubject<any>({});
  currentFormData = this.formDataSource.asObservable();

  private parcelaValorSubject = new BehaviorSubject<number>(0);
  parcelaValor$ = this.parcelaValorSubject.asObservable();

  constructor() {}

  changePaymentType(paymentType: string | number | null) {
    this.paymentTypeSource.next(paymentType);
  }

  changePriceList(priceList: any) {
    this.priceListSource.next(priceList);
  }

  changeFormStatus(status: boolean) {
    this.formStatusSource.next(status);
  }

  changeFormData(data: any) {
    this.formDataSource.next(data);
  }

  getParcelasFromDescription(description: string): number {
    const match = description.match(/(\d+)x/);
    return match ? +match[1] : 1;
  }

  updateParcelaValor(valor: number) {
    this.parcelaValorSubject.next(valor);
  }
}
