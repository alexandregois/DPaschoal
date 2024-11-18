import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Output,
} from '@angular/core';
import { NonNullableFormBuilder, Validators } from '@angular/forms';
import { RecuperarSenhaStepModel } from '../model/recuperar-senha-step.model';
import { RecuperarSenhaService } from '../recuperar-senha.service';  // Importando o serviço

@Component({
  selector: 'app-recuperar-senha-email',
  templateUrl: './recuperar-senha-email.component.html',
  styleUrls: ['./recuperar-senha-email.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RecuperarSenhaEmailComponent {
  @Output() newItemEvent = new EventEmitter<RecuperarSenhaStepModel>();

  public title: string = 'Redefinir senha';
  public subtitle: string =
    'Para redefinir sua senha, informe o e-mail cadastrado em sua conta e enviaremos as instruções de redefinição.';

  recuperarSenhaCnpjForm = this.fb.group({
    email: [
      '',
      [
        Validators.required,
        Validators.email,
        Validators.pattern(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/),
      ],
    ],
  });

  constructor(private fb: NonNullableFormBuilder, private recuperarSenhaService: RecuperarSenhaService) {}  // Injetando o serviço

  onSubmit(): void {
    if (this.recuperarSenhaCnpjForm.invalid) {
      return;
    }
    let form = this.recuperarSenhaCnpjForm.getRawValue();
    const stepModel: RecuperarSenhaStepModel = {
      stepCode: 'cod',
      param: form.email,
    };

    // Chamando o método do serviço para enviar o e-mail
    this.recuperarSenhaService.recoveryPasswordSendEmail(form.email).subscribe(response => {
        // Você pode tratar a resposta aqui, se necessário
    });

    this.newItemEvent.emit(stepModel);
  }
}
