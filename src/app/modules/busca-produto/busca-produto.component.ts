import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { BuscaProdutoService } from '@core/services/busca-produto.service';
import { environment } from '@env';
import {
  ProductElastic,
  ProductSearchDto,
  ProductSearchService,
} from '@generated/api/dpk-product-svc';
import { Subscription, finalize } from 'rxjs';
import { HostListener } from '@angular/core';
import { StoreService } from '@shared/services/store.service';
import { PriceResponseDto } from '@generated/api/dpk-price-svc/model/priceResponseDto';
import { EventsApiService } from '@core/services/events-api.service';
import { ProducDetailDto } from '@generated/api/api-external-svc';
import { SessionService } from '@core/services/session.service';
import { StringService } from '@shared/services/string.service';
import { portals } from 'src/environments/portals';
@Component({
  selector: 'app-busca-produto',
  templateUrl: './busca-produto.component.html',
  styleUrls: ['./busca-produto.component.scss'],
})
export class BuscaProdutoComponent implements OnInit, OnDestroy {
  produtos: ProductElastic[] = [];
  produto: ProducDetailDto | undefined;
  produtosDisplay: ProductElastic[] = [];
  price: PriceResponseDto | undefined;
  isGridView: boolean = false;
  private subscription: Subscription = new Subscription();
  private searchTermSubscription: Subscription | undefined;
  warehouse$ = this.store.getSelected('warehouse');
  isLoadingWarehouse$ = this.store.getLoadingState('warehouse');
  environment = environment;
  portal = environment.portal;
  isLoading: boolean = false;
  isLoadingPrice: boolean = true;
  currentPage: number = 1;
  productsPerPage: number = 16;
  totalProducts: number = 0;
  totalPages: number = 0;
  totalCount: number = 0;
  pageNumbers: number[] = [];
  valorTotal: number = 0;
  isAddingCart: boolean = false;
  isAdding: boolean = false;
  isLogged: boolean = false;
  routeProdutoDescription: string | undefined;
  pesquisaSearch: string | undefined;
  idProdutoAtual: number = 0;
  searchTerm: string = '';
  localwarehouse: string | undefined;
  startPage: number = 1;
  endPage: number = 10;

  constructor(
    private buscaProdutoService: BuscaProdutoService,
    private cdr: ChangeDetectorRef,
    private productSearchService: ProductSearchService,
    private store: StoreService,
    private events: EventsApiService,
    private session: SessionService,
    private stringService: StringService,
    private sessionService: SessionService
  ) {}

  isAuth$ = this.session.getIsAuthSubject();

  ngOnInit(): void {
    this.localwarehouse = this.warehouse$.value?.description;
    this.isGridView = window.innerWidth <= 1025;
    this.isAuthSubject();
    this.searchTermSubscription =
      this.buscaProdutoService.searchTerm$.subscribe((searchTerm) => {
        if (searchTerm) {
          this.currentPage = 1;
          this.searchTerm = searchTerm;
          this.buscarProduto(searchTerm);
        } else {
          const storedSearchTerm = this.buscaProdutoService.getSearchTerm();
          if (storedSearchTerm) {
            this.currentPage = 1;
            this.searchTerm = storedSearchTerm;
            this.buscarProduto(storedSearchTerm);
          }
        }
      });
  }

  private isAuthSubject() {
    this.sessionService
      .getIsAuthSubject()
      .subscribe((isAuth: boolean) => (this.isLogged = isAuth));
  }

