import { StatusOrderDto } from '@generated/api/kdp-order-svc';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { OrderDto } from '@generated/api/dpk-order-svc';

@Component({
  selector: 'app-card-pedido',
  templateUrl: './card-pedido.component.html',
  styleUrls: ['./card-pedido.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CardPedidoComponent {
  @Input() pedido!: OrderDto;
  @Input() listaStatus!: Array<StatusOrderDto>;

  getStatusPedido(): StatusOrderDto {
    if (this.pedido) {
      let statusId = this.pedido.statusId;
      var status = this.listaStatus.filter((elm) => elm.id == statusId)[0];

      return status;
    }
    return {};
  }
}
