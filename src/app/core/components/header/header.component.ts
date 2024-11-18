import { environment } from '@env';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import {
  BUSCA,
  CATEGORIAS,
  FAVORITOS,
  HOME,
  KITS,
  OFERTAS,
  PAGINA,
  PRODUTOS,
  GARANTIA,
} from '../../constants/navigation.constant';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
  constructor(private router: Router) {}

  hideFilters() {
    const homeDpk: boolean =
      environment.portal === 'DPK' || environment.portal === 'KDP'
        ? this.isAllowedRoute(HOME.path)
        : !this.isAllowedRoute(HOME.path);
    return (
      !this.isAllowedRoute(PRODUTOS.path) &&
      !this.isAllowedRoute(CATEGORIAS.path) &&
      !this.isAllowedRoute(FAVORITOS.path) &&
      !this.isAllowedRoute(BUSCA.path) &&
      !this.isAllowedRoute(PAGINA.path) &&
      this.isAllowedRoute(GARANTIA.path) &&
      homeDpk
    );
  }

  private isAllowedRoute(route: string) {
    return this.router.url.startsWith(route);
  }
}
