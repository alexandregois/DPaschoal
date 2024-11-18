import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
} from '@angular/core';
import { SvgIconService } from '@shared/services/svg-icon.service';
import { NonNullableFormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { environment } from '@env';
import { LoginService } from './login.service';
import { SessionService } from '@core/services/session.service';
import { PreAuthenticationDto } from '@generated/api/portalkd-auth-svc';
import { finalize } from 'rxjs';
import { Router } from '@angular/router';
import { AnalyticsService } from '@shared/services/analytics.service';
import { Customer, Token } from '@core/enum/auth.enum';
import { SnackBarColorService } from '@shared/services/snackbarColor.service';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent {
  isLoading: boolean = false;
  showPassword: boolean = false;
  appTitle = environment.appTitle;
  appSubText = 'Seu catálogo de consultas e compras';

  loginForm = this.fb.group({
    userPrincipalName: [
      '',
      [
        Validators.required,
        Validators.email,
        Validators.pattern(
          /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/
        ),
      ],
    ],
    password: ['', [Validators.required]],
  });

  constructor(
    private fb: NonNullableFormBuilder,
    private svgIcon: SvgIconService,
    private session: SessionService,
    private login: LoginService,
    private readonly cdr: ChangeDetectorRef,
    private snackBar: MatSnackBar,
    private analytics: AnalyticsService,
    private router: Router,
    private snackbarColorService: SnackBarColorService
  ) {
    this.svgIcon.set(`logo`, `/assets/svg/logo.svg`);
  }

  public loginError: boolean = false;

  get passwordToggleLabel(): string {
    return this.showPassword ? 'Esconder senha' : 'Mostrar senha';
  }

  get isAuth(): boolean {
    return !!this.accessToken;
  }
  get accessToken(): string | null {
    return localStorage.getItem(Token.ACCESS_TOKEN);
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  private delay(ms: number): Promise<boolean> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(true);
      }, ms);
    });
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      return;
    }
    this.isLoading = true;
    this.login
      .authPreToken(this.loginForm.value as PreAuthenticationDto)
      .pipe(
        finalize(() => {
          this.cdr.markForCheck();
        })
      )
      .subscribe({
        next: async (res) => {
          this.session.setUserPassword(this.loginForm.value);
          await this.session.login(res, false);
          this.appSubText = 'Carregando seu Perfil...';
          this.session.getCnpjByToken().subscribe(async (data) => {
            if (data.length > 1) {
              await this.delay(3000);
              this.session.openCnpjSelection(() => {
                this.isLoading = false;
                localStorage.setItem(
                  Customer.CUSTOMER_IDENTIFY,
                  this.loginForm.get('userPrincipalName')?.value || ''
                );
                this.analytics.trackCustomerSession(this.isAuth);
                this.router.navigateByUrl('/');
              });
            } else {
              await this.delay(3000);
              this.isLoading = false;
              localStorage.setItem(
                Customer.CUSTOMER_IDENTIFY,
                this.loginForm.get('userPrincipalName')?.value || ''
              );
              this.session.setSelectedCnpj(data[0]);
              this.analytics.trackCustomerSession(this.isAuth);
              this.router.navigateByUrl('/');
            }
          });
          this.snackBar.open(
            'Login realizado com sucesso!',
            'Ok',
            this.snackbarColorService.getSnackBarConfig()
          );
        },
        error: (error) => {
          if (error.error.message !== undefined && error.error.message !== '') {
            this.snackBar.open(
              error.error.message,
              'Ok',
              this.snackbarColorService.getSnackBarConfig()
            );
          } else {
            this.snackBar.open(
              error.error,
              'Ok',
              this.snackbarColorService.getSnackBarConfig()
            );
          }
          this.isLoading = false;
        },
      });
  }
}
