import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';

export interface AlarmCatalogs {
  open: boolean,
  alarmId: string
}

@Injectable()
export class AlarmCatalogsService {

  private sidenavStatus: BehaviorSubject<AlarmCatalogs>;

  constructor() {
    this.sidenavStatus = new BehaviorSubject<AlarmCatalogs>({
      open: false,
      alarmId: ''
    });
  }

  changeStatus(data: AlarmCatalogs) {
    this.sidenavStatus.next(data);
  }

  getState(): Observable<AlarmCatalogs> {
    return this.sidenavStatus.asObservable();
  }
}
