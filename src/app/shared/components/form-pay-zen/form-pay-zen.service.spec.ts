import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { MatSnackBarModule } from '@angular/material/snack-bar';

import { FormPayZenService } from './form-pay-zen.service';

describe('FormPayZenService', () => {
  let service: FormPayZenService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, MatSnackBarModule],
    });
    service = TestBed.inject(FormPayZenService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
