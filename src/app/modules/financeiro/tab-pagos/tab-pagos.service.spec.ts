import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { TabPagosService } from './tab-pagos.service';

describe('TabPagosService', () => {
  let service: TabPagosService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(TabPagosService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
