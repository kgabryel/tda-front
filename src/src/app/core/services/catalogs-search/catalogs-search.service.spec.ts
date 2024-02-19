import {TestBed} from '@angular/core/testing';

import {CatalogsSearchService} from './catalogs-search.service';

describe('CatalogsSearchService', () => {
  let service: CatalogsSearchService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CatalogsSearchService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
