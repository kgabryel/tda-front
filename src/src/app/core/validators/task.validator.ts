import {AbstractControl, ValidationErrors} from '@angular/forms';

export class TaskValidator {
  public static mainTask(control: AbstractControl): ValidationErrors | null {
    if (control.parent === null) {
      return null;
    }
    if (control.parent.parent.get('mainTask').value) {
      return null;
    }
    if (control.value === null || control.value === '') {
      return {required: true};
    }
    return null;
  }

  public static nameRequired(control: AbstractControl): ValidationErrors | null {
    if (control.parent === null) {
      return null;
    }
    if (!control.parent.parent.get('alarmIncluded').value) {
      return null;
    }
    if (control.value === null || control.value === '') {
      return {required: true};
    }
    return null;
  }

  public static notificationTimeRequired(control: AbstractControl): ValidationErrors | null {
    if (control.parent === null) {
      return null;
    }
    if (!control.parent.parent.parent.get('alarmIncluded').value) {
      return null;
    }
    if (control.value === null || control.value === '') {
      return {required: true};
    }
    return null;
  }

  public static notificationTypesRequired(control: AbstractControl): ValidationErrors | null {
    if (control.parent === null) {
      return null;
    }
    if (!control.parent.parent.parent.parent.get('alarmIncluded').value) {
      return null;
    }
    if (control.value.length === 0) {
      return {required: true};
    }
    return null;
  }
}
