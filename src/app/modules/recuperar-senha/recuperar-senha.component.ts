import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RecuperarSenhaStepModel } from './model/recuperar-senha-step.model';
@Component({
  selector: 'app-recuperar-senha',
  templateUrl: './recuperar-senha.component.html',
  styleUrls: ['./recuperar-senha.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RecuperarSenhaComponent {
  constructor() {}

  ngOnInit(): void {}

  public isRecuperarSenhaEmail: boolean = true;
  public isRecuperarSenhaCod: boolean = false;
  public isRecuperarSenhaAlteracao: boolean = false;
  public isRecuperarSenhaSucesso: boolean = false;
  public email: string = '';
  public code: string = '';

  updateStepForm(step: RecuperarSenhaStepModel) {
    this.isRecuperarSenhaEmail = false;
    this.isRecuperarSenhaCod = false;
    this.isRecuperarSenhaAlteracao = false;
    this.isRecuperarSenhaSucesso = false;

    if (step.stepCode === 'email') {
      this.isRecuperarSenhaEmail = true;
    } else if (step.stepCode === 'cod') {
      this.isRecuperarSenhaCod = true;
      this.email = step.param;
    } else if (step.stepCode === 'alteracao') {
      this.isRecuperarSenhaAlteracao = true;
      this.code = step.param;
    } else if (step.stepCode === 'sucesso') {
      this.isRecuperarSenhaSucesso = true;
    }
  }
}
