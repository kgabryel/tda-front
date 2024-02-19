import {TestBed} from '@angular/core/testing';

import {TaskPinnedService} from './task-pinned.service';

describe('TaskPinnedService', () => {
  let service: TaskPinnedService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TaskPinnedService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
