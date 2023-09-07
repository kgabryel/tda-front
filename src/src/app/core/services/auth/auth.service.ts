import {Injectable} from '@angular/core';
import {HttpClient, HttpRequest} from '@angular/common/http';
import {Observable, of} from 'rxjs';
import {catchError, map, switchMap} from 'rxjs/operators';
import {JwtHelperService} from '@auth0/angular-jwt';
import {RefreshTokenData, Tokens} from '../../data/tokens.data';
import {authRoutes} from '../../../config/routes.config';
import {StoreService} from '../store/store.service';
import {EventsService} from '../events/events.service';

const ACCESS_TOKEN = 'access_token';
const REFRESH_TOKEN = 'refresh_token';
const USER_ID = 'user_id';

@Injectable()
export class AuthService {

  private httpClient: HttpClient;
  private readonly storeService: StoreService;
  private readonly eventsService: EventsService;

  constructor(httpClient: HttpClient, storeService: StoreService, eventsService: EventsService) {
    this.httpClient = httpClient;
    this.storeService = storeService;
    this.eventsService = eventsService;
  }

  public static clearTokens(storeService: StoreService, eventsService: EventsService): void {
    localStorage.removeItem(ACCESS_TOKEN);
    localStorage.removeItem(REFRESH_TOKEN);
    localStorage.removeItem(USER_ID);
    storeService.clearStores();
    eventsService.disconnect();
  }

  public static getToken(): string {
    return localStorage.getItem(ACCESS_TOKEN);
  }

  public static getUserId(): string {
    return localStorage.getItem(USER_ID);
  }

  public static getEmptyRefreshTokenData(): RefreshTokenData {
    return {
      access_token: null,
      refresh_token: null,
      isCorrect: false
    };
  }

  public static getRefreshTokenData(tokens: Tokens): RefreshTokenData {
    return {
      access_token: tokens.access_token,
      refresh_token: tokens.refresh_token,
      isCorrect: true
    };
  }

  public storeToken(tokens: Tokens): void {
    localStorage.setItem(ACCESS_TOKEN, tokens.access_token);
    localStorage.setItem(REFRESH_TOKEN, tokens.refresh_token);
    const jwtHelper = new JwtHelperService();
    let decodedToken = jwtHelper.decodeToken(tokens.access_token);
    localStorage.setItem(USER_ID, decodedToken.sub);
  }

  public isLogged(): Observable<boolean> {
    return this.checkAccessToken().pipe(switchMap(data => {
      if (data) {
        return of(data);
      }
      return this.refreshToken().pipe(switchMap(tokens => {
        if (!tokens.isCorrect) {
          return of(false);
        }
        this.storeToken({
          access_token: tokens.access_token,
          refresh_token: tokens.refresh_token
        });
        return of(true);
      }));
    }));
  }

  public refreshToken(): Observable<RefreshTokenData> {
    return this.httpClient.post<Tokens>(authRoutes.refreshToken, {
      refresh_token: localStorage.getItem(REFRESH_TOKEN)
    }).pipe(
      map<Tokens, RefreshTokenData>(tokens => AuthService.getRefreshTokenData(tokens)),
      catchError(() => of(AuthService.getEmptyRefreshTokenData()))
    );
  }

  public addTokenToRequest(req: HttpRequest<any>): HttpRequest<any> {
    const token = AuthService.getToken();
    return req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  private checkAccessToken(): Observable<boolean> {
    const jwtHelper = new JwtHelperService();
    const accessToken = localStorage.getItem(ACCESS_TOKEN);
    if (accessToken === null) {
      AuthService.clearTokens(this.storeService, this.eventsService);
      return of(false);
    }
    let tokenDate: Date;
    try {
      tokenDate = jwtHelper.getTokenExpirationDate(accessToken);
    } catch (error) {
      return of(false);
    }
    return of(tokenDate > new Date());
  }
}
