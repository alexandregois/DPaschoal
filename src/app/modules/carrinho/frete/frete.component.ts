import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Carrier } from '@models/carrier.model';

@Component({
  selector: 'app-frete',
  templateUrl: './frete.component.html',
  styleUrls: ['./frete.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FreteComponent {
  @Input() total: number | undefined;
  @Input() impostos: number | undefined;
  @Input() isMotorcycleLock: boolean | undefined;

  constructor() {}
}
