import {ChangeDetectionStrategy, Component, Input, OnInit} from '@angular/core';
import {Alarm, Notification} from '../../../../core/models/alarm';
import {Store} from '@ngrx/store';
import {State} from '../../../../core/store/alarms/reducers';
import {notificationCheck, notificationDelete, notificationUncheck} from '../../../../core/store/alarms/actions';
import {Observable} from 'rxjs';
import {b1, doubleToolbarBreakPoint} from '../../../../config/sizes.config';
import {filter, map} from 'rxjs/operators';
import {BreakpointObserver} from '@angular/cdk/layout';
import {DeleteSheetComponent} from '../../../shared/components/delete-sheet/delete-sheet.component';
import {NotificationType} from '../../../../core/models/notification-type';
import {NotificationTypesContainer} from '../../../../core/containers/notification-types.container';
import {MatBottomSheet} from '@angular/material/bottom-sheet';
import {NotificationsConfig} from '../../../../config/notifications.config';

@Component({
  selector: 'alarms-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NotificationComponent implements OnInit {

  @Input() public notification: Notification;
  @Input() public alarm: Alarm;
  @Input() public time: Date | number | string;
  public smallNotification$: Observable<boolean>;
  @Input() public disableEmail: boolean;
  public small$: Observable<boolean>;
  public emailType: string;
  private store: Store<State>;
  private breakpointObserver: BreakpointObserver;
  private notificationTypesContainer: NotificationTypesContainer;
  private sheet: MatBottomSheet;

  public constructor(
    store: Store<State>,
    breakpointObserver: BreakpointObserver,
    notificationTypesContainer: NotificationTypesContainer,
    sheet: MatBottomSheet
  ) {
    this.store = store;
    this.breakpointObserver = breakpointObserver;
    this.notificationTypesContainer = notificationTypesContainer;
    this.sheet = sheet;
    this.emailType = NotificationsConfig.emailType;
  }

  public ngOnInit(): void {
    this.small$ = this.breakpointObserver.observe(b1).pipe(map(data => data.matches));
    this.smallNotification$ = this.breakpointObserver.observe(doubleToolbarBreakPoint)
      .pipe(map(data => data.matches));
  }

  public switchNotification(): void {
    if (this.alarm.periodic) {
      return;
    }
    if (this.notification.checked) {
      this.store.dispatch(notificationUncheck({id: this.notification.id}));
    } else {
      this.store.dispatch(notificationCheck({id: this.notification.id}));
    }
  }

  public getNotificationType(type: number | string): NotificationType {
    return this.notificationTypesContainer.getType(typeof type === 'number' ? type : parseInt(type));
  }

  public deleteNotification(): void {
    const sheetRef = this.sheet.open(
      DeleteSheetComponent,
      {data: this.alarm.notifications.length === 1 ? {infoMessage: 'form.info.deleteLastNotification'} : null}
    );
    sheetRef.afterDismissed()
      .pipe(filter(action => action))
      .subscribe(() => this.store.dispatch(notificationDelete({
        alarm: this.alarm,
        id: this.notification.id
      })));
  }
}
