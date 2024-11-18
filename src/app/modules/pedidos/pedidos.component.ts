import { MatPaginatorIntl, PageEvent } from '@angular/material/paginator';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
} from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { OrderDto, StatusOrderDto } from '@generated/api/dpk-order-svc';
import { finalize } from 'rxjs';
import { PedidoService } from './pedido.service';

@Component({
  selector: 'app-pedidos',
  templateUrl: './pedidos.component.html',
  styleUrls: ['./pedidos.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PedidosComponent extends MatPaginatorIntl implements OnInit {
  override lastPageLabel = 'Ultima página';
  override nextPageLabel = 'Próxima página';
  override firstPageLabel = 'Primeira página';
  override previousPageLabel = 'Pagina anterior';
  override itemsPerPageLabel = 'Itens por página:';
  length = 0;
  pageSize = 20;
  pageIndex = 0;

  isLoading: boolean = true;
  statusList: Array<StatusOrderDto> = [];

  pedidos: Array<OrderDto> = [];
  selectedStatus: number = 0;

  constructor(
    private pedidoService: PedidoService,
    private snackBar: MatSnackBar,
    private readonly cdr: ChangeDetectorRef
  ) {
    super();
  }

  ngOnInit(): void {
    this.buscarPedidos();
  }

  buscarPedidos(): void {
    this.isLoading = true;
    let skipper = this.pageIndex * this.pageSize;
    this.pedidoService
      .getOrderByFilter({
        skip: skipper,
        take: this.pageSize,
        statusId: this.selectedStatus,
      })
      .pipe(
        finalize(() => {
          this.isLoading = false;
          this.cdr.markForCheck();
        })
      )
      .subscribe({
        next: (orderFilter) => {
          if (orderFilter) {
            if (orderFilter.totalCount) {
              this.length = orderFilter.totalCount;
            }
            if (orderFilter.orders) {
              this.pedidos = orderFilter.orders;
            }
            if (orderFilter.status) {
              this.statusList = orderFilter.status;
            }
          }
        },
        error: () => this.snackBar.open('Erro ao buscar pedidos', 'Ok'),
      });
  }

  filtrarPedidos($event: any) {
    this.selectedStatus = $event.value;
    this.buscarPedidos();
  }

  mudarPagina(event: PageEvent) {
    this.length = event.length;
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;
    this.buscarPedidos();
  }
}
