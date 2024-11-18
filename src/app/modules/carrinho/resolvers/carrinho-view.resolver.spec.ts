import { TestBed } from '@angular/core/testing';

import { CarrinhoViewResolver } from './carrinho-view.resolver';

describe('CarrinhoViewResolver', () => {
  let resolver: CarrinhoViewResolver;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    resolver = TestBed.inject(CarrinhoViewResolver);
  });

  it('should be created', () => {
    expect(resolver).toBeTruthy();
  });
});
