import {ChangeDetectionStrategy, Component, Input, OnInit} from '@angular/core';
import {Observable} from 'rxjs';
import {Catalog} from '../../../../core/models/catalog';
import {Store} from '@ngrx/store';
import {State} from '../../../../core/store/catalogs/reducers';
import {selectCatalog} from '../../../../core/store/catalogs/selectors';

@Component({
  selector: 'catalogs-catalog-view',
  templateUrl: './catalog-view.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CatalogViewComponent implements OnInit {

  @Input() public id: number;
  public catalog$: Observable<Catalog>;
  private store: Store<State>;

  public constructor(store: Store<State>) {
    this.store = store;
  }

  public ngOnInit(): void {
    this.catalog$ = this.store.select(selectCatalog(this.id));
  }

}
