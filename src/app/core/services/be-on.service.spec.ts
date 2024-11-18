import { TestBed } from '@angular/core/testing';

import { BeOnService } from './be-on.service';

describe('BeOnService', () => {
  let service: BeOnService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BeOnService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
