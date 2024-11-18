import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
} from '@angular/core';
import { PaymentDpkDto } from '@generated/api/dpk-order-svc';
import { CarrinhoService } from '@modules/carrinho/carrinho.service';
import { StoreService } from '@shared/services/store.service';
import { StepperSelectionEvent } from '@angular/cdk/stepper';

@Component({
  selector: 'app-card-payment',
  templateUrl: './card-payment.component.html',
  styleUrls: ['./card-payment.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CardPaymentComponent {
  payment: PaymentDpkDto | undefined;
  isLoading: boolean | undefined;

  constructor(
    private store: StoreService,
    private carrinhoService: CarrinhoService,
    private readonly cdr: ChangeDetectorRef
  ) {
    this.carrinhoService.loadStepEvent.subscribe(
      (event: StepperSelectionEvent) => {
        if (event.selectedIndex === 2) {
          this.payment = this.store.getSelected('payment').getValue();
          this.cdr.markForCheck();
        }
      }
    );
  }
}
