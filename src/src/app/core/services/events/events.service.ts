import {Injectable} from '@angular/core';
import Echo from 'laravel-echo';
import {environment} from '../../../../environments/environment';
import {AuthService} from '../auth/auth.service';

@Injectable()
export class EventsService {
  private echo: Echo;
  private userId: string;

  constructor() {
    const token = AuthService.getToken();
    this.userId = AuthService.getUserId();
    this.echo = new Echo({
      broadcaster: 'pusher',
      key: environment.pusherKey,
      cluster: environment.pusherCluster,
      authEndpoint: environment.baseUrl + environment.pusherAuthUrl,
      forceTLS: true,
      auth: {
        headers: {
          Authorization: 'Bearer ' + token
        }
      }
    });
  }

  public subscribeCatalogsChanges(callback: Function): void {
    this.echo.private(`events.${this.userId}`).listen('.catalogs.modified', callback);
  }

  public subscribeTasksChanges(callback: Function): void {
    this.echo.private(`events.${this.userId}`).listen('.tasks.modified', callback);
  }

  public subscribeAlarmsChanges(callback: Function): void {
    this.echo.private(`events.${this.userId}`).listen('.alarms.modified', callback);
  }

  public subscribeNotesChanges(callback: Function): void {
    this.echo.private(`events.${this.userId}`).listen('.notes.modified', callback);
  }

  public subscribeBookmarksChanges(callback: Function): void {
    this.echo.private(`events.${this.userId}`).listen('.bookmarks.modified', callback);
  }

  public subscribeFilesChanges(callback: Function): void {
    this.echo.private(`events.${this.userId}`).listen('.files.modified', callback);
  }

  public subscribeVideosChanges(callback: Function): void {
    this.echo.private(`events.${this.userId}`).listen('.videos.modified', callback);
  }

  public subscribeNotifications(callback: Function): void {
    this.echo.private(`notifications.${this.userId}`).listen('.new-notification', callback);
  }

  public disconnect(): void {
    this.echo.disconnect();
  }
}
