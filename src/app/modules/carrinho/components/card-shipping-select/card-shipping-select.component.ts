import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CartDto, PaymentDpkDto } from '@generated/api/dpk-order-svc';
import { CarrierDeliveryTimeDto } from '@generated/api/dpk-shipping-svc';
import { Warehouse } from '@models/deposito.model';
import { CarrinhoService } from '@modules/carrinho/carrinho.service';
import { StoreService } from '@shared/services/store.service';
import { finalize } from 'rxjs';
import { CardShippingSelectService } from './card-shipping-select.service';
import { StepperSelectionEvent } from '@angular/cdk/stepper';
import { SnackBarColorService } from '@shared/services/snackbarColor.service';

@Component({
  selector: 'app-card-shipping-select',
  templateUrl: './card-shipping-select.component.html',
  styleUrls: ['./card-shipping-select.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CardShippingSelectComponent implements OnInit {
  @Input() total: number | undefined;
  @Input() impostos: number | undefined;
  @Input() isMotorcycleLock: boolean | undefined;

  shippingList: CarrierDeliveryTimeDto[] | undefined;
  isLoading: boolean | undefined = true;
  cart: CartDto | undefined;
  warehouseList: Warehouse[] | undefined = [];
  productRetailerIdList: number[] = [];

  payment: PaymentDpkDto | undefined;

  constructor(
    private cardShippingSelectService: CardShippingSelectService,
    private snackBar: MatSnackBar,
    private store: StoreService,
    private readonly cdr: ChangeDetectorRef,
    private carrinhoService: CarrinhoService,
    private snackbarColorService: SnackBarColorService
  ) {}

  ngOnInit(): void {
    this.carrinhoService.loadStepEvent.subscribe(
      (event: StepperSelectionEvent) => {
        if (event.selectedIndex === 1 && event.previouslySelectedIndex === 0) {
          this.isLoading = true;
          this.cdr.detectChanges();
          this.store.setSelected('shipping', undefined);
          this.cart = this.store.getSelected('cart').getValue();
          // this.loadPrice();
          this.getShippings();
          this.warehouseList = this.store.getData('warehouse').getValue();
        }
      }
    );
  }

  changeShipping(shipping: CarrierDeliveryTimeDto): void {
    this.store.setSelected('shipping', shipping);
  }

  getShippings(): void {
    const cart = this.store.getSelected('cart').value;
    if (!cart || !cart.hubId || !this.total || this.impostos === undefined) {
      this.isLoading = false;
      return;
    }

    this.payment = this.store.getSelected('payment').getValue();

    let paymentId = 0;
    if (this.payment?.id) paymentId = this.payment.id;

    this.cardShippingSelectService
      .buscarTransportes(cart.hubId, this.total, paymentId)
      .pipe(
        finalize(() => {
          this.isLoading = false;
          this.cdr.markForCheck();
        })
      )
      .subscribe({
        next: (response: CarrierDeliveryTimeDto[]) => {
          let responseFilter: CarrierDeliveryTimeDto[] = [];
          response.forEach((shipping) => {
            if (this.isMotorcycleLock) {
              if (shipping.deliveryType !== 'M') {
                responseFilter.push(shipping);
              }
            } else {
              responseFilter.push(shipping);
            }
          });
          this.shippingList = responseFilter;
        },
        error: () =>
          this.snackBar.open(
            'Erro ao consultar as transportadoras',
            'Ok',
            this.snackbarColorService.getSnackBarConfig()
          ),
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
}
