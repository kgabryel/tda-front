import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {HttpHeaderResponse, HttpProgressEvent, HttpResponse, HttpSentEvent, HttpUserEvent} from '@angular/common/http';
import {File} from '../../models/file';

export type UploadEvent =
  HttpSentEvent
  | HttpHeaderResponse
  | HttpResponse<File>
  | HttpProgressEvent
  | HttpUserEvent<File>;

@Injectable()
export class UploadFileService {
  private uploadStatus: BehaviorSubject<UploadEvent>;

  constructor() {
    this.uploadStatus = new BehaviorSubject<UploadEvent>({type: 0});
  }

  changeStatus(data: UploadEvent) {
    this.uploadStatus.next(data);
  }

  getState(): Observable<UploadEvent> {
    return this.uploadStatus.asObservable();
  }
}
