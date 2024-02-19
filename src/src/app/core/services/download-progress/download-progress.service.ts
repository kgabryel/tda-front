import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';

export interface DownloadProgress {
  status: number;
  downloaded: number;
  total: number;
}

@Injectable()
export class DownloadProgressService {

  private readonly states: Map<number, BehaviorSubject<DownloadProgress>>;

  constructor() {
    this.states = new Map<number, BehaviorSubject<DownloadProgress>>();
  }

  public getState(id: number): BehaviorSubject<DownloadProgress> {
    if (!this.states.has(id)) {
      this.states.set(id, new BehaviorSubject<DownloadProgress>({
        status: -1,
        downloaded: 0,
        total: 0
      }));
    }
    return this.states.get(id);
  }
}
