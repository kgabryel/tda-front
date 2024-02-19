import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {RoutingConfig} from '../../config/routing.config';
import {CreateComponent} from './pages/create/create.component';
import {IndexComponent} from './pages/index/index.component';
import {NotificationTypesResolver} from '../../core/resolvers/notification-types.resolver';
import {DeactivateAlarmComponent} from './pages/deactivate-alarm/deactivate-alarm.component';
import {AlarmComponent} from './pages/alarm/alarm.component';
import {MainComponent} from './components/main/main.component';

const routes: Routes = [
  {
    path: RoutingConfig.home, component: MainComponent, children: [
      {
        path: RoutingConfig.home,
        component: IndexComponent,
        resolve: {notificationsTypes: NotificationTypesResolver}
      },
      {
        path: RoutingConfig.create,
        component: CreateComponent,
        resolve: {notificationsTypes: NotificationTypesResolver}
      },
      {path: RoutingConfig.deactivateSingle, component: DeactivateAlarmComponent},
      {
        path: RoutingConfig.byId,
        component: AlarmComponent,
        resolve: {notificationsTypes: NotificationTypesResolver}
      }
    ]
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AlarmsRoutingModule {
}
