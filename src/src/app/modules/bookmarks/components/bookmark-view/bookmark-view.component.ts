import {ChangeDetectionStrategy, Component, Input, OnInit} from '@angular/core';
import {Observable} from 'rxjs';
import {Bookmark} from '../../../../core/models/bookmark';
import {Store} from '@ngrx/store';
import {State} from '../../../../core/store/bookmarks/reducers';
import {selectBookmark} from '../../../../core/store/bookmarks/selectors';

@Component({
  selector: 'bookmarks-bookmark-view',
  templateUrl: './bookmark-view.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BookmarkViewComponent implements OnInit {

  @Input() public id: number;
  public bookmark$: Observable<Bookmark>;
  private store: Store<State>;

  public constructor(store: Store<State>) {
    this.store = store;
  }

  public ngOnInit(): void {
    this.bookmark$ = this.store.select(selectBookmark(this.id));
  }

}
