import {ChangeDetectionStrategy, Component, Input, OnDestroy, OnInit} from '@angular/core';
import {ProgressBarMode} from '@angular/material/progress-bar';
import {ThemePalette} from '@angular/material/core';
import {AbstractControl} from '@angular/forms';
import {Length} from '../../../../config/form.config';
import {Subscription} from 'rxjs';

@Component({
  selector: 'files-file-size-bar',
  templateUrl: './file-size-bar.component.html',
  styleUrls: ['./file-size-bar.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default
})
export class FileSizeBarComponent implements OnInit, OnDestroy {

  public barValue: number;
  public mode: ProgressBarMode;
  public color: ThemePalette;
  public fileSize: number;
  @Input() public fileInput: AbstractControl;
  public readonly maxFileSize: number;
  private subscription: Subscription;

  public constructor() {
    this.maxFileSize = Length.maxFileSize;
  }

  public ngOnInit(): void {
    this.barValue = 0;
    this.fileSize = 0;
    this.mode = 'determinate';
    this.color = 'primary';
    this.subscription = this.fileInput.valueChanges.subscribe(file => {
      if (file === null) {
        this.barValue = 0;
        this.fileSize = 0;
      } else {
        this.barValue = (file.size / this.maxFileSize) * 100;
        this.fileSize = file.size;
        this.color = this.barValue > 100 ? 'warn' : 'primary';
      }
    });
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
