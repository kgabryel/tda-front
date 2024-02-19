import {TestBed} from '@angular/core/testing';

import {NextNotificationService} from './next-notification.service';

describe('NextNotificationService', () => {
  let service: NextNotificationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NextNotificationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
