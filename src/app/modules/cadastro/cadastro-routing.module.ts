import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PageviewResolver } from '@shared/resolvers/page-view.resolver';
import { CadastroComponent } from './cadastro.component';

const routes: Routes = [
  {
    path: '',
    title: 'Cadastro',
    resolve: { pageview: PageviewResolver },
    component: CadastroComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CadastroRoutingModule {}
