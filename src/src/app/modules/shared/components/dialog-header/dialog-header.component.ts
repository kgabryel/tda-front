import {ChangeDetectionStrategy, Component, EventEmitter, Output} from '@angular/core';

@Component({
  selector: 'shared-dialog-header',
  templateUrl: './dialog-header.component.html',
  styleUrls: ['./dialog-header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DialogHeaderComponent {

  @Output() private clear: EventEmitter<void>;

  public constructor() {
    this.clear = new EventEmitter<void>();
  }

  public clearDialog(): void {
    this.clear.emit();
  }
}
