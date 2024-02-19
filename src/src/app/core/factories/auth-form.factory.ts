import {FormControl, FormGroup, Validators} from '@angular/forms';
import {PasswordValidator} from '../validators/password.validator';
import {Length} from '../../config/form.config';

export interface AuthFormNames {
  email: string;
  password: string;
  repeatPassword: string;
}

export const formNames: AuthFormNames = {
  email: 'email',
  password: 'password',
  repeatPassword: 'repeatPassword'
};

export abstract class AuthFormFactory {
  public static getLoginForm(): FormGroup {
    return new FormGroup({
      [formNames.email]: new FormControl('', [
        Validators.required,
        Validators.email,
        Validators.maxLength(Length.maxEmailLength)]),
      [formNames.password]: new FormControl('', [Validators.required, Validators.maxLength(Length.maxPasswordLength)])
    });
  }

  public static getRegisterForm(): FormGroup {
    return new FormGroup({
      [formNames.email]: new FormControl('', [
        Validators.required,
        Validators.email,
        Validators.maxLength(Length.maxEmailLength)]),
      [formNames.password]: new FormControl('', [Validators.required, Validators.maxLength(Length.maxPasswordLength)])
    });
  }

  public static getResetPasswordTokenForm(): FormGroup {
    return new FormGroup({
      [formNames.email]: new FormControl('', [
        Validators.required,
        Validators.email,
        Validators.maxLength(Length.maxEmailLength)])
    });
  }

  public static getResetPasswordForm(): FormGroup {
    return new FormGroup({
      [formNames.password]: new FormControl('', [Validators.required, Validators.maxLength(Length.maxPasswordLength)]),
      [formNames.repeatPassword]: new FormControl('', [
        Validators.required,
        PasswordValidator.same,
        Validators.maxLength(Length.maxPasswordLength)])
    });
  }
}
