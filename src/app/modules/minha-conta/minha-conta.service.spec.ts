import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { MinhaContaService } from './minha-conta.service';

describe('MinhaContaService', () => {
  let service: MinhaContaService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(MinhaContaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
