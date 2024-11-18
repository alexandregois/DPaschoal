import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PagarPedidoBoletoComponent } from '../pagar-pedido-boleto/pagar-pedido-boleto.component';
import { PagarPedidoPixComponent } from '../pagar-pedido-pix/pagar-pedido-pix.component';
import { OrderDto, OrderStatusDto } from '@generated/api/dpk-order-svc';

@Component({
  selector: 'app-botoes',
  templateUrl: './botoes.component.html',
  styleUrls: ['./botoes.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BotoesComponent implements OnInit {
  @Input() pedido!: OrderDto;
  @Input() detalhe: boolean = false;

  statusPedido: OrderStatusDto = {};

  constructor(public dialog: MatDialog) {}

  ngOnInit(): void {
    if (this.pedido && this.pedido.ordersStatus) {
      let lastIndex = this.pedido.ordersStatus?.length - 1;
      this.statusPedido = this.pedido.ordersStatus[lastIndex];
    }
  }

  pagarPedido(): void {
    if (this.pedido?.orderPayments?.paymentType === 3) {
      this.dialog.open(PagarPedidoPixComponent, { data: this.pedido });
    } else if (this.pedido?.orderPayments?.paymentType === 4) {
      this.dialog.open(PagarPedidoBoletoComponent, { data: this.pedido });
    }
  }
}
