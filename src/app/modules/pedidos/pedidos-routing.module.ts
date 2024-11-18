import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PageviewResolver } from '@shared/resolvers/page-view.resolver';
import { PedidoComponent } from './pedido/pedido.component';
import { PedidosComponent } from './pedidos.component';

const routes: Routes = [
  {
    path: '',
    title: 'Meus Pedidos',
    resolve: { pageview: PageviewResolver },
    component: PedidosComponent,
  },
  {
    path: ':pedido',
    title: 'Detalhes do pedido',
    resolve: { pageview: PageviewResolver },
    component: PedidoComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PedidosRoutingModule {}
