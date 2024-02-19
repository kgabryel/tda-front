import {ChangeDetectionStrategy, Component, EventEmitter, Input, Output} from '@angular/core';
import {Note} from '../../../../core/models/note';

@Component({
  selector: 'notes-actions',
  templateUrl: './actions.component.html',
  styleUrls: ['./actions.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ActionsComponent {

  @Input() public note: Note;
  @Input() public previewAvailable: boolean;
  @Output() private showCatalogs: EventEmitter<void>;
  @Output() private showTasks: EventEmitter<void>;
  @Output() private edit: EventEmitter<void>;
  @Output() private delete: EventEmitter<void>;

  public constructor() {
    this.showCatalogs = new EventEmitter<void>();
    this.showTasks = new EventEmitter<void>();
    this.edit = new EventEmitter<void>();
    this.delete = new EventEmitter<void>();
  }

  public emitShowCatalogs(): void {
    this.showCatalogs.emit();
  }

  public emitShowTasks(): void {
    this.showTasks.emit();
  }

  public emitEdit(): void {
    this.edit.emit();
  }

  public emitDelete(): void {
    this.delete.emit();
  }
}
