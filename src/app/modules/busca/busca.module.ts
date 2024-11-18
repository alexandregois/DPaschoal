import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';

import { BuscaRoutingModule } from './busca-routing.module';
import { BuscaComponent } from './busca.component';

@NgModule({
  declarations: [BuscaComponent],
  imports: [SharedModule, BuscaRoutingModule],
})
export class BuscaModule {}
