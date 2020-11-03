import { AuthLayoutModule } from './auth-layout/auth-layout.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthRoutingModule } from './auth-routing.module';
import { AuthComponent } from './auth.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { ResetRequestComponent } from './reset-request/reset-request.component';
import { UnAuthorizedComponent } from './un-authorized/un-authorized.component';
import { VerifyTokenComponent } from './verify-token/verify-token.component';
import { SharedModule } from '../shared/shared.module';
import { AuthService } from './auth.service';

@NgModule({
  declarations: [
    AuthComponent, LoginComponent, RegisterComponent,
    ResetPasswordComponent, ResetRequestComponent,
    UnAuthorizedComponent, VerifyTokenComponent
  ],
  imports: [
    CommonModule,
    AuthRoutingModule,

    SharedModule,
    AuthLayoutModule,
  ],
  exports: [
    SharedModule,
  ],
  providers: [
    AuthService,
  ]

})
export class AuthModule { }
