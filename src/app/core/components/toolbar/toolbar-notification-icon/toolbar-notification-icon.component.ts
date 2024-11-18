import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { finalize, first, tap } from 'rxjs';
import { environment } from '@env';
import { StoreService } from '@shared/services/store.service';
import { SessionService } from '@core/services/session.service';
import {
  KDClientDomainDtosNotificationDto,
  NotificationService,
} from '@generated/api/dpk-customer-svc';
import { BreakpointService } from '@shared/services/breakpoint.service';
import { DocumentVisibilityService } from '@shared/services/document-visibility.service';
import { Token } from '@core/enum/auth.enum';
@Component({
  selector: 'app-toolbar-notification-icon',
  templateUrl: './toolbar-notification-icon.component.html',
  styleUrls: ['./toolbar-notification-icon.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ToolbarNotificationIconComponent implements OnInit {
  isLoading$ = this.store.getLoadingState('notification');
  isSmallScreen$ = this.breakpoint.isSmallScreen();
  totalCount = 0;

  constructor(
    private session: SessionService,
    private store: StoreService,
    private breakpoint: BreakpointService,
    private documentVisibility: DocumentVisibilityService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    //this.toolbarValidAuth();
    this.store
      .getData('notification')
      .subscribe((notifications) => this.setTotalCount(notifications));
    this.documentVisibility.state.subscribe((state) => {
      if (state === 'visible') {
        this.loadTotalNotifications();
      }
    });

    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') {
        this.loadTotalNotifications();
      }
    });
    this.session.getIsAuthSubject().subscribe((isAuth: boolean) => {
      if (isAuth) {
        this.loadTotalNotifications();
      }
    });
  }

  loadTotalNotifications(): void {
    this.session.getIsAuthSubject().subscribe((isAuth: boolean) => {
      if (isAuth) {
        this.toolbarValidAuth();
        this.store.setLoadingState('notification', true);
        this.notificationService
          .apiNotificationGet(environment.portal)
          .pipe(
            first(),
            tap((data) => this.store.setData('notification', data)),
            finalize(() => this.store.setLoadingState('notification', false))
          )
          .subscribe(this.setTotalCount);
      }
    });
  }

  setTotalCount(notify: KDClientDomainDtosNotificationDto | undefined): void {
    if (notify && notify.count) {
      this.totalCount = notify.count;
    } else {
      this.totalCount = 0;
    }
  }

  toolbarValidAuth() {
    if (this.session.isAuth) {
      const JWT = localStorage.getItem(Token.ACCESS_TOKEN);
      if (JWT) {
        const jwtPayload = JSON.parse(window.atob(JWT.split('.')[1]));
        const expiration = jwtPayload.exp;
        if (Date.now() >= expiration * 1000) {
          this.session.logout(true, true);
        }
      }
    } else {
      this.session.logout(true, true);
    }
  }
}
