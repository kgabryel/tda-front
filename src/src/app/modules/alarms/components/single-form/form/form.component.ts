import {ChangeDetectionStrategy, Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {BreakpointObserver} from '@angular/cdk/layout';
import {Observable, Subject, Subscription} from 'rxjs';
import {FormNotificationService} from '../../../../../core/services/form-notification/form-notification.service';
import {formNames, SingleFormFactory} from '../../../../../core/factories/alarm.factory';
import {NotificationRequest, SingleAlarmRequest} from '../../../../../core/requests/alarms.request';
import {Store} from '@ngrx/store';
import {FormArray, FormGroup} from '@angular/forms';
import {State} from '../../../../../core/store/alarms/reducers';
import {alarmsSingleAdd} from '../../../../../core/store/alarms/actions';
import * as moment from 'moment';
import {FormUtils} from '../../../../../core/utils/form.utils';
import {smallFormBreakPoint} from '../../../../../config/sizes.config';
import {map} from 'rxjs/operators';

@Component({
  selector: 'alarms-single-form',
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
    @Inject('singleFormNotificationService') formNotificationService: FormNotificationService,
    breakpointObserver: BreakpointObserver,
    store: Store<State>
  ) {
    this.breakpointObserver = breakpointObserver;
    this.formNotificationService = formNotificationService;
    this.store = store;
    this.reset$ = new Subject<void>();
  }

  private static mapNotification(type): NotificationRequest {
    return {
      date: moment(type.notificationTime).format('YYYY-MM-DD HH:mm:ss'),
      notificationTypes: type.typesGroup.items
    };
  }

  public ngOnInit(): void {
    this.form = SingleFormFactory.getForm();
    this.notifications = this.form.get(formNames.notificationsGroup) as FormArray;
    this.smallForm$ = this.breakpointObserver.observe(smallFormBreakPoint).pipe(map(data => data.matches));
    this.subscriptions = [
      this.formNotificationService.getRemoveState()
        .subscribe(index => this.notifications.removeAt(index)),
      this.formNotificationService.getAddState()
        .subscribe(() => this.notifications.push(SingleFormFactory.getNotificationPart()))
    ];
  }

  public submit(redirect: boolean = true): void {
    this.form.markAllAsTouched();
    if (this.form.invalid) {
      return;
    }
    const alarm: SingleAlarmRequest = {
      name: this.form.get(formNames.mainGroup).get(formNames.name).value,
      content: this.form.get(formNames.mainGroup).get(formNames.content).value,
      notifications: this.notifications.value.map(type => FormComponent.mapNotification(type)),
      catalogs: FormUtils.mapPinned<number>(this.form.get(formNames.mainGroup) as FormGroup, formNames.catalogs)
    };
    this.store.dispatch(alarmsSingleAdd({alarm, redirect}));
    this.clearForm();
  }

  public ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  private clearForm(): void {
    FormUtils.clearInputs(this.form.get(formNames.mainGroup) as FormGroup, '', formNames.name, formNames.content);
    FormUtils.clearMultiSelect(this.form.get(formNames.mainGroup).get(formNames.catalogs) as FormGroup);
    (this.form.get(formNames.notificationsGroup) as FormArray).clear();
    (this.form.get(formNames.notificationsGroup) as FormArray).push(SingleFormFactory.getNotificationPart());
    this.reset$.next();
  }
}
