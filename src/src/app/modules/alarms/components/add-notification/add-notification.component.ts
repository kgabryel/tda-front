import {ChangeDetectionStrategy, Component, Input, OnDestroy, OnInit} from '@angular/core';
import {FormArray, FormGroup} from '@angular/forms';
import {AlarmsFormNames, formNames, NotificationFormFactory} from '../../../../core/factories/alarm.factory';
import {NotificationRequest} from '../../../../core/requests/alarms.request';
import {Store} from '@ngrx/store';
import {notificationAdd} from '../../../../core/store/alarms/actions';
import {State as AlarmsState} from '../../../../core/store/alarms/reducers';
import {State as TypesState} from '../../../../core/store/notifications-types/reducers';
import {State as SettingsState} from '../../../../core/store/settings/reducers';
import {Observable, Subject, Subscription} from 'rxjs';
import {Item} from '../../../../core/models/item';
import {selectTypes} from '../../../../core/store/notifications-types/selectors';
import {map, switchMap} from 'rxjs/operators';
import {selectEmailState} from '../../../../core/store/settings/selectors';
import {FormUtils} from '../../../../core/utils/form.utils';
import {NotificationsConfig} from '../../../../config/notifications.config';
import {singleAlarmErrors, SingleAlarmErrors} from '../../../../core/errors/alarms.error';
import {ItemUtils} from '../../../../core/utils/item.utils';

@Component({
  selector: 'alarms-add-notification',
  templateUrl: './add-notification.component.html',
  styleUrls: ['./add-notification.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AddNotificationComponent implements OnInit, OnDestroy {

  @Input() public alarmId: string;
  public form: FormGroup;
  public formNames: AlarmsFormNames;
  public types$: Observable<Item[]>;
  public reset$: Subject<void>;
  public errors: SingleAlarmErrors;
  private alarmsStore: Store<AlarmsState>;
  private subscription: Subscription;
  private typesStore: Store<TypesState>;
  private settingsStore: Store<SettingsState>;

  public constructor(
    alarmsStore: Store<AlarmsState>,
    typesStore: Store<TypesState>,
    settingsStore: Store<SettingsState>
  ) {
    this.errors = singleAlarmErrors;
    this.formNames = formNames;
    this.alarmsStore = alarmsStore;
    this.reset$ = new Subject<void>();
    this.typesStore = typesStore;
    this.settingsStore = settingsStore;
  }

  public ngOnInit(): void {
    this.form = NotificationFormFactory.getForm();
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
  }

  public submit(): void {
    this.form.markAllAsTouched();
    if (this.form.invalid) {
      return;
    }
    const notification: NotificationRequest = {
      date: this.form.get(this.formNames.notificationTime).value,
      notificationTypes: (this.form.get(formNames.typesGroup).get(formNames.items) as FormArray).controls
        .map(data => data.value)
    };
    this.alarmsStore.dispatch(notificationAdd({alarmId: this.alarmId, notification}));
    FormUtils.clearInputs(this.form, '', this.formNames.notificationTime);
    FormUtils.clearMultiSelect(this.form.get(formNames.typesGroup) as FormGroup);
    this.reset$.next();
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
