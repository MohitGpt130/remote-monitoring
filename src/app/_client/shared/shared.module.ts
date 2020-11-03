import { DirectivesModule } from './directives/directives.module';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { DurationToTime } from './pipes/duration2time/duration2time.pipe';
import { MatVideoModule } from 'mat-video';

import {
  NgModule,
  Pipe,
  PipeTransform,
  LOCALE_ID,
  Inject,
  Injector,
  Directive,
  Output,
  EventEmitter,
  OnInit,
  HostBinding,
  HostListener,
  Input,
  OnChanges,
} from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { MaterialModules } from './material-modules';
import { NgxSpinnerModule } from 'ngx-spinner';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FlexLayoutModule } from '@angular/flex-layout';
import { NgPipesModule } from 'ngx-pipes';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PipesModule } from './pipes/pipes.module';
// import { DateAdapter } from '@angular/material/core';
import { SidenavComponent } from './components/sidenav/sidenav.component';
import { VerticalMenuComponent } from './components/menu/vertical-menu/vertical-menu.component';
import { HorizontalMenuComponent } from './components/menu/horizontal-menu/horizontal-menu.component';
import { BreadcrumbComponent } from './components/breadcrumb/breadcrumb.component';
import { ApplicationsComponent } from './components/applications/applications.component';
import { MessagesComponent } from './components/messages/messages.component';
import { UserMenuComponent } from './components/user-menu/user-menu.component';

import { PERFECT_SCROLLBAR_CONFIG } from 'ngx-perfect-scrollbar';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';

import { CalendarModule, DateAdapter } from 'angular-calendar';

import { OverlayContainer } from '@angular/cdk/overlay';
import { CustomOverlayContainer } from './utils/custom-overlay-container';

import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';

import { AgmCoreModule } from '@agm/core';
import { DashboardLayoutComponent } from './layouts/dashboard-layout/dashboard-layout.component';
import { TvScreenLayoutComponent } from './layouts/tv-screen-layout/tv-screen-layout.component';
import { RouterModule } from '@angular/router';

import { NgxScreenfullModule } from '@ngx-extensions/screenfull';
import { ErrorInterceptor } from './error.interceptor';

import { WaMatConfirmDialogModule } from '@webacad/material-confirm-dialog';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';

import { NgxPaginationModule } from 'ngx-pagination';
import { TimeZoneMenuComponent } from './components/time-zone-menu/time-zone-menu.component';

import { ToastrModule } from 'ngx-toastr';

import { RandomcolorModule } from 'angular-randomcolor';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { SfwLayoutComponent } from './layouts/sfw-layout/sfw-layout.component';
import { DynamicLayoutComponent } from './layouts/dynamic-layout/dynamic-layout.component';
import { Ng2GoogleChartsModule } from 'ng2-google-charts';
import { SfwHeaderComponent } from './components/sfw-header/sfw-header.component';

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true,
};

@Directive({
  selector: '[ngInit]',
})
export class NgInitDirective implements OnInit {
  @Output()
  ngInit: EventEmitter<any> = new EventEmitter();

  ngOnInit(): void {
    this.ngInit.emit();
  }
}

export const MY_MOMENT_FORMATS = {
  parseInput: 'l LT',
  fullPickerInput: 'l LT',
  datePickerInput: 'l',
  timePickerInput: 'LT',
  monthYearLabel: 'MMM YYYY',
  dateA11yLabel: 'LL',
  monthYearA11yLabel: 'MMMM YYYY',
};

@Directive({
  selector: 'a[target="_blank"]'
})
export class ExternalLinkDirective implements OnChanges {
  @HostBinding('attr.target') targetAttr = '';
  @HostBinding('attr.href') hrefAttr = '';
  @HostListener('click') Click() {
    // this.targetAttr = '_blank';
    console.log(this.routerLink);
    window.location.replace("/#" + this.routerLink[0]);
    // window.open(this.routerLink[0], '_blank'); window.setTimeout(() => {window.close(); }, 500)
    location.reload();
    console.log('targetclicked')
  }

  @Input() href: string;
  @Input() routerLink: string;


  ngOnChanges() {
    this.hrefAttr = this.href;
    // console.log(this.routerLink);

    // if (this.isLinkExternal()) {
    //   this.targetAttr = '_blank';
    // }
  }

  // private isLinkExternal() {
  //   return !this.href.includes(location.hostname);
  // }
}

@NgModule({
  declarations: [
    // BlankComponent,
    // SearchComponent,
    // NotFoundComponent,
    // ErrorComponenr,
    SidenavComponent,
    VerticalMenuComponent,
    HorizontalMenuComponent,
    BreadcrumbComponent,
    TimeZoneMenuComponent,

    ApplicationsComponent,
    MessagesComponent,
    UserMenuComponent,
    DashboardLayoutComponent,
    TvScreenLayoutComponent,
    SfwLayoutComponent,
    DynamicLayoutComponent,

    ExternalLinkDirective,

    SfwHeaderComponent,
    // ExtendDatePipe,
  ],
  imports: [
    CommonModule,

    DirectivesModule,

    MaterialModules,
    NgxSpinnerModule,
    HttpClientModule,
    FlexLayoutModule,
    NgxScreenfullModule,
    NgPipesModule,
    RouterModule,

    Ng2GoogleChartsModule,
    // SocketIoModule.forRoot(config),
    FormsModule,
    ReactiveFormsModule,
    NgxMaterialTimepickerModule,

    MatVideoModule,

    // OwlDateTimeModule,
    // OwlNativeDateTimeModule,
    // NgxDatetimeRangePickerModule.forRoot(),
    // NgxTrimDirectiveModule,
    // NgxDatatableModule,
    // MatSelectFilterModule,

    FormsModule,
    ReactiveFormsModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyDLf9Ywk47zipEtorDewwMmB3JtuXdzYL4',
    }),

    WaMatConfirmDialogModule,
    ToastrModule.forRoot(),

    RandomcolorModule,
    CarouselModule,
    NgxChartsModule,

    PerfectScrollbarModule,
    NgxPaginationModule,
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory,
    }),
    PipesModule,
  ],
  exports: [
    SidenavComponent,
    VerticalMenuComponent,
    HorizontalMenuComponent,
    BreadcrumbComponent,
    TimeZoneMenuComponent,

    ApplicationsComponent,
    MessagesComponent,
    UserMenuComponent,
    DashboardLayoutComponent,
    TvScreenLayoutComponent,

    RouterModule,
    NgxScreenfullModule,
    NgxPaginationModule,
    ToastrModule,

    MaterialModules,
    PerfectScrollbarModule,
    NgxSpinnerModule,
    HttpClientModule,
    FlexLayoutModule,
    NgPipesModule,

    WaMatConfirmDialogModule,

    FormsModule,
    ReactiveFormsModule,
    PipesModule,

    RandomcolorModule,
    CarouselModule,
    NgxChartsModule,

    DirectivesModule,
    Ng2GoogleChartsModule,
  ],
  providers: [
    {
      provide: PERFECT_SCROLLBAR_CONFIG,
      useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG,
    },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    { provide: OverlayContainer, useClass: CustomOverlayContainer },

    DatePipe, DurationToTime,
    // {provide: OWL_DATE_TIME_LOCALE, useValue: 'en-IN'},
    // ExtendDatePipe,
  ],
  entryComponents: [VerticalMenuComponent],
})
export class SharedModule {}
