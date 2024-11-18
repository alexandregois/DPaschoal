import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BuscaComponent } from './busca.component';
import { BuscaViewResolver } from './resolvers/busca-view.resolver';

const routes: Routes = [
  {
    path: '',
    resolve: { pageview: BuscaViewResolver },
    component: BuscaComponent,
  },
  {
    path: ':busca',
    resolve: { pageview: BuscaViewResolver },
    component: BuscaComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BuscaRoutingModule {}
