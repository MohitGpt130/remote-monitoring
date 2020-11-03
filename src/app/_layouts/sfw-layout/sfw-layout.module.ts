import { SfwModulesModule } from './../../_modules/sfw-modules/sfw-modules.module';
import { SharedModule } from './../../_shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SfwLayoutRoutingModule } from './sfw-layout-routing.module';
import { SfwLayoutComponent } from './sfw-layout.component';


@NgModule({
  declarations: [SfwLayoutComponent],
  imports: [
    CommonModule,
    SfwLayoutRoutingModule,

    SfwModulesModule, SharedModule
  ]
})
export class SfwLayoutModule { }
