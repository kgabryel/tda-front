import {TestBed} from '@angular/core/testing';

import {FilesSearchService} from './files-search.service';

describe('FilesSearchService', () => {
  let service: FilesSearchService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FilesSearchService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
