import { ChangeDetectionStrategy, Component } from '@angular/core';
import { DrawerService } from '@core/services/drawer.service';
import { SessionService } from '@core/services/session.service';
import { SvgIconService } from '@shared/services/svg-icon.service';
import { BreakpointService } from '@shared/services/breakpoint.service';
import { BeOnService } from '@core/services/be-on.service';
import { environment } from '@env';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ToolbarComponent {
  isSmallScreen$ = this.breakpoint.isSmallScreen();
  isAuth$ = this.session.getIsAuthSubject();
  isKdpPortal = environment.portal === 'KDP';
  portal = environment.portal;

  constructor(
    private svgIcon: SvgIconService,
    private session: SessionService,
    private drawer: DrawerService,
    private beOn: BeOnService,
    private breakpoint: BreakpointService
  ) {
    this.svgIcon.set(`logo`, `/assets/svg/logo.svg`);
    this.beOn.searchInit();
    this.session.initSelectedCnpj();
  }

  openDrawer(): void {
    this.drawer.open();
  }
}
