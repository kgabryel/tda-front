import {TestBed} from '@angular/core/testing';

import {AlarmCatalogsService} from './alarm-catalogs.service';

describe('AlarmCatalogsService', () => {
  let service: AlarmCatalogsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AlarmCatalogsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
