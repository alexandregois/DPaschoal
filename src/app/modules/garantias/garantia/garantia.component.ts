import { finalize } from 'rxjs';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
  OnChanges,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CentrosDistribuicao, Garantia } from '@models/warranty.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatStepper } from '@angular/material/stepper';
import { GarantiaService } from '@modules/garantias/garantia/garantia.service';
import { SnackBarColorService } from '@shared/services/snackbarColor.service';

@Component({
  selector: 'app-garantia',
  templateUrl: './garantia.component.html',
  styleUrls: ['./garantia.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GarantiaComponent implements OnInit, OnChanges {
  @ViewChild('stepperGarantia', { static: false }) private stepper!: MatStepper;

  isLoading: boolean = false;
  etapaAtual: number = 0;
  isIsentoEtapaNota: boolean = false;
  approvedValue: number = 0;

  garantia!: Garantia;
  centros!: CentrosDistribuicao;

  customerSapCode!: number;
  garantiaNumber: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private snackBar: MatSnackBar,
    private service: GarantiaService,
    private cdr: ChangeDetectorRef,
    private snackbarColorService: SnackBarColorService
  ) {}

  ngOnInit(): void {
    this.garantiaNumber = this.route.snapshot.paramMap.get('garantia');
    if (this.garantiaNumber && this.garantiaNumber !== 'nova') {
      this.buscarGarantia(this.garantiaNumber);
    } else {
      this.validarCustomer();
    }
  }

  ngOnChanges(): void {
    if (this.garantiaNumber === null) {
      this.garantiaNumber = this.route.snapshot.paramMap.get('garantia');
      this.buscarGarantia(this.garantiaNumber!);
    }
  }

  buscarCentros(): void {
    this.service.buscarEnderecoCentrosDistribuicao().subscribe({
      next: (resp) => {
        this.centros = resp;
      },
      complete: () => {
        this.isLoading = false;
        this.cdr.markForCheck();
      },
    });
  }

  buscarGarantia(garantiaNumber: string): void {
    this.isLoading = true;
    this.service
      .getGarantiaByNumber(garantiaNumber)
      .pipe(
        finalize(() => {
          this.buscarCentros();
          this.cdr.markForCheck();
        })
      )
      .subscribe({
        next: (result) => {
          this.garantia = result;
          if (this.garantia) {
            this.approvedValue = this.garantia.approvedValue;
          }
          console.log(this.garantia);
          switch (this.garantia.stepDescription) {
            case 'Aguardando envio':
            case 'Em análise':
            case 'Recusada':
              this.etapaAtual = 1;
              break;
            case 'Aguardando entrega':
            case 'Improcedente':
            case 'Em conferência':
            case 'Falta documentação':
              this.etapaAtual = 2;
              break;
            case 'Crédito disponível':
            case 'Crédito utilizado':
              this.etapaAtual = 3;
              break;
            default:
              this.etapaAtual = 0;
          }
        },
        error: () =>
          this.snackBar.open('Erro ao buscar detalhe da garantia', 'Ok', {
            verticalPosition: 'top',
            ...this.snackbarColorService.getSnackBarConfig(),
          }),
      });
  }

  validarCustomer() {
    this.isLoading = true;
    this.service.validarCustomer().subscribe({
      next: (resp) => {
        this.isIsentoEtapaNota = resp.etClientes[0].flag == 'X';
        this.customerSapCode = resp.etClientes[0].document;
      },
      complete: () => {
        this.buscarCentros();
        this.cdr.markForCheck();
      },
    });
  }

  proximaEtapa(nextStep: number) {
    if (nextStep) {
      this.etapaAtual = nextStep;
    }
  }
}
