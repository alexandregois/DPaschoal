import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-recuperar-senha-sucesso',
  templateUrl: './recuperar-senha-sucesso.component.html',
  styleUrls: ['./recuperar-senha-sucesso.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RecuperarSenhaSucessoComponent {
  public title: string = 'Redefinir senha';
  public subtitle: string = 'Senha redefinida com sucesso!';

  constructor() {}
}
