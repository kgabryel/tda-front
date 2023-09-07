import {TestBed} from '@angular/core/testing';

import {PaginationTranslationsService} from './pagination-translations.service';

describe('PaginationTranslationsService', () => {
  let service: PaginationTranslationsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PaginationTranslationsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
