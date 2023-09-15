import {
  take,
  filter,
  timeout,
  finalize,
  switchMap,
  Observable,
  catchError,
  throwError,
  BehaviorSubject,
} from 'rxjs';
import {
  HttpEvent,
  HttpRequest,
  HttpHandlerFn,
  HttpStatusCode,
  HttpErrorResponse,
  HttpInterceptorFn,
} from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { appSettings } from '@app/configs';
import { environment } from 'src/environments/environment';
import { AuthenticationService } from '@core/authentication';

export const httpErrorHandlerInterceptorFn: HttpInterceptorFn = (
  request: HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> => {
  let isRefreshingToken = false;
  const timeOut = appSettings.ajaxTimeout;
  const regenerateTokenUrl = `${environment.host}/regenerateToken`;
  const tokenSubject: BehaviorSubject<string | null> = new BehaviorSubject<
    string | null
  >(null);

  const _router = inject(Router);
  const _authService = inject(AuthenticationService);

  return next(request).pipe(
    timeout(timeOut),
    catchError(error => errorHandler(error, request, next))
  );

  /* Handling error based on response codes */
  function errorHandler(
    error: HttpErrorResponse,
    request: HttpRequest<unknown>,
    next: HttpHandlerFn
  ): Observable<HttpEvent<unknown>> {
    /* in development mode printing errors in console */
    const httpErrorCode: number = error['status'];

    /* if generate refresh token api get 401(Unauthorized) error just logout */
    if (
      httpErrorCode === HttpStatusCode.Unauthorized &&
      request.url === regenerateTokenUrl
    ) {
      _authService.logout();
      _router.navigate(['/']);
    }

    switch (httpErrorCode) {
      case HttpStatusCode.BadRequest:
        return throwError(() => error);
      case HttpStatusCode.Unauthorized:
        return handle401Error(request, error, next);
      case HttpStatusCode.Forbidden:
        return handle403Error(error);
      case HttpStatusCode.NotFound:
        return handle404Error(error);
      case HttpStatusCode.InternalServerError:
        return throwError(() => error);
      default:
        return throwError(() => error);
    }
  }

  /** Handle 401 error **/
  function handle401Error(
    request: HttpRequest<unknown>,
    error: HttpErrorResponse,
    next: HttpHandlerFn
  ): Observable<HttpEvent<unknown>> {
    /**
     * If user not logged in no need to handle 401
     */
    if (!_authService.isAuthenticated()) {
      _authService.logout();
      _router.navigate(['/']);
      return throwError(() => error);
    }

    /**
     * errorType can be 'invalid_token' or 'logout'
     * if error type 'invalid token' then request for new token else,
     * for 'logout' user logged out from that login session
     */
    const errorType: 'invalid_token' | 'logout' =
      error.error.response.status.type;

    /**
     * if token invalid and required to log out,
     * then log out depending on error type 'logout'
     *
     * @developer Abhisek Dhua
     */
    if (errorType === 'logout') {
      _authService.logout();
      _router.navigate(['/']);
      return throwError(() => error);
    }

    /**
     * if token invalid then call regenerate token ${new token}
     *
     * @developer Abhisek Dhua
     */
    if (!isRefreshingToken && errorType === 'invalid_token') {
      isRefreshingToken = true;
      // Reset here so that the following requests wait until the token
      // comes back from the refreshToken call.
      tokenSubject.next(null);
      return _authService.getRefreshToken().pipe(
        switchMap(apiResult => {
          const data = apiResult.response.data;
          _authService.updateRefreshedToken(data);

          tokenSubject.next(data.token);
          return next(addTokenInHeader(request, data.token));
        }),
        catchError(error => {
          // If there is an exception calling 'refreshToken', bad news so logout.
          if (error.url === regenerateTokenUrl) {
            _authService.logout();
            _router.navigate(['/']);
          } else isRefreshingToken = false;
          return throwError(() => error);
        }),
        finalize(() => {
          isRefreshingToken = false;
        })
      );
    } else {
      return tokenSubject.pipe(
        filter(token => token !== null),
        take(1),
        switchMap(token => {
          return next(addTokenInHeader(request, token as string));
        })
      );
    }
  }

  /** Handle 403 error **/
  function handle403Error(
    error: HttpErrorResponse
  ): Observable<HttpEvent<unknown>> {
    _router.navigate(['/forbidden']); // redirect to forbidden page
    return throwError(() => error);
  }

  /** Handle 404 error **/
  function handle404Error(
    error: HttpErrorResponse
  ): Observable<HttpEvent<unknown>> {
    _router.navigate(['/not-found']); // redirect to 404 page not found
    return throwError(() => error);
  }

  function addTokenInHeader(
    request: HttpRequest<unknown>,
    token: string
  ): HttpRequest<unknown> {
    return request.clone({
      setHeaders: { Authorization: 'Bearer ' + token },
    });
  }
};
