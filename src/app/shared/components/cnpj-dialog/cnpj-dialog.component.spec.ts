import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogModule } from '@angular/material/dialog';
import { RouterTestingModule } from '@angular/router/testing';
import { CnpjPipe } from '@shared/pipes/cnpj.pipe';

import { CnpjDialogComponent } from './cnpj-dialog.component';

describe('CnpjDialogComponent', () => {
  let component: CnpjDialogComponent;
  let fixture: ComponentFixture<CnpjDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule, MatDialogModule],
      declarations: [CnpjDialogComponent, CnpjPipe],
    }).compileComponents();

    fixture = TestBed.createComponent(CnpjDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
