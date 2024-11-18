import { SessionService } from '@core/services/session.service';
import { PriceService } from '@generated/api/dpk-price-svc';
import { APP_INITIALIZER, Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import {
  UpdateCD,
  ViewCDByProduct,
  NavigateToSimilarProducts,
  AddCart,
  AddProductToCart,
  AddProductToAlert,
  NavigateToProduct,
  ViewProductPrice,
  AddProductToBookmarks,
  RemoveProductFromBookmarks,
  CheckProductOnBookmarks,
} from '@core/interface/events-api.interface';
import { finalize, first, of, tap, timeout } from 'rxjs';
import { MaisEstoqueDialogComponent } from '@shared/components/mais-estoque-dialog/mais-estoque-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { AnalyticsService } from '@shared/services/analytics.service';
import { ProductFavoriteService } from '@generated/api/dpk-product-svc';
import { environment } from '@env';
import { CartItemDto, CartService } from '@generated/api/dpk-order-svc';
import { StoreService } from '@shared/services/store.service';
import { KDApecaService } from '@generated/api/api-external-svc';
import { StringService } from '@shared/services/string.service';
import { portals } from 'src/environments/portals';
import { style } from '@angular/animations';
import { SnackBarColorService } from '@shared/services/snackbarColor.service';

@Injectable({
  providedIn: 'root',
})
export class EventsApiService {
  constructor(
    private router: Router,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private analytics: AnalyticsService,
    private favoriteService: ProductFavoriteService,
    private cartService: CartService,
    private store: StoreService,
    private kdapecaService: KDApecaService,
    private stringService: StringService,
    private priceService: PriceService,
    private session: SessionService,
    private snackbarColorService: SnackBarColorService
  ) {}

  init() {
    this.initUpdateCD();
    this.initViewCDByProduct();
    this.initNavigateToSimilarProducts();
    this.initNavigateToProduct();
    this.initAddCart();
    this.initAddProductToCart();
    this.initAddProductToAlert();
    this.initViewProductPrice();
    this.initAddProductToBookmarks();
    this.initRemoveProductFromBookmarks();
    this.initCheckProductOnBookmarks();
    this.initOpenGarantia();
  }

  private initUpdateCD() {
    document.addEventListener(
      'updateCD',
      (event: any) => {
        const eventDetail = event.detail as UpdateCD;
        this.callbackTrigger(eventDetail.callback, eventDetail.data);
      },
      false
    );
  }
  private initViewCDByProduct() {
    document.addEventListener(
      'viewCDByProduct',
      (event: any) => {
        const eventDetail = event.detail as ViewCDByProduct;
        const dialogRef = this.dialog.open(MaisEstoqueDialogComponent, {
          data: eventDetail.data,
          width: '500px',
        });
        dialogRef.afterClosed().subscribe((result) => {
          this.callbackTrigger(eventDetail.callback, result);
        });
      },
      false
    );
  }

  private initNavigateToSimilarProducts() {
    document.addEventListener(
      'navigateToSimilarProducts',
      (event: any) => {
        const eventDetail = event.detail as NavigateToSimilarProducts;
        const route = ['/produtos', eventDetail.data.produtoId];
        console.log('data', eventDetail.data);
        const productDescription = this.stringService.convertToFriendlyUrl(
          eventDetail.data.produtoDescription
        );
        if (productDescription) {
          route.push(productDescription);
        }
        this.analytics.trackNavigateToProduct(
          eventDetail.data.produtoId,
          productDescription
        );
        this.router
          .navigate(route, { fragment: 'produtos-similares' })
          .then(() => this.callbackTrigger(eventDetail.callback));
      },
      false
    );
  }
  private initNavigateToProduct() {
    document.addEventListener(
      'navigateToProduct',
      (event: any) => {
        const eventDetail = event.detail as NavigateToProduct;
        const route = ['/produtos', eventDetail.data.produtoId];
        console.log('data', eventDetail.data);
        const productDescription = this.stringService.convertToFriendlyUrl(
          eventDetail.data.produtoDescription
        );
        if (productDescription) {
          route.push(productDescription);
        }
        this.analytics.trackNavigateToProduct(
          eventDetail.data.produtoId,
          productDescription
        );
        this.router
          .navigate(route)
          .then(() => this.callbackTrigger(eventDetail.callback));
      },
      false
    );
  }
  private initAddCart() {
    document.addEventListener(
      'addCart',
      (event: any) => {
        const eventDetail = event.detail as AddCart;
        this.store.setLoadingState('cart', true);
        const carrinho = eventDetail.data.cart;
        if (carrinho.id) {
          this.cartService
            .apiCartPut(environment.portal, undefined, carrinho)
            .pipe(
              first(),
              finalize(() => this.store.setLoadingState('cart', false))
            )
            .subscribe({
              next: (data) => {
                carrinho.cartItems?.forEach((itenCart: CartItemDto) => {
                  this.analytics.trackAddProductToCart(itenCart.productId!);
                });
                this.cartService
                  .apiCartGetByFilterGet(environment.portal)
                  .pipe(
                    first(),
                    tap((data) => this.store.setData('cart', data)),
                    finalize(() => this.store.setLoadingState('cart', false))
                  )
                  .subscribe();

                this.snackBar.open(
                  `Produto adicionado ao carrinho`,
                  'Ok',
                  this.snackbarColorService.getSnackBarConfig()
                );
                this.callbackTrigger(eventDetail.callback, data);
              },
              error: () => {
                this.snackBar.open(
                  'Erro ao adicionar o produto ao carrinho',
                  'Ok',
                  this.snackbarColorService.getSnackBarConfig()
                );
              },
            });
        } else {
          this.cartService
            .apiCartPost(environment.portal, undefined, carrinho)
            .pipe(
              first(),
              finalize(() => this.store.setLoadingState('cart', false))
            )
            .subscribe({
              next: (data) => {
                carrinho.cartItems?.forEach((itenCart: CartItemDto) => {
                  this.analytics.trackAddProductToCart(itenCart.productId!);
                });
                this.cartService
                  .apiCartGetByFilterGet(environment.portal)
                  .pipe(
                    first(),
                    tap((data) => this.store.setData('cart', data)),
                    finalize(() => this.store.setLoadingState('cart', false))
                  )
                  .subscribe();
                this.snackBar.open(
                  `Produto adicionado ao carrinho`,
                  'Ok',
                  this.snackbarColorService.getSnackBarConfig()
                );
                this.callbackTrigger(eventDetail.callback, data);
              },
              error: () => {
                this.snackBar.open(
                  'Erro ao adicionar o produto ao carrinho',
                  'Ok',
                  this.snackbarColorService.getSnackBarConfig()
                );
              },
            });
        }
      },
      false
    );
  }
  private initAddProductToCart() {
    document.addEventListener(
      'addProductToCart',
      (event: any) => {
        const eventDetail = event.detail as AddProductToCart;
        this.store.setLoadingState('cart', true);
        if (typeof eventDetail.data.produtoId === 'string') {
          eventDetail.data.produtoId = parseInt(eventDetail.data.produtoId, 10);
        }
        if (typeof eventDetail.data.produtoErpId === 'string') {
          eventDetail.data.produtoErpId = parseInt(
            eventDetail.data.produtoErpId,
            10
          );
        }
        const cartItem = {
          productId: eventDetail.data.produtoId,
          productRetailerId: eventDetail.data.produtoErpId,
          quantity: eventDetail.data.produtoQtd,
          position: 1,
          code: eventDetail.data.code,
          description: eventDetail.data.description,
          manufacturer: eventDetail.data.manufacturer,
        };
        const cart = this.store.getData('cart').getValue();
        const customerWarehouse = this.store.getData('warehouse').getValue();
        let selectedCustomerWarehouse = this.store
          .getSelected('warehouse')
          .getValue();
        let selectedCart;

        if (cart && cart.length && selectedCustomerWarehouse) {
          selectedCart = cart.find(
            (singleCart) => singleCart.hubId === selectedCustomerWarehouse?.id
          );
        }

        if (eventDetail.data.depositoId && customerWarehouse) {
          if (cart) {
            selectedCart = cart.find((cart) => {
              return cart.hubId === eventDetail.data.depositoId;
            });
          }

          selectedCustomerWarehouse = customerWarehouse.filter((warehouse) => {
            return warehouse.id === eventDetail.data.depositoId;
          })[0];
        }

        if (selectedCart) {
          const cartItemDto = selectedCart.cartItems?.filter(
            (item) => item.productId == cartItem.productId
          )[0];
          if (cartItemDto === undefined) {
            selectedCart.cartItems?.push(cartItem);
          } else {
            selectedCart.cartItems?.map((item) => {
              if (item.productId == cartItem.productId) {
                item.quantity = (item.quantity || 0) + cartItem.quantity;
              }
              return item;
            });
          }

          this.cartService
            .apiCartPut(environment.portal, undefined, selectedCart)
            .pipe(
              first(),
              finalize(() => this.store.setLoadingState('cart', false))
            )
            .subscribe({
              next: (data) => {
                this.analytics.trackAddProductToCart(
                  eventDetail.data.produtoId
                );
                let newCart = cart;
                var exist = cart?.find((elm) => elm.id == data.id);
                if (cart && exist && exist !== undefined) {
                  newCart = cart.filter((elm) => elm.id !== exist?.id);
                  newCart.push(exist);
                }
                this.cartService
                  .apiCartGetByFilterGet(environment.portal)
                  .pipe(
                    first(),
                    tap((data) => this.store.setData('cart', data)),
                    finalize(() => this.store.setLoadingState('cart', false))
                  )
                  .subscribe();
                this.snackBar.open(
                  `Produto adicionado ao carrinho`,
                  'Ok',
                  this.snackbarColorService.getSnackBarConfig()
                );
                this.callbackTrigger(eventDetail.callback, data);
              },
              error: () => {
                this.snackBar.open(
                  'Erro ao adicionar o produto ao carrinho',
                  'Ok',
                  this.snackbarColorService.getSnackBarConfig()
                );
              },
            });
        } else {
          this.cartService
            .apiCartPost(environment.portal, undefined, {
              hubId: selectedCustomerWarehouse?.id,
              retailerId: selectedCustomerWarehouse?.retailerId,
              cartItems: [cartItem],
            })
            .pipe(
              first(),
              finalize(() => this.store.setLoadingState('cart', false))
            )
            .subscribe({
              next: (data) => {
                this.analytics.trackAddProductToCart(
                  eventDetail.data.produtoId
                );
                this.cartService
                  .apiCartGetByFilterGet(environment.portal)
                  .pipe(
                    first(),
                    tap((data) => this.store.setData('cart', data)),
                    finalize(() => this.store.setLoadingState('cart', false))
                  )
                  .subscribe();
                this.snackBar.open(
                  `Produto adicionado ao carrinho`,
                  'Ok',
                  this.snackbarColorService.getSnackBarConfig()
                );
                this.callbackTrigger(eventDetail.callback, data);
              },
              error: () => {
                this.snackBar.open(
                  'Erro ao adicionar o produto ao carrinho',
                  'Ok',
                  this.snackbarColorService.getSnackBarConfig()
                );
              },
            });
        }
      },
      false
    );
  }
  private initAddProductToAlert() {
    document.addEventListener(
      'addProductToAlert',
      (event: any) => {
        const eventDetail = event.detail as AddProductToAlert;
        of(eventDetail.data)
          .pipe(timeout(2000))
          .subscribe((response) => {
            console.log('data', response);
            this.snackBar.open(
              `Você será notificado quando o produto estiver disponível`,
              'Ok',
              this.snackbarColorService.getSnackBarConfig()
            );
            this.callbackTrigger(eventDetail.callback);
          });
      },
      false
    );
  }
  private initViewProductPrice() {
    document.addEventListener(
      'viewProductPrice',
      (event: any) => {
        const eventDetail = event.detail as ViewProductPrice;
        let isLogged;
        this.session
          .getIsAuthSubject()
          .subscribe((isAuth: boolean) => (isLogged = isAuth));
        if (!isLogged) {
          this.session.logout(
            true,
            true,
            `/produtos/${eventDetail.data.produtoId}`
          );
        } else {
          const warehouse = this.store
            .getData('warehouse')
            .getValue()
            ?.filter(
              (warehouse) => warehouse.id === eventDetail.data.storeCode
            )[0];
          const retailerId = warehouse?.retailerId;
          const storeCode = warehouse?.priceId;

          let xPortal = environment.portal;
          if (environment.portal === portals.kdp && retailerId === 2) {
            xPortal = portals.dpk;
          }
          this.priceService
            .apiPriceDpkGet(
              xPortal,
              storeCode,
              eventDetail.data.paymentCode,
              eventDetail.data.shippingCost,
              eventDetail.data.expenseValue,
              eventDetail.data.arrProdutoErp
            )
            .subscribe({
              next: (data) => {
                this.callbackTrigger(eventDetail.callback, data);
              },
              error: () => {
                this.snackBar.open(
                  'Erro ao consultar o preço do produto',
                  'Ok',
                  this.snackbarColorService.getSnackBarConfig()
                );
              },
            });
        }
      },
      false
    );
  }
  private initAddProductToBookmarks() {
    document.addEventListener(
      'addProductToBookmarks',
      (event: any) => {
        const eventDetail = event.detail as AddProductToBookmarks;
        this.favoriteService
          .apiProductFavoritePost(environment.portal, {
            idRetailer: eventDetail.data.depositoId,
            idProductRetailer: eventDetail.data.produtoErpId,
            idProduct: eventDetail.data.produtoId,
          })
          .subscribe({
            next: (data) => {
              this.dispatchEvent('productOnBookmarksState', eventDetail);
              this.snackBar.open(
                `Produto adicionado aos favoritos`,
                'Ok',
                this.snackbarColorService.getSnackBarConfig()
              );
              this.callbackTrigger(eventDetail.callback, data.id);
            },
            error: () => {
              this.snackBar.open(
                'Erro ao adicionar o produto aos favoritos',
                'Ok',
                this.snackbarColorService.getSnackBarConfig()
              );
            },
          });
      },
      false
    );
  }
  private initRemoveProductFromBookmarks() {
    document.addEventListener(
      'removeProductFromBookmarks',
      (event: any) => {
        const eventDetail = event.detail as RemoveProductFromBookmarks;
        this.favoriteService
          .apiProductFavoriteIdDelete(
            eventDetail.data.produtoId,
            environment.portal
          )
          .subscribe({
            next: () => {
              this.dispatchEvent('productOnBookmarksState', eventDetail);
              this.snackBar.open(
                `Produto removido dos favoritos`,
                'Ok',
                this.snackbarColorService.getSnackBarConfig()
              );
              this.callbackTrigger(eventDetail.callback, false);
            },
            error: () => {
              this.snackBar.open(
                'Erro ao remover o produto dos favoritos',
                'Ok',
                this.snackbarColorService.getSnackBarConfig()
              );
            },
          });
      },
      false
    );
  }
  private initCheckProductOnBookmarks() {
    document.addEventListener(
      'checkProductOnBookmarks',
      (event: any) => {
        const eventDetail = event.detail as CheckProductOnBookmarks;
        this.favoriteService
          .apiProductFavoriteGetByFilterGet(
            environment.portal,
            eventDetail.data.produtosId
          )
          .subscribe({
            next: (resp) => {
              this.dispatchEvent('productOnBookmarksState', eventDetail);
              this.callbackTrigger(eventDetail.callback, resp);
            },
            error: () => {
              this.snackBar.open(
                'Erro ao consultar se o produto é favorito',
                'Ok',
                this.snackbarColorService.getSnackBarConfig()
              );
            },
          });
      },
      false
    );
  }
  private initOpenGarantia() {
    document.addEventListener(
      'openGarantia',
      () => {
        this.kdapecaService
          .apiKdapecaWarrantyGet(environment.portal)
          .subscribe((response) => {
            if (response.link) {
              window.open(response.link);
            }
          });
      },
      false
    );
  }
  callbackTrigger(callbackFunction: Function | undefined, response?: any) {
    if (callbackFunction && typeof callbackFunction === 'function') {
      callbackFunction(response);
    }
  }

  dispatchEvent(
    eventName: string,
    detail:
      | UpdateCD
      | ViewCDByProduct
      | NavigateToSimilarProducts
      | AddCart
      | AddProductToCart
      | AddProductToAlert
      | NavigateToProduct
      | ViewProductPrice
      | AddProductToBookmarks
      | RemoveProductFromBookmarks
      | CheckProductOnBookmarks
      | undefined
  ) {
    const event = new CustomEvent(eventName, { detail });
    document.dispatchEvent(event);
  }
  updateCD(data: UpdateCD) {
    this.dispatchEvent('updateCD', data);
  }
  viewCDByProduct(data: ViewCDByProduct) {
    this.dispatchEvent('viewCDByProduct', data);
  }
  EventUpdateCD(data: UpdateCD) {
    this.dispatchEvent('updateCD', data);
  }
  navigateToSimilarProducts(data: NavigateToSimilarProducts) {
    this.dispatchEvent('navigateToSimilarProducts', data);
  }
  addCart(data: AddCart) {
    this.dispatchEvent('addCart', data);
  }
  addProductToCart(data: AddProductToCart) {
    this.dispatchEvent('addProductToCart', data);
  }
  addProductToAlert(data: AddProductToAlert) {
    this.dispatchEvent('addProductToAlert', data);
  }
  navigateToProduct(data: NavigateToProduct) {
    this.dispatchEvent('navigateToProduct', data);
  }
  viewProductPrice(data: ViewProductPrice) {
    this.dispatchEvent('viewProductPrice', data);
  }
  addProductToBookmarks(data: AddProductToBookmarks) {
    this.dispatchEvent('addProductToBookmarks', data);
  }
  removeProductFromBookmarks(data: RemoveProductFromBookmarks) {
    this.dispatchEvent('removeProductFromBookmarks', data);
  }
  checkProductOnBookmarks(data: CheckProductOnBookmarks) {
    this.dispatchEvent('checkProductOnBookmarks', data);
  }
  openGarantia() {
    this.dispatchEvent('openGarantia', undefined);
  }
}

export const EventsApiServiceProvider = {
  provide: APP_INITIALIZER,
  useFactory: (eventsApi: EventsApiService) => () => eventsApi.init(),
  deps: [EventsApiService],
  multi: true,
};
