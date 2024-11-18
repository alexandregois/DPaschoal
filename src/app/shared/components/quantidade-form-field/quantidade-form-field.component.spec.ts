import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuantidadeFormFieldComponent } from './quantidade-form-field.component';

describe('QuantidadeFormFieldComponent', () => {
  let component: QuantidadeFormFieldComponent;
  let fixture: ComponentFixture<QuantidadeFormFieldComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [QuantidadeFormFieldComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(QuantidadeFormFieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
