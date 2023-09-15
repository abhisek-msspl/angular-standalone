import { Routes } from '@angular/router';

export const adminPagesRoutes: Routes = [
  {
    path: 'dashboard',
    pathMatch: 'full',
    redirectTo: '',
  },
  {
    path: '',
    loadComponent: () =>
      import('./components/dashboard/dashboard.component').then(
        c => c.DashboardComponent
      ),
  },
];
