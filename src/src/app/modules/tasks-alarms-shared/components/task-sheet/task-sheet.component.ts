import {ChangeDetectionStrategy, Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef} from '@angular/material/bottom-sheet';
import {Task} from '../../../../core/models/task';
import {map} from 'rxjs/operators';
import {Observable, Subscription} from 'rxjs';
import {formNames, TasksFormNames} from '../../../../core/factories/task.factory';
import {Store} from '@ngrx/store';
import {State} from '../../../../core/store/tasks/reducers';
import {selectSingleMainTasks} from '../../../../core/store/tasks/selectors';
import {FormControl} from '@angular/forms';
import {tasksSingleMainTaskUpdate} from '../../../../core/store/tasks/actions';

@Component({
  selector: 'shared-task-sheet',
  templateUrl: './task-sheet.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TaskSheetComponent implements OnInit, OnDestroy {

  public inactive: string;
  public tasks$: Observable<Task[]>;
  public formNames: TasksFormNames;
  public filteredTasks$: Observable<Task[]>;
  public taskInput: FormControl;
  public invalid: boolean;
  public selected: Task | null;
  private bottomSheetRef: MatBottomSheetRef<TaskSheetComponent>;
  private store: Store<State>;
  private subscription: Subscription;

  public constructor(
    @Inject(MAT_BOTTOM_SHEET_DATA) data: { without: string, selected: Task | null },
    bottomSheetRef: MatBottomSheetRef<TaskSheetComponent>,
    store: Store<State>
  ) {
    this.inactive = data.without;
    this.bottomSheetRef = bottomSheetRef;
    this.formNames = formNames;
    this.store = store;
    this.selected = data.selected;
  }

  public ngOnInit(): void {
    this.invalid = this.selected === null;
    this.tasks$ = this.store.select(selectSingleMainTasks).pipe(map(tasks => tasks.filter(task => task.id != this.inactive)));
    this.taskInput = new FormControl();
    this.taskInput.setValue(this.selected);
    this.subscription = this.taskInput.valueChanges.subscribe(value => {
      this.invalid = typeof this.taskInput.value === 'string';
      this.filter(value);
    });
  }

  public change(): void {
    this.store.dispatch(tasksSingleMainTaskUpdate({id: this.inactive, mainTask: this.taskInput.value.id}));
    this.bottomSheetRef.dismiss();
  }

  public close(): void {
    this.bottomSheetRef.dismiss();
  }

  public delete(): void {
    this.store.dispatch(tasksSingleMainTaskUpdate({id: this.inactive, mainTask: null}));
    this.bottomSheetRef.dismiss();
  }

  displayFn(task: Task): string {
    return task ? task.name : '';
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  private filter(value: string | Task): void {
    let search = typeof value === 'string' ? value : value.name;
    const filterValue = search.toLowerCase();
    this.filteredTasks$ = this.tasks$.pipe(map(task => task.filter(
      task => task.name.toLowerCase().indexOf(filterValue) === 0)
    ));
  }
}
