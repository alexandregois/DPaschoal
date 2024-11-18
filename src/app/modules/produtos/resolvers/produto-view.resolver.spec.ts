import { TestBed } from '@angular/core/testing';

import { ProdutoViewResolver } from './produto-view.resolver';

describe('ProdutoViewResolver', () => {
  let resolver: ProdutoViewResolver;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    resolver = TestBed.inject(ProdutoViewResolver);
  });

  it('should be created', () => {
    expect(resolver).toBeTruthy();
  });
});
