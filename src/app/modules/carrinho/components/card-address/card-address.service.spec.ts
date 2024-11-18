import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { CardAddressService } from './card-address.service';

describe('CardAddressService', () => {
  let service: CardAddressService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(CardAddressService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
