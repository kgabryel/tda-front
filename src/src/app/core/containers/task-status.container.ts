import {Injectable} from '@angular/core';
import {TaskStatus} from '../models/task-status';
import {taskStatuses} from '../../config/task-statuses.config';

@Injectable()
export class TaskStatusContainer {
  private statues: TaskStatus[];

  public setStatuses(statuses: TaskStatus[]) {
    this.statues = statuses;
  }

  public getDoneStatusId(): number {
    return this.statues.filter(status => status.name === taskStatuses.done)[0]?.id ?? 0;
  }

  public getRejectedStatusId(): number {
    return this.statues.filter(status => status.name === taskStatuses.rejected)[0]?.id ?? 0;
  }

  public getUndoneStatusId(): number {
    return this.statues.filter(status => status.name === taskStatuses.undone)[0]?.id ?? 0;
  }

  public getStatuses(): TaskStatus[] {
    return this.statues;
  }

  public getStatus(id: number): TaskStatus {
    return this.statues.filter(status => status.id === id)[0];
  }
}
