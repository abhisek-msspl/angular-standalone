import {
  HttpEvent,
  HttpRequest,
  HttpHandlerFn,
  HttpInterceptorFn,
} from '@angular/common/http';
import { Observable } from 'rxjs';

export const httpHeaderHandlerInterceptorFn: HttpInterceptorFn = (
  request: HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> => {
  /* Adding Authorization token in header */
  const headersConfig: { Authorization?: string } = {};

  /* If token found setting it in header */
  const token = 'test token';

  /**
   * If token available set headers
   *
   * @developer Abhisek Dhua
   */
  if (token) {
    headersConfig['Authorization'] = 'Bearer ' + token;
  }

  const HTTPRequest = request.clone({ setHeaders: headersConfig });
  return next(HTTPRequest);
};
