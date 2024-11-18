import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
} from '@angular/core';
import { Validators, NonNullableFormBuilder, FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import {
  KDClientDomainDtosCustomerDto,
  KDClientDomainDtosCustomerSegmentDto,
} from '@generated/api/dpk-customer-svc';
import {
  BasicInfoCustomer,
  BasicInfoCustomerAddress,
} from '@models/basicInfoCustomer.model';
import { Segment } from '@models/segment.model';
import { StateTaxInfoCustomer } from '@models/stateTaxInfoCustomer.model';
import { CadastroService } from '@modules/cadastro/cadastro.service';
import { AuthService } from '@shared/services/auth.service';
import { finalize } from 'rxjs';
import { MinhaContaService } from './minha-conta.service';
import { StoreService } from '@shared/services/store.service';
import { SnackBarColorService } from '@shared/services/snackbarColor.service';

@Component({
  selector: 'app-minha-conta',
  templateUrl: './minha-conta.component.html',
  styleUrls: ['./minha-conta.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MinhaContaComponent {
  public segmentsList: Array<Segment> | undefined;
  public hasNoOwnerData: boolean = false;

  empresaForm!: FormGroup;
  isLoadingCustomer: boolean = false;
  isFantasyNameReadonly: boolean = true;
  idUser!: number;

  dadosIniciais!: KDClientDomainDtosCustomerDto;

  constructor(
    private fb: NonNullableFormBuilder,
    private cadastro: CadastroService,
    private auth: AuthService,
    private snackBar: MatSnackBar,
    private readonly cdr: ChangeDetectorRef,
    private minhaContaService: MinhaContaService,
    private store: StoreService,
    private snackbarColorService: SnackBarColorService
  ) {
    this.loadSegments();
    this.initFormGroup();
    this.buscarDadosPessoais();
  }

  initFormGroup() {
    this.empresaForm = this.fb.group({
      cnpj: ['', [Validators.required]],
      corporateName: ['', [Validators.required]],
      fantasyName: ['', [Validators.required]],
      owner: ['', [Validators.required]],
      dateFoundation: ['', [Validators.required]],
      ie: ['', [Validators.required]],
      economicActivities: [[{}], [Validators.required]],
      customerEconomicActivities: [[]],
      customerPortals: [[]],
      street: ['', [Validators.required]],
      number: ['', [Validators.required]],
      neighborhood: ['', [Validators.required]],
      complement: [''],
      zipCode: ['', [Validators.required]],
      uf: ['', [Validators.required]],
      city: ['', [Validators.required]],
      codeCity: [''],
      landlinePhone: [''],
      cellPhone: ['', [Validators.required]],
      customerSegments: [[], [Validators.required]],
      corporateEmail: [
        '',
        [
          Validators.email,
          Validators.pattern(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/),
        ],
      ],
      email: [
        '',
        [
          Validators.required,
          Validators.email,
          Validators.pattern(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/),
        ],
      ],
    });
  }

  async loadSegments(): Promise<void> {
    const segments = await this.auth.getSegments();
    this.segmentsList = segments;
  }

  buscarDadosPessoais(): void {
    const cnpj = this.store.getSelected('cnpj').getValue();

    if (!cnpj) {
      return undefined;
    }

    this.isLoadingCustomer = true;
    this.minhaContaService
      .getCustomerByFilter({ cnpj })
      .pipe(
        finalize(() => {
          this.isLoadingCustomer = false;
          this.cdr.markForCheck();
        })
      )
      .subscribe({
        next: (response) => {
          this.dadosIniciais = response[0];
          var data = response[0];
          this.empresaForm.controls['landlinePhone'].setValue(
            data?.landlinePhone
          );
          this.empresaForm.controls['cellPhone'].setValue(data?.cellPhone);
          this.empresaForm.controls['cnpj'].setValue(data?.cnpj);
          this.empresaForm.controls['corporateName'].setValue(
            data?.corporateName
          );
          this.empresaForm.controls['fantasyName'].setValue(data?.fantasyName);
          this.empresaForm.controls['owner'].setValue(data?.owner);
          this.empresaForm.controls['dateFoundation'].setValue(
            data?.dateFoundation
          );
          this.empresaForm.controls['ie'].setValue(data?.ie);

          let addressListSizeLastElement = data.customerAddresses
            ? data.customerAddresses.length - 1
            : 0;
          this.empresaForm.controls['zipCode'].setValue(
            data.customerAddresses?.[addressListSizeLastElement].zipcode
          );
          this.empresaForm.controls['street'].setValue(
            data.customerAddresses?.[addressListSizeLastElement].street
          );
          this.empresaForm.controls['complement'].setValue(
            data.customerAddresses?.[addressListSizeLastElement].complement
          );
          this.empresaForm.controls['neighborhood'].setValue(
            data.customerAddresses?.[addressListSizeLastElement].neighborhood
          );
          this.empresaForm.controls['number'].setValue(
            data.customerAddresses?.[addressListSizeLastElement].number
          );
          this.empresaForm.controls['uf'].setValue(
            data.customerAddresses?.[addressListSizeLastElement].uf
          );
          this.empresaForm.controls['city'].setValue(
            data.customerAddresses?.[addressListSizeLastElement].city
          );
          this.empresaForm.controls['corporateEmail'].setValue(
            data.corporateEmail
          );
          this.empresaForm.controls['email'].setValue(data.email);
          this.idUser = data?.id!;

          let mergeCustomerSegments: number[] = [];
          this.segmentsList?.forEach((segment) => {
            data.customerSegments?.forEach((customerSegment) => {
              if (segment.id === customerSegment.idSegment) {
                mergeCustomerSegments.push(segment.id);
              }
            });
          });

          this.empresaForm.controls['customerSegments'].setValue(
            mergeCustomerSegments
          );
        },
        error: () =>
          this.snackBar.open(
            'Erro ao buscar dados pessoais',
            'Ok',
            this.snackbarColorService.getSnackBarConfig()
          ),
      });
  }

  async getDataFromCnpj(): Promise<void> {
    const cnpj = this.empresaForm.get('cnpj')?.value;
    let dataFromCnpj$: BasicInfoCustomer;
    let isValidCnae$: boolean;
    let getDataFromCnpjAndUf$: StateTaxInfoCustomer;

    if (!cnpj) {
      return;
    }
    this.isLoadingCustomer = true;

    try {
      dataFromCnpj$ = await this.cadastro.getDataFromCnpj(cnpj!);
    } catch (error) {
      this.snackBar.open(
        'CNPJ inválido ou inexistente! Digite um CNPJ válido para prosseguir.',
        'Ok',
        this.snackbarColorService.getSnackBarConfig()
      );
      this.isLoadingCustomer = false;
      this.cdr.markForCheck();
      throw error;
    }

    if (dataFromCnpj$ && dataFromCnpj$.status === 'Active') {
    } else {
      this.snackBar.open(
        'CNPJ inválido ou inexistente! Digite um CNPJ válido para prosseguir.',
        'Ok',
        this.snackbarColorService.getSnackBarConfig()
      );
      this.isLoadingCustomer = false;
      this.cdr.markForCheck();
      return;
    }

    try {
      isValidCnae$ = await this.cadastro.isValidCnae({
        economicActivities: dataFromCnpj$.economicActivities,
      });
    } catch (error) {
      this.snackBar.open(
        'O seu CNAE não é permitido para cadastro nesse site',
        'Ok',
        this.snackbarColorService.getSnackBarConfig()
      );
      this.isLoadingCustomer = false;
      this.cdr.markForCheck();
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

      this.empresaForm
        .get('ie')
        ?.patchValue(getDataFromCnpjAndUf$.stateTaxes[0]?.taxNumber);
      this.isLoadingCustomer = false;
      this.cdr.markForCheck();
    } catch (error) {
      this.isLoadingCustomer = false;
      this.cdr.markForCheck();
      this.empresaForm.get('ie')?.patchValue('ISENTO');
    }
  }

  // TODO substituir o any
  updateDadosDaEmpresaFromRequest(basicInfoCustomer: BasicInfoCustomer): void {
    const dados = this.empresaForm;
    const contato = this.empresaForm;
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
    if (basicInfoCustomer.phones.length > 0) {
      contato
        .get('landlinePhone')
        ?.patchValue(
          basicInfoCustomer.phones[0].ddd + basicInfoCustomer.phones[0].number
        );
    }
  }

  updateEnderecoDaEmpresaFromRequest(address: BasicInfoCustomerAddress): void {
    if (!address) {
      return;
    }
    const endereco = this.empresaForm;
    const street = `${address.streetSuffix || ''} ${address.street}`.trim();
    endereco.get('street')?.patchValue(street);
    endereco.get('number')?.patchValue(address.number);
    endereco.get('neighborhood')?.patchValue(address.district);
    endereco.get('zipCode')?.patchValue(address.postalCode);
    endereco.get('uf')?.patchValue(address.state);
    endereco
      .get('city')
      ?.patchValue(address.city ? address.city.name : 'teste');
    endereco.get('codeCity')?.patchValue(address.city.code);
  }

  atualizarDadosPessoais(): void {
    if (this.empresaForm.invalid) {
      return;
    }

    this.isLoadingCustomer = true;
    let form = this.empresaForm.getRawValue();

    let segments: Array<KDClientDomainDtosCustomerSegmentDto> = [];
    form.customerSegments.forEach((segment: number | undefined) => {
      const segmentDto = {} as KDClientDomainDtosCustomerSegmentDto;
      segmentDto.idSegment = segment;
      segments.push(segmentDto);
    });

    const request: KDClientDomainDtosCustomerDto = {
      allowShareData: this.dadosIniciais.allowShareData,
      approvedCredit: this.dadosIniciais.approvedCredit,
      cellPhone: form.cellPhone,
      landlinePhone: form.landlinePhone,
      customerSegments: segments,
      id: this.idUser,
      corporateName: form.corporateName,
      fantasyName: form.fantasyName,
      ie: form.ie,
      dateFoundation: form.dateFoundation,
      owner: form.owner,
      email: form.email,
      corporateEmail: form.corporateEmail,
      cnpj: form.cnpj,
      customerAddresses: [
        {
          street: form.street,
          number: form.number,
          complement: form.complement,
          neighborhood: form.neighborhood,
          zipcode: form.zipCode,
          uf: form.uf,
          city: form.city,
          codeCity: 0,
          idUf: 0,
          idCity: 0,
        },
      ],
      customerPortals: [],
      customerEconomicActivities: [],
      economicActivities: null,
      customerUsers: [],
    };
    this.minhaContaService
      .updateCustomer(request)
      .pipe(
        finalize(() => {
          this.isLoadingCustomer = false;
          this.cdr.markForCheck();
        })
      )
      .subscribe({
        next: () =>
          this.snackBar.open(
            'Dados pessoais alterados com sucesso',
            'Ok',
            this.snackbarColorService.getSnackBarConfig()
          ),
        error: () =>
          this.snackBar.open(
            'Erro ao alterar dados pessoais',
            'Ok',
            this.snackbarColorService.getSnackBarConfig()
          ),
      });
  }
}
