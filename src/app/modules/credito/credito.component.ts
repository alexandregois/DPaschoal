import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
} from '@angular/core';
import { FormArray, NonNullableFormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import {
  KDClientDomainDtosFluidCardDataDto,
  KDClientDomainDtosFluigAttachmentsDto,
  KDClientDomainDtosFluigCommercialReferenceDto,
  KDClientDomainDtosFluigSolicitationDto,
} from '@generated/api/dpk-customer-svc';
import { finalize } from 'rxjs';
import { CreditoService } from './credito.service';
import { createMask } from '@ngneat/input-mask';
import { SnackBarColorService } from '@shared/services/snackbarColor.service';

@Component({
  selector: 'app-credito',
  templateUrl: './credito.component.html',
  styleUrls: ['./credito.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreditoComponent {
  iForms: number = 1;
  MIN_FORMS: number = 1;
  MAX_FORMS: number = 3;
  isLoading: boolean = false;
  contratoSocial?: any;
  contratoSocialFileName?: string;
  cnhFrente?: any;
  cnhFrenteFileName?: string;
  cnhVerso?: any;
  cnhVersoFileName?: string;
  isSuccessSubmitCredit: boolean = false;

  refComercial = {
    razaoSocial: ['', [Validators.required]],
    telefone: ['', [Validators.required]],
    obs: ['', [Validators.required]],
  };

  form = this.fb.group({
    refsComerciais: this.fb.array([this.fb.group(this.refComercial)]),
    banco: ['', [Validators.required]],
    agencia: ['', [Validators.required]],
    contaCorrente: ['', [Validators.required]],
    nomeContato: ['', [Validators.required]],
    telefone: ['', [Validators.required]],
    contratoSocial: ['', [Validators.required]],
    cnhFrente: ['', [Validators.required]],
    cnhVerson: ['', [Validators.required]],
  });

  phoneInputMask = createMask({
    mask: '((99) 9999-9999)|((99) 99999-9999)',
    keepStatic: true,
  });

  constructor(
    private fb: NonNullableFormBuilder,
    private readonly cdr: ChangeDetectorRef,
    private creditoService: CreditoService,
    private snackBar: MatSnackBar,
    private snackbarColorService: SnackBarColorService
  ) {}

  get refsComerciais() {
    return this.form.controls['refsComerciais'] as FormArray;
  }

  addRefsComerciais() {
    this.iForms++;
    this.refsComerciais.push(this.fb.group(this.refComercial));
  }

  removeRefsComerciais(i: number) {
    this.iForms--;
    this.refsComerciais.removeAt(i);
  }

  enviar() {
    if (this.form.invalid) {
      this.form.get('contratoSocial')?.markAsTouched();
      this.form.get('cnhFrente')?.markAsTouched();
      this.form.get('cnhVerson')?.markAsTouched();

      return;
    }
    let form = this.form.getRawValue();
    let commercialReferencesForm: Array<KDClientDomainDtosFluigCommercialReferenceDto> =
      [];
    let attachmentsForm: Array<KDClientDomainDtosFluigAttachmentsDto> = [];
    let cardDataForm: Array<KDClientDomainDtosFluidCardDataDto> = [];

    form.refsComerciais.forEach((refComercial) => {
      const KDClientDomainDtosFluigCommercialReferenceDto =
        {} as KDClientDomainDtosFluigCommercialReferenceDto;

      KDClientDomainDtosFluigCommercialReferenceDto.cellPhone =
        refComercial.telefone;
      KDClientDomainDtosFluigCommercialReferenceDto.corporateName =
        refComercial.razaoSocial;
      KDClientDomainDtosFluigCommercialReferenceDto.note = refComercial.obs;

      commercialReferencesForm.push(
        KDClientDomainDtosFluigCommercialReferenceDto
      );
    });

    const fluidCardDataDtoAgencia = {} as KDClientDomainDtosFluidCardDataDto;
    fluidCardDataDtoAgencia.key = 'AGENCIA';
    fluidCardDataDtoAgencia.value = form.agencia;
    cardDataForm.push(fluidCardDataDtoAgencia);

    const fluidCardDataDtoBanco = {} as KDClientDomainDtosFluidCardDataDto;
    fluidCardDataDtoBanco.key = 'BANCO';
    fluidCardDataDtoBanco.value = form.banco;
    cardDataForm.push(fluidCardDataDtoBanco);

    const fluidCardDataDtoConta = {} as KDClientDomainDtosFluidCardDataDto;
    fluidCardDataDtoConta.key = 'CONTA';
    fluidCardDataDtoConta.value = form.contaCorrente;
    cardDataForm.push(fluidCardDataDtoConta);

    const fluidCardDataDtoNome = {} as KDClientDomainDtosFluidCardDataDto;
    fluidCardDataDtoNome.key = 'NOME';
    fluidCardDataDtoNome.value = form.nomeContato;
    cardDataForm.push(fluidCardDataDtoNome);

    const fluidCardDataDtoFone = {} as KDClientDomainDtosFluidCardDataDto;
    fluidCardDataDtoFone.key = 'TELEFONE';
    fluidCardDataDtoFone.value = form.telefone;
    cardDataForm.push(fluidCardDataDtoFone);

    const attachmentsCnhFrente = {} as KDClientDomainDtosFluigAttachmentsDto;
    attachmentsCnhFrente.fileName = this.cnhFrenteFileName;
    attachmentsCnhFrente.filecontent = this.cnhFrente;
    attachmentsForm.push(attachmentsCnhFrente);

    const attachmentsCnhVerso = {} as KDClientDomainDtosFluigAttachmentsDto;
    attachmentsCnhVerso.fileName = this.cnhVersoFileName;
    attachmentsCnhVerso.filecontent = this.cnhVerso;
    attachmentsForm.push(attachmentsCnhVerso);

    const attachments = {} as KDClientDomainDtosFluigAttachmentsDto;
    attachments.fileName = this.contratoSocialFileName;
    attachments.filecontent = this.contratoSocial;
    attachmentsForm.push(attachments);

    let request: KDClientDomainDtosFluigSolicitationDto = {
      commercialReferences: commercialReferencesForm,
      attachments: attachmentsForm,
      cardData: cardDataForm,
    };

    this.isLoading = true;
    this.creditoService
      .postFluigSolicitation(request)
      .pipe(
        finalize(() => {
          this.isLoading = false;
          this.cdr.markForCheck();
        })
      )
      .subscribe({
        next: () => {
          this.isSuccessSubmitCredit = true;
          this.snackBar.open(
            'Dados enviados com sucesso',
            'Ok',
            this.snackbarColorService.getSnackBarConfig()
          );
        },
        error: () =>
          this.snackBar.open(
            'Erro ao enviar dados',
            'Ok',
            this.snackbarColorService.getSnackBarConfig()
          ),
      });
  }

  onFileChange(event: any, formControl: string) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        this.form.get(formControl)?.setValue(event.target.files[0].name);
        this.form.get(formControl)?.markAsTouched();
        this.cdr.markForCheck();

        if (formControl === 'contratoSocial') {
          this.contratoSocial = reader.result;
          this.contratoSocialFileName = event.target.files[0].name;
        } else if (formControl === 'cnhFrente') {
          this.cnhFrente = reader.result;
          this.cnhFrenteFileName = event.target.files[0].name;
        } else if (formControl === 'cnhVerson') {
          this.cnhVerso = reader.result;
          this.cnhVersoFileName = event.target.files[0].name;
        }
      };
    } else {
      this.form.get(formControl)?.setValue('');
      this.form.get(formControl)?.markAsTouched();
      this.cdr.markForCheck();

      if (formControl === 'contratoSocial') {
        this.contratoSocial = '';
        this.contratoSocialFileName = '';
      } else if (formControl === 'cnhFrente') {
        this.cnhFrente = '';
        this.cnhFrenteFileName = '';
      } else if (formControl === 'cnhVerson') {
        this.cnhVerso = '';
        this.cnhVersoFileName = '';
      }
    }
  }
}
