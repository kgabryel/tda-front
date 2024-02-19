import {ChangeDetectionStrategy, Component, Input, OnDestroy, OnInit} from '@angular/core';
import {BehaviorSubject, combineLatest, Observable, Subscription} from 'rxjs';
import {Bookmark} from '../../../../core/models/bookmark';
import {Item} from '../../../../core/models/item';
import {Store} from '@ngrx/store';
import {State as BookmarksState} from '../../../../core/store/bookmarks/reducers';
import {State as TasksState} from '../../../../core/store/tasks/reducers';
import {FormControl, FormGroup} from '@angular/forms';
import {MatBottomSheet} from '@angular/material/bottom-sheet';
import {formNames, PinnedFactory} from '../../../../core/factories/pinned.factory';
import {selectPinned, selectTask} from '../../../../core/store/tasks/selectors';
import {filter, map, switchMap} from 'rxjs/operators';
import {DeleteSheetComponent} from '../../../shared/components/delete-sheet/delete-sheet.component';
import {bookmarkAdd, bookmarkRemove} from '../../../../core/store/tasks/actions';
import {FormUtils} from '../../../../core/utils/form.utils';
import {StringUtils} from '../../../../core/utils/string.utils';
import {ItemUtils} from '../../../../core/utils/item.utils';
import {Pinned} from '../../../../core/models/pinned';
import {PinnedItems} from '../../../../core/models/task';
import {searchPinnedWithSubtasks, selectExpect} from '../../../../core/store/bookmarks/selectors';

@Component({
  selector: 'tasks-bookmarks',
  templateUrl: './bookmarks.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BookmarksComponent implements OnInit, OnDestroy {

  @Input() public taskId: string;
  public name: FormControl;
  public bookmarks$: Observable<Pinned<Bookmark>[]>;
  public availableBookmarks$: Observable<Item[]>;
  public form: FormGroup;
  public editable$: Observable<boolean>;
  private bookmarksStore: Store<BookmarksState>;
  private tasksStore: Store<TasksState>;
  private deleteSheet: MatBottomSheet;
  private searched$: BehaviorSubject<string>;
  private subscription: Subscription;

  public constructor(
    bookmarksStore: Store<BookmarksState>,
    tasksStore: Store<TasksState>,
    deleteSheet: MatBottomSheet) {
    this.bookmarksStore = bookmarksStore;
    this.tasksStore = tasksStore;
    this.deleteSheet = deleteSheet;
    this.searched$ = new BehaviorSubject<string>('');
    this.name = new FormControl('');
  }

  private static filter(selectedBookmarks: Bookmark[], bookmark: Bookmark): boolean {
    return !selectedBookmarks.map(bookmark => bookmark.id).includes(bookmark.id);
  }

  public ngOnInit(): void {
    this.form = PinnedFactory.getForm();
    this.name.setValue('');
    let bookmarks$ = this.tasksStore.select(selectTask(this.taskId)).pipe(
      filter(task => task !== undefined),
      map(task => task.periodic || task.group === null ? task.id : task.group),
      switchMap(taskId => this.tasksStore.select(selectPinned(taskId))),
      map((pinnedItems: PinnedItems) => [
        ...pinnedItems.bookmarks.map(id => {
          return {deletable: true, id: id};
        }),
        ...pinnedItems.subtasksBookmarks.map(id => {
          return {deletable: false, id: id};
        })
      ])
    );
    this.bookmarks$ = combineLatest([bookmarks$, this.searched$]).pipe(
      switchMap(values => this.bookmarksStore.select(
        searchPinnedWithSubtasks(values[0], values[1])
      )),
      map(files => files.sort((a, b) => StringUtils.compareString(a.item.name, b.item.name)))
    );

    this.editable$ = this.tasksStore.select(selectTask(this.taskId)).pipe(
      filter(task => task !== undefined),
      map(task => task.periodic || task.group === null)
    );

    this.availableBookmarks$ = this.tasksStore.select(selectTask(this.taskId)).pipe(
      filter(task => task !== undefined),
      map(task => task.periodic || task.group === null ? task.id : task.group),
      switchMap(taskId => this.tasksStore.select(selectTask(taskId))),
      map(selectedTask => selectedTask.bookmarks),
      switchMap((bookmarks: number[]) => this.bookmarksStore.select(selectExpect(bookmarks))),
      map(bookmarks => ItemUtils.bookmarksToItems(bookmarks))
    );
  }

  public delete(id: number): void {
    const sheetRef = this.deleteSheet.open(DeleteSheetComponent);
    sheetRef.afterDismissed()
      .pipe(filter(action => action))
      .subscribe(() => this.tasksStore.dispatch(bookmarkRemove({taskId: this.taskId, bookmarkId: id})));
  }

  public search(): void {
    this.searched$.next(this.name.value);
  }

  public submit(): void {
    if (this.form.invalid) {
      return;
    }
    const bookmarkId = this.form.get(formNames.item).value.value;
    this.tasksStore.dispatch(bookmarkAdd({taskId: this.taskId, bookmarkId}));
    this.clearForm();
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  private clearForm(): void {
    FormUtils.clearSelect(this.form);
  }
}
