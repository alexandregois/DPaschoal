import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { RouterTestingModule } from '@angular/router/testing';
import { FormatTimePipe } from '@shared/pipes/format-time.pipe';

import { InputCodeFormComponent } from './input-code-form.component';

describe('InputCodeFormComponent', () => {
  let component: InputCodeFormComponent;
  let fixture: ComponentFixture<InputCodeFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        HttpClientTestingModule,
        RouterTestingModule,
        MatSnackBarModule,
      ],
      declarations: [InputCodeFormComponent, FormatTimePipe],
    }).compileComponents();

    fixture = TestBed.createComponent(InputCodeFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
