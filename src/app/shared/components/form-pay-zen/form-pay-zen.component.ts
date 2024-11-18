import { HttpClient } from '@angular/common/http';
import {
  OnInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnChanges,
} from '@angular/core';
import { PaymentTypeDto } from '@generated/api/dpk-order-svc';
import KRGlue from '@lyracom/embedded-form-glue';
import { firstValueFrom } from 'rxjs';
import { FormPayZenService } from './form-pay-zen.service';

@Component({
  selector: 'app-form-pay-zen',
  templateUrl: './form-pay-zen.component.html',
  styleUrls: ['./form-pay-zen.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormPayZenComponent implements OnInit, OnChanges {
  message: string = '';

  @Input()
  valor: number | undefined;

  @Input()
  cartId: string | undefined;

  // isLoadingForm: boolean = true;
  valorInicial: number | undefined;

  constructor(
    private service: FormPayZenService,
    private http: HttpClient,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.valorInicial = this.valor;
    this.montarForm();
  }

  ngOnChanges(): void {
    if (this.valorInicial && this.valor !== this.valorInicial) {
      this.montarForm();
    }
  }

  montarForm(): void {
    if (this.valor === undefined || this.cartId == undefined) {
      return;
    }

    // this.isLoadingForm = true;
    const endpoint = 'https://api.payzen.com.br';
    const publicKey =
      '28478261:testpublickey_LHvSiWObWJnSBv6lnBMmS0tlDPLslOFYXvmKguoWiBIWj';
    let formToken = '';

    const observable = this.service.getFormToken(this.cartId, this.valor);
    firstValueFrom(observable)
      .then((resp: PaymentTypeDto[]) => {
        if (resp && resp[0].description && resp[0].description) {
          formToken = resp[0].description;
        }
        return KRGlue.loadLibrary(
          endpoint,
          publicKey
        ); /* carrega as bibliotecas da PayZen */
      })
      .then(({ KR }) =>
        KR.setFormConfig({
          formToken: formToken,
          'kr-language': 'pt-BR',
        })
      )
      .then(({ KR }) => KR.onSubmit(this.onSubmit))
      .then(({ KR }) => KR.addForm('#paymentForm'))
      .then(({ KR, result }) => KR.showForm(result.formId))
      .catch((error) => {
        this.message = error.message + ' (see console for more details)';
      });
  }

  onSubmit(paymentData: KRPaymentResponse): void {
    this.http
      .post('http://localhost:3000/validatePayment', paymentData, {
        responseType: 'text',
      })
      .subscribe((response: any) => {
        if (response) {
          this.message = 'Payment successful!';
          this.cdr.detectChanges();
        }
      });
  }
}
