import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { RouterTestingModule } from '@angular/router/testing';

import { EtapaEntregaComponent } from './etapa-entrega.component';

describe('EtapaEntregaComponent', () => {
  let component: EtapaEntregaComponent;
  let fixture: ComponentFixture<EtapaEntregaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EtapaEntregaComponent],
      imports: [
        RouterTestingModule,
        MatDialogModule,
        HttpClientTestingModule,
        MatSnackBarModule,
      ],
      providers: [{ provide: MatDialogRef, useValue: {} }],
    }).compileComponents();

    fixture = TestBed.createComponent(EtapaEntregaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
