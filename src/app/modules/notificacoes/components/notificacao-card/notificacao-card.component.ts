import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { KDClientDomainDtosCustomerNotificationDto } from '@generated/api/dpk-customer-svc';

@Component({
  selector: 'app-notificacao-card',
  templateUrl: './notificacao-card.component.html',
  styleUrls: ['./notificacao-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotificacaoCardComponent {
  @Input()
  notificacao: KDClientDomainDtosCustomerNotificationDto | undefined;
}
