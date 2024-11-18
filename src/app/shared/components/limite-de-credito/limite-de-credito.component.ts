import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
} from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { environment } from '@env';
import { CreditoService } from '@modules/credito/credito.service';
import { finalize } from 'rxjs';
import { StoreService } from '../../services/store.service';
import { SnackBarColorService } from '@shared/services/snackbarColor.service';

@Component({
  selector: 'app-limite-de-credito',
  templateUrl: './limite-de-credito.component.html',
  styleUrls: ['./limite-de-credito.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LimiteDeCreditoComponent implements OnInit {
  isLoading: boolean | undefined;
  creditLimitValue: number | undefined;
  portal = environment.portal;

  constructor(
    private readonly cdr: ChangeDetectorRef,
    private creditoService: CreditoService,
    private snackBar: MatSnackBar,
    private store: StoreService,
    private snackbarColorService: SnackBarColorService
  ) {}

  ngOnInit(): void {
    this.getCreditLimit();
  }

  getCreditLimit(): void {
    this.isLoading = true;
    const cnpj = this.store.getSelected('cnpj').getValue();
    if (cnpj) {
      this.creditoService
        .getCreditLimit(cnpj)
        .pipe(
          finalize(() => {
            this.isLoading = false;
            this.cdr.markForCheck();
          })
        )
        .subscribe({
          next: (data) =>
            data.creditLimit > 0
              ? (this.creditLimitValue = data.creditLimit)
              : (this.creditLimitValue = 0),
          error: () =>
            this.snackBar.open(
              'Erro ao consultar limite de crédito',
              'Ok',
              this.snackbarColorService.getSnackBarConfig()
            ),
        });
    }
  }

  consultarAutoCred() {
    var data = localStorage.getItem('autoCredData');
    if (data) {
      var parsedData = JSON.parse(data);

      const form = document.createElement('form');
      form.style.display = 'none';
      form.method = 'post';
      form.target = '_blank';
      form.action = parsedData.url;

      let user;
      user = document.createElement('input');
      user.type = 'hidden';
      user.name = 'sap-user';
      user.value = parsedData.user;

      let password;
      password = document.createElement('input');
      password.type = 'hidden';
      password.name = 'sap-password';
      password.value = parsedData.password;

      let client;
      client = document.createElement('input');
      client.type = 'hidden';
      client.name = 'sap-client';
      client.value = parsedData.sapCliente;

      let language;
      language = document.createElement('input');
      language.type = 'hidden';
      language.name = 'sap-language';
      language.value = 'PT';

      form.appendChild(user);
      form.appendChild(password);
      form.appendChild(client);
      form.appendChild(language);

      document.body.append(form);

      form.submit();
      form.remove();
    } else {
      this.snackBar.open(
        'Aguarde até carregar os dados financeiros.',
        'Ok',
        this.snackbarColorService.getSnackBarConfig()
      );
    }
  }
}
