import {ChangeDetectionStrategy, Component, Input, OnInit} from '@angular/core';
import {Catalog} from '../../../../core/models/catalog';
import {State as NotesState} from '../../../../core/store/notes/reducers';
import {State as VideosState} from '../../../../core/store/videos/reducers';
import {State as FilesState} from '../../../../core/store/files/reducers';
import {State as AlarmsState} from '../../../../core/store/alarms/reducers';
import {State as TasksState} from '../../../../core/store/tasks/reducers';
import {State as BookmarksState} from '../../../../core/store/bookmarks/reducers';
import {State as CatalogsState} from '../../../../core/store/catalogs/reducers';
import {Store} from '@ngrx/store';
import {Observable} from 'rxjs';
import {Video} from '../../../../core/models/video';
import {File} from '../../../../core/models/file';
import {findForCatalog as findVideos} from '../../../../core/store/videos/selectors';
import {findForCatalog as findFiles} from '../../../../core/store/files/selectors';
import {findForCatalog as findNotes} from '../../../../core/store/notes/selectors';
import {findForCatalog as findAlarms} from '../../../../core/store/alarms/selectors';
import {findForCatalog as findTasks} from '../../../../core/store/tasks/selectors';
import {findForCatalog as findBookmarks} from '../../../../core/store/bookmarks/selectors';
import {Note} from '../../../../core/models/note';
import {Alarm} from '../../../../core/models/alarm';
import {Task} from '../../../../core/models/task';
import {Bookmark} from '../../../../core/models/bookmark';
import {DeleteSheetComponent} from '../../../shared/components/delete-sheet/delete-sheet.component';
import * as actions from '../../../../core/store/catalogs/actions';
import {MatBottomSheet} from '@angular/material/bottom-sheet';
import {SidenavService} from '../../../../core/services/sidenav/sidenav.service';
import {filter, map} from 'rxjs/operators';
import {StringUtils} from '../../../../core/utils/string.utils';

