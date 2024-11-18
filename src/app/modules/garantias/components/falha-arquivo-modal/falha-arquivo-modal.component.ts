import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-falha-arquivo-modal',
  templateUrl: './falha-arquivo-modal.component.html',
  styleUrls: ['./falha-arquivo-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FalhaArquivoModalComponent {
  constructor(
    public dialogRef: MatDialogRef<FalhaArquivoModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: boolean
  ) {}

  anexarNovamente() {
    this.dialogRef.close(true);
  }
}
