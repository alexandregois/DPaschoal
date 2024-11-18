import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
} from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { EventsApiService } from '@core/services/events-api.service';
import { CartDto, CartItemDto, OrderDto } from '@generated/api/dpk-order-svc';
import { StatusOrderDto } from '@generated/api/dpk-order-svc';
import { StoreService } from '@shared/services/store.service';
import { finalize } from 'rxjs';
import { PedidoService } from '../pedido.service';
import { SnackBarColorService } from '@shared/services/snackbarColor.service';

@Component({
  selector: 'app-pedido',
  templateUrl: './pedido.component.html',
  styleUrls: ['./pedido.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PedidoComponent {
  isLoading: boolean = false;
  statusList: Array<StatusOrderDto> = [];
  isCreatingOrder: boolean = false;

  constructor(
    private pedidoService: PedidoService,
    private snackBar: MatSnackBar,
    private readonly cdr: ChangeDetectorRef,
    private route: ActivatedRoute,
    private eventsApi: EventsApiService,
    private store: StoreService,
    private snackbarColorService: SnackBarColorService
  ) {}

  ngOnInit(): void {
    this.buscarStatus();
    const pedidoId = this.route.snapshot.paramMap.get('pedido');
    if (pedidoId) {
      this.buscarPedidos(pedidoId);
    }
  }

  pedido!: OrderDto;

  buscarPedidos(pedidoId: string): void {
    this.isLoading = true;
    this.pedidoService
      .getOrderDetails(pedidoId)
      .pipe(
        finalize(() => {
          this.isLoading = false;
          this.cdr.markForCheck();
        })
      )
      .subscribe({
        next: (pedidoResponse) => {
          this.pedido = pedidoResponse;
          if (pedidoResponse.ordersStatus) {
            let lastIndex = pedidoResponse.ordersStatus.length - 1;
            this.pedido.statusId =
              pedidoResponse.ordersStatus[lastIndex].statusId;
          }
        },
        error: () =>
          this.snackBar.open(
            'Erro ao buscar detalhe do pedido',
            'Ok',
            this.snackbarColorService.getSnackBarConfig()
          ),
      });
  }

  buscarStatus(): void {
    this.pedidoService
      .getStatus()
      .pipe(
        finalize(() => {
          this.isLoading = false;
          this.cdr.markForCheck();
        })
      )
      .subscribe({
        next: (data) => {
          this.statusList = data;
        },
        error: () =>
          this.snackBar.open(
            'Erro ao buscar status',
            'Ok',
            this.snackbarColorService.getSnackBarConfig()
          ),
      });
  }

  addToItemsToCart() {
    if (
      this.pedido?.orderItems === null ||
      this.pedido?.orderItems === undefined
    ) {
      return;
    }
    this.isCreatingOrder = true;
    var itensDto: Array<CartItemDto> = [];
    this.pedido?.orderItems.forEach((item) => {
      if (
        item.quantity !== null &&
        item.quantity &&
        item.productId !== null &&
        item?.productId &&
        item.productRetailerId !== null &&
        item.productRetailerId &&
        this.pedido?.hub !== null
      ) {
        const cartItem = {
          productId: item?.productId,
          productRetailerId: item.productRetailerId,
          quantity: item?.quantity,
          position: 1,
          code: item?.code,
          description: item?.description,
          manufacturer: item?.manufacturer,
        };
        itensDto.push(cartItem);
      }
    });

    const storeCarts = this.store.getData('cart').getValue();
    var warehouseCart: CartDto | undefined;

    if (storeCarts && storeCarts.length) {
      warehouseCart = storeCarts.find(
        (cart: CartDto) => cart.hubId === this.pedido?.hubId
      );
    }

    if (warehouseCart && warehouseCart !== undefined) {
      warehouseCart?.cartItems?.map((cartItem) => {});
      itensDto.forEach((item) => {
        var exist = false;
        warehouseCart?.cartItems?.forEach((cartItem) => {
          if (cartItem.productId === item.productId) {
            exist = true;
            cartItem.quantity = (cartItem.quantity || 0) + (item.quantity || 0);
          }
        });
        if (!exist) {
          warehouseCart?.cartItems?.push(item);
        }
      });
    } else {
      warehouseCart = {
        hubId: this.pedido?.hubId,
        retailerId: this.pedido?.retailerId,
        cartItems: itensDto,
      };
    }

    this.eventsApi.addCart({
      data: {
        cart: warehouseCart,
      },
      callback: (success: boolean) => {
        if (success) {
          this.isCreatingOrder = false;
        }
        this.cdr.markForCheck();
      },
    });
  }
}
