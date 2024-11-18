import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PageviewResolver } from '@shared/resolvers/page-view.resolver';
import { NotificacoesComponent } from './notificacoes.component';

const routes: Routes = [
  {
    path: '',
    title: 'Notificações',
    resolve: { pageview: PageviewResolver },
    component: NotificacoesComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NotificacoesRoutingModule {}
