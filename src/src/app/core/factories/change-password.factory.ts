import {FormControl, FormGroup, Validators} from '@angular/forms';
import {PasswordValidator} from '../validators/password.validator';
import {Length} from '../../config/form.config';

export interface ChangePasswordFormNames {
  currentPassword: string,
  password: string,
  repeatPassword: string
}

export const formNames: ChangePasswordFormNames = {
  currentPassword: 'currentPassword',
  password: 'password',
  repeatPassword: 'repeatPassword'
};

export abstract class FormFactory {
  public static getForm(): FormGroup {
    return new FormGroup({
      [formNames.currentPassword]: new FormControl('', [
        Validators.required,
        Validators.maxLength(Length.maxPasswordLength)]),
      [formNames.password]: new FormControl('', [Validators.required, Validators.maxLength(Length.maxPasswordLength)]),
      [formNames.repeatPassword]: new FormControl('', [
        Validators.required,
        PasswordValidator.same,
        Validators.maxLength(Length.maxPasswordLength)])
    });
  }
}
