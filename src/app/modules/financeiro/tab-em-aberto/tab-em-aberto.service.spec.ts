import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { TabEmAbertoService } from './tab-em-aberto.service';

describe('TabEmAbertoService', () => {
  let service: TabEmAbertoService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(TabEmAbertoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
