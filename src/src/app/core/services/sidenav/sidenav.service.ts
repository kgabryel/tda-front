import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';

export interface Wrapper<T> {
  open: boolean,
  model: T | null
}

@Injectable()
export class SidenavService<T> {
  private sidenavStatus: BehaviorSubject<Wrapper<T>>;

  constructor() {
    this.sidenavStatus = new BehaviorSubject<Wrapper<T>>({
      open: false,
      model: null
    });
  }

  changeStatus(data: Wrapper<T>) {
    this.sidenavStatus.next(data);
  }

  getState(): Observable<Wrapper<T>> {
    return this.sidenavStatus.asObservable();
  }
}
