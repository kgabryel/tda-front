import {TestBed} from '@angular/core/testing';

import {NotesSearchService} from './notes-search.service';

describe('NotesSearchService', () => {
  let service: NotesSearchService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NotesSearchService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
