import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SetupRoutingModule } from './setup-routing.module';
import { ApiSettingsComponent } from './api-settings/api-settings.component';
import { DashboardSettingsComponent } from './dashboard-settings/dashboard-settings.component';
import { TvSreenSettingsComponent } from './tv-sreen-settings/tv-sreen-settings.component';
import { LayoutSettingsComponent } from './layout-settings/layout-settings.component';
import { SetupComponent } from './setup.component';


@NgModule({
  declarations: [ApiSettingsComponent, DashboardSettingsComponent, TvSreenSettingsComponent, LayoutSettingsComponent, SetupComponent],
  imports: [
    CommonModule,
    SetupRoutingModule
  ]
})
export class SetupModule { }
