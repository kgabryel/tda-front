import {ChangeDetectionStrategy, Component, Input, OnInit} from '@angular/core';
import {Observable} from 'rxjs';
import {Video} from '../../../../core/models/video';
import {Store} from '@ngrx/store';
import {State} from '../../../../core/store/videos/reducers';
import {selectVideo} from '../../../../core/store/videos/selectors';

@Component({
  selector: 'videos-video-view',
  templateUrl: './video-view.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class VideoViewComponent implements OnInit {

  @Input() public id: number;
  public video$: Observable<Video>;
  private store: Store<State>;

  public constructor(store: Store<State>) {
    this.store = store;
  }

  public ngOnInit(): void {
    this.video$ = this.store.select(selectVideo(this.id));
  }

}
