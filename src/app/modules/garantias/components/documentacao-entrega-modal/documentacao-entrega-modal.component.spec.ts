import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  MatDialogModule,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { RouterTestingModule } from '@angular/router/testing';

import { DocumentacaoEntregaModalComponent } from './documentacao-entrega-modal.component';

describe('DocumentacaoEntregaModalComponent', () => {
  let component: DocumentacaoEntregaModalComponent;
  let fixture: ComponentFixture<DocumentacaoEntregaModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DocumentacaoEntregaModalComponent],
      imports: [
        RouterTestingModule,
        MatDialogModule,
        HttpClientTestingModule,
        MatSnackBarModule,
      ],
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: [] },
        { provide: MatDialogRef, useValue: {} },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DocumentacaoEntregaModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
