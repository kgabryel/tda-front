import {Injectable} from '@angular/core';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable} from 'rxjs';
import {AuthService} from '../../services/auth/auth.service';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {

  private authService: AuthService;

  constructor(authService: AuthService) {
    this.authService = authService;
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(this.authService.addTokenToRequest(req));
  }


}
