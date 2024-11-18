import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { EventsApiService } from '@core/services/events-api.service';
import { ModalInconsistenciaProdutoComponent } from '../components/modal-inconsistencia-produto/modal-inconsistencia-produto.component';
import { ProdutoService } from './produto.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import {
  EquivalentResponseDto,
  ImageResponseDto,
  ProducDetailDto,
} from '@generated/api/api-external-svc/model/models';
import { PriceResponseDto } from '@generated/api/dpk-price-svc/model/priceResponseDto';
import { SessionService } from '@core/services/session.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Warehouse } from '@models/deposito.model';
import { environment } from '@env';
import { StringService } from '@shared/services/string.service';
import { ViewportScroller } from '@angular/common';
import { StoreService } from '@shared/services/store.service';
import { Observable, Subscription, debounceTime, fromEvent, map } from 'rxjs';
import { SnackBarColorService } from '@shared/services/snackbarColor.service';
import { Location } from '@angular/common';
@Component({
  selector: 'app-produto',
  templateUrl: './produto.component.html',
  styleUrls: ['./produto.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProdutoComponent implements OnInit {
  produtosEquivalentesExibicao: EquivalentResponseDto[] | undefined;
  constructor(
    private route: ActivatedRoute,
    public dialog: MatDialog,
    private service: ProdutoService,
    private snackBar: MatSnackBar,
    private sessionService: SessionService,
    private events: EventsApiService,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private stringService: StringService,
    private viewportScroller: ViewportScroller,
    private store: StoreService,
    private snackbarColorService: SnackBarColorService,
    private location: Location
  ) {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.route.params.subscribe(
      (params) => (this.produtoId = params['produtoId'])
    );
  }

  openModalInconsistencia() {
    const dialogRef = this.dialog.open(ModalInconsistenciaProdutoComponent);

    dialogRef.afterClosed().subscribe((result) => {});
  }

  produtoId!: number;
  isLogged: boolean = false;
  isLoadingProduct: boolean = true;
  isLoadingPrice: boolean = false;
  isLoadingWarehouse$ = this.store.getLoadingState('warehouse');
  warehouse$ = this.store.getSelected('warehouse');
  mostraPreco: boolean = false;
  isDisponivel: boolean = false;
  painelAplicacaoState: boolean = false;
  painelSomenteParaState: boolean = false;
  panelFichaState: boolean = false;
  isAddingCart: boolean = false;

  dados: ProducDetailDto | undefined;
  estoque: PriceResponseDto | undefined;
  deposito: Warehouse | undefined;
  valorTotal: number = 0;
  imgSelecionada?: ImageResponseDto;
  routeProdutoDescription: string | undefined;
  environment = environment;
  isMobile: boolean = false;
  ngOnInit() {
    this.isAuthSubject();
    this.getProduto();
    this.deposito = this.warehouse$.value;
    this.isMobile = this.detectMob();
    this.cdr.markForCheck();
    const resize$ = fromEvent(window, 'resize');
    resize$
      .pipe(
        map((i: any) => i),
        debounceTime(500)
      )
      .subscribe((event) => {
        this.isMobile = this.detectMob();
        this.cdr.markForCheck();
      });
  }
  private detectMob() {
    const toMatch = [
      /Android/i,
      /webOS/i,
      /iPhone/i,
      /iPad/i,
      /iPod/i,
      /BlackBerry/i,
      /Windows Phone/i,
    ];

    return toMatch.some((toMatchItem) => {
      return navigator.userAgent.match(toMatchItem);
    });
  }
  private isAuthSubject() {
    this.sessionService
      .getIsAuthSubject()
      .subscribe((isAuth: boolean) => (this.isLogged = isAuth));
  }

  private getProduto(): void {
    if (!this.produtoId) {
      this.router.navigate(['/']);
      return undefined;
    }
    this.isLoadingProduct = true;
    this.service.buscarProduto(this.produtoId).subscribe({
      next: (prod) => {
        if (!prod.product) {
          this.router.navigate(['/']);
        }
        this.dados = prod;
        this.warehouse$.subscribe((warehouse) => {
          this.deposito = warehouse;
          this.consultarPreco();
        });

        if (this.dados?.image) {
          this.imgSelecionada = this.dados.image[0];
        }
        if (prod.product?.description) {
          this.routeProdutoDescription =
            this.stringService.convertToFriendlyUrl(prod.product?.description);
        }
      },
      error: () => {
        this.snackBar.open('Erro ao buscar produto', 'Ok'),
          this.snackbarColorService.getSnackBarConfig();
        this.router.navigate(['/']);
      },
      complete: () => {
        this.cdr.markForCheck();
        this.isLoadingProduct = false;
      },
    });
  }

  private consultarPreco() {
    if (
      !this.dados ||
      this.dados.product === null ||
      this.dados.product === undefined ||
      this.deposito?.id === null ||
      this.deposito?.id === undefined
    ) {
      return;
    }
    let sapCodes: Array<number> = [this.dados.product.sapCodeNumber!];

    this.isLoadingPrice = true;
    this.events.viewProductPrice({
      data: {
        storeCode: this.deposito.id,
        arrProdutoErp: sapCodes,
      },
      callback: (price: PriceResponseDto[]) => {
        this.estoque = {};
        if (price && price.length > 0) {
          this.estoque = price[0];
          let valor = this.estoque.price || 0;
          let imposto = this.estoque.icms || 0;
          this.valorTotal = valor + imposto;
        }
        if (
          this.estoque &&
          this.estoque.stock !== null &&
          this.estoque.stock !== undefined &&
          this.estoque.minimumBuy !== null &&
          this.estoque.minimumBuy !== undefined &&
          this.estoque.price
        ) {
          if (this.estoque.minimumBuy > 0) {
            this.isDisponivel =
              this.estoque.stock >= this.estoque.minimumBuy ? true : false;
          } else {
            this.isDisponivel = true;
          }
        }

        this.isLoadingPrice = false;
        this.cdr.markForCheck();
        this.route.fragment.subscribe((fragment) => {
          if (fragment) {
            this.viewportScroller.scrollToAnchor(fragment);
          }
        });
      },
    });
  }

  atualizarFoto(foto: ImageResponseDto): void {
    this.imgSelecionada = foto;
  }

  atualizarValor(valor: number): void {
    this.valorTotal = valor;
  }

  verSimilares(): void {
    this.viewportScroller.scrollToAnchor('produtos-similares');
  }

  backLastPage() {
    this.location.back();
  }

  adicionarAoCarrinho(qtdItem: number): void {
    if (!this.dados?.product?.sapCodeNumber || !this.deposito) {
      return undefined;
    }
    this.isAddingCart = true;

    this.events.addProductToCart({
      data: {
        produtoId: this.produtoId,
        produtoErpId: this.dados?.product?.sapCodeNumber,
        produtoQtd: qtdItem,
        depositoId: this.deposito.id,
        code: this.dados?.product.code,
        description: this.dados?.product.description,
        manufacturer: this.dados?.product.manufacturer,
      },
      callback: () => {
        this.isAddingCart = false;
        this.cdr.markForCheck();
      },
    });
  }
}
