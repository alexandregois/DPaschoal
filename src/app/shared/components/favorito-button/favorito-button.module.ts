import { SharedModule } from '@shared/shared.module';
import { NgModule } from '@angular/core';
import { FavoritoButtonComponent } from './favorito-button.component';

@NgModule({
  declarations: [FavoritoButtonComponent],
  imports: [SharedModule],
  exports: [FavoritoButtonComponent],
})
export class FavoritoButtonModule {}
