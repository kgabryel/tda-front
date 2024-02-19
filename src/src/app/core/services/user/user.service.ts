import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {authRoutes, settingsRoutes} from '../../../config/routes.config';
import {EmailSettings, Settings} from '../../models/settings';
import {ChangePasswordRequest} from '../../requests/change-password.request';
import {ResetPasswordRequest} from '../../requests/auth.request';
import {map} from 'rxjs/operators';

interface ChangedField {
  field: string;
  value: number | boolean;
}

@Injectable()
export class UserService {

  private httpClient: HttpClient;

  constructor(httpClient: HttpClient) {
    this.httpClient = httpClient;
  }

  public load(): Observable<Settings> {
    return this.httpClient.get<Settings>(settingsRoutes.index);
  }

  public changePassword(request: ChangePasswordRequest): Observable<void> {
    return this.httpClient.post<void>(authRoutes.changePassword, request);
  }

  public sendResetPasswordRequest(email: string): Observable<void> {
    return this.httpClient.post<void>(authRoutes.sendResetPassword, {email, lang: localStorage.getItem('lang') ?? 'pl'});
  }

  public resetPassword(request: ResetPasswordRequest): Observable<void> {
    return this.httpClient.post<void>(authRoutes.resetPassword, request);
  }

  public changeSettings(field: string, value: number | boolean): Observable<ChangedField> {
    return this.httpClient.post<any>(settingsRoutes.changeSettings(field), {value}).pipe(
      map(() => {
        return {
          field: field,
          value: value
        };
      })
    );
  }

  public changeEmail(email: string | null): Observable<EmailSettings> {
    return this.httpClient.post<EmailSettings>(settingsRoutes.changeEmail, {email});
  }

  public confirmEmail(code: string): Observable<EmailSettings> {
    return this.httpClient.post<EmailSettings>(settingsRoutes.confirmEmail, {code});
  }

  public sendCode(): Observable<void> {
    return this.httpClient.post<void>(settingsRoutes.sendCode, null);
  }
}
