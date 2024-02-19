import {Injectable} from '@angular/core';
import {
  NotificationRequest,
  PeriodicAlarmRequest,
  PeriodicNotificationRequest,
  SingleAlarmRequest
} from '../../requests/alarms.request';
import {alarmsRoutes} from '../../../config/routes.config';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Alarm} from '../../models/alarm';
import {map} from 'rxjs/operators';

@Injectable()
export class AlarmsService {
  private httpClient: HttpClient;

  constructor(httpClient: HttpClient) {
    this.httpClient = httpClient;
  }

  public getAll(): Observable<Alarm[]> {
    return this.httpClient.get<Alarm[]>(alarmsRoutes.index);
  }

  public getSelected(ids: string[]): Observable<Alarm[]> {
    let params = new HttpParams().append('ids', JSON.stringify(ids));
    return this.httpClient.get<Alarm[]>(alarmsRoutes.index, {params});
  }

  public createSingle(alarm: SingleAlarmRequest): Observable<Alarm> {
    return this.httpClient.post<Alarm>(alarmsRoutes.createSingle, alarm);
  }

  public createPeriodic(alarm: PeriodicAlarmRequest): Observable<Alarm> {
    return this.httpClient.post<Alarm>(alarmsRoutes.createPeriodic, alarm);
  }

  public checkAlarm(id: string): Observable<Alarm> {
    return this.httpClient.post<Alarm>(alarmsRoutes.checkAlarm(id), null);
  }

  public uncheckAlarm(id: string): Observable<Alarm> {
    return this.httpClient.post<Alarm>(alarmsRoutes.uncheckAlarm(id), null);
  }

  public checkNotification(id: number): Observable<Alarm> {
    return this.httpClient.post<Alarm>(alarmsRoutes.checkNotification(id), null);
  }

  public uncheckNotification(id: number): Observable<Alarm> {
    return this.httpClient.post<Alarm>(alarmsRoutes.uncheckNotification(id), null);
  }

  public deleteAlarm(id: string, deleteAlarms: boolean = false): Observable<string> {
    let params = new HttpParams();
    params = params.append('delete', deleteAlarms ? 'true' : 'false');
    return this.httpClient.delete<any>(alarmsRoutes.byId(id), {params: params}).pipe(map(() => id));
  }

  public deleteNotification(notificationAlarm: Alarm, id: number): Observable<string | Alarm> {
    let params = new HttpParams();
    params = params.append('type', notificationAlarm.periodic ? 'periodic' : 'single');
    return this.httpClient.delete<Alarm | null>(alarmsRoutes.notificationById(id), {params: params})
      .pipe(map(alarm => alarm === null ? notificationAlarm.id : alarm));
  }

  public disableAlarm(code: string): Observable<Alarm> {
    return this.httpClient.post<Alarm>(alarmsRoutes.disableSingleAlarm, {code: code});
  }

  public createNotification(alarmId: string, notification: NotificationRequest): Observable<Alarm> {
    return this.httpClient.post<Alarm>(alarmsRoutes.addNotification(alarmId, 'single'), notification);
  }

  public createNotificationGroup(alarmId: string, notification: PeriodicNotificationRequest): Observable<Alarm> {
    return this.httpClient.post<Alarm>(alarmsRoutes.addNotification(alarmId, 'periodic'), notification);
  }

  public updateName(alarmId: string, name: string, periodic: boolean): Observable<Alarm> {
    let route = periodic ? alarmsRoutes.periodicAlarm(alarmId) : alarmsRoutes.singleAlarm(alarmId);
    return this.httpClient.patch<Alarm>(route, {name});
  }

  public updateContent(alarmId: string, content: string | null, periodic: boolean): Observable<Alarm> {
    let route = periodic ? alarmsRoutes.periodicAlarm(alarmId) : alarmsRoutes.singleAlarm(alarmId);
    return this.httpClient.patch<Alarm>(route, {content});
  }

  public updateTask(alarmId: string, task: string | null): Observable<Alarm> {
    return this.httpClient.patch<Alarm>(alarmsRoutes.singleAlarm(alarmId), {task});
  }

  public undoCatalog(alarmId: string, catalogId: number): Observable<Alarm> {
    return this.httpClient.delete<Alarm>(alarmsRoutes.undoCatalog(alarmId, catalogId));
  }

  public addCatalog(alarmId: string, catalogId: number): Observable<Alarm> {
    return this.httpClient.post<Alarm>(alarmsRoutes.addCatalog(alarmId), {catalog: catalogId});
  }

  public deactivatePeriodicAlarm(alarmId: string, action: string): Observable<Alarm> {
    return this.httpClient.patch<Alarm>(alarmsRoutes.deactivatePeriodic(alarmId), {action});
  }

  public activatePeriodicAlarm(alarmId: string, action: string): Observable<Alarm> {
    return this.httpClient.patch<Alarm>(alarmsRoutes.activatePeriodic(alarmId), {action});
  }
}
