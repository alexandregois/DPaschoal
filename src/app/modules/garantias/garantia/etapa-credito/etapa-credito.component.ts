import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'app-etapa-credito',
  templateUrl: './etapa-credito.component.html',
  styleUrls: ['./etapa-credito.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EtapaCreditoComponent {
  @Input()
  valorAprovado!: number;
}
