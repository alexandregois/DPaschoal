import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { RouterTestingModule } from '@angular/router/testing';

import { EventsApiService } from './events-api.service';

describe('EventsApiService', () => {
  let service: EventsApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        HttpClientTestingModule,
        MatDialogModule,
        MatSnackBarModule,
      ],
    });
    service = TestBed.inject(EventsApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
