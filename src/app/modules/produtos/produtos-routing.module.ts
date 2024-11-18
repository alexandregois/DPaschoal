import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProdutoViewResolver } from './resolvers/produto-view.resolver';
import { ProdutoComponent } from './produto/produto.component';
import { ProdutosComponent } from './produtos.component';

const routes: Routes = [
  /** Alteração feita apenas para teste de formulário da PayZen (FERNANDA) */
  {
    path: '',
    // redirectTo: '/',
    // pathMatch: 'full',
    component: ProdutosComponent,
  },
  {
    path: ':produtoId',
    title: 'Produto',
    resolve: { pageview: ProdutoViewResolver },
    component: ProdutoComponent,
  },
  {
    path: ':produtoId/:produtoDescription',
    title: 'Produto',
    resolve: { pageview: ProdutoViewResolver },
    component: ProdutoComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProdutosRoutingModule {}
