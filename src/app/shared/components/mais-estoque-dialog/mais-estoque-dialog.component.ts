import { MaisEstoqueDialogService } from './mais-estoque-dialog.service';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Inject,
  OnInit,
} from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { EventsApiService } from '@core/services/events-api.service';
import { PriceResponseDto } from '@generated/api/dpk-price-svc';
import { Warehouse } from '@models/deposito.model';
import { SnackBarColorService } from '@shared/services/snackbarColor.service';
import { StoreService } from '@shared/services/store.service';
import { catchError, finalize, forkJoin, Observable, of } from 'rxjs';

export interface CentroDistribuicao {
  store: Warehouse;
  productId: number;
  sapCode: number;
  portal: string;
  estoque: number | undefined;
  item: CentroDistribuicaoItem;
  loading: boolean;
}

export interface CentroDistribuicaoItem {
  quantidade: number;
  quantidadeMin: number;
  valor: number;
}

@Component({
  selector: 'app-mais-estoque-dialog',
  templateUrl: './mais-estoque-dialog.component.html',
  styleUrls: ['./mais-estoque-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MaisEstoqueDialogComponent implements OnInit {
  hide: boolean = false;
  isLoadingPrices: boolean = true;
  cds: Array<CentroDistribuicao> = [];
  stores: CentroDistribuicao[] = [];

  constructor(
    @Inject(MAT_DIALOG_DATA) public dataParam: any,
    private eventsApi: EventsApiService,
    private service: MaisEstoqueDialogService,
    private storeService: StoreService,
    private snackBar: MatSnackBar,
    private readonly cdr: ChangeDetectorRef,
    private snackbarColorService: SnackBarColorService
  ) {}

  ngOnInit(): void {
    this.getStores();
  }

  private getStores() {
    let warehouses = this.storeService.getData('warehouse').getValue();
    warehouses?.forEach((wh) => {
      let cd: CentroDistribuicao = {
        store: wh,
        productId: this.dataParam?.produtoId,
        sapCode: this.dataParam?.produtoErpId,
        portal: wh.retailerId === 1 ? 'KDP' : 'DPK',
        estoque: 0,
        item: {
          quantidade: 0,
          quantidadeMin: 0,
          valor: 0,
        },
        loading: true,
      };
      this.cds.push(cd);
    });
    this.getPrices();
  }

  private getPrices() {
    this.cds?.forEach(async (cd, index) => {
      let listSapCodes: Array<number> = [];
      listSapCodes.push(
        this.dataParam?.produtoErpId ? this.dataParam?.produtoErpId : 0
      );
      if (cd?.store.priceId) {
        var params = {
          storeCode: cd.store.priceId,
          storePortal: cd.portal,
          sapCodes: listSapCodes,
        };
        this.service
          .buscarPrecoProduto(params)
          .pipe(
            finalize(() => {
              this.cdr.markForCheck();
            })
          )
          .subscribe({
            next: async (result) => {
              if (result && result[0]) {
                let price = result[0];
                await this.atualizarLista(index, price);
              } else {
                this.atualizarLista(index, undefined);
              }
              if (result[0] !== null && result[0] !== undefined) {
                this.isLoadingPrices = false;
              }
            },
            error: () => {
              this.snackBar.open(
                'Erro ao consultar o preço no depósito ' + cd.store.description,
                'Ok',
                this.snackbarColorService.getSnackBarConfig()
              );
            },
          });
      }
    });
  }

  async atualizarLista(index: number, price: PriceResponseDto | undefined) {
    if (price === undefined) {
      this.cds[index].estoque = 0;
      this.cds[index].item = {
        quantidade: 0,
        quantidadeMin: 0,
        valor: 0,
      };
      this.cds[index].loading = false;
    } else {
      this.cds[index].estoque = price.stock;
      this.cds[index].item = {
        quantidade: 0,
        quantidadeMin: price.minimumBuy!,
        valor: price.price! + price.icms!,
      };
      this.cds[index].loading = false;
    }
  }

  updateItemQuantidade(item: CentroDistribuicaoItem, quantidade: number) {
    item.quantidade = quantidade;
  }

  addToItemsToCart() {
    this.cds.forEach((cd) => {
      let item = cd.item;

      if (item.quantidade !== undefined && item.quantidade > 0) {
        if (cd?.productId && cd.store.priceId && cd?.sapCode) {
          this.eventsApi.addProductToCart({
            data: {
              produtoId: cd.productId,
              produtoQtd: item.quantidade,
              depositoId: cd.store.id,
              produtoErpId: cd.sapCode,
            },
          });
        }
      }
    });
  }
}
