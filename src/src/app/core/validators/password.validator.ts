import {AbstractControl, ValidationErrors} from '@angular/forms';

export class PasswordValidator {
  public static same(control: AbstractControl): ValidationErrors | null {
    if (control.parent === null) {
      return null;
    }
    const password = control.parent.value.password;
    const passwordRepeat = control.parent.value.repeatPassword;
    if (password === null || passwordRepeat === null) {
      return null;
    }
    if (password === passwordRepeat) {
      return null;
    }
    return {differentPasswords: true};
  }
}
