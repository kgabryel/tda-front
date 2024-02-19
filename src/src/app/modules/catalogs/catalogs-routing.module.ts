import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {RoutingConfig} from '../../config/routing.config';
import {IndexComponent} from './pages/index/index.component';
import {VideosResolver} from '../../core/resolvers/videos.resolver';
import {FilesResolver} from '../../core/resolvers/files.resolver';
import {NotesResolver} from '../../core/resolvers/notes.resolver';
import {BookmarksResolver} from '../../core/resolvers/bookmarks.resolver';
import {CatalogComponent} from './pages/catalog/catalog.component';

const routes: Routes = [
  {
    path: RoutingConfig.home,
    component: IndexComponent,
    resolve: {
      files: FilesResolver,
      notes: NotesResolver,
      videos: VideosResolver,
      bookmarks: BookmarksResolver
    }
  },
  {
    path: RoutingConfig.byId,
    component: CatalogComponent,
    resolve: {
      files: FilesResolver,
      notes: NotesResolver,
      videos: VideosResolver,
      bookmarks: BookmarksResolver
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CatalogsRoutingModule {
}
