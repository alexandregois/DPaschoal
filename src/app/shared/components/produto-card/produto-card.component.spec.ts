import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { RouterTestingModule } from '@angular/router/testing';
import { ProducDetailDto } from '@generated/api/api-external-svc';
import { ProdutoService } from '@modules/produtos/produto/produto.service';
import { Observable, of } from 'rxjs';

import { ProdutoCardComponent } from './produto-card.component';

export class MatDialogMock {
  open() {
    return {
      afterClosed: () => of({ action: true }),
    };
  }
}

describe('ProdutoCardComponent', () => {
  let component: ProdutoCardComponent;
  let fixture: ComponentFixture<ProdutoCardComponent>;
  let mockProdutoService;

  beforeEach(async () => {
    mockProdutoService = jasmine.createSpyObj(['buscarProduto']);
    mockProdutoService.buscarProduto.and.returnValue(
      of(Observable<ProducDetailDto>)
    );
    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
        MatSnackBarModule,
      ],
      declarations: [ProdutoCardComponent],
      providers: [
        { provide: ProdutoService, useValue: mockProdutoService },
        { provide: MatDialog, useClass: MatDialogMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ProdutoCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
