import {ChangeDetectionStrategy, Component, EventEmitter, Input, Output} from '@angular/core';
import {File} from '../../../../core/models/file';
import {FilesService} from '../../../../core/services/files/files.service';

@Component({
  selector: 'simple-view-file',
  templateUrl: './file.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FileComponent {

  @Input() public file: File;
  @Input() public delete: boolean = true;
  @Output() private undo: EventEmitter<number>;
  private filesService: FilesService;

  public constructor(filesService: FilesService) {
    this.undo = new EventEmitter<number>();
    this.filesService = filesService;
  }

  public download(): void {
    this.filesService.download(this.file.id, this.file.name, this.file.extension);
  }

  public remove(): void {
    this.undo.emit(this.file.id);
  }
}
