import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {ChangePasswordFormNames, FormFactory, formNames} from '../../../../core/factories/change-password.factory';
import {ChangePasswordErrors, changePasswordErrors} from '../../../../core/errors/change-password.error';
import {ChangePasswordRequest} from '../../../../core/requests/change-password.request';
import {NotificationService} from '../../../../core/services/notification/notification.service';
import {catchError} from 'rxjs/operators';
import {FormUtils} from '../../../../core/utils/form.utils';
import {UserService} from '../../../../core/services/user/user.service';

@Component({
  selector: 'settings-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChangePasswordComponent implements OnInit {

  public form: FormGroup;
  public formNames: ChangePasswordFormNames;
  public errors: ChangePasswordErrors;
  private userService: UserService;
  private notificationService: NotificationService;

  public constructor(userService: UserService, notificationService: NotificationService) {
    this.userService = userService;
    this.notificationService = notificationService;
    this.formNames = formNames;
    this.errors = changePasswordErrors;
  }

  public submit(): void {
    this.form.markAllAsTouched();
    if (this.form.invalid) {
      return;
    }
    const request: ChangePasswordRequest = {
      password: this.form.get(formNames.password).value,
      passwordRepeat: this.form.get(formNames.repeatPassword).value,
      oldPassword: this.form.get(formNames.currentPassword).value
    };
    this.userService.changePassword(request).pipe(
      catchError((error) => {
        this.notificationService.showError(error.status);
        return undefined;
      })
    ).subscribe(result => {
      if (result !== undefined) {
        this.notificationService.showMessage('settings.passwordChangedMessage');
      }
    });
    this.clearForm();
  }

  public clearForm(): void {
    FormUtils.clearInputs(
      this.form,
      '',
      this.formNames.password,
      this.formNames.repeatPassword,
      this.formNames.currentPassword
    );
  }

  public ngOnInit(): void {
    this.form = FormFactory.getForm();
  }
}
