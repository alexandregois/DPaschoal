import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { StatusProduct } from '@models/product.model';

@Component({
  selector: 'app-status-produto',
  templateUrl: './status-produto.component.html',
  styleUrls: ['./status-produto.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StatusProdutoComponent {
  @Input()
  status!: string;

  constructor() {}
}
