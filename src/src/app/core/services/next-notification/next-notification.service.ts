import {Injectable} from '@angular/core';
import {Alarm, Notification} from '../../models/alarm';
import {Store} from '@ngrx/store';
import {State as AlarmsState} from '../../store/alarms/reducers';
import {selectAlarmsForGroup} from '../../store/alarms/selectors';

export interface NotificationData {
  name: string;
  alarmId: string;
  time: Date;
}

@Injectable()
export class NextNotificationService {
  private nextAlarm: NotificationData | null;
  private readonly alarms: Alarm[];
  private readonly now: Date;
  private alarmsStore: Store<AlarmsState>;

  constructor(alarms: Alarm[], alarmsStore: Store<AlarmsState>) {
    this.alarmsStore = alarmsStore;
    this.nextAlarm = null;
    this.alarms = alarms;
    this.now = new Date();
  }

  public find(): void {
    this.alarms.forEach((alarm: Alarm) => {
      if (alarm.periodic) {
        this.searchPeriodic(alarm);
      } else {
        this.searchSingle(alarm);
      }
    });
  }

  public get(): NotificationData | null {
    return this.nextAlarm;
  }

  private searchSingle(alarm: Alarm): void {
    if (alarm.checked) {
      return;
    }
    alarm.notifications.forEach((notification: Notification) => {
      if (notification.checked) {
        return;
      }
      if (notification.time === null) {
        return;
      }
      const notificationDate: Date = new Date(notification.time);
      if (notificationDate.getTime() <= this.now.getTime()) {
        return;
      }
      if (this.nextAlarm === null) {
        this.nextAlarm = {
          name: alarm.name,
          alarmId: alarm.id,
          time: notificationDate
        };
      } else {
        if (notificationDate.getTime() < this.nextAlarm.time.getTime()) {
          this.nextAlarm = {
            name: alarm.name,
            alarmId: alarm.id,
            time: notificationDate
          };
        }
      }
    });
  }

  private searchPeriodic(alarm: Alarm): void {
    this.alarmsStore.select(selectAlarmsForGroup(alarm.id, {checked: null, start: null, stop: null}))
      .subscribe(alarms => alarms.forEach((alarm: Alarm) => this.searchSingle(alarm)));
  }
}
