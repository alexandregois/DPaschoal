import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackBarColorService } from '@shared/services/snackbarColor.service';

@Component({
  selector: 'app-input-file',
  templateUrl: './input-file.component.html',
  styleUrls: ['./input-file.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InputFileComponent {
  constructor(
    private snackBar: MatSnackBar,
    private snackbarColorService: SnackBarColorService
  ) {}

  id: string = Math.random().toString(36).substring(2);
  filename: string | undefined;

  onChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length) {
      const file = input.files[0];
      if (
        file.type == 'image/png' ||
        file.type == 'image/jpeg' ||
        file.type == 'application/pdf'
      ) {
        this.filename = file.name;
      } else {
        this.snackBar.open(
          `Formato de arquivo não aceito, apenas PNG, JPEG e PDF`,
          'Ok',
          this.snackbarColorService.getSnackBarConfig()
        );
        this.filename = undefined;
      }
    } else {
      this.filename = undefined;
    }
  }
}
