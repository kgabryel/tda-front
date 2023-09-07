import {ChangeDetectionStrategy, Component, EventEmitter, OnInit, Output} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {formNames, VideoFormFactory, VideosFormNames} from '../../../../core/factories/video.factory';
import {VideoRequest} from '../../../../core/requests/video.request';
import {videoAdd} from '../../../../core/store/videos/actions';
import {Store} from '@ngrx/store';
import {State} from '../../../../core/store/videos/reducers';
import {VideosError, videosErrors} from '../../../../core/errors/videos.error';
import {Observable, Subject} from 'rxjs';
import {Item} from '../../../../core/models/item';
import {FormUtils} from '../../../../core/utils/form.utils';
import {selectCatalogs} from '../../../../core/store/catalogs/selectors';
import {map} from 'rxjs/operators';
import {ItemUtils} from '../../../../core/utils/item.utils';
import {selectMainTasks} from '../../../../core/store/tasks/selectors';
import {State as CatalogsState} from '../../../../core/store/catalogs/reducers';
import {State as TasksState} from '../../../../core/store/tasks/reducers';

@Component({
  selector: 'videos-add-form',
  templateUrl: './add-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AddFormComponent implements OnInit {

  public form: FormGroup;
  public formNames: VideosFormNames;
  public errors: VideosError;
  public tasks$: Observable<Item[]>;
  public catalogs$: Observable<Item[]>;
  public reset$: Subject<void>;
  @Output() private formSubmitted: EventEmitter<void>;
  private store: Store<State>;
  private catalogsStore: Store<CatalogsState>;
  private tasksStore: Store<TasksState>;

  public constructor(store: Store<State>, catalogsStore: Store<CatalogsState>, tasksStore: Store<TasksState>) {
    this.tasksStore = tasksStore;
    this.catalogsStore = catalogsStore;
    this.formSubmitted = new EventEmitter<void>();
    this.form = VideoFormFactory.getForm();
    this.formNames = formNames;
    this.store = store;
    this.errors = videosErrors;
    this.reset$ = new Subject<void>();
  }

  public submit(close: boolean = true): void {
    this.form.markAllAsTouched();
    if (this.form.invalid) {
      return;
    }
    const video: VideoRequest = {
      href: this.form.get(formNames.href).value,
      tasks: FormUtils.mapPinned<string>(this.form, this.formNames.tasks),
      catalogs: FormUtils.mapPinned<number>(this.form, this.formNames.catalogs),
      assignedToDashboard: this.form.get(formNames.assignedToDashboard).value
    };
    this.store.dispatch(videoAdd({video}));
    if (close) {
      this.formSubmitted.emit();
    }
    this.clearForm();
  }

  public ngOnInit(): void {
    this.catalogs$ = this.catalogsStore.select(selectCatalogs)
      .pipe(map(catalogs => ItemUtils.catalogsToItems(catalogs)));
    this.tasks$ = this.tasksStore.select(selectMainTasks).pipe(map(tasks => ItemUtils.tasksToItems(tasks)));
  }

  private clearForm(): void {
    FormUtils.clearPinned(this.form);
    FormUtils.clearInputs(this.form, '', this.formNames.href);
    FormUtils.clearInputs(this.form, false, this.formNames.assignedToDashboard);
    this.reset$.next();
  }
}
