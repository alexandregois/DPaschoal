import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PageviewResolver } from '@shared/resolvers/page-view.resolver';
import { RecuperarSenhaComponent } from './recuperar-senha.component';

const routes: Routes = [
  {
    path: '',
    title: 'Recuperar senha',
    resolve: { pageview: PageviewResolver },
    component: RecuperarSenhaComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RecuperarSenhaRoutingModule {}
