import {ChangeDetectionStrategy, Component, Input, OnDestroy, OnInit} from '@angular/core';
import {FormArray, FormGroup} from '@angular/forms';
import {AlarmsFormNames, formNames, PeriodicFormFactory} from '../../../../core/factories/alarm.factory';
import {Observable, Subject, Subscription} from 'rxjs';
import {Item} from '../../../../core/models/item';
import {PeriodicAlarmErrors, periodicAlarmErrors} from '../../../../core/errors/alarms.error';
import {Store} from '@ngrx/store';
import {State as AlarmsState} from '../../../../core/store/alarms/reducers';
import {State as TypesState} from '../../../../core/store/notifications-types/reducers';
import {State as SettingsState} from '../../../../core/store/settings/reducers';
import {selectEmailState} from '../../../../core/store/settings/selectors';
import {filter, map, startWith, switchMap} from 'rxjs/operators';
import {selectTypes} from '../../../../core/store/notifications-types/selectors';
import {NotificationsConfig} from '../../../../config/notifications.config';
import {ItemUtils} from '../../../../core/utils/item.utils';
import {PeriodicNotificationRequest} from '../../../../core/requests/alarms.request';
import {notificationGroupAdd} from '../../../../core/store/alarms/actions';
import {FormUtils} from '../../../../core/utils/form.utils';
import {intervalNotificationTypes, intervalValues, labels, Type} from '../../../../config/interval-types.config';
import {TimeUtils} from '../../../../core/utils/time.utils';
import {IntervalUtils} from '../../../../core/utils/interval.utils';

@Component({
  selector: 'alarms-add-notification-group',
  templateUrl: './add-notification-group.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AddNotificationGroupComponent implements OnInit, OnDestroy {

  @Input() public alarmId: string;
  public form: FormGroup;
  public formNames: AlarmsFormNames;
  public types$: Observable<Item[]>;
  public reset$: Subject<void>;
  public errors: PeriodicAlarmErrors;
  public types: Type[];
  public labels: Map<string, string>;
  public intervalHidden$: Observable<boolean>;
  public intervalLabel$: Observable<string>;
  public maxInterval$: Observable<number>;
  private alarmsStore: Store<AlarmsState>;
  private subscription: Subscription;
  private typesStore: Store<TypesState>;
  private settingsStore: Store<SettingsState>;
  private intervalValues: Map<string, number>;

  public constructor(
    alarmsStore: Store<AlarmsState>,
    typesStore: Store<TypesState>,
    settingsStore: Store<SettingsState>
  ) {
    this.errors = periodicAlarmErrors;
    this.formNames = formNames;
    this.alarmsStore = alarmsStore;
    this.reset$ = new Subject<void>();
    this.typesStore = typesStore;
    this.settingsStore = settingsStore;
    this.types = intervalNotificationTypes;
    this.intervalValues = intervalValues;
    this.labels = labels;
  }

  public ngOnInit(): void {
    this.form = PeriodicFormFactory.getNotificationPart();
    this.types$ = this.settingsStore.select(selectEmailState)
      .pipe(switchMap((emailState) => this.typesStore.select(selectTypes)
        .pipe(map(types => types.filter(type => emailState === 1 || type.name !== NotificationsConfig.emailType)
          .map(type => ItemUtils.notificationTypeToItem(type))))));
    this.subscription = this.form.get(formNames.notificationTime).valueChanges.subscribe((date: Date) => {
      if (typeof date !== 'string') {
        date.setSeconds(0);
      }
      this.form.get(formNames.notificationTime).setValue(date, {emitEvent: false});
    });
    this.intervalHidden$ = this.form.get(this.formNames.notificationType).valueChanges.pipe(
      startWith(''),
      map(value => value === '-1' || value === '0' || value === '1' || value === '')
    );
    this.intervalLabel$ = this.form.get(this.formNames.notificationType).valueChanges.pipe(
      startWith('0'),
      map(value => this.labels.get(value) ?? '')
    );
    this.maxInterval$ = this.form.get(this.formNames.notificationType).valueChanges.pipe(
      startWith('0'),
      map(value => this.intervalValues.get(value) ?? 1)
    );
    this.maxInterval$.pipe(
      filter(maxInterval => maxInterval < this.form.get(this.formNames.interval).value)
    )
      .subscribe(maxInterval => this.form.get(this.formNames.interval).setValue(maxInterval));
  }

  public submit(): void {
    this.form.markAllAsTouched();
    if (this.form.invalid) {
      return;
    }
    const intervalType = this.form.get(formNames.notificationType).value;
    const interval = this.form.get(formNames.interval).value;
    const notification: PeriodicNotificationRequest = {
      notificationTime: TimeUtils.modifyTime(intervalType, this.form.get(formNames.notificationTime).value, interval),
      notificationTypes: (this.form.get(formNames.typesGroup).get(formNames.items) as FormArray).controls
        .map(data => data.value),
      intervalBehaviour: IntervalUtils.mapToBehaviour(intervalType),
      interval: interval,
      time: this.form.get(formNames.notificationTime).value
    };
    this.alarmsStore.dispatch(notificationGroupAdd({alarmId: this.alarmId, notification}));

    FormUtils.clearInputs(this.form, '', this.formNames.notificationTime, this.formNames.notificationType);
    FormUtils.clearInputs(this.form, 1, this.formNames.interval);
    FormUtils.clearMultiSelect(this.form.get(formNames.typesGroup) as FormGroup);
    this.reset$.next();
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
