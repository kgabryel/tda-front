import {ChangeDetectionStrategy, Component, Inject} from '@angular/core';
import {SidenavService} from '../../../../core/services/sidenav/sidenav.service';
import {LayoutConfig} from '../../../../config/layout.config';
import {ImagesConfig} from '../../../../config/images.config';

@Component({
  selector: 'header-menu',
  templateUrl: './menu.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MenuComponent {

  public logoPath: string;
  private sidenavService: SidenavService<void>;

  public constructor(@Inject(LayoutConfig.menuServiceName) sidenavService: SidenavService<void>) {
    this.sidenavService = sidenavService;
    this.logoPath = ImagesConfig.logoPath;
  }

  public showMenu(): void {
    this.sidenavService.changeStatus({
      open: true,
      model: null
    });
  }
}
