import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { RouterTestingModule } from '@angular/router/testing';

import { LimiteDeCreditoComponent } from './limite-de-credito.component';

describe('LimiteDeCreditoComponent', () => {
  let component: LimiteDeCreditoComponent;
  let fixture: ComponentFixture<LimiteDeCreditoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
        MatSnackBarModule,
      ],
      declarations: [LimiteDeCreditoComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LimiteDeCreditoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
