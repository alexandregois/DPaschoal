import { LayoutModule } from '@angular/cdk/layout';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatBadgeModule } from '@angular/material/badge';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import {
  MatSnackBarModule,
  MAT_SNACK_BAR_DEFAULT_OPTIONS,
} from '@angular/material/snack-bar';
import { MatStepperModule } from '@angular/material/stepper';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatRadioModule } from '@angular/material/radio';
import { RouterModule } from '@angular/router';
import { NgxMaskModule } from 'ngx-mask';
import { MaisEstoqueDialogComponent } from './components/mais-estoque-dialog/mais-estoque-dialog.component';
import { QuantidadeFormFieldComponent } from './components/quantidade-form-field/quantidade-form-field.component';
import { SitemapComponent } from './components/sitemap/sitemap.component';
import { InputCodeFormComponent } from './components/input-code-form/input-code-form.component';
import { FormatTimePipe } from './pipes/format-time.pipe';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { InputFileComponent } from './components/input-file/input-file.component';
import { LimiteDeCreditoComponent } from './components/limite-de-credito/limite-de-credito.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ImgDirective } from './directives/img.directive';
import { CnpjDialogComponent } from './components/cnpj-dialog/cnpj-dialog.component';
import { CnpjPipe } from './pipes/cnpj.pipe';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    LayoutModule,
    MatRadioModule,
    MatBadgeModule,
    MatButtonModule,
    MatCardModule,
    MatCheckboxModule,
    MatChipsModule,
    MatDialogModule,
    MatNativeDateModule,
    MatDividerModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatMenuModule,
    MatProgressBarModule,
    MatDatepickerModule,
    MatSelectModule,
    MatSidenavModule,
    MatSnackBarModule,
    MatPaginatorModule,
    MatStepperModule,
    MatTooltipModule,
    MatTableModule,
    MatTabsModule,
    MatToolbarModule,
    MatProgressSpinnerModule,
    NgxMaskModule.forRoot({ dropSpecialCharacters: true }),
    ReactiveFormsModule,
    RouterModule,
  ],
  exports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    LayoutModule,
    MatRadioModule,
    MatBadgeModule,
    MatButtonModule,
    MatCardModule,
    MatCheckboxModule,
    MatChipsModule,
    MatDialogModule,
    MatNativeDateModule,
    MatDividerModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatMenuModule,
    MatProgressBarModule,
    MatDatepickerModule,
    MatSelectModule,
    MatSidenavModule,
    MatSnackBarModule,
    MatPaginatorModule,
    MatStepperModule,
    MatTooltipModule,
    MatTableModule,
    MatTabsModule,
    MatToolbarModule,
    MatTableModule,
    NgxMaskModule,
    ReactiveFormsModule,
    RouterModule,
    QuantidadeFormFieldComponent,
    SitemapComponent,
    LimiteDeCreditoComponent,
    InputCodeFormComponent,
    InputFileComponent,
    FormatTimePipe,
    MatProgressSpinnerModule,
    ImgDirective,
    CnpjPipe,
  ],
  declarations: [
    MaisEstoqueDialogComponent,
    QuantidadeFormFieldComponent,
    SitemapComponent,
    InputCodeFormComponent,
    FormatTimePipe,
    InputFileComponent,
    LimiteDeCreditoComponent,
    ImgDirective,
    CnpjDialogComponent,
    CnpjPipe,
  ],
  providers: [
    { provide: MAT_SNACK_BAR_DEFAULT_OPTIONS, useValue: { duration: 2500 } },
  ],
})
export class SharedModule {}
