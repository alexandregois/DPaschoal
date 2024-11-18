import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
} from '@angular/core';
import { NonNullableFormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '@shared/services/auth.service';
import { Segment } from '@models/segment.model';
import { confirmedValidator } from '@core/validators/confirmed.validator';
import { passwordStrengthValidator } from '@core/validators/password-strength.validator';
import { MatDialog } from '@angular/material/dialog';
import { PoliticaDeUsoDialogComponent } from './components/politica-de-uso-dialog/politica-de-uso-dialog.component';
import {
  BasicInfoCustomer,
  BasicInfoCustomerAddress,
} from '@models/basicInfoCustomer.model';
import { StateTaxInfoCustomer } from '@models/stateTaxInfoCustomer.model';
import { CadastroService } from './cadastro.service';
import { SessionService } from '@core/services/session.service';
import { SnackBarColorService } from '@shared/services/snackbarColor.service';
import { Location } from '@angular/common';
@Component({
  selector: 'app-cadastro',
  templateUrl: './cadastro.component.html',
  styleUrls: ['./cadastro.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CadastroComponent {
  isLoading: boolean = false;
  isPasswordVisible: boolean = false;
  isFantasyNameReadonly: boolean = true;
  isSubmiting: boolean = false;
  typeRegister: boolean = true;
  public segmentsList: Array<Segment> | undefined;
  public hasNoOwnerData: boolean = false;
  public isSignInCompleted: boolean = false;

  dadosDaEmpresa = this.fb.group({
    cnpj: ['', [Validators.required]],
    corporateName: ['', [Validators.required]],
    fantasyName: ['', [Validators.required]],
    owner: ['', [Validators.required]],
    dateFoundation: ['', [Validators.required]],
    ie: ['', [Validators.required]],
    customerSegments: [[], [Validators.required]],
    economicActivities: [[{}], [Validators.required]],
    customerEconomicActivities: [[]],
    customerPortals: [[]],
  });
  enderecoDaEmpresa = this.fb.group({
    street: ['', [Validators.required]],
    number: ['', [Validators.required]],
    neighborhood: ['', [Validators.required]],
    complement: [''],
    zipCode: ['', [Validators.required]],
    uf: ['', [Validators.required]],
    city: ['', [Validators.required]],
    codeCity: [''],
  });
  contatoDaEmpresa = this.fb.group({
    landlinePhone: [''],
    cellPhone: ['', [Validators.required]],
    email: [
      '',
      [
        Validators.required,
        Validators.email,
        Validators.pattern(
          /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/
        ),
      ],
    ],
    corporateEmail: [
      '',
      [
        Validators.required,
        Validators.email,
        Validators.pattern(
          /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/
        ),
      ],
    ],
    password: ['', [Validators.required, passwordStrengthValidator()]],
    confirmPassword: [
      '',
      [Validators.required, confirmedValidator('password')],
    ],
    allowShareData: [false],
  });

  constructor(
    private fb: NonNullableFormBuilder,
    private cadastro: CadastroService,
    private session: SessionService,
    private auth: AuthService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private readonly cdr: ChangeDetectorRef,
    private snackbarColorService: SnackBarColorService,
    private location: Location
  ) {
    this.getTypeRegister();
    this.loadSegments();
  }

  async onSubmit(): Promise<void> {
    this.validateFormMulti();

    if (this.contatoDaEmpresa.invalid) {
      return;
    }
    this.isSubmiting = true;

    // TODO substituir o ANY
    const customer: any = {
      ...this.dadosDaEmpresa.value,
      ...this.contatoDaEmpresa.value,
      customerAddresses: [{ ...this.enderecoDaEmpresa.value }],
    };

    customer.customerSegments = customer.customerSegments.map((id: number) => {
      return { idSegment: id };
    });

    const account = {
      userPrincipalName: this.contatoDaEmpresa.get('email')?.value,
      password: this.contatoDaEmpresa.get('password')?.value,
      confirmPassword: this.contatoDaEmpresa.get('confirmPassword')?.value,
    };

    try {
      let createCustomer$: any;
      if (this.typeRegister) {
        createCustomer$ = await this.cadastro.createCustomer({
          customer,
          account,
        });
      } else {
        createCustomer$ = await this.cadastro.createCustomerMulti({
          customer,
          account,
        });
      }
      this.isSignInCompleted = true;
      this.isSubmiting = false;
      this.snackBar.open(
        'Cadastro realizado com sucesso!',
        'Ok',
        this.snackbarColorService.getSnackBarConfig()
      );
      this.redirectToLogin();
      this.cdr.markForCheck();
      // TODO REMOVER ANY
    } catch (err: any) {
      const errorMessage =
        err.error || err.msg || 'O e-mail inserido é inválido.';
      this.snackBar.open(
        errorMessage,
        'Ok',
        this.snackbarColorService.getSnackBarConfig()
      );
      this.isSubmiting = false;
      this.cdr.markForCheck();
      throw err;
    }
  }

  redirectToLogin(): void {
    this.session.logout(true);
  }

  backLastPage() {
    this.location.back();
  }

  resetForms(message?: string): void {
    this.dadosDaEmpresa.reset();
    this.enderecoDaEmpresa.reset();
    this.contatoDaEmpresa.reset();
    if (message) {
      this.snackBar.open(
        message,
        'Ok',
        this.snackbarColorService.getSnackBarConfig()
      );
    }
  }

  async getDataFromCnpj(): Promise<void> {
    var cnpj = this.dadosDaEmpresa.get('cnpj')?.value;
    let isNotDuplicatedCustomer$: boolean;
    let dataFromCnpj$: BasicInfoCustomer;
    let isValidCnae$: boolean;
    let getDataFromCnpjAndUf$: StateTaxInfoCustomer;

    if (!cnpj) {
      return;
    } else {
      if (cnpj.length < 14) {
        cnpj = cnpj.padStart(14, '0');
        this.dadosDaEmpresa.get('cnpj')?.setValue(cnpj);
      }
    }

    this.isLoading = true;

    try {
      isNotDuplicatedCustomer$ = await this.cadastro.isNotDuplicatedCustomer(
        cnpj!
      );
    } catch (error) {
      this.resetForms(
        'Ocorreu um erro na comunicação com o servidor. Verifique sua conexão e tente novamente.'
      );
      this.isLoading = false;
      throw error;
    }

    if (!isNotDuplicatedCustomer$) {
      this.resetForms(
        'Já existe um cadastro com esse CNPJ. Efetue login para acessar sua conta.'
      );
      this.isLoading = false;
      return;
    }

    try {
      dataFromCnpj$ = await this.cadastro.getDataFromCnpj(cnpj!);
    } catch (error) {
      this.resetForms(
        'CNPJ inválido ou inexistente! Digite um CNPJ válido para prosseguir.'
      );
      this.isLoading = false;
      throw error;
    }

    if (dataFromCnpj$ && dataFromCnpj$.status === 'Active') {
    } else {
      this.resetForms('CNPJ com situação cadastral inválida');
      this.isLoading = false;
      return;
    }

    try {
      isValidCnae$ = await this.cadastro.isValidCnae({
        economicActivities: dataFromCnpj$.economicActivities,
      });
    } catch (error) {
      this.resetForms('O seu CNAE não é permitido para cadastro nesse site');
      this.isLoading = false;
      throw error;
    }

    if (!isValidCnae$) {
      return;
    }

    this.updateDadosDaEmpresaFromRequest(dataFromCnpj$);
    this.updateEnderecoDaEmpresaFromRequest(dataFromCnpj$.address);

    try {
      getDataFromCnpjAndUf$ = await this.cadastro.getDataFromCnpjAndUf(
        cnpj!,
        dataFromCnpj$.address.state
      );

      this.dadosDaEmpresa
        .get('ie')
        ?.patchValue(getDataFromCnpjAndUf$.stateTaxes[0]?.taxNumber);
      this.isLoading = false;
    } catch (error) {
      this.isLoading = false;
      this.dadosDaEmpresa.get('ie')?.patchValue('ISENTO');
    }
  }

  getTypeRegister(): void {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const cnpj = urlParams.get('cnpj');
    if (cnpj) {
      this.dadosDaEmpresa.get('cnpj')?.setValue(cnpj);
      this.getDataFromCnpj();
    }
    let paramMulti = localStorage.getItem('typeRegister');
    sessionStorage.removeItem('typeRegister');
    if (paramMulti) {
      this.typeRegister = false;
    }
  }

  async loadSegments(): Promise<void> {
    const segments = await this.auth.getSegments();
    this.segmentsList = segments;
  }

  // TODO substituir o any
  updateDadosDaEmpresaFromRequest(basicInfoCustomer: BasicInfoCustomer): void {
    const dados = this.dadosDaEmpresa;
    const contato = this.contatoDaEmpresa;
    const owner =
      basicInfoCustomer.partners.length > 0
        ? basicInfoCustomer.partners[0].name
        : '';
    this.hasNoOwnerData = basicInfoCustomer.partners.length === 0;
    this.isFantasyNameReadonly = !!basicInfoCustomer.tradeName;
    dados.get('corporateName')?.patchValue(basicInfoCustomer.name);
    dados.get('fantasyName')?.patchValue(basicInfoCustomer.tradeName);
    dados.get('owner')?.patchValue(owner);
    dados.get('dateFoundation')?.patchValue(basicInfoCustomer.openedOn);
    dados
      .get('economicActivities')
      ?.patchValue(basicInfoCustomer.economicActivities);
    contato
      .get('landlinePhone')
      ?.patchValue(
        basicInfoCustomer.phones.length
          ? basicInfoCustomer.phones[0].ddd + basicInfoCustomer.phones[0].number
          : ''
      );
  }

  updateEnderecoDaEmpresaFromRequest(address: BasicInfoCustomerAddress): void {
    if (!address) {
      return;
    }
    const endereco = this.enderecoDaEmpresa;
    const street = `${address.streetSuffix || ''} ${address.street}`.trim();
    endereco.get('street')?.patchValue(street);
    endereco.get('number')?.patchValue(address.number);
    endereco.get('neighborhood')?.patchValue(address.district);
    endereco.get('zipCode')?.patchValue(address.postalCode);
    endereco.get('uf')?.patchValue(address.state);
    endereco.get('city')?.patchValue(address.city ? address.city.name : '');
    endereco.get('codeCity')?.patchValue(address.city.code);
  }

  openPoliticaDeUso(): void {
    this.dialog.open(PoliticaDeUsoDialogComponent);
  }

  validateFormMulti() {
    if (!this.typeRegister) {
      this.contatoDaEmpresa.get('password')?.clearValidators();
      this.contatoDaEmpresa.get('email')?.clearValidators();
      this.contatoDaEmpresa.get('confirmPassword')?.clearValidators();
      this.contatoDaEmpresa.get('password')?.updateValueAndValidity();
      this.contatoDaEmpresa.get('email')?.updateValueAndValidity();
      this.contatoDaEmpresa.get('confirmPassword')?.updateValueAndValidity();
    }
  }
}
