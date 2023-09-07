import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MenuSidenavComponent} from './components/menu-sidenav/menu-sidenav.component';
import {MenuElementComponent} from './components/menu-element/menu-element.component';
import {SidenavService} from '../../core/services/sidenav/sidenav.service';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatListModule} from '@angular/material/list';
import {MatToolbarModule} from '@angular/material/toolbar';
import {RouterModule} from '@angular/router';
import {TasksComponent} from './components/tasks/tasks.component';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatBottomSheetModule} from '@angular/material/bottom-sheet';
import {TaskComponent} from './components/task/task.component';
import {TranslateModule} from '@ngx-translate/core';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatExpansionModule} from '@angular/material/expansion';

@NgModule({
  declarations: [MenuSidenavComponent, MenuElementComponent, TasksComponent, TaskComponent],
  imports: [
    CommonModule,
    MatSidenavModule,
    MatListModule,
    MatSidenavModule,
    MatToolbarModule,
    RouterModule,
    MatButtonModule,
    MatIconModule,
    MatBottomSheetModule,
    TranslateModule,
    MatTooltipModule,
    MatExpansionModule
  ],
  exports: [
    MenuSidenavComponent
  ],
  providers: [
    SidenavService
  ]
})
export class MenuModule {
}
