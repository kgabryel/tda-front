import {ChangeDetectionStrategy, Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {EventsService} from '../../../../core/services/events/events.service';
import {NotificationService} from '../../../../core/services/notification/notification.service';
import {ModeService} from '../../../../core/services/mode/mode.service';
import {DOCUMENT} from '@angular/common';
import {Subscription} from 'rxjs';
import {PushNotificationService} from '../../../../core/services/push-notification/push-notification.service';

@Component({
  selector: 'main-main',
  templateUrl: './main.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MainComponent implements OnInit, OnDestroy {

  private document: Document;
  private subscription: Subscription;
  private modeService: ModeService;
  private eventsService: EventsService;
  private notificationService: NotificationService;
  private pushNotificationService: PushNotificationService;

  public constructor(
    eventsService: EventsService,
    notificationService: NotificationService,
    modeService: ModeService,
    @Inject(DOCUMENT) document: Document,
    pushNotificationService: PushNotificationService
  ) {
    this.document = document;
    this.modeService = modeService;
    this.eventsService = eventsService;
    this.notificationService = notificationService;
    this.pushNotificationService = pushNotificationService;
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
    this.document.body.classList.remove('dark-mode');
  }

  public ngOnInit(): void {
    this.subscription = this.modeService.getState().subscribe(darkMode => {
      if (darkMode) {
        this.document.body.classList.add('dark-mode');
      } else {
        this.document.body.classList.remove('dark-mode');
      }
    });
    this.eventsService.subscribeNotifications(
      data => this.notificationService.showNotification(data.notificationData.name, data.notificationData.content)
    );
    this.pushNotificationService.subscribe();
  }
}
