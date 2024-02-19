import {ChangeDetectionStrategy, Component, OnDestroy, OnInit} from '@angular/core';
import {BehaviorSubject, Observable, Subscription} from 'rxjs';
import {FormControl} from '@angular/forms';
import {Store} from '@ngrx/store';
import {State} from '../../../../core/store/settings/reducers';
import {selectEmail, selectEmailState} from '../../../../core/store/settings/selectors';
import {changeEmail} from '../../../../core/store/settings/actions';
import {UserService} from '../../../../core/services/user/user.service';
import {catchError} from 'rxjs/operators';
import {NotificationService} from '../../../../core/services/notification/notification.service';

@Component({
  selector: 'settings-manage-email',
  templateUrl: './manage-email.component.html',
  styleUrls: ['./manage-email.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ManageEmailComponent implements OnInit, OnDestroy {

  public state$: Observable<number>;
  public emailField: FormControl;
  public edit$: BehaviorSubject<boolean>;
  private store: Store<State>;
  private userService: UserService;
  private notificationService: NotificationService;
  private subscriptions: Subscription[];

  public constructor(store: Store<State>, userService: UserService, notificationService: NotificationService) {
    this.store = store;
    this.notificationService = notificationService;
    this.edit$ = new BehaviorSubject<boolean>(false);
    this.emailField = new FormControl({value: '', disabled: !this.edit$.getValue()});
    this.userService = userService;
  }

  public ngOnInit(): void {
    this.state$ = this.store.select(selectEmailState);
    this.subscriptions = [
      this.store.select(selectEmail).subscribe(email => this.emailField.setValue(email)),
      this.edit$.subscribe(data => data ? this.emailField.enable() : this.emailField.disable())
    ];
  }

  public deleteEmail(): void {
    this.store.dispatch(changeEmail({email: null}));
    this.edit$.next(false);
  }

  public changeEmail(): void {
    this.store.dispatch(changeEmail({email: this.emailField.value}));
    this.edit$.next(false);
  }

  public startEdit(): void {
    this.emailField.enable();
    this.edit$.next(true);
  }

  public stopEdit(): void {
    this.emailField.disable();
    this.edit$.next(false);
  }

  public sendCode(): void {
    this.userService.sendCode().pipe(
      catchError((error) => {
        this.notificationService.showError(error.status);
        return undefined;
      })
    ).subscribe(result => {
      if (result !== undefined) {
        this.notificationService.showMessage('settings.codeSentMessage');
      }
    });
  }

  public ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }
}
