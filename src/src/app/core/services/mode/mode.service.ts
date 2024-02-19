import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';

@Injectable()
export class ModeService {
  private modeStatus: BehaviorSubject<boolean>;

  constructor() {
    this.modeStatus = new BehaviorSubject<boolean>(localStorage.getItem('mode') === 'dark');
  }

  public changeStatus(mode: string) {
    this.modeStatus.next(mode === 'dark');
    localStorage.setItem('mode', mode);
  }

  public getValue(): string {
    return this.modeStatus.value ? 'dark' : 'light';
  }

  public getState(): Observable<boolean> {
    return this.modeStatus.asObservable();
  }
}
