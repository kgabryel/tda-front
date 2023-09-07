import {AbstractControl, ValidationErrors} from '@angular/forms';
import * as moment from 'moment';

export class DateValidator {
  public static different(control: AbstractControl): ValidationErrors | null {
    if (control.parent === null) {
      return null;
    }
    const start = control.parent.value.start;
    const stop = control.parent.value.stop;
    if (start === null || stop === null) {
      return null;
    }
    if (moment(start).isSame(moment(stop))) {
      return {sameDates: true};
    }
    return null;
  }
}
