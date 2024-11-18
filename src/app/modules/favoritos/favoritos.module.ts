import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { ProdutoCardModule } from '@shared/components/produto-card/produto-card.module';
import { FavoritosRoutingModule } from './favoritos-routing.module';
import { FavoritosComponent } from './favoritos.component';
import { MatPaginatorModule } from '@angular/material/paginator';

@NgModule({
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  declarations: [FavoritosComponent],
  imports: [SharedModule, FavoritosRoutingModule, ProdutoCardModule],
  providers: [
    {
      provide: MatPaginatorIntl,
      useClass: FavoritosComponent,
    },
  ],
})
export class FavoritosModule {}
