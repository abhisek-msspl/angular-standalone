import { HttpService } from '@core/http';
import { Injectable } from '@angular/core';
import { appSettings } from '@app/configs';
import { Observable, of, tap } from 'rxjs';
import { CommonService } from '@core/services';
import { CookieService } from 'ngx-cookie-service';
import { HttpStatusCode } from '@angular/common/http';
import { browserInfo } from 'src/app/shared/utilities';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  private credentials: string = appSettings.credentialsKey;

  constructor(
    private _http: HttpService,
    private _commonService: CommonService,
    private _cookieService: CookieService
  ) {}

  /**
   * *Authenticates with the selected strategy
   * *Stores user info in the storage
   *
   * @param data login credentials
   * @returns observable
   * @developer Abhisek Dhua
   */
  public authenticate(
    data: IAuthParam,
    remember_me: boolean,
    user_type: string
  ): Observable<unknown> {
    const param: IAuthParam = {
      ...data,
      user_type: user_type,
      browser_id: browserInfo().browser_id,
      browser_name: browserInfo().browser_name,
      browser_version: browserInfo().browser_version,
    };
    return this._http.post('login', param).pipe(
      tap(result => {
        const authData: IAuthResponse = result.response.data;

        if (result.status === HttpStatusCode.Ok) {
          const storedData: string = this._cookieService.get(
            appSettings.rememberKey
          );
          this._cookieService.deleteAll();
          if (storedData && remember_me) {
            this._cookieService.set(appSettings.rememberKey, storedData, {
              path: '/',
            });
          }
          this._cookieService.set(
            this.credentials,
            JSON.stringify({ ...authData, user_type: user_type }),
            {
              path: '/',
            }
          );
          // take token backup
          this._commonService.saveToken(
            JSON.stringify({ ...authData, user_type: user_type })
          );
        }
        return authData;
      })
    );
  }

  /**
   * *Handling forget password
   *
   * @param param email for forget password
   * @returns observable
   * @developer Abhisek Dhua
   */
  public forgetPassword(param: IForgetPasswordParam): Observable<unknown> {
    return this._http.post('sendMail', param);
  }

  /**
   * *Resetting user password
   *
   * @param data for reset pwd
   * @returns observable
   * @developer Abhisek Dhua
   */
  public resetPassword(data: IResetPWDParam): Observable<unknown> {
    return this._http.post('resetPwd', data);
  }

  /**
   * *Creating user password
   *
   * @param data for reset pwd
   * @returns observable
   * @developer Abhisek Dhua
   */
  public createPassword(data: ICreatePWDParam): Observable<unknown> {
    return this._http.post('generatePwd', data);
  }

  /**
   * *getting user from storage
   *
   * @returns current user's data
   * @developer Abhisek Dhua
   */
  private getUser(): IAuthResponse {
    const user = this._cookieService.get(this.credentials) as string;
    const savedCredentials: IAuthResponse =
      user !== '' ? JSON.parse(user) : null;
    // take token backup
    if (user) this._commonService.saveToken(user);
    return savedCredentials;
  }

  /**
   * *Returning current user detail from storage
   *
   * @returns observable of current user
   * @developer Abhisek Dhua
   */
  public getUserInfo(): Observable<IAuthResponse> {
    const savedCredentials: IAuthResponse = this.getUser();
    return of(savedCredentials);
  }

  /**
   * *Getting current user token from cookie
   *
   * @returns JWT Token
   * @developer Abhisek Dhua
   */
  public getToken(): string {
    const savedCredentials: IAuthResponse = this.getUser();
    return savedCredentials != null ? savedCredentials.token : '';
  }

  /**
   * *Getting current user type from cookie
   *
   * @returns User Type
   * @developer Abhisek Dhua
   */
  public getUserType(): string {
    const userInfo: IAuthResponse = this.getUser();
    return userInfo != null
      ? userInfo.user_type
        ? userInfo.user_type
        : ''
      : '';
  }

  /* Removing current user detail from storage */
  private clearUserInfo() {
    this._cookieService.delete(this.credentials);
    this._cookieService.delete(this.credentials, '/');
  }

  /**
   * *Sign outs user
   * *Removes details from the token storage
   *
   * @returns observable of boolean
   * @developer Abhisek Dhua
   */
  public logout() {
    // if api call is require please call here
    this.clearUserInfo();
  }

  /**
   * *If user is authenticated
   *
   * @returns boolean if authenticated
   * @developer Abhisek Dhua
   */
  public isAuthenticated() {
    if (this._cookieService.get(this.credentials)) {
      return true;
    }
    return false;
  }

  /**
   * *Generate new token
   *
   * @returns refresh token
   * @developer Abhisek Dhua
   */
  public getRefreshToken() {
    const userInfo = this.getUser();
    const param: IRegenerateTokenParam = {
      browser_id: browserInfo().browser_id,
      refresh_token: userInfo.refresh_token,
      browser_name: browserInfo().browser_name,
      browser_version: browserInfo().browser_version,
    };
    return this._http.post('regenerateToken', param);
  }

  /**
   * *Updating new tokens in cookie
   *
   * @param authData refresh auth result
   * @developer Abhisek Dhua
   */
  public updateRefreshedToken(authData: IAuthResponse): void {
    const savedCredentials: IAuthResponse = this.getUser();
    // get remember me
    // const rememberMe = this._cookieService.get(appSettings.rememberKey);
    const updated = {
      ...savedCredentials,
      ...authData,
    };
    // delete cookie before delete
    // this._cookieService.deleteAll();
    // set cookie
    // if (rememberMe)
    //   this._cookieService.set(appSettings.rememberKey, rememberMe, {
    //     path: '/',
    //   });
    this._cookieService.set(this.credentials, JSON.stringify(updated), {
      path: '/',
    });
    // take token backup
    this._commonService.saveToken(JSON.stringify(updated));
  }
}
