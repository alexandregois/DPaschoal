import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PageviewResolver } from '@shared/resolvers/page-view.resolver';
import { ContatoComponent } from './contato.component';

const routes: Routes = [
  {
    path: '',
    title: 'Contato',
    resolve: { pageview: PageviewResolver },
    component: ContatoComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ContatoRoutingModule {}
