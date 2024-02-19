import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {Observable} from 'rxjs';
import {Item} from '../../../../core/models/item';
import {selectVideos} from '../../../../core/store/videos/selectors';
import {map} from 'rxjs/operators';
import {selectFiles} from '../../../../core/store/files/selectors';
import {selectBookmarks} from '../../../../core/store/bookmarks/selectors';
import {selectNotes} from '../../../../core/store/notes/selectors';
import {Store} from '@ngrx/store';
import {State as NotesState} from '../../../../core/store/notes/reducers';
import {State as VideosState} from '../../../../core/store/videos/reducers';
import {State as FilesState} from '../../../../core/store/files/reducers';
import {State as BookmarksState} from '../../../../core/store/bookmarks/reducers';
import {FormGroup} from '@angular/forms';
import {formNames, TasksFormNames} from '../../../../core/factories/task.factory';
import {ItemUtils} from '../../../../core/utils/item.utils';
import {selectCatalogs} from '../../../../core/store/catalogs/selectors';
import {State as CatalogsState} from '../../../../core/store/catalogs/reducers';

@Component({
  selector: 'tasks-single-pinned-part',
  templateUrl: './pinned-part.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PinnedPartComponent {

  public notes$: Observable<Item[]>;
  public videos$: Observable<Item[]>;
  public files$: Observable<Item[]>;
  public bookmarks$: Observable<Item[]>;
  public catalogs$: Observable<Item[]>;
  @Input() public reset$: Observable<void>;
  @Input() public form: FormGroup;
  public formNames: TasksFormNames;

  public constructor(
    catalogsStore: Store<CatalogsState>,
    notesStore: Store<NotesState>,
    videosStore: Store<VideosState>,
    filesStore: Store<FilesState>,
    bookmarksStore: Store<BookmarksState>
  ) {
    this.formNames = formNames;
    this.catalogs$ = catalogsStore.select(selectCatalogs).pipe(map(catalogs => ItemUtils.catalogsToItems(catalogs)));
    this.videos$ = videosStore.select(selectVideos)
      .pipe(map(videos => ItemUtils.videosToItems(videos)));
    this.notes$ = notesStore.select(selectNotes)
      .pipe(map(notes => ItemUtils.notesToItems(notes)));
    this.files$ = filesStore.select(selectFiles)
      .pipe(map(files => ItemUtils.filesToItems(files)));
    this.bookmarks$ = bookmarksStore.select(selectBookmarks)
      .pipe(map(bookmarks => ItemUtils.bookmarksToItems(bookmarks)));
  }
}
