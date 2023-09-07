import {ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {EditVideoFormFactory, formNames, VideosFormNames} from '../../../../core/factories/video.factory';
import {Store} from '@ngrx/store';
import {State} from '../../../../core/store/videos/reducers';
import {VideosError, videosErrors} from '../../../../core/errors/videos.error';
import {Video} from '../../../../core/models/video';
import {EditVideoRequest} from '../../../../core/requests/video.request';
import {videoUpdate} from '../../../../core/store/videos/actions';
import {Length} from '../../../../config/form.config';
import {Observable} from 'rxjs';
import {Item} from '../../../../core/models/item';
import {FormUtils} from '../../../../core/utils/form.utils';
import {selectCatalogs} from '../../../../core/store/catalogs/selectors';
import {map} from 'rxjs/operators';
import {ItemUtils} from '../../../../core/utils/item.utils';
import {selectMainTasks} from '../../../../core/store/tasks/selectors';
import {State as CatalogsState} from '../../../../core/store/catalogs/reducers';
import {State as TasksState} from '../../../../core/store/tasks/reducers';

@Component({
  selector: 'videos-edit-form',
  templateUrl: './edit-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EditFormComponent implements OnInit {

  @Input() public video: Video;
  public form: FormGroup;
  public formNames: VideosFormNames;
  public errors: VideosError;
  public maxNameLength: number;
  public tasks$: Observable<Item[]>;
  public catalogs$: Observable<Item[]>;
  @Output() private formSubmitted: EventEmitter<void>;
  private store: Store<State>;
  private catalogsStore: Store<CatalogsState>;
  private tasksStore: Store<TasksState>;

  public constructor(store: Store<State>, catalogsStore: Store<CatalogsState>, tasksStore: Store<TasksState>) {
    this.tasksStore = tasksStore;
    this.catalogsStore = catalogsStore;
    this.formSubmitted = new EventEmitter<void>();
    this.formNames = formNames;
    this.store = store;
    this.errors = videosErrors;
    this.maxNameLength = Length.maxVideoNameLength;
  }

  public ngOnInit(): void {
    this.catalogs$ = this.catalogsStore.select(selectCatalogs).pipe(map(catalogs => ItemUtils.catalogsToItems(catalogs)));
    this.tasks$ = this.tasksStore.select(selectMainTasks).pipe(map(tasks => ItemUtils.tasksToItems(tasks)));
    this.form = EditVideoFormFactory.getForm(this.video);
  }

  public submit(): void {
    this.form.markAllAsTouched();
    if (this.form.invalid) {
      return;
    }
    const request: EditVideoRequest = {
      name: this.form.get(formNames.name).value,
      watched: this.form.get(formNames.watched).value,
      tasks: FormUtils.mapPinned<string>(this.form, this.formNames.tasks),
      catalogs: FormUtils.mapPinned<number>(this.form, this.formNames.catalogs),
      assignedToDashboard: this.form.get(formNames.assignedToDashboard).value
    };
    this.store.dispatch(videoUpdate({
      id: this.video.id,
      request
    }));
    this.formSubmitted.emit();
  }
}
