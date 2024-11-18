import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PaginaRoutingModule } from './pagina-routing.module';
import { PaginaComponent } from './pagina.component';

@NgModule({
  declarations: [PaginaComponent],
  imports: [CommonModule, PaginaRoutingModule],
})
export class PaginaModule {}
