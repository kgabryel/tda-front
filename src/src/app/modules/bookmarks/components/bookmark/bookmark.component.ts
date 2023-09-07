import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {Bookmark} from '../../../../core/models/bookmark';

@Component({
  selector: 'bookmarks-bookmark',
  templateUrl: './bookmark.component.html',
  styleUrls: ['./bookmark.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BookmarkComponent {

  @Input() public bookmark: Bookmark;
}
