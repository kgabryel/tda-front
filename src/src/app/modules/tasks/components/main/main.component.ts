import {ChangeDetectionStrategy, Component, OnDestroy} from '@angular/core';
import {DateAdapter} from '@angular/material/core';
import {LangService} from '../../../../core/services/lang/lang.service';
import {NgxMatDateAdapter} from '@angular-material-components/datetime-picker';
import {Subscription} from 'rxjs';

@Component({
  selector: 'tasks-main',
  templateUrl: './main.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MainComponent implements OnDestroy {

  private subscription: Subscription;

  public constructor(dateAdapter: DateAdapter<any>, langService: LangService, ngxDateAdapter: NgxMatDateAdapter<any>) {
    this.subscription = langService.getState().subscribe(lang => {
      dateAdapter.setLocale(lang);
      ngxDateAdapter.setLocale(lang);
    });
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
