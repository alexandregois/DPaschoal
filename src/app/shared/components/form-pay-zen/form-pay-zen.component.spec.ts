import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormPayZenComponent } from './form-pay-zen.component';

describe('FormPayZenComponent', () => {
  let component: FormPayZenComponent;
  let fixture: ComponentFixture<FormPayZenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [FormPayZenComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FormPayZenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
