import {ChangeDetectionStrategy, Component, EventEmitter, Input, Output} from '@angular/core';
import {Bookmark} from '../../../../core/models/bookmark';

@Component({
  selector: 'simple-view-bookmark',
  templateUrl: './bookmark.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BookmarkComponent {

  @Input() public bookmark: Bookmark;
  @Input() public delete: boolean = true;
  @Output() private undo: EventEmitter<number>;

  public constructor() {
    this.undo = new EventEmitter<number>();
  }

  public remove(): void {
    this.undo.emit(this.bookmark.id);
  }
}
