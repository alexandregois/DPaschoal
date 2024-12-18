import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BuscaProdutoComponent } from './busca-produto.component';

describe('BuscaProdutoComponent', () => {
  let component: BuscaProdutoComponent;
  let fixture: ComponentFixture<BuscaProdutoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BuscaProdutoComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(BuscaProdutoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
