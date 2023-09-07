import {ChangeDetectionStrategy, Component, Input, OnDestroy, OnInit} from '@angular/core';
import {BehaviorSubject, combineLatest, Observable, Subscription} from 'rxjs';
import {Video} from '../../../../core/models/video';
import {Item} from '../../../../core/models/item';
import {Store} from '@ngrx/store';
import {State as VideosState} from '../../../../core/store/videos/reducers';
import {State as TasksState} from '../../../../core/store/tasks/reducers';
import {FormControl, FormGroup} from '@angular/forms';
import {MatBottomSheet} from '@angular/material/bottom-sheet';
import {formNames, PinnedFactory} from '../../../../core/factories/pinned.factory';
import {selectPinned, selectTask} from '../../../../core/store/tasks/selectors';
import {filter, map, switchMap} from 'rxjs/operators';
import {DeleteSheetComponent} from '../../../shared/components/delete-sheet/delete-sheet.component';
import {videoAdd, videoRemove} from '../../../../core/store/tasks/actions';
import {FormUtils} from '../../../../core/utils/form.utils';
import {StringUtils} from '../../../../core/utils/string.utils';
import {ItemUtils} from '../../../../core/utils/item.utils';
import {Pinned} from '../../../../core/models/pinned';
import {PinnedItems} from '../../../../core/models/task';
import {searchPinnedWithSubtasks, selectExpect} from '../../../../core/store/videos/selectors';

@Component({
  selector: 'tasks-videos',
  templateUrl: './videos.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class VideosComponent implements OnInit, OnDestroy {

  @Input() public taskId: string;
  public name: FormControl;
  public videos$: Observable<Pinned<Video>[]>;
  public availableVideos$: Observable<Item[]>;
  public form: FormGroup;
  public editable$: Observable<boolean>;
  private videosStore: Store<VideosState>;
  private tasksStore: Store<TasksState>;
  private deleteSheet: MatBottomSheet;
  private searched$: BehaviorSubject<string>;
  private subscription: Subscription;

  public constructor(videosStore: Store<VideosState>, tasksStore: Store<TasksState>, deleteSheet: MatBottomSheet) {
    this.videosStore = videosStore;
    this.tasksStore = tasksStore;
    this.deleteSheet = deleteSheet;
    this.searched$ = new BehaviorSubject<string>('');
    this.name = new FormControl('');
  }

  private static filter(selectedVideos: Video[], video: Video): boolean {
    return !selectedVideos.map(video => video.id).includes(video.id);
  }

  public ngOnInit(): void {
    this.form = PinnedFactory.getForm();
    this.name.setValue('');
    this.subscription = this.name.valueChanges.subscribe(() => this.search());
    let videos$ = this.tasksStore.select(selectTask(this.taskId)).pipe(
      filter(task => task !== undefined),
      map(task => task.periodic || task.group === null ? task.id : task.group),
      switchMap(taskId => this.tasksStore.select(selectPinned(taskId))),
      map((pinnedItems: PinnedItems) => [
        ...pinnedItems.videos.map(id => {
          return {deletable: true, id: id};
        }),
        ...pinnedItems.subtasksVideos.map(id => {
          return {deletable: false, id: id};
        })
      ])
    );
    this.videos$ = combineLatest([videos$, this.searched$]).pipe(
      switchMap(values => this.videosStore.select(
        searchPinnedWithSubtasks(values[0], values[1])
      )),
      map(files => files.sort((a, b) => StringUtils.compareString(a.item.name, b.item.name)))
    );

    this.editable$ = this.tasksStore.select(selectTask(this.taskId)).pipe(
      filter(task => task !== undefined),
      map(task => task.periodic || task.group === null)
    );

    this.availableVideos$ = this.tasksStore.select(selectTask(this.taskId)).pipe(
      filter(task => task !== undefined),
      map(task => task.periodic || task.group === null ? task.id : task.group),
      switchMap(taskId => this.tasksStore.select(selectTask(taskId))),
      map(selectedTask => selectedTask.videos),
      switchMap((videos: number[]) => this.videosStore.select(selectExpect(videos))),
      map(videos => ItemUtils.videosToItems(videos))
    );
  }

  public delete(id: number): void {
    const sheetRef = this.deleteSheet.open(DeleteSheetComponent);
    sheetRef.afterDismissed()
      .pipe(filter(action => action))
      .subscribe(() => this.tasksStore.dispatch(videoRemove({taskId: this.taskId, videoId: id})));
  }

  public search(): void {
    this.searched$.next(this.name.value);
  }

  public submit(): void {
    if (this.form.invalid) {
      return;
    }
    const videoId = this.form.get(formNames.item).value.value;
    this.tasksStore.dispatch(videoAdd({taskId: this.taskId, videoId}));
    this.clearForm();
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  private clearForm(): void {
    FormUtils.clearSelect(this.form);
  }
}
