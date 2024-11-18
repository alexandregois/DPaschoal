import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NotFoundComponent } from './not-found.component';
import { NotFoundResolver } from './resolvers/not-found.resolver';

const routes: Routes = [
  {
    path: '',
    title: 'Página não encontrada',
    resolve: { pageview: NotFoundResolver },
    component: NotFoundComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NotFoundRoutingModule {}
