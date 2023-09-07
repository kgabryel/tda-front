import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {environment} from '../../../../environments/environment';

@Injectable()
export class LangService {
  private lang: BehaviorSubject<string>;

  constructor() {
    this.lang = new BehaviorSubject<string>(localStorage.getItem('lang') ?? environment.lang);
  }

  public changeLang(lang: string): void {
    this.lang.next(lang);
  }

  public getState(): Observable<string> {
    return this.lang.asObservable();
  }
}
