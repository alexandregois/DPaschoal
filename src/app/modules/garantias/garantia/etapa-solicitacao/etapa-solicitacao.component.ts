import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import {
  CentroDistribuicao,
  CentrosDistribuicao,
  GarantiaCreat,
  GarantiaCreatItem,
  GarantiaCreatNotaCompraProduto,
  GarantiaOrigin,
  ProdutoBusca,
  ProdutoNota,
  RetornoGarantiaOrigin,
} from '@models/warranty.model';
import { MatDialog } from '@angular/material/dialog';
import { ProdutoSemGarantiaModalComponent } from '@modules/garantias/components/produto-sem-garantia-modal/produto-sem-garantia-modal.component';
import { StoreService } from '@shared/services/store.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { GarantiaService } from '../garantia.service';
import { SnackBarColorService } from '@shared/services/snackbarColor.service';

@Component({
  selector: 'app-etapa-solicitacao',
  templateUrl: './etapa-solicitacao.component.html',
  styleUrls: ['./etapa-solicitacao.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EtapaSolicitacaoComponent implements OnInit {
  @Input()
  customerIsento!: boolean;
  @Input()
  customerSapCode!: number;
  @Input()
  centros!: CentrosDistribuicao;

  isBusca: boolean = true;
  isResultadoBusca: boolean = false;
  isBuscando: boolean = false;
  isSelecaoQuantidade: boolean = false;
  isItensSelecionados: boolean = false;
  isRevisaoGarantia: boolean = false;
  isBuscandoNotas: boolean = false;
  isSubmittingWarranty: boolean = false;

  timeout: ReturnType<typeof setTimeout> | undefined;

  formGroup = this._formBuilder.group({
    center: [null as CentroDistribuicao | null, Validators.required],
    termoBusca: ['' as string],
  });

  listaProdutosBusca!: Array<ProdutoBusca>;

  selectedProduct!: ProdutoBusca | null;

  listSelectedProduct: Array<ProdutoBusca> = [];

  listProductNotes: Array<ProdutoNota> = [];

  protocolo!: number;

  isSubmittingRequest: boolean = false;

  constructor(
    private _formBuilder: FormBuilder,
    public serviceWarranty: GarantiaService,
    public dialog: MatDialog,
    private readonly cdr: ChangeDetectorRef,
    private store: StoreService,
    private snackBar: MatSnackBar,
    private router: Router,
    private snackbarColorService: SnackBarColorService
  ) {}

  ngOnInit(): void {
    this.formGroup.get('termoBusca')?.valueChanges.subscribe((termo) => {
      if (this.formGroup.controls.center.invalid) {
        this.formGroup.controls.center.markAsTouched();
        this.formGroup.get('termoBusca')?.setValue('');
        return;
      } else if (termo && termo.length > 2) {
        this.isResultadoBusca = true;
        this.isBuscando = true;
        clearTimeout(this.timeout);
        this.timeout = setTimeout(() => {
          this.buscarProduto(termo!);
        }, 700);
      }
    });
  }

  buscarProduto(termo: string): void {
    this.serviceWarranty.pesquisarProdutos(termo).subscribe({
      next: (resp) => {
        this.listaProdutosBusca = resp;
      },
      complete: () => {
        this.isBuscando = false;
        this.cdr.markForCheck();
      },
    });
  }

  selecionarProduto(produto: ProdutoBusca, consultar: boolean): void {
    if (consultar) {
      this.serviceWarranty.pesquisarMaterial(produto.id.toString()).subscribe({
        next: (resp) => {
          if (resp.etReturn && resp.etReturn.message.includes('FABRICANTE')) {
            this.dialog.open(ProdutoSemGarantiaModalComponent, {
              data: produto.fabricante,
              width: '25vw',
            });
          } else {
            produto.quantidadeSelecionada = 1;
            this.isBusca = false;
            this.isResultadoBusca = false;
            this.selectedProduct = produto;
            this.isSelecaoQuantidade = true;
          }
        },
        complete: () => {
          this.formGroup.get('termoBusca')?.setValue('');
          this.formGroup.get('center')?.disable();
          this.cdr.markForCheck();
        },
      });
    } else {
      this.selectedProduct = produto;
      this.isBusca = false;
      this.isResultadoBusca = false;
      this.isSelecaoQuantidade = true;
      this.isRevisaoGarantia = false;
    }
  }

  voltarParaBusca(): void {
    this.isSelecaoQuantidade = false;
    this.selectedProduct = null;
    this.isBusca = true;
    this.isResultadoBusca = false;
    if (this.listSelectedProduct.length > 0) {
      this.isItensSelecionados = true;
    }
  }

  adicionarMais(produto: ProdutoBusca): void {
    this.atualizaListaProdutos(produto, false);
    this.isSelecaoQuantidade = false;
    this.selectedProduct = null;
    this.isBusca = true;
    this.isResultadoBusca = false;
    this.isItensSelecionados = true;
  }

  atualizaProdutoSelecionado(produtoDto: ProdutoBusca): void {
    this.selectedProduct = produtoDto;
  }

  atualizaListaProdutos(produtoDto: ProdutoBusca, finalizar: boolean): void {
    if (produtoDto != null) {
      // this.isSubmittingWarranty = true
      this.isBuscandoNotas = finalizar;
      var existente = false;
      var backup = this.listSelectedProduct;
      backup.map((prod) => {
        if (prod.id === produtoDto.id) {
          existente = true;
          prod.quantidadeSelecionada = produtoDto.quantidadeSelecionada;
        }
      });
      if (!existente) {
        backup.push(produtoDto);
        this.cdr.markForCheck();
      }

      this.listSelectedProduct = backup;
      this.listSelectedProduct = this.listSelectedProduct.slice();

      clearTimeout(this.timeout);
      setTimeout(() => {
        if (finalizar) {
          this.solicitarGarantia();
          this.cdr.markForCheck();
        }
      }, 100);
    } else {
      this.solicitarGarantia();
      this.cdr.markForCheck();
    }
  }

  removeProdutoLista(productId: number): void {
    this.listSelectedProduct = this.listSelectedProduct.filter(
      (elm) => elm.id != productId
    );
    if (this.listSelectedProduct.length === 0) {
      this.isItensSelecionados = false;
      this.formGroup.get('center')?.enable();
    }
  }

  solicitarGarantia(): void {
    this.isSubmittingWarranty = true;
    this.isBuscandoNotas = true;
    let prods = this.listSelectedProduct;
    var listProdsEnvio: Array<{
      sapMaterialCode: string;
      sourceInvoiceNumber: string;
      itemQuantity: string;
    }> = [];
    for (var i in prods) {
      listProdsEnvio.push({
        sapMaterialCode: prods[i].codigoSap.padStart(18, '0'),
        sourceInvoiceNumber: '',
        itemQuantity: prods[i].quantidadeSelecionada!.toString(),
      });
    }
    var envio: GarantiaOrigin = {
      correlationId: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
      origin: this.formGroup.get('center')?.value?.id.toString()!,
      document: this.store.getSelected('cnpj').value!,
      itItens: listProdsEnvio,
    };
    this.serviceWarranty.getNotasProdutos(envio).subscribe({
      next: (resp) => {
        if (resp.etReturn?.type === 'E') {
          this.tratarRetornoParcial(resp);
        } else {
          if (resp.itHeaderReponse) {
            this.customerSapCode = resp.itHeaderReponse[0].clientSapCode;
            var notes = resp.etItemResponseList;
            this.listProductNotes = [];
            for (var i in this.listSelectedProduct) {
              this.listProductNotes.push({
                produto: this.listSelectedProduct[i],
                notas: notes.filter(
                  (elm) =>
                    elm.numMaterial?.toString() ===
                    this.listSelectedProduct[i].codigoSap.padStart(18, '0')
                ),
              });
            }

            this.isBusca = false;
            this.isItensSelecionados = false;
            this.isRevisaoGarantia = true;
          } else {
            this.snackBar.open(
              'Erro ao consultar notas do(s) produto(s)',
              'Ok',
              {
                verticalPosition: 'top',
                ...this.snackbarColorService.getSnackBarConfig(),
              }
            );
          }
        }
      },
      complete: () => {
        this.isResultadoBusca = false;
        this.isSelecaoQuantidade = false;
        this.isBuscandoNotas = false;
        this.selectedProduct = null;
        this.isSubmittingRequest = false;
        this.isSubmittingWarranty = false;
        this.cdr.markForCheck();
      },
    });
  }

  tratarRetornoParcial(retorno: RetornoGarantiaOrigin): void {
    this.isBusca = true;
    const itens = retorno.etItemResponseList;
    const err = retorno.etReturn!;
    let bkp_list = this.listSelectedProduct;
    this.listSelectedProduct = err.message.includes(
      'Quantidade solicitada maior'
    )
      ? []
      : this.listSelectedProduct;
    let msg = err.message.split(' | ');
    for (let i in msg) {
      if (msg[i].includes('Quantidade solicitada maior')) {
        let submsg = msg[i].split(' ');
        let numMaterial = submsg[submsg.length - 1];
        let notasItem = itens.filter((elm) => elm.numMaterial === numMaterial);
        var somaQtd = 0;
        notasItem.forEach((item) => {
          somaQtd += parseInt(item.quantity!.split('.')[0]);
        });
        var produto = bkp_list.filter(
          (elm) => parseInt(elm.codigoSap) === parseInt(numMaterial)
        )[0];
        produto.quantidadeSelecionada = somaQtd;

        this.listSelectedProduct.push(produto);
      } else if (
        msg[i].includes(
          'Sem notas de compra para o cliente no centro informado'
        )
      ) {
        this.listSelectedProduct = this.listSelectedProduct.filter(
          (elm) => elm.codigoSap != bkp_list[i].codigoSap
        );
      }
    }

    if (retorno.itHeaderReponse) {
      this.customerSapCode = retorno.itHeaderReponse[0].clientSapCode;
      var notes = retorno.etItemResponseList;
      if (this.listSelectedProduct.length === 0) {
        this.listProductNotes = [];
        for (var i in bkp_list) {
          var notasItem = notes.filter(
            (elm) =>
              elm.numMaterial?.toString() ===
              bkp_list[i].codigoSap.padStart(18, '0')
          );
          if (notasItem) {
            this.listProductNotes.push({
              produto: bkp_list[i],
              notas: notasItem,
            });
          }
        }

        this.isBusca = false;
        this.isItensSelecionados = false;
        this.isRevisaoGarantia = true;
      } else {
        for (var i in bkp_list) {
          var temNota: boolean =
            notes.filter(
              (elm) =>
                elm.numMaterial?.toString() ===
                bkp_list[i].codigoSap.padStart(18, '0')
            ).length > 0;
          var taNaLista: boolean =
            this.listSelectedProduct.filter(
              (elm) => elm.codigoSap === bkp_list[i].codigoSap
            ).length > 0;
          if (temNota && !taNaLista) {
            this.listSelectedProduct.push(bkp_list[i]);
          } else if (!temNota) {
            this.listSelectedProduct = this.listSelectedProduct.filter(
              (elm) => elm.codigoSap != bkp_list[i].codigoSap
            );
          }
        }
      }
    }

    this.isItensSelecionados = this.listSelectedProduct.length > 0;
    if (!this.isItensSelecionados) {
      this.formGroup.get('center')?.enable();
    }

    this.snackBar.open(err.message, 'Ok', {
      verticalPosition: 'top',
      ...this.snackbarColorService.getSnackBarConfig(),
    });
  }

  confirmarGarantia(): void {
    this.isBuscandoNotas = true;
    let prods = this.listProductNotes;
    var listProdGarantia: Array<GarantiaCreatItem> = [];
    var listNotaProdGarantia: Array<GarantiaCreatNotaCompraProduto> = [];
    for (var i in prods) {
      for (var n in prods[i].notas) {
        let invoice = prods[i].notas[n].referenceInvoice!.split('-');
        listProdGarantia.push({
          sapMaterialCode: prods[i].produto.codigoSap,
          itemNumber: parseInt(n + 1),
          sourceInvoiceNumber: invoice[0],
          sourceInvoiceSeries: invoice[1],
          itemQuantity: prods[i].notas[n].quantity?.toString(),
          itemUnitPrice: prods[i].notas[n].unityValue!.toString(),
          invoiceOrigin: '',
        });
        let selectNote = prods[i].notas[n];
        (selectNote.origin = this.formGroup
          .get('center')
          ?.value?.id!.toString()),
          (selectNote.clientSapCode = this.customerSapCode!.toString());
        selectNote.invoiceNumber = parseInt(n + 1).toString();
        selectNote.invoiceDate = selectNote.docDataNf?.toString(); //MUDAR...
        selectNote.invoiceQuantity = parseInt(prods[i].notas[n].quantity!);
        selectNote.invoiceUnitPrice = prods[i].notas[n].unityValue!;

        listNotaProdGarantia.push(selectNote);
      }
    }
    var data = new Date(),
      dia = data.getDate().toString().padStart(2, '0'),
      mes = (data.getMonth() + 1).toString().padStart(2, '0'),
      ano = data.getFullYear();
    const dataAtual = dia + '.' + mes + '.' + ano;
    var garantia: GarantiaCreat = {
      token: '',
      correlationId: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
      sapCustomerCode: this.customerSapCode?.toString(),
      sapCenter: this.formGroup.get('center')?.value?.id.toString()!,
      emissionDate: dataAtual,
      itItens: listProdGarantia,
      warrantyWarehouse: {
        name: '',
        sapCode: this.formGroup.get('center')?.value?.id.toString(),
        address: '',
      },
      warrantyInvoice: listNotaProdGarantia,
    };
    this.serviceWarranty.gerarGarantia(garantia).subscribe({
      next: (resp) => {
        if (resp.etReturn?.type === 'S') {
          let parte = resp.etReturn?.message.split('( ');
          let subParte = parte[1].split(' )');
          this.protocolo = subParte[0];

          this.router.navigate(['/garantia', this.protocolo]).then(() => {
            location.reload();
          });
        } else if (resp.etReturn?.type === 'E') {
          this.snackBar.open(resp.etReturn.message, 'Ok', {
            verticalPosition: 'top',
            ...this.snackbarColorService.getSnackBarConfig(),
          });
        }
      },
      complete: () => {
        this.isBuscandoNotas = false;
        this.isSubmittingRequest = false;
        this.cdr.markForCheck();
      },
    });
  }
}
