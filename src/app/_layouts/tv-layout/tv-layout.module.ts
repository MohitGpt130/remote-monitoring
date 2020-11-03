import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TvLayoutRoutingModule } from './tv-layout-routing.module';
import { TvLayoutComponent } from './tv-layout.component';


@NgModule({
  declarations: [TvLayoutComponent],
  imports: [
    CommonModule,
    TvLayoutRoutingModule
  ]
})
export class TvLayoutModule { }
