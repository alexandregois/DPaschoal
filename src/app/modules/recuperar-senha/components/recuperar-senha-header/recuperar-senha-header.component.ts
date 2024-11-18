import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'app-recuperar-senha-header',
  templateUrl: './recuperar-senha-header.component.html',
  styleUrls: ['./recuperar-senha-header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RecuperarSenhaHeaderComponent {
  @Input()
  title: string | undefined;

  @Input()
  subtitle: string | undefined;

  constructor() {}
}
