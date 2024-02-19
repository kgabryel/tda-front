import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {RoutingConfig} from '../../config/routing.config';
import {IndexComponent} from './pages/index/index.component';
import {NotesResolver} from '../../core/resolvers/notes.resolver';
import {BookmarksResolver} from '../../core/resolvers/bookmarks.resolver';
import {FilesResolver} from '../../core/resolvers/files.resolver';
import {VideosResolver} from '../../core/resolvers/videos.resolver';

const routes: Routes = [
  {
    path: RoutingConfig.home,
    component: IndexComponent,
    resolve: {
      notes: NotesResolver,
      bookmarks: BookmarksResolver,
      files: FilesResolver,
      videos: VideosResolver
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule {
}
