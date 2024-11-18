import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-contato',
  templateUrl: './contato.component.html',
  styleUrls: ['./contato.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContatoComponent {
  constructor() {}
}
