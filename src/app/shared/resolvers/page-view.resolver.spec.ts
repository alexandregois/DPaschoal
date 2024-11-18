import { TestBed } from '@angular/core/testing';

import { PageviewResolver } from './page-view.resolver';

describe('PageviewResolver', () => {
  let resolver: PageviewResolver;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    resolver = TestBed.inject(PageviewResolver);
  });

  it('should be created', () => {
    expect(resolver).toBeTruthy();
  });
});
