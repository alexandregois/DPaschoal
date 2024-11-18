import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';

import { PerguntasFrequentesRoutingModule } from './perguntas-frequentes-routing.module';
import { PerguntasFrequentesComponent } from './perguntas-frequentes.component';

@NgModule({
  declarations: [PerguntasFrequentesComponent],
  imports: [SharedModule, PerguntasFrequentesRoutingModule],
})
export class PerguntasFrequentesModule {}
