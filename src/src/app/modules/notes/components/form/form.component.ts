import {ChangeDetectionStrategy, Component, Input, OnInit} from '@angular/core';
import {formNames, NotesFormNames} from '../../../../core/factories/note.factory';
import {Store} from '@ngrx/store';
import {FormGroup} from '@angular/forms';
import {notesErrors, NotesErrors} from '../../../../core/errors/notes.error';
import {Length} from '../../../../config/form.config';
import {Observable} from 'rxjs';
import {Item} from '../../../../core/models/item';
import {selectCatalogs} from '../../../../core/store/catalogs/selectors';
import {map} from 'rxjs/operators';
import {ItemUtils} from '../../../../core/utils/item.utils';
import {selectMainTasks} from '../../../../core/store/tasks/selectors';
import {State as CatalogsState} from '../../../../core/store/catalogs/reducers';
import {State as TasksState} from '../../../../core/store/tasks/reducers';

@Component({
  selector: 'notes-form',
  templateUrl: './form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FormComponent implements OnInit {

  public formNames: NotesFormNames;
  @Input() public form: FormGroup;
  public errors: NotesErrors;
  public maxNameLength: number;
  public tasks$: Observable<Item[]>;
  public catalogs$: Observable<Item[]>;
  @Input() public reset$: Observable<void> | undefined = undefined;
  private catalogsStore: Store<CatalogsState>;
  private tasksStore: Store<TasksState>;

  public constructor(catalogsStore: Store<CatalogsState>, tasksStore: Store<TasksState>) {
    this.formNames = formNames;
    this.errors = notesErrors;
    this.maxNameLength = Length.maxNoteNameLength;
    this.catalogsStore = catalogsStore;
    this.tasksStore = tasksStore;
  }

  public ngOnInit(): void {
    this.catalogs$ = this.catalogsStore.select(selectCatalogs)
      .pipe(map(catalogs => ItemUtils.catalogsToItems(catalogs)));
    this.tasks$ = this.tasksStore.select(selectMainTasks).pipe(map(tasks => ItemUtils.tasksToItems(tasks)));
  }
}
