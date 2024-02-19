import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {dashboardRoutes, videosRoutes} from '../../../config/routes.config';
import {Video} from '../../models/video';
import {EditVideoRequest, VideoRequest, WatchedRequest} from '../../requests/video.request';

@Injectable()
export class VideosService {
  private httpClient: HttpClient;

  constructor(httpClient: HttpClient) {
    this.httpClient = httpClient;
  }

  public getAll(): Observable<Video[]> {
    return this.httpClient.get<Video[]>(videosRoutes.index);
  }

  public getSelected(ids: number[]): Observable<Video[]> {
    let params = new HttpParams().append('ids', JSON.stringify(ids));
    return this.httpClient.get<Video[]>(videosRoutes.index, {params});
  }

  public add(video: VideoRequest): Observable<Video[]> {
    return this.httpClient.post<Video[]>(videosRoutes.index, video);
  }

  public update(id: number, video: EditVideoRequest | WatchedRequest): Observable<Video> {
    return this.httpClient.patch<Video>(videosRoutes.byId(id), video);
  }

  public delete(id: number): Observable<number> {
    return this.httpClient.delete<any>(videosRoutes.byId(id)).pipe(map(() => id));
  }

  public undoFromDashboard(id: number): Observable<Video> {
    return this.httpClient.delete<Video>(dashboardRoutes.undoVideo(id));
  }
}
