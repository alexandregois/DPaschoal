import { StepperSelectionEvent } from '@angular/cdk/stepper';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatStep } from '@angular/material/stepper';
import {
  CartDto,
  OrderItemDto,
  OrderPaymentCreditCardDto,
} from '@generated/api/dpk-order-svc';
import { PriceResponseDto } from '@generated/api/dpk-price-svc';
import { Subject, finalize } from 'rxjs';
import { StoreService } from '@shared/services/store.service';
import { CarrinhoService } from './carrinho.service';
import { Router } from '@angular/router';
import { SnackBarColorService } from '@shared/services/snackbarColor.service';
import { PaymentTypeService } from '@shared/services/payment-type.service';
import { HostListener } from '@angular/core';
@Component({
  selector: 'app-carrinho',
  templateUrl: './carrinho.component.html',
  styleUrls: ['./carrinho.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CarrinhoComponent implements OnInit {
  cartList: CartDto[] | undefined;
  cart: CartDto | undefined;
  orderItemList: OrderItemDto[] = [];
  productRetailerIdList: number[] = [];
  priceList: PriceResponseDto[] = [];
  orderPaymentCreditCard: OrderPaymentCreditCardDto | undefined;
  isLoading: boolean = false;
  isCartDefined: boolean = false;
  isPaymentDefined: boolean = false;
  isShippingDefined: boolean = false;
  isSubmittingOrder: boolean = false;
  isSuccessSubmitOrder: boolean = false;
  isReloadingPrice: boolean = false;
  stepFinalizar: boolean = false;
  isDisabledButtonStepOne: boolean = false;
  paymentType?: string | number | null;
  showPaymentButton: boolean = false;
  isGridView: boolean = false;
  @ViewChild('Pagamento')
  paymentStep!: MatStep;
  @ViewChild('Frete') shippingStep!: MatStep;
  @ViewChild('Finalizar') finalizarStep!: MatStep;

  total: number | undefined;
  impostos: number | undefined;
  totalItems: number | undefined;
  frete: number | undefined;
  despesasAcessorias: number | undefined;
  isMotorcycleLock: boolean | undefined;
  isValorMinimo: boolean = false;
  isCardFormValid: boolean = false;
  cardFormData: any;
  parcelas: number = 1;
  paymentTypeDescription: string | undefined;
  private unsubscribe$ = new Subject<void>();

  constructor(
    private readonly cdr: ChangeDetectorRef,
    private service: CarrinhoService,
    private store: StoreService,
    private snackBar: MatSnackBar,
    private router: Router,
    private snackbarColorService: SnackBarColorService,
    private paymentTypeService: PaymentTypeService
  ) {
    this.service.getCarts().subscribe();
    this.paymentTypeService.currentFormStatus.subscribe((isValid) => {
      this.isCardFormValid = isValid;
    });

    this.paymentTypeService.currentFormData.subscribe((data) => {
      this.cardFormData = data;
    });
  }

  ngOnInit(): void {
    this.loadCarts();

    this.store.getSelected('cart').subscribe((cart) => {
      this.cart = cart;
      this.isCartDefined = !!cart;
    });

    this.store.getSelected('payment').subscribe((payment) => {
      this.isPaymentDefined = !!payment;
      if (payment && payment.description) {
        this.paymentTypeDescription = payment.description;
        this.parcelas = this.paymentTypeService.getParcelasFromDescription(
          payment.description
        );
      }
    });

    this.store.getSelected('shipping').subscribe((shipping) => {
      this.isShippingDefined = !!shipping;
      if (!shipping || this.cart === undefined || !this.cart.hubId) {
        return;
      }
      this.loadFrete(shipping.shippingCost);
      const payment = this.store.getSelected('payment').getValue();
      if (
        this.total &&
        this.frete !== undefined &&
        shipping.id &&
        payment &&
        payment.id
      ) {
        if (payment && payment.id) {
          this.paymentType = payment.id;
          this.showPaymentButton = payment.id >= 901 && payment.id <= 906;
        }
        this.atualizaPreco();
        this.service
          .getAdditionalTax({
            hubId: this.cart.hubId,
            paymentCode: payment.id,
            shippingCompanyId: shipping.id,
            totalOrder: this.total,
            totalWeight: 0,
            deliveryType: shipping.deliveryType!,
          })
          .subscribe({
            next: (response) => this.loadDespesasAcessorias(response),
            complete: () => this.cdr.markForCheck(),
          });
      }
    });
    const windowWidth = window.innerWidth;
    if (windowWidth <= 1025) {
      this.isGridView = true;
    } else {
      this.isGridView = false;
    }
  }

  loadTotal(valor: number | undefined) {
    this.total = valor;
  }

  loadImpostos(valor: number | undefined) {
    this.impostos = valor;
  }

  loadTotalItems(valor: number | undefined) {
    this.totalItems = valor;
  }

  loadFrete(valor: number | undefined) {
    this.frete = valor;
  }

  loadDespesasAcessorias(valor: number | undefined) {
    this.despesasAcessorias = valor;
  }

  updateOrderItemList(OrderItemList: OrderItemDto[]) {
    this.orderItemList = OrderItemList;
  }

  updateMotorcycleLock(isLock: boolean) {
    this.isMotorcycleLock = isLock;
  }

  atualizaPreco() {
    const total = this.total;
    const payment = this.store.getSelected('payment').getValue();
    console.log('valor total', this.total);
  }

  loadCarts(): void {
    this.isLoading = true;
    this.store.getData('cart').subscribe((cartList) => {
      if (cartList) {
        this.cartList = cartList;
      }
    });
    this.service.getCarts().subscribe({
      next: (response) => (this.cartList = response),
      // TODO Revisar tratamento de erro
      // error: error => this.snackBar.open(error, 'Ok'),
      complete: () => {
        this.isLoading = false;
        this.cdr.markForCheck();
      },
    });
  }

  deleteAllCartItems(cartId: string | undefined): void {
    if (cartId === undefined) {
      return;
    }
    this.isLoading = true;
    this.service.deleteAllCartItems(cartId).subscribe({
      next: (response) => {
        if (response) {
          this.reloadCart();
        } else {
          this.isLoading = false;
        }
      },
      // TODO Revisar tratamento de erro
      // error: error => this.snackBar.open(error, 'Ok'),
      complete: () => {
        this.cdr.markForCheck();
      },
    });
  }

  goForwardController() {
    let payment = this.store.getSelected('payment').getValue();
    let minPaymentValue = 0;
    let total = 0;
    if (this.total) {
      total = this.total;
    }
    if (payment?.minimumValue) {
      minPaymentValue = payment?.minimumValue;
    }
    if (minPaymentValue > total) {
      this.paymentStep._stepper.previous();
    } else {
      this.paymentStep._stepper.next();
    }
    if (!this.isPaymentDefined) {
      window.scroll({
        top: 0,
        left: 0,
        behavior: 'smooth',
      });
    }
  }

  submitOrder() {
    let paymentType = this.store.getSelected('paymentType').getValue();
    if (paymentType?.description === 'Cartão de crédito') {
      if (!this.isCardFormValid) {
        this.snackBar.open(
          'Não foi possível realizar seu pedido. Preencha os dados do cartão.',
          'Ok',
          this.snackbarColorService.getSnackBarConfig()
        );
        return;
      } else {
        var dataCreditCard: OrderPaymentCreditCardDto = {
          method: this.cardFormData.method,
          holder: this.cardFormData.cardName,
          number: this.cardFormData.cardNumber,
          expiryMonth: this.cardFormData.expiryMonth
            ?.toString()
            .padStart(2, '0'),
          expiryYear: this.cardFormData.expiryYear?.toString(),
          cvv: this.cardFormData.cvv,
          installments: this.parcelas,
          isMainAddress: this.cardFormData.isMainAddress,
          street: this.cardFormData.endereco,
          addressNumber: this.cardFormData.numero,
          district: this.cardFormData.bairro,
          city: this.cardFormData.cidade,
          state: this.cardFormData.estado,
          complement: this.cardFormData.complemento,
          zipCode: this.cardFormData.cep,
        };
        this.orderPaymentCreditCard = dataCreditCard;
        if (dataCreditCard?.isMainAddress) {
          if (!dataCreditCard?.zipCode) {
            this.snackBar.open(
              'CEP não informado, revise o pedido.',
              'Ok',
              this.snackbarColorService.getSnackBarConfig()
            );
            return;
          }
          if (!dataCreditCard?.street) {
            this.snackBar.open(
              'Endereço não informado, revise o pedido.',
              'Ok',
              this.snackbarColorService.getSnackBarConfig()
            );
            return;
          }
          if (!dataCreditCard?.addressNumber) {
            this.snackBar.open(
              'Número não informado, revise o pedido.',
              'Ok',
              this.snackbarColorService.getSnackBarConfig()
            );
            return;
          }
          if (!dataCreditCard?.district) {
            this.snackBar.open(
              'Bairro não informado, revise o pedido.',
              'Ok',
              this.snackbarColorService.getSnackBarConfig()
            );
            return;
          }
          if (!dataCreditCard?.city) {
            this.snackBar.open(
              'Cidade não informada, revise o pedido.',
              'Ok',
              this.snackbarColorService.getSnackBarConfig()
            );
            return;
          }
          if (!dataCreditCard?.state) {
            this.snackBar.open(
              'Estado não informado, revise o pedido.',
              'Ok',
              this.snackbarColorService.getSnackBarConfig()
            );
            return;
          }
        }
      }
    }
    this.isSubmittingOrder = true;
    this.service
      .submitOrder({
        total: this.total,
        impostos: this.impostos,
        frete: this.frete,
        despesasAcessorias: this.despesasAcessorias,
        orderItems: this.orderItemList,
        orderPaymentCreditCard: this.orderPaymentCreditCard,
      })
      .pipe(
        finalize(() => {
          this.isSubmittingOrder = false;
          this.cdr.markForCheck();
        })
      )
      .subscribe({
        next: () => {
          this.store.setSelected('shipping', undefined);
          this.isSuccessSubmitOrder = true;
          this.loadCarts();
          this.router.navigate(['/pedidos']);
          console.log('Valor do formulario', this.cardFormData);
        },
        error: () =>
          this.snackBar.open(
            'Não foi possível realizar seu pedido. Tente novamente mais tarde.',
            'Ok',
            this.snackbarColorService.getSnackBarConfig()
          ),
      });
  }

  reloadCart(): void {
    this.service
      .getCarts()
      .pipe(
        finalize(() => {
          this.isLoading = false;
          this.cdr.markForCheck();
        })
      )
      .subscribe({
        next: (response) => {
          this.snackBar.open(
            'Carrinho atualizado!',
            'Ok',
            this.snackbarColorService.getSnackBarConfig()
          );
          if (response && response !== null) {
            this.cartList = response;
            this.cart = response[0];
            this.store.setSelected('cart', this.cart);
          } else {
            this.cartList = [];
            this.cart = undefined;
          }
        },
        // TODO Revisar tratamento de erro
        // error: error => this.snackBar.open(error, 'Ok'),
      });
  }

  sendShippingLoadEvent(event: StepperSelectionEvent) {
    this.stepFinalizar = event.selectedIndex === 2;
    if (event.selectedIndex > 0) {
      this.service.loadStepEvent.emit(event);
    } else {
      this.frete = undefined;
      this.despesasAcessorias = undefined;
      this.store.setSelected('shipping', undefined);
      this.finalizarStep.reset();
      this.shippingStep.reset();
      this.cdr.detectChanges();
    }
  }

  atualizarCarrinho(carrinhoVazio: boolean) {
    if (carrinhoVazio) {
      this.cartList = [];
      this.cart = undefined;
    }
  }

  validarContinuar(valorFaltante: number) {
    this.isValorMinimo = valorFaltante > 0;
    if (valorFaltante > 0) {
      this.isValorMinimo = true;
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
}
