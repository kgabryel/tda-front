import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {RoutingConfig} from '../../config/routing.config';
import {IndexComponent} from './pages/index/index.component';
import {NotesResolver} from '../../core/resolvers/notes.resolver';
import {ColorsResolver} from '../../core/resolvers/colors.resolver';
import {NoteComponent} from './pages/note/note.component';

const routes: Routes = [
  {
    path: RoutingConfig.home,
    component: IndexComponent,
    resolve: {notes: NotesResolver, colors: ColorsResolver}
  },
  {
    path: RoutingConfig.byId,
    component: NoteComponent,
    resolve: {notes: NotesResolver, colors: ColorsResolver}
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NotesRoutingModule {
}
