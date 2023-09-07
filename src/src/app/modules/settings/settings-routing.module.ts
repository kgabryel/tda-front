import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {RoutingConfig} from '../../config/routing.config';
import {IndexComponent} from './pages/index/index.component';
import {ColorsResolver} from '../../core/resolvers/colors.resolver';
import {ConfirmEmailComponent} from './pages/confirm-email/confirm-email.component';

const routes: Routes = [
  {path: RoutingConfig.home, component: IndexComponent, resolve: {colors: ColorsResolver}},
  {path: RoutingConfig.confirmEmail, component: ConfirmEmailComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SettingsRoutingModule {
}
