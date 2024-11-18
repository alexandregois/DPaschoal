import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PageviewResolver } from '@shared/resolvers/page-view.resolver';
import { GarantiaComponent } from './garantia/garantia.component';
import { GarantiasComponent } from './garantias.component';

const routes: Routes = [
  {
    path: '',
    title: 'Garantia',
    resolve: { pageview: PageviewResolver },
    component: GarantiasComponent,
  },
  {
    path: ':garantia',
    title: 'Garantia',
    resolve: { pageview: PageviewResolver },
    component: GarantiaComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GarantiasRoutingModule {}
