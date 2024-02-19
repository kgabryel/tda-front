import {ChangeDetectionStrategy, Component, Inject, Input, OnDestroy, OnInit} from '@angular/core';
import {FormArray, FormGroup} from '@angular/forms';
import {FormNotificationService} from '../../../../core/services/form-notification/form-notification.service';
import {singleAlarmErrors, SingleAlarmErrors} from '../../../../core/errors/alarms.error';
import {AlarmsFormNames, formNames} from '../../../../core/factories/alarm.factory';
import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';
import {selectEmailState} from '../../../../core/store/settings/selectors';
import {map, switchMap} from 'rxjs/operators';
import {selectTypes} from '../../../../core/store/notifications-types/selectors';
import {BehaviorSubject, Observable, Subject, Subscription} from 'rxjs';
import {Item} from '../../../../core/models/item';
import {Store} from '@ngrx/store';
import {State as TypesState} from '../../../../core/store/notifications-types/reducers';
import {State as SettingsState} from '../../../../core/store/settings/reducers';
import {NotificationsConfig} from '../../../../config/notifications.config';
import {ItemUtils} from '../../../../core/utils/item.utils';

@Component({
  selector: 'shared-single-notifications',
  templateUrl: './single-notifications.component.html',
  styleUrls: ['./single-notifications.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SingleNotificationsComponent implements OnInit, OnDestroy {

  public notifications$: BehaviorSubject<FormArray>;
  @Input() public parentForm: FormGroup;
  public errors: SingleAlarmErrors;
  public formNames: AlarmsFormNames;
  public types$: Observable<Item[]>;
  @Input() public reset$: Subject<void>;
  private notificationService: FormNotificationService;
  private subscriptions: Subscription[];
  private typesStore: Store<TypesState>;
  private settingsStore: Store<SettingsState>;

  public constructor(
    @Inject('singleFormNotificationService') notificationService: FormNotificationService,
    typesStore: Store<TypesState>,
    settingsStore: Store<SettingsState>
  ) {
    this.typesStore = typesStore;
    this.settingsStore = settingsStore;
    this.notificationService = notificationService;
    this.formNames = formNames;
    this.errors = singleAlarmErrors;
  }

  public ngOnInit(): void {
    this.types$ = this.settingsStore.select(selectEmailState)
      .pipe(switchMap(emailState => this.typesStore.select(selectTypes)
        .pipe(map(types => types.filter(type => emailState === 1 || type.name !== NotificationsConfig.emailType)
          .map(type => ItemUtils.notificationTypeToItem(type))))));
    this.notifications$ = new BehaviorSubject<FormArray>(this.parentForm.get(formNames.notificationsGroup) as FormArray);
    this.subscriptions = [
      this.parentForm.get(formNames.notificationsGroup).valueChanges
        .subscribe(() => this.notifications$.next(this.parentForm.get(formNames.notificationsGroup) as FormArray)),
      this.notifications$.getValue().valueChanges.subscribe((notifications) => {
        notifications.forEach((notification, key) => {
          let date = notification[formNames.notificationTime];
          if (date instanceof Date) {
            date.setSeconds(0);
            this.notifications$.getValue().controls[key].get(formNames.notificationTime).setValue(
              date,
              {emitEvent: false}
            );
          }
        });
      })
    ];
  }

  public addNotification(): void {
    this.notificationService.addNotification();
  }

  public removeNotification(index: number): void {
    this.notificationService.removeNotification(index);
  }

  public drop(event: CdkDragDrop<string[]>): void {
    moveItemInArray(this.notifications$.getValue().controls, event.previousIndex, event.currentIndex);
  }

  public ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }
}
