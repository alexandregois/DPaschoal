import { DocumentacaoEntregaModalComponent } from './../../components/documentacao-entrega-modal/documentacao-entrega-modal.component';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ThemePalette } from '@angular/material/core';
import {
  CentroDistribuicao,
  CentrosDistribuicao,
  Garantia,
  ProdutoDocument,
  RetornoProdutoDocument,
} from '@models/warranty.model';
import { GarantiaService } from '../garantia.service';

@Component({
  selector: 'app-etapa-entrega',
  templateUrl: './etapa-entrega.component.html',
  styleUrls: ['./etapa-entrega.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EtapaEntregaComponent implements OnInit {
  @Input()
  garantia!: Garantia;
  @Input()
  centros!: CentrosDistribuicao;

  stepAtual = 0;
  colorStepOne: ThemePalette = 'warn';
  labelStepOne = 'Aguardando entrega de produto';
  statusStepOne = 'Pendente';
  statusSteptwo = '';
  stepDescription = '';
  stepDescriptionDetail = '';

  colorStepTwo: ThemePalette = 'warn';
  optionalStepTwo = true;

  centro!: CentroDistribuicao;

  isLoadingDoc: boolean = false;
  listaDocumentacao!: Array<RetornoProdutoDocument>;

  constructor(
    public dialog: MatDialog,
    public service: GarantiaService,
    private readonly cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.verificaStatus();
  }

  verificaStatus(): void {
    if (this.garantia) {
      if (this.garantia.stepDescription === 'Aguardando entrega') {
        this.stepAtual = 0;
        this.buscarDocumentos();
        this.preencherDadosCD();
      } else {
        this.stepAtual = 1;
        this.trataDescricoes();
      }
    }
  }

  buscarDocumentos(): void {
    this.isLoadingDoc = true;
    let params: ProdutoDocument = {
      cdId: this.garantia.warrantyWarehouse.sapCode,
      material: [],
    };
    let itens = this.garantia?.warrantyItemNavigation;
    for (var i in itens) {
      params.material.push(itens[i].productCode);
    }
    this.service.getDocumentos(params).subscribe({
      next: (resp) => {
        this.listaDocumentacao = resp;
      },
      complete: () => {
        this.isLoadingDoc = false;
        this.cdr.markForCheck();
      },
    });
  }

  preencherDadosCD() {
    this.centro = this.centros?.etCentro.filter(
      (cd) => cd.id.toString() === this.garantia.warrantyWarehouse.sapCode
    )[0];
  }

  trataDescricoes() {
    switch (this.garantia.stepDescription) {
      case 'Improcedente': {
        this.stepDescription = 'Garantia improcedente';
        this.stepDescriptionDetail =
          'Item diferente do produto informado na nota fiscal.';
        break;
      }
      case 'Falta documentação': {
        this.stepDescription = 'Falta documentação';
        this.stepDescriptionDetail =
          'Aguardando o envido da documentação necessária por parte do cliente.';
        break;
      }
      case 'Em conferência': {
        this.stepDescription = 'Em conferência';
        this.stepDescriptionDetail = 'Processo em conferência física no CD.';
        break;
      }
      case 'Recusada': {
        this.stepDescription = 'Recusada';
        this.stepDescriptionDetail = 'Garantia recusada.';
        break;
      }
      default: {
        this.stepDescription = 'Garantia improcedente';
        this.stepDescriptionDetail =
          'Item diferente do produto informado na nota fiscal.';
        break;
      }
    }
  }

  openModalDocumentos() {
    this.dialog.open(DocumentacaoEntregaModalComponent, {
      data: this.listaDocumentacao,
      width: '800px',
    });
  }
}
