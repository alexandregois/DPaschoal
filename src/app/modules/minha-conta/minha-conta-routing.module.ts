import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MinhaContaComponent } from './minha-conta.component';

const routes: Routes = [
  { path: '', title: 'Minha conta', component: MinhaContaComponent },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MinhaContaRoutingModule {}
