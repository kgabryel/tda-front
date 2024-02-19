import {ChangeDetectionStrategy, Component, Inject, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Observable, Subject, Subscription} from 'rxjs';
import {FormArray, FormGroup} from '@angular/forms';
import {pairwise, startWith} from 'rxjs/operators';
import {FormNotificationService} from '../../../../../core/services/form-notification/form-notification.service';
import {formNames, SingleFormFactory, TasksFormNames} from '../../../../../core/factories/task.factory';
import {SingleTaskRequest} from '../../../../../core/requests/tasks.request';
import {Store} from '@ngrx/store';
import {State} from '../../../../../core/store/tasks/reducers';
import {tasksSingleAdd} from '../../../../../core/store/tasks/actions';
import * as moment from 'moment';
import {NotificationRequest} from '../../../../../core/requests/alarms.request';
import {FormUtils} from '../../../../../core/utils/form.utils';
import {MatStepper} from '@angular/material/stepper';

@Component({
  selector: 'tasks-single-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FormComponent implements OnInit, OnDestroy {

  @ViewChild('stepper') stepper: MatStepper;
  public form: FormGroup;
  public formNames: TasksFormNames;
  public alarmKey: string;
  public reset$: Subject<void>;
  public alarmShowed$: Observable<boolean>;
  public mainTask$: Observable<boolean>;
  private notifications: FormArray;
  private notificationService: FormNotificationService;
  private store: Store<State>;
  private subscriptions: Subscription[];

  public constructor(
    @Inject('singleFormNotificationService') notificationService: FormNotificationService,
    store: Store<State>
  ) {
    this.formNames = formNames;
    this.notificationService = notificationService;
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
    this.mainTask$ = this.form.get(formNames.mainTask).valueChanges.pipe(startWith(true));
    this.alarmShowed$ = this.form.get(formNames.alarmIncluded).valueChanges.pipe(startWith(false));
    this.subscriptions = [
      this.mainTask$.subscribe(value => {
          this.form.get(formNames.taskGroup).get(formNames.item).updateValueAndValidity();
          if (value) {
            this.form.get(formNames.taskGroup).get(formNames.item).markAsUntouched();
            this.form.get(formNames.taskGroup).get(formNames.item).setErrors(null);
            this.form.get(formNames.taskGroup).get(formNames.search).markAsUntouched();
            this.form.get(formNames.taskGroup).get(formNames.search).setErrors(null);
          }
        }
      ),
      this.form.valueChanges.subscribe(() => this.form.get(formNames.taskGroup).get(formNames.search)
        .setErrors(this.form.get(formNames.taskGroup).get(formNames.item).errors)),
      this.alarmShowed$.subscribe(showed => {
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
        .subscribe(() => this.notifications.push(SingleFormFactory.getNotificationPart())),
      this.notificationService.getRemoveState().subscribe(index =>
        this.notifications.removeAt(index)
      ),
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
    const task: SingleTaskRequest = {
      alarm: null,
      task: {
        name: this.form.get(formNames.taskGroup).get(formNames.name).value,
        content: this.form.get(formNames.taskGroup).get(formNames.content).value,
        date: this.form.get(formNames.taskGroup).get(formNames.date).value !== null ? moment(new Date(this.form.get(formNames.taskGroup).get(formNames.date).value)).format('YYYY-MM-DD') : null,
        mainTask: !this.form.get(formNames.mainTask).value ? this.form.get(formNames.taskGroup).get(formNames.item).value.value : null,
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
        notifications: this.form.get(formNames.notificationsGroup).value.map(type => FormComponent.mapNotification(type)),
        catalogs: FormUtils.mapPinned<number>(this.form.get(formNames.alarmGroup) as FormGroup, formNames.catalogs)
      };
    }
    this.store.dispatch(tasksSingleAdd({task, redirect}));
    this.clearForm();
  }

  public ngOnDestroy(): void {
    this.subscriptions.forEach(subscribe => subscribe.unsubscribe());
  }

  private clearForm(): void {
    FormUtils.clearInputs(this.form, true, formNames.mainTask);
    FormUtils.clearInputs(this.form, false, formNames.alarmIncluded);
    FormUtils.clearInputs(this.form.get(formNames.taskGroup) as FormGroup, null, formNames.item);
    FormUtils.clearInputs(
      this.form.get(formNames.taskGroup) as FormGroup,
      '',
      formNames.name,
      formNames.content,
      formNames.search
    );
    FormUtils.clearInputs(this.form.get(formNames.taskGroup) as FormGroup, null, formNames.date);
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
    (this.form.get(formNames.notificationsGroup) as FormArray).push(SingleFormFactory.getNotificationPart());
    this.stepper.reset();
    this.reset$.next();
  }
}
