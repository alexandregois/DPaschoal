import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';

import { MinhaContaRoutingModule } from './minha-conta-routing.module';
import { MinhaContaComponent } from './minha-conta.component';

@NgModule({
  declarations: [MinhaContaComponent],
  imports: [SharedModule, MinhaContaRoutingModule],
})
export class MinhaContaModule {}
