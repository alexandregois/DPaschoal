import { Injectable } from '@angular/core';
import { MatSnackBarConfig } from '@angular/material/snack-bar';
import { environment } from '@env';
import { portals } from 'src/environments/portals';

@Injectable({
  providedIn: 'root',
})
export class SnackBarColorService {
  getSnackBarConfig(): MatSnackBarConfig {
    const snackBarConfig: MatSnackBarConfig = {
      panelClass: [this.getSnackBarColor()],
    };
    return snackBarConfig;
  }

  private getSnackBarColor(): string {
    if (environment.portal === portals.kdp) {
      return 'kdp-snackbar';
    }
    return 'dpk-snackbar';
  }
}
