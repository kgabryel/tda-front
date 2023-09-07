import {TestBed} from '@angular/core/testing';

import {AlarmsSearchService} from './alarms-search.service';

describe('AlarmsSearchService', () => {
  let service: AlarmsSearchService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AlarmsSearchService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
