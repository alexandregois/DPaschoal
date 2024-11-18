import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { CardShippingSelectService } from './card-shipping-select.service';

describe('CardShippingSelectService', () => {
  let service: CardShippingSelectService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(CardShippingSelectService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
