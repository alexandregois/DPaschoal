import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotasProdutoSelecionadoCardComponent } from './notas-produto-selecionado-card.component';

describe('NotasProdutoSelecionadoCardComponent', () => {
  let component: NotasProdutoSelecionadoCardComponent;
  let fixture: ComponentFixture<NotasProdutoSelecionadoCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NotasProdutoSelecionadoCardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(NotasProdutoSelecionadoCardComponent);
    component = fixture.componentInstance;
    // fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
