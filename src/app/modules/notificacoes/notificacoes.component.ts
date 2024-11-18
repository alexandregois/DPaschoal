import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
} from '@angular/core';
import { MatPaginatorIntl, PageEvent } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { KDClientDomainDtosCustomerNotificationDto } from '@generated/api/dpk-customer-svc';
import { finalize, first } from 'rxjs';
import { StoreService } from '@shared/services/store.service';
import { NotificacoesService } from './notificacoes.service';
import { SnackBarColorService } from '@shared/services/snackbarColor.service';

@Component({
  selector: 'app-notificacoes',
  templateUrl: './notificacoes.component.html',
  styleUrls: ['./notificacoes.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotificacoesComponent extends MatPaginatorIntl implements OnInit {
  constructor(
    private service: NotificacoesService,
    private snackBar: MatSnackBar,
    private cdr: ChangeDetectorRef,
    private store: StoreService,
    private snackbarColorService: SnackBarColorService
  ) {
    super();
  }

  override lastPageLabel = 'Ultima página';
  override nextPageLabel = 'Próxima página';
  override firstPageLabel = 'Primeira página';
  override previousPageLabel = 'Pagina anterior';
  override itemsPerPageLabel = 'Itens por página:';
  length = 0;
  pageSize = 10;
  pageIndex = 0;

  isLoading$ = this.store.getLoadingState('notification');

  notificacoes: Array<KDClientDomainDtosCustomerNotificationDto> = [];
  notificacoesPorPagina: Array<KDClientDomainDtosCustomerNotificationDto> = [];

  ngOnInit(): void {
    this.buscarNotificacoes();
  }

  buscarNotificacoes(): void {
    this.service.getNotificacoes().subscribe({
      next: (result) => {
        if (result && result.customerNotifications) {
          this.length = result.customerNotifications.length;
          this.notificacoes = result.customerNotifications;
          this.notificacoesPorPagina = this.notificacoes.slice(
            this.pageIndex * this.pageSize,
            (this.pageIndex + 1) * this.pageSize
          );
          this.atualizarComoLidas();
        }
      },
      error: () => {
        this.snackBar.open(
          'Erro ao buscar notificações',
          'Ok',
          this.snackbarColorService.getSnackBarConfig()
        );
      },
    });
  }

  atualizarComoLidas(): void {
    let listaParaAtualizar = this.notificacoesPorPagina.filter(
      (notify) => notify.readAt === null
    );
    if (listaParaAtualizar.length > 0) {
      this.store.setLoadingState('notification', true);
      this.service.atualizarNotificacoes(listaParaAtualizar).subscribe({
        next: (result) => {
          if (result) {
            this.service
              .getNotificacoes()
              .pipe(
                first(),
                finalize(() =>
                  this.store.setLoadingState('notification', false)
                )
              )
              .subscribe((result) => {
                if (result) {
                  if (result.customerNotifications) {
                    this.length = result.customerNotifications.length;
                    this.notificacoes = result.customerNotifications;
                    this.notificacoesPorPagina = this.notificacoes.slice(
                      this.pageIndex * this.pageSize,
                      (this.pageIndex + 1) * this.pageSize
                    );
                  }
                }
              });
          }
        },
        error: () =>
          this.snackBar.open(
            'Erro ao atualizar notificações',
            'Ok',
            this.snackbarColorService.getSnackBarConfig()
          ),
      });
    }
  }

  mudarPagina(event: PageEvent) {
    this.length = event.length;
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;
    this.notificacoesPorPagina = this.notificacoes.slice(
      this.pageIndex * this.pageSize,
      (this.pageIndex + 1) * this.pageSize
    );
    this.atualizarComoLidas();
  }
}
