import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PageviewResolver } from '@shared/resolvers/page-view.resolver';
import { FinanceiroComponent } from './financeiro.component';

const routes: Routes = [
  {
    path: '',
    title: 'Financeiro',
    resolve: { pageview: PageviewResolver },
    component: FinanceiroComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FinanceiroRoutingModule {}
