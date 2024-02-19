import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {AlarmUrlPipe} from './pipes/alarm-url/alarm-url.pipe';
import {CatalogUrlPipe} from './pipes/catalog-url/catalog-url.pipe';
import {EmptyStringPipe} from './pipes/empty-string/empty-string.pipe';
import {PinnedTooltipPipe} from './pipes/pinned-tooltip/pinned-tooltip.pipe';
import {TaskUrlPipe} from './pipes/task-url/task-url.pipe';
import {NoteUrlPipe} from './pipes/note-url/note-url.pipe';
import {FileSizePipe} from './pipes/file-size/file-size.pipe';
import {AutocompletePipe} from './pipes/autocomplete/autocomplete.pipe';

@NgModule({
  declarations: [
    AlarmUrlPipe,
    CatalogUrlPipe,
    EmptyStringPipe,
    PinnedTooltipPipe,
    TaskUrlPipe,
    NoteUrlPipe,
    FileSizePipe,
    AutocompletePipe
  ],
  exports: [
    EmptyStringPipe,
    AlarmUrlPipe,
    TaskUrlPipe,
    PinnedTooltipPipe,
    CatalogUrlPipe,
    NoteUrlPipe,
    FileSizePipe,
    AutocompletePipe
  ],
  imports: [
    CommonModule
  ]
})
export class PipesModule {
}