  buscarProduto(searchTerm: string, placeFilter?: string): void {
    this.isLoading = true;
    const retailerId = this.warehouse$?.value?.retailerId;
    let xPortal = environment.portal;
    if (environment.portal === portals.kdp && retailerId === 2) {
      xPortal = portals.dpk;
    }
    let storeCode = 0;
    if (this.warehouse$.value?.priceId) {
      storeCode = this.warehouse$.value?.priceId;
    }
    this.subscription = this.productSearchService
      .apiProductSearchGet(xPortal, searchTerm, storeCode)
      .pipe(
        finalize(() => {
          this.isLoading = false;
          this.cdr.markForCheck();
        })
      )
      .subscribe({
        next: (data: ProductSearchDto) => {
          if (data && data.products) {
            this.totalCount = data.totalCount!;
            this.produtos = data.products.sort((a, b) => b.stock! - a.stock!);
            this.totalProducts = this.produtos.length;
            this.totalPages = Math.ceil(
              this.totalProducts / this.productsPerPage
            );
            this.pageNumbers = Array.from(
              { length: this.totalPages },
              (_, i) => i + 1
            );
            this.updateProductDisplay();
            if (this.produtos.length > 0) {
              this.produtosDisplay.forEach((produto) => {
                if (!produto || !this.warehouse$.value) {
                  return;
                }
                this.price = undefined;
                if (produto.sapCode === 'PN' || produto.sapCode === '0') {
                  this.isLoadingPrice = false;
                  return;
                }

                if (Number(produto.sapCode) === 0) return;
                this.events.viewProductPrice({
                  data: {
                    storeCode: this.warehouse$.value.id,
                    arrProdutoErp: [Number(produto.sapCode)] as number[],
                  },
                  callback: (price: PriceResponseDto[]) => {
                    if (price.length > 0) {
                      this.price = price[0];

                      produto.isAddingToCart = false;
                      produto.quantity = this.price.minimumBuy!;
                      produto.minimumQuantity = this.price.minimumBuy!;
                      produto.maximumQuantity = this.price.stock!;
                      produto.price = this.price.price || 0;
                      produto.tax = this.price.icms || 0;
                      produto.total =
                        (this.price.price || 0) + (this.price.icms || 0);

                      if (produto.price === 0) {
                        produto.price = -1;
                      }
                    } else {
                      produto.price = -1;
                    }
                    this.isLoadingPrice = false;
                    this.cdr.markForCheck();
                  },
                });
              });
            }
            this.warehouse$.subscribe(() => this.consultarPreco());
            this.pesquisaSearch = searchTerm;
          } else {
            this.totalCount = 0;
          }
        },
        error: () => {
          this.isLoading = false;
          this.totalCount = 0;
        },
      });
  }

  private consultarPreco() {
    if (this.localwarehouse !== this.warehouse$.value?.description) {
      this.localwarehouse = this.warehouse$.value?.description;
      this.cdr.markForCheck();
      this.currentPage = 1;
      this.buscarProduto(this.searchTerm);
    }
  }

  atualizarValorProduto(qtd: number, produto: ProductElastic): void {
    produto.total = ((produto.price || 0) + (produto.tax || 0)) * qtd;
    produto.quantity = qtd;
  }

  sapCodeAsNumber(sapCode: string | undefined | null) {
    return Number(sapCode);
  }

  convertUrl(description: string | undefined | null) {
    return (this.routeProdutoDescription =
      this.stringService.convertToFriendlyUrl(description!));
  }

  adicionarAoCarrinho(produto: ProductElastic): void {
    if (!produto.sapCode || !produto.id) {
      return;
    }
    produto.isAddingToCart = true;
    this.events.addProductToCart({
      data: {
        produtoId: produto.id,
        produtoErpId: Number(produto.sapCode),
        produtoQtd: produto.quantity!,
        depositoId: this.warehouse$.getValue()?.id,
        code: produto.code,
        description: produto.description,
        manufacturer: produto.manufacturer,
      },
      callback: () => {
        produto.isAddingToCart = false;
        this.cdr.markForCheck();
      },
    });
  }

  changeValue() {}

  aviseMe(produtoId: number | null | undefined): void {
    if (!produtoId) {
      return;
    }
    this.events.addProductToAlert({
      data: {
        produtoId: produtoId,
      },
    });
  }

  verSimilares(
    produtoId: number | null | undefined,
    description: string | null | undefined
  ): void {
    if (!produtoId) {
      return;
    }
    this.events.navigateToSimilarProducts({
      data: {
        produtoId: produtoId,
        produtoDescription: description || undefined,
      },
    });
  }

