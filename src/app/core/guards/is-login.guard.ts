import {
  Router,
  UrlTree,
  CanActivateFn,
  RouterStateSnapshot,
  ActivatedRouteSnapshot,
} from '@angular/router';
import { Observable } from 'rxjs';
import { inject } from '@angular/core';
import { AuthenticationService } from '../authentication';

export const isLoginGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
):
  | Observable<boolean | UrlTree>
  | Promise<boolean | UrlTree>
  | boolean
  | UrlTree => {
  /**
   * *Auth Guard for prevent user to visit before login pages
   *
   * @developer Abhisek Dhua
   */
  const _router: Router = inject(Router);
  const _authService: AuthenticationService = inject(AuthenticationService);
  if (!_authService.isAuthenticated()) {
    _router.navigate(['/login']);
    return false;
  }
  return true;
};
