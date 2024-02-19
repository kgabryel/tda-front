import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {FormControl} from '@angular/forms';

@Component({
  selector: 'form-yes-no-select',
  templateUrl: './yes-no-select.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class YesNoSelectComponent {

  @Input() public control: FormControl;
  @Input() public yesAnswer: string | null = null;
  @Input() public noAnswer: string | null = null;
  @Input() public nullAvailable: boolean = true;
  @Input() public label: string;
}
