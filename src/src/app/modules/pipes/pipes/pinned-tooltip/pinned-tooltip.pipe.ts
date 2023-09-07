import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'pinnedTooltip'
})
export class PinnedTooltipPipe implements PipeTransform {

  public transform(value: string, count: number, count2: number | null = null): string {
    if (count > 0 || (count2 !== null && count2 > 0)) {
      if (count2 === null || count2 === 0) {
        return `${value} (${count})`;
      }
      return `${value} (${count} + ${count2})`;
    }
    return value;
  }
}
