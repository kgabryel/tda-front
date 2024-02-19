import {ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'shared-content',
  templateUrl: './content.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ContentComponent implements OnInit {

  @Input() public content: string | null;
  @Input() public edit: boolean;
  public editValue: string | null;
  @Output() private valueChanged: EventEmitter<string | null>;

  public constructor() {
    this.valueChanged = new EventEmitter<string | null>();
  }

  public ngOnInit(): void {
    this.editValue = this.content;
  }

  public clear(): void {
    this.valueChanged.emit(null);
    this.content = null;
    this.editValue = null;
  }

  public save(): void {
    this.valueChanged.emit(this.editValue);
    this.content = this.editValue;
    this.edit = false;
  }

  public stopEdit(): void {
    this.edit = false;
    this.editValue = this.content;
  }
}
