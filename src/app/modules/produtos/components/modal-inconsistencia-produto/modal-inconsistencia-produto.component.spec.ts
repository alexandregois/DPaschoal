import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { RouterTestingModule } from '@angular/router/testing';

import { ModalInconsistenciaProdutoComponent } from './modal-inconsistencia-produto.component';

describe('ModalInconsistenciaProdutoComponent', () => {
  let component: ModalInconsistenciaProdutoComponent;
  let fixture: ComponentFixture<ModalInconsistenciaProdutoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ModalInconsistenciaProdutoComponent],
      imports: [
        RouterTestingModule,
        MatDialogModule,
        HttpClientTestingModule,
        MatSnackBarModule,
      ],
      providers: [{ provide: MatDialogRef, useValue: {} }],
    }).compileComponents();

    fixture = TestBed.createComponent(ModalInconsistenciaProdutoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
