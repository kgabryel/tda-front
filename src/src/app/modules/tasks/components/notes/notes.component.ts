import {ChangeDetectionStrategy, Component, Input, OnDestroy, OnInit} from '@angular/core';
import {BehaviorSubject, combineLatest, Observable, Subscription} from 'rxjs';
import {Item} from '../../../../core/models/item';
import {Store} from '@ngrx/store';
import {State as TasksState} from '../../../../core/store/tasks/reducers';
import {FormControl, FormGroup} from '@angular/forms';
import {MatBottomSheet} from '@angular/material/bottom-sheet';
import {formNames, PinnedFactory} from '../../../../core/factories/pinned.factory';
import {selectPinned, selectTask} from '../../../../core/store/tasks/selectors';
import {filter, map, switchMap} from 'rxjs/operators';
import {DeleteSheetComponent} from '../../../shared/components/delete-sheet/delete-sheet.component';
import {noteAdd, noteRemove} from '../../../../core/store/tasks/actions';
import {FormUtils} from '../../../../core/utils/form.utils';
import {Note} from '../../../../core/models/note';
import {State as NotesState} from '../../../../core/store/notes/reducers';
import {StringUtils} from '../../../../core/utils/string.utils';
import {ItemUtils} from '../../../../core/utils/item.utils';
import {Pinned} from '../../../../core/models/pinned';
import {PinnedItems} from '../../../../core/models/task';
import {searchPinnedWithSubtasks, selectExpect} from '../../../../core/store/notes/selectors';

@Component({
  selector: 'tasks-notes',
  templateUrl: './notes.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NotesComponent implements OnInit, OnDestroy {

  @Input() public taskId: string;
  public name: FormControl;
  public notes$: Observable<Pinned<Note>[]>;
  public availableNotes$: Observable<Item[]>;
  public form: FormGroup;
  public editable$: Observable<boolean>;
  private notesStore: Store<NotesState>;
  private tasksStore: Store<TasksState>;
  private deleteSheet: MatBottomSheet;
  private searched$: BehaviorSubject<string>;
  private subscription: Subscription;

  public constructor(notesStore: Store<NotesState>, tasksStore: Store<TasksState>, deleteSheet: MatBottomSheet) {
    this.notesStore = notesStore;
    this.tasksStore = tasksStore;
    this.deleteSheet = deleteSheet;
    this.searched$ = new BehaviorSubject<string>('');
    this.name = new FormControl('');
  }

  private static filter(selectedNotes: Note[], note: Note): boolean {
    return !selectedNotes.map(note => note.id).includes(note.id);
  }

  public ngOnInit(): void {
    this.form = PinnedFactory.getForm();
    this.name.setValue('');
    this.subscription = this.name.valueChanges.subscribe(() => this.search());
    let notes$ = this.tasksStore.select(selectTask(this.taskId)).pipe(
      filter(task => task !== undefined),
      map(task => task.periodic || task.group === null ? task.id : task.group),
      switchMap(taskId => this.tasksStore.select(selectPinned(taskId))),
      map((pinnedItems: PinnedItems) => [
        ...pinnedItems.notes.map(id => {
          return {deletable: true, id: id};
        }),
        ...pinnedItems.subtasksNotes.map(id => {
          return {deletable: false, id: id};
        })
      ])
    );
    this.notes$ = combineLatest([notes$, this.searched$]).pipe(
      switchMap(values => this.notesStore.select(
        searchPinnedWithSubtasks(values[0], values[1])
      )),
      map(files => files.sort((a, b) => StringUtils.compareString(a.item.name, b.item.name)))
    );

    this.editable$ = this.tasksStore.select(selectTask(this.taskId)).pipe(
      filter(task => task !== undefined),
      map(task => task.periodic || task.group === null)
    );

    this.availableNotes$ = this.tasksStore.select(selectTask(this.taskId)).pipe(
      filter(task => task !== undefined),
      map(task => task.periodic || task.group === null ? task.id : task.group),
      switchMap(taskId => this.tasksStore.select(selectTask(taskId))),
      map(selectedTask => selectedTask.notes),
      switchMap((notes: number[]) => this.notesStore.select(selectExpect(notes))),
      map(notes => ItemUtils.notesToItems(notes))
    );
  }

  public delete(id: number): void {
    const sheetRef = this.deleteSheet.open(DeleteSheetComponent);
    sheetRef.afterDismissed()
      .pipe(filter(action => action))
      .subscribe(() => this.tasksStore.dispatch(noteRemove({taskId: this.taskId, noteId: id})));
  }

  public search(): void {
    this.searched$.next(this.name.value);
  }

  public submit(): void {
    if (this.form.invalid) {
      return;
    }
    const noteId = this.form.get(formNames.item).value.value;
    this.tasksStore.dispatch(noteAdd({taskId: this.taskId, noteId}));
    this.clearForm();
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  private clearForm(): void {
    FormUtils.clearSelect(this.form);
  }
}
