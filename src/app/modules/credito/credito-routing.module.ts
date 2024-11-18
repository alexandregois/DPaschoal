import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PageviewResolver } from '@shared/resolvers/page-view.resolver';
import { CreditoComponent } from './credito.component';

const routes: Routes = [
  {
    path: '',
    title: 'Solicitar limite de crédito',
    data: {
      subtitle:
        'Para solicitar limite de crédito você deve nos enviar as informações abaixo:',
    },
    resolve: { pageview: PageviewResolver },
    component: CreditoComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CreditoRoutingModule {}
