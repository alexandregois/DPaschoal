import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  MatDialogModule,
  MAT_DIALOG_DATA,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { RouterTestingModule } from '@angular/router/testing';

import { FalhaArquivoModalComponent } from './falha-arquivo-modal.component';

describe('FalhaArquivoModalComponent', () => {
  let component: FalhaArquivoModalComponent;
  let fixture: ComponentFixture<FalhaArquivoModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FalhaArquivoModalComponent],
      imports: [
        RouterTestingModule,
        MatDialogModule,
        HttpClientTestingModule,
        MatSnackBarModule,
      ],
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: [] },
        { provide: MatDialogRef, useValue: Boolean },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(FalhaArquivoModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
