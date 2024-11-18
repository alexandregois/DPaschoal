import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
} from '@angular/core';
import { CartDto } from '@generated/api/dpk-order-svc';
import { CarrierDeliveryTimeDto } from '@generated/api/dpk-shipping-svc';
import { Warehouse } from '@models/deposito.model';
import { CarrinhoService } from '@modules/carrinho/carrinho.service';
import { StoreService } from '@shared/services/store.service';
import { StepperSelectionEvent } from '@angular/cdk/stepper';

@Component({
  selector: 'app-card-shipping',
  templateUrl: './card-shipping.component.html',
  styleUrls: ['./card-shipping.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CardShippingComponent {
  shipping: CarrierDeliveryTimeDto | undefined;
  isLoading: boolean | undefined;

  cart: CartDto | undefined;
  warehouseList: Warehouse[] | undefined = [];

  constructor(
    private store: StoreService,
    private readonly cdr: ChangeDetectorRef,
    private carrinhoService: CarrinhoService
  ) {
    this.carrinhoService.loadStepEvent.subscribe(
      (event: StepperSelectionEvent) => {
        if (event.selectedIndex === 2) {
          this.shipping = this.store.getSelected('shipping').getValue();
          this.cart = this.store.getSelected('cart').getValue();
          this.warehouseList = this.store.getData('warehouse').getValue();
          this.cdr.markForCheck();
        }
      }
    );
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
