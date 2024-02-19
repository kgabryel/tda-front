import {ChangeDetectionStrategy, Component, EventEmitter, Input, Output} from '@angular/core';
import {Color as ColorPickerValue} from '@angular-material-components/color-picker';
import {Color} from '../../../../core/models/color';
import {ColorUtils} from '../../../../core/utils/color.utils';

@Component({
  selector: 'form-color',
  templateUrl: './color.component.html',
  styleUrls: ['./color.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ColorComponent {

  @Input() public color: Color;
  @Output() private selected: EventEmitter<ColorPickerValue>;

  public constructor() {
    this.selected = new EventEmitter<ColorPickerValue>();
  }

  public select(): void {
    this.selected.emit(ColorUtils.hexToColor(this.color.color));
  }
}
