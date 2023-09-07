import {Injectable} from '@angular/core';
import {HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {BehaviorSubject, Observable, throwError} from 'rxjs';
import {catchError, filter, switchMap, take} from 'rxjs/operators';
import {AuthService} from '../../services/auth/auth.service';
import {Router} from '@angular/router';
import {PathUtils} from '../../utils/path.utils';
import {RoutingConfig} from '../../../config/routing.config';
import {EventsService} from '../../services/events/events.service';
import {StoreService} from '../../services/store/store.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  private isRefreshing;
  private authService: AuthService;
  private refreshed: BehaviorSubject<boolean>;
  private router: Router;
  private readonly storeService: StoreService;
  private readonly eventsService: EventsService;

  constructor(authService: AuthService, router: Router, storeService: StoreService, eventsService: EventsService) {
    this.isRefreshing = false;
    this.authService = authService;
    this.router = router;
    this.refreshed = new BehaviorSubject<boolean>(false);
    this.storeService = storeService;
    this.eventsService = eventsService;
  }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(catchError(error => {
      if (error instanceof HttpErrorResponse && error.status === 401) {
        return this.handle401(request, next);
      } else {
        return throwError(error);
      }
    }));
  }

  private handle401(request: HttpRequest<any>, next: HttpHandler) {
    if (!this.isRefreshing) {
      this.isRefreshing = true;
      this.refreshed.next(false);
      return this.authService.refreshToken().pipe(
        switchMap((tokens: any) => {
          this.isRefreshing = false;
          if (tokens.isCorrect) {
            this.authService.storeToken(tokens);
            return next.handle(this.authService.addTokenToRequest(request));
          } else {
            AuthService.clearTokens(this.storeService, this.eventsService);
            this.router.navigate([PathUtils.concatPath(RoutingConfig.login)]);
            return next.handle(request.clone());
          }
        }));
    }
    return this.refreshed.pipe(
      filter(refreshed => refreshed),
      take(1),
      switchMap(() => next.handle(request.clone())
      ));
  }
}
