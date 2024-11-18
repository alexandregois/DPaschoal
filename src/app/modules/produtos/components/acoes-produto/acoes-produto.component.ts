import { ChangeDetectionStrategy, Component, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { EventsApiService } from '@core/services/events-api.service';
import { SessionService } from '@core/services/session.service';
import { environment } from '@env';
import { PriceResponseDto } from '@generated/api/dpk-price-svc/model/priceResponseDto';
import { HttpClient } from '@angular/common/http';
import { StoreService } from '@shared/services/store.service';

@Component({
  selector: 'app-acoes-produto',
  templateUrl: './acoes-produto.component.html',
  styleUrls: ['./acoes-produto.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AcoesProdutoComponent implements OnChanges {
  isLoading: boolean = true;
  portal = environment.portal;

  constructor(
    private eventsApi: EventsApiService,
    private session: SessionService,
    private http: HttpClient,
    private store: StoreService // Injetando o StoreService
  ) {}

  @Input()
  estoque: PriceResponseDto | undefined;

  @Input()
  produtoId: number | undefined;

  @Input()
  sapCode: number | undefined;

  @Input()
  isSimilares: boolean | null | undefined = false;

  @Input()
  isLogged!: boolean;

  @Input()
  isAddingCart!: boolean;

  @Output()
  valorTotal = new EventEmitter<number>();

  @Output()
  similares = new EventEmitter();

  @Output()
  addCarrinho = new EventEmitter<number>();

  qtd: number = 0;
  maxQtd: number = 0;
  minQtd: number = 0;
  isLoadingPrice: boolean = true;

  ngOnChanges() {
    this.isLoading = false;
    this.isLoadingPrice = true;
    if (this.estoque !== undefined) {
      if (this.estoque.minimumBuy) {
        this.qtd = this.estoque.minimumBuy;
        this.minQtd = this.estoque.minimumBuy;
      }
      if (this.estoque.stock) {
        this.maxQtd = this.estoque.stock;
      }
      this.isLoadingPrice = false;
    }
  }

  atualizarValorProduto(qtd: number): void {
    this.qtd = qtd;
    if (this.estoque?.price && this.estoque?.icms) {
      var calculo = (this.estoque.price + this.estoque?.icms) * this.qtd;
      this.valorTotal.emit(calculo);
    }
  }

  adicionarCarrinho(): void {
    this.addCarrinho.emit(this.qtd);
  }

  verPreco(): void {
    this.isLogged
      ? undefined
      : this.session.logout(true, true, `/produtos/${this.produtoId}`);
  }

  aviseMe(): void {
    if (!this.produtoId || !this.estoque) {
      return;
    }
    const fullApiUrl = `${environment.apiProdutos}/api/products/${this.produtoId}/notify-available`;
    const headers = {
      'x-portal': this.portal,
    };

    const payload: any = {};

    const warehouse = this.store.getSelected('warehouse').value;
    if (warehouse) {
      payload.priceId = warehouse.priceId;
      payload.idRetailer = warehouse.retailerId;
    }

    this.http.post(fullApiUrl, payload, { headers: headers }).subscribe(
      (response: any) => {
        if (response.result) {
          alert('Produto inserido na sua lista de Avise-me com sucesso');
        } else {
          alert('Produto inserido na sua lista de Avise-me com sucesso');
        }
      },
      (error) => {
        alert('Produto inserido na sua lista de Avise-me com sucesso');
      }
    );
  }

  verSimilares(): void {
    this.similares.emit();
  }

  maisEstoques(): void {
    if (!this.produtoId || !this.sapCode) {
      return;
    }
    this.eventsApi.viewCDByProduct({
      data: {
        produtoId: this.produtoId,
        produtoErpId: this.sapCode,
      },
    });
  }
}
