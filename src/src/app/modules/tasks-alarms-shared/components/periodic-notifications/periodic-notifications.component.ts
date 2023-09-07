import {ChangeDetectionStrategy, Component, Inject, Input, OnDestroy, OnInit} from '@angular/core';
import {FormArray, FormGroup} from '@angular/forms';
import {FormNotificationService} from '../../../../core/services/form-notification/form-notification.service';
import {AlarmsFormNames, formNames} from '../../../../core/factories/alarm.factory';
import {intervalNotificationTypes, Type} from '../../../../config/interval-types.config';
import {periodicAlarmErrors, PeriodicAlarmErrors} from '../../../../core/errors/alarms.error';
import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';
import {BehaviorSubject, Observable, Subject, Subscription} from 'rxjs';
import {Item} from '../../../../core/models/item';
import {selectEmailState} from '../../../../core/store/settings/selectors';
import {map, switchMap} from 'rxjs/operators';
import {selectTypes} from '../../../../core/store/notifications-types/selectors';
import {Store} from '@ngrx/store';
import {State as TypesState} from '../../../../core/store/notifications-types/reducers';
import {State as SettingsState} from '../../../../core/store/settings/reducers';
import {NotificationsConfig} from '../../../../config/notifications.config';
import {ItemUtils} from '../../../../core/utils/item.utils';

@Component({
  selector: 'shared-periodic-notifications',
  templateUrl: './periodic-notifications.component.html',
  styleUrls: ['./periodic-notifications.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PeriodicNotificationsComponent implements OnInit, OnDestroy {

  @Input() public parentForm: FormGroup;
  public notifications$: BehaviorSubject<FormArray>;
  public formNames: AlarmsFormNames;
  public types: Type[];
  public errors: PeriodicAlarmErrors;
  @Input() public reset$: Subject<void>;
  public types$: Observable<Item[]>;
  private notificationService: FormNotificationService;
  private typesStore: Store<TypesState>;
  private settingsStore: Store<SettingsState>;
  private subscription: Subscription;

  public constructor(
    @Inject('periodicFormNotificationService') notificationService: FormNotificationService,
    typesStore: Store<TypesState>,
    settingsStore: Store<SettingsState>
  ) {
    this.typesStore = typesStore;
    this.settingsStore = settingsStore;
    this.notificationService = notificationService;
    this.errors = periodicAlarmErrors;
  }

  public ngOnInit(): void {
    this.types$ = this.settingsStore.select(selectEmailState)
      .pipe(switchMap(emailState => this.typesStore.select(selectTypes)
        .pipe(map(types => types.filter(type => emailState === 1 || type.name !== NotificationsConfig.emailType)
          .map(type => ItemUtils.notificationTypeToItem(type))))));
    this.notifications$ = new BehaviorSubject<FormArray>(this.parentForm.get(formNames.notificationsGroup) as FormArray);
    this.formNames = formNames;
    this.types = intervalNotificationTypes;
    this.subscription = this.parentForm.get(formNames.notificationsGroup).valueChanges
      .subscribe(() => this.notifications$.next(this.parentForm.get(formNames.notificationsGroup) as FormArray));
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
    this.subscription.unsubscribe();
  }
}
