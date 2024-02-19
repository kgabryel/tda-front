import {TestBed} from '@angular/core/testing';

import {TasksSearchService} from './tasks-search.service';

describe('TasksSearchService', () => {
  let service: TasksSearchService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TasksSearchService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
