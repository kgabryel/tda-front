import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {AuthRequest} from '../../requests/auth.request';
import {Observable, of} from 'rxjs';
import {Tokens, TokensData} from '../../data/tokens.data';
import {authRoutes} from '../../../config/routes.config';
import {catchError, map} from 'rxjs/operators';
import {environment} from '../../../../environments/environment';

@Injectable()
export class AccessService {
  private httpClient: HttpClient;

  constructor(httpClient: HttpClient) {
    this.httpClient = httpClient;
  }

  private static getInvalidToken(): TokensData {
    return {
      access_token: null,
      refresh_token: null,
      errorMessage: null,
      isCorrect: false
    };
  }

  private static parse(data: Tokens): TokensData {
    return {
      access_token: data.access_token,
      refresh_token: data.refresh_token,
      errorMessage: null,
      isCorrect: true
    };
  }

  private static handleInvalidData(status: number): Observable<TokensData> {
    const data: TokensData = AccessService.getInvalidToken();
    if (status === 422 || status === 401) {
      data.errorMessage = 'messages.invalidData';
    } else {
      data.errorMessage = 'messages.serverError';
    }
    return of(data);
  }

  public login(registerRequest: AuthRequest): Observable<TokensData> {
    return this.httpClient.post<Tokens>(authRoutes.login, registerRequest).pipe(
      map<Tokens, TokensData>(data => AccessService.parse(data)),
      catchError(error => AccessService.handleInvalidData(error.status))
    );
  }

  public register(registerRequest: AuthRequest): Observable<TokensData> {
    return this.httpClient.post<Tokens>(authRoutes.register, registerRequest).pipe(
      map<Tokens, TokensData>(data => AccessService.parse(data)),
      catchError(error => AccessService.handleInvalidData(error.status))
    );
  }

  public fbRedirect(): void {
    window.location.href = environment.baseUrl + 'api/facebook/redirect';
  }

  public loginViaFb(authToken: string): Observable<TokensData> {
    return this.httpClient.post<Tokens>(
      authRoutes.fbLogin, {code: authToken, lang: localStorage.getItem('lang') ?? 'pl'}
    ).pipe(
      map<Tokens, TokensData>(data => AccessService.parse(data)),
      catchError(() => of(AccessService.getInvalidToken()))
    );
  }
}
