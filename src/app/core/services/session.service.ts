import { Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Token, Customer } from '@core/enum/auth.enum';
import { BehaviorSubject, finalize, first, Observable, tap } from 'rxjs';
import { Location } from '@angular/common';
import {
  AuthenticationService,
  PreAuthenticationDto,
} from '@generated/api/portalkd-auth-svc';
import { AccountService } from '@generated/api/portalkd-auth-svc';
import { environment } from '@env';
import { StoreService } from '@shared/services/store.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { CnpjDialogComponent } from '@shared/components/cnpj-dialog/cnpj-dialog.component';
import { CardAddressService } from '@modules/carrinho/components/card-address/card-address.service';

@Injectable({
  providedIn: 'root',
})
export class SessionService {
  private isAuthSubject = new BehaviorSubject<boolean>(false);
  private cnpjDialog: MatDialogRef<CnpjDialogComponent> | undefined;
  private cnpjPreviousSelected: string | undefined;

  constructor(
    private router: Router,
    private location: Location,
    private route: ActivatedRoute,
    private authenticationService: AuthenticationService,
    private accountServ: AccountService,
    private store: StoreService,
    private dialog: MatDialog,
    private cardAddressService: CardAddressService
  ) {
    this.setIsAuthSubject(this.isAuth);
  }

  setIsAuthSubject(user: boolean): void {
    return this.isAuthSubject.next(user);
  }

  getIsAuthSubject(): BehaviorSubject<boolean> {
    return this.isAuthSubject;
  }

  get isAuth(): boolean {
    return !!this.accessToken;
  }

  get accessToken(): string | null {
    return localStorage.getItem(Token.ACCESS_TOKEN);
  }

  get refreshToken(): string | null {
    return localStorage.getItem(Token.REFRESH_TOKEN);
  }

  get idToken(): string | null {
    return localStorage.getItem(Token.ID_TOKEN);
  }

  get accessLogin(): string | null {
    return localStorage.getItem(Token.ACCESS_LOGIN);
  }

  get accessPass(): string | null {
    return localStorage.getItem(Token.ACCESS_PASS);
  }

  setToken(tokens: { access: string; id: string; refresh: string }): void {
    localStorage.setItem(Token.ACCESS_TOKEN, tokens.access);
    localStorage.setItem(Token.ID_TOKEN, tokens.id);
    localStorage.setItem(Token.REFRESH_TOKEN, tokens.refresh);
  }
  setUserPassword(account: PreAuthenticationDto) {
    localStorage.setItem(Token.ACCESS_LOGIN, account.userPrincipalName!);
    localStorage.setItem(Token.ACCESS_PASS, account.password!);
  }

  public buscaCustomer() {
    let cnpj = this.store.getSelected('cnpj').getValue();
    return this.cardAddressService
      .getCustomerByFilter({ cnpj })
      .pipe()
      .subscribe({
        next: async (res) => {
          let address = res[0].customerAddresses?.[0];
          localStorage.setItem('customerAddress', JSON.stringify(address));
        },
      });
  }

  deleteToken(): void {
    localStorage.clear();
    sessionStorage.clear();
    this.store.setSelected('cnpj', null);
  }

  // TODO: SUBSTITUIR ANY
  public async login(
    res: any,
    redirectAfterLogin: boolean = false
  ): Promise<void> {
    this.setToken({
      access: res.accessToken,
      id: res.idToken,
      refresh: res.refreshToken,
    });

    if (redirectAfterLogin) {
      let path = '/';
      let redirectQueryParam =
        this.route.snapshot.queryParamMap.get('redirect');
      if (redirectQueryParam) {
        path = redirectQueryParam;
      }
      this.router.navigateByUrl(path);
    }

    Promise.resolve();
  }

  public logout(
    redirectToLogin: boolean = false,
    redirectBackWhenLogin: boolean = false,
    redirectBackRoute?: string
  ): void {
    let queryParams = {};
    let redirectRoute = redirectToLogin ? '/login' : '/';
    this.deleteToken();
    this.setIsAuthSubject(false);
    if (redirectBackWhenLogin) {
      let redirectRoute = redirectBackRoute
        ? redirectBackRoute
        : this.location.path();
      queryParams = { ...queryParams, redirect: redirectRoute };
    }
    this.router.navigate([redirectRoute], { queryParams }).then(() => {
      if (!redirectToLogin) {
        window.location.reload();
      }
    });
  }

