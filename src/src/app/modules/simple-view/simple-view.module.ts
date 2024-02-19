import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {AlarmSingleComponent} from './components/alarm-single/alarm-single.component';
import {BookmarkComponent} from './components/bookmark/bookmark.component';
import {FileComponent} from './components/file/file.component';
import {NoteComponent} from './components/note/note.component';
import {TaskSingleComponent} from './components/task-single/task-single.component';
import {VideoComponent} from './components/video/video.component';
import {CatalogComponent} from './components/catalog/catalog.component';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatTooltipModule} from '@angular/material/tooltip';
import {TranslateModule} from '@ngx-translate/core';
import {RouterModule} from '@angular/router';
import {AlarmPeriodicComponent} from './components/alarm-periodic/alarm-periodic.component';
import {TaskPeriodicComponent} from './components/task-periodic/task-periodic.component';
import {PipesModule} from '../pipes/pipes.module';
import {ProgressBarComponent} from './components/progress-bar/progress-bar.component';
import {MatProgressBarModule} from '@angular/material/progress-bar';

@NgModule({
  declarations: [
    AlarmSingleComponent,
    AlarmPeriodicComponent,
    BookmarkComponent,
    FileComponent,
    NoteComponent,
    TaskSingleComponent,
    TaskPeriodicComponent,
    VideoComponent,
    CatalogComponent,
    ProgressBarComponent
  ],
  exports: [
    TaskSingleComponent,
    TaskPeriodicComponent,
    AlarmSingleComponent,
    AlarmPeriodicComponent,
    VideoComponent,
    FileComponent,
    BookmarkComponent,
    NoteComponent,
    CatalogComponent,
    ProgressBarComponent
  ],
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    TranslateModule,
    RouterModule,
    PipesModule,
    MatProgressBarModule
  ]
})
export class SimpleViewModule {
}
