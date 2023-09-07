import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ToolbarComponent} from './components/toolbar/toolbar.component';
import {MatIconModule} from '@angular/material/icon';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatButtonModule} from '@angular/material/button';
import {LogoutComponent} from './components/logout/logout.component';
import {MatBadgeModule} from '@angular/material/badge';
import {NotificationComponent} from './components/notification/notification.component';
import {MenuComponent} from './components/menu/menu.component';
import {TasksComponent} from './components/tasks/tasks.component';
import {TranslateModule} from '@ngx-translate/core';
import {RouterModule} from '@angular/router';
import {SearchButtonComponent} from './components/search-button/search-button.component';
import {SharedModule} from '../shared/shared.module';
import {PipesModule} from '../pipes/pipes.module';
import {MatTooltipModule} from '@angular/material/tooltip';

@NgModule({
  declarations: [
    ToolbarComponent,
    LogoutComponent,
    NotificationComponent,
    MenuComponent,
    TasksComponent,
    SearchButtonComponent],
  exports: [ToolbarComponent],
  imports: [
    CommonModule,
    MatIconModule,
    MatToolbarModule,
    MatButtonModule,
    MatBadgeModule,
    TranslateModule,
    RouterModule,
    SharedModule,
    PipesModule,
    MatTooltipModule
  ]
})
export class HeaderModule {
}
