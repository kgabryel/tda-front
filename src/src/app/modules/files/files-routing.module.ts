import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {RoutingConfig} from '../../config/routing.config';
import {IndexComponent} from './pages/index/index.component';
import {FilesResolver} from '../../core/resolvers/files.resolver';

const routes: Routes = [
  {
    path: RoutingConfig.home,
    component: IndexComponent,
    resolve: {files: FilesResolver}
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FilesRoutingModule {
}
