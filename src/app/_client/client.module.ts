import { SfwModulesModule } from './../_modules/sfw-modules/sfw-modules.module';
import { ClientService } from './client.service';
import { ClientRoutingModule } from './client-routing.module';
import { ClientComponent } from './client.component';
import { IntasModule } from './_components/intas.module';
import { AuthModule } from './auth/auth.module';
import { AdminModule } from './admin/admin.module';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { HTTP_INTERCEPTORS } from '@angular/common/http';

import {
  ConnectionService,
} from './connection.service';
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';
import { ThemeService } from './theme.service';
import { ApiInterceptor } from './api.interceptor';

import { SharedModule } from './shared/shared.module';
import { AppSettings } from './app.settings';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [
    ClientComponent,
  ],
  imports: [
    BrowserModule,
    CommonModule,

    ClientRoutingModule,
    BrowserAnimationsModule,

    MatToolbarModule,
    MatIconModule,
    SocketIoModule,

    SfwModulesModule,
    SharedModule,

    AuthModule,
    AdminModule,

    IntasModule,
  ],
  providers: [
    AppSettings,
    ThemeService,
    ClientService,
    // ConnectionSocket,
    ConnectionService,
    {provide: HTTP_INTERCEPTORS, useClass: ApiInterceptor, multi: true}
  ],
  bootstrap: [ClientComponent]
})
export class ClientModule { }
