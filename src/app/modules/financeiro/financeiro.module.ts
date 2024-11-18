import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';

import { FinanceiroRoutingModule } from './financeiro-routing.module';
import { FinanceiroComponent } from './financeiro.component';
import { TabEmAbertoComponent } from './tab-em-aberto/tab-em-aberto.component';
import { TabPagosComponent } from './tab-pagos/tab-pagos.component';

@NgModule({
  declarations: [FinanceiroComponent, TabEmAbertoComponent, TabPagosComponent],
  imports: [SharedModule, FinanceiroRoutingModule],
})
export class FinanceiroModule {}
