import {ChangeDetectionStrategy, Component, OnDestroy, OnInit} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {PathUtils} from '../../../../core/utils/path.utils';
import {RoutingConfig} from '../../../../config/routing.config';
import {AuthService} from '../../../../core/services/auth/auth.service';
import {Router} from '@angular/router';
import {AuthFormFactory, AuthFormNames, formNames} from '../../../../core/factories/auth-form.factory';
import {authErrors, AuthErrors} from '../../../../core/errors/auth.error';
import {AccessService} from '../../../../core/services/access/access.service';
import {BehaviorSubject, Subscription} from 'rxjs';

@Component({
  selector: 'auth-register-form',
  templateUrl: './register-form.component.html',
  styleUrls: ['../../shared/scss/form.scss', './register-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RegisterFormComponent implements OnInit, OnDestroy {

  public form: FormGroup;
  public loginPath: string;
  public errorMessage$: BehaviorSubject<string>;
  public errors: AuthErrors;
  public formNames: AuthFormNames;
  private accessService: AccessService;
  private authService: AuthService;
  private router: Router;
  private subscriptions: Subscription[];

  public constructor(accessService: AccessService, authService: AuthService, router: Router) {
    this.loginPath = PathUtils.concatPath(RoutingConfig.login);
    this.accessService = accessService;
    this.authService = authService;
    this.router = router;
    this.errors = authErrors;
    this.formNames = formNames;
    this.errorMessage$ = new BehaviorSubject<string>('');
  }

  public ngOnInit(): void {
    this.form = AuthFormFactory.getRegisterForm();
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
    let request = this.form.value;
    request.lang = localStorage.getItem('lang') ?? 'pl';
    this.accessService.register(request).subscribe(
      data => {
        if (data.isCorrect) {
          this.authService.storeToken(data);
          this.router.navigateByUrl(PathUtils.concatPath(RoutingConfig.home));
        } else {
          this.errorMessage$.next(data.errorMessage);
        }
      });
  }

  public ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }
}
