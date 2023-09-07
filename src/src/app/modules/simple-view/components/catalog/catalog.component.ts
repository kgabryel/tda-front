import {ChangeDetectionStrategy, Component, EventEmitter, Input, Output} from '@angular/core';
import {Catalog} from '../../../../core/models/catalog';

@Component({
  selector: 'simple-view-catalog',
  templateUrl: './catalog.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CatalogComponent {

  @Input() public catalog: Catalog;
  @Input() public delete: boolean = true;
  @Output() private undo: EventEmitter<number>;

  public constructor() {
    this.undo = new EventEmitter<number>();
  }

  public remove(): void {
    this.undo.emit(this.catalog.id);
  }
}
