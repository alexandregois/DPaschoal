import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { RecuperarSenhaHeaderComponent } from './components/recuperar-senha-header/recuperar-senha-header.component';
import { FormatTimePipe } from './pipes/format-time.pipe';
import { RecuperarSenhaAlteracaoComponent } from './recuperar-senha-alteracao/recuperar-senha-alteracao.component';
import { RecuperarSenhaCodComponent } from './recuperar-senha-cod/recuperar-senha-cod.component';
import { RecuperarSenhaEmailComponent } from './recuperar-senha-email/recuperar-senha-email.component';
import { RecuperarSenhaRoutingModule } from './recuperar-senha-routing.module';
import { RecuperarSenhaSucessoComponent } from './recuperar-senha-sucesso/recuperar-senha-sucesso.component';
import { RecuperarSenhaComponent } from './recuperar-senha.component';

@NgModule({
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  declarations: [
    RecuperarSenhaComponent,
    RecuperarSenhaEmailComponent,
    RecuperarSenhaCodComponent,
    RecuperarSenhaAlteracaoComponent,
    RecuperarSenhaSucessoComponent,
    FormatTimePipe,
    RecuperarSenhaHeaderComponent,
  ],
  imports: [SharedModule, RecuperarSenhaRoutingModule],
})
export class RecuperarSenhaModule {}
