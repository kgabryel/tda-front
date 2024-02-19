import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {Length} from '../../../../config/form.config';
import {catalogsError, CatalogsError} from '../../../../core/errors/catalogs.error';
import {CatalogsFormNames, formNames} from '../../../../core/factories/catalog.factory';
import {Observable, Subject} from 'rxjs';
import {Item} from '../../../../core/models/item';
import {Store} from '@ngrx/store';
import {State as NotesState} from '../../../../core/store/notes/reducers';
import {State as VideosState} from '../../../../core/store/videos/reducers';
import {State as FilesState} from '../../../../core/store/files/reducers';
import {State as AlarmsState} from '../../../../core/store/alarms/reducers';
import {State as TasksState} from '../../../../core/store/tasks/reducers';
import {State as BookmarksState} from '../../../../core/store/bookmarks/reducers';
import {selectNotes} from '../../../../core/store/notes/selectors';
import {map} from 'rxjs/operators';
import {ItemUtils} from '../../../../core/utils/item.utils';
import {selectVideos} from '../../../../core/store/videos/selectors';
import {selectFiles} from '../../../../core/store/files/selectors';
import {selectMainAlarms} from '../../../../core/store/alarms/selectors';
import {selectMainTasks} from '../../../../core/store/tasks/selectors';
import {selectBookmarks} from '../../../../core/store/bookmarks/selectors';

@Component({
  selector: 'catalogs-form',
  templateUrl: './form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FormComponent {

  @Input() public form: FormGroup;
  public maxNameLength: number;
  public errors: CatalogsError;
  public formNames: CatalogsFormNames;
  @Input() public reset$: Subject<void> | undefined = undefined;
  public notes$: Observable<Item[]>;
  public videos$: Observable<Item[]>;
  public files$: Observable<Item[]>;
  public alarms$: Observable<Item[]>;
  public tasks$: Observable<Item[]>;
  public bookmarks$: Observable<Item[]>;

  public constructor(
    notesStore: Store<NotesState>,
    videosStore: Store<VideosState>,
    filesStore: Store<FilesState>,
    alarmsStore: Store<AlarmsState>,
    tasksStore: Store<TasksState>,
    bookmarksStore: Store<BookmarksState>
  ) {
    this.maxNameLength = Length.maxCatalogNameLength;
    this.errors = catalogsError;
    this.formNames = formNames;
    this.notes$ = notesStore.select(selectNotes).pipe(map(notes => ItemUtils.notesToItems(notes)));
    this.videos$ = videosStore.select(selectVideos).pipe(map(videos => ItemUtils.videosToItems(videos)));
    this.files$ = filesStore.select(selectFiles).pipe(map(files => ItemUtils.filesToItems(files)));
    this.alarms$ = alarmsStore.select(selectMainAlarms).pipe(map(alarms => ItemUtils.alarmsToItems(alarms)));
    this.tasks$ = tasksStore.select(selectMainTasks).pipe(map(tasks => ItemUtils.tasksToItems(tasks)));
    this.bookmarks$ = bookmarksStore.select(selectBookmarks).pipe(map(bookmarks => ItemUtils.bookmarksToItems(bookmarks)));
  }
}
