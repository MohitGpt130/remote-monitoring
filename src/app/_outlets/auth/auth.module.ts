import { SharedModule } from './../../_shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthRoutingModule } from './auth-routing.module';
import { AuthComponent } from './auth.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { ResetRequestComponent } from './reset-request/reset-request.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { UnauthorizeAccessComponent } from './unauthorize-access/unauthorize-access.component';
import { VerifyTokenComponent } from './verify-token/verify-token.component';


@NgModule({
  declarations: [AuthComponent, LoginComponent, RegisterComponent, ResetRequestComponent, ResetPasswordComponent, UnauthorizeAccessComponent, VerifyTokenComponent],
  imports: [
    CommonModule,
    AuthRoutingModule,

    SharedModule,
  ]
})
export class AuthModule { }
