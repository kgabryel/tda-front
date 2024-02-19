import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {SidenavService} from '../../../../core/services/sidenav/sidenav.service';
import {Catalog} from '../../../../core/models/catalog';

@Component({
  selector: 'catalogs-add-button',
  templateUrl: './add-button.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AddButtonComponent implements OnInit {

  private sidenavService: SidenavService<Catalog>;

  public constructor(sidenavService: SidenavService<Catalog>) {
    this.sidenavService = sidenavService;
  }

  public ngOnInit(): void {
    this.sidenavService.changeStatus({
      open: false,
      model: null
    });
  }

  public showSidenav(): void {
    this.sidenavService.changeStatus({
      open: true,
      model: null
    });
  }
}
