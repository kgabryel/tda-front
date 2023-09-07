import {ChangeDetectionStrategy, Component} from '@angular/core';

@Component({
  selector: 'dashboard-page-index',
  templateUrl: './index.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class IndexComponent {
  public constructor() {
  }
}
