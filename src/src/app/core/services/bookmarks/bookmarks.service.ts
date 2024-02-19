import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Bookmark} from '../../models/bookmark';
import {map} from 'rxjs/operators';
import {bookmarksRoutes, dashboardRoutes} from '../../../config/routes.config';
import {BookmarkRequest} from '../../requests/bookmark.request';

@Injectable()
export class BookmarksService {
  private httpClient: HttpClient;

  constructor(httpClient: HttpClient) {
    this.httpClient = httpClient;
  }

  public getAll(): Observable<Bookmark[]> {
    return this.httpClient.get<Bookmark[]>(bookmarksRoutes.index);
  }

  public getSelected(ids: number[]): Observable<Bookmark[]> {
    let params = new HttpParams().append('ids', JSON.stringify(ids));
    return this.httpClient.get<Bookmark[]>(bookmarksRoutes.index, {params});
  }

  public add(bookmark: BookmarkRequest): Observable<Bookmark> {
    return this.httpClient.post<Bookmark>(bookmarksRoutes.index, bookmark);
  }

  public delete(id: number): Observable<number> {
    return this.httpClient.delete<any>(bookmarksRoutes.byId(id)).pipe(map(() => id));
  }

  public update(id: number, bookmark: BookmarkRequest): Observable<Bookmark> {
    return this.httpClient.put<Bookmark>(bookmarksRoutes.byId(id), bookmark);
  }

  public undoFromDashboard(id: number): Observable<Bookmark> {
    return this.httpClient.delete<Bookmark>(dashboardRoutes.undoBookmark(id));
  }
}
