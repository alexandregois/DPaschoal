import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { MaisEstoqueDialogService } from './mais-estoque-dialog.service';

describe('MaisEstoqueDialogService', () => {
  let service: MaisEstoqueDialogService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, HttpClientTestingModule],
    });
    service = TestBed.inject(MaisEstoqueDialogService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
