import { Injectable } from '@angular/core';
import { environment } from '@env';
import { CustomerService } from '@generated/api/dpk-customer-svc';
import { finalize, first, Observable, tap } from 'rxjs';
import { Customer } from '@models/customer.model';
import { StoreService } from '@shared/services/store.service';

@Injectable({
  providedIn: 'root',
})
export class CardAddressService {
  constructor(
    private customerService: CustomerService,
    private store: StoreService
  ) {}

  public getCustomerByFilter(arg: {
    id?: number;
    corporateName?: string;
    fantasyName?: string;
    cnpj?: string;
    ie?: string;
    owner?: string;
    email?: string;
  }): Observable<Customer[]> {
    this.store.setLoadingState('customer', true);
    return this.customerService
      .apiCustomerGetByFilterGet(
        environment.portal,
        arg?.id,
        undefined,
        undefined,
        undefined,
        arg?.cnpj
      )
      .pipe(
        first(),
        tap((data) => this.store.setData('customer', data)),
        finalize(() => this.store.setLoadingState('customer', false))
      );
  }
}
