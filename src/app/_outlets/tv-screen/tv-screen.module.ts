import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TvScreenRoutingModule } from './tv-screen-routing.module';
import { TvScreenComponent } from './tv-screen.component';
import { SlideShowComponent } from './slide-show/slide-show.component';


@NgModule({
  declarations: [TvScreenComponent, SlideShowComponent],
  imports: [
    CommonModule,
    TvScreenRoutingModule
  ]
})
export class TvScreenModule { }
