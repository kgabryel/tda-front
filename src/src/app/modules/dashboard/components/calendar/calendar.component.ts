import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {isSameDay, isSameMonth} from 'date-fns';
import {combineLatest, Observable, Subject} from 'rxjs';
import {Store} from '@ngrx/store';
import {EventParserService} from '../../../../core/services/event-parser/event-parser.service';
import {CalendarEvent, DAYS_OF_WEEK} from 'angular-calendar';
import {Router} from '@angular/router';
import {environment} from '../../../../../environments/environment';
import {LangService} from '../../../../core/services/lang/lang.service';
import {State as TasksState} from '../../../../core/store/tasks/reducers';
import {State as AlarmsState} from '../../../../core/store/alarms/reducers';
import {selectTasksWithDate} from '../../../../core/store/tasks/selectors';
import {PathUtils} from '../../../../core/utils/path.utils';
import {RoutingConfig} from '../../../../config/routing.config';
import {selectSingleAlarms} from '../../../../core/store/alarms/selectors';
import {startWith, switchMap} from 'rxjs/operators';

@Component({
  selector: 'dashboard-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CalendarComponent implements OnInit {

  public viewDate: Date;
  public refresh: Subject<any>;
  public events$: Observable<CalendarEvent[]>;
  public activeDayIsOpen: boolean = false;
  public weekStartsOn: number = DAYS_OF_WEEK.MONDAY;
  public locale$: Observable<string>;
  private tasksStore: Store<TasksState>;
  private alarmsStore: Store<AlarmsState>;
  private eventParserService: EventParserService;
  private router: Router;

  public constructor(
    tasksStore: Store<TasksState>,
    alarmsStore: Store<AlarmsState>,
    eventParserService: EventParserService,
    router: Router,
    langService: LangService
  ) {
    this.tasksStore = tasksStore;
    this.alarmsStore = alarmsStore;
    this.eventParserService = eventParserService;
    this.router = router;
    this.locale$ = langService.getState().pipe(startWith(environment.lang));
    this.viewDate = new Date();
    this.refresh = new Subject<any>();
  }

  public dayClicked({date, events}: { date: Date; events: CalendarEvent[] }): void {
    if (isSameMonth(date, this.viewDate)) {
      this.activeDayIsOpen = !((isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) ||
        events.length === 0);
    }
    this.viewDate = date;
  }

  public ngOnInit(): void {
    let tasks$ = this.tasksStore.select(selectTasksWithDate);
    let alarms$ = this.alarmsStore.select(selectSingleAlarms);
    this.events$ = combineLatest([tasks$, alarms$, this.locale$])
      .pipe(switchMap(items => this.eventParserService.parse(items[0], items[1], items[2])));
  }

  public setPrev(): void {
    this.viewDate = new Date();
    this.activeDayIsOpen = false;
    this.viewDate.setMonth(this.viewDate.getMonth() - 1);
  }

  public setCurrent(): void {
    this.viewDate = new Date();
    this.activeDayIsOpen = false;
  }

  public setNext(): void {
    this.viewDate = new Date();
    this.activeDayIsOpen = false;
    this.viewDate.setMonth(this.viewDate.getMonth() + 1);
  }

  public handleEvent(event: CalendarEvent): void {
    if (event.meta === 'task') {
      this.router.navigateByUrl(PathUtils.concatPath(RoutingConfig.tasks, event.id as string));
    }
    if (event.meta === 'alarm') {
      let id = (event.id as string).split('_')[0];
      this.router.navigateByUrl(PathUtils.concatPath(RoutingConfig.alarms, id));
    }
  }
}
