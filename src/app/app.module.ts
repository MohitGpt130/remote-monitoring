import { ClientModule } from './_client/client.module';
import { ThemeService } from './theme.service';
import { TvLayoutModule } from './_layouts/tv-layout/tv-layout.module';
import { SfwLayoutModule } from './_layouts/sfw-layout/sfw-layout.module';
import { DynamicLayoutModule } from './_layouts/dynamic-layout/dynamic-layout.module';
import { DashboardLayoutModule } from './_layouts/dashboard-layout/dashboard-layout.module';
import { TvScreenModule } from './_outlets/tv-screen/tv-screen.module';
import { SetupModule } from './_outlets/setup/setup.module';
import { ScheduleModule } from './_outlets/schedule/schedule.module';
import { PlantActivityModule } from './_outlets/plant-activity/plant-activity.module';
import { MasterModule } from './_outlets/master/master.module';
import { EventsAnalysisModule } from './_outlets/events-analysis/events-analysis.module';
import { AdminModule } from './_outlets/admin/admin.module';
import { MeModule } from './_outlets/me/me.module';
import { AuthModule } from './_outlets/auth/auth.module';
import { SharedModule } from './_shared/shared.module';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NotFoundComponent } from './_outlets/not-found/not-found.component';

@NgModule({
  declarations: [
    AppComponent,
    NotFoundComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,

    ClientModule,
    SharedModule,

    DashboardLayoutModule,
    DynamicLayoutModule,
    SfwLayoutModule,
    TvLayoutModule,

    AuthModule,
    MeModule,
    AdminModule,
    EventsAnalysisModule,
    MasterModule,
    PlantActivityModule,
    ScheduleModule,
    SetupModule,
    TvScreenModule,
  ],
  providers: [
    ThemeService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
