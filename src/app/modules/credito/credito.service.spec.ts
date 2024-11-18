import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { CreditoService } from './credito.service';

describe('CreditoService', () => {
  let service: CreditoService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(CreditoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
