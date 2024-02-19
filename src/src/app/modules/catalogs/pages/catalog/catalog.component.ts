import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {Observable} from 'rxjs';
import {Store} from '@ngrx/store';
import {State} from '../../../../core/store/catalogs/reducers';
import {ActivatedRoute, Router} from '@angular/router';
import {selectCatalog} from '../../../../core/store/catalogs/selectors';
import {tap} from 'rxjs/operators';
import {PathUtils} from '../../../../core/utils/path.utils';
import {RoutingConfig} from '../../../../config/routing.config';
import {Catalog} from '../../../../core/models/catalog';

@Component({
  selector: 'catalogs-pages-catalog',
  templateUrl: './catalog.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CatalogComponent implements OnInit {

  public catalog$: Observable<Catalog>;
  private store: Store<State>;
  private route: ActivatedRoute;
  private router: Router;

  public constructor(router: Router, store: Store<State>, route: ActivatedRoute) {
    router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.store = store;
    this.route = route;
    this.router = router;
  }

  public ngOnInit(): void {
    this.catalog$ = this.store.select(selectCatalog(parseInt(this.route.snapshot.paramMap.get('id')))).pipe(
      tap(catalog => {
        if (catalog === undefined) {
          this.router.navigate([PathUtils.concatPath(RoutingConfig.catalogs)]);
        }
      }));
  }
}
