import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guard/auth.guard';
import { PageTemplates } from '@models/page-template.interface';
import { BuscaProdutoComponent } from '@modules/busca-produto/busca-produto.component';

const routes: Routes = [
  {
    path: '',
    loadChildren: () =>
      import('@modules/home/home.module').then((m) => m.HomeModule),
    data: { template: PageTemplates.NO_WRAPPER },
  },
  {
    path: 'cadastro',
    loadChildren: () =>
      import('@modules/cadastro/cadastro.module').then((m) => m.CadastroModule),
    data: { template: PageTemplates.FULLSCREEN },
  },
  {
    path: 'categorias',
    loadChildren: () =>
      import('@modules/categorias/categorias.module').then(
        (m) => m.CategoriasModule
      ),
    data: { template: PageTemplates.NO_WRAPPER },
  },
  {
    path: 'contato',
    loadChildren: () =>
      import('@modules/contato/contato.module').then((m) => m.ContatoModule),
  },
  {
    path: 'favoritos',
    canActivate: [AuthGuard],
    loadChildren: () =>
      import('@modules/favoritos/favoritos.module').then(
        (m) => m.FavoritosModule
      ),
    data: { template: PageTemplates.NO_CONTAINER },
  },
  {
    path: 'financeiro',
    canActivate: [AuthGuard],
    loadChildren: () =>
      import('@modules/financeiro/financeiro.module').then(
        (m) => m.FinanceiroModule
      ),
  },
  {
    path: 'login',
    loadChildren: () =>
      import('@modules/login/login.module').then((m) => m.LoginModule),
    data: { template: PageTemplates.FULLSCREEN },
  },
  {
    path: 'minha-conta',
    canActivate: [AuthGuard],
    loadChildren: () =>
      import('@modules/minha-conta/minha-conta.module').then(
        (m) => m.MinhaContaModule
      ),
  },
  {
    path: 'pedidos',
    canActivate: [AuthGuard],
    loadChildren: () =>
      import('@modules/pedidos/pedidos.module').then((m) => m.PedidosModule),
  },
  {
    path: 'garantia',
    canActivate: [AuthGuard],
    loadChildren: () =>
      import('@modules/garantias/garantias.module').then(
        (m) => m.GarantiasModule
      ),
  },
  {
    path: 'perguntas-frequentes',
    loadChildren: () =>
      import('@modules/perguntas-frequentes/perguntas-frequentes.module').then(
        (m) => m.PerguntasFrequentesModule
      ),
  },
  {
    path: 'produtos',
    loadChildren: () =>
      import('@modules/produtos/produtos.module').then((m) => m.ProdutosModule),
    data: { template: PageTemplates.NO_CONTAINER },
  },
  {
    path: 'recuperar-senha',
    loadChildren: () =>
      import('@modules/recuperar-senha/recuperar-senha.module').then(
        (m) => m.RecuperarSenhaModule
      ),
    data: { template: PageTemplates.FULLSCREEN },
  },
  {
    path: 'carrinho',
    canActivate: [AuthGuard],
    loadChildren: () =>
      import('@modules/carrinho/carrinho.module').then((m) => m.CarrinhoModule),
  },
  {
    path: 'notificacoes',
    canActivate: [AuthGuard],
    loadChildren: () =>
      import('@modules/notificacoes/notificacoes.module').then(
        (m) => m.NotificacoesModule
      ),
  },
  {
    path: 'credito',
    canActivate: [AuthGuard],
    loadChildren: () =>
      import('@modules/credito/credito.module').then((m) => m.CreditoModule),
  },
  {
    path: 'pagina',
    loadChildren: () =>
      import('./modules/pagina/pagina.module').then((m) => m.PaginaModule),
    data: { template: PageTemplates.NO_CONTAINER },
  },
  {
    path: 'busca',
    loadChildren: () =>
      import('@modules/busca/busca.module').then((m) => m.BuscaModule),
    data: { template: PageTemplates.NO_WRAPPER },
  },
  {
    path: 'busca-produto',
    component: BuscaProdutoComponent,
    data: { template: PageTemplates.NO_CONTAINER },
  },
  {
    path: 'busca-produto',
    loadChildren: () =>
      import('@modules/busca-produto/busca-produto.module').then(
        (m) => m.BuscaProdutoModule
      ),
  },

  {
    path: '**',
    loadChildren: () =>
      import('./modules/not-found/not-found.module').then(
        (m) => m.NotFoundModule
      ),
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      anchorScrolling: 'enabled',
      scrollPositionRestoration: 'enabled',
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
