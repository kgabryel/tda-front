import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {skip} from 'rxjs/operators';

@Injectable()
export class FormNotificationService {
  private notificationAdd: BehaviorSubject<void>;
  private notificationRemove: BehaviorSubject<number>;

  constructor() {
    this.notificationAdd = new BehaviorSubject<void>(null);
    this.notificationRemove = new BehaviorSubject<number>(null);
  }

  public addNotification(): void {
    this.notificationAdd.next();
  }

  removeNotification(index: number) {
    this.notificationRemove.next(index);
  }

  getAddState(): Observable<void> {
    return this.notificationAdd.asObservable().pipe(skip(1));
  }

  getRemoveState(): Observable<number> {
    return this.notificationRemove.asObservable().pipe(skip(1));
  }
}
