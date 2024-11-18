import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { FreteComponent } from './frete.component';

describe('FreteComponent', () => {
  let component: FreteComponent;
  let fixture: ComponentFixture<FreteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormsModule, ReactiveFormsModule],
      declarations: [FreteComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FreteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
