import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CarrinhoComponent } from './carrinho.component';
import { CarrinhoViewResolver } from './resolvers/carrinho-view.resolver';

const routes: Routes = [
  {
    path: '',
    title: 'Meu carrinho',
    resolve: { pageview: CarrinhoViewResolver },
    component: CarrinhoComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CarrinhoRoutingModule {}
