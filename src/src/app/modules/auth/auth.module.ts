import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {LoginComponent} from './pages/login/login.component';
import {RegisterComponent} from './pages/register/register.component';
import {LoginFormComponent} from './componets/login-form/login-form.component';
import {RegisterFormComponent} from './componets/register-form/register-form.component';
import {FormContainerComponent} from './componets/form-container/form-container.component';
import {ReactiveFormsModule} from '@angular/forms';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {RouterModule} from '@angular/router';
import {MatInputModule} from '@angular/material/input';
import {AuthService} from '../../core/services/auth/auth.service';
import {TranslateModule} from '@ngx-translate/core';
import {FbComponent} from './pages/fb/fb.component';
import {NotificationService} from '../../core/services/notification/notification.service';
import {ResetPasswordComponent as ResetPasswordPageComponent} from './pages/reset-password/reset-password.component';
import {
  ChangePasswordComponent as ChangePasswordPageComponent
} from './pages/change-password/change-password.component';
import {ResetPasswordComponent} from './componets/reset-password/reset-password.component';
import {ChangePasswordComponent} from './componets/change-password/change-password.component';
import {FormModule} from '../form/form.module';
import {SharedModule} from '../shared/shared.module';
import {AccessService} from '../../core/services/access/access.service';
import {PipesModule} from '../pipes/pipes.module';
import {UserService} from '../../core/services/user/user.service';

@NgModule({
  declarations: [
    LoginComponent,
    RegisterComponent,
    LoginFormComponent,
    RegisterFormComponent,
    FormContainerComponent,
    FbComponent,
    ResetPasswordComponent,
    ChangePasswordComponent,
    ResetPasswordPageComponent,
    ChangePasswordPageComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatIconModule,
    MatButtonModule,
    RouterModule,
    MatInputModule,
    TranslateModule,
    FormModule,
    SharedModule,
    PipesModule
  ],
  providers: [
    AuthService,
    AccessService,
    NotificationService,
    UserService
  ]
})
export class AuthModule {
}
