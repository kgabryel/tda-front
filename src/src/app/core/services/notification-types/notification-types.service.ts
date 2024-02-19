import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {NotificationType} from '../../models/notification-type';
import {alarmsRoutes} from '../../../config/routes.config';

@Injectable()
export class NotificationTypesService {
  private httpClient: HttpClient;

  constructor(httpClient: HttpClient) {
    this.httpClient = httpClient;
  }

  public getAll(): Observable<NotificationType[]> {
    return this.httpClient.get<NotificationType[]>(alarmsRoutes.notificationsTypes);
  }
}
