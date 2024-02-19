import {Pipe, PipeTransform} from '@angular/core';
import {PathUtils} from '../../../../core/utils/path.utils';
import {RoutingConfig} from '../../../../config/routing.config';

@Pipe({
  name: 'alarmUrl'
})
export class AlarmUrlPipe implements PipeTransform {

  public transform(id: string): string {
    return PathUtils.bindParams(
      PathUtils.concatPath(RoutingConfig.alarms, RoutingConfig.byId),
      new Map([['id', id]])
    );
  }
}
