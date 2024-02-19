import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MainComponent} from './components/main/main.component';
import {MainRoutingModule} from './main-routing.module';
import {SidenavService} from '../../core/services/sidenav/sidenav.service';
import {LayoutConfig} from '../../config/layout.config';
import {MenuModule} from '../menu/menu.module';
import {HeaderModule} from '../header/header.module';
import {NotificationService} from '../../core/services/notification/notification.service';
import {HTTP_INTERCEPTORS, HttpClient, HttpClientModule} from '@angular/common/http';
import {TasksService} from '../../core/services/tasks/tasks.service';
import {TokenInterceptor} from '../../core/interceptors/token/token.interceptor';
import {AuthInterceptor} from '../../core/interceptors/auth/auth.interceptor';
import {NotFoundComponent} from './pages/not-found/not-found.component';
import {MatCardModule} from '@angular/material/card';
import {MatButtonModule} from '@angular/material/button';
import {TranslateModule} from '@ngx-translate/core';
import {DownloadProgressService} from '../../core/services/download-progress/download-progress.service';
import {ModalService} from '../../core/services/modal/modal.service';
import {SearchService} from '../../core/services/search/search.service';
import {NotesSearchService} from '../../core/services/notes-search/notes-search.service';
import {CatalogsSearchService} from '../../core/services/catalogs-search/catalogs-search.service';
import {TasksSearchService} from '../../core/services/tasks-search/tasks-search.service';
import {AlarmsSearchService} from '../../core/services/alarms-search/alarms-search.service';
import {FilesSearchService} from '../../core/services/files-search/files-search.service';
import {VideosSearchService} from '../../core/services/videos-search/videos-search.service';
import {BookmarksSearchService} from '../../core/services/bookmarks-search/bookmarks-search.service';
import {CatalogsService} from '../../core/services/catalogs/catalogs.service';
import {CatalogsResolver} from '../../core/resolvers/catalogs.resolver';
import {StoreModule} from '@ngrx/store';
import {key as tasksKey, reducer as tasksReducer} from '../../core/store/tasks/reducers';
import {key as alarmsKey, reducer as alarmsReducer} from '../../core/store/alarms/reducers';
import {key as statusesKey, reducer as statusesReducer} from '../../core/store/tasks-statuses/reducers';
import {key as catalogsKey, reducer as catalogsReducer} from '../../core/store/catalogs/reducers';
import {EffectsModule} from '@ngrx/effects';
import {AlarmsEffects} from '../../core/store/alarms/effects';
import {TasksEffects} from '../../core/store/tasks/effects';
import {TasksStatusesEffects} from '../../core/store/tasks-statuses/effects';
import {CatalogsEffects} from '../../core/store/catalogs/effects';
import {AlarmsService} from '../../core/services/alarms/alarms.service';
import {AlarmsResolver} from '../../core/resolvers/alarms.resolver';
import {TasksResolver} from '../../core/resolvers/tasks.resolver';
import {TaskStatusesResolver} from '../../core/resolvers/task-statuses.resolver';
import {SettingsEffects} from '../../core/store/settings/effects';
import {key as settingsKey, reducer as settingsReducer} from '../../core/store/settings/reducers';
import {SettingsResolver} from '../../core/resolvers/settings.resolver';
import {UserService} from '../../core/services/user/user.service';
import {PushNotificationService} from '../../core/services/push-notification/push-notification.service';

@NgModule({
  declarations: [MainComponent, NotFoundComponent],
  imports: [
    CommonModule,
    MainRoutingModule,
    MenuModule,
    HeaderModule,
    HttpClientModule,
    MatCardModule,
    MatButtonModule,
    TranslateModule,
    StoreModule.forFeature(tasksKey, tasksReducer),
    StoreModule.forFeature(alarmsKey, alarmsReducer),
    StoreModule.forFeature(statusesKey, statusesReducer),
    StoreModule.forFeature(catalogsKey, catalogsReducer),
    StoreModule.forFeature(settingsKey, settingsReducer),
    EffectsModule.forFeature([AlarmsEffects, TasksEffects, TasksStatusesEffects, CatalogsEffects, SettingsEffects])
  ],
  providers: [
    {provide: LayoutConfig.menuServiceName, useClass: SidenavService},
    SidenavService,
    NotificationService,
    HttpClient,
    {provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true},
    {provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true},
    DownloadProgressService,
    ModalService,
    SearchService,
    NotesSearchService,
    CatalogsSearchService,
    TasksSearchService,
    AlarmsSearchService,
    FilesSearchService,
    VideosSearchService,
    BookmarksSearchService,
    AlarmsService,
    AlarmsResolver,
    TasksService,
    TasksResolver,
    TaskStatusesResolver,
    CatalogsService,
    CatalogsResolver,
    SettingsResolver,
    UserService,
    PushNotificationService
  ]
})
export class MainModule {
}
