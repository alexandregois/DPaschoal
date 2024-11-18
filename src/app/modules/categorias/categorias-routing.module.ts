import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CategoriasComponent } from './categorias.component';
import { CategoriasViewResolver } from './resolvers/categorias-view.resolver';

const routes: Routes = [
  {
    path: '',
    resolve: { pageview: CategoriasViewResolver },
    component: CategoriasComponent,
    pathMatch: 'full',
  },
  {
    path: ':categoria',
    resolve: { pageview: CategoriasViewResolver },
    component: CategoriasComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CategoriasRoutingModule {}
