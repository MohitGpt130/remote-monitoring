import { SfwModulesModule } from './../../_modules/sfw-modules/sfw-modules.module';
import { ScreenfullService } from '@ngx-extensions/screenfull';
import { SharedModule } from './../../_shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardLayoutRoutingModule } from './dashboard-layout-routing.module';
import { DashboardLayoutComponent } from './dashboard-layout.component';

@NgModule({
  declarations: [DashboardLayoutComponent],
  imports: [CommonModule, DashboardLayoutRoutingModule, SfwModulesModule, SharedModule],
  exports: [DashboardLayoutComponent],
  providers:[
    ScreenfullService
  ]
})
export class DashboardLayoutModule {}
