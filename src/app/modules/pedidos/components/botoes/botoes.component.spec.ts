import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { of } from 'rxjs';
import { BotoesComponent } from './botoes.component';

export class MatDialogMock {
  open() {
    return {
      afterClosed: () => of({ action: true }),
    };
  }
}

describe('BotoesComponent', () => {
  let component: BotoesComponent;
  let fixture: ComponentFixture<BotoesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [BotoesComponent],
      providers: [{ provide: MatDialog, useClass: MatDialogMock }],
    }).compileComponents();

    fixture = TestBed.createComponent(BotoesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
