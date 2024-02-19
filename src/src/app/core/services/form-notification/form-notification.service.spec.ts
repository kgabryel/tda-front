import {TestBed} from '@angular/core/testing';

import {FormNotificationService} from './form-notification.service';

describe('FormNotificationService', () => {
  let service: FormNotificationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FormNotificationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
