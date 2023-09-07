import {ChangeDetectionStrategy, Component, OnDestroy, OnInit} from '@angular/core';
import {Subject, Subscription} from 'rxjs';
import {ProgressBarMode} from '@angular/material/progress-bar';
import {ThemePalette} from '@angular/material/core';
import {UploadFileService} from '../../../../core/services/upload-file/upload-file.service';

@Component({
  selector: 'files-upload-progress-overlay',
  templateUrl: './upload-progress-overlay.component.html',
  styleUrls: ['./upload-progress-overlay.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default
})
export class UploadProgressOverlayComponent implements OnInit, OnDestroy {

  public barValue$: Subject<number>;
  public mode$: Subject<ProgressBarMode>;
  public color: ThemePalette;
  public uploaded$: Subject<number>;
  public fileSize$: Subject<number>;
  public progress$: Subject<string>;
  private uploadFileService: UploadFileService;
  private subscription: Subscription;

  public constructor(uploadFileService: UploadFileService) {
    this.barValue$ = new Subject();
    this.progress$ = new Subject();
    this.mode$ = new Subject();
    this.color = 'primary';
    this.fileSize$ = new Subject();
    this.uploaded$ = new Subject();
    this.uploadFileService = uploadFileService;
  }

  public ngOnInit(): void {
    this.subscription = this.uploadFileService.getState().subscribe(data => {
      let type: number = data.type;
      if (type === 0) {
        this.barValue$.next(0);
        this.mode$.next('indeterminate');
      } else if (type === 1) {
        this.mode$.next('buffer');
        this.barValue$.next((data['loaded'] / data['total']) * 100);
        const loaded = data['loaded'];
        const total = data['total'];
        this.uploaded$.next(loaded);
        this.fileSize$.next(total);
        this.progress$.next(((loaded / total) * 100).toFixed(2));
      } else {
        this.barValue$.next(100);
        this.mode$.next('determinate');
      }
    });
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
