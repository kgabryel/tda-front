import {ChangeDetectionStrategy, Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {File} from '../../../../core/models/file';
import {STEPPER_GLOBAL_OPTIONS} from '@angular/cdk/stepper';
import {FileFormFactory, FilesFormNames, formNames} from '../../../../core/factories/file.factory';
import {Store} from '@ngrx/store';
import {State} from '../../../../core/store/files/reducers';
import {FilesError, filesErrors} from '../../../../core/errors/files.error';
import {FormGroup} from '@angular/forms';
import {Length} from '../../../../config/form.config';
import {EditFileRequest, ReplaceFileRequest} from '../../../../core/requests/file.request';
import {fileReplace, fileUpdate, fileUpdateError, fileUpdateSuccess} from '../../../../core/store/files/actions';
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
  selector: 'files-edit-form',
  templateUrl: './edit-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{provide: STEPPER_GLOBAL_OPTIONS, useValue: {displayDefaultIndicatorType: false}}]
})
export class EditFormComponent implements OnInit, OnDestroy {

  @Input() public file: File;
  public editForm: FormGroup;
  public editFileForm: FormGroup;
  public formNames: FilesFormNames;
  public maxNameLength: number;
  public errors: FilesError;
  public uploading$: Subject<boolean>;
  public tasks$: Observable<Item[]>;
  public catalogs$: Observable<Item[]>;
  @Output() private formSubmitted: EventEmitter<void>;
  private store: Store<State>;
  private subscription: Subscription;
  private updates$: Actions;
  private catalogsStore: Store<CatalogsState>;
  private tasksStore: Store<TasksState>;

  public constructor(
    store: Store<State>,
    updates$: Actions,
    catalogsStore: Store<CatalogsState>,
    tasksStore: Store<TasksState>
  ) {
    this.updates$ = updates$;
    this.catalogsStore = catalogsStore;
    this.tasksStore = tasksStore;
    this.uploading$ = new Subject<boolean>();
    this.formSubmitted = new EventEmitter<void>();
    this.formNames = formNames;
    this.store = store;
    this.maxNameLength = Length.maxFileNameLength;
    this.errors = filesErrors;
    this.formSubmitted = new EventEmitter<void>();
  }

  public ngOnInit(): void {
    this.subscription = this.updates$.pipe(ofType(fileUpdateSuccess, fileUpdateError)).subscribe(() => {
      this.formSubmitted.emit();
      this.uploading$.next(false);
    });
    this.catalogs$ = this.catalogsStore.select(selectCatalogs).pipe(map(catalogs => ItemUtils.catalogsToItems(catalogs)));
    this.tasks$ = this.tasksStore.select(selectMainTasks).pipe(map(tasks => ItemUtils.tasksToItems(tasks)));
    this.editForm = FileFormFactory.getEditForm(this.file);
    this.editFileForm = FileFormFactory.getEditFileForm();
  }

  public submitNameForm(): void {
    this.editForm.markAllAsTouched();
    if (this.editForm.invalid) {
      return;
    }
    const file: EditFileRequest = {
      name: this.editForm.get(formNames.name).value,
      tasks: FormUtils.mapPinned<string>(this.editForm, this.formNames.tasks),
      catalogs: FormUtils.mapPinned<number>(this.editForm, this.formNames.catalogs),
      assignedToDashboard: this.editForm.get(this.formNames.assignedToDashboard).value
    };
    this.store.dispatch(fileUpdate({id: this.file.id, file}));
    this.formSubmitted.emit();
  }

  public submitFileForm(): void {
    this.editFileForm.markAllAsTouched();
    if (this.editFileForm.invalid) {
      return;
    }
    let fileValue = this.editFileForm.get(formNames.file).value;
    const file: ReplaceFileRequest = {
      file: fileValue
    };
    if (fileValue.size >= 1024 * 1024) {
      this.uploading$.next(true);
    }
    this.store.dispatch(fileReplace({id: this.file.id, file}));
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
