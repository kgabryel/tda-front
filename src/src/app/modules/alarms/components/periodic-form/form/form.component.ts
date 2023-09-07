import {ChangeDetectionStrategy, Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {FormArray, FormGroup} from '@angular/forms';
import {Observable, Subject, Subscription} from 'rxjs';
import {BreakpointObserver} from '@angular/cdk/layout';
import {formNames, PeriodicFormFactory} from '../../../../../core/factories/alarm.factory';
import {FormNotificationService} from '../../../../../core/services/form-notification/form-notification.service';
import {TimeUtils} from '../../../../../core/utils/time.utils';
import {PeriodicAlarmRequest, PeriodicNotificationRequest} from '../../../../../core/requests/alarms.request';
import {Store} from '@ngrx/store';
import {State} from '../../../../../core/store/alarms/reducers';
import {alarmsPeriodicAdd} from '../../../../../core/store/alarms/actions';
import {FormUtils} from '../../../../../core/utils/form.utils';
import * as moment from 'moment';
import {smallFormBreakPoint} from '../../../../../config/sizes.config';
import {map} from 'rxjs/operators';
import {IntervalUtils} from '../../../../../core/utils/interval.utils';

@Component({
  selector: 'alarms-periodic-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FormComponent implements OnInit, OnDestroy {

  public smallForm$: Observable<boolean>;
  public reset$: Subject<void>;
  public form: FormGroup;
  private breakpointObserver: BreakpointObserver;
  private formNotificationService: FormNotificationService;
  private notifications: FormArray;
  private store: Store<State>;
  private subscriptions: Subscription[];

  public constructor(
    @Inject('periodicFormNotificationService') formNotificationService: FormNotificationService,
    breakpointObserver: BreakpointObserver,
    store: Store<State>
  ) {
    this.breakpointObserver = breakpointObserver;
    this.formNotificationService = formNotificationService;
    this.store = store;
    this.reset$ = new Subject<void>();
  }

  private static mapNotification(type): PeriodicNotificationRequest {
    return {
      notificationTime: TimeUtils.modifyTime(type.notificationType, type.notificationTime, type.interval),
      notificationTypes: type.typesGroup.items,
      interval: type.interval,
      intervalBehaviour: IntervalUtils.mapToBehaviour(type.notificationType),
      time: type.notificationTime
    };
  }

  public ngOnInit(): void {
    this.form = PeriodicFormFactory.getForm();
    this.notifications = this.form.get(formNames.notificationsGroup) as FormArray;
    this.smallForm$ = this.breakpointObserver.observe(smallFormBreakPoint).pipe(map(data => data.matches));
    this.subscriptions = [
      this.formNotificationService.getRemoveState()
        .subscribe(index => this.notifications.removeAt(index)),
      this.formNotificationService.getAddState()
        .subscribe(() => this.notifications.push(PeriodicFormFactory.getNotificationPart()))
    ];
  }

  public submit(redirect: boolean = true): void {
    this.form.markAllAsTouched();
    if (this.form.invalid) {
      return;
    }
    let stop = this.form.get(formNames.mainGroup).get(formNames.stop).value;
    const alarm: PeriodicAlarmRequest = {
      name: this.form.get(formNames.mainGroup).get(formNames.name).value,
      content: this.form.get(formNames.contentGroup).get(formNames.content).value,
      notifications: this.notifications.value.map(type => FormComponent.mapNotification(type)),
      start: moment(new Date(this.form.get(formNames.mainGroup).get(formNames.start).value)).format('YYYY-MM-DD'),
      stop: stop === null ? null : moment(new Date(stop)).format('YYYY-MM-DD'),
      interval: this.form.get(formNames.mainGroup).get(formNames.interval).value,
      intervalType: this.form.get(formNames.mainGroup).get(formNames.intervalType).value,
      catalogs: FormUtils.mapPinned<number>(this.form.get(formNames.mainGroup) as FormGroup, formNames.catalogs)
    };
    this.store.dispatch(alarmsPeriodicAdd({alarm, redirect}));
    this.clearForm();
  }

  public ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  private clearForm(): void {
    FormUtils.clearInputs(this.form.get(formNames.mainGroup) as FormGroup, '', formNames.name, formNames.intervalType);
    FormUtils.clearInputs(this.form.get(formNames.mainGroup) as FormGroup, 1, formNames.interval);
    FormUtils.clearInputs(this.form.get(formNames.mainGroup) as FormGroup, null, formNames.stop, formNames.start);
    FormUtils.clearInputs(this.form.get(formNames.contentGroup) as FormGroup, '', formNames.content);
    FormUtils.clearMultiSelect(this.form.get(formNames.mainGroup).get(formNames.catalogs) as FormGroup);
    (this.form.get(formNames.notificationsGroup) as FormArray).clear();
    (this.form.get(formNames.notificationsGroup) as FormArray).push(PeriodicFormFactory.getNotificationPart());
    this.reset$.next();
  }
}
