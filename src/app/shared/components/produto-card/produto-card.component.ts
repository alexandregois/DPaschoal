import { ImageResponseDto } from '@generated/api/api-external-svc/model/imageResponseDto';
import { ProducDetailDto } from '@generated/api/api-external-svc/model/producDetailDto';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnChanges,
} from '@angular/core';
import { ProdutoService } from '@modules/produtos/produto/produto.service';
import { PriceResponseDto } from '@generated/api/dpk-price-svc/model/priceResponseDto';
import { EventsApiService } from '@core/services/events-api.service';
import { environment } from '@env';
import { SessionService } from '@core/services/session.service';
import { finalize } from 'rxjs';
import { StoreService } from '@shared/services/store.service';
import { StringService } from '@shared/services/string.service';
import { PortalService } from '@shared/services/portal.service';
import { EquivalentResponseDto } from '@generated/api/api-external-svc';

@Component({
  selector: 'app-produto-card',
  templateUrl: './produto-card.component.html',
  styleUrls: ['./produto-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProdutoCardComponent implements OnChanges {
  constructor(
    private service: ProdutoService,
    private events: EventsApiService,
    private cdr: ChangeDetectorRef,
    private session: SessionService,
    private store: StoreService,
    private stringService: StringService,
    private portalService: PortalService
  ) {}

  isLoadingWarehouse$ = this.store.getLoadingState('warehouse');
  warehouse$ = this.store.getSelected('warehouse');
  isAuth$ = this.session.getIsAuthSubject();
  portal = environment.portal;

  isLoadingPrice: boolean = true;
  routeProdutoDescription: string | undefined;
  isAddingCart: boolean = false;

  @Input()
  idProduct: number | undefined;
  @Input()
  Product: EquivalentResponseDto | undefined;
  @Input()
  isVisibleFavorite: boolean = true;

  produto: ProducDetailDto | undefined;
  price: PriceResponseDto | undefined;
  isSimilares: boolean | null | undefined = false;
  isDisponivel: boolean = false;

  imagem: ImageResponseDto | undefined;
  qtd: number = 0;
  minQtd: number = 0;
  maxQtd: number = 0;
  valorTotal: number = 0;
  isFavorito: boolean = false;
  environment = environment;
  distribuidoPor!: string;

  ngOnChanges() {
    this.isLoadingPrice = true;
    if (this.isVisibleFavorite) {
      this.getLocalProduto();
    } else {
      this.getProduto();
    }
  }

  private getLocalProduto() {
    if (this.Product?.equivalentProductDetail) {
      this.produto = this.Product.equivalentProductDetail;
      this.imagem = this.produto.image ? this.produto.image[0] : undefined;
      this.distribuidoPor = this.portalService.distribuidoPor(
        this.produto.product?.dpk
      );

      this.isSimilares =
        this.produto.equivalent && this.produto.equivalent.length > 0;

      if (this.produto.product?.description) {
        this.routeProdutoDescription = this.stringService.convertToFriendlyUrl(
          this.produto.product?.description
        );
      }
      this.warehouse$.subscribe(() => this.consultarPreco());
    }
  }

  private getProduto() {
    if (this.idProduct) {
      this.produto = undefined;
      this.service
        .buscarProduto(this.idProduct)
        .pipe(
          finalize(() => {
            this.cdr.markForCheck();
          })
        )
        .subscribe({
          next: (prod) => {
            this.produto = prod;
            this.imagem = prod.image ? prod.image[0] : undefined;
            this.distribuidoPor = this.portalService.distribuidoPor(
              prod.product?.dpk
            );

            this.isSimilares = prod.equivalent && prod.equivalent.length > 0;

            if (prod.product?.description) {
              this.routeProdutoDescription =
                this.stringService.convertToFriendlyUrl(
                  prod.product?.description
                );
            }
            this.warehouse$.subscribe(() => this.consultarPreco());
          },
        });
    }
  }

  private consultarPreco() {
    if (!this.produto || !this.warehouse$.value) {
      return;
    }
    this.price = undefined;
    if (
      this.produto.product?.sapCode === 'PN' ||
      this.produto.product?.sapCode === '0' ||
      this.produto.product?.sapCode === undefined
    ) {
      this.isDisponivel;
      this.isLoadingPrice = false;
      return;
    }

    if (this.produto.product?.sapCodeNumber === 0) return;
    this.events.viewProductPrice({
      data: {
        storeCode: this.warehouse$.value.id,
        arrProdutoErp: [this.produto.product?.sapCodeNumber] as number[],
      },
      callback: (price: PriceResponseDto[]) => {
        if (price.length > 0) {
          this.price = price[0];

          this.qtd = this.price.minimumBuy!;
          this.minQtd = this.price.minimumBuy!;
          this.maxQtd = this.price.stock!;

          this.valorTotal = (this.price.price || 0) + (this.price.icms || 0);

          if (
            this.price &&
            this.price.stock !== null &&
            this.price.stock !== undefined &&
            this.price.minimumBuy !== null &&
            this.price.minimumBuy !== undefined &&
            this.price.price
          ) {
            if (this.price.minimumBuy > 0) {
              this.isDisponivel =
                this.price.stock >= this.price.minimumBuy ? true : false;
            } else {
              this.isDisponivel = true;
            }
          }
        }
        this.isLoadingPrice = false;
        this.cdr.markForCheck();
      },
    });
  }

  atualizarValorProduto(qtd: number): void {
    this.qtd = qtd;
    this.valorTotal =
      ((this.price?.price || 0) + (this.price?.icms || 0)) * this.qtd;
  }

  adicionarAoCarrinho(): void {
    if (!this.produto?.product?.sapCodeNumber || !this.idProduct) {
      return;
    }
    this.isAddingCart = true;
    this.events.addProductToCart({
      data: {
        produtoId: this.idProduct,
        produtoErpId: this.produto?.product?.sapCodeNumber,
        produtoQtd: this.qtd,
        depositoId: this.warehouse$.getValue()?.id,
        code: this.produto?.product?.code,
        description: this.produto?.product?.description,
        manufacturer: this.produto?.product?.manufacturer,
      },
      callback: () => {
        this.isAddingCart = false;
        this.cdr.markForCheck();
      },
    });
  }

  aviseMe(): void {
    if (!this.idProduct) {
      return;
    }

    this.events.addProductToAlert({
      data: {
        produtoId: this.idProduct,
      },
    });
  }

  verSimilares(): void {
    if (!this.produto || !this.produto.product?.id) {
      return;
    }
    this.events.navigateToSimilarProducts({
      data: {
        produtoId: this.produto.product?.id,
        produtoDescription: this.produto.product?.description || undefined,
      },
    });
  }

  maisEstoques(): void {
    if (
      !this.produto ||
      !this.produto.product?.id ||
      !this.produto.product?.sapCodeNumber
    ) {
      return;
    }

    this.events.viewCDByProduct({
      data: {
        produtoId: this.produto.product?.id,
        produtoErpId: this.produto.product?.sapCodeNumber,
      },
    });
  }

  verPreco(): void {
    if (!this.produto) {
      return;
    }

    this.isAuth$.getValue()
      ? undefined
      : this.session.logout(
          true,
          true,
          `/produtos/${this.produto.product?.id}`
        );
  }
}
