import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { RecuperarSenhaStepModel } from '../model/recuperar-senha-step.model';

@Component({
  selector: 'app-recuperar-senha-cod',
  templateUrl: './recuperar-senha-cod.component.html',
  styleUrls: ['./recuperar-senha-cod.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RecuperarSenhaCodComponent {
  numOfDigits = 4;
  @Input() email: string = '';

  @Output() newItemEvent = new EventEmitter<RecuperarSenhaStepModel>();

  public title: string = 'Redefinir senha';
  public subtitle: string =
    'Insira o código de verificação enviado em seu e-mail no campo de 4 dígitos abaixo';

  constructor() {}

  inputCodeFormOutputListener(code: string) {
    if (code !== '') {
      const stepModel: RecuperarSenhaStepModel = {
        stepCode: 'alteracao',
        param: code,
      };
      this.newItemEvent.emit(stepModel);
    }
  }
}
