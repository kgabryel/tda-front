import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';

export enum Type {
  empty,
  catalogs,
  tasks
}

export interface Items {
  open: boolean,
  tasks: string[];
  catalogs: number[];
  type: Type
}

@Injectable()
export class PinnedSidenavService {
  private sidenavStatus: BehaviorSubject<Items>;

  constructor() {
    this.sidenavStatus = new BehaviorSubject<Items>({
      open: false,
      tasks: [],
      catalogs: [],
      type: Type.empty
    });
  }

  changeStatus(data: Items) {
    this.sidenavStatus.next(data);
  }

  getState(): Observable<Items> {
    return this.sidenavStatus.asObservable();
  }
}
