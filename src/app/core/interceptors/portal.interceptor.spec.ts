import { TestBed } from '@angular/core/testing';

import { PortalInterceptor } from './portal.interceptor';

describe('PortalInterceptor', () => {
  beforeEach(() =>
    TestBed.configureTestingModule({
      providers: [PortalInterceptor],
    })
  );

  it('should be created', () => {
    const interceptor: PortalInterceptor = TestBed.inject(PortalInterceptor);
    expect(interceptor).toBeTruthy();
  });
});
