import { Injectable } from '@angular/core';
import { environment } from '@env';
import { finalize, first, Observable, tap } from 'rxjs';

import { NotificationService } from 'generated/api/dpk-customer-svc/api/notification.service';
import {
  KDClientDomainDtosCustomerNotificationDto,
  KDClientDomainDtosNotificationDto,
} from '@generated/api/dpk-customer-svc';
import { StoreService } from '@shared/services/store.service';

@Injectable({
  providedIn: 'root',
})
export class NotificacoesService {
  constructor(
    private notificationService: NotificationService,
    private store: StoreService
  ) {}

  public getNotificacoes(): Observable<KDClientDomainDtosNotificationDto> {
    this.store.setLoadingState('notification', true);
    return this.notificationService.apiNotificationGet(environment.portal).pipe(
      first(),
      tap((data) => this.store.setData('notification', data)),
      finalize(() => this.store.setLoadingState('notification', false))
    );
  }

  public atualizarNotificacoes(
    listaNotificacoes: Array<KDClientDomainDtosCustomerNotificationDto>
  ): Observable<boolean> {
    return this.notificationService.apiNotificationUpdateReadAtPut(
      environment.portal,
      listaNotificacoes
    );
  }
}
