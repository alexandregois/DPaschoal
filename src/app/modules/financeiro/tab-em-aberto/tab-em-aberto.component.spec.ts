import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSnackBarModule } from '@angular/material/snack-bar';

import { TabEmAbertoComponent } from './tab-em-aberto.component';

describe('TabEmAbertoComponent', () => {
  let component: TabEmAbertoComponent;
  let fixture: ComponentFixture<TabEmAbertoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        HttpClientTestingModule,
        MatSnackBarModule,
      ],
      declarations: [TabEmAbertoComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TabEmAbertoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
