import { VerifyTokenComponent } from './verify-token/verify-token.component';
import { UnAuthorizedComponent } from './un-authorized/un-authorized.component';
import { ResetRequestComponent } from './reset-request/reset-request.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { RegisterComponent } from './register/register.component';
import { LoginComponent, LogoutComponent } from './login/login.component';
import { AuthLayoutComponent } from './auth-layout/auth-layout.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthComponent } from './auth.component';

const routes: Routes = [
  {
    path: '',
    component: AuthLayoutComponent,
    children: [
      {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full',
      },
      // {
      //   path: '',
      //   component: AuthComponent,
      //   data: { breadcrumb: 'Auth' , roles: []}
      // },
      {
        path: 'login',
        component: LoginComponent,
        data: { breadcrumb: 'Login' , roles: []}
      },
      {
        path: 'logout',
        component: LogoutComponent,
        data: { breadcrumb: 'Logout' , roles: []}
      },
      {
        path: 'register',
        component: RegisterComponent,
        data: { breadcrumb: 'Register' , roles: []}
      },
      {
        path: 'reset-request',
        component: ResetRequestComponent,
        data: { breadcrumb: 'Reset Request' , roles: []}
      },
      {
        path: 'reset-password/:email/:token',
        component: ResetPasswordComponent,
        data: { breadcrumb: 'Reset Password' , roles: []}
      },
      {
        path: 'un-authorized',
        component: UnAuthorizedComponent,
        data: { breadcrumb: 'Un-Authorized' , roles: []}
      },
      {
        path: 'verify-token/:token',
        component: VerifyTokenComponent,
        data: { breadcrumb: 'Verify Token' , roles: []}
      },
      { path: 'verify/:token', component: VerifyTokenComponent, pathMatch: 'full', data: { breadcrumb: 'verification' } },
    ],
    data: { breadcrumb: 'Auth' , roles: []},
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule { }
