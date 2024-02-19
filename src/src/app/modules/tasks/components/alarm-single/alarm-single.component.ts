import {ChangeDetectionStrategy, Component, EventEmitter, Input, Output} from '@angular/core';

@Component({
  selector: 'tasks-alarm-single',
  templateUrl: './alarm-single.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AlarmSingleComponent {

  @Input() public alarmId: string | null;
  @Input() public editable: boolean;
  @Output() private startEdit: EventEmitter<void>;

  public constructor() {
    this.startEdit = new EventEmitter<void>();
  }

  public emitStartEdit(): void {
    this.startEdit.emit();
  }
}
