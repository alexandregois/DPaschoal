import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { ProdutoCardModule } from '@shared/components/produto-card/produto-card.module';
import { GaleriaFotosProdutoComponent } from './components/galeria-fotos-produto/galeria-fotos-produto.component';
import { GaleriaSimilaresProdutoComponent } from './components/galeria-similares-produto/galeria-similares-produto.component';
import { ModalInconsistenciaProdutoComponent } from './components/modal-inconsistencia-produto/modal-inconsistencia-produto.component';

import { ProdutosRoutingModule } from './produtos-routing.module';
import { ProdutosComponent } from './produtos.component';
import { ProdutoComponent } from './produto/produto.component';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatDialogModule } from '@angular/material/dialog';
import { GaleriaVideosProdutoComponent } from './components/galeria-videos-produto/galeria-videos-produto.component';
import { AcoesProdutoComponent } from './components/acoes-produto/acoes-produto.component';
import { FavoritoButtonModule } from '@shared/components/favorito-button/favorito-button.module';

import { FormPayZenModule } from '@shared/components/form-pay-zen/form-pay-zen.module';
@NgModule({
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  declarations: [
    ProdutosComponent,
    ProdutoComponent,
    GaleriaFotosProdutoComponent,
    GaleriaVideosProdutoComponent,
    GaleriaSimilaresProdutoComponent,
    ModalInconsistenciaProdutoComponent,
    AcoesProdutoComponent,
  ],
  imports: [
    SharedModule,
    ProdutosRoutingModule,
    MatExpansionModule,
    MatDialogModule,
    ProdutoCardModule,
    FavoritoButtonModule,
    FormPayZenModule,
  ],
})
export class ProdutosModule {}
