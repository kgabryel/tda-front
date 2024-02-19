import {ChangeDetectionStrategy, Component, EventEmitter, OnDestroy, OnInit, Output} from '@angular/core';
import {Store} from '@ngrx/store';
import {NotificationTimeWrapper, TimeUtils} from '../../../../core/utils/time.utils';
import {
  NextNotificationService,
  NotificationData
} from '../../../../core/services/next-notification/next-notification.service';
import {State} from '../../../../core/store/alarms/reducers';
import {selectAlarms} from '../../../../core/store/alarms/selectors';
import {Subscription} from 'rxjs';

@Component({
  selector: 'header-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default
})
export class NotificationComponent implements OnInit, OnDestroy {

  public notification: NotificationData | null;
  public time: NotificationTimeWrapper;
  @Output() private isEmpty: EventEmitter<boolean>;
  private readonly store: Store<State>;
  private subscription: Subscription;

  public constructor(store: Store<State>) {
    this.store = store;
    this.isEmpty = new EventEmitter<boolean>();
  }

  public ngOnInit(): void {
    this.notification = null;
    this.subscription = this.store.select(selectAlarms).subscribe(alarms => {
      const service: NextNotificationService = new NextNotificationService(alarms, this.store);
      service.find();
      this.notification = service.get();
      if (this.notification !== null) {
        this.time = TimeUtils.modifyDate(this.notification);
      }
      this.isEmpty.emit(this.notification === null);
    });
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
