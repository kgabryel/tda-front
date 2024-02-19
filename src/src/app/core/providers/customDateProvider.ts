import {NgxMatNativeDateAdapter} from '@angular-material-components/datetime-picker';
import {Injectable} from '@angular/core';

@Injectable()
export class CustomDateProvider extends NgxMatNativeDateAdapter {
  public getFirstDayOfWeek(): number {
    return 1;
  }
}
