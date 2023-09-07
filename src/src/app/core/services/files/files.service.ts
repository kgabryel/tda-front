import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {BehaviorSubject, Observable} from 'rxjs';
import {File} from '../../models/file';
import {EditFileRequest, FileRequest, ReplaceFileRequest} from '../../requests/file.request';
import {last, map, tap} from 'rxjs/operators';
import {dashboardRoutes, filesRoutes} from '../../../config/routes.config';
import {FileSaverService} from 'ngx-filesaver';
import {UploadFileService} from '../upload-file/upload-file.service';
import {DownloadProgress, DownloadProgressService} from '../download-progress/download-progress.service';

@Injectable()
export class FilesService {
  private httpClient: HttpClient;
  private fileSaverService: FileSaverService;
  private uploadFileService: UploadFileService;
  private downloadProgressService: DownloadProgressService;

  constructor(
    httpClient: HttpClient,
    fileSaverService: FileSaverService,
    uploadFileService: UploadFileService,
    downloadProgressService: DownloadProgressService
  ) {
    this.httpClient = httpClient;
    this.fileSaverService = fileSaverService;
    this.uploadFileService = uploadFileService;
    this.downloadProgressService = downloadProgressService;
  }

  private static createData(request: FileRequest | EditFileRequest): FormData {
    let data = new FormData();
    data.append('name', request.name);
    data.append('assignedToDashboard', request.assignedToDashboard ? '1' : '0');
    for (let task of request.tasks) {
      data.append('tasks[]', task);
    }
    for (let catalog of request.catalogs) {
      data.append('catalogs[]', catalog.toString());
    }
    return data;
  }

  public getAll(): Observable<File[]> {
    return this.httpClient.get<File[]>(filesRoutes.index);
  }

  public getSelected(ids: number[]): Observable<File[]> {
    let params = new HttpParams().append('ids', JSON.stringify(ids));
    return this.httpClient.get<File[]>(filesRoutes.index, {params});
  }

  public add(file: FileRequest): Observable<File> {
    let data = FilesService.createData(file);
    data.append('file', file.file);
    return this.httpClient.post<File>(filesRoutes.index, data, {reportProgress: true, observe: 'events'})
      .pipe(
        tap(data => this.uploadFileService.changeStatus(data)),
        last(),
        map(event => event['body'])
      );
  }

  public delete(id: number): Observable<number> {
    return this.httpClient.delete<any>(filesRoutes.byId(id)).pipe(map(() => id));
  }

  public undoFromDashboard(id: number): Observable<File> {
    return this.httpClient.delete<File>(dashboardRoutes.undoFile(id));
  }

  public download(id: number, name: string, extension: string): void {
    const state = this.downloadProgressService.getState(id);
    this.httpClient.get(
      filesRoutes.download(id), {reportProgress: true, responseType: 'blob', observe: 'events'}
    )
      .subscribe(response => this.mapDownloadProgress(state, name, extension, response));
  }

  public updateFile(id: number, file: ReplaceFileRequest): Observable<File> {
    let data = new FormData();
    data.append('file', file.file);
    return this.httpClient.post<File>(
      filesRoutes.byId(id),
      data,
      {headers: {'X-HTTP-Method-Override': 'PATCH'}, reportProgress: true, observe: 'events'}
    )
      .pipe(
        tap(data => this.uploadFileService.changeStatus(data)),
        last(),
        map(event => event['body'])
      );
  }

  public updateData(id: number, file: EditFileRequest): Observable<File> {
    let data = FilesService.createData(file);
    return this.httpClient.post<File>(filesRoutes.byId(id), data, {headers: {'X-HTTP-Method-Override': 'PATCH'}});
  }

  private mapDownloadProgress(
    state: BehaviorSubject<DownloadProgress>,
    name: string,
    extension: string,
    response
  ): void {
    if (response.type === 0) {
      state.next({
        status: 0,
        downloaded: 0,
        total: 0
      });
    }
    if (response.type === 3) {
      state.next({
        status: 3,
        downloaded: response['loaded'],
        total: response['total']
      });
    }
    if (response.type === 4) {
      state.next({
        status: -1,
        downloaded: 0,
        total: 0
      });
      const file = response['body'];
      this.fileSaverService.save(file, name);
    }
  }
}
