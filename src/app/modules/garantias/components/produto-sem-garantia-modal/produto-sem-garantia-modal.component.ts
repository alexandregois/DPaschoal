import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-produto-sem-garantia-modal',
  templateUrl: './produto-sem-garantia-modal.component.html',
  styleUrls: ['./produto-sem-garantia-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProdutoSemGarantiaModalComponent {
  constructor(
    public dialogRef: MatDialogRef<ProdutoSemGarantiaModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: string
  ) {}
}
