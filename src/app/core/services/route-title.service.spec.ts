import { TestBed } from '@angular/core/testing';

import { RouteTitleService } from './route-title.service';

describe('RouteTitleService', () => {
  let service: RouteTitleService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RouteTitleService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should SET and GET title', (done) => {
    const testTitle = 'new Title';
    service.set(testTitle);

    service.get().subscribe((title) => {
      expect(title).toBe(testTitle);
      done();
    });
  });

  it('should SET and GET undefined title', (done) => {
    const testTitle = undefined;
    service.set(testTitle);

    service.get().subscribe((title) => {
      expect(title).toBe(testTitle);
      done();
    });
  });
});
