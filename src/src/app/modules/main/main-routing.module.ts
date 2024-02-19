import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {MainComponent} from './components/main/main.component';
import {RoutingConfig} from '../../config/routing.config';
import {NotFoundComponent} from './pages/not-found/not-found.component';
import {AlarmsResolver} from '../../core/resolvers/alarms.resolver';
import {TasksResolver} from '../../core/resolvers/tasks.resolver';
import {TaskStatusesResolver} from '../../core/resolvers/task-statuses.resolver';
import {CatalogsResolver} from '../../core/resolvers/catalogs.resolver';
import {SettingsResolver} from '../../core/resolvers/settings.resolver';

const routes: Routes = [
  {
    path: RoutingConfig.home, component: MainComponent,
    resolve: {
      alarms: AlarmsResolver,
      tasks: TasksResolver,
      taskStatuses: TaskStatusesResolver,
      catalogs: CatalogsResolver,
      settings: SettingsResolver
    },
    children: [
      {
        path: RoutingConfig.alarms,
        loadChildren: () => import('../alarms/alarms.module').then(m => m.AlarmsModule)
      },
      {
        path: RoutingConfig.tasks,
        loadChildren: () => import('../tasks/tasks.module').then(m => m.TasksModule)
      },
      {
        path: RoutingConfig.files,
        loadChildren: () => import('../files/files.module').then(m => m.FilesModule)
      },
      {
        path: RoutingConfig.notes,
        loadChildren: () => import('../notes/notes.module').then(m => m.NotesModule)
      },
      {
        path: RoutingConfig.bookmarks,
        loadChildren: () => import('../bookmarks/bookmarks.module').then(m => m.BookmarksModule)
      },
      {
        path: RoutingConfig.videos,
        loadChildren: () => import('../videos/videos.module').then(m => m.VideosModule)
      },
      {
        path: RoutingConfig.catalogs,
        loadChildren: () => import('../catalogs/catalogs.module').then(m => m.CatalogsModule)
      },
      {
        path: RoutingConfig.settings,
        loadChildren: () => import('../settings/settings.module').then(m => m.SettingsModule)
      },
      {
        path: RoutingConfig.home,
        loadChildren: () => import('../dashboard/dashboard.module').then(m => m.DashboardModule)
      },
      {path: RoutingConfig.any, component: NotFoundComponent}
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MainRoutingModule {
}
