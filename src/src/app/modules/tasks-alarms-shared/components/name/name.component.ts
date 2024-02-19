import {ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'shared-name',
  templateUrl: './name.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NameComponent implements OnInit {

  @Input() public name: string | null;
  @Input() public maxLength: number;
  public edit: boolean;
  public editValue: string | null;
  @Output() private valueChanged: EventEmitter<string>;

  public constructor() {
    this.valueChanged = new EventEmitter<string>();
  }

  public ngOnInit(): void {
    this.edit = false;
    this.editValue = this.name;
  }

  public save(): void {
    this.name = this.editValue;
    this.valueChanged.emit(this.name);
    this.edit = false;
  }

  public stopEdit(): void {
    this.edit = false;
    this.editValue = this.name;
  }
}
