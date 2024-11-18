import { TestBed } from '@angular/core/testing';

import { BuscaViewResolver } from './busca-view.resolver';

describe('BuscaViewResolver', () => {
  let resolver: BuscaViewResolver;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    resolver = TestBed.inject(BuscaViewResolver);
  });

  it('should be created', () => {
    expect(resolver).toBeTruthy();
  });
});
