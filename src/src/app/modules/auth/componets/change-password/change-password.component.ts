import {ChangeDetectionStrategy, Component, Input, OnInit} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {AuthFormFactory, AuthFormNames, formNames} from '../../../../core/factories/auth-form.factory';
import {UserService} from '../../../../core/services/user/user.service';
import {NotificationService} from '../../../../core/services/notification/notification.service';
import {catchError} from 'rxjs/operators';
import {ResetPasswordRequest} from '../../../../core/requests/auth.request';
import {PathUtils} from '../../../../core/utils/path.utils';
import {RoutingConfig} from '../../../../config/routing.config';
import {Router} from '@angular/router';
import {resetPasswordErrors, ResetPasswordErrors} from '../../../../core/errors/auth.error';

@Component({
  selector: 'auth-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['../../shared/scss/form.scss', './change-password.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChangePasswordComponent implements OnInit {

  public form: FormGroup;
  public formNames: AuthFormNames;
  public errors: ResetPasswordErrors;
  @Input() public token: string;
  private userService: UserService;
  private notificationService: NotificationService;
  private router: Router;

  public constructor(userService: UserService, notificationService: NotificationService, router: Router) {
    this.formNames = formNames;
    this.userService = userService;
    this.notificationService = notificationService;
    this.router = router;
    this.errors = resetPasswordErrors;
  }

  public submitForm(): void {
    if (this.form.invalid) {
      return;
    }
    const request: ResetPasswordRequest = {
      token: this.token,
      password: this.form.get(this.formNames.password).value
    };
    this.userService.resetPassword(request).pipe(
      catchError(() => {
        this.notificationService.showErrorMessage('messages.invalidToken');
        return undefined;
      })
    ).subscribe(result => {
      if (result !== undefined) {
        this.notificationService.showMessage('messages.passwordChanged');
        this.router.navigateByUrl(PathUtils.concatPath(RoutingConfig.login));
      }
    });
  }

  public ngOnInit(): void {
    this.form = AuthFormFactory.getResetPasswordForm();
  }
}
