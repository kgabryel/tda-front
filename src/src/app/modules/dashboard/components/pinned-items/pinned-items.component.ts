import {ChangeDetectionStrategy, Component, Input, OnInit} from '@angular/core';
import {Observable} from 'rxjs';
import {Note} from '../../../../core/models/note';
import {Store} from '@ngrx/store';
import {State as NotesState} from '../../../../core/store/notes/reducers';
import {State as BookmarksState} from '../../../../core/store/bookmarks/reducers';
import {selectAssignedToDashboard as selectNotesAssignedToDashboard} from '../../../../core/store/notes/selectors';
import {Bookmark} from '../../../../core/models/bookmark';
import {
  selectAssignedToDashboard as selectBookmarksAssignedToDashboard
} from '../../../../core/store/bookmarks/selectors';
import {Task} from '../../../../core/models/task';
import {State as TasksState} from '../../../../core/store/tasks/reducers';
import {selectTasksForToday} from '../../../../core/store/tasks/selectors';
import {State as CatalogsState} from '../../../../core/store/catalogs/reducers';
import {State as FilesState} from '../../../../core/store/files/reducers';
import {State as VideosState} from '../../../../core/store/videos/reducers';
import {Catalog} from '../../../../core/models/catalog';
import {File} from '../../../../core/models/file';
import {Video} from '../../../../core/models/video';
import {
  selectAssignedToDashboard as selectCatalogsAssignedToDashboard
} from '../../../../core/store/catalogs/selectors';
import {selectAssignedToDashboard as selectFilesAssignedToDashboard} from '../../../../core/store/files/selectors';
import {selectAssignedToDashboard as selectVideosAssignedToDashboard} from '../../../../core/store/videos/selectors';
import {DeleteSheetComponent} from '../../../shared/components/delete-sheet/delete-sheet.component';
import {noteUndoFromDashboard} from '../../../../core/store/notes/actions';
import {bookmarkUndoFromDashboard} from '../../../../core/store/bookmarks/actions';
import {catalogUndoFromDashboard} from '../../../../core/store/catalogs/actions';
import {videoUndoFromDashboard} from '../../../../core/store/videos/actions';
import {fileUndoFromDashboard} from '../../../../core/store/files/actions';
import {MatBottomSheet} from '@angular/material/bottom-sheet';
import {filter} from 'rxjs/operators';
import {TaskStatusContainer} from '../../../../core/containers/task-status.container';

@Component({
  selector: 'dashboard-pinned-items',
  templateUrl: './pinned-items.component.html',
  styleUrls: ['./pinned-items.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PinnedItemsComponent implements OnInit {

  @Input() public small$: Observable<boolean>;
  public notes$: Observable<Note[]>;
  public bookmarks$: Observable<Bookmark[]>;
  public tasks$: Observable<Task[]>;
  public catalogs$: Observable<Catalog[]>;
  public files$: Observable<File[]>;
  public videos$: Observable<Video[]>;
  private noteStore: Store<NotesState>;
  private bookmarkStore: Store<BookmarksState>;
  private taskStore: Store<TasksState>;
  private catalogsStore: Store<CatalogsState>;
  private filesStore: Store<FilesState>;
  private videosStore: Store<VideosState>;
  private deleteSheet: MatBottomSheet;
  private taskStatusContainer: TaskStatusContainer;

  public constructor(
    noteStore: Store<NotesState>,
    bookmarkStore: Store<BookmarksState>,
    taskStore: Store<TasksState>,
    catalogsStore: Store<CatalogsState>,
    filesStore: Store<FilesState>,
    videosStore: Store<VideosState>,
    deleteSheet: MatBottomSheet,
    taskStatusContainer: TaskStatusContainer
  ) {
    this.noteStore = noteStore;
    this.bookmarkStore = bookmarkStore;
    this.taskStore = taskStore;
    this.catalogsStore = catalogsStore;
    this.filesStore = filesStore;
    this.videosStore = videosStore;
    this.deleteSheet = deleteSheet;
    this.taskStatusContainer = taskStatusContainer;
  }

  public ngOnInit(): void {
    this.notes$ = this.noteStore.select(selectNotesAssignedToDashboard);
    this.bookmarks$ = this.bookmarkStore.select(selectBookmarksAssignedToDashboard);
    this.catalogs$ = this.catalogsStore.select(selectCatalogsAssignedToDashboard);
    this.files$ = this.filesStore.select(selectFilesAssignedToDashboard);
    this.videos$ = this.videosStore.select(selectVideosAssignedToDashboard);
    this.tasks$ = this.taskStore.select(selectTasksForToday(
      this.taskStatusContainer.getDoneStatusId(),
      this.taskStatusContainer.getUndoneStatusId()
    ));
  }

  public removeNote(id: number): void {
    const sheetRef = this.deleteSheet.open(DeleteSheetComponent);
    sheetRef.afterDismissed()
      .pipe(filter(action => action))
      .subscribe(() => this.noteStore.dispatch(noteUndoFromDashboard({id})));
  }

  public removeBookmark(id: number): void {
    const sheetRef = this.deleteSheet.open(DeleteSheetComponent);
    sheetRef.afterDismissed()
      .pipe(filter(action => action))
      .subscribe(() => this.bookmarkStore.dispatch(bookmarkUndoFromDashboard({id})));
  }

  public removeFile(id: number): void {
    const sheetRef = this.deleteSheet.open(DeleteSheetComponent);
    sheetRef.afterDismissed()
      .pipe(filter(action => action))
      .subscribe(() => this.filesStore.dispatch(fileUndoFromDashboard({id})));
  }

  public removeVideo(id: number): void {
    const sheetRef = this.deleteSheet.open(DeleteSheetComponent);
    sheetRef.afterDismissed()
      .pipe(filter(action => action))
      .subscribe(() => this.videosStore.dispatch(videoUndoFromDashboard({id})));
  }

  public removeCatalog(id: number): void {
    const sheetRef = this.deleteSheet.open(DeleteSheetComponent);
    sheetRef.afterDismissed()
      .pipe(filter(action => action))
      .subscribe(() => this.catalogsStore.dispatch(catalogUndoFromDashboard({id})));
  }
}
