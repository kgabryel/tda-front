import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';

export enum Type {
  empty,
  catalogs,
  notes,
  bookmarks,
  files,
  videos
}

export interface TaskPinned {
  open: boolean,
  taskId: string,
  type: Type
}

@Injectable()
export class TaskPinnedService {

  private sidenavStatus: BehaviorSubject<TaskPinned>;

  constructor() {
    this.sidenavStatus = new BehaviorSubject<TaskPinned>({
      open: false,
      taskId: '',
      type: Type.empty
    });
  }

  changeStatus(data: TaskPinned) {
    this.sidenavStatus.next(data);
  }

  getState(): Observable<TaskPinned> {
    return this.sidenavStatus.asObservable();
  }
}
