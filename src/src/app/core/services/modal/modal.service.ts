import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';

@Injectable()
export class ModalService {
  private modal: BehaviorSubject<boolean>;

  constructor() {
    this.modal = new BehaviorSubject<boolean>(false);
  }

  public openModal(): void {
    this.modal.next(true);
  }

  public getState(): Observable<boolean> {
    return this.modal.asObservable();
  }
}
