import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {RoutingConfig} from '../../config/routing.config';
import {IndexComponent} from './pages/index/index.component';
import {VideosResolver} from '../../core/resolvers/videos.resolver';

const routes: Routes = [
  {path: RoutingConfig.home, component: IndexComponent, resolve: {videos: VideosResolver}}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VideosRoutingModule {
}
