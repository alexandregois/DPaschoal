import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { NotificacoesService } from './notificacoes.service';

describe('NotificacoesService', () => {
  let service: NotificacoesService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(NotificacoesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
