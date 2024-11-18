import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormCartaoCreditoComponent } from './form-cartao-credito.component';

describe('FormCartaoCreditoComponent', () => {
  let component: FormCartaoCreditoComponent;
  let fixture: ComponentFixture<FormCartaoCreditoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FormCartaoCreditoComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FormCartaoCreditoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
