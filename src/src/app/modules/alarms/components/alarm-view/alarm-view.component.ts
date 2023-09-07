import {ChangeDetectionStrategy, Component, Input, OnInit} from '@angular/core';
import {Store} from '@ngrx/store';
import {State} from '../../../../core/store/alarms/reducers';
import {Observable} from 'rxjs';
import {Alarm} from '../../../../core/models/alarm';
import {selectAlarm} from '../../../../core/store/alarms/selectors';

@Component({
  selector: 'alarms-alarm-view',
  templateUrl: './alarm-view.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AlarmViewComponent implements OnInit {

  @Input() public id: string;
  public alarm$: Observable<Alarm>;
  private store: Store<State>;

  public constructor(store: Store<State>) {
    this.store = store;
  }

  public ngOnInit(): void {
    this.alarm$ = this.store.select(selectAlarm(this.id));
  }

}
