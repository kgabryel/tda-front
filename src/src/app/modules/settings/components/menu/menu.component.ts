import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {Store} from '@ngrx/store';
import {State} from '../../../../core/store/settings/reducers';
import {Observable} from 'rxjs';
import {selectIsFbAccount} from '../../../../core/store/settings/selectors';

@Component({
  selector: 'settings-menu',
  templateUrl: './menu.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MenuComponent implements OnInit {

  public fbAccount$: Observable<boolean>;
  private store: Store<State>;

  public constructor(store: Store<State>) {
    this.store = store;
  }

  public ngOnInit(): void {
    this.fbAccount$ = this.store.select(selectIsFbAccount);
  }
}
