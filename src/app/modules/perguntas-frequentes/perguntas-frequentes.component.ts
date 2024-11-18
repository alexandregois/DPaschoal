import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-perguntas-frequentes',
  templateUrl: './perguntas-frequentes.component.html',
  styleUrls: ['./perguntas-frequentes.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PerguntasFrequentesComponent {
  constructor() {}
}
