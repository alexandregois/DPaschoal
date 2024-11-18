import { TestBed } from '@angular/core/testing';

import { NotFoundResolver } from './not-found.resolver';

describe('NotFoundResolver', () => {
  let resolver: NotFoundResolver;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    resolver = TestBed.inject(NotFoundResolver);
  });

  it('should be created', () => {
    expect(resolver).toBeTruthy();
  });
});
