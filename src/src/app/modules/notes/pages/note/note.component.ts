import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {Observable} from 'rxjs';
import {Store} from '@ngrx/store';
import {State} from '../../../../core/store/notes/reducers';
import {ActivatedRoute, Router} from '@angular/router';
import {selectNote} from '../../../../core/store/notes/selectors';
import {tap} from 'rxjs/operators';
import {PathUtils} from '../../../../core/utils/path.utils';
import {RoutingConfig} from '../../../../config/routing.config';
import {Note} from '../../../../core/models/note';

@Component({
  selector: 'notes-pages-note',
  templateUrl: './note.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NoteComponent implements OnInit {

  public note$: Observable<Note>;
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
    this.note$ = this.store.select(selectNote(parseInt(this.route.snapshot.paramMap.get('id')))).pipe(
      tap(catalog => {
        if (catalog === undefined) {
          this.router.navigate([PathUtils.concatPath(RoutingConfig.notes)]);
        }
      }));
  }
}
