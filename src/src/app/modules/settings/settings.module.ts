import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {IndexComponent} from './pages/index/index.component';
import {StoreModule} from '@ngrx/store';
import {key as colorsKey, reducer as colorsReducer} from '../../core/store/colors/reducers';
import {EffectsModule} from '@ngrx/effects';
import {ColorsEffects} from '../../core/store/colors/effects';
import {ColorsService} from '../../core/services/colors/colors.service';
import {ColorsResolver} from '../../core/resolvers/colors.resolver';
import {SettingsRoutingModule} from './settings-routing.module';
import {AddColorComponent} from './components/add-color/add-color.component';
import {ColorsComponent} from './components/colors/colors.component';
import {MatCardModule} from '@angular/material/card';
import {TranslateModule} from '@ngx-translate/core';
import {ReactiveFormsModule} from '@angular/forms';
import {MatButtonModule} from '@angular/material/button';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {TableModule} from 'primeng/table';
import {MatIconModule} from '@angular/material/icon';
import {MatTooltipModule} from '@angular/material/tooltip';
import {ClipboardModule} from '@angular/cdk/clipboard';
import {MenuComponent} from './components/menu/menu.component';
import {MatTabsModule} from '@angular/material/tabs';
import {ChangePasswordComponent} from './components/change-password/change-password.component';
import {ManageEmailComponent} from './components/manage-email/manage-email.component';
import {ConfirmEmailComponent} from './pages/confirm-email/confirm-email.component';
import {SettingsComponent} from './components/settings/settings.component';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatSelectModule} from '@angular/material/select';
import {FormModule} from '../form/form.module';
import {PipesModule} from '../pipes/pipes.module';

@NgModule({
  declarations: [
    IndexComponent,
    AddColorComponent,
    ColorsComponent,
    MenuComponent,
    ChangePasswordComponent,
    ManageEmailComponent,
    ConfirmEmailComponent,
    SettingsComponent
  ],
  imports: [
    CommonModule,
    SettingsRoutingModule,
    StoreModule.forFeature(colorsKey, colorsReducer),
    EffectsModule.forFeature([ColorsEffects]),
    MatCardModule,
    TranslateModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    TableModule,
    MatIconModule,
    MatTooltipModule,
    ClipboardModule,
    MatTabsModule,
    MatSlideToggleModule,
    MatSelectModule,
    FormModule,
    PipesModule
  ],
  providers: [
    ColorsService,
    ColorsResolver
  ]
})
export class SettingsModule {
}
