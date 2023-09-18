import {
  httpErrorHandlerInterceptorFn,
  httpHeaderHandlerInterceptorFn,
  httpSuccessHandlerInterceptorFn,
} from '@core/interceptors';
import { provideHttpClient, withInterceptors } from '@angular/common/http';

// Method A:
// export const HttpProviders = [
//   // the old way
//   // importProvidersFrom(HttpClientModule),
//   // the new way
//   provideHttpClient(
//     // do this, to keep using your class-based interceptors.
//     withInterceptorsFromDi()
//   ),
//   {
//     provide: HTTP_INTERCEPTORS,
//     useClass: TestInterceptor,
//     multi: true,
//   }
// ];

// the better way (more future proof) is to use interceptor functions
// Method B
export const HttpProviders = [
  provideHttpClient(
    // do this, to keep using your class-based interceptors.
    withInterceptors([
      httpErrorHandlerInterceptorFn,
      httpHeaderHandlerInterceptorFn,
      httpSuccessHandlerInterceptorFn,
    ])
  ),
];
