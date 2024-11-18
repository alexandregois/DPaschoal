import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PageviewResolver } from '@shared/resolvers/page-view.resolver';
import { PerguntasFrequentesComponent } from './perguntas-frequentes.component';

const routes: Routes = [
  {
    path: '',
    title: 'Perguntas frequentes',
    resolve: { pageview: PageviewResolver },
    component: PerguntasFrequentesComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PerguntasFrequentesRoutingModule {}
