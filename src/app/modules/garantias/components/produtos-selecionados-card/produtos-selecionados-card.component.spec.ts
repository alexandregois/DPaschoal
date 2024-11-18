import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProdutosSelecionadosCardComponent } from './produtos-selecionados-card.component';

describe('ProdutosSelecionadosCardComponent', () => {
  let component: ProdutosSelecionadosCardComponent;
  let fixture: ComponentFixture<ProdutosSelecionadosCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProdutosSelecionadosCardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ProdutosSelecionadosCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
