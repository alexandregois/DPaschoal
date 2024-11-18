import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  MatDialogModule,
  MAT_DIALOG_DATA,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { RouterTestingModule } from '@angular/router/testing';

import { EspelhoNotaModalComponent } from './espelho-nota-modal.component';

describe('EspelhoNotaModalComponent', () => {
  let component: EspelhoNotaModalComponent;
  let fixture: ComponentFixture<EspelhoNotaModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EspelhoNotaModalComponent],
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

    fixture = TestBed.createComponent(EspelhoNotaModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
