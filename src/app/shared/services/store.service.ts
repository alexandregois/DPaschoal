import { Injectable } from '@angular/core';
import { Warehouse } from '@models/deposito.model';
import { BehaviorSubject } from 'rxjs';
import {
  CartDto,
  PaymentDpkDto,
  PaymentTypeDto,
} from '@generated/api/dpk-order-svc';
import { CarrierDeliveryTimeDto } from '@generated/api/dpk-shipping-svc';
import { Customer } from '@models/customer.model';
import { KDClientDomainDtosNotificationDto } from '@generated/api/dpk-customer-svc';

const dataPrefix = 'stored';
const selectedPrefix = 'selected';

type Domain =
  | 'cnpj'
  | 'cart'
  | 'customer'
  | 'payment'
  | 'paymentType'
  | 'shipping'
  | 'warehouse'
  | 'notification';

@Injectable({
  providedIn: 'root',
})
export class StoreService {
  private _isLoadingState: Record<Domain, BehaviorSubject<boolean>> = {
    cnpj: new BehaviorSubject<boolean>(false),
    warehouse: new BehaviorSubject<boolean>(false),
    cart: new BehaviorSubject<boolean>(false),
    payment: new BehaviorSubject<boolean>(false),
    paymentType: new BehaviorSubject<boolean>(false),
    shipping: new BehaviorSubject<boolean>(false),
    customer: new BehaviorSubject<boolean>(false),
    notification: new BehaviorSubject<boolean>(false),
  };

  private _isLoadingStateControl: Record<Domain, Array<boolean>> = {
    cnpj: [],
    warehouse: [],
    cart: [],
    payment: [],
    paymentType: [],
    shipping: [],
    customer: [],
    notification: [],
  };

  private _data: Record<Domain, BehaviorSubject<any>> = {
    cnpj: new BehaviorSubject<string | undefined>(undefined),
    warehouse: new BehaviorSubject<Warehouse[] | undefined>(undefined),
    cart: new BehaviorSubject<CartDto[] | undefined>(undefined),
    payment: new BehaviorSubject<PaymentDpkDto[] | undefined>(undefined),
    paymentType: new BehaviorSubject<PaymentTypeDto[] | undefined>(undefined),
    shipping: new BehaviorSubject<CarrierDeliveryTimeDto[] | undefined>(
      undefined
    ),
    customer: new BehaviorSubject<any | undefined>(undefined),
    notification: new BehaviorSubject<
      KDClientDomainDtosNotificationDto | undefined
    >(undefined),
  };

  private _selected: Record<Domain, BehaviorSubject<any>> = {
    cnpj: new BehaviorSubject<string | undefined>(undefined),
    warehouse: new BehaviorSubject<Warehouse | undefined>(undefined),
    cart: new BehaviorSubject<CartDto | undefined>(undefined),
    payment: new BehaviorSubject<PaymentDpkDto | undefined>(undefined),
    paymentType: new BehaviorSubject<PaymentTypeDto | undefined>(undefined),
    shipping: new BehaviorSubject<CarrierDeliveryTimeDto | undefined>(
      undefined
    ),
    customer: new BehaviorSubject<any | undefined>(undefined),
    notification: new BehaviorSubject<
      KDClientDomainDtosNotificationDto | undefined
    >(undefined),
  };

  public setData(domain: Domain, value: any): void {
    const index = `${dataPrefix}.${domain}`;
    localStorage.setItem(index, this.parseDataToStorage(value));
    this._data[domain].next(value);
  }

