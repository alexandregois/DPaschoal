import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProdutoBuscaCardComponent } from './produto-busca-card.component';

describe('ProdutoBuscaCardComponent', () => {
  let component: ProdutoBuscaCardComponent;
  let fixture: ComponentFixture<ProdutoBuscaCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProdutoBuscaCardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ProdutoBuscaCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
