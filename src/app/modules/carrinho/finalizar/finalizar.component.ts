import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
  OnDestroy,
} from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { PaymentTypeDto } from '@generated/api/dpk-order-svc';
import { PaymentTypeService } from '@shared/services/payment-type.service';
import { HostListener } from '@angular/core';
@Component({
  selector: 'app-finalizar',
  templateUrl: './finalizar.component.html',
  styleUrls: ['./finalizar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinalizarComponent implements OnInit, OnDestroy {
  paymentTypeList: PaymentTypeDto[] | undefined;

  paymentType?: string | number | null;
  priceList: any = [];
  valorParcela?: number;
  isGridView: boolean = false;

  private unsubscribe$ = new Subject<void>();

  constructor(
    private paymentTypeService: PaymentTypeService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.paymentTypeService.currentPaymentType
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((paymentType) => {
        this.paymentType = paymentType;
      });

    this.paymentTypeService.parcelaValor$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((valor) => {
        this.valorParcela = valor;
        this.cdr.detectChanges();
      });

    this.paymentTypeService.currentPriceList
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((priceList) => {
        this.priceList = priceList;
        this.cdr.detectChanges();
      });
    const windowWidth = window.innerWidth;
    if (windowWidth <= 1025) {
      this.isGridView = true;
    } else {
      this.isGridView = false;
    }
  }

  ngOnDestroy(): void {
    // Completando as inscrições quando o componente for destruído.
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
  @HostListener('window:resize', ['$event'])
  onResize(event: { target: { innerWidth: any } }) {
    const windowWidth = event.target.innerWidth;
    if (windowWidth <= 1025) {
      this.isGridView = true;
    } else {
      this.isGridView = false;
    }
  }
}
