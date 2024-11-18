import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { CarrinhoService } from '@modules/carrinho/carrinho.service';
import { PaymentTypeService } from '@shared/services/payment-type.service';
import * as creditCardType from 'credit-card-type';

@Component({
  selector: 'app-form-cartao-credito',
  templateUrl: './form-cartao-credito.component.html',
  styleUrls: ['./form-cartao-credito.component.scss'],
})
export class FormCartaoCreditoComponent {
  cardForm: FormGroup;
  years: number[] = [];
  cardType: string = '';
  cardSecurityCodeName: string = '';
  maisCampos: boolean = false;
  opcaoSelecionada: string | undefined;
  mostrarCampo1 = false;
  mostrarCampo2 = false;
  valorCampo1: any;
  valorCampo2: any;
  ishidden: boolean = false;
  endereco: any;
  constructor(
    private fb: FormBuilder,
    private paymentTypeService: PaymentTypeService,
    private carrinhoService: CarrinhoService
  ) {
    this.cardForm = this.fb.group(
      {
        cardName: [
          '',
          [Validators.required, Validators.pattern('^[a-zA-ZÀ-ÿ ]*$')],
        ],
        cardNumber: [
          '',
          [
            Validators.required,
            Validators.pattern('^[0-9]*$'),
            Validators.minLength(16),
            Validators.maxLength(16),
          ],
        ],
        expiryMonth: [
          '',
          [
            Validators.required,
            Validators.min(1),
            Validators.max(12),
            this.expiryDateValidator(),
          ],
        ],
        expiryYear: ['', Validators.required],
        cvv: [
          '',
          [
            Validators.required,
            Validators.pattern('^[0-9]*$'),
            Validators.minLength(3),
            Validators.maxLength(3),
          ],
        ],
        cpfcnpj: ['', Validators.required],
        endereco: ['', [Validators.pattern('^[a-zA-ZÀ-ÿ ]*$')]],
        numero: [
          '',
          [Validators.pattern('^[0-9]*$'), , Validators.maxLength(10)],
        ],
        complemento: ['', [Validators.pattern('^[a-zA-ZÀ-ÿ ]*$')]],
        bairro: ['', [Validators.pattern('^[a-zA-ZÀ-ÿ ]*$')]],
        cidade: ['', [Validators.pattern('^[a-zA-ZÀ-ÿ ]*$')]],
        estado: ['', [Validators.pattern('^[a-zA-ZÀ-ÿ ]*$')]],
        cep: ['', [Validators.maxLength(8)]],
        method: [''],
        isMainAddress: [false],
      },
      { validators: this.expiryDateValidator }
    );

    this.cardForm.statusChanges.subscribe((status) => {
      const formIsValid = status === 'VALID';
      this.paymentTypeService.changeFormStatus(formIsValid);
    });

    this.cardForm.valueChanges.subscribe((value) => {
      this.paymentTypeService.changeFormData(value);
    });
  }

  ngOnInit(): void {
    const currentYear = new Date().getFullYear();
    this.years = Array.from({ length: 10 }, (_, i) => currentYear + i);
    this.cardForm.get('cardNumber')!.valueChanges.subscribe((cardNumber) => {
      const cleanCardNumber = (cardNumber || '').replace(/ /g, '');
      if (cleanCardNumber.length >= 6) {
        const cardInfo = creditCardType(cardNumber);
        if (cardInfo && cardInfo[0]) {
          this.cardType = cardInfo[0].niceType;
          this.cardSecurityCodeName = cardInfo[0].code.name;
          this.cardForm.get('method')?.setValue(this.cardType);
        } else {
          this.cardType = '';
          this.cardSecurityCodeName = '';
          this.cardForm.get('method')?.setValue('');
        }
      } else {
        this.cardType = '';
        this.cardSecurityCodeName = '';
        this.cardForm.get('method')?.setValue('');
      }
    });
    this.cardForm.get('expiryMonth')!.valueChanges.subscribe(() => {
      this.cardForm.updateValueAndValidity();
    });
    this.cardForm.get('expiryYear')!.valueChanges.subscribe(() => {
      this.cardForm.updateValueAndValidity();
    });
  }

  onSubmit(): void {
    if (this.cardForm) {
      console.log(this.cardForm.value);
    }
  }
  preventNumber(event: any): void {
    const keyCode = event.keyCode;
    if ((keyCode >= 48 && keyCode <= 57) || (keyCode >= 96 && keyCode <= 105)) {
      event.preventDefault();
    }
  }

  radioButtonChanged(carrinhoVazio: string) {
    if (carrinhoVazio === '2') {
      this.ishidden = true;
      this.cardForm.get('isMainAddress')?.setValue(true);
      this.clearEnderecoInputs();
    } else {
      this.ishidden = false;
      this.cardForm.get('isMainAddress')?.setValue(false);
    }
  }

  clearEnderecoInputs() {
    this.cardForm.get('cep')?.setValue('');
    this.cardForm.get('endereco')?.setValue('');
    this.cardForm.get('numero')?.setValue('');
    this.cardForm.get('complemento')?.setValue('');
    this.cardForm.get('bairro')?.setValue('');
    this.cardForm.get('cidade')?.setValue('');
    this.cardForm.get('estado')?.setValue('');
  }

  // expiryDateValidator(): ValidatorFn {
  //   debugger;
  //   return (group: AbstractControl): ValidationErrors | null => {
  //     const year = group.get('expiryYear')?.value;
  //     const month = group.get('expiryMonth')?.value;
  //     const currentDate = new Date();
  //     const currentYear = currentDate.getFullYear();
  //     const currentMonth = currentDate.getMonth() + 1; // Os meses são 0-indexados
  //     if (year && month) {
  //       if (year < currentYear || (year === currentYear && month < currentMonth)) {
  //         return { expired: true };
  //       }
  //     }
  //     return null;
  //   };
  // }

  expiryDateValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const group = control.parent;
      if (!group) {
        return null;
      }
      const year = group.get('expiryYear')?.value;
      const month = control.value;
      const currentDate = new Date();
      const currentYear = currentDate.getFullYear();
      const currentMonth = currentDate.getMonth() + 1;
      if (year && month) {
        if (
          year < currentYear ||
          (year === currentYear && month < currentMonth)
        ) {
          return { expired: true };
        }
      }
      return null;
    };
  }
  async buscarEndereco() {
    this.cardForm.get('endereco')?.setValue('...');
    this.cardForm.get('bairro')?.setValue('...');
    this.cardForm.get('cidade')?.setValue('...');
    this.cardForm.get('estado')?.setValue('...');

    const cep = this.cardForm.get('cep')?.value;
    this.endereco = await this.carrinhoService.buscarEndereco(cep);
    if (this.endereco) {
      this.cardForm.get('endereco')?.setValue(this.endereco.street);
      this.cardForm.get('bairro')?.setValue(this.endereco.district);
      this.cardForm.get('cidade')?.setValue(this.endereco.city);
      this.cardForm.get('estado')?.setValue(this.endereco.state);
    } else {
      this.cardForm.get('endereco')?.setValue('');
      this.cardForm.get('bairro')?.setValue('');
      this.cardForm.get('cidade')?.setValue('');
      this.cardForm.get('estado')?.setValue('');
    }
  }
}
