import { OrderDto } from '@generated/api/dpk-order-svc';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Pedido } from '@models/pedidos.model';

@Component({
  selector: 'app-informacoes-pedido',
  templateUrl: './informacoes-pedido.component.html',
  styleUrls: ['./informacoes-pedido.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InformacoesPedidoComponent {
  constructor() {}

  @Input() pedido: OrderDto | undefined;
}
