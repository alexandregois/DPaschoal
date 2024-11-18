import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
} from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { finalize, first } from 'rxjs';
import { Customer as CustomerEnum } from '@core/enum/auth.enum';
import { CardAddressService } from './card-address.service';
import { Customer, CustomerAddress } from '@models/customer.model';
import { CarrinhoService } from '@modules/carrinho/carrinho.service';
import { StoreService } from '@shared/services/store.service';
import { SnackBarColorService } from '@shared/services/snackbarColor.service';

@Component({
  selector: 'app-card-address',
  templateUrl: './card-address.component.html',
  styleUrls: ['./card-address.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CardAddressComponent {
  address: CustomerAddress | undefined;
  isLoading$ = this.store.getLoadingState('customer');
  constructor(
    private cardAddressService: CardAddressService,
    private snackBar: MatSnackBar,
    private carrinhoService: CarrinhoService,
    private readonly cdr: ChangeDetectorRef,
    private store: StoreService,
    private snackbarColorService: SnackBarColorService
  ) {
    this.carrinhoService.loadStepEvent.subscribe(() => {
      this.buscarDadosPessoais();
    });
  }

  buscarDadosPessoais(): void {
    var data = localStorage.getItem('customerAddress');
    if (data) {
      var parsedData = JSON.parse(data);
      this.address = parsedData;
      this.cdr.markForCheck();
      return;
    }

    const cnpj = localStorage.getItem(CustomerEnum.CUSTOMER_DOCUMENT);

    if (!cnpj) {
      return undefined;
    }

    this.cardAddressService
      .getCustomerByFilter({ cnpj })
      .pipe(
        first(),
        finalize(() => {
          this.cdr.markForCheck();
        })
      )
      .subscribe({
        next: (response: Customer[]) => {
          this.address = response[0].customerAddresses?.[0];
          localStorage.setItem('customerAddress', JSON.stringify(this.address));
        },
        error: () =>
          this.snackBar.open(
            'Erro ao consultar dados do cliente',
            'Ok',
            this.snackbarColorService.getSnackBarConfig()
          ),
      });
  }
}
