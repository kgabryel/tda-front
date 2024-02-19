import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'fileSize'
})
export class FileSizePipe implements PipeTransform {

  public transform(size: number): string {
    if (size < 1000) {
      return size + ' B';
    } else if (size < 1000 * 1000) {
      return (size / 1000).toFixed(2) + ' KB';
    } else {
      return (size / (1000 * 1000)).toFixed(2) + ' MB';
    }
  }
}
