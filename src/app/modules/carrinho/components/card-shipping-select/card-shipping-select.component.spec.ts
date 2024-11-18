import { MatDialog } from '@angular/material/dialog';
import { of } from 'rxjs';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatSnackBarModule } from '@angular/material/snack-bar';

import { CardShippingSelectComponent } from './card-shipping-select.component';

export class MatDialogMock {
  open() {
    return {
      afterClosed: () => of({ action: true }),
    };
  }
}
describe('CardShippingSelectComponent', () => {
  let component: CardShippingSelectComponent;
  let fixture: ComponentFixture<CardShippingSelectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, MatSnackBarModule],
      declarations: [CardShippingSelectComponent],
      providers: [{ provide: MatDialog, useClass: MatDialogMock }],
    }).compileComponents();

    fixture = TestBed.createComponent(CardShippingSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
