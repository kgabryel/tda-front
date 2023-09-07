import {Pipe, PipeTransform} from '@angular/core';
import {PathUtils} from '../../../../core/utils/path.utils';
import {RoutingConfig} from '../../../../config/routing.config';

@Pipe({
  name: 'catalogUrl'
})
export class CatalogUrlPipe implements PipeTransform {

  public transform(id: number): string {
    return PathUtils.bindParams(
      PathUtils.concatPath(RoutingConfig.catalogs, RoutingConfig.byId),
      new Map([['id', id.toString()]])
    );
  }
}
