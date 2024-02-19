import {ChangeDetectionStrategy, Component, Input, OnInit} from '@angular/core';
import {Alarm, NotificationGroup} from '../../../../core/models/alarm';
import {Observable} from 'rxjs';
import {NotificationType} from '../../../../core/models/notification-type';
import {NotificationTypesContainer} from '../../../../core/containers/notification-types.container';
import {NotificationsConfig} from '../../../../config/notifications.config';
import {doubleToolbarBreakPoint} from '../../../../config/sizes.config';
import {filter, map} from 'rxjs/operators';
import {BreakpointObserver} from '@angular/cdk/layout';
import {IntervalUtils} from '../../../../core/utils/interval.utils';
import {DeleteSheetComponent} from '../../../shared/components/delete-sheet/delete-sheet.component';
import {notificationDelete} from '../../../../core/store/alarms/actions';
import {MatBottomSheet} from '@angular/material/bottom-sheet';
import {Store} from '@ngrx/store';
import {State} from '../../../../core/store/alarms/reducers';

@Component({
  selector: 'alarms-notification-group',
  templateUrl: './notification-group.component.html',
  styleUrls: ['./notification-group.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NotificationGroupComponent implements OnInit {

  @Input() public notification: NotificationGroup;
  @Input() public disableEmail: boolean;
  @Input() public alarm: Alarm;
  public smallNotification$: Observable<boolean>;
  public emailType: string;
  public withInterval: boolean;
  private notificationTypesContainer: NotificationTypesContainer;
  private breakpointObserver: BreakpointObserver;
  private sheet: MatBottomSheet;
  private store: Store<State>;

  public constructor(
    store: Store<State>,
    notificationTypesContainer: NotificationTypesContainer,
    breakpointObserver: BreakpointObserver,
    sheet: MatBottomSheet
  ) {
    this.store = store;
    this.notificationTypesContainer = notificationTypesContainer;
    this.breakpointObserver = breakpointObserver;
    this.emailType = NotificationsConfig.emailType;
    this.sheet = sheet;
  }

  public ngOnInit(): void {
    this.withInterval = IntervalUtils.showWithInterval(this.notification.behaviour);
    this.smallNotification$ = this.breakpointObserver.observe(doubleToolbarBreakPoint)
      .pipe(map(data => data.matches));
  }

  public getNotificationType(type: number | string): NotificationType {
    return this.notificationTypesContainer.getType(typeof type === 'number' ? type : parseInt(type));
  }

  public deleteNotification(): void {
    const sheetRef = this.sheet.open(
      DeleteSheetComponent,
      {data: this.alarm.notificationsGroups.length === 1 ? {infoMessage: 'form.info.deleteLastNotification'} : null}
    );
    sheetRef.afterDismissed()
      .pipe(filter(action => action))
      .subscribe(() => this.store.dispatch(notificationDelete({
        alarm: this.alarm,
        id: this.notification.id
      })));
  }
}
