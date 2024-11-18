import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NavigationItem } from '@core/interface/navigation-item.interface';
import {
  FAVORITOS,
  FINANCEIRO,
  HOME,
  PEDIDOS,
  QUEM_SOMOS,
  WHATSAPP,
  GARANTIA,
} from '@core/constants/navigation.constant';
import { DrawerService } from '@core/services/drawer.service';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { BreakpointService } from '@shared/services/breakpoint.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavbarComponent {
  isSmallScreen$ = this.breakpoint.isSmallScreen();
  links: NavigationItem[] | undefined;
  smallScreenLinks = [HOME, FAVORITOS, PEDIDOS, WHATSAPP];
  largeScreenLinks = [
    HOME,
    FINANCEIRO,
    PEDIDOS,
    FAVORITOS,
    WHATSAPP,
    GARANTIA,
    QUEM_SOMOS,
  ];

  constructor(
    private breakpoint: BreakpointService,
    private drawer: DrawerService,
    private matIconRegistry: MatIconRegistry,
    private sanitizer: DomSanitizer
  ) {
    this.isSmallScreen$.subscribe((isSmallScreen) => {
      this.links = isSmallScreen
        ? this.smallScreenLinks
        : this.largeScreenLinks;
    });

    if (WHATSAPP.svgIcon) {
      this.matIconRegistry.addSvgIcon(
        WHATSAPP.svgIcon,
        this.sanitizer.bypassSecurityTrustResourceUrl(WHATSAPP.svgIcon)
      );
    }
  }

  openDrawer(): void {
    this.drawer.open();
  }
}
