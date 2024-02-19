import {TestBed} from '@angular/core/testing';

import {PinnedSidenavService} from './pinned-sidenav.service';

describe('PinnedSidenavService', () => {
  let service: PinnedSidenavService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PinnedSidenavService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
