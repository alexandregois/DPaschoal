import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { RouterModule } from '@angular/router';

import { GarantiaComponent } from './garantia.component';

describe('GarantiaComponent', () => {
  let component: GarantiaComponent;
  let fixture: ComponentFixture<GarantiaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        MatDialogModule,
        HttpClientTestingModule,
        MatSnackBarModule,
        RouterModule.forRoot([]),
      ],
      declarations: [GarantiaComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(GarantiaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
