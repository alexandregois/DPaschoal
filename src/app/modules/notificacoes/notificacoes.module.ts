import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { NotificacoesComponent } from './notificacoes.component';

import { NotificacaoTipoIconeDirective } from './directives/notificacao-tipo-icone.directive';

import { NotificacaoCardComponent } from './components/notificacao-card/notificacao-card.component';

import { NotificacoesRoutingModule } from './notificacoes-routing.module';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

@NgModule({
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  declarations: [
    NotificacoesComponent,
    NotificacaoCardComponent,
    NotificacaoTipoIconeDirective,
  ],
  imports: [SharedModule, NotificacoesRoutingModule],
  providers: [
    {
      provide: MatPaginatorIntl,
      useClass: NotificacoesComponent,
    },
  ],
})
export class NotificacoesModule {}
