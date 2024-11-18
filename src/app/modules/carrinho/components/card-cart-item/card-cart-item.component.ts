import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
} from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ProducDetailDto } from '@generated/api/api-external-svc';
import { CartDto, CartItemDto } from '@generated/api/dpk-order-svc';
import { PriceResponseDto } from '@generated/api/dpk-price-svc';
import { finalize, tap } from 'rxjs';
import { environment } from '@env';
import { Warehouse } from '@models/deposito.model';
import { StoreService } from '@shared/services/store.service';
import { PagamentoService } from '../../pagamento/pagamento.service';
import { SnackBarColorService } from '@shared/services/snackbarColor.service';

@Component({
  selector: 'app-card-cart-item',
  templateUrl: './card-cart-item.component.html',
  styleUrls: ['./card-cart-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CardCartItemComponent implements OnChanges {
  @Input() isLoadingPrice: boolean | undefined;
  @Input() productDetail: ProducDetailDto | undefined;
  @Input() cartItem: CartItemDto | undefined;
  @Input() price: PriceResponseDto | undefined;
  @Input() customerWarehouse: Warehouse | undefined;
  @Input() cartItemIndex: number = 0;

  @Output() carrinhoVazio = new EventEmitter<boolean>();

  cart: CartDto | undefined;
  productImageUrl: string | undefined;
  portal = environment.portal;
  statusList: string[] = [];
  isLoadingRemove: boolean = false;
  isVisibleFavorite: boolean = false;

  constructor(
    private store: StoreService,
    private data: PagamentoService,
    private readonly cdr: ChangeDetectorRef,
    private snackBar: MatSnackBar,
    private snackbarColorService: SnackBarColorService
  ) {}

  ngOnChanges(): void {
    this.loadStatus();
    this.store
      .getSelected('cart')
      .pipe(tap(() => this.getUrlImage()))
      .subscribe((cart) => (this.cart = cart));

    this.isLoadingPrice = this.price === undefined;
  }

  loadStatus(): void {
    if (this.price?.stock === 0) {
      const msg = 'ITEM INDISPONÍVEL';
      if (this.statusList.filter((status) => status === msg).length === 0) {
        this.statusList.push(msg);
      }
    }
    if (this.price?.minimumBuy && this.price?.minimumBuy > 1) {
      const msg = 'MINIMO ' + this.price?.minimumBuy + ' ITENS PARA COMPRA';
      if (this.statusList.filter((status) => status === msg).length === 0) {
        this.statusList.push(msg);
      }
    }
    if (this.price?.motorcycleLock) {
      const msg = 'ITEM BLOQUEADO PARA ENTREGA MOTO';
      if (this.statusList.filter((status) => status === msg).length === 0) {
        this.statusList.push(msg);
      }
    }
  }

  changeStatus(quantity: number): void {
    const msg = 'MÁXIMO EM ESTOQUE';
    if (quantity && this.price?.stock && quantity >= this.price?.stock) {
      if (this.statusList.filter((status) => status === msg).length === 0) {
        this.statusList.push(msg);
      }
    } else {
      const index = this.statusList.indexOf(msg);
      if (index > -1) {
        this.statusList.splice(index, 1);
      }
    }
  }

  reloadCart(cartId: string | undefined): void {
    if (cartId === undefined) {
      return;
    }
    this.data
      .getCarts()
      .pipe(
        finalize(() => {
          this.isLoadingRemove = false;
          this.cdr.markForCheck();
        })
      )
      .subscribe({
        next: (response) => {
          this.snackBar.open(
            'Produto excluído com sucesso!',
            'Ok',
            this.snackbarColorService.getSnackBarConfig()
          );
          if (response && response !== null) {
            let cartExiste = response.filter((c) => c.id === cartId).length > 0;
            if (cartExiste) {
              this.cart = response.filter((c) => c.id === cartId)[0];
              this.store.setSelected('cart', this.cart);
            }
            this.carrinhoVazio.emit(false);
          } else {
            this.carrinhoVazio.emit(true);
          }
        },
        // TODO Revisar tratamento de erro
        // error: error => this.snackBar.open(error, 'Ok'),
      });
  }

  getUrlImage(): void {
    if (
      !this.productDetail ||
      !this.productDetail?.image ||
      !this.productDetail?.image[0]?.thumbnailImage
    ) {
      return undefined;
    }
    this.productImageUrl = environment.superkImageUrlPrefix.concat(
      this.productDetail?.image[0]?.thumbnailImage
    );
  }

  getUnitPrice(): number | undefined {
    const price = this.price?.price;
    const icms = this.price?.icms || 0;
    if (price === undefined) {
      this.isLoadingPrice = true;
      return undefined;
    }
    this.isLoadingPrice = false;
    return price + icms;
  }

  calculateTotal(): number | undefined {
    const stock = this.price?.stock;
    const qtd = this.cartItem?.quantity;
    const price = this.price?.price;
    const icms = this.price?.icms || 0;

    if (stock === undefined || qtd === undefined || price === undefined) {
      return undefined;
    }
    return qtd * (price + icms);
  }

  updateCartItemQuantity(item: CartItemDto, quantity: number): void {
    if (!this.cart || !this.cart?.cartItems) {
      return undefined;
    }
    this.isLoadingPrice = true;
    item.quantity = quantity;
    const findItem = this.cart.cartItems.find((elem) => elem.id === item.id);
    if (findItem) {
      findItem.quantity = quantity;
    }
    this.data.updateCart(this.cart).subscribe({
      next: (cart) => {
        this.store.setSelected('cart', cart);
        this.changeStatus(quantity);
      },
      // TODO Revisar tratamento de erro
      // error: error => this.snackBar.open(error, 'Ok'),
      complete: () => this.cdr.markForCheck(),
    });
  }

  removeProduct(cartItem: CartItemDto): void {
    if (!cartItem || !cartItem.cartId || !cartItem.id) {
      return;
    }
    this.isLoadingRemove = true;
    this.data
      .deleteCartItem(cartItem.cartId, cartItem.id)
      .pipe(
        finalize(() => {
          this.cdr.markForCheck();
        })
      )
      .subscribe({
        next: (response) => {
          if (response) {
            this.reloadCart(cartItem.cartId);
          } else {
            this.snackBar.open(
              'Erro ao excluir o produto!',
              'Ok',
              this.snackbarColorService.getSnackBarConfig()
            );
            this.isLoadingRemove = false;
          }
        },
        // TODO Revisar tratamento de erro
        // error: error => this.snackBar.open(error, 'Ok'),
      });
  }
}
