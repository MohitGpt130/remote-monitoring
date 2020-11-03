import { SfwModulesModule } from './../_modules/sfw-modules/sfw-modules.module';
import { LoaderService } from './interceptors/api/loader.service';
import { HttpCancelService } from './interceptors/http-cancel/http-cancel.service';
import { ApiInterceptor } from './interceptors/api/api.interceptor';
import { HttpErrorInterceptor } from './interceptors/http-error/http-error.interceptor';
import { HttpCancelInterceptor } from './interceptors/http-cancel/http-cancel.interceptor';
import { RouterModule } from '@angular/router';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { PipesModule } from './pipes/pipes.module';
import { MaterialModules } from './modules';
import { OverlayContainer } from '@angular/cdk/overlay';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { NgMarqueeModule } from 'ng-marquee';
import { LoggerModule, NgxLoggerLevel } from 'ngx-logger';
import { NgxSpinnerModule } from 'ngx-spinner';
import { SocketIoModule } from 'ngx-socket-io';
import {
  PerfectScrollbarModule,
  PERFECT_SCROLLBAR_CONFIG,
  PerfectScrollbarConfigInterface,
} from 'ngx-perfect-scrollbar';


import { CarouselModule } from 'ngx-owl-carousel-o';
import { RandomcolorModule } from 'angular-randomcolor';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { MatVideoModule } from 'mat-video';

import { CustomOverlayContainer } from './utilities/custom-overlay-container';

import { DrawerComponent } from './components/drawer/drawer.component';
import { HeaderComponent } from './components/header/header.component';
import { NotificationsComponent } from './components/notifications/notifications.component';
import { FooterComponent } from './components/footer/footer.component';
import { MenuListComponent } from './components/drawer/menu-list/menu-list.component';
import { UserInfoComponent } from './components/drawer/user-info/user-info.component';
import { CompanyLogoComponent } from './components/drawer/company-logo/company-logo.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { ApplicationsComponent } from './components/header/applications/applications.component';
import { UserMenuComponent } from './components/header/user-menu/user-menu.component';
import { SearchComponent } from './components/header/search/search.component';
import { BreadcrumbComponent } from './components/breadcrumb/breadcrumb.component';
import { ConnectionStatusComponent } from './components/header/connection-status/connection-status.component';
import { LoaderComponent } from './components/loader/loader.component';
import { MessageBoardComponent } from './components/message-board/message-board.component';
import { NavigationBarComponent } from './components/navigation-bar/navigation-bar.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NotificationSidebarComponent } from './components/sidebar/notification-sidebar/notification-sidebar.component';
import { SettingsSidebarComponent } from './components/sidebar/settings-sidebar/settings-sidebar.component';
import { EventsSidebarComponent } from './components/sidebar/events-sidebar/events-sidebar.component';
import { ChatsSidebarComponent } from './components/sidebar/chats-sidebar/chats-sidebar.component';

import { Ng2GoogleChartsModule } from 'ng2-google-charts';
import { NgInitDirective } from './directives/ng-init.directive';
import { ToastrModule } from 'ngx-toastr';

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true,
};

@NgModule({
  declarations: [
    NgInitDirective,

    DrawerComponent, HeaderComponent, FooterComponent, MenuListComponent, UserInfoComponent,
    CompanyLogoComponent, SidebarComponent, NotificationsComponent, ApplicationsComponent, UserMenuComponent,
    SearchComponent, BreadcrumbComponent,
    ConnectionStatusComponent,
    LoaderComponent,
    MessageBoardComponent,
    NavigationBarComponent,
    NotificationSidebarComponent,
    SettingsSidebarComponent,
    EventsSidebarComponent,
    ChatsSidebarComponent,

  ],
  imports: [
    CommonModule,

    HttpClientModule,
    RouterModule,

    MaterialModules,
    FlexLayoutModule,
    NgMarqueeModule,
    LoggerModule.forRoot({
      serverLoggingUrl: '/api/logs',
      level: NgxLoggerLevel.DEBUG,
      serverLogLevel: NgxLoggerLevel.ERROR,
    }),
    NgxSpinnerModule,
    PipesModule,
    SocketIoModule,
    PerfectScrollbarModule,
    NgxChartsModule,
    CarouselModule,
    RandomcolorModule,
    Ng2GoogleChartsModule,
    MatVideoModule,
    ToastrModule.forRoot(),

    FormsModule,
    ReactiveFormsModule,
  ],
  exports: [
    NgInitDirective,

    DrawerComponent,
    HeaderComponent,
    FooterComponent,
    MenuListComponent,
    UserInfoComponent,
    CompanyLogoComponent,
    SidebarComponent,
    NotificationsComponent,
    ApplicationsComponent,
    UserMenuComponent,
    SearchComponent,
    BreadcrumbComponent,
    ConnectionStatusComponent,
    LoaderComponent,
    MessageBoardComponent,
    NavigationBarComponent,
    NotificationSidebarComponent,
    SettingsSidebarComponent,
    EventsSidebarComponent,
    ChatsSidebarComponent,

    HttpClientModule,
    RouterModule,

    MaterialModules,
    FlexLayoutModule,
    NgMarqueeModule,
    LoggerModule,
    NgxSpinnerModule,
    PipesModule,
    SocketIoModule,
    PerfectScrollbarModule,
    NgxChartsModule,
    CarouselModule,
    RandomcolorModule,
    Ng2GoogleChartsModule,
    MatVideoModule,
    ToastrModule,

    FormsModule,
    ReactiveFormsModule,

  ],
  providers: [
    HttpCancelService,
    LoaderService,
    { provide: OverlayContainer, useClass: CustomOverlayContainer },
    {
      provide: PERFECT_SCROLLBAR_CONFIG,
      useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpCancelInterceptor,
      multi: true,
    },
    { provide: HTTP_INTERCEPTORS, useClass: HttpErrorInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ApiInterceptor, multi: true },
  ],
})
export class SharedModule {}
