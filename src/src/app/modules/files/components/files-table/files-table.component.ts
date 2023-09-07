import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {File} from '../../../../core/models/file';
import {Observable} from 'rxjs';

@Component({
  selector: 'files-files-table',
  templateUrl: './files-table.component.html',
  styleUrls: ['./files-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FilesTableComponent {

  @Input() public files$: Observable<File[]>;
}
