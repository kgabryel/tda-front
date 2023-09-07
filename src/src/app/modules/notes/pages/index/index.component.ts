import {ChangeDetectionStrategy, Component, HostListener, OnDestroy, OnInit} from '@angular/core';
import {BehaviorSubject, Observable, Subscription, timer} from 'rxjs';
import {Store} from '@ngrx/store';
import {Note} from '../../../../core/models/note';
import {searchNotes} from '../../../../core/store/notes/selectors';
import {State} from '../../../../core/store/notes/reducers';
import {ResizerService, Result, Sizes} from '../../../../core/services/resizer/resizer.service';
import {notesSizes} from '../../../../config/sizes.config';
import {debounce, filter, switchMap} from 'rxjs/operators';
import {NotesSearchService} from '../../../../core/services/notes-search/notes-search.service';
import {MatDialog} from '@angular/material/dialog';
import {ModalService} from '../../../../core/services/modal/modal.service';
import {SearchComponent} from '../../components/search/search.component';
import {SearchService} from '../../../../core/services/search/search.service';

@Component({
  selector: 'notes-pages-index',
  templateUrl: './index.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class IndexComponent implements OnInit, OnDestroy {

  public notes$: Observable<Note[]>;
  public width: string;
  public height: string;
  public search$: BehaviorSubject<boolean>;
  private store: Store<State>;
  private resizer: ResizerService;
  private readonly sizes: Sizes;
  private notesSearchService: NotesSearchService;
  private dialog: MatDialog;
  private modal: Observable<boolean>;
  private subscription: Subscription;
  private searchService: SearchService;

  public constructor(
    store: Store<State>,
    resizer: ResizerService,
    notesSearchService: NotesSearchService,
    dialog: MatDialog,
    modalService: ModalService,
    searchService: SearchService
  ) {
    this.sizes = notesSizes;
    this.store = store;
    this.resizer = resizer;
    this.notesSearchService = notesSearchService;
    this.dialog = dialog;
    this.modal = modalService.getState();
    this.search$ = new BehaviorSubject<boolean>(false);
    this.searchService = searchService;
  }

  public ngOnInit(): void {
    this.notes$ = this.notesSearchService.getState().pipe(
      switchMap(search => this.store.select(searchNotes(search))),
      debounce(() => timer(200))
    );
    const sizes: Result = this.resizer.calculateSizes(this.sizes, window.innerWidth, window.innerHeight);
    this.width = sizes.width;
    this.height = sizes.height;
    this.subscription = this.modal.pipe(filter(data => data))
      .subscribe(() => this.dialog.open(SearchComponent, {autoFocus: false}));
    this.searchService.getSearchState().pipe(filter(search => search))
      .subscribe(() => this.search$.next(true));
    this.notes$.subscribe(() => this.search$.next(false));
    this.dialog.closeAll();
  }

  @HostListener('window:resize')
  public onResize(): void {
    const sizes: Result = this.resizer.calculateSizes(this.sizes, window.innerWidth, window.innerHeight);
    this.width = sizes.width;
    this.height = sizes.height;
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
