import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BuscaProdutoComponent } from './busca-produto.component';
import { SharedModule } from '@shared/shared.module';
import { CoreModule } from '@core/core.module';
import { FavoritoButtonModule } from '@shared/components/favorito-button/favorito-button.module';

@NgModule({
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  declarations: [BuscaProdutoComponent],
  imports: [CommonModule, SharedModule, CoreModule, FavoritoButtonModule],
})
export class BuscaProdutoModule {}
