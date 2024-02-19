import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {RoutingConfig} from '../../config/routing.config';
import {IndexComponent} from './pages/index/index.component';
import {CreateComponent} from './pages/create/create.component';
import {ToDoComponent} from './pages/to-do/to-do.component';
import {NotificationTypesResolver} from '../../core/resolvers/notification-types.resolver';
import {TaskComponent} from './pages/task/task.component';
import {MainComponent} from './components/main/main.component';
import {FilesResolver} from '../../core/resolvers/files.resolver';
import {NotesResolver} from '../../core/resolvers/notes.resolver';
import {VideosResolver} from '../../core/resolvers/videos.resolver';
import {BookmarksResolver} from '../../core/resolvers/bookmarks.resolver';

const routes: Routes = [
  {
    path: RoutingConfig.home, component: MainComponent, children: [
      {
        path: RoutingConfig.home, component: IndexComponent, resolve: {
          files: FilesResolver,
          notes: NotesResolver,
          videos: VideosResolver,
          bookmarks: BookmarksResolver
        }
      },
      {
        path: RoutingConfig.create,
        component: CreateComponent,
        resolve: {
          notificationsTypes: NotificationTypesResolver,
          files: FilesResolver,
          notes: NotesResolver,
          videos: VideosResolver,
          bookmarks: BookmarksResolver
        }
      },
      {
        path: RoutingConfig.toDo, component: ToDoComponent, resolve: {
          files: FilesResolver,
          notes: NotesResolver,
          videos: VideosResolver,
          bookmarks: BookmarksResolver
        }
      },
      {
        path: RoutingConfig.byId, component: TaskComponent, resolve: {
          files: FilesResolver,
          notes: NotesResolver,
          videos: VideosResolver,
          bookmarks: BookmarksResolver
        }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TasksRoutingModule {
}
