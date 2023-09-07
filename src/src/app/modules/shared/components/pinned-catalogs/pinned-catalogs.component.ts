import {ChangeDetectionStrategy, Component, Input, OnDestroy, OnInit} from '@angular/core';
import {Store} from '@ngrx/store';
import {State} from '../../../../core/store/catalogs/reducers';
import {searchPinned} from '../../../../core/store/catalogs/selectors';
import {Catalog} from '../../../../core/models/catalog';
import {StringUtils} from '../../../../core/utils/string.utils';
import {FormControl} from '@angular/forms';
import {Subscription} from 'rxjs';

@Component({
  selector: 'shared-pinned-catalogs',
  templateUrl: './pinned-catalogs.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PinnedCatalogsComponent implements OnInit, OnDestroy {

  @Input() public catalogs: number[];
  public items: Catalog[];
  public name: FormControl;
  private store: Store<State>;
  private subscription: Subscription;

  public constructor(store: Store<State>) {
    this.store = store;
    this.name = new FormControl('');
    this.catalogs = [];
    this.items = [];
  }

  public ngOnInit(): void {
    this.name.setValue('');
    this.search();
    this.subscription = this.name.valueChanges.subscribe(() => this.search());
  }

  public search(): void {
    this.store.select(searchPinned(this.catalogs, this.name.value))
      .subscribe(catalogs => this.items = catalogs.sort(
        (a, b) => StringUtils.compareString(a.name, b.name)
      ));
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
