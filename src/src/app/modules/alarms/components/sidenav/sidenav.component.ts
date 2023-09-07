import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {BreakpointObserver} from '@angular/cdk/layout';
import {Observable} from 'rxjs';
import {doubleToolbarBreakPoint} from '../../../../config/sizes.config';
import {map} from 'rxjs/operators';
import {AlarmCatalogs, AlarmCatalogsService} from '../../../../core/services/alarm-catalogs/alarm-catalogs.service';

@Component({
  selector: 'alarms-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SidenavComponent implements OnInit {

  public small$: Observable<boolean>;
  public showed$: Observable<AlarmCatalogs>;
  private breakpointObserver: BreakpointObserver;
  private alarmCatalogsService: AlarmCatalogsService;

  public constructor(breakpointObserver: BreakpointObserver, alarmCatalogsService: AlarmCatalogsService) {
    this.breakpointObserver = breakpointObserver;
    this.alarmCatalogsService = alarmCatalogsService;
  }

  public ngOnInit(): void {
    this.showed$ = this.alarmCatalogsService.getState();
    this.close();
    this.small$ = this.breakpointObserver.observe(doubleToolbarBreakPoint).pipe(map(size => size.matches));
  }

  public close(): void {
    this.alarmCatalogsService.changeStatus({
      open: false,
      alarmId: ''
    });
  }
}
