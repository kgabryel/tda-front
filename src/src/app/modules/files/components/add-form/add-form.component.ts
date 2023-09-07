import {ChangeDetectionStrategy, Component, EventEmitter, OnDestroy, OnInit, Output} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {FileFormFactory, FilesFormNames, formNames} from '../../../../core/factories/file.factory';
import {FileRequest} from '../../../../core/requests/file.request';
import {fileAdd, fileAddError, fileAddSuccess} from '../../../../core/store/files/actions';
import {Store} from '@ngrx/store';
import {State} from '../../../../core/store/files/reducers';
import {Length} from '../../../../config/form.config';
import {FilesError, filesErrors} from '../../../../core/errors/files.error';
import {Actions, ofType} from '@ngrx/effects';
import {Observable, Subject, Subscription} from 'rxjs';
import {Item} from '../../../../core/models/item';
import {FormUtils} from '../../../../core/utils/form.utils';
import {selectCatalogs} from '../../../../core/store/catalogs/selectors';
import {map} from 'rxjs/operators';
import {ItemUtils} from '../../../../core/utils/item.utils';
import {selectMainTasks} from '../../../../core/store/tasks/selectors';
import {State as CatalogsState} from '../../../../core/store/catalogs/reducers';
import {State as TasksState} from '../../../../core/store/tasks/reducers';

@Component({
  selector: 'files-add-form',
  templateUrl: './add-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AddFormComponent implements OnInit, OnDestroy {

  public form: FormGroup;
  public formNames: FilesFormNames;
  public maxNameLength: number;
  public errors: FilesError;
  public uploading$: Subject<boolean>;
  public tasks$: Observable<Item[]>;
  public catalogs$: Observable<Item[]>;
  public reset$: Subject<void>;
  @Output() private formSubmitted: EventEmitter<void>;
  private store: Store<State>;
  private close: boolean;
  private subscriptions: Subscription[];
  private updates$: Actions;
  private catalogsStore: Store<CatalogsState>;
  private tasksStore: Store<TasksState>;

  public constructor(
    store: Store<State>,
    updates$: Actions,
    catalogsStore: Store<CatalogsState>,
    tasksStore: Store<TasksState>
  ) {
    this.catalogsStore = catalogsStore;
    this.tasksStore = tasksStore;
    this.store = store;
    this.updates$ = updates$;
    this.reset$ = new Subject<void>();
    this.uploading$ = new Subject<boolean>();
    this.formSubmitted = new EventEmitter<void>();
    this.formNames = formNames;
    this.maxNameLength = Length.maxFileNameLength;
    this.errors = filesErrors;
  }

  public ngOnInit(): void {
    this.form = FileFormFactory.getForm();
    this.catalogs$ = this.catalogsStore.select(selectCatalogs).pipe(map(catalogs => ItemUtils.catalogsToItems(catalogs)));
    this.tasks$ = this.tasksStore.select(selectMainTasks).pipe(map(tasks => ItemUtils.tasksToItems(tasks)));
    this.close = false;

    this.subscriptions = [
      this.updates$.pipe(ofType(fileAddSuccess, fileAddError)).subscribe(() => this.closeForm())
    ];
  }

  public submit(close: boolean = true): void {
    this.form.markAllAsTouched();
    if (this.form.invalid) {
      return;
    }
    this.close = close;
    let fileValue = this.form.get(formNames.file).value;
    const file: FileRequest = {
      name: this.form.get(formNames.name).value,
      file: fileValue,
      tasks: FormUtils.mapPinned<string>(this.form, this.formNames.tasks),
      catalogs: FormUtils.mapPinned<number>(this.form, this.formNames.catalogs),
      assignedToDashboard: this.form.get(this.formNames.assignedToDashboard).value
    };
    if (fileValue.size >= 1024 * 1024) {
      this.uploading$.next(true);
    }
    this.store.dispatch(fileAdd({file}));
  }

  public clearForm(): void {
    FormUtils.clearPinned(this.form);
    FormUtils.clearInputs(this.form, '', this.formNames.name);
    FormUtils.clearInputs(this.form, null, this.formNames.file);
    FormUtils.clearInputs(this.form, false, this.formNames.assignedToDashboard);
    this.reset$.next();
  }

  public ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  private closeForm(): void {
    this.clearForm();
    if (this.close) {
      this.formSubmitted.emit();
    }
    this.uploading$.next(false);
  }
}
