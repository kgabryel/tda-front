import {ChangeDetectionStrategy, Component} from '@angular/core';

@Component({
  selector: 'auth-page-register',
  templateUrl: './register.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RegisterComponent {
}
