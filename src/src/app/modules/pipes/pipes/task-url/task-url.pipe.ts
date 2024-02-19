import {Pipe, PipeTransform} from '@angular/core';
import {PathUtils} from '../../../../core/utils/path.utils';
import {RoutingConfig} from '../../../../config/routing.config';

@Pipe({
  name: 'taskUrl'
})
export class TaskUrlPipe implements PipeTransform {

  public transform(id: string): string {
    return PathUtils.bindParams(
      PathUtils.concatPath(RoutingConfig.tasks, RoutingConfig.byId),
      new Map([['id', id]])
    );
  }
}
