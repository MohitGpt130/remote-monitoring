import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminLayoutRoutingModule } from './admin-layout-routing.module';
import { AdminLayoutComponent } from './admin-layout.component';
import { SharedModule } from '../../shared/shared.module';

@NgModule({
  declarations: [AdminLayoutComponent],
  imports: [
    CommonModule,
    SharedModule,
    AdminLayoutRoutingModule
  ],
  exports: [
    SharedModule,
  ]
})
export class AdminLayoutModule { }
