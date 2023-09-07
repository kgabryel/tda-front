import {ChangeDetectionStrategy, Component, Input, OnDestroy, OnInit} from '@angular/core';
import {BehaviorSubject, combineLatest, Observable, Subscription} from 'rxjs';
import {File} from '../../../../core/models/file';
import {Item} from '../../../../core/models/item';
import {Store} from '@ngrx/store';
import {State as FilesState} from '../../../../core/store/files/reducers';
import {State as TasksState} from '../../../../core/store/tasks/reducers';
import {FormControl, FormGroup} from '@angular/forms';
import {MatBottomSheet} from '@angular/material/bottom-sheet';
import {formNames, PinnedFactory} from '../../../../core/factories/pinned.factory';
import {selectPinned, selectTask} from '../../../../core/store/tasks/selectors';
import {filter, map, switchMap} from 'rxjs/operators';
import {DeleteSheetComponent} from '../../../shared/components/delete-sheet/delete-sheet.component';
import {fileAdd, fileRemove} from '../../../../core/store/tasks/actions';
import {FormUtils} from '../../../../core/utils/form.utils';
import {FilesService} from '../../../../core/services/files/files.service';
import {StringUtils} from '../../../../core/utils/string.utils';
import {ItemUtils} from '../../../../core/utils/item.utils';
import {Pinned} from '../../../../core/models/pinned';
import {PinnedItems} from '../../../../core/models/task';
import {searchPinnedWithSubtasks, selectExpect} from '../../../../core/store/files/selectors';

@Component({
  selector: 'tasks-files',
  templateUrl: './files.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FilesComponent implements OnInit, OnDestroy {

  @Input() public taskId: string;
  public name: FormControl;
  public files$: Observable<Pinned<File>[]>;
  public availableFiles$: Observable<Item[]>;
  public form: FormGroup;
  public editable$: Observable<boolean>;
  private filesStore: Store<FilesState>;
  private tasksStore: Store<TasksState>;
  private deleteSheet: MatBottomSheet;
  private searched$: BehaviorSubject<string>;
  private filesService: FilesService;
  private subscription: Subscription;

  public constructor(
    filesService: FilesService,
    filesStore: Store<FilesState>,
    tasksStore: Store<TasksState>,
    deleteSheet: MatBottomSheet
  ) {
    this.filesService = filesService;
    this.filesStore = filesStore;
    this.tasksStore = tasksStore;
    this.deleteSheet = deleteSheet;
    this.searched$ = new BehaviorSubject<string>('');
    this.name = new FormControl('');
  }

  private static filter(selectedFiles: File[], file: File): boolean {
    return !selectedFiles.map(file => file.id).includes(file.id);
  }

  public ngOnInit(): void {
    this.form = PinnedFactory.getForm();
    this.name.setValue('');
    this.subscription = this.name.valueChanges.subscribe(() => this.search());
    let files$ = this.tasksStore.select(selectTask(this.taskId)).pipe(
      filter(task => task !== undefined),
      map(task => task.periodic || task.group === null ? task.id : task.group),
      switchMap(taskId => this.tasksStore.select(selectPinned(taskId))),
      map((pinnedItems: PinnedItems) => [
        ...pinnedItems.files.map(id => {
          return {deletable: true, id: id};
        }),
        ...pinnedItems.subtasksFiles.map(id => {
          return {deletable: false, id: id};
        })
      ])
    );
    this.files$ = combineLatest([files$, this.searched$]).pipe(
      switchMap(values => this.filesStore.select(
        searchPinnedWithSubtasks(values[0], values[1])
      )),
      map(files => files.sort((a, b) => StringUtils.compareString(a.item.name, b.item.name)))
    );

    this.editable$ = this.tasksStore.select(selectTask(this.taskId)).pipe(
      filter(task => task !== undefined),
      map(task => task.periodic || task.group === null));

    this.availableFiles$ = this.tasksStore.select(selectTask(this.taskId)).pipe(
      filter(task => task !== undefined),
      map(task => task.periodic || task.group === null ? task.id : task.group),
      switchMap(taskId => this.tasksStore.select(selectTask(taskId))),
      map(selectedTask => selectedTask.files),
      switchMap((files: number[]) => this.filesStore.select(selectExpect(files))),
      map(files => ItemUtils.filesToItems(files))
    );
  }

  public delete(id: number): void {
    const sheetRef = this.deleteSheet.open(DeleteSheetComponent);
    sheetRef.afterDismissed()
      .pipe(filter(action => action))
      .subscribe(() => this.tasksStore.dispatch(fileRemove({taskId: this.taskId, fileId: id})));
  }

  public search(): void {
    this.searched$.next(this.name.value);
  }

  public submit(): void {
    if (this.form.invalid) {
      return;
    }
    const fileId = this.form.get(formNames.item).value.value;
    this.tasksStore.dispatch(fileAdd({taskId: this.taskId, fileId}));
    this.clearForm();
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  private clearForm(): void {
    FormUtils.clearSelect(this.form);
  }
}
