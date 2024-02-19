import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Color} from '../../models/color';
import {map} from 'rxjs/operators';
import {colorsRoutes} from '../../../config/routes.config';
import {ColorRequest} from '../../requests/color.request';

@Injectable()
export class ColorsService {
  private httpClient: HttpClient;

  constructor(httpClient: HttpClient) {
    this.httpClient = httpClient;
  }

  public getAll(): Observable<Color[]> {
    return this.httpClient.get<Color[]>(colorsRoutes.index);
  }

  public add(color: ColorRequest): Observable<Color> {
    return this.httpClient.post<Color>(colorsRoutes.index, color);
  }

  public delete(id: number): Observable<number> {
    return this.httpClient.delete<any>(colorsRoutes.byId(id)).pipe(map(() => id));
  }
}
