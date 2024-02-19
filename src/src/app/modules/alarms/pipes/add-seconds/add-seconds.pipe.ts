import {Pipe, PipeTransform} from '@angular/core';
import {addSeconds} from 'date-fns';

@Pipe({
  name: 'addSeconds'
})
export class AddSecondsPipe implements PipeTransform {

  public transform(value: Date, amount: number): Date {
    return addSeconds(value, amount);
  }
}
