import { TestBed } from '@angular/core/testing';

import { CategoriasViewResolver } from './categorias-view.resolver';

describe('CategoriasViewResolver', () => {
  let resolver: CategoriasViewResolver;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    resolver = TestBed.inject(CategoriasViewResolver);
  });

  it('should be created', () => {
    expect(resolver).toBeTruthy();
  });
});
