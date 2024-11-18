import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
} from '@angular/core';
import {
  CADASTRO,
  CREDITO,
  FINANCEIRO,
  GARANTIA,
  MINHA_CONTA,
  OFERTAS,
  PEDIDOS,
  QUEM_SOMOS,
  WHATSAPP,
} from '@core/constants/navigation.constant';
import { NavigationItem } from '@core/interface/navigation-item.interface';
import { DrawerService } from '@core/services/drawer.service';
import { SessionService } from '@core/services/session.service';
import { StoreService } from '@shared/services/store.service';
import { EventsApiService } from '../../services/events-api.service';
import { Router } from '@angular/router';
import { Token } from '@core/enum/auth.enum';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidenavComponent {
  MINHA_CONTA = MINHA_CONTA;
  isAuth: boolean | undefined;
  links: NavigationItem[] = [];
  cnpj$ = this.store.getSelected('cnpj');
  cnpjs$ = localStorage.getItem('cnpjs');

  constructor(
    private session: SessionService,
    private drawer: DrawerService,
    private events: EventsApiService,
    private store: StoreService,
    private router: Router,
    private readonly cdr: ChangeDetectorRef
  ) {
    this.isAuth = this.session.isAuth;

    if (this.isAuth) {
      this.links = [
        PEDIDOS,
        OFERTAS,
        CREDITO,
        FINANCEIRO,
        GARANTIA,
        WHATSAPP,
        QUEM_SOMOS,
      ];
    } else {
      this.links = [CADASTRO, QUEM_SOMOS, WHATSAPP];
    }

    GARANTIA.click = () => {
      this.events.openGarantia();
    };
  }

  get accessLogin(): string | null {
    return localStorage.getItem(Token.ACCESS_LOGIN);
  }

  get accessPass(): string | null {
    return localStorage.getItem(Token.ACCESS_PASS);
  }

  closeDrawer(): void {
    this.drawer.close();
  }

  logout(): void {
    this.session.logout(false);
  }

  linkClick(fn: Function | undefined): void {
    if (fn) {
      fn();
    }
  }

  changeCnpj() {
    var acess = this.accessLogin!;
    var password = this.accessPass!;
    this.session.authPreTokenChange(acess, password);
    this.closeDrawer();
  }

  addCnpj() {
    localStorage.setItem('typeRegister', 'Multi');
    this.router.navigate(['/cadastro']);
  }

  minhaConta() {
    this.router.navigate(['/minha-conta']);
    this.closeDrawer();
  }
}