@Component({
  selector: 'catalogs-catalog',
  templateUrl: './catalog.component.html',
  styleUrls: ['./catalog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CatalogComponent implements OnInit {

  @Input() public catalog: Catalog;
  public videos$: Observable<Video[]>;
  public files$: Observable<File[]>;
  public notes$: Observable<Note[]>;
  public alarms$: Observable<Alarm[]>;
  public tasks$: Observable<Task[]>;
  public bookmarks$: Observable<Bookmark[]>;
  public activeIndex: number;
  @Input() public previewAvailable: boolean = true;
  private readonly notesStore: Store<NotesState>;
  private readonly videosStore: Store<VideosState>;
  private readonly filesStore: Store<FilesState>;
  private readonly alarmsStore: Store<AlarmsState>;
  private readonly tasksStore: Store<TasksState>;
  private readonly bookmarksStore: Store<BookmarksState>;
  private catalogsStore: Store<CatalogsState>;
  private deleteSheet: MatBottomSheet;
  private sidenavService: SidenavService<Catalog>;

  public constructor(
    notesStore: Store<NotesState>,
    videosStore: Store<VideosState>,
    filesStore: Store<FilesState>,
    alarmsStore: Store<AlarmsState>,
    tasksStore: Store<TasksState>,
    bookmarksStore: Store<BookmarksState>,
    catalogsStore: Store<CatalogsState>,
    sidenavService: SidenavService<Catalog>,
    deleteSheet: MatBottomSheet
  ) {
    this.notesStore = notesStore;
    this.videosStore = videosStore;
    this.filesStore = filesStore;
    this.alarmsStore = alarmsStore;
    this.tasksStore = tasksStore;
    this.bookmarksStore = bookmarksStore;
    this.catalogsStore = catalogsStore;
    this.sidenavService = sidenavService;
    this.deleteSheet = deleteSheet;
  }

  public ngOnInit(): void {
    this.activeIndex = this.findActiveIndex();
    this.videos$ = this.videosStore.select(findVideos(this.catalog))
      .pipe(map(videos => videos.sort((a, b) => StringUtils.compareString(a.name, b.name))));
    this.files$ = this.filesStore.select(findFiles(this.catalog))
      .pipe(map(files => files.sort((a, b) => StringUtils.compareString(a.name, b.name))));
    this.notes$ = this.notesStore.select(findNotes(this.catalog))
      .pipe(map(notes => notes.sort((a, b) => StringUtils.compareString(a.name, b.name))));
    this.alarms$ = this.alarmsStore.select(findAlarms(this.catalog))
      .pipe(map(alarms => alarms.sort((a, b) => StringUtils.compareString(a.name, b.name))));
    this.tasks$ = this.tasksStore.select(findTasks(this.catalog))
      .pipe(map(tasks => tasks.sort((a, b) => StringUtils.compareString(a.name, b.name))));
    this.bookmarks$ = this.bookmarksStore.select(findBookmarks(this.catalog));
  }

  public edit(): void {
    this.sidenavService.changeStatus({
      open: true,
      model: this.catalog
    });
  }

  public delete(): void {
    const sheetRef = this.deleteSheet.open(DeleteSheetComponent);
    sheetRef.afterDismissed()
      .pipe(filter(action => action))
      .subscribe(() => this.catalogsStore.dispatch(actions.catalogDelete({id: this.catalog.id})));
  }

  public removeAlarm(alarmId: string): void {
    const sheetRef = this.deleteSheet.open(DeleteSheetComponent);
    sheetRef.afterDismissed()
      .pipe(filter(action => action))
      .subscribe(() => this.catalogsStore.dispatch(actions.alarmRemove({catalogId: this.catalog.id, alarmId})));
  }

  public removeTask(taskId: string): void {
    const sheetRef = this.deleteSheet.open(DeleteSheetComponent);
    sheetRef.afterDismissed()
      .pipe(filter(action => action))
      .subscribe(() => this.catalogsStore.dispatch(actions.taskRemove({catalogId: this.catalog.id, taskId})));
  }

  public removeNote(noteId: number): void {
    const sheetRef = this.deleteSheet.open(DeleteSheetComponent);
    sheetRef.afterDismissed()
      .pipe(filter(action => action))
      .subscribe(() => this.catalogsStore.dispatch(actions.noteRemove({catalogId: this.catalog.id, noteId})));
  }

  public removeBookmark(bookmarkId: number): void {
    const sheetRef = this.deleteSheet.open(DeleteSheetComponent);
    sheetRef.afterDismissed()
      .pipe(filter(action => action))
      .subscribe(() => this.catalogsStore.dispatch(actions.bookmarkRemove({catalogId: this.catalog.id, bookmarkId})));
  }

  public removeFile(fileId: number): void {
    const sheetRef = this.deleteSheet.open(DeleteSheetComponent);
    sheetRef.afterDismissed()
      .pipe(filter(action => action))
      .subscribe(() => this.catalogsStore.dispatch(actions.fileRemove({catalogId: this.catalog.id, fileId})));
  }

  public removeVideo(videoId: number): void {
    const sheetRef = this.deleteSheet.open(DeleteSheetComponent);
    sheetRef.afterDismissed()
      .pipe(filter(action => action))
      .subscribe(() => this.catalogsStore.dispatch(actions.videoRemove({catalogId: this.catalog.id, videoId})));
  }

  private findActiveIndex(): number {
    if (this.catalog.tasks.length > 0) {
      return 0;
    } else if (this.catalog.alarms.length > 0) {
      return 1;
    } else if (this.catalog.notes.length > 0) {
      return 2;
    } else if (this.catalog.bookmarks.length > 0) {
      return 3;
    } else if (this.catalog.files.length > 0) {
      return 4;
    } else if (this.catalog.videos.length > 0) {
      return 5;
    }
    return -1;
  }
}
