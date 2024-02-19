import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {tasksRoutes} from '../../../config/routes.config';
import {Task} from '../../models/task';
import {DateRequest, PeriodicTaskRequest, SingleTaskRequest} from '../../requests/tasks.request';
import {map} from 'rxjs/operators';
import {TaskStatus} from '../../models/task-status';

@Injectable()
export class TasksService {
  private httpClient: HttpClient;

  constructor(httpClient: HttpClient) {
    this.httpClient = httpClient;
  }

  public getAll(): Observable<Task[]> {
    return this.httpClient.get<Task[]>(tasksRoutes.index);
  }

  public getSelected(ids: string[]): Observable<Task[]> {
    let params = new HttpParams().append('ids', JSON.stringify(ids));
    return this.httpClient.get<Task[]>(tasksRoutes.index, {params});
  }

  public getStatuses(): Observable<TaskStatus[]> {
    return this.httpClient.get<TaskStatus[]>(tasksRoutes.statuses);
  }

  public createSingle(task: SingleTaskRequest): Observable<Task> {
    return this.httpClient.post<Task>(tasksRoutes.createSingle, task);
  }

  public createPeriodic(task: PeriodicTaskRequest): Observable<Task> {
    return this.httpClient.post<Task>(tasksRoutes.createPeriodic, task);
  }

  public changeStatus(task: string, status: number): Observable<Task> {
    return this.httpClient.post<Task>(tasksRoutes.changeStatus(task), {
      status: status
    });
  }

  public deleteTask(id: string, deleteTasks: boolean = false, deleteAlarm: boolean = false): Observable<string> {
    let params = new HttpParams();
    params = params.append('deleteTasks', deleteTasks ? 'true' : 'false');
    params = params.append('deleteAlarm', deleteAlarm ? 'true' : 'false');
    return this.httpClient.delete<Task>(tasksRoutes.byId(id), {params: params}).pipe(
      map(() => id)
    );
  }

  public updateName(taskId: string, name: string, periodic: boolean): Observable<Task> {
    let route = periodic ? tasksRoutes.periodicTask(taskId) : tasksRoutes.singleTask(taskId);
    return this.httpClient.patch<Task>(route, {name});
  }

  public updateContent(taskId: string, content: string | null, periodic: boolean): Observable<Task> {
    let route = periodic ? tasksRoutes.periodicTask(taskId) : tasksRoutes.singleTask(taskId);
    return this.httpClient.patch<Task>(route, {content});
  }

  public updateDate(alarmId: string, date: DateRequest): Observable<Task> {
    return this.httpClient.patch<Task>(tasksRoutes.singleTask(alarmId), date);
  }

  public updateMainTask(taskId: string, mainTask: string | null): Observable<Task> {
    return this.httpClient.patch<Task>(tasksRoutes.singleTask(taskId), {mainTask});
  }

  public updateAlarm(taskId: string, alarm: string | null): Observable<Task> {
    return this.httpClient.patch<Task>(tasksRoutes.singleTask(taskId), {alarm});
  }

  public undo(taskId: string, itemId: number, type: string): Observable<Task> {
    return this.httpClient.delete<Task>(tasksRoutes.undo(taskId, itemId, type));
  }

  public addPinned(taskId: string, itemId: number, type: string): Observable<Task> {
    return this.httpClient.post<Task>(tasksRoutes.addPinned(taskId, type), {item: itemId});
  }

  public deactivatePeriodicTask(taskId: string, action: string): Observable<Task> {
    return this.httpClient.patch<Task>(tasksRoutes.deactivatePeriodic(taskId), {action});
  }

  public activatePeriodicTask(taskId: string, action: string): Observable<Task> {
    return this.httpClient.patch<Task>(tasksRoutes.activatePeriodic(taskId), {action});
  }
}
