import {ChangeDetectionStrategy, Component, Input, OnDestroy, OnInit} from '@angular/core';
import {BehaviorSubject, combineLatest, Observable, Subscription} from 'rxjs';
import {Catalog} from '../../../../core/models/catalog';
import {Store} from '@ngrx/store';
import {State as CatalogsState} from '../../../../core/store/catalogs/reducers';
import {State as TasksState} from '../../../../core/store/tasks/reducers';
import {filter, map, switchMap} from 'rxjs/operators';
import {searchPinnedWithSubtasks, selectExpect} from '../../../../core/store/catalogs/selectors';
import {Item} from '../../../../core/models/item';
import {FormControl, FormGroup} from '@angular/forms';
import {MatBottomSheet} from '@angular/material/bottom-sheet';
import {formNames, PinnedFactory} from '../../../../core/factories/pinned.factory';
import {selectPinned, selectTask} from '../../../../core/store/tasks/selectors';
import {DeleteSheetComponent} from '../../../shared/components/delete-sheet/delete-sheet.component';
import {catalogAdd, catalogRemove} from '../../../../core/store/tasks/actions';
import {FormUtils} from '../../../../core/utils/form.utils';
import {StringUtils} from '../../../../core/utils/string.utils';
import {ItemUtils} from '../../../../core/utils/item.utils';
import {PinnedItems} from '../../../../core/models/task';
import {Pinned} from '../../../../core/models/pinned';

@Component({
  selector: 'tasks-catalogs',
  templateUrl: './catalogs.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CatalogsComponent implements OnInit, OnDestroy {

  @Input() public taskId: string;
  public name: FormControl;
  public catalogs$: Observable<Pinned<Catalog>[]>;
  public availableCatalogs$: Observable<Item[]>;
  public form: FormGroup;
  public editable$: Observable<boolean>;
  private catalogsStore: Store<CatalogsState>;
  private tasksStore: Store<TasksState>;
  private deleteSheet: MatBottomSheet;
  private searched$: BehaviorSubject<string>;
  private subscription: Subscription;

  public constructor(catalogsStore: Store<CatalogsState>, tasksStore: Store<TasksState>, deleteSheet: MatBottomSheet) {
    this.catalogsStore = catalogsStore;
    this.tasksStore = tasksStore;
    this.deleteSheet = deleteSheet;
    this.searched$ = new BehaviorSubject<string>('');
    this.name = new FormControl('');
  }

  public ngOnInit(): void {
    this.form = PinnedFactory.getForm();
    this.name.setValue('');
    this.subscription = this.name.valueChanges.subscribe(() => this.search());

    let catalogs$ = this.tasksStore.select(selectTask(this.taskId)).pipe(
      filter(task => task !== undefined),
      map(task => task.periodic || task.group === null ? task.id : task.group),
      switchMap(taskId => this.tasksStore.select(selectPinned(taskId))),
      map((pinnedItems: PinnedItems) => [
        ...pinnedItems.catalogs.map(id => {
          return {deletable: true, id: id};
        }),
        ...pinnedItems.subtasksCatalogs.map(id => {
          return {deletable: false, id: id};
        })
      ])
    );
    this.catalogs$ = combineLatest([catalogs$, this.searched$]).pipe(
      switchMap(values => this.catalogsStore.select(
        searchPinnedWithSubtasks(values[0], values[1])
      )),
      map(catalogs => catalogs.sort((a, b) => StringUtils.compareString(a.item.name, b.item.name)))
    );
    this.editable$ = this.tasksStore.select(selectTask(this.taskId)).pipe(
      filter(task => task !== undefined),
      map(task => task.periodic || task.group === null)
    );

    this.availableCatalogs$ = this.tasksStore.select(selectTask(this.taskId)).pipe(
      filter(task => task !== undefined),
      map(task => task.periodic || task.group === null ? task.id : task.group),
      switchMap(taskId => this.tasksStore.select(selectTask(taskId))),
      map(selectedTask => selectedTask.catalogs),
      switchMap((catalogs: number[]) => this.catalogsStore.select(selectExpect(catalogs))),
      map(catalogs => ItemUtils.catalogsToItems(catalogs))
    );
  }

  public delete(id: number): void {
    const sheetRef = this.deleteSheet.open(DeleteSheetComponent);
    sheetRef.afterDismissed()
      .pipe(filter(action => action))
      .subscribe(() => this.tasksStore.dispatch(catalogRemove({taskId: this.taskId, catalogId: id})));
  }

  public search(): void {
    this.searched$.next(this.name.value);
  }

  public submit(): void {
    if (this.form.invalid) {
      return;
    }
    const catalogId = this.form.get(formNames.item).value.value;
    this.tasksStore.dispatch(catalogAdd({taskId: this.taskId, catalogId}));
    this.clearForm();
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  private clearForm(): void {
    FormUtils.clearSelect(this.form);
  }
}
