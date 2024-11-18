import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { AuthService } from './auth.service';

// TODO USER TEST CASE
// CNPJ TESTES QA 33601076000121
// CNPJ ERRO 12564086000164
// CNPJ INAPTO 59297937000113
// CNPJ ERRO CADASTRO RECEITA 36888868000117
// CNPJ DPASCHOAL 45987005000198

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, HttpClientTestingModule],
    });
    service = TestBed.inject(AuthService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
