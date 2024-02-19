import {ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {PinnedItems, Task} from '../../../../core/models/task';
import {Observable} from 'rxjs';
import {State} from '../../../../core/store/tasks/reducers';
import {Store} from '@ngrx/store';
import {selectPinned} from '../../../../core/store/tasks/selectors';

@Component({
  selector: 'tasks-actions',
  templateUrl: './actions.component.html',
  styleUrls: ['./actions.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ActionsComponent implements OnInit {

  @Input() public task: Task;
  @Input() public activeSection: number;
  public dataTask$: Observable<PinnedItems>;
  @Output() private showTasks: EventEmitter<void>;
  @Output() private showCatalogs: EventEmitter<void>;
  @Output() private showNotes: EventEmitter<void>;
  @Output() private showBookmarks: EventEmitter<void>;
  @Output() private showFiles: EventEmitter<void>;
  @Output() private showVideos: EventEmitter<void>;
  @Output() private delete: EventEmitter<void>;
  @Output() private showContent: EventEmitter<void>;
  private store: Store<State>;

  public constructor(store: Store<State>) {
    this.store = store;
    this.showTasks = new EventEmitter<void>();
    this.showCatalogs = new EventEmitter<void>();
    this.showNotes = new EventEmitter<void>();
    this.showBookmarks = new EventEmitter<void>();
    this.showFiles = new EventEmitter<void>();
    this.showVideos = new EventEmitter<void>();
    this.delete = new EventEmitter<void>();
    this.showContent = new EventEmitter<void>();
  }

  public ngOnInit(): void {
    let taskId;
    if (this.task.periodic) {
      taskId = this.task.id;
    } else if (this.task.group !== null) {
      taskId = this.task.group;
    } else {
      taskId = this.task.id;
    }
    this.dataTask$ = this.store.select(selectPinned(taskId));
  }

  public emitShowTasks(): void {
    this.showTasks.emit();
  }

  public emitShowCatalogs(): void {
    this.showCatalogs.emit();
  }

  public emitShowNotes(): void {
    this.showNotes.emit();
  }

  public emitShowBookmarks(): void {
    this.showBookmarks.emit();
  }

  public emitShowFiles(): void {
    this.showFiles.emit();
  }

  public emitShowVideos(): void {
    this.showVideos.emit();
  }

  public emitDelete(): void {
    this.delete.emit();
  }

  public emitShowContent(): void {
    this.showContent.emit();
  }
}
