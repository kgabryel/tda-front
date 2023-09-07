import {ChangeDetectionStrategy, Component} from '@angular/core';

@Component({
  selector: 'auth-page-login',
  templateUrl: './login.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginComponent {
}
