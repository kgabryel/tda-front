import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {Store} from '@ngrx/store';
import {State} from '../../../../core/store/colors/reducers';
import {Observable} from 'rxjs';
import {Color} from '../../../../core/models/color';
import {selectColors} from '../../../../core/store/colors/selectors';
import {colorDelete} from '../../../../core/store/colors/actions';
import {Clipboard} from '@angular/cdk/clipboard';
import {NotificationService} from '../../../../core/services/notification/notification.service';
import {DeleteSheetComponent} from '../../../shared/components/delete-sheet/delete-sheet.component';
import {MatBottomSheet} from '@angular/material/bottom-sheet';
import {filter} from 'rxjs/operators';

@Component({
  selector: 'settings-colors',
  templateUrl: './colors.component.html',
  styleUrls: ['./colors.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ColorsComponent implements OnInit {

  public colors$: Observable<Color[]>;
  private store: Store<State>;
  private clipboard: Clipboard;
  private notificationService: NotificationService;
  private deleteSheet: MatBottomSheet;

  public constructor(
    store: Store<State>,
    clipboard: Clipboard,
    notificationService: NotificationService,
    deleteSheet: MatBottomSheet
  ) {
    this.store = store;
    this.clipboard = clipboard;
    this.notificationService = notificationService;
    this.deleteSheet = deleteSheet;
  }

  public ngOnInit(): void {
    this.colors$ = this.store.select(selectColors);
  }

  public delete(id: number): void {
    const sheetRef = this.deleteSheet.open(DeleteSheetComponent);
    sheetRef.afterDismissed()
      .pipe(filter(action => action))
      .subscribe(() => this.store.dispatch(colorDelete({id})));
  }

  public copy(color: string): void {
    this.clipboard.copy(color);
    this.notificationService.showMessage('messages.copied');
  }
}
