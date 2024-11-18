import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProdutoQuantidadeCardComponent } from './produto-quantidade-card.component';

describe('ProdutoQuantidadeCardComponent', () => {
  let component: ProdutoQuantidadeCardComponent;
  let fixture: ComponentFixture<ProdutoQuantidadeCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProdutoQuantidadeCardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ProdutoQuantidadeCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
