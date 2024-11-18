import { TestBed } from '@angular/core/testing';

import { BuscaProdutoService } from './busca-produto.service';

describe('BuscaProdutoService', () => {
  let service: BuscaProdutoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BuscaProdutoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
