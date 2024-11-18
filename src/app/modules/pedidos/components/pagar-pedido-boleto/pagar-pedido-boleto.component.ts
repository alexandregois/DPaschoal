import { OrderDto } from '@generated/api/dpk-order-svc';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Inject,
  OnInit,
} from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DomSanitizer } from '@angular/platform-browser';
import { PedidoService } from '@modules/pedidos/pedido.service';
import { finalize } from 'rxjs';
import { Clipboard } from '@angular/cdk/clipboard';
import { SnackBarColorService } from '@shared/services/snackbarColor.service';

@Component({
  selector: 'app-pagar-pedido-boleto',
  templateUrl: './pagar-pedido-boleto.component.html',
  styleUrls: ['./pagar-pedido-boleto.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PagarPedidoBoletoComponent implements OnInit {
  isLoading: boolean = true;
  imageQrCode!: any;
  paymentCode!: string | null | undefined;
  constructor(
    @Inject(MAT_DIALOG_DATA) public pedido: OrderDto,
    private _sanitizer: DomSanitizer,
    private pedidoService: PedidoService,
    private snackBar: MatSnackBar,
    private readonly cdr: ChangeDetectorRef,
    private clipboard: Clipboard,
    private snackbarColorService: SnackBarColorService
  ) {}

  ngOnInit(): void {
    this.buscarDadosPagamento();
  }

  buscarDadosPagamento(): void {
    let codigoPagamento: string = '';
    if (this.pedido.orderPayments?.paymentCode) {
      codigoPagamento = this.pedido?.orderPayments?.paymentCode;
    }
    this.pedidoService
      .getPayment(codigoPagamento, this.pedido?.orderPayments?.paymentId)
      .pipe(
        finalize(() => {
          this.isLoading = false;
          this.cdr.markForCheck();
        })
      )
      .subscribe({
        next: (data) => {
          this.imageQrCode = this._sanitizer.bypassSecurityTrustResourceUrl(
            'data:image/png;base64,' + data.paymentDocument
          );
          this.paymentCode = data.emv;
        },
        error: () =>
          this.snackBar.open(
            'Erro ao buscar dados do pagamento',
            'Ok',
            this.snackbarColorService.getSnackBarConfig()
          ),
      });
  }

  copiar(): void {
    if (this.paymentCode) {
      this.clipboard.copy(this.paymentCode);
      this.snackBar.open(
        'Código copiado',
        'Ok',
        this.snackbarColorService.getSnackBarConfig()
      );
    }
  }
}
