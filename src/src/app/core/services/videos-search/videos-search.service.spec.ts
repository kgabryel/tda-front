import {TestBed} from '@angular/core/testing';

import {VideosSearchService} from './videos-search.service';

describe('VideosSearchService', () => {
  let service: VideosSearchService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VideosSearchService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
