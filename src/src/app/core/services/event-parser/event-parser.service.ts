import {Injectable} from '@angular/core';
import {CalendarEvent} from 'angular-calendar';
import {Task} from '../../models/task';
import {startOfDay} from 'date-fns';
import {Observable, of} from 'rxjs';
import {Alarm, Notification} from '../../models/alarm';
import {TaskStatusContainer} from '../../containers/task-status.container';

@Injectable()
export class EventParserService {

  private statuses: Map<string, Map<string, string>>;
  private types: Map<string, Map<string, string>>;
  private taskStatusContainer: TaskStatusContainer;
  private readonly alarmColor: string;

  constructor(taskStatusContainer: TaskStatusContainer) {
    this.taskStatusContainer = taskStatusContainer;
    this.statuses = EventParserService.getStatuses();
    this.types = EventParserService.getTypes();
    this.alarmColor = '#e09f3e';
  }

  private static getStatuses(): Map<string, Map<string, string>> {
    let statuses = new Map<string, Map<string, string>>();
    let pl = new Map<string, string>();
    pl.set('to-do', 'Do zrobienia');
    pl.set('in-progress', 'W trakcie');
    pl.set('done', 'Zrobione');
    pl.set('undone', 'Nieukończone');
    let en = new Map<string, string>();
    en.set('to-do', 'To do');
    en.set('in-progress', 'In progress');
    en.set('done', 'Done');
    en.set('undone', 'Undone');
    statuses.set('pl', pl);
    statuses.set('en', en);
    return statuses;
  }

  private static getTypes(): Map<string, Map<string, string>> {
    let types = new Map<string, Map<string, string>>();
    let pl = new Map<string, string>();
    pl.set('alarm', 'Alarm');
    pl.set('task', 'Zadanie');
    let en = new Map<string, string>();
    en.set('alarm', 'Alarm');
    en.set('task', 'Task');
    types.set('pl', pl);
    types.set('en', en);
    return types;
  }

  public parse(tasks: Task[], alarms: Alarm[], lang: string): Observable<CalendarEvent[]> {
    let events: CalendarEvent[] = [];
    tasks.forEach((task: Task) => events.push(this.mapTask(task, lang)));
    alarms.forEach((alarm: Alarm) => {
      let usedDates: string[] = [];
      alarm.notifications.forEach(notification => {
        if (!usedDates.includes(notification.time as string)) {
          usedDates.push(notification.time as string);
          events.push(this.mapAlarm(alarm, notification, lang));
        }
      });
    });
    return of(events);
  }

  private mapTask(task: Task, lang: string): CalendarEvent {
    const status = this.statuses.get(lang).get(this.taskStatusContainer.getStatus(task.status).name);
    const type = this.types.get(lang).get('task');
    return {
      title: `[${type}] ${task.name} - ${status}`,
      start: startOfDay(new Date(task.date)),
      color: {
        primary: this.taskStatusContainer.getStatus(task.status).color,
        secondary: this.taskStatusContainer.getStatus(task.status).color
      },
      id: task.id,
      meta: 'task'
    };
  }

  private mapAlarm(alarm: Alarm, notification: Notification, lang: string): CalendarEvent {
    const type = this.types.get(lang).get('alarm');
    return {
      title: `[${type}] ${alarm.name}`,
      start: startOfDay(new Date(notification.time)),
      color: {
        primary: this.alarmColor,
        secondary: this.alarmColor
      },
      id: alarm.id + '_' + notification.id,
      meta: 'alarm'
    };
  }
}
