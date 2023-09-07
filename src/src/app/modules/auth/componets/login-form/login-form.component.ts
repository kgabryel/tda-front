import {ChangeDetectionStrategy, Component, OnDestroy, OnInit} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {RoutingConfig} from '../../../../config/routing.config';
import {PathUtils} from '../../../../core/utils/path.utils';
import {AuthService} from '../../../../core/services/auth/auth.service';
import {Router} from '@angular/router';
import {AuthFormFactory, AuthFormNames, formNames} from '../../../../core/factories/auth-form.factory';
import {authErrors, AuthErrors} from '../../../../core/errors/auth.error';
import {BehaviorSubject, Subscription} from 'rxjs';
import {AccessService} from '../../../../core/services/access/access.service';

@Component({
  selector: 'auth-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['../../shared/scss/form.scss', './login-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginFormComponent implements OnInit, OnDestroy {

  public form: FormGroup;
  public registrationPath: string;
  public resetPasswordPath: string;
  public errorMessage$: BehaviorSubject<string>;
  public errors: AuthErrors;
  public formNames: AuthFormNames;
  private accessService: AccessService;
  private authService: AuthService;
  private router: Router;
  private subscriptions: Subscription[];

  public constructor(accessService: AccessService, authService: AuthService, router: Router) {
    this.registrationPath = PathUtils.concatPath(RoutingConfig.registration);
    this.resetPasswordPath = PathUtils.concatPath(RoutingConfig.resetPassword);
    this.errors = authErrors;
    this.accessService = accessService;
    this.authService = authService;
    this.router = router;
    this.formNames = formNames;
    this.errorMessage$ = new BehaviorSubject<string>('');
  }

  public ngOnInit(): void {
    this.form = AuthFormFactory.getLoginForm();
    this.errorMessage$.next('');
    this.subscriptions = [
      this.form.get(formNames.email).valueChanges.subscribe(() => this.errorMessage$.next('')),
      this.form.get(formNames.password).valueChanges.subscribe(() => this.errorMessage$.next(''))
    ];
  }

  public submitForm(): void {
    if (this.form.invalid) {
      return;
    }
    this.accessService.login(this.form.value).subscribe(
      data => {
        if (data.isCorrect) {
          this.authService.storeToken(data);
          this.router.navigateByUrl(PathUtils.concatPath(RoutingConfig.home));
        } else {
          this.errorMessage$.next(data.errorMessage);
        }
      });
  }

  public fbRedirect(): void {
    this.accessService.fbRedirect();
  }

  public ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }
}
