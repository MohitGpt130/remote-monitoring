import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MeRoutingModule } from './me-routing.module';
import { ProfileComponent } from './profile/profile.component';
import { MeComponent } from './me.component';
import { SettingsComponent } from './settings/settings.component';
import { DashboardComponent } from './dashboard/dashboard.component';


@NgModule({
  declarations: [ProfileComponent, MeComponent, SettingsComponent, DashboardComponent],
  imports: [
    CommonModule,
    MeRoutingModule
  ]
})
export class MeModule { }
