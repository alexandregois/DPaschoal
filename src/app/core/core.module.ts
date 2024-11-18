import { CommonModule, registerLocaleData } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import ptBr from '@angular/common/locales/pt';
import { DEFAULT_CURRENCY_CODE, LOCALE_ID, NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { MatBadgeModule } from '@angular/material/badge';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';

import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import {
  MatSnackBarModule,
  MAT_SNACK_BAR_DEFAULT_OPTIONS,
} from '@angular/material/snack-bar';
import { MatStepperModule } from '@angular/material/stepper';
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CookiesComponent } from '@core/components/cookies/cookies.component';
import { FiltersComponent } from '@core/components/filters/filters.component';
import { HeaderComponent } from '@core/components/header/header.component';
import { NavbarComponent } from '@core/components/navbar/navbar.component';
import { ToolbarComponent } from '@core/components/toolbar/toolbar.component';
import { FooterComponent } from './components/footer/footer.component';
import { SidenavComponent } from './components/sidenav/sidenav.component';
import { ErrorInterceptorProvider } from './interceptors/error.interceptor';
import { JwtInterceptorProvider } from './interceptors/jwt.interceptor';
import { PortalInterceptorProvider } from './interceptors/portal.interceptor';
import { CustomTitleStrategyServiceProvider } from './services/custom-title-strategy.service';
import { EventsApiServiceProvider } from './services/events-api.service';
import { ToolbarNotificationIconComponent } from './components/toolbar/toolbar-notification-icon/toolbar-notification-icon.component';
import { ToolbarCartIconComponent } from './components/toolbar/toolbar-cart-icon/toolbar-cart-icon.component';
import { SearchFilterComponent } from './components/search-filter/search-filter.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

registerLocaleData(ptBr);

@NgModule({
  declarations: [
    HeaderComponent,
    ToolbarComponent,
    FiltersComponent,
    NavbarComponent,
    SidenavComponent,
    FooterComponent,
    CookiesComponent,
    ToolbarNotificationIconComponent,
    ToolbarCartIconComponent,
    SearchFilterComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    HttpClientModule,
    MatBadgeModule,
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatSelectModule,
    MatSnackBarModule,
    MatStepperModule,
    MatTabsModule,
    MatToolbarModule,
    MatDialogModule,
    MatSidenavModule,
    MatListModule,
    MatChipsModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    ReactiveFormsModule,
    MatGridListModule,
    MatCardModule,
  ],
  exports: [
    HeaderComponent,
    SidenavComponent,
    MatSidenavModule,
    FooterComponent,
    CookiesComponent,
    MatCardModule,
  ],
  providers: [
    { provide: LOCALE_ID, useValue: 'pt-BR' },
    { provide: DEFAULT_CURRENCY_CODE, useValue: 'BRL' },
    { provide: MAT_SNACK_BAR_DEFAULT_OPTIONS, useValue: { duration: 2500 } },
    CustomTitleStrategyServiceProvider,
    EventsApiServiceProvider,
    PortalInterceptorProvider,
    JwtInterceptorProvider,
    ErrorInterceptorProvider,
  ],
})
export class CoreModule {}
