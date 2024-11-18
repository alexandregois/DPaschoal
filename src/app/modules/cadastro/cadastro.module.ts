import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';

import { CadastroRoutingModule } from './cadastro-routing.module';
import { CadastroComponent } from './cadastro.component';
import { PoliticaDeUsoDialogComponent } from './components/politica-de-uso-dialog/politica-de-uso-dialog.component';

@NgModule({
  declarations: [CadastroComponent, PoliticaDeUsoDialogComponent],
  imports: [SharedModule, CadastroRoutingModule],
})
export class CadastroModule {}
