import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';

import { CreditoRoutingModule } from './credito-routing.module';
import { CreditoComponent } from './credito.component';
import { InputMaskModule } from '@ngneat/input-mask';

@NgModule({
  declarations: [CreditoComponent],
  imports: [SharedModule, CreditoRoutingModule, InputMaskModule],
})
export class CreditoModule {}
