import { StatusComponent } from './components/status/status.component';
import { BotoesComponent } from './components/botoes/botoes.component';
import { ItemPedidoComponent } from './components/item-pedido/item-pedido.component';
import { InformacoesPedidoComponent } from './components/informacoes-pedido/informacoes-pedido.component';
import { AvaliarPedidoModalComponent } from './components/avaliar-pedido-modal/avaliar-pedido-modal.component';

import { PedidoStatusColorDirective } from './directives/pedido-status-color.directive';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { SharedModule } from '@shared/shared.module';

import { PedidosRoutingModule } from './pedidos-routing.module';
import { PedidosComponent } from './pedidos.component';
import { PedidoComponent } from './pedido/pedido.component';
import { MatListModule } from '@angular/material/list';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialogModule } from '@angular/material/dialog';
import { CardPedidoComponent } from './components/card-pedido/card-pedido.component';
import { PagarPedidoPixComponent } from './components/pagar-pedido-pix/pagar-pedido-pix.component';
import { PagarPedidoBoletoComponent } from './components/pagar-pedido-boleto/pagar-pedido-boleto.component';

@NgModule({
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  declarations: [
    PedidosComponent,
    PedidoComponent,
    BotoesComponent,
    StatusComponent,
    ItemPedidoComponent,
    InformacoesPedidoComponent,
    PedidoStatusColorDirective,
    AvaliarPedidoModalComponent,
    CardPedidoComponent,
    PagarPedidoPixComponent,
    PagarPedidoBoletoComponent,
  ],
  imports: [
    SharedModule,
    MatButtonToggleModule,
    PedidosRoutingModule,
    MatListModule,
    MatGridListModule,
    MatChipsModule,
    MatDialogModule,
  ],
})
export class PedidosModule {}
