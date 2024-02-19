import {ChangeDetectionStrategy, Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges} from '@angular/core';
import {Alarm, Notification} from '../../../../core/models/alarm';
import {Store} from '@ngrx/store';
import {State as AlarmsState} from '../../../../core/store/alarms/reducers';
import {State as TasksState} from '../../../../core/store/tasks/reducers';
import {State as SettingsState} from '../../../../core/store/settings/reducers';
import {Task} from '../../../../core/models/task';

import {
  alarmCheck,
  alarmSingleDelete,
  alarmsSingleContentUpdate,
  alarmsSingleNameUpdate,
  alarmsSingleTaskUpdate,
  alarmUncheck
} from '../../../../core/store/alarms/actions';
import {selectTask} from '../../../../core/store/tasks/selectors';
import {filter, first, map} from 'rxjs/operators';
import {BehaviorSubject, Observable, Subscription} from 'rxjs';
import {BreakpointObserver} from '@angular/cdk/layout';
import {Length} from '../../../../config/form.config';
import {MatBottomSheet} from '@angular/material/bottom-sheet';
import {TaskSheetComponent} from '../task-sheet/task-sheet.component';
import {DeleteSheetComponent} from '../../../shared/components/delete-sheet/delete-sheet.component';
import {selectEmailState, selectSettings} from '../../../../core/store/settings/selectors';
import {selectAlarm} from '../../../../core/store/alarms/selectors';
import {AlarmCatalogsService} from '../../../../core/services/alarm-catalogs/alarm-catalogs.service';
import {b1} from '../../../../config/sizes.config';

@Component({
  selector: 'alarms-alarm-single',
  templateUrl: './alarm-single.component.html',
  styleUrls: ['./alarm-single.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AlarmSingleComponent implements OnInit, OnDestroy, OnChanges {

  @Input() public alarm: Alarm;
  public step: number;
  public small$: Observable<boolean>;
  public maxNameLength: number;
  @Input() public previewAvailable: boolean = true;
  public disableEmail$: Observable<boolean>;
  public hideInactive: boolean;
  public notifications$: BehaviorSubject<Notification[]>;
  private alarmsStore: Store<AlarmsState>;
  private tasksStore: Store<TasksState>;
  private breakpointObserver: BreakpointObserver;
  private sheet: MatBottomSheet;
  private alarmCatalogsService: AlarmCatalogsService;
  private subscriptions: Subscription[];
  private task$: BehaviorSubject<Task | null>;
  private settingsStore: Store<SettingsState>;

  public constructor(
    alarmsStore: Store<AlarmsState>,
    tasksStore: Store<TasksState>,
    settingsStore: Store<SettingsState>,
    breakpointObserver: BreakpointObserver,
    sheet: MatBottomSheet,
    alarmCatalogsService: AlarmCatalogsService
  ) {
    this.alarmsStore = alarmsStore;
    this.tasksStore = tasksStore;
    this.breakpointObserver = breakpointObserver;
    this.maxNameLength = Length.maxAlarmNameLength;
    this.sheet = sheet;
    this.alarmCatalogsService = alarmCatalogsService;
    this.settingsStore = settingsStore;
    this.notifications$ = new BehaviorSubject<Notification[]>([]);
    this.task$ = new BehaviorSubject<Task | null>(null);
    this.subscriptions = [];
  }

  public ngOnInit(): void {
    this.disableEmail$ = this.settingsStore.select(selectEmailState).pipe(map(emailState => emailState !== 1));
    this.subscriptions.push(
      this.settingsStore.select(selectSettings('hideInactiveNotifications'))
        .subscribe(value => {
          this.hideInactive = value;
          this.refreshNotifications();
        })
    );
    this.refreshNotifications();
    this.small$ = this.breakpointObserver.observe(b1).pipe(map(data => data.matches));
  }

  public changeSection(section: number): void {
    this.step = this.step === section ? -1 : section;
  }

  public switchAlarm(): void {
    if (this.alarm.checked) {
      this.alarmsStore.dispatch(alarmUncheck({id: this.alarm.id}));
    } else {
      this.alarmsStore.dispatch(alarmCheck({id: this.alarm.id}));
    }
  }

  public deleteAlarm(): void {
    const sheetRef = this.sheet.open(DeleteSheetComponent);
    sheetRef.afterDismissed()
      .pipe(filter(action => action))
      .subscribe(() => this.alarmsStore.dispatch(alarmSingleDelete({id: this.alarm.id})));
  }

  public saveName(name: string): void {
    this.alarmsStore.dispatch(alarmsSingleNameUpdate({id: this.alarm.id, name}));
  }

  public updateContent(content: string | null): void {
    this.alarmsStore.dispatch(alarmsSingleContentUpdate({id: this.alarm.id, content}));
  }

  public openTaskSheet(): void {
    const sheet = this.sheet.open(TaskSheetComponent, {
      data: {selected: this.task$.getValue()}
    });
    sheet.afterDismissed()
      .pipe(filter(task => task !== undefined))
      .subscribe(task => this.alarmsStore.dispatch(alarmsSingleTaskUpdate({
        id: this.alarm.id,
        task: task
      })));
  }

  public getGroup(): Observable<Alarm> {
    return this.alarmsStore.select(selectAlarm(this.alarm.group));
  }

  public openCatalogsSidenav(): void {
    this.alarmCatalogsService.changeStatus({
      open: true,
      alarmId: this.alarm.id
    });
  }

  public refreshNotifications(): void {
    this.notifications$.next(this.alarm.notifications
      .filter(notification => !this.hideInactive ? true : !notification.checked));
  }

  public ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  public ngOnChanges(changes: SimpleChanges): void {
    this.refreshNotifications();
    if (this.alarm.task !== null) {
      this.subscriptions.push(
        this.tasksStore.select(selectTask(this.alarm.task)).pipe(first()).subscribe(task => this.task$.next(task))
      );
    } else {
      this.task$.next(null);
    }
  }
}
