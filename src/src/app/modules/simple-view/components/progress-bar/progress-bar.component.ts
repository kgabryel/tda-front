import {ChangeDetectionStrategy, Component, Input, OnInit} from '@angular/core';
import {DownloadProgressService} from '../../../../core/services/download-progress/download-progress.service';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';

@Component({
  selector: 'simple-view-progress-bar',
  templateUrl: './progress-bar.component.html',
  styleUrls: ['./progress-bar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProgressBarComponent implements OnInit {

  @Input() public id: number;
  public barValue$: Observable<number>;
  public visible$: Observable<boolean>;
  public downloaded$: Observable<number>;
  public fileSize$: Observable<number>;
  private downloadProgressService: DownloadProgressService;

  public constructor(downloadProgressService: DownloadProgressService) {
    this.downloadProgressService = downloadProgressService;
  }

  public ngOnInit(): void {
    const state = this.downloadProgressService.getState(this.id);
    this.barValue$ = state.pipe(map(progress => (progress.downloaded / progress.total) * 100));
    this.visible$ = state.pipe(map(progress => progress.status !== -1));
    this.downloaded$ = state.pipe(map(progress => progress.downloaded));
    this.fileSize$ = state.pipe(map(progress => progress.total));
  }
}
