import {ChangeDetectionStrategy, Component, Input, OnInit} from '@angular/core';
import {Store} from '@ngrx/store';
import {BookmarksFormNames, formNames} from '../../../../core/factories/bookmark.factory';
import {FormGroup} from '@angular/forms';
import {BookmarksErrors, bookmarksErrors} from '../../../../core/errors/bookmarks.error';
import {Observable, Subject} from 'rxjs';
import {Item} from '../../../../core/models/item';
import {Length} from '../../../../config/form.config';
import {State as CatalogsState} from '../../../../core/store/catalogs/reducers';
import {State as TasksState} from '../../../../core/store/tasks/reducers';
import {selectCatalogs} from '../../../../core/store/catalogs/selectors';
import {map} from 'rxjs/operators';
import {ItemUtils} from '../../../../core/utils/item.utils';
import {selectMainTasks} from '../../../../core/store/tasks/selectors';

@Component({
  selector: 'bookmarks-form',
  templateUrl: './form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FormComponent implements OnInit {

  public formNames: BookmarksFormNames;
  @Input() public form: FormGroup;
  public submit: CallableFunction;
  @Input() public edit: boolean;
  public errors: BookmarksErrors;
  public tasks$: Observable<Item[]>;
  public catalogs$: Observable<Item[]>;
  public maxNameLength: number;
  @Input() public reset$: Subject<void> | undefined = undefined;
  private catalogsStore: Store<CatalogsState>;
  private tasksStore: Store<TasksState>;

  public constructor(catalogsStore: Store<CatalogsState>, tasksStore: Store<TasksState>) {
    this.formNames = formNames;
    this.errors = bookmarksErrors;
    this.maxNameLength = Length.maxBookmarkNameLength;
    this.catalogsStore = catalogsStore;
    this.tasksStore = tasksStore;
  }

  public ngOnInit(): void {
    this.catalogs$ = this.catalogsStore.select(selectCatalogs)
      .pipe(map(catalogs => ItemUtils.catalogsToItems(catalogs)));
    this.tasks$ = this.tasksStore.select(selectMainTasks).pipe(map(tasks => ItemUtils.tasksToItems(tasks)));
  }
}
