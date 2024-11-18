import { OrderItemDto } from '@generated/api/dpk-order-svc';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Item } from '@models/pedidos.model';
import { environment } from '@env';

@Component({
  selector: 'app-item-pedido',
  templateUrl: './item-pedido.component.html',
  styleUrls: ['./item-pedido.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ItemPedidoComponent {
  constructor() {}

  environment = environment;

  @Input()
  item!: OrderItemDto;

  getImagem(): string {
    return (
      environment.superkImageUrlPrefix +
      this.item?.manufacturer +
      '_' +
      this.item?.code +
      '.jpg'
    );
  }
}
