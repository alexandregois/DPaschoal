import { EventsApiService } from '@core/services/events-api.service';
import { CurrencyPipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  OnInit,
  Output,
} from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ProducDetailDto } from '@generated/api/api-external-svc';
import {
  CartDto,
  OrderItemDto,
  PaymentDpkDto,
  PaymentTypeDto,
} from '@generated/api/dpk-order-svc';
import { PriceResponseDto } from '@generated/api/dpk-price-svc';

import { Warehouse } from '@models/deposito.model';
import { StoreService } from '@shared/services/store.service';
import { finalize } from 'rxjs';
import { PagamentoService } from './pagamento.service';
import { PaymentTypeService } from '@shared/services/payment-type.service';
import { DepositoService } from '@core/services/deposito.service';

@Component({
  selector: 'app-pagamento',
  templateUrl: './pagamento.component.html',
  styleUrls: ['./pagamento.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PagamentoComponent implements OnInit {
  selectedWarehouse: any;
  isLoading: boolean = false;
  isLoadingPrice: boolean = false;
  showPayments: boolean = false;
  isLoadedPayments: boolean = false;
  orderValue: number = 0;
  cart: CartDto | undefined | null;
  cartList: CartDto[] | undefined;
  productList: ProducDetailDto[] = [];
  priceList: PriceResponseDto[] | undefined;
  paymentList: PaymentDpkDto[] | undefined;
  paymentTypeList: PaymentTypeDto[] | undefined;
  warehouseList: Warehouse[] | undefined;
  productRetailerIdList: number[] = [];
  detalhePlanoPagamento: string = '';
  warehouseListWithCart:
    | { description: string; retailerId: number; cart: CartDto | null }[]
    | undefined;
  lastPayment: PaymentDpkDto | null = null;
  lastPaymentType: PaymentTypeDto | null = null;

  formGroup = this._formBuilder.group({
    cart: [null as CartDto | null | undefined, Validators.required],
    paymentType: [null as PaymentTypeDto | null, Validators.required],
    payment: [null as PaymentDpkDto | null, Validators.required],
  });

  @Output() total = new EventEmitter<number>();
  @Output() impostos = new EventEmitter<number>();
  @Output() totalItems = new EventEmitter<number>();
  @Output() updateOrderItemList = new EventEmitter<OrderItemDto[]>();
  @Output() isMotorcycleLock = new EventEmitter<boolean>();
  @Output() carrinhoVazio = new EventEmitter<boolean>();
  @Output() valorFaltante = new EventEmitter<number>();

  constructor(
    private _formBuilder: FormBuilder,
    private readonly cdr: ChangeDetectorRef,
    private service: PagamentoService,
    private store: StoreService,
    private currencyPipe: CurrencyPipe,
    private events: EventsApiService,
    private paymentTypeService: PaymentTypeService,
    private depositoService: DepositoService
  ) {}

  ngOnInit(): void {
    this.formGroup.get('cart')?.valueChanges.subscribe((cart) => {
      if (this.store.getSelected('cart').value?.hubId !== cart?.hubId) {
        this.store.setSelected('paymentType', undefined);
        this.store.setSelected('payment', undefined);
        this.formGroup.get('paymentType')?.setValue(null);
        this.formGroup.get('payment')?.setValue(null);
      }
      this.total.emit(undefined);
      this.impostos.emit(undefined);
      this.totalItems.emit(undefined);
      this.store.setSelected('cart', cart);
    });
    this.formGroup.get('paymentType')?.valueChanges.subscribe((paymentType) => {
      if (
        this.lastPaymentType === null ||
        this.lastPaymentType !== paymentType
      ) {
        this.lastPaymentType = paymentType;
        this.store.setSelected('payment', undefined);
        this.detalhePlanoPagamento = '';
        if (paymentType?.id) {
          this.showPayments = true;
          this.store.setSelected('paymentType', paymentType);
          const btn = document.getElementById('ValorParcela');
          if (paymentType.description != 'Cartão de crédito') {
            if (btn != null) {
              btn.style.display = 'block';
            }
          } else {
            if (btn != null) {
              btn.style.display = 'none';
            }
          }
          this.loadPayments();
          this.paymentTypeService.changePaymentType(
            paymentType?.description || null
          );
        } else {
          this.showPayments = false;
        }
      }
    });

    this.formGroup.get('payment')?.valueChanges.subscribe((payment) => {
      if (this.lastPayment === null || this.lastPayment !== payment) {
        this.lastPayment = payment;
        this.store.setSelected('payment', payment);
        this.detalhePlanoPagamento = '';
        if (
          this.lastPayment !== null &&
          this.lastPayment?.id !== 225 &&
          this.lastPayment?.id !== 220
        ) {
          this.updatePrice();
        }
      }
    });

    // this.store.getData('cart').subscribe(() => this.setWarehouseListWithCart());
    this.setWarehouseListWithCart();

    this.store
      .getSelected('cart')
      .subscribe(() => this.getPaymentsTypesFromStore());
  }

  onDescriptionChange() {
    this.warehouseList = this.store.getData('warehouse').value;
    let storeCart = this.store.getSelected('cart').getValue();
    const selectedDeposito =
      this.warehouseList?.find((item) => item.id === storeCart?.hubId) ?? null;
    this.depositoService.setSelectedDepositoForPayment(selectedDeposito);
  }

  private reloadSelectedCart() {
    this.cartList = this.store.getData('cart').getValue();
    if (!this.cartList) {
      this.store.setSelected('cart', null);
      this.store.setSelected('paymentType', null);
      this.store.setSelected('payment', null);
      return;
    }
    let cart: CartDto;
    let warehouseFilter;
    if (this.warehouseListWithCart) {
      let storeCart = this.store.getSelected('cart').getValue();
      if (storeCart && storeCart !== undefined) {
        warehouseFilter = this.warehouseListWithCart.filter(
          (elm) => elm.cart?.hubId === storeCart?.hubId
        );
      }
      if (warehouseFilter && warehouseFilter.length > 0) {
        cart = warehouseFilter[0].cart!;
        this.cart = cart;
        this.formGroup.get('cart')?.setValue(cart);
      } else {
        cart = this.warehouseListWithCart[0].cart!;
        this.cart = cart;
        this.formGroup.get('cart')?.setValue(cart);
        this.formGroup.get('paymentType')?.setValue(null);
        this.formGroup.get('payment')?.setValue(null);
        this.loadPaymentTypes(cart.retailerId!);
      }
    } else {
      cart = this.cartList[0];
      this.formGroup.get('cart')?.setValue(cart);
      this.formGroup.get('paymentType')?.setValue(null);
      this.formGroup.get('payment')?.setValue(null);
      this.loadPaymentTypes(cart.retailerId!);
    }
  }

  private getPaymentsFromStore() {
    this.paymentList = this.store.getData('payment').getValue();
    if (!this.paymentList) {
      return;
    }
    let payment = this.store.getSelected('payment').getValue();
    if (payment) {
      let paymentStore = this.paymentList?.filter(
        (elm) => elm.id === payment?.id
      );
      payment = paymentStore ? paymentStore[0] : undefined;
      this.formGroup.get('payment')?.setValue(payment!);
    } else if (this.paymentList && this.paymentList.length === 1) {
      this.formGroup.get('payment')?.setValue(this.paymentList[0]);
      console.log(this.paymentList[0]);
    }
    this.isLoadedPayments = true;
    const paymentStore = this.store.getSelected('payment').getValue();
    if (
      this.paymentList &&
      paymentStore !== undefined &&
      this.productList.length < 1
    ) {
      this.loadProductDetails();
    } else {
      this.loadPrice();
    }
  }

  private getPaymentsTypesFromStore() {
    var carrinho = this.store.getSelected('cart').value;
    if (!carrinho || !carrinho.id) {
      return;
    }
    const paymentTypeList = this.store.getData('paymentType').getValue();
    this.paymentTypeList = paymentTypeList;

    const paymentTypeStore = this.store.getSelected('paymentType').getValue();
    const paymentStore = this.store.getSelected('payment').getValue();
    if (paymentTypeStore === undefined || paymentStore === undefined) {
      if (this.productList.length < 1) {
        this.loadProductDetails();
      }
    } else {
      let list = paymentTypeList?.filter(
        (elm) => elm.id === paymentTypeStore?.id
      );
      let paymentType = list ? list[0] : undefined;
      this.formGroup.get('paymentType')?.setValue(paymentType!);
      this.formGroup.get('payment')?.setValue(paymentStore!);
      this.getPaymentsFromStore();
    }
  }

  setWarehouseListWithCart(): void {
    this.warehouseList = this.store.getData('warehouse').value;
    this.cartList = this.store.getData('cart').value;
    if (!this.cartList || this.cartList === null || !this.warehouseList) {
      this.cart = undefined;
      return;
    }
    this.warehouseListWithCart = this.warehouseList
      .sort((a, b) => {
        if (a.description > b.description) {
          return 1;
        }
        if (a.description < b.description) {
          return -1;
        }
        return 0;
      })
      .map((warehouse) => ({
        description: warehouse.description,
        retailerId: warehouse.retailerId,
        cart:
          this.cartList?.filter((cart) => cart.hubId === warehouse.id)[0] ||
          null,
      }))
      .filter((warehouseWithCart) => warehouseWithCart.cart !== null);

    this.reloadSelectedCart();
  }

  loadProductDetails(): void {
    this.isLoading = true;
    this.cart = this.store.getSelected('cart').getValue()!;
    this.productRetailerIdList = [];
    this.cart?.cartItems?.forEach((item) => {
      if (item.productRetailerId) {
        if (!this.productRetailerIdList.includes(item.productRetailerId)) {
          this.productRetailerIdList.push(item.productRetailerId);
        }
        if (item.productId) {
          this.getProductById(item.productId);
        }
      }
    });

    this.loadPrice();

    this.isLoading = false;
    this.cdr.markForCheck();
  }

  updatePrice(): void {
    this.productRetailerIdList = [];
    this.cart?.cartItems?.forEach((item) => {
      if (item.productRetailerId) {
        if (!this.productRetailerIdList.includes(item.productRetailerId)) {
          this.productRetailerIdList.push(item.productRetailerId);
        }
      }
    });

    this.loadPrice();
  }

  loadPrice(): void {
    if (this.priceList) {
      if (this.priceList.length > 1) {
        return;
      }
    }
    this.priceList = [];
    let store = this.formGroup.get('cart')?.value?.hubId;
    if (!this.cartList || !this.warehouseList || !store) {
      this.store.setSelected('payment', undefined);
      return;
    }
    this.isLoadingPrice = true;
    const paymentStore = this.store.getSelected('payment').getValue();
    this.events.viewProductPrice({
      data: {
        storeCode: store,
        arrProdutoErp: this.productRetailerIdList,
        paymentCode: paymentStore?.id,
      },
      callback: (priceList: PriceResponseDto[]) => {
        this.isLoadingPrice = false;
        if (priceList.length) {
          this.priceList = priceList;

          let cartModified = false;
          this.cart?.cartItems?.map((cartItem: OrderItemDto) => {
            const price = priceList.filter(
              (price: PriceResponseDto) =>
                price.id === cartItem.productRetailerId
            )[0];
            if (
              cartItem.quantity &&
              price?.stock &&
              cartItem.quantity > price?.stock
            ) {
              cartModified = true;
              cartItem.quantity = price?.stock;
            }
          });

          if (this.cart && cartModified) {
            this.service
              .updateCart(this.cart)
              .pipe(
                finalize(() => {
                  this.cdr.markForCheck();
                })
              )
              .subscribe({
                next: (cart) => {
                  this.store.setSelected('cart', cart);
                },
              });
          }

          const isMotorcycleLock =
            this.priceList.filter((price) => price?.motorcycleLock === true)
              .length > 0;
          const total = this.getTotal(paymentStore);
          const impostos = this.getImpostos();
          this.orderValue = total + impostos;

          this.updateCheckMinValuesPayments();

          const cartItems = this.cart?.cartItems;
          const orderItemList = cartItems?.map((cartItem: OrderItemDto) => ({
            productId: cartItem.productId,
            productRetailerId: cartItem.productRetailerId,
            quantity: cartItem.quantity,
            position: cartItem.position,
            code: cartItem.code,
            description: cartItem.description,
            manufacturer: cartItem.manufacturer,
          }));

          this.updateOrderItemList.emit(orderItemList);
          this.total.emit(total);
          this.impostos.emit(impostos);
          this.isMotorcycleLock.emit(isMotorcycleLock);
          this.getTotalItems();
        }
        this.cdr.markForCheck();
      },
    });
  }

  private updateCheckMinValuesPayments(): void {
    let paymentSelected = this.formGroup.get('payment')?.value;
    if (this.checkMinValue(paymentSelected?.minimumValue) > 0) {
      this.store.setSelected('payment', paymentSelected);
    }
    this.cdr.detectChanges();
  }

  private getPaymentDetails(paymentSelected: any): void {
    this.detalhePlanoPagamento = '';
    if (paymentSelected) {
      if (
        (paymentSelected?.additionPercent === undefined ||
          paymentSelected?.additionPercent === 0) &&
        (paymentSelected?.discountPercent === undefined ||
          paymentSelected?.discountPercent === 0)
      ) {
        this.detalhePlanoPagamento =
          'Acima de: ' +
          this.currencyPipe.transform(paymentSelected?.minimumValue) +
          ' / Prazo médio: ' +
          paymentSelected?.delivery +
          ' dia(s)';
      } else if (
        paymentSelected?.discountPercent !== undefined &&
        paymentSelected?.discountPercent > 0
      ) {
        this.detalhePlanoPagamento =
          'Desc. ' +
          paymentSelected?.discountPercent +
          '% / Acima de: ' +
          this.currencyPipe.transform(paymentSelected?.minimumValue) +
          ' / Prazo médio: ' +
          paymentSelected?.delivery +
          ' dia(s)';
      } else if (
        paymentSelected?.additionPercent !== undefined &&
        paymentSelected?.additionPercent > 0
      ) {
        this.detalhePlanoPagamento =
          'Acrésc. ' +
          paymentSelected?.additionPercent +
          '% / Acima de: ' +
          this.currencyPipe.transform(paymentSelected?.minimumValue) +
          ' / Prazo médio: ' +
          paymentSelected?.delivery +
          ' dia(s)';
      }
      this.detalhePlanoPagamento = this.detalhePlanoPagamento + '\n';
    }
    this.cdr.detectChanges();
  }

  loadPayments(): void {
    this.isLoadedPayments = false;
    let paymentType = this.formGroup.get('paymentType')?.value;
    let cart = this.formGroup.get('cart')?.value;
    if (paymentType?.id && cart?.retailerId) {
      this.service.getPayments(paymentType.id, cart?.retailerId).subscribe({
        next: () => this.getPaymentsFromStore(),
        error: () => (this.showPayments = false),
        complete: () => {
          this.cdr.markForCheck();
        },
      });
    }
  }

  loadPaymentTypes(retailerId: number): void {
    this.service.getPaymentTypes(retailerId).subscribe({
      next: () => {
        this.getPaymentsTypesFromStore();
      },
      complete: () => this.cdr.markForCheck(),
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

  getTotal(payment?: PaymentDpkDto | null): number {
    let total = 0;
    if (!this.priceList) {
      total = 0;
    } else {
      total =
        this.priceList
          .map((price) => this.itemPrice(price).price)
          .reduce((sum, current) => (!!sum ? sum + current! : current), 0) || 0;
    }

    if (payment) {
      this.getPaymentDetails(payment);
    }

    return total;
  }

  getImpostos(): number {
    if (!this.priceList) {
      return 0;
    }
    return (
      this.priceList
        .map((price) => this.itemPrice(price).icms)
        .reduce((sum, current) => (!!sum ? sum + current! : current), 0) || 0
    );
  }

  getTotalItems(): void {
    let totalItems =
      this.cart?.cartItems
        ?.map((cartItem) => cartItem.quantity || 0)
        .reduce((sum, current) => sum + current, 0) || 0;

    this.totalItems.emit(totalItems);
  }

  getProductById(productId: number): void {
    this.service.getProductById(productId).subscribe({
      next: (response) => {
        if (response?.product !== null) {
          this.productList.push(response);
        }
      },
      complete: () => this.cdr.markForCheck(),
    });
  }

  getCustomerWarehouseByHubId(
    hubId: number | undefined
  ): Warehouse | undefined {
    if (!this.warehouseList || !hubId) {
      return undefined;
    }

    const Warehouse = this.warehouseList.filter(
      (Warehouse) => Warehouse.id === hubId
    )[0];

    return Warehouse;
  }

  getProductDetail(itemId: number | undefined): ProducDetailDto | undefined {
    if (itemId === undefined || !this.productList) {
      return undefined;
    }
    const productDetail = this.productList.filter(
      (product) => product.product?.id === itemId
    )[0];
    return productDetail;
  }

  getPriceById(
    productRetailerId: number | undefined
  ): PriceResponseDto | undefined {
    if (!productRetailerId || !this.priceList) {
      return undefined;
    }
    return this.priceList.filter((price) => price?.id === productRetailerId)[0];
  }

  checkMinValue(minimumValue: number | undefined) {
    const faltante = this.orderValue - (minimumValue || 0);
    this.valorFaltante.emit(faltante);
    return faltante;
  }

  atualizaCarrinhos(carrinhoVazio: boolean) {
    if (carrinhoVazio) {
      this.carrinhoVazio.emit(true);
    } else {
      this.setWarehouseListWithCart();
    }
  }
}
