import { EspelhoNotaModalComponent } from './../../components/espelho-nota-modal/espelho-nota-modal.component';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnInit,
  ViewChild,
} from '@angular/core';
import { ThemePalette } from '@angular/material/core';
import { MatDialog } from '@angular/material/dialog';
import { MatStep, MatStepper } from '@angular/material/stepper';
import { FalhaArquivoModalComponent } from '@modules/garantias/components/falha-arquivo-modal/falha-arquivo-modal.component';
import {
  Espelho,
  Garantia,
  Invoice,
  StatusGarantia,
} from '@models/warranty.model';
import { NonNullableFormBuilder, Validators } from '@angular/forms';
import { GarantiaService } from '../garantia.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackBarColorService } from '@shared/services/snackbarColor.service';

@Component({
  selector: 'app-etapa-nota-fiscal',
  templateUrl: './etapa-nota-fiscal.component.html',
  styleUrls: ['./etapa-nota-fiscal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EtapaNotaFiscalComponent implements OnInit {
  @ViewChild('stepperEntrega', { static: false }) private stepper!: MatStepper;
  @ViewChild('Emissao', { static: false }) stepEmissao!: MatStep;
  @ViewChild('Analise', { static: false }) stepAnalise!: MatStep;

  @Input()
  garantia!: Garantia;

  formNotaFiscal = this.fb.group({
    numeroNota: ['', [Validators.required, Validators.pattern(/[0-9]*/)]],
    numeroSerie: ['', [Validators.required, Validators.pattern(/[0-9]*/)]],
  });

  isNotaEnviada: boolean = false;

  dadosEspelho!: Espelho[];

  stepAtual = 0;
  colorStepOne: ThemePalette = 'warn';
  completedStepOne: boolean = false;
  statusStepOne = 'Pendente';

  labelStepTwo = 'Análise de Nota Fiscal';
  colorStepTwo: ThemePalette = 'warn';
  statusStepTwo = '';

  file: any | null = null;
  clickModalFile: boolean = false;

  painelDuvUmState = false;
  painelDuvDoisState = false;

  enviando = false;

  constructor(
    private fb: NonNullableFormBuilder,
    public dialog: MatDialog,
    public service: GarantiaService,
    private readonly cdr: ChangeDetectorRef,
    private snackBar: MatSnackBar,
    private snackbarColorService: SnackBarColorService
  ) {}

  ngOnInit(): void {
    this.verificaStatus();
  }

  verificaStatus(): void {
    if (this.garantia) {
      if (this.garantia.stepDescription === 'Aguardando envio') {
        this.stepAtual = 0;
        this.buscarDadosEspelho();
      } else {
        this.stepAtual = 1;
        this.colorStepOne = 'accent';
        this.statusStepOne = 'Finalizado';
        this.completedStepOne = true;
        this.isNotaEnviada = true;
        this.colorStepTwo =
          this.garantia.stepDescription === 'Em análise' ? 'primary' : 'warn';
        this.statusStepTwo = this.garantia.stepDescription;
        this.labelStepTwo = 'Nota Fiscal enviada para aprovação';
      }
    }
  }

  buscarDadosEspelho(): void {
    if (this.garantia) {
      this.service.getDadosEspelhoNota(this.garantia.number).subscribe({
        next: (resp) => {
          this.dadosEspelho = resp;
        },
        complete: () => {
          this.cdr.markForCheck();
        },
      });
    }
  }

  onFileSelected(event: any) {
    const nota = event.target.files[0];
    event = null;

    if (nota) {
      const partesFile = nota.name.split('.');
      const typeFile = partesFile[partesFile.length - 1];
      if (typeFile !== 'pdf' && typeFile !== 'jpg') {
        this.dialog
          .open(FalhaArquivoModalComponent, {
            data: this.clickModalFile,
            width: '35vw',
          })
          .afterClosed()
          .subscribe((result) => {
            if (result) {
              this.clickModalFile = false;
              document.getElementById('fileUpload')?.click();
            }
          });
        return;
      }
      this.file = nota;
    }
  }

  removerArquivo() {
    this.file = null;
  }

  verEspelhoNota() {
    this.dialog.open(EspelhoNotaModalComponent, {
      data: this.dadosEspelho,
      maxWidth: '84vw',
      height: '750px',
    });
  }

  enviarNota() {
    this.enviando = true;
    var notaEnvio: Invoice = {
      correlationId: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
      garantia: this.garantia.number,
      numNfe: this.formNotaFiscal.get('numeroNota')?.value!.padStart(9, '0'),
      series: this.formNotaFiscal.get('numeroSerie')?.value!.padStart(3, '0'),
    };
    this.service.sendFileInvoice(this.garantia.number, this.file).subscribe({
      next: (resp) => {
        if (resp) {
          this.service.updateInvoiceStatus(notaEnvio).subscribe({
            next: (env) => {
              if (env.sucesso != '') {
                var statusGarantia: StatusGarantia = {
                  correlationId: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
                  garantia: this.garantia.number,
                  status: '16',
                };
                this.service.updateStatus(statusGarantia).subscribe({
                  next: (stt) => {
                    if (resp) {
                      this.snackBar.open('Nota enviada com sucesso!', 'Ok', {
                        verticalPosition: 'top',
                        ...this.snackbarColorService.getSnackBarConfig(),
                      });
                      this.enviando = false;
                      location.reload();
                    }
                  },
                });
              }
            },
            complete: () => {
              this.cdr.markForCheck();
            },
          });
        }
      },
      complete: () => {
        this.cdr.markForCheck();
      },
    });
  }
}
