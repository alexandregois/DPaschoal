import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PageviewResolver } from '@shared/resolvers/page-view.resolver';
import { FavoritosComponent } from './favoritos.component';

const routes: Routes = [
  {
    path: '',
    title: 'Favoritos',
    data: {
      subtitle: 'Aqui estão os produtos que você adicionou como favoritos!',
    },
    resolve: { pageview: PageviewResolver },
    component: FavoritosComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FavoritosRoutingModule {}
