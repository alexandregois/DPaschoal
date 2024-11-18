import { TestBed } from '@angular/core/testing';

import { PaginaViewResolver } from './pagina-view.resolver';

describe('PaginaViewResolver', () => {
  let resolver: PaginaViewResolver;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    resolver = TestBed.inject(PaginaViewResolver);
  });

  it('should be created', () => {
    expect(resolver).toBeTruthy();
  });
});
