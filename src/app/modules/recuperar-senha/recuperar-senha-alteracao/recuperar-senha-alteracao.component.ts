import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { NonNullableFormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { confirmedValidator } from '@core/validators/confirmed.validator';
import { passwordStrengthValidator } from '@core/validators/password-strength.validator';
import { RecuperarSenha } from '@models/recuperar-senha.model';
import { finalize } from 'rxjs';
import { RecuperarSenhaStepModel } from '../model/recuperar-senha-step.model';
import { RecuperarSenhaService } from '../recuperar-senha.service';
import { SnackBarColorService } from '@shared/services/snackbarColor.service';

@Component({
  selector: 'app-recuperar-senha-alteracao',
  templateUrl: './recuperar-senha-alteracao.component.html',
  styleUrls: ['./recuperar-senha-alteracao.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RecuperarSenhaAlteracaoComponent {
  @Output() newItemEvent = new EventEmitter<RecuperarSenhaStepModel>();
  @Input() code: string = '';
  @Input() email: string = '';
  isLoading: boolean = false;

  public title: string = 'Redefinir senha';
  public subtitle: string =
    'Para redefinir insira uma nova senha nos campos abaixo.';

  isPasswordVisible: boolean = false;
  constructor(
    private fb: NonNullableFormBuilder,
    private readonly cdr: ChangeDetectorRef,
    private recuperarSenhaService: RecuperarSenhaService,
    private snackBar: MatSnackBar,
    private snackbarColorService: SnackBarColorService
  ) {}

  recuperarSenhaAlteracaoForm = this.fb.group({
    password: ['', [Validators.required, passwordStrengthValidator()]],
    confirmPassword: [
      '',
      [Validators.required, confirmedValidator('password')],
    ],
  });

  onSubmit(): void {
    if (this.recuperarSenhaAlteracaoForm.invalid) {
      return;
    }
    this.forgotChangePassword();
  }

  forgotChangePassword(): void {
    this.isLoading = true;
    let form = this.recuperarSenhaAlteracaoForm.getRawValue();
    const request: RecuperarSenha = {
      password: form.password,
      confirmPassword: form.confirmPassword,
      code: this.code,
    };
    this.recuperarSenhaService
      .forgotChangePassword(request, this.email)
      .pipe(
        finalize(() => {
          this.isLoading = false;
          this.cdr.markForCheck();
        })
      )
      .subscribe({
        next: () => {
          const stepModel: RecuperarSenhaStepModel = {
            stepCode: 'sucesso',
            param: '',
          };
          this.newItemEvent.emit(stepModel);
        },
        error: () => {
          this.snackBar.open(
            'Erro ao alterar senha',
            'Ok',
            this.snackbarColorService.getSnackBarConfig()
          );
        },
      });
  }
}
