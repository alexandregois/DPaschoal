import { finalize } from 'rxjs';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  Output,
  EventEmitter,
} from '@angular/core';
import { CartDto } from '@generated/api/dpk-order-svc';
import {
  OrderItemDto,
  PriceDpkFilter,
  PriceResponseDto,
} from '@generated/api/dpk-price-svc';
import { CarrinhoService } from '@modules/carrinho/carrinho.service';
import { StoreService } from '@shared/services/store.service';
import { PaymentTypeService } from '@shared/services/payment-type.service';

@Component({
  selector: 'app-table-resumo-pedido',
  templateUrl: './table-resumo-pedido.component.html',
  styleUrls: ['./table-resumo-pedido.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TableResumoPedidoComponent {
  @Input() itensUnicos: number | null | undefined;
  @Input() totalItens: number | undefined;
  @Input() total: number | undefined;
  @Input() impostos: number | undefined;
  @Input() frete: number | undefined;
  @Input() despesasAcessorias: number | undefined;
  @Input() isStepFinalizar!: boolean;
  @Input() parcelas: number = 1;

  cart: CartDto | undefined;
  productRetailerIdList: number[] = [];
  orderItensList: OrderItemDto[] = [];
  priceList: PriceResponseDto[] = [];
  isReloadingPrice: boolean = false;

  @Output() atualizandoPrice = new EventEmitter<boolean>();

  constructor(
    private store: StoreService,
    private readonly cdr: ChangeDetectorRef,
    private carrinhoService: CarrinhoService,
    private paymentTypeService: PaymentTypeService
  ) {}

  ngOnChanges(): void {
    if (this.isStepFinalizar) {
      this.reloadPrice();
    }
  }

  ngOnInit(): void {
    this.store.getSelected('cart').subscribe((cart) => {
      this.cart = cart;
    });
  }

  reloadPrice(): void {
    this.isReloadingPrice = true;
    this.atualizandoPrice.emit(true);
    let priceFilter: PriceDpkFilter = {};
    priceFilter.shippingCost = this.frete;
    priceFilter.storeCode = this.cart?.hubId;
    priceFilter.expenseValue = this.despesasAcessorias;

    this.productRetailerIdList = [];
    this.orderItensList = [];
    this.cart?.cartItems?.forEach((item) => {
      if (item.productRetailerId && item.productRetailerId !== undefined) {
        this.productRetailerIdList.push(item.productRetailerId);

        var orderItem: OrderItemDto = {
          productRetailerId: item.productRetailerId,
          quantity: item?.quantity,
        };

        this.orderItensList.push(orderItem);
      }
    });
    priceFilter.item = this.productRetailerIdList;
    priceFilter.orderItem = this.orderItensList;

    this.carrinhoService
      .getCartPrices(priceFilter)
      .pipe(
        finalize(() => {
          this.isReloadingPrice = false;
          this.atualizandoPrice.emit(false);
          this.cdr.detectChanges();
        })
      )
      .subscribe({
        next: (priceList) => {
          if (priceList.length) {
            this.priceList = priceList;
            this.paymentTypeService.changePriceList(this.priceList);
            this.cdr.detectChanges();
            this.total = this.getTotal();
            this.impostos = this.getImpostos();
          }
        },
      });
  }

  itemPrice(price: PriceResponseDto): PriceResponseDto {
    const quantity = this.cart?.cartItems?.filter(
      (cartItem) => cartItem.productRetailerId === price?.id
    )[0]?.quantity;
    return {
      price: price?.price && quantity ? price?.price * quantity : 0,
      icms: price?.icms && quantity ? price?.icms * quantity : 0,
    };
  }

  getTotal(): number {
    return (
      this.priceList
        .map((price) => this.itemPrice(price).price)
        .reduce((sum, current) => (!!sum ? sum + current! : current), 0) || 0
    );
  }

  getImpostos(): number {
    return (
      this.priceList
        .map((price) => this.itemPrice(price).icms)
        .reduce((sum, current) => (!!sum ? sum + current! : current), 0) || 0
    );
  }
  getValorPorParcela(): number {
    const totalValue = this.total || 0;
    const freightValue = this.frete || 0;
    const expenseValue = this.despesasAcessorias || 0;
    const totalWithExtras = totalValue + freightValue + expenseValue;
    const valor = totalWithExtras / (this.parcelas || 1);
    this.paymentTypeService.updateParcelaValor(valor);
    return valor;
  }
}
