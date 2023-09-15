import { Routes } from '@angular/router';

export const authPagesRoutes: Routes = [
  {
    path: 'login',
    pathMatch: 'full',
    redirectTo: '',
  },
  {
    path: '',
    title: 'Login',
    loadComponent: () =>
      import('./components/login/login.component').then(c => c.LoginComponent),
  },
  {
    path: 'signup',
    title: 'Signup',
    loadComponent: () =>
      import('./components/signup/signup.component').then(
        c => c.SignupComponent
      ),
  },
  {
    path: 'otp',
    title: 'Otp',
    loadComponent: () =>
      import('./components/otp/otp.component').then(c => c.OtpComponent),
  },
  {
    path: 'forget-password',
    title: 'Forget Password',
    loadComponent: () =>
      import('./components/forget-password/forget-password.component').then(
        c => c.ForgetPasswordComponent
      ),
  },
  {
    path: 'reset-password',
    title: 'Reset Password',
    loadComponent: () =>
      import('./components/reset-password/reset-password.component').then(
        c => c.ResetPasswordComponent
      ),
  },
];
