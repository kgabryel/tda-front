import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';
import {Observable, of} from 'rxjs';
import {AuthService} from '../../services/auth/auth.service';
import {PathUtils} from '../../utils/path.utils';
import {RoutingConfig} from '../../../config/routing.config';
import {switchMap} from 'rxjs/operators';

@Injectable()
export class AuthGuard implements CanActivate {
  private authService: AuthService;
  private router: Router;

  public constructor(authService: AuthService, router: Router) {
    this.authService = authService;
    this.router = router;
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return this.authService.isLogged().pipe(switchMap(result => {
      if (result) {
        return of(true);
      }
      this.router.navigate([PathUtils.concatPath(RoutingConfig.login)]);
      return of(false);
    }));
  }
}
