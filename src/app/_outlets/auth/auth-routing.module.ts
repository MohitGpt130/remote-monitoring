import { UnauthorizeAccessComponent } from './unauthorize-access/unauthorize-access.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { VerifyTokenComponent } from './verify-token/verify-token.component';
import { ResetRequestComponent } from './reset-request/reset-request.component';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { AuthComponent } from './auth.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    component: AuthComponent,
    children: [
      {
        path: 'register',
        component: RegisterComponent,
        pathMatch: 'full',
      },
      {
        path: 'login',
        component: LoginComponent,
        pathMatch: 'full',
      },
      {
        path: 'reset-request',
        component: ResetRequestComponent,
        pathMatch: 'full',
      },
      {
        path: 'verify-token',
        component: VerifyTokenComponent,
        pathMatch: 'full',
      },
      {
        path: 'reset-password',
        component: ResetPasswordComponent,
        pathMatch: 'full',
      },
      {
        path: 'unauthorized-access',
        component: UnauthorizeAccessComponent,
        pathMatch: 'full',
      },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule { }
