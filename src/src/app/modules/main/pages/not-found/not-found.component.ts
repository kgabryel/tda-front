import {ChangeDetectionStrategy, Component} from '@angular/core';
import {ImagesConfig} from '../../../../config/images.config';

@Component({
  selector: 'main-pages-not-found',
  templateUrl: './not-found.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NotFoundComponent {

  public notFoundPath: string;

  public constructor() {
    this.notFoundPath = ImagesConfig.notFound;
  }
}
