import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DynamicLayoutRoutingModule } from './dynamic-layout-routing.module';
import { DynamicLayoutComponent } from './dynamic-layout.component';


@NgModule({
  declarations: [DynamicLayoutComponent],
  imports: [
    CommonModule,
    DynamicLayoutRoutingModule
  ]
})
export class DynamicLayoutModule { }
