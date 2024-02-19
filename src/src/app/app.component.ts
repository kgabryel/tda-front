import {Component} from '@angular/core';
import {NavigationEnd, NavigationStart, Router} from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: []
})
export class AppComponent {
  public isLoading: boolean;

  public constructor(router: Router) {
    router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        this.isLoading = true;
      }
      if (event instanceof NavigationEnd) {
        this.isLoading = false;
      }
    });
  }
}
