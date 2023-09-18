import {
  HttpEvent,
  HttpRequest,
  HttpResponse,
  HttpHandlerFn,
  HttpInterceptorFn,
} from '@angular/common/http';
import { inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { EncryptionService } from '../services/encryption.service';

export const httpSuccessHandlerInterceptorFn: HttpInterceptorFn = (
  request: HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> => {
  const encryptedRequest = false;
  const _encryptionService = inject(EncryptionService);
  /* Intercepting api request */
  if (encryptedRequest && !(request.body instanceof FormData)) {
    // encrypt request before api call depending on environment setup
    (request.body as { [key: string]: any }) = {
      request: _encryptionService.encryptUsingAES256(
        request.body as { [key: string]: any }
      ),
    };
  }

  /* Intercepting success requests */
  return next(request).pipe(
    map((response: HttpEvent<any>) => {
      if (response instanceof HttpResponse) {
        const statusCode: number = response['status'];
        const responseObject = response.body;
        responseObject.status = statusCode;
        // decrypt response before subscribe if response was encrypted
        // if (typeof response.body.response.data === 'string') {
        //   responseObject.response = {
        //     ...response.body.response,
        //     data: this._encryptionService.decryptUsingAES256(
        //       response.body.response.data
        //     ),
        //   };
        // }
      }
      return response;
    })
  );
};
