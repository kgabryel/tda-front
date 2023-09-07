import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Note} from '../../models/note';
import {NoteRequest} from '../../requests/note.request';
import {map} from 'rxjs/operators';
import {dashboardRoutes, notesRoutes} from '../../../config/routes.config';

@Injectable()
export class NotesService {
  private httpClient: HttpClient;

  constructor(httpClient: HttpClient) {
    this.httpClient = httpClient;
  }

  public getAll(): Observable<Note[]> {
    return this.httpClient.get<Note[]>(notesRoutes.index);
  }

  public getSelected(ids: number[]): Observable<Note[]> {
    let params = new HttpParams().append('ids', JSON.stringify(ids));
    return this.httpClient.get<Note[]>(notesRoutes.index, {params});
  }

  public add(note: NoteRequest): Observable<Note> {
    return this.httpClient.post<Note>(notesRoutes.index, note);
  }

  public delete(id: number): Observable<number> {
    return this.httpClient.delete<any>(notesRoutes.byId(id)).pipe(map(() => id));
  }

  public update(id: number, note: NoteRequest): Observable<Note> {
    return this.httpClient.put<Note>(notesRoutes.byId(id), note);
  }

  public undoFromDashboard(id: number): Observable<Note> {
    return this.httpClient.delete<Note>(dashboardRoutes.undoNote(id));
  }
}
