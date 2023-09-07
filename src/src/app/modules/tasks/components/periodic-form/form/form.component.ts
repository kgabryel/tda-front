import {ChangeDetectionStrategy, Component, Inject, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {FormArray, FormGroup} from '@angular/forms';
import {Observable, Subject, Subscription} from 'rxjs';
import {FormNotificationService} from '../../../../../core/services/form-notification/form-notification.service';
import {pairwise, startWith} from 'rxjs/operators';
import {formNames, PeriodicFormFactory, TasksFormNames} from '../../../../../core/factories/task.factory';
import {PeriodicTaskRequest} from '../../../../../core/requests/tasks.request';
import {TimeUtils} from '../../../../../core/utils/time.utils';
import {Store} from '@ngrx/store';
import {tasksPeriodicAdd} from '../../../../../core/store/tasks/actions';
import {State} from '../../../../../core/store/tasks/reducers';
import {PeriodicNotificationRequest} from '../../../../../core/requests/alarms.request';
import {FormUtils} from '../../../../../core/utils/form.utils';
import {MatStepper} from '@angular/material/stepper';
import * as moment from 'moment';
import {IntervalUtils} from '../../../../../core/utils/interval.utils';

@Component({
  selector: 'tasks-periodic-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FormComponent implements OnInit, OnDestroy {

  @ViewChild('stepper') stepper: MatStepper;
  public form: FormGroup;
  public reset$: Subject<void>;
  public formNames: TasksFormNames;
  public alarmShowed$: Observable<boolean>;
  private notifications: FormArray;
  private notificationService: FormNotificationService;
  private store: Store<State>;
  private subscriptions: Subscription[];

  public constructor(
    @Inject('periodicFormNotificationService') notificationService: FormNotificationService,
    store: Store<State>
  ) {
    this.notificationService = notificationService;
    this.store = store;
    this.reset$ = new Subject<void>();
    this.formNames = formNames;
  }

  private static mapNotification(type): PeriodicNotificationRequest {
    console.log(type);
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
    this.alarmShowed$ = this.form.get(formNames.alarmIncluded).valueChanges;
    this.subscriptions = [
      this.form.get(formNames.alarmIncluded).valueChanges.subscribe(showed => {
        this.form.get(formNames.alarmGroup).get(formNames.name).updateValueAndValidity();
        this.form.get(formNames.notificationsGroup).updateValueAndValidity();
        if (!showed) {
          if (this.stepper !== undefined && this.stepper._getFocusIndex() > 1) {
            this.stepper.reset();
          }
          FormUtils.clearInputs(this.form.get(formNames.alarmGroup) as FormGroup, '', formNames.name, formNames.content);
          (this.form.get(formNames.notificationsGroup) as FormArray).controls.forEach(notificationGroup => {
            FormUtils.clearInputs(notificationGroup as FormGroup, '', formNames.notificationTime);
            FormUtils.clearMultiSelect(notificationGroup.get(formNames.typesGroup) as FormGroup);
          });
        }
      }),
      this.notificationService.getAddState()
        .subscribe(() => this.notifications.push(PeriodicFormFactory.getNotificationPart())),

      this.notificationService.getRemoveState()
        .subscribe(index => this.notifications.removeAt(index)),

      this.form.get(formNames.taskGroup).get(formNames.name).valueChanges.pipe(startWith(''), pairwise())
        .subscribe(([previousValue, actualValue]) => {
          const nameValue = this.form.get(formNames.alarmGroup).get(formNames.name).value;
          if (nameValue === previousValue) {
            this.form.get(formNames.alarmGroup).get(formNames.name).setValue(actualValue);
          }
        }),

      this.form.get(formNames.taskGroup).get(formNames.content).valueChanges.pipe(startWith(''), pairwise())
        .subscribe(([previousValue, actualValue]) => {
          const contentValue = this.form.get(formNames.alarmGroup).get(formNames.content).value;
          if (contentValue === previousValue) {
            this.form.get(formNames.alarmGroup).get(formNames.content).setValue(actualValue);
          }
        })
    ];

  }

  public submit(redirect: boolean = true): void {
    this.form.markAllAsTouched();
    if (this.form.invalid) {
      return;
    }
    let stop = this.form.get(formNames.taskGroup).get(formNames.dates).get(formNames.stop).value;
    const task: PeriodicTaskRequest = {
      alarm: null,
      task: {
        name: this.form.get(formNames.taskGroup).get(formNames.name).value,
        content: this.form.get(formNames.taskGroup).get(formNames.content).value,
        start: moment(new Date(this.form.get(formNames.taskGroup).get(formNames.dates).get(formNames.start).value)).format('YYYY-MM-DD'),
        stop: stop === null ? null : moment(new Date(stop)).format('YYYY-MM-DD'),
        interval: this.form.get(formNames.taskGroup).get(formNames.interval).value,
        intervalType: this.form.get(formNames.taskGroup).get(formNames.intervalType).value,
        catalogs: FormUtils.mapPinned<number>(this.form.get(formNames.pinnedGroup) as FormGroup, formNames.catalogs),
        notes: FormUtils.mapPinned<number>(this.form.get(formNames.pinnedGroup) as FormGroup, formNames.notes),
        files: FormUtils.mapPinned<number>(this.form.get(formNames.pinnedGroup) as FormGroup, formNames.files),
        bookmarks: FormUtils.mapPinned<number>(this.form.get(formNames.pinnedGroup) as FormGroup, formNames.bookmarks),
        videos: FormUtils.mapPinned<number>(this.form.get(formNames.pinnedGroup) as FormGroup, formNames.videos)
      }
    };
    if (this.form.get(formNames.alarmIncluded).value) {
      task.alarm = {
        name: this.form.get(formNames.alarmGroup).get(formNames.name).value,
        content: this.form.get(formNames.alarmGroup).get(formNames.content).value,
        notifications: this.notifications.value.map(type => FormComponent.mapNotification(type)),
        catalogs: FormUtils.mapPinned<number>(this.form.get(formNames.alarmGroup) as FormGroup, formNames.catalogs)
      };
    }
    this.store.dispatch(tasksPeriodicAdd({task, redirect}));
    this.clearForm();
  }

  public ngOnDestroy(): void {
    this.subscriptions.forEach(subscribe => subscribe.unsubscribe());
  }

  private clearForm(): void {
    FormUtils.clearInputs(this.form, false, formNames.alarmIncluded);
    FormUtils.clearInputs(this.form.get(formNames.taskGroup) as FormGroup, '', formNames.name, formNames.content);
    FormUtils.clearInputs(this.form.get(formNames.taskGroup) as FormGroup, null, formNames.interval, formNames.intervalType);
    FormUtils.clearInputs(
      this.form.get(formNames.taskGroup).get(formNames.dates) as FormGroup,
      null,
      formNames.stop,
      formNames.start
    );
    FormUtils.clearMultiSelect(
      this.form.get(formNames.pinnedGroup).get(formNames.catalogs) as FormGroup,
      this.form.get(formNames.pinnedGroup).get(formNames.notes) as FormGroup,
      this.form.get(formNames.pinnedGroup).get(formNames.bookmarks) as FormGroup,
      this.form.get(formNames.pinnedGroup).get(formNames.files) as FormGroup,
      this.form.get(formNames.pinnedGroup).get(formNames.videos) as FormGroup
    );
    FormUtils.clearInputs(this.form.get(formNames.alarmGroup) as FormGroup, '', formNames.name, formNames.content);
    FormUtils.clearMultiSelect(this.form.get(formNames.alarmGroup).get(formNames.catalogs) as FormGroup);
    (this.form.get(formNames.notificationsGroup) as FormArray).clear();
    (this.form.get(formNames.notificationsGroup) as FormArray).push(PeriodicFormFactory.getNotificationPart());
    this.stepper.reset();
    this.reset$.next();
  }
}
