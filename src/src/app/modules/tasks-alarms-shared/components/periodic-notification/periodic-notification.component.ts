import {ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {Observable, Subject} from 'rxjs';
import {Item} from '../../../../core/models/item';
import {selectEmailState} from '../../../../core/store/settings/selectors';
import {filter, map, startWith, switchMap} from 'rxjs/operators';
import {selectTypes} from '../../../../core/store/notifications-types/selectors';
import {NotificationsConfig} from '../../../../config/notifications.config';
import {ItemUtils} from '../../../../core/utils/item.utils';
import {Store} from '@ngrx/store';
import {State as TypesState} from '../../../../core/store/notifications-types/reducers';
import {State as SettingsState} from '../../../../core/store/settings/reducers';
import {AlarmsFormNames, formNames} from '../../../../core/factories/alarm.factory';
import {intervalNotificationTypes, intervalValues, labels, Type} from '../../../../config/interval-types.config';
import {periodicAlarmErrors, PeriodicAlarmErrors} from '../../../../core/errors/alarms.error';

@Component({
  selector: 'shared-periodic-notification',
  templateUrl: './periodic-notification.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PeriodicNotificationComponent implements OnInit {

  @Input() public formGroup: FormGroup;
  @Input() public removeDisabled: boolean;
  @Input() public reset$: Subject<void>;
  public types$: Observable<Item[]>;
  public formNames: AlarmsFormNames;
  public types: Type[];
  public errors: PeriodicAlarmErrors;
  public maxInterval$: Observable<number>;
  public intervalHidden$: Observable<boolean>;
  public intervalLabel$: Observable<string>;
  public labels: Map<string, string>;
  @Output() private remove: EventEmitter<void>;
  private intervalValues: Map<string, number>;
  private typesStore: Store<TypesState>;
  private settingsStore: Store<SettingsState>;

  public constructor(typesStore: Store<TypesState>, settingsStore: Store<SettingsState>) {
    this.typesStore = typesStore;
    this.settingsStore = settingsStore;
    this.remove = new EventEmitter<void>();
    this.formNames = formNames;
    this.types = intervalNotificationTypes;
    this.errors = periodicAlarmErrors;
    this.intervalValues = intervalValues;
    this.labels = labels;
  }

  public ngOnInit(): void {
    this.types$ = this.settingsStore.select(selectEmailState)
      .pipe(switchMap(emailState => this.typesStore.select(selectTypes)
        .pipe(map(types => types.filter(type => emailState === 1 || type.name !== NotificationsConfig.emailType)
          .map(type => ItemUtils.notificationTypeToItem(type))))));
    this.formGroup.get(this.formNames.notificationType).valueChanges.pipe(
      filter(value => value === '-1' || value === '0' || value === '1')
    )
      .subscribe(() => this.formGroup.get(this.formNames.interval).setValue(1));
    this.maxInterval$ = this.formGroup.get(this.formNames.notificationType).valueChanges.pipe(
      startWith('0'),
      map(value => this.intervalValues.get(value) ?? 1)
    );
    this.maxInterval$.pipe(
      filter(maxInterval => maxInterval < this.formGroup.get(this.formNames.interval).value)
    )
      .subscribe(maxInterval => this.formGroup.get(this.formNames.interval).setValue(maxInterval));
    this.intervalHidden$ = this.formGroup.get(this.formNames.notificationType).valueChanges.pipe(
      startWith(''),
      map(value => value === '-1' || value === '0' || value === '1' || value === '')
    );
    this.intervalLabel$ = this.formGroup.get(this.formNames.notificationType).valueChanges.pipe(
      startWith('0'),
      map(value => this.labels.get(value) ?? '')
    );
  }

  public removeGroup(): void {
    this.remove.emit();
  }
}
