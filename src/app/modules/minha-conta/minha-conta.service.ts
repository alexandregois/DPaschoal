import {
  KDClientDomainDtosCustomerDto,
  KDClientDomainDtosAccountDto,
  CustomerService,
  UserService,
} from '@generated/api/dpk-customer-svc';
import { EventEmitter, Injectable } from '@angular/core';
import { environment } from '@env';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MinhaContaService {
  //TODO: O tipo certo do objeto (CustomerUsersDto) retornado no swagger Não possui todos os atributos das subclasses, ajustar junto ao back
  customerLoadedEventEmitter = new EventEmitter<any>();

  constructor(
    private customerService: CustomerService,
    private userService: UserService
  ) {}

  public saveUser(
    usuario: KDClientDomainDtosAccountDto
  ): Observable<KDClientDomainDtosAccountDto> {
    return this.userService.apiUserPost(environment.portal, usuario);
  }

  public updateUser(
    usuario: KDClientDomainDtosAccountDto
  ): Observable<KDClientDomainDtosAccountDto> {
    return this.userService.apiUserPut(environment.portal, usuario);
  }

  public deleteUser(
    usuario: KDClientDomainDtosAccountDto
  ): Observable<KDClientDomainDtosAccountDto> {
    return this.userService.apiUserDelete(environment.portal, usuario);
  }

  public getUser(id: number): Observable<KDClientDomainDtosAccountDto> {
    return this.userService.apiUserIdGet(id, environment.portal);
  }

  public getUserByFilter(arg: {
    id?: number;
    name?: string;
    phone?: string;
    email?: string;
    idPortal?: number;
  }): Observable<KDClientDomainDtosAccountDto> {
    return this.userService.apiUserGetByFilterGet(
      environment.portal,
      arg?.id,
      arg?.name,
      arg?.phone,
      arg?.email,
      arg?.idPortal
    );
  }

  public updateCustomer(
    customer: KDClientDomainDtosCustomerDto
  ): Observable<KDClientDomainDtosCustomerDto> {
    return this.customerService.apiCustomerPut(environment.portal, customer);
  }

  public getCustomerByFilter(arg: {
    id?: number;
    corporateName?: string;
    fantasyName?: string;
    cnpj?: string;
    ie?: string;
    owner?: string;
    email?: string;
  }): Observable<KDClientDomainDtosCustomerDto[]> {
    return this.customerService.apiCustomerGetByFilterGet(
      environment.portal,
      arg?.id,
      undefined,
      undefined,
      undefined,
      arg?.cnpj
    );
  }
}
