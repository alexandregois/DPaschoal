import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { MatDialogModule } from '@angular/material/dialog';

import { ToolbarCartIconComponent } from './toolbar-cart-icon.component';

describe('ToolbarCartIconComponent', () => {
  let component: ToolbarCartIconComponent;
  let fixture: ComponentFixture<ToolbarCartIconComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule, HttpClientTestingModule, MatDialogModule],
      declarations: [ToolbarCartIconComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ToolbarCartIconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
