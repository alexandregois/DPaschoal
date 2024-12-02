import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { GarantiaService } from './garantia.service';

describe('GarantiaService', () => {
  let service: GarantiaService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(GarantiaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
