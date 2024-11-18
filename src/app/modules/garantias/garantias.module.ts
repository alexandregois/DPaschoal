import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { SharedModule } from '@shared/shared.module';

import { GarantiasRoutingModule } from './garantias-routing.module';
import { GarantiasComponent } from './garantias.component';
import { GarantiaComponent } from './garantia/garantia.component';
import { EtapaSolicitacaoComponent } from './garantia/etapa-solicitacao/etapa-solicitacao.component';
import { EtapaNotaFiscalComponent } from './garantia/etapa-nota-fiscal/etapa-nota-fiscal.component';
import { EtapaEntregaComponent } from './garantia/etapa-entrega/etapa-entrega.component';
import { EtapaCreditoComponent } from './garantia/etapa-credito/etapa-credito.component';
import { NotasProdutoSelecionadoCardComponent } from './components/notas-produto-selecionado-card/notas-produto-selecionado-card.component';
import { EspelhoNotaComponent } from './components/espelho-nota/espelho-nota.component';
import { EspelhoNotaModalComponent } from './components/espelho-nota-modal/espelho-nota-modal.component';
import { DocumentacaoEntregaModalComponent } from './components/documentacao-entrega-modal/documentacao-entrega-modal.component';
import { ProdutoBuscaCardComponent } from './components/produto-busca-card/produto-busca-card.component';
import { ProdutoQuantidadeCardComponent } from './components/produto-quantidade-card/produto-quantidade-card.component';
import { ProdutosSelecionadosCardComponent } from './components/produtos-selecionados-card/produtos-selecionados-card.component';
import { FalhaArquivoModalComponent } from './components/falha-arquivo-modal/falha-arquivo-modal.component';
import { ProdutoSemGarantiaModalComponent } from './components/produto-sem-garantia-modal/produto-sem-garantia-modal.component';

@NgModule({
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  declarations: [
    GarantiasComponent,
    GarantiaComponent,
    EtapaSolicitacaoComponent,
    ProdutoBuscaCardComponent,
    ProdutoQuantidadeCardComponent,
    ProdutosSelecionadosCardComponent,
    NotasProdutoSelecionadoCardComponent,
    EtapaCreditoComponent,
    EtapaNotaFiscalComponent,
    EspelhoNotaComponent,
    EspelhoNotaModalComponent,
    EtapaEntregaComponent,
    DocumentacaoEntregaModalComponent,
    FalhaArquivoModalComponent,
    ProdutoSemGarantiaModalComponent,
  ],
  imports: [SharedModule, MatButtonToggleModule, GarantiasRoutingModule],
})
export class GarantiasModule {}
