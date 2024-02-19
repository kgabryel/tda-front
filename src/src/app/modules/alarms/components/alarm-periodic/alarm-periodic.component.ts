import {ChangeDetectionStrategy, Component, Input, OnDestroy, OnInit} from '@angular/core';
import {Alarm, AlarmSearch} from '../../../../core/models/alarm';
import {filter, map} from 'rxjs/operators';
import {Observable, Subscription} from 'rxjs';
import {Store} from '@ngrx/store';
import {State as AlarmsState} from '../../../../core/store/alarms/reducers';
import {State as TasksState} from '../../../../core/store/tasks/reducers';
import {BreakpointObserver} from '@angular/cdk/layout';
import {
  alarmPeriodicActivate,
  alarmPeriodicDeactivate,
  alarmPeriodicDelete,
  alarmsPeriodicContentUpdate,
  alarmsPeriodicNameUpdate
} from '../../../../core/store/alarms/actions';
import {MatBottomSheet} from '@angular/material/bottom-sheet';
import {Length} from '../../../../config/form.config';
import {selectEmailState, selectSettings} from '../../../../core/store/settings/selectors';
import {State as SettingsState} from '../../../../core/store/settings/reducers';
import {selectAlarmsForGroup} from '../../../../core/store/alarms/selectors';
import {AlarmCatalogsService} from '../../../../core/services/alarm-catalogs/alarm-catalogs.service';
import {b1} from '../../../../config/sizes.config';
import {
  ActivatePeriodicAlarmSheetComponent
} from '../activate-periodic-alarm-sheet/activate-periodic-alarm-sheet.component';
import {
  DeactivatePeriodicAlarmSheetComponent
} from '../deactivate-periodic-alarm-sheet/deactivate-periodic-alarm-sheet.component';
import * as moment from 'moment';
import {DeleteSheetComponent} from '../../../shared/components/delete-sheet/delete-sheet.component';
import {ConditionSheetComponent} from '../../../tasks/components/condition-sheet/condition-sheet.component';

@Component({
  selector: 'alarms-alarm-periodic',
  templateUrl: './alarm-periodic.component.html',
  styleUrls: ['./alarm-periodic.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AlarmPeriodicComponent implements OnInit, OnDestroy {

  @Input() public alarm: Alarm;
  public step: number;
  public small$: Observable<boolean>;
  public maxNameLength: number;
  @Input() public previewAvailable: boolean = true;

  public disableEmail$: Observable<boolean>;
  public alarms$: Observable<Alarm[]>;
  public hideInactive: boolean;
  private alarmsStore: Store<AlarmsState>;
  private tasksStore: Store<TasksState>;
  private breakpointObserver: BreakpointObserver;
  private sheet: MatBottomSheet;
  private alarmCatalogsService: AlarmCatalogsService;
  private subscription: Subscription;
  private settingsStore: Store<SettingsState>;

  public constructor(
    alarmCatalogsService: AlarmCatalogsService,
    alarmsStore: Store<AlarmsState>,
    tasksStore: Store<TasksState>,
    breakpointObserver: BreakpointObserver,
    sheet: MatBottomSheet,
    settingsStore: Store<SettingsState>
  ) {
    this.alarmsStore = alarmsStore;
    this.tasksStore = tasksStore;
    this.breakpointObserver = breakpointObserver;
    this.sheet = sheet;
    this.maxNameLength = Length.maxAlarmNameLength;
    this.alarmCatalogsService = alarmCatalogsService;
    this.settingsStore = settingsStore;
  }

  public ngOnInit(): void {
    this.disableEmail$ = this.settingsStore.select(selectEmailState).pipe(map(emailState => emailState !== 1));
    this.subscription = this.settingsStore.select(selectSettings('hideInactiveAlarmsInAlarmsGroups'))
      .subscribe(value => {
        this.hideInactive = value;
        this.refreshAlarms(this.getEmptySearch());
      });
    this.refreshAlarms(this.getEmptySearch());
    this.small$ = this.breakpointObserver.observe(b1).pipe(map(data => data.matches));
  }

  public changeSection(section: number): void {
    this.step = this.step === section ? -1 : section;
  }

  public deleteAlarm(): void {
    let alarms = this.alarm.alarms.length;
    if (alarms === 0) {
      const sheetRef = this.sheet.open(DeleteSheetComponent);
      sheetRef.afterDismissed()
        .pipe(filter(action => action))
        .subscribe(() => this.alarmsStore.dispatch(alarmPeriodicDelete({id: this.alarm.id, delete: false})));
    } else {
      const sheetRef = this.sheet.open(ConditionSheetComponent, {data: {question: 'form.questions.deleteConnectedAlarms'}});
      sheetRef.afterDismissed()
        .pipe(filter(action => action !== undefined && action !== null))
        .subscribe(action => this.alarmsStore.dispatch(alarmPeriodicDelete({id: this.alarm.id, delete: action})));
    }
  }

  public saveName(name: string): void {
    this.alarmsStore.dispatch(alarmsPeriodicNameUpdate({id: this.alarm.id, name}));
  }

  public updateContent(content: string | null): void {
    this.alarmsStore.dispatch(alarmsPeriodicContentUpdate({id: this.alarm.id, content}));
  }

  public refreshAlarms(search: AlarmSearch): void {
    this.alarms$ = this.alarmsStore.select(selectAlarmsForGroup(this.alarm.id, search))
      .pipe(
        map(alarms => alarms.sort((a, b) => {
          let aDate = moment(a.date, 'YYYY-MM-DD');
          let bDate = moment(b.date, 'YYYY-MM-DD');
          if (aDate < bDate) {
            return -1;
          }
          if (aDate > bDate) {
            return 1;
          }
          return 0;
        })),
        map(alarms => !this.hideInactive ? alarms : alarms.filter(alarm => !alarm.checked))
      );
  }

  public openCatalogsSidenav(): void {
    this.alarmCatalogsService.changeStatus({
      open: true,
      alarmId: this.alarm.id
    });
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  public activate(): void {
    if (this.alarm.task !== null) {
      return;
    }
    const sheet = this.sheet.open(
      ActivatePeriodicAlarmSheetComponent,
      {data: {alarms$: this.getFutureAlarms()}}
    );
    sheet.afterDismissed().pipe(filter(action => action !== null && action !== undefined))
      .subscribe(action => this.alarmsStore.dispatch(alarmPeriodicActivate({
        id: this.alarm.id,
        action: action
      })));
  }

  public deactivate(): void {
    if (this.alarm.task !== null) {
      return;
    }
    const sheet = this.sheet.open(
      DeactivatePeriodicAlarmSheetComponent,
      {data: {alarms$: this.getFutureAlarms()}}
    );
    sheet.afterDismissed().pipe(filter(action => action !== null && action !== undefined))
      .subscribe(action => {
        this.alarmsStore.dispatch(alarmPeriodicDeactivate({
          id: this.alarm.id,
          action: action
        }));
      });
  }

  public getEmptySearch(): AlarmSearch {
    return {
      checked: null,
      start: null,
      stop: null
    };
  }

  private getFutureAlarms(): Observable<Alarm[]> {
    return this.alarmsStore.select(selectAlarmsForGroup(this.alarm.id, {
      checked: null,
      start: new Date(),
      stop: null
    }));
  }
}
