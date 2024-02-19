import {TestBed} from '@angular/core/testing';

import {NotificationTypesService} from './notification-types.service';

describe('NotificationTypesService', () => {
  let service: NotificationTypesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NotificationTypesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