  public getData(domain: 'cnpj'): BehaviorSubject<string | undefined>;
  public getData(domain: 'warehouse'): BehaviorSubject<Warehouse[] | undefined>;
  public getData(domain: 'cart'): BehaviorSubject<CartDto[] | undefined>;
  public getData(
    domain: 'payment'
  ): BehaviorSubject<PaymentDpkDto[] | undefined>;
  public getData(
    domain: 'paymentType'
  ): BehaviorSubject<PaymentTypeDto[] | undefined>;
  public getData(
    domain: 'shipping'
  ): BehaviorSubject<CarrierDeliveryTimeDto[] | undefined>;
  public getData(domain: 'customer'): BehaviorSubject<Customer[] | undefined>;
  public getData(
    domain: 'notification'
  ): BehaviorSubject<KDClientDomainDtosNotificationDto | undefined>;
  public getData(domain: Domain): BehaviorSubject<any | undefined> {
    const subject = this._data[domain];
    const index = `${dataPrefix}.${domain}`;
    const data = localStorage.getItem(index);
    if (!subject.getValue() && data) {
      this.setData(domain, this.parseDataFromStorage(data));
    }
    return subject;
  }

  public setSelected(domain: Domain, value: any): void {
    const index = `${selectedPrefix}.${domain}`;
    localStorage.setItem(index, this.parseDataToStorage(value));
    this._selected[domain].next(value);
  }

  public getSelected(domain: 'cnpj'): BehaviorSubject<string | undefined>;
  public getSelected(
    domain: 'warehouse'
  ): BehaviorSubject<Warehouse | undefined>;
  public getSelected(domain: 'cart'): BehaviorSubject<CartDto | undefined>;
  public getSelected(
    domain: 'payment'
  ): BehaviorSubject<PaymentDpkDto | undefined>;
  public getSelected(
    domain: 'paymentType'
  ): BehaviorSubject<PaymentTypeDto | undefined>;
  public getSelected(
    domain: 'shipping'
  ): BehaviorSubject<CarrierDeliveryTimeDto | undefined>;
  public getSelected(domain: 'customer'): BehaviorSubject<Customer | undefined>;
  public getSelected(
    domain: 'notification'
  ): BehaviorSubject<KDClientDomainDtosNotificationDto | undefined>;
  public getSelected(domain: Domain): BehaviorSubject<any | undefined> {
    const subject = this._selected[domain];
    const index = `${selectedPrefix}.${domain}`;
    const data = localStorage.getItem(index);
    if (!subject.getValue() && data) {
      this.setSelected(domain, this.parseDataFromStorage(data));
    }
    return subject;
  }

  public setLoadingState(domain: Domain, state: boolean): void {
    if (state) {
      this._isLoadingStateControl[domain].push(state);
    } else {
      this._isLoadingStateControl[domain].pop();
    }
    const count = this._isLoadingStateControl[domain].length;
    this._isLoadingState[domain].next(count > 0);
  }

  public getLoadingState(domain: 'cnpj'): BehaviorSubject<boolean>;
  public getLoadingState(domain: 'warehouse'): BehaviorSubject<boolean>;
  public getLoadingState(domain: 'cart'): BehaviorSubject<boolean>;
  public getLoadingState(domain: 'payment'): BehaviorSubject<boolean>;
  public getLoadingState(domain: 'paymentType'): BehaviorSubject<boolean>;
  public getLoadingState(domain: 'shipping'): BehaviorSubject<boolean>;
  public getLoadingState(domain: 'customer'): BehaviorSubject<boolean>;
  public getLoadingState(domain: 'notification'): BehaviorSubject<boolean>;
  public getLoadingState(domain: Domain): BehaviorSubject<any> {
    return this._isLoadingState[domain];
  }

  private parseDataToStorage(data: any): string {
    if (typeof data === 'object') {
      return JSON.stringify(data);
    } else {
      return String(data);
    }
  }

  private parseDataFromStorage(
    data: string
  ): string | number | undefined | null | Object {
    if (data === 'undefined') {
      return undefined;
    } else if (data === 'null') {
      return null;
    } else if (data.startsWith('0')) {
      return data;
    } else if (typeof JSON.parse(data) === 'object') {
      return JSON.parse(data);
    } else {
      return data;
    }
  }
}
