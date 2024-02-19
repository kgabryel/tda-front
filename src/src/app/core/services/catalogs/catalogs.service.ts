import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Catalog} from '../../models/catalog';
import {map} from 'rxjs/operators';
import {catalogsRoutes, dashboardRoutes} from '../../../config/routes.config';
import {CatalogRequest} from '../../requests/catalog.request';

@Injectable()
export class CatalogsService {
  private httpClient: HttpClient;

  constructor(httpClient: HttpClient) {
    this.httpClient = httpClient;
  }

  public getAll(): Observable<Catalog[]> {
    return this.httpClient.get<Catalog[]>(catalogsRoutes.index);
  }

  public getSelected(ids: number[]): Observable<Catalog[]> {
    let params = new HttpParams().append('ids', JSON.stringify(ids));
    return this.httpClient.get<Catalog[]>(catalogsRoutes.index, {params});
  }

  public add(catalog: CatalogRequest): Observable<Catalog> {
    return this.httpClient.post<Catalog>(catalogsRoutes.index, catalog);
  }

  public update(id: number, catalog: CatalogRequest): Observable<Catalog> {
    return this.httpClient.put<Catalog>(catalogsRoutes.byId(id), catalog);
  }

  public undo(catalogId: number, itemId: number | string, type: string): Observable<Catalog> {
    return this.httpClient.delete<Catalog>(catalogsRoutes.undo(catalogId, itemId, type));
  }

  public undoFromDashboard(id: number): Observable<Catalog> {
    return this.httpClient.delete<Catalog>(dashboardRoutes.undoCatalog(id));
  }

  public delete(id: number): Observable<number> {
    return this.httpClient.delete<any>(catalogsRoutes.byId(id)).pipe(map(() => id));
  }
}
