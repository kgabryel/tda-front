import {TestBed} from '@angular/core/testing';

import {BookmarksSearchService} from './bookmarks-search.service';

describe('BookmarksSearchService', () => {
  let service: BookmarksSearchService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BookmarksSearchService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
