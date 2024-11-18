import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Warehouse } from '@models/deposito.model';
@Injectable({
  providedIn: 'root',
})
export class DepositoService {
  private selectedDepositoSubject = new BehaviorSubject<Warehouse | null>(null);
  selectedDeposito$ = this.selectedDepositoSubject.asObservable();
  setSelectedDeposito(deposito: Warehouse | null) {
    this.selectedDepositoSubject.next(deposito);
  }
  getSelectedDeposito(): Warehouse | null {
    return this.selectedDepositoSubject.getValue();
  }
  private selectedDepositoForPaymentSubject =
    new BehaviorSubject<Warehouse | null>(null);
  selectedDepositoForPayment$ =
    this.selectedDepositoForPaymentSubject.asObservable();
  setSelectedDepositoForPayment(deposito: Warehouse | null) {
    if (deposito) {
      deposito.isAntigo = true;
    }
    this.selectedDepositoForPaymentSubject.next(deposito);
    this.setSelectedDeposito(deposito);
  }
}