  verPreco(produtoId: number | null | undefined): void {
    if (!produtoId) {
      return;
    }
    this.isAuth$.getValue()
      ? undefined
      : this.session.logout(true, true, `/produtos/${produtoId}`);
  }

  maisEstoques(
    produtoId: number | null | undefined,
    sapCode: string | null | undefined
  ): void {
    if (!produtoId || !sapCode) {
      return;
    }
    this.events.viewCDByProduct({
      data: {
        produtoId: produtoId,
        produtoErpId: Number(sapCode),
      },
    });
  }

  updateProductDisplay(): void {
    const start = (this.currentPage - 1) * this.productsPerPage;
    const end = start + this.productsPerPage;
    this.produtosDisplay = this.produtos.slice(start, end);
  }

  nextPage(): void {
    if (this.currentPage * this.productsPerPage < this.totalProducts) {
      this.currentPage++;
      this.updatePagingWindow();
      this.updateProductDisplay();
      this.loadPrices();
      window.scrollTo(0, 0);
    }
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePagingWindow();
      this.updateProductDisplay();
      this.loadPrices();
      window.scrollTo(0, 0);
    }
  }

  updatePagingWindow(): void {
    if (this.currentPage >= this.endPage) {
      this.startPage = this.currentPage - 9 > 1 ? this.currentPage - 9 : 1;
      this.endPage = this.currentPage;
    } else if (this.currentPage <= this.startPage) {
      this.startPage = this.currentPage;
      this.endPage = Math.min(this.currentPage + 9, this.totalPages);
    }
  }

  goToPage(page: number): void {
    this.currentPage = page;
    if (this.currentPage >= this.endPage) {
      this.startPage = this.currentPage - 9 > 1 ? this.currentPage - 9 : 1;
      this.endPage = this.currentPage;
    } else if (this.currentPage <= this.startPage) {
      this.startPage = this.currentPage;
      this.endPage = Math.min(this.currentPage + 9, this.totalPages);
    }
    const start = (this.currentPage - 1) * this.productsPerPage;
    const end = start + this.productsPerPage;
    this.produtosDisplay = this.produtos.slice(start, end);
    this.loadPrices();
    window.scrollTo(0, 0);
  }

  loadPrices() {
    if (this.produtos.length > 0) {
      this.produtosDisplay.forEach((produto) => {
        if (!produto || !this.warehouse$.value) {
          return;
        }
        this.price = undefined;
        if (produto.sapCode === 'PN' || produto.sapCode === '0') {
          this.isLoadingPrice = false;
          return;
        }

        if (Number(produto.sapCode) === 0) return;
        this.events.viewProductPrice({
          data: {
            storeCode: this.warehouse$.value.id,
            arrProdutoErp: [Number(produto.sapCode)] as number[],
          },
          callback: (price: PriceResponseDto[]) => {
            if (price.length > 0) {
              this.price = price[0];

              produto.isAddingToCart = false;
              produto.quantity = this.price.minimumBuy!;
              produto.minimumQuantity = this.price.minimumBuy!;
              produto.maximumQuantity = this.price.stock!;
              produto.price = this.price.price || 0;
              produto.tax = this.price.icms || 0;
              produto.total = (this.price.price || 0) + (this.price.icms || 0);

              if (produto.price === 0) {
                produto.price = -1;
              }
            } else {
              produto.price = -1;
            }
            this.isLoadingPrice = false;
            this.cdr.markForCheck();
          },
        });
      });
    }
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: { target: { innerWidth: any } }) {
    const windowWidth = event.target.innerWidth;
    if (windowWidth <= 1025) {
      this.isGridView = true;
    } else {
      this.isGridView = false;
    }
  }

  ngOnDestroy() {
    this.searchTermSubscription?.unsubscribe();
    this.subscription.unsubscribe();
    if (this.searchTermSubscription) {
      this.searchTermSubscription.unsubscribe();
    }
  }
}
