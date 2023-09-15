import { Routes } from '@angular/router';
import { hasNotLoginGuard, isLoginGuard } from '@core/guards';
import {
  WebLayoutComponent,
  // AuthLayoutComponent,
  // AdminLayoutComponent,
} from '@core/layouts';

export const routes: Routes = [
  {
    path: '',
    canActivate: [hasNotLoginGuard],
    // component: AuthLayoutComponent,
    loadComponent: () =>
      import(
        './core/layouts/auth-layouts/auth-layout/auth-layout.component'
      ).then(c => c.AuthLayoutComponent),
    loadChildren: () =>
      import('./pages/auth-pages/auth-pages.routes').then(
        r => r.authPagesRoutes
      ),
  },
  {
    path: '',
    canActivate: [isLoginGuard],
    // component: AdminLayoutComponent,
    loadComponent: () =>
      import(
        './core/layouts/admin-layouts/admin-layout/admin-layout.component'
      ).then(c => c.AdminLayoutComponent),
    loadChildren: () =>
      import('./pages/admin-pages/admin-pages.routes').then(
        r => r.adminPagesRoutes
      ),
  },
  {
    path: '',
    canActivate: [isLoginGuard],
    component: WebLayoutComponent,
    loadChildren: () =>
      import('./pages/web-pages/web-pages.routes').then(r => r.webPagesRoutes),
  },
];