  public getCnpjByToken(): Observable<any> {
    this.store.setLoadingState('cnpj', true);
    const accesT = this.accessToken;
    return this.accountServ
      .apiAccountGetCnpjByEmailGet(environment.portal, accesT || undefined)
      .pipe(
        first(),
        tap((data) => this.setCnpjs(data)),
        finalize(() => this.store.setLoadingState('cnpj', false))
      );
  }

  public authToken(): void {
    this.store.setLoadingState('cnpj', true);
    let cnpjSelected = this.store.getSelected('cnpj').getValue();
    this.authenticationService
      .apiAuthPost(environment.portal, '"' + cnpjSelected + '"')
      .pipe()
      .subscribe({
        next: async (res) => {
          await this.login(res, false);
          window.location.reload();
          this.setIsAuthSubject(true);
        },
      });
  }

  public authPreToken(): void {
    const preAuth: PreAuthenticationDto = {
      userPrincipalName: this.accessLogin,
      password: this.accessPass,
    };
    this.authenticationService
      .apiAuthPreTokenPost(environment.portal, preAuth)
      .pipe()
      .subscribe({
        next: async (res) => {
          await this.login(res, false);
          this.authToken();
        },
      });
  }

  public authPreTokenChange(acess: string, password: string): void {
    this.clearDatas();
    const preAuth: PreAuthenticationDto = {
      userPrincipalName: acess,
      password: password,
    };
    this.authenticationService
      .apiAuthPreTokenPost(environment.portal, preAuth)
      .pipe()
      .subscribe({
        next: async (res) => {
          await this.login(res, false);
          this.openCnpjSelection();
          this.router.navigate(['/']);
        },
      });
  }

  clearDatas(): void {
    this.store.setData('warehouse', null);
    this.store.setSelected('warehouse', null);
    this.store.setSelected('cnpj', null);
    localStorage.removeItem('dataEmAberto');
    localStorage.removeItem('dataPagos');
    localStorage.removeItem('autoCredData');
  }

  public authTokenReload(): void {
    this.store.setLoadingState('cnpj', true);
    let cnpjSelected = this.store.getSelected('cnpj').getValue();
    this.authenticationService
      .apiAuthPost(environment.portal, '"' + cnpjSelected + '"')
      .pipe()
      .subscribe({
        next: async (res) => {
          await this.login(res, false);
          window.location.reload();
          this.setIsAuthSubject(true);
        },
      });
  }

  public setCnpjs(data: any) {
    if (data.length > 1) {
      var cnpjs = [];
      cnpjs.push(data);
      localStorage.setItem('cnpjs', JSON.stringify(cnpjs));
    } else {
      this.store.setData('cnpj', data[0]);
    }
  }

  public openCnpjSelection(callback?: Function) {
    this.getCnpjByToken().pipe(first()).subscribe();
    this.cnpjDialog = this.dialog.open(CnpjDialogComponent, {
      disableClose: true,
      // width: '500px',
    });

    this.cnpjDialog.afterClosed().subscribe(() => {
      const cnpjSelected = this.store.getSelected('cnpj');
      if (!cnpjSelected?.value) {
        this.logout(false);
      }
      return callback ? callback() : undefined;
    });
  }

  public closeCnpjSelection() {
    this.cnpjDialog?.close();
  }

  public initSelectedCnpj(): void {
    const data = localStorage.getItem(Customer.CUSTOMER_DOCUMENT);
    if (data) {
      this.setSelectedCnpj(data);
    }

    if (this.isAuth) {
      const cnpj = this.store.getSelected('cnpj').getValue();
      if (!cnpj) {
        this.openCnpjSelection();
      } else {
        this.closeCnpjSelection();
      }
    }
  }

  public setSelectedCnpj(data: string): void {
    this.buscaCustomer();
    if (!data) this.logout(true);
    this.cnpjPreviousSelected = this.store.getSelected('cnpj')?.value;
    if (this.cnpjPreviousSelected) {
      if (this.cnpjPreviousSelected !== data) {
        this.store.setSelected('cnpj', data);
        localStorage.setItem(Customer.CUSTOMER_DOCUMENT, data);
        this.authTokenReload();
      }
    } else {
      this.store.setSelected('cnpj', data);
      localStorage.setItem(Customer.CUSTOMER_DOCUMENT, data);
      this.authToken();
    }
  }
}
