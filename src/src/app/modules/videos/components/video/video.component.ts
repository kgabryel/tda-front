import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  HostListener,
  Input,
  OnInit,
  ViewChild
} from '@angular/core';
import {Video} from '../../../../core/models/video';
import {videoDelete, videoUpdate} from '../../../../core/store/videos/actions';
import {State} from '../../../../core/store/videos/reducers';
import {Store} from '@ngrx/store';
import {SidenavService} from '../../../../core/services/sidenav/sidenav.service';
import {WatchedRequest} from '../../../../core/requests/video.request';
import {MatBottomSheet} from '@angular/material/bottom-sheet';
import {DeleteSheetComponent} from '../../../shared/components/delete-sheet/delete-sheet.component';
import {PinnedSidenavService, Type} from '../../../../core/services/pinned-sidenav/pinned-sidenav.service';
import {BehaviorSubject} from 'rxjs';
import {filter} from 'rxjs/operators';

@Component({
  selector: 'videos-video',
  templateUrl: './video.component.html',
  styleUrls: ['./video.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default
})
export class VideoComponent implements OnInit, AfterViewInit {

  @Input() public video: Video;
  public headerWidth: BehaviorSubject<string>;
  @ViewChild('header') header: ElementRef;
  public loading: boolean;
  private store: Store<State>;
  private sidenavService: SidenavService<Video>;
  private deleteSheet: MatBottomSheet;
  private pinnedSidenavService: PinnedSidenavService;

  public constructor(
    store: Store<State>,
    sidenavService: SidenavService<Video>,
    deleteSheet: MatBottomSheet,
    pinnedSidenavService: PinnedSidenavService
  ) {
    this.pinnedSidenavService = pinnedSidenavService;
    this.store = store;
    this.sidenavService = sidenavService;
    this.deleteSheet = deleteSheet;
    this.headerWidth = new BehaviorSubject<string>('0px');
  }

  public ngOnInit(): void {
    this.loading = true;
  }

  public edit(): void {
    this.sidenavService.changeStatus({
      open: true,
      model: this.video
    });
  }

  public delete(): void {
    const sheetRef = this.deleteSheet.open(DeleteSheetComponent);
    sheetRef.afterDismissed()
      .pipe(filter(action => action))
      .subscribe(() => this.store.dispatch(videoDelete({id: this.video.id})));
  }

  public switchWatched(): void {
    const request: WatchedRequest = {
      watched: !this.video.watched
    };
    this.store.dispatch(videoUpdate({
      id: this.video.id,
      request
    }));
  }

  public showTasks(): void {
    this.pinnedSidenavService.changeStatus({
      open: true,
      tasks: this.video.tasks,
      catalogs: [],
      type: Type.tasks
    });
  }

  public showCatalogs(): void {
    this.pinnedSidenavService.changeStatus({
      open: true,
      tasks: [],
      catalogs: this.video.catalogs,
      type: Type.catalogs
    });
  }

  @HostListener('window:resize')
  public onResize(): void {
    this.resize();
  }

  public ngAfterViewInit(): void {
    this.resize();
  }

  public ready(): void {
    this.loading = false;
  }

  private resize(): void {
    this.headerWidth.next('0px');
    setTimeout(() => this.headerWidth.next(this.header.nativeElement.parentElement.clientWidth + 'px'), 200);
  }
}
