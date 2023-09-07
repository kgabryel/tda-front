import {TestBed} from '@angular/core/testing';

import {DownloadProgressService} from './download-progress.service';

describe('DownloadProgressService', () => {
  let service: DownloadProgressService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DownloadProgressService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
