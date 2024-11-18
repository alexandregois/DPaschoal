import { SharedModule } from '@shared/shared.module';
import { ProdutoCardComponent } from './produto-card.component';
import { NgModule } from '@angular/core';
import { FavoritoButtonModule } from '../favorito-button/favorito-button.module';

@NgModule({
  declarations: [ProdutoCardComponent],
  imports: [SharedModule, FavoritoButtonModule],
  exports: [ProdutoCardComponent],
})
export class ProdutoCardModule {}
