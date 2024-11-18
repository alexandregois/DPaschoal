import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SvgIconService } from '@shared/services/svg-icon.service';
import { SessionService } from '@core/services/session.service';
import { StoreService } from '@shared/services/store.service';

@Component({
  selector: 'app-cnpj-dialog',
  templateUrl: './cnpj-dialog.component.html',
  styleUrls: ['./cnpj-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CnpjDialogComponent {
  value: string | undefined;
  isLoading$ = this.store.getLoadingState('cnpj');
  CNPJList: string[] = [];
  locall: string[] = [];
  names: string | undefined;

  constructor(
    private session: SessionService,
    private store: StoreService,
    private svgIcon: SvgIconService
  ) {
    this.svgIcon.set(`logo`, `/assets/svg/logo.svg`);
    let local = localStorage.getItem('cnpjs');
    if (local) {
      if (local.length > 1) {
        let namesInit = local.replace('[[', '[');
        this.names = namesInit.replace(']]', ']');
      }
      if (this.names) {
        var storedNames = JSON.parse(this.names);
      }
    }
    if (local) {
      storedNames.forEach((value: any) => {
        this.CNPJList.push(value);
      });
    }
  }

  onNgModelChange($event: string[]) {
    this.session.setSelectedCnpj($event[0]);
    this.session.closeCnpjSelection();
  }
}
