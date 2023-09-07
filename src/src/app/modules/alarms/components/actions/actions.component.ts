import {ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Alarm} from '../../../../core/models/alarm';
import {Store} from '@ngrx/store';
import {State} from '../../../../core/store/alarms/reducers';
import {Observable} from 'rxjs';
import {selectAlarm} from '../../../../core/store/alarms/selectors';

@Component({
  selector: 'alarms-actions',
  templateUrl: './actions.component.html',
  styleUrls: ['./actions.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ActionsComponent implements OnInit {

  @Input() public alarm: Alarm;
  @Input() public activeSection: number;
  public dataAlarm$: Observable<Alarm | undefined>;
  @Output() private showNotifications: EventEmitter<void>;
  @Output() private showAlarms: EventEmitter<void>;
  @Output() private showCatalogs: EventEmitter<void>;
  @Output() private delete: EventEmitter<void>;
  @Output() private showContent: EventEmitter<void>;
  private store: Store<State>;

  public constructor(store: Store<State>) {
    this.store = store;
    this.showAlarms = new EventEmitter<void>();
    this.showNotifications = new EventEmitter<void>();
    this.showCatalogs = new EventEmitter<void>();
    this.delete = new EventEmitter<void>();
    this.showContent = new EventEmitter<void>();
  }

  public ngOnInit(): void {
    let alarmId;
    if (this.alarm.periodic) {
      alarmId = this.alarm.id;
    } else if (this.alarm.group !== null) {
      alarmId = this.alarm.group;
    } else {
      alarmId = this.alarm.id;
    }
    this.dataAlarm$ = this.store.select(selectAlarm(alarmId));
  }

  public emitShowNotifications(): void {
    this.showNotifications.emit();
  }

  public emitShowAlarms(): void {
    this.showAlarms.emit();
  }

  public emitShowCatalogs(): void {
    this.showCatalogs.emit();
  }

  public emitDelete(): void {
    this.delete.emit();
  }

  public emitShowContent(): void {
    this.showContent.emit();
  }
}
