import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { GarantiasService } from './garantias.service';

describe('GarantiasService', () => {
  let service: GarantiasService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(GarantiasService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
