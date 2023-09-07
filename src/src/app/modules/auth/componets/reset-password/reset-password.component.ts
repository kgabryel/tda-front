import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {AuthFormFactory, AuthFormNames, formNames} from '../../../../core/factories/auth-form.factory';
import {PathUtils} from '../../../../core/utils/path.utils';
import {RoutingConfig} from '../../../../config/routing.config';
import {UserService} from '../../../../core/services/user/user.service';
import {catchError} from 'rxjs/operators';
import {FormUtils} from '../../../../core/utils/form.utils';
import {NotificationService} from '../../../../core/services/notification/notification.service';

@Component({
  selector: 'auth-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['../../shared/scss/form.scss', './reset-password.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ResetPasswordComponent implements OnInit {

  public form: FormGroup;
  public formNames: AuthFormNames;
  public loginPath: string;
  private userService: UserService;
  private notificationService: NotificationService;

  public constructor(userService: UserService, notificationService: NotificationService) {
    this.formNames = formNames;
    this.userService = userService;
    this.notificationService = notificationService;
  }

  public ngOnInit(): void {
    this.form = AuthFormFactory.getResetPasswordTokenForm();
    this.loginPath = PathUtils.concatPath(RoutingConfig.login);
  }

  public submitForm(): void {
    if (this.form.invalid) {
      return;
    }
    this.userService.sendResetPasswordRequest(this.form.get(this.formNames.email).value).pipe(
      catchError(() => {
        this.notificationService.showErrorMessage('messages.invalidEmail');
        return undefined;
      })
    ).subscribe(result => {
      if (result !== undefined) {
        this.notificationService.showMessage('messages.sendCorrect');
      }
    });
    this.clearForm();
  }

  public clearForm(): void {
    FormUtils.clearInputs(this.form, '', this.formNames.email);
  }
}
