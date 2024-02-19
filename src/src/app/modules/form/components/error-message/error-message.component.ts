import {ChangeDetectionStrategy, Component, Input} from '@angular/core';

@Component({
  selector: 'form-error-message',
  templateUrl: './error-message.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ErrorMessageComponent {

  @Input() public message: string;
}
