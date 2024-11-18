import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSnackBarModule } from '@angular/material/snack-bar';

import { TabPagosComponent } from './tab-pagos.component';

describe('TabPagosComponent', () => {
  let component: TabPagosComponent;
  let fixture: ComponentFixture<TabPagosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        HttpClientTestingModule,
        MatSnackBarModule,
      ],
      declarations: [TabPagosComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TabPagosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
