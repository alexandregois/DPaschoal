import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatSnackBarModule } from '@angular/material/snack-bar';

import { CardCartItemComponent } from './card-cart-item.component';

describe('CardCartItemComponent', () => {
  let component: CardCartItemComponent;
  let fixture: ComponentFixture<CardCartItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, MatSnackBarModule],
      declarations: [CardCartItemComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CardCartItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
