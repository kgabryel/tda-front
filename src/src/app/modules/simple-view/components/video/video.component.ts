import {ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Video} from '../../../../core/models/video';

@Component({
  selector: 'simple-view-video',
  templateUrl: './video.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class VideoComponent implements OnInit {

  @Input() public video: Video;
  @Input() public delete: boolean = true;
  public href: string;
  @Output() private undo: EventEmitter<number>;

  public constructor() {
    this.undo = new EventEmitter<number>();
  }

  public ngOnInit(): void {
    this.href = 'https://www.youtube.com/watch?v=' + this.video.ytId;
  }

  public remove(): void {
    this.undo.emit(this.video.id);
  }
}
