import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
} from '@angular/core';
import { FormControl, Validators } from '@angular/forms';

import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { InconsistencyDto } from '@generated/api/portalkd-auth-svc';
import { Inconsistencia } from '@models/produtos.model';
import { ProdutoService } from '@modules/produtos/produto/produto.service';
import { SnackBarColorService } from '@shared/services/snackbarColor.service';
import { finalize } from 'rxjs';

@Component({
  selector: 'dialog-modal-inconsistencia-produto',
  templateUrl: './modal-inconsistencia-produto.component.html',
  styleUrls: ['./modal-inconsistencia-produto.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ModalInconsistenciaProdutoComponent {
  constructor(
    private produtoService: ProdutoService,
    private snackBar: MatSnackBar,
    private readonly cdr: ChangeDetectorRef,
    private snackbarColorService: SnackBarColorService,
    public dialogRef: MatDialogRef<ModalInconsistenciaProdutoComponent>
  ) {}

  isLoading: boolean = false;
  mostrarModal: boolean = false;

  inconsistencia: Inconsistencia = {
    codigoTipo: 0,
    descricao: new FormControl('', [Validators.required]),
  };

  enviar(): void {
    if (
      this.inconsistencia.codigoTipo != 0 &&
      this.inconsistencia.descricao.value != ''
    ) {
      this.isLoading = true;

      let inconsistency: InconsistencyDto = {
        inconsistencyType: this.inconsistencia.codigoTipo.toString(),
        inconsistencyDescription: this.inconsistencia.descricao.value,
      };

      this.produtoService
        .inconsistencyPost(inconsistency)
        .pipe(
          finalize(() => {
            this.isLoading = false;
            this.cdr.markForCheck();
            this.dialogRef.close();
          })
        )
        .subscribe({
          next: () =>
            this.snackBar.open(
              'Obrigado, sua mensagem foi enviada com sucesso.',
              'Ok',
              this.snackbarColorService.getSnackBarConfig()
            ),
          error: () =>
            this.snackBar.open(
              'Erro ao tentar informar inconsistencia',
              'Ok',
              this.snackbarColorService.getSnackBarConfig()
            ),
        });
    } else {
      this.snackBar.open(
        'Preencha os campos',
        'Ok',
        this.snackbarColorService.getSnackBarConfig()
      );
    }
  }
}
