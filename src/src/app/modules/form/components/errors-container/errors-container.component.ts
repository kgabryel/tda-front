import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {AbstractControl} from '@angular/forms';

@Component({
  selector: 'form-errors-container',
  templateUrl: './errors-container.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ErrorsContainerComponent {

  @Input() public input: AbstractControl | null;
  @Input() public errors: string[];
  @Input() public prefix: string;
  @Input() public part: string;
}
